# Internship-at-innolift


# 🚀 Day 1: My Developer Profile Card

Welcome to Day 1 of my Python coding journey! 
today, I built a simple but foundational program: a **Developer Profile Card**. 

This script takes my personal details, stores them in the computer's memory, and then prints them out as a neat, formatted ID card in the terminal. It’s a small step, but it perfectly demonstrates how Python handles different types of data and displays text.

## 🌟 What Does This Code Do?
When you run this script, it outputs a clean, 

text-based profile card showing:
>my name
> age
> what I'm currently learning
>my previous coding experience
><img width="765" height="253" alt="Screenshot 2026-07-01 at 14 18 00" src="https://github.com/user-attachments/assets/356c59a1-ec8c-46f7-b919-b029166da6a9" />
 my ultimate career goal. 

Here is what the output looks like:

=========================================
        MY DEVELOPER PROFILE CARD
=========================================
Name              : K.Mokshagnatej
Age               : 20
Learning          : Python
Has Coded Before? : True
Goal              : Full Stack AI Developer
=========================================
 


# Day 2: Control Flow, Loops, and Logic 🚀

Welcome to Day 2 of my Python journey! Today's focus was on making programs actually *do* things based on different conditions. I moved past basic printing and started building small, interactive scripts that use loops, conditional statements, and basic functions.

This repository contains five beginner-friendly projects that demonstrate how to control the flow of a Python program.


## 🛠️ What's in this folder?

Here is a breakdown of the scripts I wrote today and the key concepts each one covers:

### 1. `Atmpinchecker.py`
A simple ATM login simulator that gives the user three tries to enter a hardcoded PIN. 
* **Key Concepts:** `for` loops, `break` statements to exit a loop early, and Python's unique `for-else` construct (which triggers if the account gets blocked after 3 failed attempts).

### 2. `Evenoddsorter.py`
This script asks the user for a set of numbers and then separates them into two different lists: one for even numbers and one for odds.
* **Key Concepts:** Working with empty lists `[]`, using the `.append()` method, and applying the modulo operator (`%`) to check for remainders.

### 3. `gradecalculator.py`
A classic school grading system. It takes marks for 5 subjects, calculates the percentage, and assigns a letter grade (A+ through F).
* **Key Concepts:** Sequential logic, type casting (`float()`), and building an `if-elif-else` ladder to handle multiple conditions.

### 4. `Multiplicationtablegenerator.py`
A quick utility that takes a single number as input and generates its multiplication table from 1 to 10.
* **Key Concepts:** The `range()` function and f-strings for clean string formatting.

### 5. `Numberguess.py`
A mini-game where the user has 3 attempts to guess a randomly generated number between 1 and 10.
* **Key Concepts:** Importing external modules (`import random`), defining and calling custom functions (`def check_guess()`), and combining loops with conditional logic.

---

## 🚀 How to Run the Code

To run any of these scripts, you just need Python installed on your machine. 

1. Clone or download this repository.
2. Open your terminal or command prompt.
3. Navigate to the folder containing the files.
4. Run a script using the `python` command followed by the filename. 



# Day 3: 📊 Student Data Analysis with NumPy & Pandas

A beginner-friendly Python project demonstrating the power of **NumPy** and **Pandas** for data analysis, data cleaning, feature engineering, exploratory data analysis (EDA), correlation analysis, pivot tables, and DataFrame merging.

This project contains **10 practical tasks** that gradually introduce important data analysis concepts using both manually created datasets and the **Student Performance Dataset (`student-mat.csv`)**.

---

# 📁 Project Structure

```
project/
│
├── student-mat.csv      # Main dataset
├── main.py              # Python program
├── README.md            # Project documentation
```

---

# 🎯 Project Objectives

The project demonstrates how to:

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

---

# 📦 Requirements

Install the required libraries before running the project.

```bash
pip install numpy pandas
```

---

# ▶️ Running the Project

Place the dataset **student-mat.csv** in the same folder as the Python script.

Run:

```bash
python main.py
```

If the dataset is missing, the program will automatically skip dataset-related tasks while still executing the NumPy and DataFrame examples.

---

# 📂 Dataset

The project uses the **Student Performance Dataset**.

File:

```
student-mat.csv
```

The dataset contains information about students including:

- School
- Gender
- Age
- Study time
- Internet access
- Family information
- Grades (G1, G2, G3)

Final grade (`G3`) is used throughout the project for analysis.

---

# 📝 Task 1 — NumPy Marks Analyser

### Objective

Demonstrates basic NumPy operations.

### Operations

