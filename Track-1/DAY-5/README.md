# CloudWatch Server Resource Anomaly Predictor

This project detects unusual behavior in server and infrastructure telemetry. It reads timestamped time-series files, converts each series into rolling statistical windows, and trains a machine-learning classifier to decide whether each window looks normal or anomalous.

The goal is not only to train a model, but to make server behavior easier to analyze: stable series should look different from spikes, jumps, flatlines, trend changes, and noisy workload shifts.

## Why This Project Matters

Cloud infrastructure produces a large amount of metric data: CPU usage, network traffic, request latency, disk activity, and other operational signals. Manually checking those signals is slow and error-prone.

This project shows a practical anomaly-detection workflow:

- Convert raw monitoring data into useful model features.
- Train a supervised classifier on normal and anomalous examples.
- Evaluate model quality with accuracy, precision, recall, F1 score, and a confusion matrix.
- Generate plots that help explain the data and the model.
- Save a reusable model bundle for later predictions.

## Dataset

The source data is stored in `data/archive/`. The files follow a NAB-style format where each CSV contains:

- `timestamp` - time of the metric reading
- `value` - observed metric value

The training pipeline scans all archive CSV files and creates `data/dataset.csv`.

Current verified dataset build:

- Source CSV files: `58`
- Generated training rows: `15,192`
- Window size: `48` observations
- Window step: `24` observations
- Target labels:
  - `0` = normal
  - `1` = anomaly

The label is inferred from the archive folder name. Files under `artificialNoAnomaly` are treated as normal, and the other archive groups are treated as anomalous.

## How The Pipeline Works

1. Load each raw CSV from `data/archive/`.
2. Clean invalid timestamps and non-numeric values.
3. Split each time series into rolling windows.
4. Extract statistical features from each window.
5. Save the engineered table to `data/dataset.csv`.
6. Train a `RandomForestClassifier`.
7. Evaluate the model on a stratified train/test split.
8. Save the trained model bundle to `model.pkl`.
9. Generate analysis plots in `plots/`.

## Features Used For Analysis

Each time-series window is transformed into these model features:

- Window shape: `window_length`, `duration_minutes`, `sampling_interval_minutes`
- Central tendency: `value_mean`, `value_median`
- Spread: `value_std`, `value_min`, `value_max`, `value_range`, `value_iqr`, `value_q25`, `value_q75`
- Direction: `value_first`, `value_last`, `value_trend`
- Change behavior: `value_abs_diff_mean`, `value_abs_diff_std`, `value_max_jump`
- Signal strength: `value_energy`, `peak_to_mean_ratio`

These features help the model identify common anomaly patterns such as sudden spikes, large jumps, flatline behavior, high variance, and abnormal trend movement.

## Model

The project uses a `RandomForestClassifier` from scikit-learn.

Random Forest is a good fit here because:

- It performs well on tabular engineered features.
- It can model non-linear relationships.
- It is less sensitive to feature scaling than many other classifiers.
- It provides feature-importance values for analysis.
- It works well as a strong baseline before trying more complex time-series models.

Training settings are defined in `model.py`:

- `n_estimators=300`
- `random_state=42`
- `class_weight="balanced_subsample"`
- `min_samples_leaf=2`

## Verified Results

The latest local training run used an 80/20 stratified split.

```text
Accuracy: 0.9862

Confusion matrix:
[[ 134   33]
 [   9 2863]]
```

Classification report summary:

| Class | Meaning | Precision | Recall | F1-score | Support |
| --- | --- | ---: | ---: | ---: | ---: |
| `0` | Normal | 0.94 | 0.80 | 0.86 | 167 |
| `1` | Anomaly | 0.99 | 1.00 | 0.99 | 2,872 |

The model is very strong at detecting anomalous windows, but the normal class has lower recall. That means some normal windows are still being flagged as anomalous. This is important for real monitoring systems because false alarms can reduce trust in the alerting workflow.

## Generated Outputs

After training, the project creates or updates:

- `data/dataset.csv` - engineered training dataset
- `model.pkl` - saved model bundle
- `plots/target_distribution.png` - class balance chart
- `plots/correlation_heatmap.png` - feature correlation chart
- `plots/feature_importance.png` - Random Forest feature importance chart

The saved model bundle contains:

- trained model
- feature column order
- training metrics
- encoders, if categorical features are used
- numeric fill values for missing data

## Project Structure

```text
.
├── data/
│   ├── archive/          # Source time-series CSV files
│   └── dataset.csv       # Generated feature dataset
├── plots/                # Generated analysis charts
├── model.py              # Data loading, feature extraction, EDA, training, saving
├── train.py              # Training entry point
├── predict.py            # Sample prediction script
├── model.pkl             # Saved trained model bundle
├── requirements.txt      # Python dependencies
└── README.md             # Project documentation
```

## Setup

Create and activate a virtual environment if you want an isolated Python setup.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

If Matplotlib warns that its default config directory is not writable, you can use a local cache directory:

```bash
mkdir -p .matplotlib
MPLCONFIGDIR=.matplotlib python3 train.py
```

## Train The Model

```bash
python3 train.py
```

This command rebuilds `data/dataset.csv`, trains the Random Forest model, prints evaluation metrics, writes plots, and saves `model.pkl`.

You can also run:

```bash
python3 model.py --train-only
```

## Run Sample Predictions

```bash
python3 predict.py
```

Verified sample output:

```text
art_daily_no_noise.csv -> normal (anomaly windows: 0.00%)
art_daily_jumpsup.csv -> anomaly (anomaly windows: 98.20%)
ec2_cpu_utilization_24ae8d.csv -> anomaly (anomaly windows: 100.00%)
```

## How To Analyze The Project

Use these files when explaining the project:

- Start with `data/dataset.csv` to show how raw time-series data becomes model-ready features.
- Use `plots/target_distribution.png` to discuss class imbalance.
- Use `plots/correlation_heatmap.png` to identify related features.
- Use `plots/feature_importance.png` to explain which features influence predictions most.
- Use the confusion matrix to discuss false positives and false negatives.

Important interpretation:

- High anomaly recall means the model catches most anomalous windows.
- Lower normal recall means some normal windows are marked anomalous.
- In production, the prediction threshold or labeling strategy should be tuned based on whether missed anomalies or false alerts are more costly.

## Limitations

- Labels are inferred from folder names, not from exact anomaly timestamps.
- The current model classifies windows, not individual timestamp points.
- The dataset is imbalanced, with many more anomaly windows than normal windows.
- Real production metrics can drift over time, so the model should be retrained with newer data.
- Random Forest is interpretable and reliable, but it does not directly model long-term sequence dependencies.

## Good Next Improvements

- Add timestamp-level labels if exact anomaly ranges are available.
- Tune the decision threshold to reduce false alarms.
- Compare Random Forest with Gradient Boosting, Isolation Forest, and sequence models.
- Add cross-validation for more stable evaluation.
- Save a separate metrics report after each training run.
- Build a simple dashboard that displays predictions beside the original time series.

## Dependencies

The project uses:

- `pandas`
- `numpy`
- `scikit-learn`
- `matplotlib`

Install them with:

```bash
pip install -r requirements.txt
```
