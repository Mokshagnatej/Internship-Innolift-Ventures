# Internship at Innolift Ventures

A structured record of my internship work at **Innolift Ventures**, covering Python fundamentals, data analysis, machine learning, time-series anomaly detection, model comparison, and notebook-based reporting.

The repository is organized into two learning tracks. Track 1 builds the foundation from Python basics to complete ML projects. Track 2 continues into anomaly-detection experiments, visualization, validation, and model evaluation.

## Tech Stack

| Area | Tools and Libraries |
| --- | --- |
| Programming | Python |
| Data Analysis | NumPy, Pandas |
| Visualization | Matplotlib, Seaborn |
| Machine Learning | Scikit-learn |
| Model Saving | Pickle, Joblib |
| Notebooks | Jupyter Notebook, Google Colab |
| Focus Areas | EDA, regression, classification, anomaly detection, model comparison |

## Table of Contents

- [Repository Structure](#repository-structure)
- [Track 1: Python, Data Analysis, and ML Foundations](#track-1-python-data-analysis-and-ml-foundations)
- [Track 2: Anomaly Detection and Model Evaluation](#track-2-anomaly-detection-and-model-evaluation)
- [Key Skills Practiced](#key-skills-practiced)
- [How to Run](#how-to-run)

## Repository Structure

```text
.
|-- README.md
|-- Track-1/
|   |-- DAY-1/   # Developer profile card
|   |-- DAY-2/   # Control flow, loops, and logic
|   |-- DAY-3/   # NumPy and Pandas student analysis
|   |-- DAY-4/   # Student performance prediction
|   `-- DAY-5/   # CloudWatch anomaly predictor
|-- Track-2/
|   |-- DAY-6/   # ML experiments notebook
|   |-- DAY-7/   # CloudWatch anomaly visualization
|   |-- DAY-8/   # Pipeline impact and iteration report
|   `-- DAY-9/   # Anomaly model comparison
`-- model.pkl
```

## Track 1: Python, Data Analysis, and ML Foundations

Track 1 begins with core Python concepts and moves toward practical machine learning projects using real and synthetic datasets.

| Day | Project | Summary | Main Concepts |
| --- | --- | --- | --- |
| [Day 1](Track-1/DAY-1) | Developer Profile Card | Built a formatted terminal profile card using personal details. | Variables, strings, numbers, booleans, formatted output |
| [Day 2](Track-1/DAY-2) | Control Flow and Logic Scripts | Created small interactive programs including ATM PIN checking, even/odd sorting, grade calculation, multiplication tables, and number guessing. | Loops, conditionals, functions, lists, `random` |
| [Day 3](Track-1/DAY-3) | Student Data Analysis | Used NumPy and Pandas to analyze student performance data through cleaning, grouping, pivot tables, correlations, and DataFrame merging. | NumPy, Pandas, CSV handling, EDA, feature engineering |
| [Day 4](Track-1/DAY-4) | Student Performance Prediction | Built an end-to-end regression workflow to analyze student factors and predict exam scores. | EDA, Matplotlib, regression, train/test split, model export |
| [Day 5](Track-1/DAY-5) | CloudWatch Server Resource Anomaly Predictor | Converted time-series server metrics into rolling statistical windows and trained a Random Forest anomaly classifier. | Time-series features, Random Forest, evaluation metrics, model serialization |

### Track 1 Highlights

- Built beginner-friendly Python programs from scratch.
- Practiced data cleaning, aggregation, pivot tables, and correlation analysis.
- Created visualizations to understand student-performance patterns.
- Trained and saved machine learning models for later prediction.
- Developed a complete anomaly-detection workflow for CloudWatch-style server metrics.

### Day 5 Verified Model Result

The CloudWatch anomaly predictor used an 80/20 stratified split and achieved:

```text
Accuracy: 0.9862

Confusion matrix:
[[ 134   33]
 [   9 2863]]
```

The model detects anomalous windows very well, but some normal windows are still flagged as anomalies. This is an important real-world monitoring tradeoff because false alerts can reduce trust in the alerting system.

## Track 2: Anomaly Detection and Model Evaluation

Track 2 expands the anomaly-detection work through notebooks, visualization, model comparison, reporting, and deeper evaluation.

| Day | Project | Summary | Main Concepts |
| --- | --- | --- | --- |
| [Day 6](Track-2/DAY-6) | Machine Learning Experiments Notebook | Explored anomaly data loading, spam classification, and movie genre prediction with hyperparameter tuning. | TfidfVectorizer, classifiers, GridSearchCV |
| [Day 7](Track-2/DAY-7) | CloudWatch Data Anomaly Visualization | Built a notebook-based visualization that highlights values above a selected anomaly threshold. | Matplotlib, base64 rendering, notebook visualization |
| [Day 8](Track-2/DAY-8) | Pipeline Impact and Iteration Report | Compared baseline and updated anomaly-detection pipeline performance. | One-hot encoding, weighted metrics, cross-validation, Joblib |
| [Day 9](Track-2/DAY-9) | Anomaly Detection Model Comparison | Compared Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting on a windowed anomaly dataset. | Model comparison, imbalance analysis, leakage detection |

### Track 2 Highlights

- Compared multiple machine learning classifiers.
- Added weighted precision, recall, and F1-score evaluation.
- Used confusion matrices for visual diagnostics.
- Investigated class imbalance and misleading accuracy.
- Identified likely data leakage through the `source_file` feature.

### Day 9 Model Comparison

| Model | Accuracy | Precision (weighted) | Recall (weighted) | F1 (weighted) | Anomaly Recall |
| --- | ---: | ---: | ---: | ---: | ---: |
| Logistic Regression | 0.9444 | 0.8919 | 0.9444 | 0.9174 | 0.00 |
| Decision Tree | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.00* |
| Random Forest | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.00* |
| Gradient Boosting | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 1.00* |

`*` The perfect tree-based model scores are likely inflated by data leakage from `source_file`.

Important conclusion:

- Logistic Regression reached high weighted accuracy but detected zero anomalies.
- Tree-based models reached perfect scores, but the result is likely not trustworthy until leakage is removed.
- Accuracy alone is not enough for imbalanced anomaly-detection problems.

Recommended next improvements:

1. Remove or safely transform `source_file`.
2. Use group-aware splitting so the same source file does not appear in both train and test sets.
3. Handle class imbalance with class weights, resampling, or anomaly-focused metrics.
4. Save only fitted models as production artifacts.
5. Regenerate final reports after leakage and imbalance checks are fixed.

## Key Skills Practiced

- Python programming fundamentals
- Control flow, loops, functions, and lists
- NumPy arrays and numerical analysis
- Pandas DataFrames and CSV processing
- Missing-value handling
- Exploratory data analysis
- Feature engineering
- Data visualization
- Regression and classification modeling
- Time-series feature extraction
- Random Forest modeling
- Model evaluation with accuracy, precision, recall, F1-score, and confusion matrices
- Cross-validation
- Model serialization with Pickle and Joblib
- Jupyter Notebook and Google Colab workflows
- Debugging data schema and environment issues
- Understanding class imbalance and data leakage

## How to Run

Clone the repository and move into the project folder:

```bash
git clone https://github.com/Mokshagnatej/Internship-Innolift-Ventures.git
cd Internship-Innolift-Ventures
```

Run a Python script from its day folder:

```bash
python filename.py
```

For Python 3 environments:

```bash
python3 filename.py
```

Install dependencies for projects that include a `requirements.txt` file:

```bash
pip install -r requirements.txt
```

Open notebook files (`.ipynb`) in Jupyter Notebook, JupyterLab, VS Code, or Google Colab.

## Notes

- Each day folder contains its own files and README documentation.
- This root README provides the high-level portfolio view.
- For detailed implementation notes, datasets, outputs, and project-specific instructions, open the linked day folders.

## Day 10: Anomaly Detection Model Comparison

This notebook compares multiple machine learning models for an anomaly detection classification task. The dataset contains engineered time-series window features, and the target column is `anomaly`.

### Objective

The goal of this task is to train, evaluate, and compare different classification models for detecting anomalies using numerical signal-based features. The notebook also selects the best-performing model and saves it for future use.

### Dataset Overview

The notebook loads the dataset from:

```python
/content/dataset.csv
```

The dataset contains:

- 15,192 rows
- 22 original columns
- 20 final model features after removing `anomaly` and `source_file`
- Target column: `anomaly`

Important feature columns include:

- `window_length`
- `duration_minutes`
- `sampling_interval_minutes`
- `value_mean`
- `value_std`
- `value_min`
- `value_max`
- `value_median`
- `value_q25`
- `value_q75`
- `value_range`
- `value_iqr`
- `value_first`
- `value_last`
- `value_trend`
- `value_abs_diff_mean`
- `value_abs_diff_std`
- `value_max_jump`
- `value_energy`
- `peak_to_mean_ratio`

The `source_file` column is removed before training to avoid data leakage.

### Workflow

1. Load the dataset using Pandas.
2. Separate features and target:
   - `X`: all columns except `anomaly` and `source_file`
   - `y`: `anomaly`
3. Apply one-hot encoding using `pd.get_dummies`.
4. Split the data into training and testing sets:
   - Training data: 12,153 rows
   - Testing data: 3,039 rows
   - Test size: 20%
   - Random state: 42
5. Train four classification models.
6. Evaluate the models using accuracy, precision, recall, F1-score, confusion matrices, and cross-validation.
7. Save the best model as `best_model.pkl`.

### Models Used

The following models are trained and compared:

- Logistic Regression
- Decision Tree Classifier
- Random Forest Classifier
- Gradient Boosting Classifier

### Model Performance

| Model | Training Accuracy | Test Accuracy | Cross-Validation Mean Accuracy | Cross-Validation Std Dev |
|---|---:|---:|---:|---:|
| Logistic Regression | 0.945199 | 0.944390 | 0.945116 | 0.000204 |
| Decision Tree | 1.000000 | 0.984863 | 0.984696 | 0.002969 |
| Random Forest | 1.000000 | 0.988812 | 0.988810 | 0.002181 |
| Gradient Boosting | 0.992101 | 0.988154 | 0.987740 | 0.002841 |

### Classification Results

Logistic Regression achieved good overall accuracy, but it struggled with the minority class because of class imbalance. Its classification report showed that it failed to detect class `0` anomalies properly.

The tree-based models performed much better:

- Decision Tree reached 98.49% test accuracy.
- Random Forest reached the highest test accuracy at 98.88%.
- Gradient Boosting reached 98.82% test accuracy.

### Best Model

The notebook selects the Random Forest Classifier as the best model because it gives the strongest overall performance:

- Highest test accuracy
- Strong cross-validation score
- Good resistance to noise compared with a single decision tree
- Better anomaly detection performance than Logistic Regression

The trained Random Forest model is saved as:

```text
Track-2/DAY-10/best_model.pkl
```

### Generated Outputs

The notebook creates or saves the following outputs when run:

- `model_comparison.csv`
- `confusion_matrix.png`
- `confusion_matrix_model1.png`
- `confusion_matrix_model2.png`
- `best_model.pkl`
- `model_comparison.py`
- `report.pdf`

Only the files present in the Day 10 folder are included in the repository snapshot.

### Requirements

The notebook uses the following Python libraries:

- pandas
- numpy
- scikit-learn
- matplotlib
- seaborn
- joblib
- fpdf

Install the dependencies with:

```bash
pip install pandas numpy scikit-learn matplotlib seaborn joblib fpdf
```

### How to Run

1. Open `Track-2/DAY-10/Day_10.ipynb` in Jupyter Notebook or Google Colab.
2. Make sure `dataset.csv` is available at `/content/dataset.csv`, or update the path in the notebook.
3. Run all cells from top to bottom.
4. Check the model comparison results, confusion matrices, and saved model output.

### Conclusion

After removing the `source_file` column to prevent data leakage, the models were evaluated using only numerical signal features. Logistic Regression generalized consistently but struggled with the minority class. The tree-based models performed much better, with Random Forest giving the best test accuracy and cross-validation performance.

The final recommended model for this anomaly detection task is:

```text
Random Forest Classifier
```
