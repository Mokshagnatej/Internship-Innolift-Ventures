# 📊 Student Data Analysis with NumPy & Pandas

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
