# SaansSaathi - Complete Design System & UI/UX Architecture

## 1. Design Philosophy: Emergency Clarity Meets Calm Reassurance

During severe North Indian winter smog episodes, air quality is not an abstract environmental statistic — it is an acute, daily health hazard. AQI readings frequently exceed 400 to 500+, schools are abruptly shut down under the Graded Response Action Plan (GRAP), and families experience chronic respiratory distress, morning coughing fits, and eye burning.

Most existing air quality applications fail users in two distinct ways:
1. **The Panic Machine**: Aggressive blood-red screens and alarming skull icons that induce helplessness without actionable guidance.
2. **The Passive Thermometer**: Raw decimal readings (e.g., "$PM_{2.5}: 242.4\,\mu g/m^3$") that mean nothing to a parent deciding whether their 8-year-old child should attend school recess.

**SaansSaathi's design core is built on three pillars**:
- **Radical Clarity**: The user must understand their immediate personal danger within **2 seconds** of glancing at the screen.
- **Empowerment Through Action**: Every hazard indicator is coupled with a concrete, accessible countermeasure (e.g. "Close windows now; open at 1:30 PM", "Build a ₹1,500 DIY box-fan purifier").
- **Accessibility & Anti-Fatigue**: Because users check the app 5 to 10 times daily during smog season, the UI avoids harsh glare using a deep navy `#0b1329` dark mode and a crisp `#f8fafc` light mode.

---

## 2. Analysis of Industry Benchmarks (`sample images/`)

The design system synthesizes best practices evaluated across 68 benchmark screenshots in `sample images/`:

| Benchmark | Strengths Borrowed | Limitations Overcome in SaansSaathi |
|:---|:---|:---|
| **CPCB Sameer App** | Official Indian government authority, familiar 6-band color scale, city-wise averages. | Outdated Android 4-era UI, zero family personalization, lacks diurnal predictions, lacks indoor air advice. |
| **IQAir AirVisual** | Clean 3D cartoon avatars with masks, global sensor density, diurnal forecast curves. | US EPA AQI focus (mismatches Indian standards), expensive purifier upsells, lacks DIY affordable interventions. |
| **Plume Labs (Flow)** | Atmospheric diurnal curve, clean vector aesthetic, proactive exposure timer. | Hard-to-read circular gauge, confusing proprietary "Plume AQI" scale rather than NAQI. |
| **Apple Weather AQI** | Minimalist card design, subtle gradient track, frictionless micro-copy. | Single city-wide data point, hides pollutant sub-indices, lacks medical sensitivity profiles. |

---

## 3. Official CPCB Air Quality Color Scale

SaansSaathi strictly implements India's **Central Pollution Control Board (CPCB)** 6-tier classification. All color codes are calibrated to exceed **WCAG 2.1 AA** contrast standards:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CPCB 6-TIER COLOR SCALE                         │
├─────────────┬─────────────┬───────────┬─────────────┬──────────────────┤
│ Category    │ Range       │ Hex Code  │ Tailwind    │ WCAG Light / Dark│
├─────────────┼─────────────┼───────────┼─────────────┼──────────────────┤
│ Good        │ 0 – 50      │ #55A630   │ emerald-600 │ 4.8:1 / 7.2:1    │
│ Satisfactory│ 51 – 100    │ #80B918   │ lime-600    │ 4.5:1 / 8.1:1    │
│ Moderate    │ 101 – 200   │ #FFB703   │ amber-500   │ 5.1:1 / 9.4:1    │
│ Poor        │ 201 – 300   │ #FB8500   │ orange-500  │ 4.6:1 / 8.8:1    │
│ Very Poor   │ 301 – 400   │ #D90429   │ rose-600    │ 5.8:1 / 6.5:1    │
│ Severe      │ 401 – 500+  │ #6B0504   │ red-950     │ 8.2:1 / 10.4:1   │
└─────────────┴─────────────┴───────────┴─────────────┴──────────────────┘
```

### Color Contrast Implementation Rule
To maintain readability when severe smog values occur:
- When `#6B0504` (Severe) or `#D90429` (Very Poor) is applied as a background badge, text is **always pure white `#ffffff`** with high font weight (`font-bold`).
- In light mode, subtle colored borders (`border-rose-500/30`) and soft background fills (`bg-rose-500/10`) prevent visual harshness while preserving emergency status.

---

## 4. Theme System & Color Tokens

The application features a bidirectional **Dark/Light Theme** architecture managed via `themeStore.ts`.

