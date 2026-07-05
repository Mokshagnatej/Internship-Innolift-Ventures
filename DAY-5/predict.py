from __future__ import annotations

import pickle
from pathlib import Path

import pandas as pd

from model import ARCHIVE_DIR, MODEL_PATH, build_prediction_frame


SAMPLE_CASES = [
    ARCHIVE_DIR / "artificialNoAnomaly" / "artificialNoAnomaly" / "art_daily_no_noise.csv",
    ARCHIVE_DIR / "artificialWithAnomaly" / "artificialWithAnomaly" / "art_daily_jumpsup.csv",
    ARCHIVE_DIR / "realAWSCloudwatch" / "realAWSCloudwatch" / "ec2_cpu_utilization_24ae8d.csv",
]


def load_bundle() -> dict:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"{MODEL_PATH} is missing. Run `python train.py` first to create the model bundle."
        )

    with open(MODEL_PATH, "rb") as file_handle:
        return pickle.load(file_handle)


def predict_cases() -> pd.DataFrame:
    bundle = load_bundle()
    model = bundle["model"]
    feature_columns = bundle["feature_columns"]

    results = []

    for index, case in enumerate(SAMPLE_CASES, start=1):
        if not case.exists():
            raise FileNotFoundError(f"Sample archive file not found: {case}")

        window_frame = build_prediction_frame(case)
        predictions = model.predict(window_frame[feature_columns])
        anomaly_rate = float(predictions.mean())
        majority_prediction = int(anomaly_rate >= 0.5)
        label = "anomaly" if majority_prediction == 1 else "normal"
        print(f"Case {index}: {case.name} -> {label} (anomaly windows: {anomaly_rate:.2%})")
        results.append(
            {
                "file": case.name,
                "path": str(case),
                "prediction": majority_prediction,
                "prediction_label": label,
                "anomaly_window_rate": anomaly_rate,
                "window_count": int(len(window_frame)),
            }
        )

    return pd.DataFrame(results)


if __name__ == "__main__":
    result = predict_cases()
    print("\nPrediction summary:\n", result)