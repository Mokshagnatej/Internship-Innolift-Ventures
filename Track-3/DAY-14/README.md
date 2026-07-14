<div align="center">
  <h1>☁️ CloudWatch Server Resource Anomaly Predictor</h1>
  <p><strong>Structured End-to-End Integration Pipeline</strong></p>
  <p><em>Day 14: Bridging the gap between Data Science and Web Development</em></p>
</div>

<br>

## 🎯 Impactful Brief of Day 14

On Day 14, we successfully transformed our isolated machine learning model into a fully functional, professional-grade web application. We achieved a structured **end-to-end integration** pipeline bridging the gap between Data Science and Web Development. 

Specifically, we achieved the following milestones:
- 🏗️ **Implemented Application Factory:** Transitioned from a monolithic script to a modular Flask architecture, cleanly decoupling the web routes (`app/routes.py`) from machine learning code (`machine_learning/src/`).
- ⚙️ **Built the Backend:** Developed a robust Flask server with a `/predict` endpoint to process live HTTP POST requests, lazily loading artifacts for memory efficiency.
- 🎨 **Designed a Premium Frontend:** Created a stunning, responsive, glassmorphism-styled UI (`app/templates/index.html`) featuring organized metric groupings and micro-animations.
- ⚡ **Interactive Prototyping:** Added a **"Fill Sample Data"** button that dynamically generates randomized normal and anomalous profiles for rapid testing.
- 📊 **Batch Processing:** Implemented a robust `scripts/generate_outputs.py` pipeline that automatically evaluates the model on simulated data and exports detailed JSON/CSV reports, along with visual PNG charts using `matplotlib` and `seaborn`.

---

## 📂 Day 14 Project Structure

```text
DAY-14/
│
├── app/                        # Flask Web Application Package
│   ├── static/                 # CSS/JS Assets (Glassmorphism UI)
│   ├── templates/              # HTML Templates (index.html)
│   ├── __init__.py             # Flask App Factory setup
│   └── routes.py               # Application routing and /predict endpoint
│
├── data/                       # Datasets and Databases
│   └── expense.db              
│
├── machine_learning/           # Core ML Model & Artifacts
│   ├── artifacts/              # Serialized Models (e.g., .pkl)
│   └── src/                    # Data processing & model inference scripts
│
├── outputs/                    # Auto-generated batch processing results
│   ├── batch_predictions.csv
│   ├── batch_predictions.json
│   └── predictions_chart.png
│
├── scripts/                    # Automation and utility scripts
│   ├── generate_outputs.py     # Script to run bulk predictions
│   └── inspect_model.py        # Utility to analyze model features
│
├── config.py                   # Application configuration
├── run.py                      # Flask development server entry point
└── README.md                   # You are here!
```

---

## 🛠️ How to Use the Application

### 1. Start the Flask Server
Ensure you are in the `DAY-14` directory and run the application using the new entry point:
```bash
python3 run.py
```

### 2. Open the Web Interface
Open your browser and navigate to the local development server URL (running on port `8080` to avoid macOS conflicts):
```
http://localhost:8080
```

### 3. Generate a Prediction
- Click **"Fill Sample Data"** to automatically populate the 20 Server Resource fields with a randomized test profile. Watch for the green flash for normal data, and the red flash for anomalies!
- Click **"Generate Prediction"**. The application will instantly tell you if the system is **"Operating Normally"** or if an **"Anomaly is Detected"**.

---

## 📈 Batch Outputs & Visualizations

To test the model in bulk without using the web interface, you can generate batch predictions using our automation script:
```bash
python3 scripts/generate_outputs.py
```
This script evaluates several simulated server states and populates the `outputs/` folder with:
- 📝 `batch_predictions.csv`: Spreadsheet of metrics and predictions.
- 📄 `batch_predictions.json`: A JSON array format.
- 📊 `predictions_chart.png`: A high-quality bar chart visualizing the results.

---

## 🧠 How it Works & Values Needed

The CloudWatch Predictor uses a **Random Forest Classifier** trained on 20 statistical features derived from server resource metrics over specific time windows.

The metrics are logically grouped into three main categories on the frontend:
- 🕒 **Time Window Settings:** `window_length`, `duration_minutes`, `sampling_interval_minutes`
- 🔢 **Value Statistics (Core values):** `value_mean`, `value_std`, `value_min`, `value_max`, `value_median`, `value_q25`, `value_q75`, `value_range`, `value_iqr`
- 📈 **Temporal Dynamics & Volatility:** `value_first`, `value_last`, `value_trend`, `value_abs_diff_mean`, `value_abs_diff_std`, `value_max_jump`, `value_energy`, `peak_to_mean_ratio`

> [!WARNING]
> **Important Note on Volatility:** Altering the volatility metrics (`value_std`, `value_max_jump`, `peak_to_mean_ratio`) significantly will often trigger an **"Anomaly Detected! 🚨"** prediction, as the model recognizes unexpected spikes.

---

## 💡 What We Learn By Using This Model

By interacting with this integrated model, we gain several key insights:
1. **The Anatomy of an Anomaly:** We learn practically that server anomalies aren't just about high CPU or RAM (which would just be a high `value_max`). They are heavily defined by *volatility*—sudden shifts (`value_max_jump`), high variance (`value_std`), and erratic peaks (`peak_to_mean_ratio`).
2. **Feature Importance:** We see firsthand how machine learning relies on rolling window statistics rather than single data points to understand the "context" of a server's health.
3. **User-Centric AI:** We learn that a raw `.pkl` file holds no value for an end-user. Wrapping it in an intuitive, visual UI and structuring the backend properly is crucial for deploying data science into production environments.

---

## 🏭 How We Developed This Model

The development lifecycle of this model involved several phases:
1. 📥 **Data Ingestion:** We utilized a dataset composed of AWS CloudWatch metrics (e.g., EC2 CPU utilization, network traffic, RDS metrics).
2. ⚙️ **Feature Engineering:** Because raw time-series data is difficult for traditional classifiers to ingest, the data was transformed using sliding windows. 20 distinct statistical features (mean, standard deviation, interquartile ranges, etc.) were extracted for each window.
3. 🔬 **Model Selection & Training:** We evaluated various algorithms. **Random Forest** was selected for its high accuracy and robustness against overfitting.
4. 📦 **Serialization & Structuring:** The trained Random Forest model was serialized into a binary `.pkl` format and placed inside the `machine_learning/artifacts/` directory for our Flask Application Factory to consume.
5. 🚀 **Deployment:** The `.pkl` file was lazy-loaded into a Blueprint routing system, wrapped in a premium UI, creating the final production-ready product.
