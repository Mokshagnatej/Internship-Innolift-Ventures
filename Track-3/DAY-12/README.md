<div align="center">
  <h1>🛡️ CloudWatch</h1>
  <p><b>Next-Generation Server Resource Anomaly Detection System</b></p>
  <p><i>Predictive AIOps for modern infrastructure. Catch downtime before it happens.</i></p>
</div>

---

## 🚀 The Vision

Modern digital services rely on stable infrastructure, but traditional monitoring relies on static, fixed thresholds that create constant **alert fatigue** or miss critical issues entirely. 

**CloudWatch** bridges the gap between raw metrics and intelligent observability. By leveraging **Machine Learning (Isolation Forest)**, CloudWatch learns a server's unique behavior, shifting infrastructure management from *reactive alerting* to *predictive AIOps*.

## 💡 Key Differentiators

* 🧠 **Zero-Config ML Detection:** Abandons rigid thresholds. Our unsupervised Isolation Forest model dynamically adapts to multivariate time-series data (CPU, RAM, Disk, Network) to flag true anomalies.
* ⚡ **Lightweight & Self-Hosted:** No enterprise SaaS vendor lock-in. Minimal-overhead `psutil` agents feed a snappy Flask/SQLite backend, perfect for custom fleets and on-premise control.
* 🎯 **Two-Tier Intelligent Alerting:** Reduces noise. Moderate deviations trigger visual dashboard warnings, while high-confidence anomalies generate actionable, persisted critical alerts.
* 📊 **Unified Real-Time Dashboard:** A responsive, grid-based UI built with semantic HTML5 and Vanilla JS for instant root-cause visibility.

## 🛠️ Technical Architecture

CloudWatch is built on a robust, lightweight stack designed for rapid data ingestion and immediate ML scoring.

* **Application Layer:** Python / Flask (WSGI, Blueprints, REST API)
* **Data Layer:** SQLite3 (Fully normalized 3NF schema)
* **Machine Learning Engine:** `scikit-learn` (Isolation Forest)
* **Frontend Presentation:** HTML5, CSS3 (Grid/Flexbox), JavaScript (DOM/Fetch API), Jinja2
* **Telemetry Agents:** Python `psutil` 

### Data Flow & Processing
1.  **Ingestion:** Agents continuously push JSON metric payloads to secure REST endpoints.
2.  **Preprocessing:** Flask handles rolling windows, missing-value handling, and scaling.
3.  **Inference:** The ML model evaluates the multivariate window, assigning an anomaly confidence score.
4.  **Response:** The database is updated, alerts are triggered, and the DOM instantly reflects the new state via AJAX polling.

## 🗄️ Core Database Schema

Our relational design ensures zero data duplication and lightning-fast dashboard queries:
* `Users` / `Servers`: Secure management and asset tracking.
* `Metrics`: Granular time-series resource readings.
* `Anomalies` / `Alerts`: ML scoring results tied directly to actionable incident response states.
* `Thresholds`: Optional manual overrides for baseline customization.

---


