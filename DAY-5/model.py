from __future__ import annotations

import argparse
import pickle
from pathlib import Path
from typing import Dict, List, Tuple

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


ROOT_DIR = Path(__file__).resolve().parent
DATA_DIR = ROOT_DIR / "data"
PLOTS_DIR = ROOT_DIR / "plots"
DATASET_PATH = DATA_DIR / "dataset.csv"
MODEL_PATH = ROOT_DIR / "model.pkl"
ARCHIVE_DIR = DATA_DIR / "archive"
WINDOW_SIZE = 48
WINDOW_STEP = 24


def ensure_directories() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PLOTS_DIR.mkdir(parents=True, exist_ok=True)


def load_timeseries_frame(file_path: Path) -> pd.DataFrame:
    frame = pd.read_csv(file_path)
    if "timestamp" not in frame.columns or "value" not in frame.columns:
        if frame.shape[1] < 2:
            raise ValueError(f"Expected timestamp/value columns in {file_path}")
        frame = frame.iloc[:, :2].copy()
        frame.columns = ["timestamp", "value"]

    frame = frame[["timestamp", "value"]].copy()
    frame["timestamp"] = pd.to_datetime(frame["timestamp"], errors="coerce")
    frame["value"] = pd.to_numeric(frame["value"], errors="coerce")
    frame = frame.dropna(subset=["timestamp", "value"]).sort_values("timestamp").reset_index(drop=True)
    return frame


def infer_label(file_path: Path) -> int:
    if "artificialNoAnomaly" in file_path.parts:
        return 0
    return 1


def iter_windows(frame: pd.DataFrame, window_size: int = WINDOW_SIZE, step_size: int = WINDOW_STEP) -> List[pd.DataFrame]:
    if len(frame) <= window_size:
        return [frame]

    windows: List[pd.DataFrame] = []
    start_indices = list(range(0, len(frame) - window_size + 1, step_size))
    for start_index in start_indices:
        windows.append(frame.iloc[start_index : start_index + window_size].copy())

    if windows and windows[-1].index[-1] != frame.index[-1]:
        windows.append(frame.iloc[-window_size:].copy())

    return windows


def extract_window_features(frame: pd.DataFrame, source_file: str, label: int) -> Dict[str, object]:
    values = frame["value"].astype(float)
    timestamps = frame["timestamp"]
    diffs = values.diff().dropna()
    value_range = values.max() - values.min()
    interarrival = timestamps.diff().dropna().dt.total_seconds().div(60.0)

    x_axis = np.arange(len(values), dtype=float)
    if len(values) > 1 and np.std(values.to_numpy()) > 0:
        trend = float(np.polyfit(x_axis, values.to_numpy(), 1)[0])
    else:
        trend = 0.0

    features: Dict[str, object] = {
        "window_length": int(len(frame)),
        "duration_minutes": float((timestamps.iloc[-1] - timestamps.iloc[0]).total_seconds() / 60.0) if len(frame) > 1 else 0.0,
        "sampling_interval_minutes": float(interarrival.median()) if not interarrival.empty else 0.0,
        "value_mean": float(values.mean()),
        "value_std": float(values.std(ddof=0)),
        "value_min": float(values.min()),
        "value_max": float(values.max()),
        "value_median": float(values.median()),
        "value_q25": float(values.quantile(0.25)),
        "value_q75": float(values.quantile(0.75)),
        "value_range": float(value_range),
        "value_iqr": float(values.quantile(0.75) - values.quantile(0.25)),
        "value_first": float(values.iloc[0]),
        "value_last": float(values.iloc[-1]),
        "value_trend": trend,
        "value_abs_diff_mean": float(diffs.abs().mean()) if not diffs.empty else 0.0,
        "value_abs_diff_std": float(diffs.abs().std(ddof=0)) if not diffs.empty else 0.0,
        "value_max_jump": float(diffs.abs().max()) if not diffs.empty else 0.0,
        "value_energy": float(np.mean(np.square(values.to_numpy()))),
        "peak_to_mean_ratio": float(values.max() / values.mean()) if values.mean() not in (0, np.nan) else 0.0,
        "source_file": source_file,
        "anomaly": int(label),
    }
    return features


def build_dataset_from_archive() -> pd.DataFrame:
    if not ARCHIVE_DIR.exists():
        raise FileNotFoundError(f"Archive folder not found at {ARCHIVE_DIR}")

    records: List[Dict[str, object]] = []
    csv_files = [path for path in ARCHIVE_DIR.rglob("*.csv") if "__MACOSX" not in path.parts]

    for file_path in sorted(csv_files):
        frame = load_timeseries_frame(file_path)
        label = infer_label(file_path)
        windows = iter_windows(frame)
        for window_frame in windows:
            records.append(
                extract_window_features(
                    window_frame,
                    source_file=str(file_path.relative_to(ARCHIVE_DIR)),
                    label=label,
                )
            )

    dataset = pd.DataFrame(records)
    dataset.to_csv(DATASET_PATH, index=False)
    print(f"Built dataset from archive at {DATASET_PATH}")
    print("Archive source files:", len(csv_files))
    print("Derived training rows:", len(dataset))
    return dataset


