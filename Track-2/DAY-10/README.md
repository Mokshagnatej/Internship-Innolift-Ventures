# Day 10 - Anomaly Detection Model Comparison

This notebook compares multiple machine learning models for an anomaly detection classification task. The dataset contains engineered time-series window features, and the target column is `anomaly`.

## Objective

The goal of this task is to train, evaluate, and compare different classification models for detecting anomalies using numerical signal-based features. The notebook also selects the best-performing model and saves it for future use.

## Dataset Overview

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

## Workflow

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

## Models Used

The following models are trained and compared:

- Logistic Regression
- Decision Tree Classifier
- Random Forest Classifier
- Gradient Boosting Classifier

## Model Performance

| Model | Training Accuracy | Test Accuracy | Cross-Validation Mean Accuracy | Cross-Validation Std Dev |
|---|---:|---:|---:|---:|
| Logistic Regression | 0.945199 | 0.944390 | 0.945116 | 0.000204 |
| Decision Tree | 1.000000 | 0.984863 | 0.984696 | 0.002969 |
| Random Forest | 1.000000 | 0.988812 | 0.988810 | 0.002181 |
| Gradient Boosting | 0.992101 | 0.988154 | 0.987740 | 0.002841 |

## Classification Results

Logistic Regression achieved good overall accuracy, but it struggled with the minority class because of class imbalance. Its classification report showed that it failed to detect class `0` anomalies properly.

The tree-based models performed much better:

- Decision Tree reached 98.49% test accuracy.
- Random Forest reached the highest test accuracy at 98.88%.
- Gradient Boosting reached 98.82% test accuracy.

## Best Model

The notebook selects the Random Forest Classifier as the best model because it gives the strongest overall performance:

- Highest test accuracy
- Strong cross-validation score
- Good resistance to noise compared with a single decision tree
- Better anomaly detection performance than Logistic Regression

The trained Random Forest model is saved as:

```text
best_model.pkl
```

## Generated Outputs

The notebook creates or saves the following outputs when run:

- `model_comparison.csv`
- `confusion_matrix.png`
- `confusion_matrix_model1.png`
- `confusion_matrix_model2.png`
- `best_model.pkl`
- `model_comparison.py`
- `report.pdf`

Only the files present in this folder are included in the repository snapshot.

## Requirements

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

## How to Run

1. Open `Day_10.ipynb` in Jupyter Notebook or Google Colab.
2. Make sure `dataset.csv` is available at `/content/dataset.csv`, or update the path in the notebook.
3. Run all cells from top to bottom.
4. Check the model comparison results, confusion matrices, and saved model output.

## Conclusion

After removing the `source_file` column to prevent data leakage, the models were evaluated using only numerical signal features. Logistic Regression generalized consistently but struggled with the minority class. The tree-based models performed much better, with Random Forest giving the best test accuracy and cross-validation performance.

The final recommended model for this anomaly detection task is:

```text
Random Forest Classifier
```
