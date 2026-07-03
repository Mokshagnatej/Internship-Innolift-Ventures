# 📊 NumPy & Pandas Practice Exercises

## 📖 Overview

This repository contains six beginner-friendly Python exercises that cover the fundamentals of **NumPy** and **Pandas**. These tasks are designed to help understand how to work with arrays, DataFrames, CSV files, missing values, grouping data, and performing basic Exploratory Data Analysis (EDA).

These exercises are perfect for students who are starting with data analysis using Python.

---

# 📂 Exercises Included

## 1️⃣ NumPy Marks Analyser

### Objective

Create a NumPy array containing marks of 10 students and calculate useful statistics.

### Concepts Covered

- Creating NumPy arrays
- Mean
- Maximum & Minimum
- Standard Deviation
- Boolean Filtering
- Counting values

### What the program does

- Stores marks in a NumPy array.
- Calculates the average marks.
- Finds the highest and lowest marks.
- Computes the standard deviation.
- Counts how many students passed (marks ≥ 50).
- Prints a simple summary report.

### Sample Output

```
Average Marks : 65.3
Highest Marks : 92
Lowest Marks  : 38
Passed        : 8
Failed        : 2
```

---

## 2️⃣ DataFrame Builder

### Objective

Create a Pandas DataFrame manually and perform basic inspection.

### Concepts Covered

- Creating DataFrames
- Viewing rows
- Checking shape
- Viewing data types
- Adding new columns

### What the program does

- Creates a DataFrame of 5 students.
- Displays the first few rows.
- Shows the shape of the DataFrame.
- Displays each column's data type.
- Adds a new column named **Result** that labels students as **Pass** or **Fail** based on marks.

### Sample Output

| Name | Age | City | Marks | Result |
|------|-----|------|-------|--------|
| Alice | 20 | New York | 85 | Pass |
| Bob | 21 | Chicago | 45 | Fail |

---

## 3️⃣ CSV Explorer

### Objective

Learn how to load and inspect a CSV file.

### Concepts Covered

- Reading CSV files
- Viewing rows
- Column names
- Dataset shape
- Value counts

### What the program does

- Loads the **student-mat.csv** dataset.
- Displays:
  - Dataset shape
  - Column names
  - First three rows
  - Last three rows
- Counts how many students have internet access.

### Functions Used

- `pd.read_csv()`
- `head()`
- `tail()`
- `value_counts()`

---

## 4️⃣ Missing Data Detective

### Objective

Handle missing values in a dataset.

### Concepts Covered

- Detecting null values
- Filling missing numeric values
- Filling missing text values

### What the program does

- Finds missing values in every column.
- Replaces missing numeric values with the column mean.
- Replaces missing text values with **Unknown**.
- Verifies that no missing values remain.

### Functions Used

- `isnull()`
- `fillna()`
- `select_dtypes()`

---

## 5️⃣ Group & Compare

### Objective

Analyze student performance using grouping operations.

### Concepts Covered

- GroupBy
- Mean
- Sorting
- Largest values

### What the program does

- Calculates average final grade (**G3**) by study time.
- Calculates average grade by gender.
- Finds the top 5 students based on final grade.

### Functions Used

- `groupby()`
- `mean()`
- `nlargest()`

---

## 6️⃣ Full EDA Report

### Objective

Create a reusable function for basic Exploratory Data Analysis.

### Concepts Covered

- Functions
- Data inspection
- Descriptive statistics
- Missing value analysis
- Categorical analysis

### What the program does

The `eda_report(df)` function automatically displays:

- Dataset shape
- Missing values
- Statistical summary
- Value counts for categorical columns

This function can be reused for any dataset.

Example:

```python
eda_report(df)
```

---

# 🛠 Technologies Used

- Python 3
- NumPy
- Pandas

---

# 📁 Recommended Folder Structure

```
Project/
│
├── student-mat.csv
├── cloudwatch_server_resource_anomaly_predictor_100k.csv
├── numpy_marks.py
├── dataframe_builder.py
├── csv_explorer.py
├── missing_data.py
├── group_compare.py
├── eda_report.py
└── README.md
```

---

# ▶️ How to Run

### Install the required libraries

```bash
pip install numpy pandas
```

### Run any Python file

```bash
python numpy_marks.py
```

or

```bash
python eda_report.py
```

---

# 🎯 Learning Outcomes

After completing these exercises, you will be able to:

- Create and manipulate NumPy arrays.
- Build and modify Pandas DataFrames.
- Read and explore CSV datasets.
- Detect and handle missing values.
- Perform group-based analysis.
- Generate a basic EDA report for any dataset.
- Understand essential data analysis workflows in Python.

---

# 💡 Notes

- Ensure the CSV files are in the same folder as your Python scripts.
- If your dataset has different column names, update the code accordingly.
- The EDA function is reusable and can be applied to any CSV file loaded into a Pandas DataFrame.

---

# 📚 Conclusion

These exercises provide a practical introduction to Python-based data analysis using NumPy and Pandas. They cover common tasks such as creating arrays and DataFrames, reading CSV files, cleaning missing data, grouping records, and summarizing datasets. Together, they form a solid foundation for further learning in data analysis, machine learning, and data science.