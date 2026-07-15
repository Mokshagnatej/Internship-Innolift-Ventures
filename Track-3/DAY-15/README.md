# DAY-15 — CloudWatch Server Resource Anomaly Predictor

A dark ops-center dashboard with live metric streaming, iOS-style toggle switches, and a reactive ML Predictor Engine panel.

## Restyling via CSS tokens

All colours, fonts, spacing, and radius are driven by CSS custom properties in `src/styles/theme.css`. To restyle the dashboard, edit the variables in `:root` — no component code changes needed.

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
| `--border` | `rgba(255,255,255,0.07)` | All borders |
| `--muted-foreground` | `#64748b` | Secondary text |

## Typography

Only two font faces are used — both imported in `src/styles/fonts.css`:

- **Inter** (`font-sans`) — all UI text: headings, labels, body, settings
- **JetBrains Mono** (`font-mono`) — data values, metric labels, timestamps, code-style text

To switch fonts, update the `@import` in `fonts.css` and the `--font-sans` / `--font-mono` tokens in `theme.css`.

## Features

- Live streaming sparklines (2s interval, sine-wave noise per region)
- 5 AWS regions with per-region load factors — switching regenerates all data
- iOS spring toggles: elastic squish, Web Audio API snap, haptic feedback
- Predictor Engine: purple neon glow when ML Engine on, dims when off
- Settings panel: Sound Effects, Compact Mode (live layout), High Contrast (CSS var override)
- Summary badges (Anomalies / Warnings / Predictions) derived live from metric values
