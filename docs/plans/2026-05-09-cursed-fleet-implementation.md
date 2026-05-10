# Cursed Fleet Visual Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade FIREPOWER V3 visually to a premium dark game UI ("Cursed Fleet" theme) without touching any JS logic.

**Architecture:** All changes confined to `index.html` (add fonts + SVG noise filter) and `style.css` (full visual overhaul). Zero changes to `src/` JS files.

**Tech Stack:** Vanilla HTML/CSS, Google Fonts (Cinzel Decorative, Crimson Pro, JetBrains Mono), CSS custom properties, CSS animations.

---

### Task 1: Add Google Fonts & SVG noise filter to index.html

**Files:**
- Modify: `index.html` (lines 3–7, add inside `<head>`)
- Modify: `index.html` (line 9, add SVG after `<body>`)

**Step 1: Add Google Fonts `<link>` in `<head>` after the charset meta**

Replace the existing `<head>` block (lines 1–8) with:

```html
<!doctype html>
<html lang="pl">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>FIREPOWER V3</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="./style.css">
  </head>
  <body>
    <svg width="0" height="0" style="position:absolute">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
        <feBlend in="SourceGraphic" mode="overlay" result="blend"/>
        <feComposite in="blend" in2="SourceGraphic" operator="in"/>
      </filter>
    </svg>
```

**Step 2: Open index.html in browser and verify fonts load (check Network tab — fonts.googleapis.com 200)**

---

### Task 2: Replace CSS custom properties and base body styles

**Files:**
- Modify: `style.css` (lines 1–27)

**Step 1: Replace `:root` and `body` blocks**

Replace lines 1–27 with:

```css
:root {
  color-scheme: dark;
  --bg: #08090b;
  --panel: #111318;
  --panel-soft: #161b22;
  --line: #1e252c;
  --line-hot: #2e3d48;
  --text: #eef3f5;
  --muted: #8a9aa5;
  --accent: #c8922a;
  --accent-glow: rgba(200, 146, 42, 0.35);
  --accent-2: #5a9ab5;
  --good: #6dc98a;
  --bad: #e07060;
  --shadow: 0 2px 0 rgba(200, 146, 42, 0.12), 0 24px 64px rgba(0, 0, 0, 0.55);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Crimson Pro', 'Segoe UI', system-ui, sans-serif;
  font-size: 1.05rem;
  background:
    radial-gradient(ellipse at 50% 0%, #161b22 0%, #08090b 60%, #050607 100%);
  color: var(--text);
}

button,
input,
textarea {
  font: inherit;
}
```

**Step 2: Reload browser, confirm body background is deep black with radial center glow**

---

### Task 3: Upgrade header — FIREPOWER title, eyebrow, separator, version pill

**Files:**
- Modify: `style.css` — replace `.app-shell`, `.topbar`, `.eyebrow`, `h1`, `h2`, `h3`, `.version-pill` blocks (lines 35–88)

**Step 1: Replace all heading + topbar styles**

Replace lines 35–88 with:

```css
.app-shell {
  width: min(1320px, calc(100% - 28px));
  margin: 0 auto;
  padding: 24px 0 40px;
}

.topbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 4px 0;
  margin-bottom: 4px;
}

.topbar-inner {
  position: relative;
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--accent);
  font-family: 'Cinzel', serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.35em;
  text-transform: uppercase;
}

h1,
h2,
h3,
p {
  margin-top: 0;
}

h1 {
  margin-bottom: 0;
  font-family: 'Cinzel Decorative', serif;
  font-size: clamp(2.2rem, 6vw, 4.4rem);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: 0.04em;
  color: var(--text);
  text-shadow:
    0 0 30px rgba(200, 146, 42, 0.6),
    0 0 80px rgba(200, 146, 42, 0.25),
    0 2px 4px rgba(0, 0, 0, 0.8);
}

h2 {
  font-family: 'Cinzel', serif;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h3 {
  color: var(--muted);
  font-family: 'Crimson Pro', serif;
  font-size: 0.9rem;
  font-style: italic;
}

/* Decorative header separator */
.topbar::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  margin-top: 20px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--accent) 20%,
    rgba(200, 146, 42, 0.6) 50%,
    var(--accent) 80%,
    transparent 100%
  );
}

.topbar-divider {
  display: flex;
  align-items: center;
  gap: 0;
  margin: 18px 0 22px;
  color: var(--accent);
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  opacity: 0.7;
}

.topbar-divider::before,
.topbar-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--accent));
}

.topbar-divider::after {
  background: linear-gradient(90deg, var(--accent), transparent);
}

.topbar-divider span {
  padding: 0 12px;
}

.version-pill {
  margin: 0 0 10px;
  padding: 6px 14px;
  border: 1px solid var(--accent);
  border-radius: 3px;
  background: rgba(200, 146, 42, 0.08);
  color: var(--accent);
  font-family: 'Cinzel', serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  box-shadow: 0 0 12px rgba(200, 146, 42, 0.15), inset 0 0 12px rgba(200, 146, 42, 0.05);
}
```

