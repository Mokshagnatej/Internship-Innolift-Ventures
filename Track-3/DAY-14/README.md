# Day 14: CloudWatch Server Resource Anomaly Predictor - End-to-End Integration

## 🎯 Impactful Brief of Day 14
On Day 14, we successfully transformed our isolated machine learning model into a fully functional, interactive web application. We achieved an **end-to-end integration** pipeline bridging the gap between Data Science and Web Development. 

Specifically, we:
1. **Resolved Environment Conflicts:** Overcame a `scikit-learn` version mismatch by rapidly retraining our Random Forest model on the active environment, ensuring stability.
2. **Built the Backend:** Developed a robust Flask server (`app.py`) with a dedicated `/predict` endpoint to process live HTTP POST requests.
3. **Designed a Premium Frontend:** Created a stunning, responsive, glassmorphism-styled UI (`templates/index.html`) using HTML/CSS.
4. **Connected the Pipeline:** Successfully routed 20 user-inputted system metrics from the web browser, through the Flask backend, into the `.pkl` machine learning model, and dynamically rendered the resulting predictions (Anomaly vs. Normal) back on the screen.

---

## 🛠 How to Use the Application

1. **Start the Flask Server**
   Ensure you are in the `DAY-14` directory and run the application:
   ```bash
   python3 app.py
   ```
2. **Open the Web Interface**
   Open your browser and navigate to the local development server URL:
   ```
   http://127.0.0.1:5000
   ```
3. **Generate a Prediction**
   Fill in the 20 Server Resource feature fields (or use the default baseline values provided in the form) and click **"Generate Prediction"**. The application will instantly tell you if the system is "Operating Normally" or if an "Anomaly is Detected".

---

## 📊 How it Works & Values Needed

The CloudWatch Predictor uses a **Random Forest Classifier** trained on 20 statistical features derived from server resource metrics over specific time windows.

When you fill out the web form, the backend collects the following variables:
- **Time/Window Metrics:** `window_length`, `duration_minutes`, `sampling_interval_minutes`
- **Statistical Aggregations (Core values):** `value_mean`, `value_std`, `value_min`, `value_max`, `value_median`
- **Distribution Metrics:** `value_q25`, `value_q75`, `value_range`, `value_iqr`
- **Temporal Metrics:** `value_first`, `value_last`, `value_trend`
- **Volatility Metrics:** `value_abs_diff_mean`, `value_abs_diff_std`, `value_max_jump`
- **Advanced Ratios:** `value_energy`, `peak_to_mean_ratio`

### Example Baseline Values for a "Normal" State:
If you want to test a normal server state, you can use these baseline values (which auto-populate in the form):
* `window_length`: 48
* `duration_minutes`: 235
* `sampling_interval_minutes`: 5
* `value_mean`, `value_min`, `value_max`, `value_median`, `value_q25`, `value_q75`, `value_first`, `value_last`: ~20
* `value_std`, `value_range`, `value_iqr`, `value_trend`, `value_max_jump`: 0
* `value_energy`: 400
* `peak_to_mean_ratio`: 1

*Note: Altering the volatility metrics (`value_std`, `value_max_jump`, `peak_to_mean_ratio`) significantly will often trigger an "Anomaly Detected! 🚨" prediction, as the model recognizes unexpected spikes.*

---

## 🧠 What We Learn By Using This Model

By interacting with this integrated model, we gain several key insights:
1. **The Anatomy of an Anomaly:** We learn practically that server anomalies aren't just about high CPU or RAM (which would just be a high `value_max`). They are heavily defined by *volatility*—sudden shifts (`value_max_jump`), high variance (`value_std`), and erratic peaks (`peak_to_mean_ratio`).
2. **Feature Importance:** We see firsthand how machine learning relies on rolling window statistics rather than single data points to understand the "context" of a server's health.
3. **User-Centric AI:** We learn that a raw `.pkl` file holds no value for an end-user. Wrapping it in an intuitive, visual UI is crucial for translating complex data science into actionable business intelligence.

---

## 🏗 How We Developed This Model

The development lifecycle of this model involved several phases:
1. **Data Ingestion:** We utilized a dataset composed of AWS CloudWatch metrics (e.g., EC2 CPU utilization, network traffic, RDS metrics).
2. **Feature Engineering:** Because raw time-series data is difficult for traditional classifiers to ingest, the data was transformed using sliding windows. 20 distinct statistical features (mean, standard deviation, interquartile ranges, etc.) were extracted for each window.
3. **Model Selection & Training:** We evaluated various algorithms (Logistic Regression, Decision Trees, Gradient Boosting). **Random Forest** was selected for its high accuracy and robustness against overfitting.
4. **Serialization:** The trained Random Forest model was serialized into a binary `.pkl` (pickle) format.
5. **Deployment:** The `.pkl` file was loaded into a Flask REST backend, wrapped in a UI, creating the final product you see today.
