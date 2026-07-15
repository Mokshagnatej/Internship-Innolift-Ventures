# DAY-15 — CloudWatch Server Resource Anomaly Predictor

A fully integrated full-stack application featuring a dark ops-center dashboard with live metric streaming, iOS-style toggle switches, and a reactive ML Predictor Engine powered by a Flask backend.

## Project Structure

This project has been restructured into a clean Frontend/Backend monolith:

- `frontend/` — The complete Vite/React application designed in Figma.
- `app/` — The Flask backend application that serves the frontend and handles routing.
- `machine_learning/` — The core Random Forest ML models for anomaly prediction.
- `data/` — Local database for ML processing.
- `run.py` — The entry point for the Flask server.

## How to Run the Application

1. **Start the Backend Server**
   Ensure you are in the `DAY-15` directory and start the Flask app:
   ```bash
   python3 run.py
   ```
   *The server will start on port `8080`. You can view the dashboard by opening `http://localhost:8080` in your browser.*

2. **Updating the Frontend (Figma Exports)**
   If you make updates to the Figma design and export a new codebase, extract the `.zip` contents directly into the `frontend/` folder, then rebuild the assets:
   ```bash
   cd frontend
   npm install
   npm run build
   
   # Copy the built assets to the Flask static folder
   rm -rf ../app/static/assets/*
   cp -r dist/assets/* ../app/static/assets/
   ```
   *Note: You must also update `DAY-15/app/templates/index.html` with the new randomized filenames generated in `app/static/assets/`.*

---

## UI Features & Styling

### Restyling via CSS tokens

All colours, fonts, spacing, and radius are driven by CSS custom properties in `frontend/src/styles/theme.css`. To restyle the dashboard, edit the variables in `:root` — no component code changes needed.

| Token | Default | Role |
|---|---|---|
| `--background` | `#080b12` | Page canvas |
| `--card` | `#0d1117` | Card surfaces |
| `--primary` | `#00d9ff` | Active states, borders |
| `--chart-1` | `#00d9ff` | CPU / primary accent |
| `--chart-2` | `#34d399` | Network / normal status |
| `--chart-3` | `#f59e0b` | Disk / warning status |
| `--chart-4` | `#f43f5e` | Critical status |
| `--chart-5` | `#a78bfa` | Memory / ML engine |

### Typography

Only two font faces are used — both imported in `frontend/src/styles/fonts.css`:

- **Inter** (`font-sans`) — all UI text: headings, labels, body, settings
- **JetBrains Mono** (`font-mono`) — data values, metric labels, timestamps, code-style text

To switch fonts, update the `@import` in `fonts.css` and the `--font-sans` / `--font-mono` tokens in `theme.css`.

### Dashboard Capabilities

- Live streaming sparklines (2s interval, sine-wave noise per region)
- 5 AWS regions with per-region load factors — switching regenerates all data
- iOS spring toggles: elastic squish, Web Audio API snap, haptic feedback
- Predictor Engine: purple neon glow when ML Engine on, dims when off
- Settings panel: Sound Effects, Compact Mode (live layout), High Contrast (CSS var override)
- Summary badges (Anomalies / Warnings / Predictions) derived live from metric values