**Step 2: Add `.topbar-divider` element to index.html between `</header>` and `<section class="layout">`:**

```html
      </header>

      <div class="topbar-divider"><span>⚓</span></div>

      <section class="layout">
```

**Step 3: Reload browser — FIREPOWER title should now glow gold, eyebrow in Cinzel, decorative divider with anchor visible**

---

### Task 4: Upgrade panel styles with gold top border and ornamental corners

**Files:**
- Modify: `style.css` — replace `.layout`, `.panel`, `.summary-card`, `.debug-card`, `.input-panel`, `.results-panel` blocks (lines 90–108)

**Step 1: Replace panel blocks**

Replace lines 90–108 with:

```css
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: 16px;
}

.panel,
.summary-card,
.debug-card {
  position: relative;
  border: 1px solid var(--line);
  border-top: 2px solid var(--accent);
  border-radius: 6px;
  background: var(--panel);
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* Ornamental corner accents */
.panel::before,
.summary-card::before,
.debug-card::before,
.panel::after,
.summary-card::after,
.debug-card::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: var(--accent);
  border-style: solid;
  opacity: 0.5;
}

.panel::before,
.summary-card::before,
.debug-card::before {
  bottom: 6px;
  left: 6px;
  border-width: 0 0 1px 1px;
}

.panel::after,
.summary-card::after,
.debug-card::after {
  bottom: 6px;
  right: 6px;
  border-width: 0 1px 1px 0;
}

.input-panel,
.results-panel {
  padding: 16px;
}
```

**Step 2: Reload and confirm panels have gold top border, bottom corner accents**

---

### Task 5: Upgrade textarea and input styles

**Files:**
- Modify: `style.css` — replace textarea/input/label/paste-grid blocks (lines 110–151)

**Step 1: Replace**

Replace lines 110–151 with:

```css
.paste-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

label {
  display: grid;
  gap: 8px;
  color: var(--muted);
  font-family: 'Cinzel', serif;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

textarea,
input {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: rgba(5, 7, 9, 0.8);
  color: var(--text);
  padding: 10px 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

textarea {
  min-height: 300px;
  resize: vertical;
  line-height: 1.55;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
  text-transform: none;
}

input {
  min-height: 38px;
  font-family: 'Crimson Pro', serif;
}

textarea:focus,
input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow), 0 0 16px rgba(200, 146, 42, 0.15);
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

**Step 2: Reload — textareas should now use JetBrains Mono, focus shows gold glow**

---

### Task 6: Upgrade button styles with metallic primary and gold-bordered secondary

**Files:**
- Modify: `style.css` — replace `.action-row`, `button`, `.primary-btn`, `.ghost-btn` blocks (lines 153–179)

**Step 1: Replace**

Replace lines 153–179 with:

```css
.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

button {
  position: relative;
  min-height: 38px;
  border: 1px solid var(--line-hot);
  border-radius: 4px;
  background: var(--panel-soft);
  color: var(--text);
  padding: 8px 16px;
  font-family: 'Cinzel', serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.08s;
  overflow: hidden;
}

button:hover {
  border-color: var(--accent);
  box-shadow: 0 0 10px rgba(200, 146, 42, 0.2);
}

button:active {
  transform: translateY(1px);
}

/* Shine sweep on hover */
button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 60%;
  height: 100%;
  background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.08) 50%, transparent 70%);
  transition: left 0.4s;
  pointer-events: none;
}

button:hover::before {
  left: 150%;
}

