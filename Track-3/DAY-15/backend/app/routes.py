from flask import Blueprint, render_template, request, current_app, jsonify
import sqlite3
import datetime
import pickle
import numpy as np
import os

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

def get_resources_db_connection():
    db_path = os.path.join(current_app.root_path, '..', 'data', 'server_resources.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)')
    conn.execute('INSERT OR IGNORE INTO settings (key, value) VALUES ("auto_detect", "true")')
    conn.commit()
    return conn

@bp.route('/api/settings/auto-detect', methods=['GET'])
def get_auto_detect():
    try:
        conn = get_resources_db_connection()
        row = conn.execute('SELECT value FROM settings WHERE key="auto_detect"').fetchone()
        conn.close()
        is_enabled = True if row and row['value'] == 'true' else False
        return jsonify({"enabled": is_enabled})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/api/settings/auto-detect', methods=['POST'])
def set_auto_detect():
    try:
        data = request.json
        is_enabled = 'true' if data.get('enabled') else 'false'
        conn = get_resources_db_connection()
        conn.execute('UPDATE settings SET value=? WHERE key="auto_detect"', (is_enabled,))
        conn.commit()
        conn.close()
        return jsonify({"status": "success", "enabled": data.get('enabled')})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/api/resources', methods=['GET'])
def get_resources():
    try:
        conn = get_resources_db_connection()
        resources = conn.execute('SELECT * FROM resource_metrics ORDER BY timestamp DESC').fetchall()
        conn.close()
        return jsonify([dict(row) for row in resources])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/api/resources', methods=['POST'])
def add_resource():
    try:
        data = request.json
        conn = get_resources_db_connection()
        
        timestamp = datetime.datetime.now().isoformat()
        
        conn.execute(
            'INSERT INTO resource_metrics (model_name, cpu_usage, memory_usage, network_io, disk_io, anomaly_detected, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (data['model_name'], float(data['cpu_usage']), float(data['memory_usage']), float(data['network_io']), float(data['disk_io']), bool(data.get('anomaly_detected', False)), timestamp)
        )
        conn.commit()
        conn.close()
        return jsonify({"status": "success"}), 201
    except Exception as e:
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
