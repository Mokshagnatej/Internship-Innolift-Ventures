from flask import Blueprint, render_template, request, current_app, jsonify
import sqlite3
import datetime
import pickle
import numpy as np
import os
import secrets
from flask_mail import Message
from app import db, mail
from app.models import User, ResourceMetric, SystemSettings

bp = Blueprint('main', __name__)

FEATURES = [
    'window_length', 'duration_minutes', 'sampling_interval_minutes',
    'value_mean', 'value_std', 'value_min', 'value_max', 'value_median',
    'value_q25', 'value_q75', 'value_range', 'value_iqr', 'value_first',
    'value_last', 'value_trend', 'value_abs_diff_mean', 'value_abs_diff_std',
    'value_max_jump', 'value_energy', 'peak_to_mean_ratio'
]

# Grouped features for UI rendering
FEATURE_GROUPS = {
    'Time Window Settings': ['window_length', 'duration_minutes', 'sampling_interval_minutes'],
    'Value Statistics': ['value_mean', 'value_std', 'value_min', 'value_max', 'value_median', 'value_q25', 'value_q75', 'value_range', 'value_iqr'],
    'Temporal Dynamics': ['value_first', 'value_last', 'value_trend', 'value_abs_diff_mean', 'value_abs_diff_std', 'value_max_jump', 'value_energy', 'peak_to_mean_ratio']
}

_model = None

def load_artifacts():
    global _model
    if _model is None:
        with open(current_app.config['MODEL_PATH'], 'rb') as f:
            _model = pickle.load(f)
    return _model

