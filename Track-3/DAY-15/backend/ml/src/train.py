import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import pickle

print("Loading data...")
df = pd.read_csv("../../Track-1/DAY-5/data/dataset.csv")

# Ensure all 20 features and 1 target are present
features = [
    'window_length', 'duration_minutes', 'sampling_interval_minutes',
    'value_mean', 'value_std', 'value_min', 'value_max', 'value_median',
    'value_q25', 'value_q75', 'value_range', 'value_iqr', 'value_first',
    'value_last', 'value_trend', 'value_abs_diff_mean', 'value_abs_diff_std',
    'value_max_jump', 'value_energy', 'peak_to_mean_ratio'
]
X = df[features]
y = df['anomaly']

print("Training model...")
rf = RandomForestClassifier(n_estimators=50, random_state=42)
rf.fit(X, y)

print("Saving model...")
with open("model.pkl", "wb") as f:
    pickle.dump(rf, f)

print("Done!")
