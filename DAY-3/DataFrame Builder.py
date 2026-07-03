import pandas as pd

data = {
    "name": ["Alice", "Bob", "Charlie", "David", "Eva"],
    "age": [20, 21, 19, 22, 20],
    "city": ["New York", "Chicago", "Dallas", "Boston", "Miami"],
    "marks": [85, 45, 76, 91, 58]
}

df = pd.DataFrame(data)

print("First 5 Rows:")
print(df.head())

print("\nShape:")
print(df.shape)

print("\nData Types:")
print(df.dtypes)

df["result"] = df["marks"].apply(lambda x: "Pass" if x >= 50 else "Fail")

print("\nUpdated DataFrame")
print(df)