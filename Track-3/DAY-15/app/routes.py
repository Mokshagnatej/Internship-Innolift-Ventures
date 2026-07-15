from flask import Blueprint, render_template, request, current_app
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

@bp.route('/')
def index():
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
        else:
            prediction_text = "System Operating Normally ✅"
            status_class = "success"

        return render_template('index.html', feature_groups=FEATURE_GROUPS, prediction=prediction_text, status_class=status_class, submitted_data=request.form)

    except Exception as e:
        return render_template('index.html', feature_groups=FEATURE_GROUPS, prediction=f"Error: {str(e)}", status_class="warning", submitted_data=request.form)
