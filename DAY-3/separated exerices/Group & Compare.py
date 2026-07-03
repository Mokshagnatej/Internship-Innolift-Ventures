import sys
from pathlib import Path
import pandas as pd

# load CSV (script folder then CWD)
path = Path(__file__).parent / "student-mat.csv"
if not path.exists():
	path = Path("student-mat.csv")
if not path.exists():
	print("Error: student-mat.csv not found.")
	sys.exit(1)

df = pd.read_csv(path)

# Preferred columns
expected = {"G3", "studytime", "sex"}
if expected.issubset(df.columns):
	print("Average G3 by Study Time")
	print(df.groupby("studytime")["G3"].mean())

	print("\nAverage G3 by Gender")
	print(df.groupby("sex")["G3"].mean())

	print("\nTop 5 Students by G3")
	print(df.nlargest(5, "G3")[["G3", "studytime", "sex"]])
else:
	# Fallback: pick a numeric column and a categorical column if available
	num_cols = df.select_dtypes(include="number").columns
	cat_cols = df.select_dtypes(include="object").columns
	if len(num_cols) == 0:
		print("No numeric columns available to analyze.")
		sys.exit(0)
	val = num_cols[-1]
	print(f"Column G3 not found — using '{val}' instead for analysis.")
	if len(cat_cols) > 0:
		grp = cat_cols[0]
		print(f"Average {val} by {grp}")
		print(df.groupby(grp)[val].mean())
	else:
		print(f"Mean {val}:", df[val].mean())

	print(f"\nTop 5 rows by {val}")
	cols = [val]
	if len(cat_cols) > 0:
		cols = [val, cat_cols[0]]
	print(df.nlargest(5, val)[cols])