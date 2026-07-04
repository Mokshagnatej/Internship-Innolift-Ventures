from __future__ import annotations

import pickle
from pathlib import Path

import matplotlib
import numpy as np

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "StudentPerformanceFactors.csv"
OUTPUT_DIR = BASE_DIR / "outputs"
MODEL_PATH = BASE_DIR / "saved_exam_score_model.pkl"


def section(title: str) -> None:
	print(f"\n=== {title} ===")


def load_dataset() -> pd.DataFrame:
	if not CSV_PATH.exists():
		raise FileNotFoundError(
			f"Could not find {CSV_PATH.name} in {BASE_DIR}. Place the CSV in the same folder as this script."
		)

	dataframe = pd.read_csv(CSV_PATH)
	dataframe.columns = [column.strip() for column in dataframe.columns]
	return dataframe


def prepare_output_dir() -> None:
	OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def save_figure(figure: plt.Figure, filename: str) -> Path:
	path = OUTPUT_DIR / filename
	figure.tight_layout()
	figure.savefig(path, dpi=160, bbox_inches="tight")
	plt.close(figure)
	return path


def build_study_bins(dataframe: pd.DataFrame, bins: int = 5) -> pd.Series:
	return pd.cut(dataframe["Hours_Studied"], bins=bins)


def create_png_charts(dataframe: pd.DataFrame) -> None:
	school_means = dataframe.groupby("School_Type", dropna=False)["Exam_Score"].mean().sort_values()
	scatter_frame = dataframe[["Hours_Studied", "Exam_Score"]].dropna()
	hour_hist = dataframe["Hours_Studied"].dropna()
	attendance_hist = dataframe["Attendance"].dropna()
	boxplot_frame = dataframe[["Hours_Studied", "Attendance", "Previous_Scores", "Exam_Score"]].dropna()
	trend_frame = (
		dataframe.assign(Study_Bin=build_study_bins(dataframe, bins=8))
		.groupby("Study_Bin", observed=True)["Exam_Score"]
		.mean()
		.reset_index()
	)
	category_means = (
		dataframe.groupby("Parental_Involvement", dropna=False)["Exam_Score"]
		.mean()
		.sort_values()
	)

	fig1, ax1 = plt.subplots(figsize=(9, 5))
	school_means.plot(kind="bar", color=["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"], ax=ax1)
	ax1.set_title("Average Exam Score by School Type")
	ax1.set_xlabel("School Type")
	ax1.set_ylabel("Average Exam Score")
	ax1.tick_params(axis="x", rotation=0)
	save_figure(fig1, "01_average_exam_score_by_school_type.png")

	fig2, ax2 = plt.subplots(figsize=(9, 5))
	ax2.scatter(scatter_frame["Hours_Studied"], scatter_frame["Exam_Score"], alpha=0.35, color="#6a5acd", edgecolors="none")
	ax2.set_title("Hours Studied vs Exam Score")
	ax2.set_xlabel("Hours Studied")
	ax2.set_ylabel("Exam Score")
	save_figure(fig2, "01_hours_studied_vs_exam_score_scatter.png")

	fig3, ax3 = plt.subplots(figsize=(9, 5))
	ax3.hist(hour_hist, bins=18, color="#ffb000", edgecolor="white")
	ax3.set_title("Distribution of Hours Studied")
	ax3.set_xlabel("Hours Studied")
	ax3.set_ylabel("Student Count")
	save_figure(fig3, "01_hours_studied_histogram.png")

	fig4, ax4 = plt.subplots(figsize=(10, 5))
	ax4.plot(trend_frame["Study_Bin"].astype(str), trend_frame["Exam_Score"], marker="o", linewidth=2.5, color="#0d9488")
	ax4.set_title("Average Exam Score Trend by Study Time Bin")
	ax4.set_xlabel("Study Time Bin")
	ax4.set_ylabel("Average Exam Score")
	ax4.tick_params(axis="x", rotation=35)
	save_figure(fig4, "01_exam_score_trend_by_study_time.png")

	fig5, ax5 = plt.subplots(figsize=(9, 5))
	attendance_hist.plot(kind="hist", bins=18, color="#8b5cf6", edgecolor="white", ax=ax5)
	ax5.set_title("Attendance Distribution")
	ax5.set_xlabel("Attendance")
	ax5.set_ylabel("Student Count")
	save_figure(fig5, "01_attendance_histogram.png")

	fig6, ax6 = plt.subplots(figsize=(10, 5))
	boxplot_frame.boxplot(ax=ax6)
	ax6.set_title("Score and Study Pattern Spread")
	ax6.set_ylabel("Value")
	save_figure(fig6, "01_feature_boxplot.png")

	fig7, ax7 = plt.subplots(figsize=(10, 5))
	category_means.plot(kind="bar", color="#14b8a6", ax=ax7)
	ax7.set_title("Average Exam Score by Parental Involvement")
	ax7.set_xlabel("Parental Involvement")
	ax7.set_ylabel("Average Exam Score")
	ax7.tick_params(axis="x", rotation=0)
	save_figure(fig7, "01_parental_involvement_score.png")


