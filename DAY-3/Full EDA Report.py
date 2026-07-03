import sys
import pandas as pd
from pathlib import Path

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
s_path = Path(__file__).parent / "student-mat.csv"
if not s_path.exists():
    s_path = Path("student-mat.csv")
if not s_path.exists():
    print(f"Error: {s_path} not found. Place 'student-mat.csv' in the script folder or CWD.")
    sys.exit(1)
df1 = pd.read_csv(s_path)
eda_report(df1)

# Test on CloudWatch Dataset
cw_path = Path("cloudwatch_server_resource_anomaly_predictor_100k.csv")
if cw_path.exists():
    df2 = pd.read_csv(cw_path)
    eda_report(df2)
else:
    print(f"\nNote: {cw_path} not found — skipping CloudWatch EDA.")