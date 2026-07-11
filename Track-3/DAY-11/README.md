# CloudWatch — Server Resource Anomaly Predictor

A lightweight, web-based server monitoring system built with **Flask** that tracks CPU, memory, disk, and network usage in real time and automatically detects abnormal resource patterns — instead of relying on rigid, fixed-threshold alerts.

---

## 📌 Overview

Most small and medium server environments rely on manual checks or static threshold alarms to catch problems, which often means issues are discovered only after they've caused downtime. CloudWatch continuously monitors server resource metrics, learns each server's normal behavior pattern, and flags meaningful deviations early — all through a clean, real-time web dashboard.

---

## ✨ Features

- 🔐 **Admin Authentication** — secure login and session-based access
- 📊 **Real-Time Metrics Dashboard** — live CPU, memory, disk, and network usage
- 🧠 **Anomaly Detection Engine** — statistical, pattern-based detection (not just fixed thresholds)
- 🚨 **Alerts & Notifications** — instant on-dashboard alerts with a timestamped history log
- 📈 **Historical Trends & Reports** — review past usage and past anomalies
- 📱 **Responsive UI** — built with HTML, CSS (Flexbox/Grid), and JavaScript

---

## 🏗️ Architecture

```
Client Browser (HTML/CSS/JS Dashboard)
            │
            ▼
   Flask Web Server (Routes / render_template / Jinja2)
            │
   ┌────────┴─────────┐
   ▼                   ▼
Metrics Collection   Anomaly Detection Engine
   │                   │
   ▼                   ▼
Database Layer      Alert & Notification Module
   │                   │
   └────────┬──────────┘
            ▼
   Dashboard Visualization Layer
            ▲
            │
   Monitored Server(s) / Infrastructure
```

---

## ⚙️ Workflow

1. Start monitoring service
2. Collect server metrics (CPU, memory, disk, network)
3. Preprocess and clean the data
4. Store metrics in the database
5. Analyze data using the anomaly detection engine
6. **Anomaly detected?**
   - **Yes →** generate alert, notify dashboard
   - **No →** mark as normal, update trend
7. Update the real-time dashboard
8. Wait for next polling interval and repeat

---

## 🛠️ Tech Stack

| Layer               | Technology                                  |
|---------------------|----------------------------------------------|
| Backend Framework   | Flask (Python)                               |
| Templating          | Jinja2                                       |
| Frontend            | HTML5, CSS3 (Flexbox/Grid), JavaScript       |
| Metrics Collection  | Python (`psutil`)                            |
| Database            | SQLite / SQLAlchemy                          |
| Charts              | JavaScript (Canvas-based live charts)        |

---

## 📂 Project Structure

```
cloudwatch/
├── app.py                 # Main Flask application & routes
├── modules/                # Metrics collection & anomaly detection logic
├── database/                # Data models & DB access
├── templates/               # Jinja2 HTML templates
│   ├── base.html
│   ├── login.html
│   ├── dashboard.html
│   ├── alerts.html
│   └── reports.html
├── static/
│   ├── css/                 # Stylesheets
│   ├── js/                  # Dashboard scripts (fetch, charts, events)
│   └── img/                 # Icons/images
└── requirements.txt
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone <repo-url>
cd cloudwatch

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the application
flask run
```

Then open `http://127.0.0.1:5000` in your browser.

---

## 📋 Modules

| Module | Responsibility |
|---|---|
| Authentication Module | Admin login and session management |
| Metrics Collection Module | Samples CPU, memory, disk, network usage |
| Data Storage Module | Persists metrics history and alert logs |
| Anomaly Detection Engine | Flags deviations from learned normal behavior |
| Alert & Notification Module | Creates and surfaces alerts |
| Dashboard & Visualization Module | Real-time cards, charts, and alert panels |
| Reporting Module | Historical trends and summarized health reports |

---

## 🔮 Future Enhancements

- Machine learning–based predictive anomaly detection
- Multi-server / multi-cluster monitoring from one dashboard
- Email/SMS/push notifications for critical alerts
- Role-based access control for multiple admins
- Exportable PDF/Excel health reports
- Docker-based deployment
- Mobile companion app

---

## 📄 License

This project is intended for educational/academic use. Add a license of your choice here (e.g., MIT).