def create_custom_styled_chart(dataframe: pd.DataFrame) -> None:
	study_bins = pd.cut(dataframe["Hours_Studied"], bins=5)
	avg_by_bin = dataframe.assign(Study_Bin=study_bins).groupby("Study_Bin", observed=True)["Exam_Score"].mean()
	mean_score = dataframe["Exam_Score"].mean()

	colors = ["#083d77", "#1d70a2", "#38a3a5", "#57cc99", "#80ed99"]
	fig, ax = plt.subplots(figsize=(10, 5))
	avg_by_bin.plot(kind="bar", color=colors[: len(avg_by_bin)], ax=ax, label="Average Exam Score")
	ax.axhline(mean_score, color="#d62828", linestyle="--", linewidth=2, label=f"Mean Score: {mean_score:.2f}")
	ax.set_title("Custom Styled Chart: Average Exam Score by Study Time", pad=12)
	ax.set_xlabel("Study Time Bin")
	ax.set_ylabel("Average Exam Score")
	ax.legend()
	ax.tick_params(axis="x", rotation=35)
	save_figure(fig, "02_custom_styled_average_by_study_time.png")


def print_data_overview(dataframe: pd.DataFrame) -> None:
	section("00 Dataset Overview")
	print(f"Rows: {len(dataframe)} | Columns: {len(dataframe.columns)}")
	print("Columns:")
	print(", ".join(dataframe.columns))
	print("\nFirst 5 rows:")
	print(dataframe.head().to_string(index=False))
	print("\nMissing values:")
	missing = dataframe.isna().sum().sort_values(ascending=False)
	print(missing[missing > 0].to_string() if missing.any() else "None")
	print("\nNumeric summary:")
	print(dataframe.select_dtypes(include="number").describe().round(2).to_string())
	print("\nCategory counts:")
	for column in ["School_Type", "Gender", "Parental_Involvement", "Motivation_Level", "Internet_Access"]:
		if column in dataframe.columns:
			counts = dataframe[column].value_counts(dropna=False).head(5)
			print(f"\n{column}:")
			print(counts.to_string())


def print_back_to_back_csv_analysis(dataframe: pd.DataFrame) -> None:
	section("01 Back-to-Back CSV Insights")
	print("Top 5 exam scores:")
	print(dataframe.nlargest(5, "Exam_Score")[["Hours_Studied", "Attendance", "Previous_Scores", "Exam_Score"]].to_string(index=False))
	print("\nBottom 5 exam scores:")
	print(dataframe.nsmallest(5, "Exam_Score")[["Hours_Studied", "Attendance", "Previous_Scores", "Exam_Score"]].to_string(index=False))
	print("\nAverage exam score by school type:")
	print(dataframe.groupby("School_Type")["Exam_Score"].mean().round(2).to_string())
	print("\nAverage exam score by gender:")
	print(dataframe.groupby("Gender")["Exam_Score"].mean().round(2).to_string())
	print("\nAverage exam score by internet access:")
	print(dataframe.groupby("Internet_Access")["Exam_Score"].mean().round(2).to_string())
	print("\nAverage exam score by motivation level:")
	print(dataframe.groupby("Motivation_Level")["Exam_Score"].mean().round(2).to_string())


def print_feature_correlations(dataframe: pd.DataFrame) -> None:
	section("02 Feature Correlations")
	numeric_df = dataframe.select_dtypes(include="number")
	correlations = numeric_df.corr(numeric_only=True)["Exam_Score"].drop("Exam_Score").sort_values(ascending=False)
	print("Top positive relationships with Exam_Score:")
	print(correlations.head(5).round(3).to_string())
	print("\nTop negative relationships with Exam_Score:")
	print(correlations.sort_values().head(5).round(3).to_string())


