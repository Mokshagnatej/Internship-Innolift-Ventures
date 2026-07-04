# 🎓 Student Performance Analysis & Prediction

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
