import numpy as np
import pandas as pd

# Define the path to your main dataset
CSV_FILE = 'student-mat.csv'

# Load the main dataset once to use across multiple tasks
try:
    df_main = pd.read_csv(CSV_FILE, sep=';')
except FileNotFoundError:
    print(f"\n[!] Warning: '{CSV_FILE}' not found. Tasks 3, 5, 6, 7, 8, 9, and 10 will be skipped.")
    df_main = pd.DataFrame() # Empty fallback

print("\n" + "="*40)
print(" 01 NumPy Marks Analyser")
print("="*40)
marks = np.array([45, 88, 52, 90, 33, 67, 78, 49, 95, 60])
print(f"Mean: {marks.mean():.2f} | Highest: {marks.max()} | Lowest: {marks.min()}")
print(f"Standard Deviation: {marks.std():.2f}")
print(f"Students Passed (>=50): {(marks >= 50).sum()}/10")

print("\n" + "="*40)
print(" 02 DataFrame Builder")
print("="*40)
df_students = pd.DataFrame({
    'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
    'age': [20, 21, 19, 22, 20],
    'city': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
    'marks': [85, 42, 78, 90, 48]
})
df_students['result'] = np.where(df_students['marks'] >= 50, 'Pass', 'Fail')
print("Updated DataFrame with Result:\n", df_students)

print("\n" + "="*40)
print(" 03 CSV Explorer")
print("="*40)
if not df_main.empty:
    print(f"Shape: {df_main.shape}")
    print("\nFirst 3 rows:\n", df_main.head(3))
    print("\nInternet Access Counts:\n", df_main['internet'].value_counts())

print("\n" + "="*40)
print(" 04 Missing Data Detective")
print("="*40)
df_missing = pd.DataFrame({
    'student_id': [1, 2, 3, 4, 5],
    'math_score': [85.0, np.nan, 90.5, 70.0, np.nan],
    'comments': ['Great', np.nan, 'Good', np.nan, 'Needs focus']
})
# Fill numeric with mean, text with 'Unknown'
num_cols = df_missing.select_dtypes(include=['number']).columns
df_missing[num_cols] = df_missing[num_cols].fillna(df_missing[num_cols].mean())
text_cols = df_missing.select_dtypes(include=['object']).columns
df_missing[text_cols] = df_missing[text_cols].fillna('Unknown')
print("Cleaned DataFrame:\n", df_missing)

print("\n" + "="*40)
print(" 05 Group & Compare")
print("="*40)
if not df_main.empty:
    print("\nAvg G3 by Study Time:\n", df_main.groupby('studytime')['G3'].mean())
    print("\nTop 3 Students by G3 Grade:\n", df_main.nlargest(3, 'G3')[['age', 'sex', 'studytime', 'G3']])

print("\n" + "="*40)
print(" 06 Full EDA Report")
print("="*40)
def eda_report(dataframe):
    if dataframe.empty: return
    print(f"Shape: {dataframe.shape}\n")
    print("--- Null Values ---\n", dataframe.isnull().sum().head(), "...\n")
    print("--- Numeric Summary ---\n", dataframe.describe().iloc[:, :4], "...\n")

if not df_main.empty:
    print("Testing eda_report() on main dataset:")
    eda_report(df_main)

print("\n" + "="*40)
print(" 07 Feature Engineering (Binning)")
print("="*40)
if not df_main.empty:
    bins = [-1, 9, 11, 13, 15, 20]
    labels = ['F (Fail)', 'D (Pass)', 'C (Satisfactory)', 'B (Good)', 'A (Excellent)']
    df_main['Grade_Letter'] = pd.cut(df_main['G3'], bins=bins, labels=labels)
    print("Mapping 0-20 scores to Letter Grades:")
    print(df_main[['age', 'G3', 'Grade_Letter']].head())
    print("\nGrade Distribution:")
    print(df_main['Grade_Letter'].value_counts().sort_index())

print("\n" + "="*40)
print(" 08 Pivot Tables")
print("="*40)
if not df_main.empty:
    pivot = pd.pivot_table(
        df_main, 
        values='G3', 
        index='sex', 
        columns='internet', 
        aggfunc='mean'
    )
    print("Average Final Grade (G3) by Sex and Internet Access:")
    print(pivot)

print("\n" + "="*40)
print(" 09 Correlation Analysis")
print("="*40)
if not df_main.empty:
    numeric_df = df_main.select_dtypes(include=[np.number])
    correlations = numeric_df.corr()['G3'].sort_values(ascending=False)
    print("Top Positive Correlations with Final Grade (G3):")
    print(correlations.head(4))
    print("\nTop Negative Correlations with Final Grade (G3):")
    print(correlations.tail(3))

print("\n" + "="*40)
print(" 10 DataFrame Merging")
print("="*40)
if not df_main.empty:
    school_metadata = pd.DataFrame({
        'school': ['GP', 'MS'],
        'school_type': ['Public', 'Private'],
        'funding_level': ['High', 'Medium']
    })
    print("Secondary DataFrame (School Metadata):")
    print(school_metadata)
    
    merged_df = pd.merge(df_main, school_metadata, on='school', how='left')
    print("\nMerged Data (First 4 rows showing new columns):")
    print(merged_df[['school', 'school_type', 'funding_level', 'age', 'G3']].head(4))