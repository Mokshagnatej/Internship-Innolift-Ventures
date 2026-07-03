import numpy as np

marks = np.array([78, 56, 89, 45, 67, 92, 38, 74, 51, 63])

print("Marks:", marks)

print("Mean:", np.mean(marks))
print("Highest:", np.max(marks))
print("Lowest:", np.min(marks))
print("Standard Deviation:", np.std(marks))

passed = marks >= 50
print("Students Passed:", np.sum(passed))

print("\nSummary Report")
print("----------------")
print("Average Marks:", np.mean(marks))
print("Highest Marks:", np.max(marks))
print("Lowest Marks:", np.min(marks))
print("Passed:", np.sum(passed))
print("Failed:", len(marks) - np.sum(passed))