import pandas as pd

df = pd.read_csv("student.csv")

print("Shape:")
print(df.shape)

print("\nColumn Names:")
print(df.columns)

print("\nFirst 3 Rows:")
print(df.head(3))

print("\nLast 3 Rows:")
print(df.tail(3))

print("\nInternet Access Count:")
print(df["internet"].value_counts())