def print_quick_quality_checks(dataframe: pd.DataFrame) -> None:
	section("03 Quick Quality Checks")
	print(f"Duplicate rows: {dataframe.duplicated().sum()}")
	print(f"Outlier-like rows with Hours_Studied > 35: {(dataframe['Hours_Studied'] > 35).sum()}")
	print(f"Outlier-like rows with Attendance < 50: {(dataframe['Attendance'] < 50).sum()}")
	print(f"Students with Exam_Score >= 90: {(dataframe['Exam_Score'] >= 90).sum()}")
	print(f"Students with Exam_Score < 60: {(dataframe['Exam_Score'] < 60).sum()}")


def train_numeric_model(dataframe: pd.DataFrame, test_size: float, random_state: int = 42):
	numeric_columns = dataframe.select_dtypes(include="number").columns.tolist()
	target_column = "Exam_Score"
	if target_column not in numeric_columns:
		raise ValueError("The dataset must contain a numeric Exam_Score column.")

	feature_columns = [column for column in numeric_columns if column != target_column]
	model_frame = dataframe[feature_columns + [target_column]].dropna()

	features = model_frame[feature_columns]
	target = model_frame[target_column]

	x_train, x_test, y_train, y_test = train_test_split(
		features,
		target,
		test_size=test_size,
		random_state=random_state,
	)

	model = LinearRegression()
	model.fit(x_train, y_train)
	predictions = model.predict(x_test)

	rmse = np.sqrt(mean_squared_error(y_test, predictions))
	r2 = r2_score(y_test, predictions)

	return {
		"model": model,
		"feature_columns": feature_columns,
		"x_train": x_train,
		"x_test": x_test,
		"y_train": y_train,
		"y_test": y_test,
		"predictions": predictions,
		"rmse": rmse,
		"r2": r2,
	}


def train_test_split_explorer(dataframe: pd.DataFrame) -> dict:
	section("06 Train-Test Split Explorer")
	results = []
	for test_size in (0.1, 0.2, 0.3):
		trained = train_numeric_model(dataframe, test_size=test_size)
		train_size = len(trained["x_train"])
		test_length = len(trained["x_test"])
		print(
			f"test_size={test_size:.1f} | train rows={train_size} | test rows={test_length} | "
			f"RMSE={trained['rmse']:.3f} | R^2={trained['r2']:.3f}"
		)
		results.append((test_size, trained))

	best_size, best_result = min(results, key=lambda item: item[1]["rmse"])
	print(f"Best split by lowest RMSE: test_size={best_size:.1f}")
	return best_result


def first_regression_and_model_save(dataframe: pd.DataFrame) -> dict:
	section("07 Your First Regression")
	trained = train_numeric_model(dataframe, test_size=0.2)
	print(f"RMSE: {trained['rmse']:.3f}")
	print(f"R^2: {trained['r2']:.3f}")
	coefficients = pd.Series(trained["model"].coef_, index=trained["feature_columns"]).sort_values(key=lambda series: series.abs(), ascending=False)
	print("Top model coefficients by absolute impact:")
	print(coefficients.head(8).round(3).to_string())

	medians = dataframe[trained["feature_columns"]].median(numeric_only=True)
	new_student = medians.to_dict()
	new_student.update(
		{
			"Hours_Studied": 26,
			"Attendance": 88,
			"Previous_Scores": 76,
			"Tutoring_Sessions": 2,
			"Physical_Activity": 4,
			"Sleep_Hours": 7,
		}
	)
	new_student_frame = pd.DataFrame([new_student], columns=trained["feature_columns"])
	predicted_score = trained["model"].predict(new_student_frame)[0]
	print(f"Predicted exam score for a new student: {predicted_score:.2f}")

	payload = {
		"model": trained["model"],
		"feature_columns": trained["feature_columns"],
		"feature_defaults": medians.to_dict(),
	}
	with open(MODEL_PATH, "wb") as model_file:
		pickle.dump(payload, model_file)
	print(f"Saved model to: {MODEL_PATH}")

	residuals = trained["y_test"] - trained["predictions"]
	print("Residual summary:")
	print(residuals.describe().round(3).to_string())

	return trained


