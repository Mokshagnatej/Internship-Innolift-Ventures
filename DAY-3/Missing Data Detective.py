import pandas as pd

df = pd.read_csv("student-mat.csv")

print("Missing Values")
print(df.isnull().sum())

# Fill numeric columns with mean
numeric_cols = df.select_dtypes(include="number").columns

for col in numeric_cols:
    df[col] = df[col].fillna(df[col].mean())

# Fill text columns with Unknown
text_cols = df.select_dtypes(include="object").columns

for col in text_cols:
    df[col] = df[col].fillna("Unknown")

print("\nMissing Values After Cleaning")
print(df.isnull().sum())