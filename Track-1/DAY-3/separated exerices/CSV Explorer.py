#!/usr/bin/env python3
from pathlib import Path
import sys
import pandas as pd


def main():
	p = Path(__file__).parent / "student-mat.csv"
	if not p.exists():
		p = Path("student-mat.csv")
	if not p.exists():
		print("Error: 'student-mat.csv' not found in script or CWD.")
		sys.exit(1)

	df = pd.read_csv(p)
	print("Shape:", df.shape)
	print("\nFirst 3 rows:\n", df.head(3).to_string(index=False))
	if "internet" in df.columns:
		print("\nInternet counts:\n", df["internet"].value_counts(dropna=False))


if __name__ == "__main__":
	main()