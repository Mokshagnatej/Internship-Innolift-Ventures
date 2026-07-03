import pandas as pd

def eda_report(df):

    print("=" * 50)

    print("Shape")
    print(df.shape)

    print("\nMissing Values")
    print(df.isnull().sum())

    print("\nNumeric Summary")
    print(df.describe())

    print("\nCategorical Columns")

    cat_cols = df.select_dtypes(include="object").columns

    for col in cat_cols:
        print(f"\nColumn: {col}")
        print(df[col].value_counts())

# Test on Student Dataset
df1 = pd.read_csv("student-mat.csv")
eda_report(df1)

# Test on CloudWatch Dataset
df2 = pd.read_csv("cloudwatch_server_resource_anomaly_predictor_100k.csv")
eda_report(df2)