# Internship at Innolift Ventures

This repository documents my internship learning journey across two tracks. It includes beginner Python programs, data analysis exercises, machine learning pipelines, anomaly detection experiments, model comparison work, and notebook-based visualizations.

## Repository Structure

```text
.
├── Track-1/
│   ├── DAY-1/   # Developer profile card
│   ├── DAY-2/   # Control flow, loops, and logic scripts
│   ├── DAY-3/   # NumPy and Pandas student data analysis
│   ├── DAY-4/   # Student performance prediction model
│   └── DAY-5/   # CloudWatch anomaly predictor
├── Track-2/
│   ├── DAY-6/   # Machine learning experiments notebook
│   ├── DAY-7/   # CloudWatch anomaly visualization
│   ├── DAY-8/   # Anomaly detection impact and iteration report
│   └── DAY-9/   # Anomaly model comparison and leakage analysis
└── model.pkl    # Saved model artifact
```

## Track 1 Overview

Track 1 starts with Python fundamentals and gradually moves into data analysis and machine learning projects.

### [Day 1: My Developer Profile Card](Track-1/DAY-1)

Day 1 introduced basic Python variables, data types, and formatted terminal output through a simple **Developer Profile Card**.

The program stores personal details in memory and prints them as a clean text-based card:

- Name
- Age
- Current learning focus
- Previous coding experience
- Career goal

Example output:

```text
=========================================
        MY DEVELOPER PROFILE CARD
=========================================
Name              : K.Mokshagnatej
Age               : 20
Learning          : Python
Has Coded Before? : True
Goal              : Full Stack AI Developer
=========================================
```

Key concepts covered:

- Variables
- Strings
- Numbers
- Booleans
- Formatted printing

### [Day 2: Control Flow, Loops, and Logic](Track-1/DAY-2)

Day 2 focused on making programs respond to conditions and repeated actions using loops, conditional statements, and functions.

Projects included:

| Script | Description | Key Concepts |
| --- | --- | --- |
| `Atmpinchecker.py` | ATM PIN login simulator with three attempts | `for` loops, `break`, `for-else` |
| `Evenoddsorter.py` | Separates user-entered numbers into even and odd lists | Lists, `.append()`, modulo operator |
| `gradecalculator.py` | Calculates percentage and assigns grades | Type casting, sequential logic, `if-elif-else` |
| `Multiplicationtablegenerator.py` | Generates a multiplication table from 1 to 10 | `range()`, f-strings |
| `Numberguess.py` | Number guessing game with random number generation | `random`, custom functions, loops |

Run any script with:

```bash
python filename.py
```

Example:

```bash
python Numberguess.py
```

### [Day 3: Student Data Analysis with NumPy and Pandas](Track-1/DAY-3)

Day 3 introduced practical data analysis using **NumPy** and **Pandas**. The project uses manually created sample data and the Student Performance Dataset (`student-mat.csv`) to demonstrate data cleaning, exploratory analysis, feature engineering, pivot tables, correlations, and DataFrame merging.

Project objectives:

- Work with NumPy arrays
- Create and manipulate Pandas DataFrames
- Read CSV files
- Handle missing values
- Perform grouping and aggregation
- Generate basic EDA reports
- Engineer new features
- Create pivot tables
- Analyze correlations
- Merge multiple DataFrames

Requirements:

```bash
pip install numpy pandas
```

Run the project:

```bash
python mainday3.py
```

Dataset used:

```text
student-mat.csv
```

The dataset includes information such as school, gender, age, study time, internet access, family details, and grades (`G1`, `G2`, `G3`). The final grade `G3` is used throughout the analysis.

Tasks completed:

| Task | Topic | Summary |
| --- | --- | --- |
| 1 | NumPy Marks Analyser | Calculates mean, max, min, standard deviation, and pass count |
| 2 | DataFrame Builder | Builds a student DataFrame and adds a pass/fail result column |
| 3 | CSV Explorer | Loads the dataset and inspects shape, rows, and internet access distribution |
| 4 | Missing Data Detective | Fills numeric missing values with means and text missing values with `Unknown` |
| 5 | Group & Compare | Groups final grades by study time and finds top students |
| 6 | Full EDA Report | Displays shape, missing values, and statistical summaries |
| 7 | Grade Binning | Converts numeric grades into letter grades using `pd.cut()` |
| 8 | Pivot Tables | Compares average grades by gender and internet access |
| 9 | Correlation Analysis | Finds positive and negative relationships with final grade |
| 10 | DataFrame Merging | Merges student data with school metadata |