def get_db_connection():
    db_path = os.path.join(current_app.root_path, '..', 'data', 'expense.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

@bp.route('/api/expenses', methods=['GET'])
def get_expenses():
    try:
        conn = get_db_connection()
        expenses = conn.execute('SELECT * FROM expenses ORDER BY expense_date DESC').fetchall()
        conn.close()
        return jsonify([dict(row) for row in expenses])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/api/expenses', methods=['POST'])
def add_expense():
    try:
        data = request.json
        conn = get_db_connection()
        
        if not all(k in data for k in ("title", "amount", "category")):
            return jsonify({"error": "Missing required fields"}), 400
            
        payment_mode = data.get("payment_mode", "AWS Account")
        expense_date = data.get("expense_date", datetime.date.today().isoformat())
        description = data.get("description", "")
        
        conn.execute(
            'INSERT INTO expenses (title, amount, category, payment_mode, expense_date, description) VALUES (?, ?, ?, ?, ?, ?)',
            (data['title'], float(data['amount']), data['category'], payment_mode, expense_date, description)
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "success"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/api/invite', methods=['POST'])
def invite_user():
    try:
        data = request.json
        email = data.get('email')
        role = data.get('role', 'viewer')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
            
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User already exists"}), 400
            
        # Create a pending user with a random temporary password
        temp_password = secrets.token_urlsafe(12)
        new_user = User(email=email, role=role, status='pending')
        new_user.set_password(temp_password)
        db.session.add(new_user)
        db.session.commit()
        
        # Send invitation email
        invite_link = f"http://localhost:5173/login?email={email}"
        msg = Message("You've been invited to CloudWatch Anomaly Predictor!", recipients=[email])
        msg.html = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #080b12; color: #fff; border-radius: 10px;">
            <h2 style="color: #00d9ff; text-align: center;">Welcome to CloudWatch Anomaly Predictor</h2>
            <p style="color: #ccc; font-size: 16px;">You have been invited to join the team as a <strong>{role.title()}</strong>.</p>
            <p style="color: #ccc; font-size: 16px;">Your temporary password is: <span style="background-color: #1e293b; padding: 5px 10px; border-radius: 5px; font-family: monospace; color: #fff;">{temp_password}</span></p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{invite_link}" style="background-color: #00d9ff; color: #080b12; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Sign In Now</a>
            </div>
            <p style="color: #888; font-size: 12px; text-align: center;">Please change your password after your first login.</p>
        </div>
        """
        
        try:
            mail.send(msg)
        except Exception as mail_err:
            print("Failed to send email:", mail_err)
            return jsonify({"error": "User created but email failed to send. Please check your SMTP configuration."}), 500

        return jsonify({"status": "success", "message": f"Invitation sent successfully to {email}"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        user_list = []
        for u in users:
            user_list.append({
                "id": u.id,
                "email": u.email,
                "role": u.role.capitalize(),
                "status": u.status.capitalize()
            })
        return jsonify(user_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Update status from pending to active on first successful login
    if user.status == 'pending':
        user.status = 'active'
        db.session.commit()

    return jsonify({
        "status": "success",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "status": user.status
        }
    })

@bp.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "An account with this email already exists"}), 409

    try:
        new_user = User(email=email, role='viewer', status='active')
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "status": "success", 
            "message": "Account created successfully",
            "user": {
                "id": new_user.id,
                "email": new_user.email,
                "role": new_user.role,
                "status": new_user.status
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@bp.route('/', defaults={'path': ''})
@bp.route('/<path:path>')
def index(path):
    return render_template('index.html', feature_groups=FEATURE_GROUPS, submitted_data={})

@bp.route('/predict', methods=['POST'])
def predict():
    try:
        model = load_artifacts()

        input_data = []
        for feature in FEATURES:
            val = request.form.get(feature)
            input_data.append(float(val) if val else 0.0)

        input_array = np.array(input_data).reshape(1, -1)
        prediction_val = model.predict(input_array)[0]
        
        if prediction_val == 1:
            prediction_text = "Anomaly Detected! 🚨"
            status_class = "danger"
            
            # Automatically log this anomaly to the Server Metrics DB if auto-detect is ON
            try:
                conn = get_resources_db_connection()
                row = conn.execute('SELECT value FROM settings WHERE key="auto_detect"').fetchone()
                auto_detect_enabled = True if row and row['value'] == 'true' else False
                
                if auto_detect_enabled:
                    timestamp = datetime.datetime.now().isoformat()
                    # Generate realistic "high load" metrics for the anomaly
                    cpu_usage = round(85.0 + (np.random.rand() * 14.9), 1) # 85% to 99.9%
                    memory_usage = round(12.0 + (np.random.rand() * 4.0), 1) # 12GB to 16GB
                    network_io = round(150.0 + (np.random.rand() * 100.0), 1) # High network
                    disk_io = round(80.0 + (np.random.rand() * 50.0), 1) # High disk
                    
                    conn.execute(
                        'INSERT INTO resource_metrics (model_name, cpu_usage, memory_usage, network_io, disk_io, anomaly_detected, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
                        ("Live Telemetry Model", cpu_usage, memory_usage, network_io, disk_io, True, timestamp)
                    )
                    conn.commit()
                conn.close()
            except Exception as db_err:
                print("Failed to auto-log anomaly:", db_err)
                
        else:
            prediction_text = "System Operating Normally ✅"
            status_class = "success"

        return render_template('index.html', feature_groups=FEATURE_GROUPS, prediction=prediction_text, status_class=status_class, submitted_data=request.form)

    except Exception as e:
        return render_template('index.html', feature_groups=FEATURE_GROUPS, prediction=f"Error: {str(e)}", status_class="warning", submitted_data=request.form)


@bp.route('/api/resources', methods=['GET'])
def get_resources():
    metrics = ResourceMetric.query.order_by(ResourceMetric.timestamp.desc()).all()
    return jsonify([{
        'id': m.id,
        'model_name': m.model_name,
        'cpu_usage': m.cpu_usage,
        'memory_usage': m.memory_usage,
        'network_io': m.network_io,
        'disk_io': m.disk_io,
        'anomaly_detected': m.anomaly_detected,
        'timestamp': m.timestamp.isoformat()
    } for m in metrics]), 200

@bp.route('/api/resources', methods=['POST'])
def add_resource():
    data = request.get_json()
    new_metric = ResourceMetric(
        model_name=data.get('model_name'),
        cpu_usage=data.get('cpu_usage'),
        memory_usage=data.get('memory_usage'),
        network_io=data.get('network_io'),
        disk_io=data.get('disk_io'),
        anomaly_detected=data.get('anomaly_detected', False)
    )
    db.session.add(new_metric)
    db.session.commit()
    return jsonify({"message": "Metric added successfully"}), 201

@bp.route('/api/settings/auto-detect', methods=['GET'])
def get_auto_detect():
    setting = SystemSettings.query.filter_by(key='auto_detect').first()
    enabled = setting.value == 'true' if setting else True
    return jsonify({"enabled": enabled}), 200

@bp.route('/api/settings/auto-detect', methods=['POST'])
def set_auto_detect():
    data = request.get_json()
    enabled = data.get('enabled', True)
    
    setting = SystemSettings.query.filter_by(key='auto_detect').first()
    if setting:
        setting.value = 'true' if enabled else 'false'
    else:
        setting = SystemSettings(key='auto_detect', value='true' if enabled else 'false')
        db.session.add(setting)
        
    db.session.commit()
    return jsonify({"message": "Setting updated"}), 200
