# DAY-15 — CloudWatch Server Resource Anomaly Predictor

A fully integrated full-stack application featuring a dark ops-center dashboard with live metric streaming, iOS-style toggle switches, and a reactive ML Predictor Engine powered by a Flask backend.

---

## 🎯 What We Achieved Today

Today, we completely overhauled our application by transitioning from a basic server-side rendered UI to a modern, component-driven frontend exported directly from Figma. 

**Key Changes:**
- **Replaced Jinja2 Templates:** We permanently deleted the old HTML/CSS/JS frontend to eliminate technical debt and clutter.
- **Vite & React Integration:** We integrated a full React single-page application (SPA) natively compiled via Vite directly into our Flask setup.
- **Monorepo Restructuring:** We organized the workspace into a clean, professional `frontend/` (React) and backend (Flask) monorepo architecture.
- **Edge-to-Edge Layout:** We removed constraints (`max-w-7xl` and horizontal padding) to make the dashboard perfectly flush with the edges of the browser for a premium, immersive feel.
- **Real Database Authentication:** Replaced hard-coded mock logins with a secure SQLite backend utilizing hashed passwords.
- **Dynamic User Invitations:** Built an automated email engine using `Flask-Mail` and Google SMTP to dispatch secure, temporary passwords to new users.
- **Live User Management:** Wired the Settings dashboard to perform real-time CRUD operations against the database.
- **UI Streamlining:** Merged the standalone Login and Billing pages into the Hero and Settings pages, drastically reducing navigation clutter.

**Benefits of these Changes:**
- **Decoupled Architecture:** The UI and backend are completely separate. You can iterate on the Figma design and drop in the new code without ever touching the Python backend logic.
- **Enhanced User Experience:** We unlocked high-performance micro-animations (via Framer Motion), instant state updates without page reloads, and complex UI elements like iOS spring toggles and Web Audio API snaps.
- **Production-Ready Security:** The application now handles live sessions securely, segregates sensitive SMTP credentials into a `.env` file, and establishes the groundwork for role-based access control.

---

## 📂 Project Structure

This project has been restructured into a clean Frontend/Backend monolith:

```text
DAY-15/
│
├── frontend/                   # 🎨 The complete Vite/React application designed in Figma
│   ├── src/                    # React components, styles, and logic
│   ├── package.json            # Node dependencies
│   └── vite.config.ts          # Build configuration
│
├── app/                        # ⚙️ The Flask backend serving the frontend
│   ├── static/assets/          # Compiled CSS & JS from the React build
│   ├── templates/index.html    # The entry point linking to the React build
│   ├── __init__.py             # Flask App Factory with CORS and Mail integration
│   ├── models.py               # Database schemas (e.g., User model)
│   └── routes.py               # API endpoints (/predict, /api/login, /api/invite, /api/users)
│
├── machine_learning/           # 🧠 Core Random Forest ML models
├── backend/data/               # 💾 Secure local SQLite databases (app.db)
├── outputs/                    # 📊 Generated batch predictions & charts
├── scripts/                    # 🛠️ Python automation utilities (e.g., test_email.py)
├── backend/config.py           # 🔧 App Configuration & Environment Variables
├── backend/.env                # 🔒 Sensitive SMTP credentials and settings
└── backend/run.py              # 🚀 The entry point for the Flask server
```

---

## 🚀 How to Run the Application

1. **Environment Setup**
   Ensure you have configured your `/backend/.env` file with valid Google SMTP credentials (App Password) for the email invitation engine to function properly.

2. **Start the Backend Server**
   Navigate to the `backend` directory and start the Flask app:
   ```bash
   cd backend
   python3 run.py
   ```
   *The server will start on port `8081`. The API will be available for frontend requests.*

3. **Start the Frontend Development Server**
   In a separate terminal, navigate to the `frontend` directory:
   ```bash
   cd frontend
   npm run dev
   ```
   *You can view the dashboard by opening `http://localhost:5173` in your browser.*

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

## 🎨 UI Features & CSS Styling

### Why this CSS is Easy to Handle
This dashboard leverages a **Token-Driven CSS Architecture**. Instead of hunting through hundreds of lines of React components or utility classes to change a color or font, everything is centralized using CSS variables (`--tokens`). This makes theming incredibly easy to handle—you can completely re-skin the application just by changing a few hex codes in one file!

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