Python concepts covered:

- Variables
- Arrays
- DataFrames
- CSV loading
- Missing value handling
- Grouping and aggregation
- Pivot tables
- Correlation analysis
- Feature engineering
- DataFrame joins

### [Day 4: Student Performance Analysis and Prediction](Track-1/DAY-4)

Day 4 built an end-to-end machine learning pipeline to analyze student performance factors and predict exam scores with a **Multiple Linear Regression** model.

The project uses:

- Python
- Pandas
- Matplotlib
- Scikit-learn

Main objective:

1. Identify which student factors, such as study hours, attendance, and parental involvement, best explain exam scores.
2. Predict a student's final exam score from those factors.

Key features:

- Automated quality checks for missing values, outliers, and duplicate rows
- Correlation analysis for positive and negative relationships with exam scores
- Exported `.png` visualizations for distributions and trends
- Feature engineering through binned study-hour categories
- Multiple train-test split experiments
- Serialized trained model output as `saved_exam_score_model.pkl`

Exploratory analysis included:

- Hours studied distribution
- Attendance distribution
- Feature boxplots
- Study hours vs. exam score scatter plot
- Exam score trend by study time
- School type impact
- Parental involvement impact

Modeling details:

- Target variable: `Exam_Score`
- Features: numeric columns such as `Hours_Studied`, `Attendance`, `Previous_Scores`, `Tutoring_Sessions`, `Physical_Activity`, and `Sleep_Hours`
- Model: Multiple Linear Regression
- Evaluation: actual vs. predicted scores and residual diagnostics
- Output: reusable `.pkl` model file

### [Day 5: CloudWatch Server Resource Anomaly Predictor](Track-1/DAY-5)

Day 5 focused on detecting unusual behavior in server and infrastructure telemetry. The project reads timestamped time-series files, converts each series into rolling statistical windows, and trains a classifier to label each window as normal or anomalous.

Why it matters:

- Cloud systems generate many operational metrics such as CPU usage, network traffic, request latency, and disk activity.
- Manual inspection is slow and error-prone.
- A machine learning workflow can help identify spikes, jumps, flatlines, trend shifts, and noisy workload changes.

Pipeline flow:

1. Load raw CSV files from `data/archive/`.
2. Clean timestamps and non-numeric values.
3. Split time series into rolling windows.
4. Extract statistical features.
5. Save the engineered dataset to `data/dataset.csv`.
6. Train a `RandomForestClassifier`.
7. Evaluate the model on a stratified train/test split.
8. Save the model bundle to `model.pkl`.
9. Generate plots in `plots/`.

Verified dataset build:

- Source CSV files: `58`
- Generated training rows: `15,192`
- Window size: `48` observations
- Window step: `24` observations
- Labels: `0 = normal`, `1 = anomaly`

Features used:

- Window shape: `window_length`, `duration_minutes`, `sampling_interval_minutes`
- Central tendency: `value_mean`, `value_median`
- Spread: `value_std`, `value_min`, `value_max`, `value_range`, `value_iqr`, `value_q25`, `value_q75`
- Direction: `value_first`, `value_last`, `value_trend`
- Change behavior: `value_abs_diff_mean`, `value_abs_diff_std`, `value_max_jump`
- Signal strength: `value_energy`, `peak_to_mean_ratio`

Model:

- Algorithm: `RandomForestClassifier`
- `n_estimators=300`
- `random_state=42`
- `class_weight="balanced_subsample"`
- `min_samples_leaf=2`

Verified results from the latest local training run:

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

Important interpretation:

- High anomaly recall means the model catches most anomalous windows.
- Lower normal recall means some normal windows are marked as anomalous.
- In a production monitoring system, thresholds and labels should be tuned based on whether missed anomalies or false alerts are more costly.