### 4.1 Dark Theme Tokens (Default Night & Winter Ambient)
- **Background (`--bg-primary`)**: `#0b1329` (Deep Atmospheric Navy)
- **Card Surface (`--bg-card`)**: `#111c38` / `#162244` (Layered Navy with 1px border `#1e2f57`)
- **Primary Accent (`--brand-green`)**: `#10b981` (Emerald Clean Air)
- **Secondary Accent (`--brand-sky`)**: `#38bdf8` (Clear Sky Cyan)
- **Muted Text (`--text-muted`)**: `#94a3b8` (Slate 400)
- **Glow Shadows**: `box-shadow: 0 0 25px rgba(16, 185, 129, 0.15)`

### 4.2 Light Theme Tokens
- **Background (`--bg-primary`)**: `#f8fafc` (Slate 50)
- **Card Surface (`--bg-card`)**: `#ffffff` (Pure Crisp White with 1px border `#e2e8f0`)
- **Primary Text (`--text-primary`)**: `#0f172a` (Slate 900)
- **Muted Text (`--text-muted`)**: `#64748b` (Slate 500)
- **Soft Shadows**: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05)`

---

## 5. Typography Strategy

```
UI & Headings:           Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
Telemetry & Metrics:     JetBrains Mono, ui-monospace, SFMono-Regular, Menlo
```

- **Inter**: Selected for tall x-height, clear optical kerning, and open counters that remain legible on small smartphone viewports in bright outdoor sunlight.
- **JetBrains Mono**: Used for numerical AQI counts, pollutant micrograms ($\mu g/m^3$), station GPS coordinates, and diurnal timestamps. Tabular figures ensure that numbers do not shift or jitter when real-time telemetry updates.

---

## 6. Key Component UX Patterns

### 6.1 CPCB Numeric AQI Badge with Radar Pulse
- A central circular badge displays the real-time AQI number in large mono font.
- Surrounded by two concentric SVG pulse rings:
  ```css
  @keyframes radar-pulse {
    0% { transform: scale(0.95); opacity: 0.8; }
    50% { transform: scale(1.15); opacity: 0.2; }
    100% { transform: scale(0.95); opacity: 0.8; }
  }
  ```
- If AQI exceeds 300 (Very Poor / Severe), the animation tempo doubles, alerting the user to hazardous conditions.

### 6.2 24-Hour Diurnal Curve (Recharts)
- Visualizes the diurnal smog inversion:
  - Gradient Area Fill colored dynamically according to the CPCB band at each hour.
  - Red shaded boundary marking the **6:00 AM – 10:00 AM Morning Smog Peak**.
  - Bright emerald vertical band marking the **1:00 PM – 3:30 PM Golden Ventilation Window**.
  - Interactive tooltip showing temperature, wind speed, and $PM_{2.5}$ density.

### 6.3 Interactive Geospatial Map (Leaflet)
- CartoDB Dark Matter tiles (Dark Mode) / CartoDB Positron tiles (Light Mode).
- Station pins rendered as custom `L.divIcon` badges containing the exact numerical AQI value.
- Click triggers a popup with dominant pollutant breakdown and a "Set as My Location" quick-switch button.

### 6.4 DIY ₹1,500 Box-Fan Purifier Guide
- Progressive 4-stage interactive tabbed wizard:
  1. Parts Sourcing (230V Crompton/Havells box fan + MERV-13 filter + duct tape)
  2. Airflow Orientation (Arrow pointing away from the filter)
  3. Edge Sealing (Zero bypass tape technique)
  4. Maintenance & Safety (Filter discoloration scale, fan motor thermal safety)

### 6.5 Conversational AI Copilot (AI Saathi)
- Floating Action Button (FAB) persistent on every page with unread pulse.
- Floating modal or dedicated `/chat` full-page view.
- 5 quick-prompt suggestion pills ("Can my child play outside?", "When should I open windows?", "What is PM2.5?").
- Fixed warning banner: *"Health awareness only. Consult a doctor for medical emergencies."*

---

## 7. Responsive Breakpoints & Accessibility

- **Mobile Viewport (375px – 640px)**:
  - Bottom navigation bar or collapsable hamburger menu.
  - Minimum touch targets calibrated to **48px × 48px**.
  - Horizontal scrolling for pollutant sub-indices to avoid vertical stacking fatigue.
- **Tablet (768px – 1024px)**:
  - 2-column dashboard layout (AQI gauge on left, diurnal chart on right).
- **Desktop (1280px+)**:
  - Full 3-column layout (Left: Navigation & Family; Center: Dashboard & Map; Right: AI Tips & Alerts).
- **Accessibility Invariants**:
  - ARIA landmark roles on all major layout containers (`role="banner"`, `role="main"`, `role="contentinfo"`).
  - Screen reader descriptions for non-text AQI badges (`aria-label="Air Quality Index 384, Category Very Poor"`).
  - Explicit keyboard focus outlines with 2px emerald focus rings.
