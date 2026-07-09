from __future__ import annotations

import pickle
from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "saved_exam_score_model.pkl"


def build_sample_rows(feature_columns, feature_defaults):
    samples = []

    base_1 = dict(feature_defaults)
    base_1.update(
        {
            "Hours_Studied": 10,
            "Attendance": 65,
            "Previous_Scores": 58,
            "Tutoring_Sessions": 1,
            "Physical_Activity": 3,
            "Sleep_Hours": 7,
        }
    )
    samples.append(base_1)

    base_2 = dict(feature_defaults)
    base_2.update(
        {
            "Hours_Studied": 22,
            "Attendance": 82,
            "Previous_Scores": 74,
            "Tutoring_Sessions": 2,
            "Physical_Activity": 4,
            "Sleep_Hours": 6,
        }
    )
    samples.append(base_2)

    base_3 = dict(feature_defaults)
    base_3.update(
        {
            "Hours_Studied": 34,
            "Attendance": 94,
            "Previous_Scores": 88,
            "Tutoring_Sessions": 4,
            "Physical_Activity": 5,
            "Sleep_Hours": 8,
        }
    )
    samples.append(base_3)

    return pd.DataFrame(samples, columns=feature_columns)


def main() -> None:
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Saved model not found at {MODEL_PATH}. Run Matplotlib First ML Model.py first.")

    with open(MODEL_PATH, "rb") as model_file:
        payload = pickle.load(model_file)

    model = payload["model"]
    feature_columns = payload["feature_columns"]
    feature_defaults = payload["feature_defaults"]

    sample_rows = build_sample_rows(feature_columns, feature_defaults)
    predictions = model.predict(sample_rows)

    print("Predictions from saved model:")
    for index, prediction in enumerate(predictions, start=1):
        print(f"Student {index}: {prediction:.2f}")


if __name__ == "__main__":
    main()