Run training:

```bash
python3 train.py
```

Run sample predictions:

```bash
python3 predict.py
```

Verified sample output:

```text
art_daily_no_noise.csv -> normal (anomaly windows: 0.00%)
art_daily_jumpsup.csv -> anomaly (anomaly windows: 98.20%)
ec2_cpu_utilization_24ae8d.csv -> anomaly (anomaly windows: 100.00%)
```

Limitations:

- Labels are inferred from folder names, not exact anomaly timestamps.
- The model classifies windows, not individual timestamp points.
- The dataset is imbalanced.
- Real production metrics can drift over time.
- Random Forest is reliable and interpretable, but it does not directly model long-term sequence dependencies.

Recommended improvements:

- Add timestamp-level labels.
- Tune the decision threshold to reduce false alarms.
- Compare with Gradient Boosting, Isolation Forest, and sequence models.
- Add cross-validation.
- Save separate metrics reports after training.
- Build a dashboard for time-series predictions.

## Track 2 Overview

Track 2 continues the anomaly detection work through notebooks, visualization, model comparison, and reporting.

### [Day 6: Machine Learning Experiments Notebook](Track-2/DAY-6)

Day 6 contains a Jupyter Notebook with several machine learning demonstrations and experimental modeling sections.

Notebook sections:

| Section | Objective | Details |
| --- | --- | --- |
| CloudWatch Server Resource Anomaly Predictor | Load and inspect server resource data | Reads a `dataset.csv` file containing window statistics and binary anomaly labels |
| Text Classification | Classify messages as spam or ham | Uses `TfidfVectorizer` and compares Logistic Regression, Decision Tree, SVM, and KNN |
| Movie Genre Prediction | Predict movie genres and tune hyperparameters | Uses release year and ratings with `LabelEncoder` and `GridSearchCV` |

Requirements:

- `pandas`
- `scikit-learn`

Important notes:

- The notebook includes dummy-data fallbacks when required CSV files are unavailable.
- With tiny fallback datasets, warnings such as `UndefinedMetricWarning` or cross-validation warnings are expected because there are not enough samples for reliable splits.

### [Day 7: CloudWatch Data Anomaly Visualization](Track-2/DAY-7)

Day 7 developed an automated anomaly visualization script in a Jupyter Notebook / Google Colab environment. The script creates synthetic time-series data and highlights values above a threshold of `195`.

Technical stack:

- Python 3
- Google Colab / Jupyter Notebook
- `matplotlib.pyplot`
- `numpy`
- `pandas`
- `io`
- `base64`
- `IPython.display`

Execution flow:

1. Generate or ingest time-series values around a baseline of 200.
2. Initialize a Matplotlib figure.
3. Use conditional rendering with `plt.fill_between()` to shade values above the threshold.
4. Save the chart to an in-memory `BytesIO` buffer.
5. Encode the image as base64.
6. Display the generated image directly inside the notebook UI.

Issues resolved:

| Issue | Root Cause | Resolution |
| --- | --- | --- |
| `FileNotFoundError` while loading `dataset.csv` | Expected file was not available in Colab | Switched to an available sample dataset for testing |
| `KeyError: "['developer_id'] not found in axis"` | Code referenced a column missing from the DataFrame | Remapped the target variable to the available `anomaly` column |

Key learnings:

- Conditional visualization can reduce cognitive load by highlighting threshold breaches automatically.
- `BytesIO` and base64 encoding make the rendering approach serverless-ready.
- Schema validation is necessary before running visualization and data-processing logic.

### [Day 8: Anomaly Detection Pipeline Impact and Iteration Report](Track-2/DAY-8)

Day 8 provides a formal report comparing the baseline anomaly detection pipeline with a newer iteration. The updated preprocessing and evaluation steps showed major improvements in reported predictive performance.

Performance comparison:

| Model | Baseline Accuracy | Current Accuracy | Delta |
| --- | ---: | ---: | ---: |
| Logistic Regression | 65.51% | 94.43% | +28.92% |
| Decision Tree | 57.19% | 100.00% | +42.81% |
| Random Forest | 64.94% | 100.00% | +35.06% |
| Gradient Boosting | 65.80% | 100.00% | +34.20% |

