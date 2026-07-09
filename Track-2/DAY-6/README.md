# Machine Learning Experiments Notebook

## Description
This Jupyter Notebook contains a series of machine learning demonstrations and experimental modeling techniques. The notebook is divided into three main sections: loading time-series data for anomaly detection, classifying text data (spam vs. ham) using various algorithms, and applying Grid Search for hyperparameter tuning on a movie dataset.

## Requirements
To run the code in this notebook, you will need the following Python libraries:
* `pandas`
* `scikit-learn`

## Notebook Sections

### 1. CloudWatch Server Resource Anomaly Predictor
* **Objective:** Load and inspect server resource data for anomaly prediction.
* **Details:** The notebook attempts to load a `dataset.csv` file containing time-series metrics such as `window_length`, `duration_minutes`, `value_mean`, and binary `anomaly` labels. It outputs the foundational dataframe structure and dataset information.

### 2. Text Classification (Spam Detection)
* **Objective:** Build and compare models to classify text messages as 'spam' or 'ham'.
* **Details:** * **Preprocessing:** Handles missing values and encodes categorical labels.
  * **Feature Extraction:** Converts text data into numerical feature vectors using `TfidfVectorizer`.
  * **Model Training & Evaluation:** Trains multiple classifiers and outputs accuracy and classification reports for each:
    * Logistic Regression
    * Decision Tree Classifier
    * Support Vector Machine (SVM)
    * K-Nearest Neighbors (KNN)
  * *Note:* If the intended text dataset is missing, the code automatically defaults to a built-in dummy dataset to allow execution to continue.

### 3. Movie Genre Prediction & Hyperparameter Tuning
* **Objective:** Predict movie genres based on release year and user ratings, and demonstrate hyperparameter optimization.
* **Details:**
  * Uses a dataset featuring movie titles, genres, release dates, and vote averages.
  * Encodes the target variable (genres) using `LabelEncoder`.
  * Employs `GridSearchCV` on a Decision Tree Classifier to identify the best hyperparameter combination (`max_depth`, `min_samples_split`).

## Important Notes & Troubleshooting
* **Dummy Data Fallback:** The notebook is designed with error handling that generates small, hardcoded dummy datasets if the required external CSV files (e.g., `dataset.csv`, `spam.csv`) are not found in the environment. This ensures the modeling logic can still be demonstrated.
* **Evaluation Warnings:** When the notebook falls back to the extremely small dummy datasets, you may see `UndefinedMetricWarning` (for Precision/Recall) or `UserWarning` during Cross-Validation. This is expected behavior due to the lack of sufficient samples to properly split and stratify the data across all classes.