.primary-btn {
  background: linear-gradient(160deg, #d4992e 0%, #a87420 100%);
  border-color: #c8922a;
  color: #0d0a05;
  font-weight: 700;
  box-shadow: 0 2px 12px rgba(200, 146, 42, 0.3), inset 0 1px 0 rgba(255, 220, 150, 0.2);
}

.primary-btn:hover {
  box-shadow: 0 2px 20px rgba(200, 146, 42, 0.5), inset 0 1px 0 rgba(255, 220, 150, 0.2);
}

.ghost-btn {
  border-color: var(--line);
  color: var(--muted);
}

.ghost-btn:hover {
  color: var(--text);
}
```

**Step 2: Reload — Symuluj button should have gold gradient, all buttons have Cinzel font and shine effect on hover**

---

### Task 7: Upgrade status message and advanced/details sections

**Files:**
- Modify: `style.css` — replace `.status`, `.advanced`, `summary` blocks (lines 181–205)

**Step 1: Replace**

Replace lines 181–205 with:

```css
.status {
  margin: 12px 0 0;
  color: var(--muted);
  font-style: italic;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.status.good {
  color: var(--good);
}

.status.bad {
  color: var(--bad);
}

.advanced,
.debug-card {
  margin-top: 16px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.015);
  border-top-color: rgba(200, 146, 42, 0.4);
}

summary {
  color: var(--accent);
  cursor: pointer;
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  user-select: none;
}

summary:hover {
  color: #e0aa40;
}
```

**Step 2: Reload — advanced details summary should use Cinzel font**

---

### Task 8: Upgrade outcome metrics (win rate boxes) with glow numbers

**Files:**
- Modify: `style.css` — replace `.results-panel`, `.outcome-grid`, `.metric` blocks (lines 278–314)

**Step 1: Replace**

Replace lines 278–314 with:

```css
.results-panel {
  display: grid;
  align-content: start;
  gap: 14px;
}

.outcome-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.metric,
.summary-card {
  padding: 14px;
}

.metric {
  border: 1px solid var(--line);
  border-top: 2px solid var(--accent);
  border-radius: 6px;
  background: linear-gradient(160deg, rgba(200, 146, 42, 0.06) 0%, var(--panel) 100%);
  text-align: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.metric:hover {
  border-color: var(--accent);
  box-shadow: 0 0 20px rgba(200, 146, 42, 0.15);
}

.metric span {
  display: block;
  color: var(--muted);
  font-family: 'Cinzel', serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.metric strong {
  display: block;
  margin-top: 8px;
  color: var(--accent);
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.5rem;
  font-weight: 700;
  text-shadow: 0 0 20px var(--accent-glow);
}

/* Color overrides set by JS for win/loss context */
.metric strong.good {
  color: var(--good);
  text-shadow: 0 0 20px rgba(109, 201, 138, 0.4);
}

.metric strong.bad {
  color: var(--bad);
  text-shadow: 0 0 20px rgba(224, 112, 96, 0.4);
}
```

**Step 2: Reload — the three metric boxes should have gold gradient background, Cinzel Decorative numbers with glow**

---

### Task 9: Upgrade loss grid, resource pills, and compare output

**Files:**
- Modify: `style.css` — replace `.loss-grid`, `ul`, `li`, `.resource-row`, `.compare-output`, `.compare-warning`, `.round-entry` blocks (lines 316–390)

**Step 1: Replace**

Replace lines 316–390 with:

```css
.loss-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.loss-grid h3 {
  font-family: 'Cinzel', serif;
  font-size: 0.68rem;
  letter-spacing: 0.15em;
  color: var(--muted);
  font-style: normal;
}

.loss-grid p {
  color: var(--accent);
  font-family: 'Cinzel Decorative', serif;
  font-size: 1.05rem;
  font-weight: 700;
  text-shadow: 0 0 14px var(--accent-glow);
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

li,
.compare-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(30, 37, 44, 0.8);
  color: var(--muted);
  font-size: 0.88rem;
}

li:last-child {
  border-bottom: none;
}

li strong,
.compare-row strong {
  color: var(--text);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
}

.resource-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.resource-row span {
  padding: 5px 12px;
  border: 1px solid rgba(90, 154, 181, 0.3);
  border-radius: 3px;
  background: rgba(90, 154, 181, 0.08);
  color: var(--accent-2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  transition: border-color 0.2s, background 0.2s;
}

.resource-row span:hover {
  border-color: var(--accent-2);
  background: rgba(90, 154, 181, 0.15);
}

.compare-output {
  margin-top: 12px;
  font-size: 0.88rem;
  color: var(--muted);
  font-style: italic;
}

.compare-warning {
  margin: 10px 0;
  padding: 10px 14px;
  border: 1px solid rgba(224, 112, 96, 0.4);
  border-left: 3px solid var(--bad);
  border-radius: 4px;
  color: #ffd0c5;
  background: rgba(224, 112, 96, 0.07);
  font-size: 0.88rem;
}

.round-entry {
  padding: 10px 0;
  border-bottom: 1px solid var(--line);
}

.round-entry h3 {
  margin-bottom: 6px;
  color: var(--accent);
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  font-style: normal;
}

.round-entry p {
  margin: 4px 0;
  color: var(--muted);
  line-height: 1.5;
  font-size: 0.88rem;
}
```

**Step 2: Reload — resource pills (debris) should use steel blue border style, loss values in Cinzel Decorative with glow**

---

### Task 10: Add CSS animations for result reveals

**Files:**
- Modify: `style.css` — append at end of file

**Step 1: Append animation keyframes and utility classes**

Add to the end of `style.css`:

```css
/* ── Animations ───────────────────────────────────── */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes glowPulse {
  0%, 100% { text-shadow: 0 0 20px var(--accent-glow); }
  50% { text-shadow: 0 0 35px rgba(200, 146, 42, 0.6); }
}

.animate-in {
  animation: fadeInUp 0.35s ease both;
}

.outcome-grid .metric:nth-child(1) { animation-delay: 0.05s; }
.outcome-grid .metric:nth-child(2) { animation-delay: 0.12s; }
.outcome-grid .metric:nth-child(3) { animation-delay: 0.19s; }

.metric strong {
  animation: glowPulse 3s ease-in-out infinite;
}
```

**Step 2: In `app.js` (READ ONLY — do not change logic): confirm where results are rendered to the DOM. We will add the `.animate-in` class by modifying CSS only — the animation applies on page load. If JS sets innerHTML on result sections, those will re-trigger naturally.**

> Note: If results don't animate on simulation, that's acceptable — the glow pulse on `.metric strong` fires regardless.

---

### Task 11: Upgrade summary-card h2 section headers with ornamental left border

**Files:**
- Modify: `style.css` — add after `.summary-card` block

**Step 1: Append these rules before the `@media` queries**

```css
.summary-card h2 {
  padding-left: 10px;
  border-left: 2px solid var(--accent);
  margin-bottom: 12px;
}

.summary-card h3 {
  margin-top: 12px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--line);
}

/* Profile section */
.profile-status {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
  font-style: italic;
}

.profile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.profile-actions button {
  min-height: 32px;
  padding: 6px 10px;
  font-size: 0.65rem;
}

/* Manual ship rows */
.manual-section {
  grid-column: 1 / -1;
}

.manual-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.manual-fleet {
  display: grid;
  gap: 6px;
}

.manual-ship-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 96px;
  align-items: center;
  min-height: 38px;
  padding: 6px 10px;
  border: 1px solid var(--line);
  border-radius: 4px;
  background: rgba(5, 7, 9, 0.6);
  text-transform: none;
  transition: border-color 0.2s;
}

.manual-ship-row:hover {
  border-color: var(--line-hot);
}

.manual-ship-row span {
  color: var(--text);
  font-size: 0.84rem;
  font-weight: 400;
  font-family: 'Crimson Pro', serif;
}

.manual-ship-row input {
  min-height: 30px;
  padding: 4px 8px;
  text-align: right;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.82rem;
}

/* Advanced grid */
.advanced-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.modifier-grid,
.settings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}
```

**Step 2: Reload — summary card headers should have gold left accent bar**

---

### Task 12: Final responsive media queries

**Files:**
- Modify: `style.css` — replace existing `@media` blocks at end of file (lines 392–418)

**Step 1: Replace**

```css
@media (max-width: 1040px) {
  .layout,
  .paste-grid,
  .advanced-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .app-shell {
    width: min(100% - 18px, 1320px);
  }

  .topbar,
  .loss-grid,
  .outcome-grid,
  .manual-grid,
  .modifier-grid,
  .settings-grid {
    display: grid;
    grid-template-columns: 1fr;
  }

  h1 {
    font-size: clamp(2rem, 10vw, 3rem);
  }

  textarea {
    min-height: 220px;
  }
}
```

**Step 2: Verify in browser dev tools mobile viewport (360px wide) — no horizontal overflow, single column**

---

### Task 13: Visual QA checklist

Open `index.html` in browser and verify:

- [ ] FIREPOWER title glows gold with Cinzel Decorative font
- [ ] "Sea of Sails" eyebrow in small Cinzel, gold, letter-spaced
- [ ] Decorative `⚓` divider visible between header and layout
- [ ] "Combat V3" pill has gold border and background
- [ ] Both panels have gold top border + ornamental bottom corners
- [ ] Textareas use JetBrains Mono monospace font
- [ ] Textarea focus shows gold glow shadow
- [ ] "Symuluj" button has gold gradient, shine sweep on hover, presses down on click
- [ ] All other buttons use Cinzel font, gold border on hover
- [ ] Win rate numbers (after simulation) in Cinzel Decorative with glow pulse
- [ ] Debris pills have steel-blue border (not filled background)
- [ ] Summary card h2 headings have gold left accent bar
- [ ] Mobile layout (< 1040px) collapses to single column correctly
- [ ] No horizontal scroll at any viewport width
- [ ] No JS errors in browser console

---

**Plan saved to `docs/plans/2026-05-09-cursed-fleet-implementation.md`.**
