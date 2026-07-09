Day 9 — Anomaly Detection Model Comparison

Objective

Train and compare four classifiers (Logistic Regression, Decision Tree, Random Forest,
Gradient Boosting) on a windowed time-series anomaly detection dataset, and identify
the strongest candidate model.

Dataset


15,192 rows, 21 engineered features (window statistics: mean, std, min/max,
quantiles, trend, energy, etc.) + a source_file identifier + the anomaly label.
After one-hot encoding, feature count grows to 77 (mostly from source_file).
Split: 80/20 train/test → 12,153 train rows, 3,039 test rows.
Class balance (test set): 169 anomalies vs. 2,870 normal rows (5.6% positive class).
This is a strongly imbalanced dataset, which changes how every metric below should be read.


Results

ModelAccuracyPrecision (wtd)Recall (wtd)F1 (wtd)Anomaly-class RecallLogistic Regression0.94440.89190.94440.91740.00Decision Tree1.00001.00001.00001.00001.00*Random Forest1.00001.00001.00001.00001.00*Gradient Boosting1.00001.00001.00001.00001.00*

*See Known Issues — these scores are very likely inflated by a leaked feature, not genuine model skill.

Cross-validation (5-fold) on the training set backs up the same pattern: Logistic Regression
sits at ~94.5% ± 0.02%, while the tree-based models land at 99.99–100.00% with near-zero variance.

Key Finding: the "94% vs 100%" story is misleading

Weighted accuracy/precision/recall look good for Logistic Regression and perfect for the
tree models, but weighted averages are dominated by the majority class here. Looking at the
per-class breakdown tells a different story:


Logistic Regression detects zero anomalies. Its classification report shows
0.00 precision/recall/F1 on class 0 (anomaly). It is simply predicting "normal" for
every row, which is enough to hit 94.4% accuracy on a 94.4%-normal dataset — that's not
a working detector, it's the majority-class baseline.
The tree models' perfect scores are very likely due to data leakage, not superior
modeling. The source_file column (one-hot encoded into the feature set) contains
values like artificialNoAnomaly/artificialNoAnomaly/art_da... — the folder name
encodes whether the entire file is anomaly-free. If anomaly status is constant
within a source file (common in benchmark datasets like NAB), a tree model can
perfectly classify every row just by learning which file it came from, without
extracting any real signal from the sensor statistics. Three unrelated model families
(Decision Tree, Random Forest, Gradient Boosting) all hitting an exact 1.0000 across
train/test/CV is a strong tell for this, not evidence the problem is "easy."


Bottom line: no model in this comparison should be trusted as-is. The honest
conclusion for today is "we found a likely leakage/imbalance problem," not "tree models win."

Known Issues (to fix before re-running comparisons)

#IssueImpact1source_file is one-hot encoded into the feature setLikely leaks the label directly to tree models2No class-imbalance handling (class_weight, resampling, or an anomaly-specific method)Metrics on the minority class are unreliable/misleading3best_model.pkl is saved from a freshly-instantiated, unfitted LogisticRegression()Saved model file is not usable4Comparison table in an early cell uses hardcoded stale accuracy valuesDead/confusing code (final CSV is correct because it's overwritten later)5model_comparison.py only covers 2 of the 4 models and uses a relative dataset.csv pathScript output is incomplete and not portable6Cross-validation / comparison sections are duplicated three times in the notebookHarder to read, no functional impact

Artifacts Produced Today


confusion_matrix_model1.png — Logistic Regression
confusion_matrix_model2.png — Decision Tree
model_comparison.csv — final metrics table (values are correct despite issue #4 above)
model_comparison.py — standalone script (incomplete, see issue #5)
best_model.pkl — currently broken, see issue #3


Recommended Next Steps


Drop source_file (or replace it with a leakage-safe derived feature) and re-run all
four models before drawing any conclusion about which one is "best."
If files map cleanly to anomaly/no-anomaly status, consider a group-aware split
(GroupShuffleSplit on source_file) so no file appears in both train and test.
Address class imbalance directly — class_weight="balanced", resampling (e.g. SMOTE),
or precision/recall-focused metrics (PR-AUC) instead of accuracy.
Fix the best_model.pkl save so it dumps the actually-fitted model.
Re-generate report.pdf once the above are addressed — the current version's
recommendation is not yet reliable.