Pipeline enhancements:

- One-hot encoding with `pd.get_dummies`
- Feature space expansion from 21 to 77 dimensions
- Weighted precision, recall, and F1-score reporting
- Seaborn confusion matrix heatmaps
- Model serialization with `joblib`

Validation steps:

- Training vs. test accuracy comparison to check generalization
- 5-fold cross-validation across classifiers
- Random Forest achieved `1.0000` mean accuracy with `0.0000` standard deviation across folds

Conclusion:

The updated pipeline became more mature through stronger categorical encoding, broader metrics, cross-validation, and model persistence. The report also prepares the work for later production-monitoring integration.

### [Day 9: Anomaly Detection Model Comparison](Track-2/DAY-9)

Day 9 trained and compared four classifiers on a windowed time-series anomaly detection dataset:

- Logistic Regression
- Decision Tree
- Random Forest
- Gradient Boosting

Dataset:

- `15,192` rows
- `21` engineered features plus `source_file` and `anomaly`
- `77` features after one-hot encoding
- Train/test split: 80/20
- Training rows: `12,153`
- Test rows: `3,039`
- Test class balance: `169` anomalies vs. `2,870` normal rows

Results:

| Model | Accuracy | Precision (weighted) | Recall (weighted) | F1 (weighted) | Anomaly-class Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Logistic Regression | 0.9444 | 0.8919 | 0.9444 | 0.9174 | 0.00 |
| Decision Tree | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.00* |
| Random Forest | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.00* |
| Gradient Boosting | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.00* |

`*` These perfect scores are likely inflated by data leakage.

Key finding:

The apparent "94% vs. 100%" result is misleading. Weighted metrics are dominated by the normal majority class. Logistic Regression detects zero anomalies, while the tree-based models likely benefit from leakage through the `source_file` column, because folder or file names may encode anomaly status.

Known issues:

| # | Issue | Impact |
| --- | --- | --- |
| 1 | `source_file` is one-hot encoded | Likely leaks labels directly to tree models |
| 2 | No class-imbalance handling | Minority-class metrics are unreliable |
| 3 | `best_model.pkl` is saved from an unfitted `LogisticRegression()` | Saved model is not usable |
| 4 | Early comparison table uses stale hardcoded accuracy values | Confusing intermediate notebook output |
| 5 | `model_comparison.py` covers only 2 of 4 models and uses a relative `dataset.csv` path | Script output is incomplete and less portable |
| 6 | Cross-validation and comparison sections are duplicated | Notebook is harder to read |

Artifacts produced:

- `confusion_matrix_model1.png`
- `confusion_matrix_model2.png`
- `model_comparison.csv`
- `model_comparison.py`
- `best_model.pkl`
- `report.pdf`

Recommended next steps:

1. Drop `source_file` or replace it with a leakage-safe derived feature.
2. Use a group-aware split such as `GroupShuffleSplit` on `source_file`.
3. Handle class imbalance with `class_weight`, resampling, or precision/recall-focused metrics such as PR-AUC.
4. Save the actually fitted model to `best_model.pkl`.
5. Regenerate `report.pdf` after fixing leakage and imbalance concerns.

## Skills and Tools Practiced

- Python fundamentals
- Control flow and loops
- Functions
- NumPy
- Pandas
- Data cleaning
- Exploratory data analysis
- Feature engineering
- Data visualization
- Matplotlib
- Scikit-learn
- Regression modeling
- Classification modeling
- Random Forests
- Cross-validation
- Confusion matrices
- Model serialization
- Jupyter Notebook / Google Colab workflows
- Anomaly detection
- Time-series feature extraction
- Model evaluation and reporting

## How To Use This Repository

Each day folder contains its own files and README documentation. Start from this main README for the overall view, then open the specific day folder for source code, notebooks, datasets, model artifacts, and day-level explanations.

For Python scripts:

```bash
python filename.py
```

For Python 3-specific commands:

```bash
python3 filename.py
```

For notebooks, open the `.ipynb` files in Jupyter Notebook, JupyterLab, VS Code, or Google Colab.
