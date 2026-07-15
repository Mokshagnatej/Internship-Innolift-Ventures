import os
import json
import pickle
import pandas as pd
import numpy as np

# Load model
model_path = os.path.join(os.path.dirname(__file__), '..', 'ml', 'artifacts', 'model.pkl')
with open(model_path, 'rb') as f:
    model = pickle.load(f)

features = [
    'window_length', 'duration_minutes', 'sampling_interval_minutes',
    'value_mean', 'value_std', 'value_min', 'value_max', 'value_median',
    'value_q25', 'value_q75', 'value_range', 'value_iqr', 'value_first',
    'value_last', 'value_trend', 'value_abs_diff_mean', 'value_abs_diff_std',
    'value_max_jump', 'value_energy', 'peak_to_mean_ratio'
]

# Create simulated cases (2 normal, 2 anomaly)
test_cases = [
    {
        "case_name": "Normal Server Load 1",
        "data": [60, 60, 1, 45.0, 2.1, 40.0, 50.0, 44.5, 42.0, 48.0, 10.0, 6.0, 42.0, 48.0, 0.05, 0.0, 0.5, 2.5, 3000.0, 1.0]
    },
    {
        "case_name": "Normal Server Load 2",
        "data": [60, 60, 1, 55.5, 3.5, 45.0, 65.0, 56.0, 50.0, 60.0, 20.0, 10.0, 50.0, 60.0, -0.02, 0.0, 0.6, 4.0, 4500.0, 1.0]
    },
    {
        "case_name": "High CPU Spike Anomaly",
        "data": [60, 60, 1, 95.0, 15.0, 50.0, 99.9, 98.0, 90.0, 99.0, 49.9, 9.0, 55.0, 99.5, 1.2, 8.5, 4.0, 35.0, 9500.0, 1.25]
    },
    {
        "case_name": "Erratic Memory Usage Anomaly",
        "data": [60, 60, 1, 88.0, 22.5, 20.0, 98.5, 92.0, 75.0, 96.0, 78.5, 21.0, 30.0, 98.0, -1.5, 12.0, 6.5, 45.0, 8900.0, 1.45]
    }
]

results = []

for case in test_cases:
    # Reshape for prediction
    input_array = np.array(case["data"]).reshape(1, -1)
    
    # Predict
    prediction = int(model.predict(input_array)[0])
    status = "Anomaly" if prediction == 1 else "Normal"
    
    result = {
        "case_name": case["case_name"],
        "prediction": status,
        "is_anomaly": bool(prediction)
    }
    # Add input metrics to result
    result.update({f: v for f, v in zip(features, case["data"])})
    results.append(result)

# Save to outputs directory
outputs_dir = os.path.join(os.path.dirname(__file__), '..', 'outputs')
os.makedirs(outputs_dir, exist_ok=True)

# Export JSON
with open(os.path.join(outputs_dir, 'batch_predictions.json'), 'w') as f:
    json.dump(results, f, indent=4)

# Export CSV
df = pd.DataFrame(results)
df.to_csv(os.path.join(outputs_dir, 'batch_predictions.csv'), index=False)

# Generate PNG charts
import matplotlib.pyplot as plt
import seaborn as sns

plt.figure(figsize=(12, 7))
sns.set_theme(style="darkgrid")

# Create a bar chart showing the CPU metric (value_mean) for each case
colors = ['#ef4444' if x else '#10b981' for x in df['is_anomaly']]
bars = plt.bar(df['case_name'], df['value_mean'], color=colors)

plt.title('CloudWatch Metrics: Mean CPU Value by Server State', fontsize=16, pad=15)
plt.ylabel('CPU Mean Value (%)', fontsize=12)
plt.xticks(rotation=15, ha='right', fontsize=11)
plt.ylim(0, 110)

# Add value labels on top of the bars
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval + 2, f"{yval:.1f}%", ha='center', va='bottom', fontweight='bold')

# Create custom legend
from matplotlib.patches import Patch
legend_elements = [Patch(facecolor='#10b981', label='Normal (Predicted)'),
                   Patch(facecolor='#ef4444', label='Anomaly (Predicted)')]
plt.legend(handles=legend_elements, loc='upper left')

plt.tight_layout()
plt.savefig(os.path.join(outputs_dir, 'predictions_chart.png'), dpi=300, bbox_inches='tight')

print(f"Batch predictions successfully generated in '{outputs_dir}' directory.")
