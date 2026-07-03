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

For example:
```bash
python Numberguess.py

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