def generate_fallback_dataset(row_count: int = 1200, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    cpu_usage = np.clip(rng.normal(48, 18, row_count), 1, 100)
    memory_usage = np.clip(rng.normal(54, 16, row_count), 1, 100)
    disk_usage = np.clip(rng.normal(61, 14, row_count), 1, 100)
    network_in = np.clip(rng.normal(220, 85, row_count), 0, None)
    network_out = np.clip(rng.normal(180, 75, row_count), 0, None)
    latency_ms = np.clip(rng.normal(72, 26, row_count), 1, None)
    error_rate = np.clip(rng.beta(2.2, 18, row_count), 0, 1)
    process_count = np.clip(rng.normal(148, 36, row_count), 25, None)
    active_connections = np.clip(rng.normal(318, 92, row_count), 5, None)

    server_role = rng.choice(["web", "api", "worker", "database"], row_count, p=[0.36, 0.31, 0.22, 0.11])
    region = rng.choice(["us-east-1", "us-west-2", "eu-central-1"], row_count, p=[0.45, 0.35, 0.20])
    workload = rng.choice(["steady", "bursty", "batch"], row_count, p=[0.52, 0.33, 0.15])

    anomaly_score = (
        (cpu_usage > 78).astype(int)
        + (memory_usage > 80).astype(int)
        + (latency_ms > 125).astype(int)
        + (error_rate > 0.18).astype(int)
        + (disk_usage > 88).astype(int)
    )
    anomaly = np.where(anomaly_score >= 1, 1, 0)

    df = pd.DataFrame(
        {
            "cpu_usage": cpu_usage,
            "memory_usage": memory_usage,
            "disk_usage": disk_usage,
            "network_in": network_in,
            "network_out": network_out,
            "latency_ms": latency_ms,
            "error_rate": error_rate,
            "process_count": process_count,
            "active_connections": active_connections,
            "server_role": server_role,
            "region": region,
            "workload": workload,
            "anomaly": anomaly,
        }
    )

    missing_indices = rng.choice(df.index, size=max(1, row_count // 20), replace=False)
    df.loc[missing_indices[: len(missing_indices) // 3], "memory_usage"] = np.nan
    df.loc[missing_indices[len(missing_indices) // 3 : 2 * len(missing_indices) // 3], "latency_ms"] = np.nan
    df.loc[missing_indices[2 * len(missing_indices) // 3 :], "server_role"] = np.nan

    return df


def load_dataset() -> pd.DataFrame:
    ensure_directories()
    if ARCHIVE_DIR.exists():
        df = build_dataset_from_archive()
    else:
        if DATASET_PATH.exists():
            df = pd.read_csv(DATASET_PATH)
            print(f"Loaded dataset from {DATASET_PATH}")
        else:
            df = generate_fallback_dataset()
        df.to_csv(DATASET_PATH, index=False)
        print(f"No archive found, generated fallback dataset at {DATASET_PATH}")

    print("Shape:", df.shape)
    print("Head:\n", df.head())
    print("Data types:\n", df.dtypes)
    return df


def run_eda(df: pd.DataFrame) -> None:
    print("Null counts:\n", df.isna().sum())
    print("Describe numeric columns:\n", df.describe(include=[np.number]))
    print("Target distribution:\n", df["anomaly"].value_counts())

    # Observation 1: The windowed value mean and range should separate flat, stable series from spiky anomalous ones.
    # Observation 2: The trend and max-jump features are especially useful for jumps, spikes, and step-change anomalies.
    # Observation 3: Real AWS CloudWatch series and the artificial anomaly folders should form the positive class majority.
    # Observation 4: The synthetic no-anomaly archive provides the clearest negative examples in the dataset.
    # Observation 5: Sampling interval and duration features help distinguish series that are irregular versus steady.


def clean_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, LabelEncoder], Dict[str, float]]:
    cleaned = df.copy()
    encoders: Dict[str, LabelEncoder] = {}
    fill_values: Dict[str, float] = {}

    numeric_columns = cleaned.select_dtypes(include=[np.number]).columns.tolist()
    numeric_columns = [column for column in numeric_columns if column != "anomaly"]
    categorical_columns = [column for column in cleaned.select_dtypes(include=["object", "string", "category"]).columns.tolist() if column != "source_file"]

    if "source_file" in cleaned.columns:
        cleaned = cleaned.drop(columns=["source_file"])

    for column in numeric_columns:
        fill_value = float(cleaned[column].median())
        if np.isnan(fill_value):
            fill_value = float(cleaned[column].mean())
        cleaned[column] = cleaned[column].fillna(fill_value)
        fill_values[column] = fill_value

    for column in categorical_columns:
        cleaned[column] = cleaned[column].fillna(cleaned[column].mode(dropna=True).iloc[0])
        encoder = LabelEncoder()
        cleaned[column] = encoder.fit_transform(cleaned[column].astype(str))
        encoders[column] = encoder

    null_total = int(cleaned.isna().sum().sum())
    print(f"Nulls remaining after cleaning: {null_total}")
    if null_total != 0:
        raise ValueError("Data cleaning failed to remove all nulls.")

    return cleaned, encoders, fill_values


def visualize_data(df: pd.DataFrame, feature_columns: List[str]) -> None:
    ensure_directories()

    plt.figure(figsize=(8, 5))
    df["anomaly"].value_counts().sort_index().plot(kind="bar", color=["#2a6f97", "#d00000"])
    plt.title("Target Distribution")
    plt.xlabel("Anomaly Label")
    plt.ylabel("Row Count")
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "target_distribution.png", dpi=150)
    plt.close()

    numeric_df = df[feature_columns + ["anomaly"]].select_dtypes(include=[np.number])
    correlation = numeric_df.corr(numeric_only=True)
    plt.figure(figsize=(12, 9))
    image = plt.imshow(correlation, cmap="coolwarm", interpolation="nearest")
    plt.colorbar(image, fraction=0.046, pad=0.04)
    plt.xticks(range(len(correlation.columns)), correlation.columns, rotation=45, ha="right")
    plt.yticks(range(len(correlation.index)), correlation.index)
    plt.title("Correlation Heatmap")
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "correlation_heatmap.png", dpi=150)
    plt.close()


def train_and_evaluate(df: pd.DataFrame) -> Tuple[Dict[str, object], float]:
    feature_columns = [column for column in df.columns if column != "anomaly"]
    x = df[feature_columns]
    y = df["anomaly"]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced_subsample",
        min_samples_leaf=2,
    )
    model.fit(x_train, y_train)

    predictions = model.predict(x_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Accuracy: {accuracy:.4f}")
    print("Confusion matrix:\n", confusion_matrix(y_test, predictions))
    print("Classification report:\n", classification_report(y_test, predictions))

    feature_importance_frame = pd.DataFrame(
        {
            "feature": feature_columns,
            "importance": model.feature_importances_,
        }
    ).sort_values("importance", ascending=False)

    plt.figure(figsize=(10, 6))
    plt.barh(feature_importance_frame["feature"], feature_importance_frame["importance"], color="#003566")
    plt.gca().invert_yaxis()
    plt.title("Random Forest Feature Importance")
    plt.tight_layout()
    plt.savefig(PLOTS_DIR / "feature_importance.png", dpi=150)
    plt.close()

    bundle: Dict[str, object] = {
        "model": model,
        "feature_columns": feature_columns,
        "metrics": {"accuracy": accuracy},
    }
    return bundle, accuracy


def save_model(bundle: Dict[str, object]) -> None:
    with open(MODEL_PATH, "wb") as file_handle:
        pickle.dump(bundle, file_handle)
    print(f"Saved model bundle to {MODEL_PATH}")


def prepare_row(sample: Dict[str, object], feature_columns: List[str], encoders: Dict[str, LabelEncoder], fill_values: Dict[str, float]) -> pd.DataFrame:
    row = pd.DataFrame([sample])

    for column in feature_columns:
        if column not in row.columns:
            row[column] = np.nan

    row = row[feature_columns].copy()

    for column, fill_value in fill_values.items():
        if column in row.columns:
            row[column] = pd.to_numeric(row[column], errors="coerce").fillna(fill_value)

    for column, encoder in encoders.items():
        if column in row.columns:
            row[column] = row[column].fillna(encoder.classes_[0]).astype(str)
            known_values = set(encoder.classes_)
            row[column] = row[column].apply(lambda value: value if value in known_values else encoder.classes_[0])
            row[column] = encoder.transform(row[column].astype(str))

    return row


def build_prediction_frame(file_path: Path) -> pd.DataFrame:
    frame = load_timeseries_frame(file_path)
    label = infer_label(file_path)
    windows = iter_windows(frame)
    rows = [extract_window_features(window_frame, source_file=file_path.name, label=label) for window_frame in windows]
    return pd.DataFrame(rows)


def build_pipeline() -> Dict[str, object]:
    df = load_dataset()
    run_eda(df)
    cleaned_df, encoders, fill_values = clean_data(df)
    visualize_data(cleaned_df, [column for column in cleaned_df.columns if column != "anomaly"])
    bundle, accuracy = train_and_evaluate(cleaned_df)
    bundle["encoders"] = encoders
    bundle["fill_values"] = fill_values
    save_model(bundle)
    bundle["metrics"]["accuracy"] = accuracy
    return bundle


def main() -> None:
    parser = argparse.ArgumentParser(description="Train the CloudWatch server anomaly predictor.")
    parser.add_argument("--train-only", action="store_true", help="Run the training pipeline and exit.")
    args = parser.parse_args()

    bundle = build_pipeline()
    if args.train_only:
        return

    print("Training completed. Model bundle contains:")
    print("- feature columns:", bundle["feature_columns"])
    print("- accuracy:", bundle["metrics"]["accuracy"])


if __name__ == "__main__":
    main()