- Create a NumPy array
- Calculate mean
- Find maximum value
- Find minimum value
- Calculate standard deviation
- Count students who passed

### Example Output

```
Mean: 65.70
Highest: 95
Lowest: 33
Standard Deviation: ...
Students Passed: 7/10
```

### Concepts Used

- numpy.array()
- mean()
- max()
- min()
- std()
- Boolean indexing

---

# 📝 Task 2 — DataFrame Builder

### Objective

Create a Pandas DataFrame manually.

### Operations

Creates student information including:

- Name
- Age
- City
- Marks

Adds a new column:

```
Result
```

using

```python
np.where()
```

Students with marks ≥ 50 are marked as **Pass**, otherwise **Fail**.

### Concepts Used

- pd.DataFrame()
- Column creation
- np.where()

---

# 📝 Task 3 — CSV Explorer

### Objective

Load and inspect the dataset.

### Operations

Displays:

- Dataset shape
- First three rows
- Internet access distribution

### Concepts Used

- read_csv()
- head()
- shape
- value_counts()

---

# 📝 Task 4 — Missing Data Detective

### Objective

Handle missing values.

### Operations

Creates a sample DataFrame containing missing values.

Missing numeric values are replaced with:

```
Column Mean
```

Missing text values are replaced with:

```
Unknown
```

### Concepts Used

- fillna()
- mean()
- select_dtypes()

---

# 📝 Task 5 — Group & Compare

### Objective

Perform grouped analysis.

### Operations

Calculates:

Average Final Grade (G3)

grouped by

```
Study Time
```

Also displays:

Top 3 students with highest final grades.

### Concepts Used

- groupby()
- mean()
- nlargest()

---

# 📝 Task 6 — Full EDA Report

### Objective

Generate a quick exploratory data analysis report.

### Displays

- Dataset shape
- Missing values
- Statistical summary

### Concepts Used

- describe()
- isnull()
- sum()

---

# 📝 Task 7 — Feature Engineering (Grade Binning)

### Objective

Convert numerical grades into letter grades.

Uses:

```python
pd.cut()
```

### Grade Mapping

| Score | Letter Grade |
|--------|--------------|
| 0–9 | F (Fail) |
| 10–11 | D (Pass) |
| 12–13 | C (Satisfactory) |
| 14–15 | B (Good) |
| 16–20 | A (Excellent) |

Also prints grade distribution.

### Concepts Used

- Feature Engineering
- pd.cut()
- value_counts()

---

# 📝 Task 8 — Pivot Tables

### Objective

Summarize grades across multiple categories.

Creates a pivot table showing:

Average Final Grade

based on

- Gender
- Internet Access

### Concepts Used

- pivot_table()
- aggfunc='mean'

---

# 📝 Task 9 — Correlation Analysis

### Objective

Identify which numerical features are most related to the final grade.

Calculates correlation matrix and displays:

- Highest positive correlations
- Highest negative correlations

### Concepts Used

- corr()
- sort_values()

---

# 📝 Task 10 — DataFrame Merging

### Objective

Combine two DataFrames.

Creates a second DataFrame containing school metadata:

| School | Type | Funding |
|---------|------|----------|
| GP | Public | High |
| MS | Private | Medium |

Then merges it with the student dataset.

### Concepts Used

- merge()
- Left Join

---

# 📚 Python Concepts Covered

- Variables
- Arrays
- DataFrames
- CSV Reading
- Missing Data Handling
- Aggregation
- Grouping
- Feature Engineering
- Pivot Tables
- Correlation Analysis
- DataFrame Merging

---

# 📊 Libraries Used

## NumPy

Used for:

- Numerical calculations
- Mean
- Standard deviation
- Boolean indexing

Official documentation:

https://numpy.org/doc/

---

## Pandas

Used for:

- DataFrames
- CSV handling
- Cleaning data
- Grouping
- Pivot tables
- Correlation
- Merging

Official documentation:

https://pandas.pydata.org/docs/

---

# 🚀 Skills Demonstrated

✔ NumPy Basics

✔ Pandas Fundamentals

✔ Data Cleaning

✔ Exploratory Data Analysis

✔ Feature Engineering

✔ Data Aggregation

✔ Pivot Tables

✔ Correlation Analysis

✔ Data Merging

✔ Real Dataset Analysis

---

# 📌 Future Improvements

Possible extensions include:

- Data visualization using Matplotlib
- Data visualization using Seaborn
- Machine Learning prediction models
- Interactive dashboard using Streamlit
- Exporting reports to Excel or PDF

---

