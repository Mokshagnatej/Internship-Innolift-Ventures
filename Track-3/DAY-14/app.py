import pickle
import numpy as np
from flask import Flask, request, render_template

app = Flask(__name__)

# Load the trained model
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

# Define the features exactly as expected by the model
FEATURES = [
    'window_length', 'duration_minutes', 'sampling_interval_minutes',
    'value_mean', 'value_std', 'value_min', 'value_max', 'value_median',
    'value_q25', 'value_q75', 'value_range', 'value_iqr', 'value_first',
    'value_last', 'value_trend', 'value_abs_diff_mean', 'value_abs_diff_std',
    'value_max_jump', 'value_energy', 'peak_to_mean_ratio'
]

@app.route('/')
def index():
    return render_template('index.html', features=FEATURES, prediction=None)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Extract features from form submission
        input_data = []
        for feature in FEATURES:
            val = request.form.get(feature)
            input_data.append(float(val) if val else 0.0)

        # Reshape for prediction
        input_array = np.array(input_data).reshape(1, -1)

        # Make prediction
        prediction_val = model.predict(input_array)[0]
        
        # Determine the result message
        if prediction_val == 1:
            prediction_text = "Anomaly Detected! 🚨"
            status_class = "danger"
        else:
            prediction_text = "System Operating Normally ✅"
            status_class = "success"

        return render_template('index.html', features=FEATURES, prediction=prediction_text, status_class=status_class, submitted_data=request.form)

    except Exception as e:
        return render_template('index.html', features=FEATURES, prediction=f"Error: {str(e)}", status_class="warning")

if __name__ == '__main__':
    app.run(debug=True)
