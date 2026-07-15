# DAY-15 — CloudWatch Server Resource Anomaly Predictor

A dark ops-center dashboard with live metric streaming, iOS-style toggle switches, and a reactive ML Predictor Engine panel.

## Design system

All colours, typography, and spacing are driven by CSS custom properties in `src/styles/theme.css`. To restyle the dashboard, edit the variables in `:root` — no component code needs to change.

| Token | Role |
|---|---|
| `--background` | Page canvas |
| `--card` | Card surfaces |
| `--primary` | Accent / active states |
| `--chart-1..5` | Metric & alert colours |
| `--border` | All borders |
| `--muted-foreground` | Secondary text |

## Fonts

Defined in `src/styles/fonts.css` (Google Fonts import).

- **Inter** (`font-sans`) — all UI text, labels, headings
- **JetBrains Mono** (`font-mono`) — data values, metric labels, code-style text

## Features

- Live streaming sparklines (2 s interval, sine-wave noise)
- Per-region load factors — switching region regenerates all data
- iOS spring toggles with elastic squish, Web Audio snap, and haptic feedback
- Predictor Engine glows purple when ML Engine is on; dims when off
- Settings: Sound Effects, Compact Mode (live layout change), High Contrast (CSS var override)
- Dynamic summary badges (Anomalies / Warnings / Predictions) derived from live values