# 👨‍💻 Author

Developed as a hands-on Python Data Analysis project using **NumPy** and **Pandas** to demonstrate essential data analysis techniques with real-world student performance data.

---
# Day 4:🎓 Student Performance Analysis & Prediction

This repository contains a complete end-to-end Machine Learning pipeline that analyzes student performance factors and predicts exam scores using a Multiple Linear Regression model. 

Built with **Python**, **Pandas**, **Matplotlib**, and **Scikit-Learn**, this project dives deep into exploratory data analysis (EDA), visualizes key trends, and exports a trained predictive model.

---



## 🚀 Project Overview

The main objective of this project is to answer two critical questions:
1.  **Which student factors (e.g., study hours, attendance, parental involvement) best explain exam scores?**
2.  **How accurately can we predict a student's final exam score based on these metrics?**

The script takes a dataset (`StudentPerformanceFactors.csv`), cleans it, generates multiple statistical visualizations, trains a predictive regression model, and finally saves the trained model (`saved_exam_score_model.pkl`) for future deployment.

---

## ✨ Key Features

* **Automated Quality Checks:** Identifies missing values, outliers (e.g., Attendance < 50, Study Hours > 35), and duplicate rows.
* **Correlation Analysis:** Automatically extracts the top positive and negative relationships with exam scores.
* **Rich Data Visualization:** Exports high-quality `.png` charts to easily digest data distributions and trends.
* **Custom Feature Engineering:** Bins numeric data (like continuous study hours) into categorical bins to identify non-linear trends.
* **Machine Learning:** Tests multiple train-test splits and utilizes Multiple Linear Regression.

---

## 📊 Exploratory Data Analysis (EDA)

Before training our model, we visualized the dataset to understand the underlying patterns. 

### Data Distributions
Understanding the spread of our data is crucial. Most students study around 15–25 hours and maintain solid attendance, though outliers exist.

| Hours Studied Distribution | Attendance Distribution | Score & Study Spread (Boxplot) |
| :---: | :---: | :---: |
| ![Hours Studied](01_hours_studied_histogram.png) | ![Attendance](01_attendance_histogram.png) | ![Spread](01_feature_boxplot.png) |

### Identifying Key Relationships
We looked at how categorical and continuous variables impact final scores. Unsurprisingly, **Hours Studied** shows a strong positive correlation with exam success.

**Hours Studied vs. Exam Score:**
![Study Hours vs Score Scatter](01_hours_studied_vs_exam_score_scatter.png)

**Average Score Trends:**
We binned the study hours to see the average score jump per study bracket. The upward trajectory is distinct.
![Study Time Trend](01_exam_score_trend_by_study_time.png)

**Custom Binned Analysis (Compared to Mean):**
![Custom Study Time Analysis](02_custom_styled_average_by_study_time.png)

### Categorical Impacts
Does school type or parental involvement change the average outcome?
| School Type Impact | Parental Involvement Impact |
| :---: | :---: |
| ![School Type](01_average_exam_score_by_school_type.png) | ![Parental Involvement](01_parental_involvement_score.png) |

---

## 🤖 Predictive Modeling

We built a **Multiple Linear Regression** model using Scikit-Learn to predict the `Exam_Score`. 

**Training Details:**
* **Target Variable:** `Exam_Score`
* **Features Used:** All numeric columns (e.g., `Hours_Studied`, `Attendance`, `Previous_Scores`, `Tutoring_Sessions`, `Physical_Activity`, `Sleep_Hours`).
* **Train/Test Split:** Evaluated across 10%, 20%, and 30% holdout sets to find the optimal balance (lowest RMSE).
* **Output:** The model is serialized as a `.pkl` file for immediate inference without retraining.

---

## 📈 Model Evaluation

To ensure our model isn't just memorizing data, we evaluate its predictions against the unseen test set.

### 1. Actual vs. Predicted Scores
The model tracks the red dashed line (perfect prediction) closely, indicating a strong capability to forecast real scores based on student behavior.
![Actual vs Predicted Scores](06_actual_vs_predicted.png)

### 2. Residual Diagnostics (Homoscedasticity)
A good model should have random errors (residuals) scattered around zero. The plot below shows our model's errors are relatively balanced, meaning it doesn't consistently over-predict or under-predict across different score ranges.
![Residuals vs Predicted](08_residuals_vs_predicted.png)

---

## 💻 Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/student-performance-analysis.git](https://github.com/yourusername/student-performance-analysis.git)
   cd student-performance-analysis

 # Day 5:# CloudWatch Server Resource Anomaly Predictor

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