def feature_comparison(dataframe: pd.DataFrame) -> None:
	section("08 Feature Comparison")
	candidate_features = [
		"Hours_Studied",
		"Attendance",
		"Previous_Scores",
		"Tutoring_Sessions",
	]

	comparison_rows = []
	for feature in candidate_features:
		subset = dataframe[[feature, "Exam_Score"]].dropna()
		x_train, x_test, y_train, y_test = train_test_split(
			subset[[feature]], subset["Exam_Score"], test_size=0.2, random_state=42
		)
		model = LinearRegression().fit(x_train, y_train)
		predictions = model.predict(x_test)
		rmse = np.sqrt(mean_squared_error(y_test, predictions))
		comparison_rows.append((feature, rmse))
		print(f"{feature:<18} RMSE: {rmse:.3f}")

	best_feature, best_rmse = min(comparison_rows, key=lambda item: item[1])
	print(f"Best single feature: {best_feature} with RMSE {best_rmse:.3f}")
	print("\nComparison ranking:")
	print(pd.DataFrame(comparison_rows, columns=["Feature", "RMSE"]).sort_values("RMSE").to_string(index=False))


def predict_vs_actual_plot(trained: dict) -> None:
	section("09 Predict vs Actual Plot")
	fig, ax = plt.subplots(figsize=(7, 7))
	ax.scatter(trained["y_test"], trained["predictions"], alpha=0.45, color="#2563eb")
	min_value = min(trained["y_test"].min(), trained["predictions"].min())
	max_value = max(trained["y_test"].max(), trained["predictions"].max())
	ax.plot([min_value, max_value], [min_value, max_value], color="#dc2626", linestyle="--", linewidth=2)
	ax.set_title("Actual vs Predicted Exam Scores")
	ax.set_xlabel("Actual Exam Score")
	ax.set_ylabel("Predicted Exam Score")
	save_figure(fig, "06_actual_vs_predicted.png")


def residual_plot(trained: dict) -> None:
	section("10 Residual Diagnostics")
	residuals = trained["y_test"] - trained["predictions"]
	fig, ax = plt.subplots(figsize=(8, 5))
	ax.scatter(trained["predictions"], residuals, alpha=0.4, color="#7c3aed")
	ax.axhline(0, color="#111827", linestyle="--", linewidth=1.5)
	ax.set_title("Residuals vs Predicted Exam Scores")
	ax.set_xlabel("Predicted Exam Score")
	ax.set_ylabel("Residual")
	save_figure(fig, "08_residuals_vs_predicted.png")
	print("Residual mean:", round(float(residuals.mean()), 3))
	print("Residual std:", round(float(residuals.std()), 3))


def prediction_examples(trained: dict) -> None:
	section("11 Example Predictions")
	feature_columns = trained["feature_columns"]
	base = trained["x_train"].median().to_frame().T
	variants = [
		{"Hours_Studied": 10, "Attendance": 60, "Previous_Scores": 55, "Tutoring_Sessions": 0, "Physical_Activity": 2},
		{"Hours_Studied": 22, "Attendance": 82, "Previous_Scores": 74, "Tutoring_Sessions": 2, "Physical_Activity": 4},
		{"Hours_Studied": 35, "Attendance": 95, "Previous_Scores": 90, "Tutoring_Sessions": 4, "Physical_Activity": 5},
	]
	sample_rows = []
	for variant in variants:
		row = base.iloc[0].to_dict()
		row.update(variant)
		sample_rows.append(row)
	sample_frame = pd.DataFrame(sample_rows, columns=feature_columns)
	predictions = trained["model"].predict(sample_frame)
	for index, prediction in enumerate(predictions, start=1):
		print(f"Student {index}: predicted Exam_Score = {prediction:.2f}")


def project_start_note() -> None:
	section("12 Mini Project Start")
	print("Project name: Matplotlib + Your First ML Model")
	print(f"Dataset: {CSV_PATH.name}")
	print("Target column: Exam_Score")
	print("Main question: Which student factors best explain exam score and which model predicts it most accurately?")
	print("Output location: DAY-4/outputs/")
	print("Saved model: DAY-4/saved_exam_score_model.pkl")


def main() -> None:
	prepare_output_dir()
	dataframe = load_dataset()

	print_data_overview(dataframe)
	print_back_to_back_csv_analysis(dataframe)
	print_feature_correlations(dataframe)
	print_quick_quality_checks(dataframe)

	section("04 Charts in One File")
	create_png_charts(dataframe)

	section("05 Custom Styled Chart")
	create_custom_styled_chart(dataframe)

	train_test_split_explorer(dataframe)
	trained_model = first_regression_and_model_save(dataframe)
	feature_comparison(dataframe)
	predict_vs_actual_plot(trained_model)
	residual_plot(trained_model)
	prediction_examples(trained_model)
	project_start_note()

	print("\nFinished. PNG files are saved in the outputs folder.")


if __name__ == "__main__":
	main()
