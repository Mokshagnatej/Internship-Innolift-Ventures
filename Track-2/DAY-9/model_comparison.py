import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

# 1. Data Preparation
df = pd.read_csv('dataset.csv')
X = df.drop('anomaly', axis=1)
y = df['anomaly']
X = pd.get_dummies(X, drop_first=True)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Model Selection & Training
# Model 1
lr = LogisticRegression(max_iter=1000)
lr.fit(X_train, y_train)
y_pred_lr = lr.predict(X_test)

# Model 2
dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)
y_pred_dt = dt.predict(X_test)

# 3. Evaluation
print('--- Logistic Regression Report ---')
print(classification_report(y_test, y_pred_lr))

print('\n--- Decision Tree Report ---')
print(classification_report(y_test, y_pred_dt))

# 4. Accuracy Comparison
print(f'Logistic Regression Accuracy: {accuracy_score(y_test, y_pred_lr):.4f}')
print(f'Decision Tree Accuracy: {accuracy_score(y_test, y_pred_dt):.4f}')
