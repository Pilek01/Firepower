# FIREPOWER V3 — "Cursed Fleet" Visual Redesign

**Date:** 2026-05-09  
**Scope:** Pure visual/CSS upgrade, zero logic changes  
**Theme:** Premium dark game UI — Path of Exile / Dark Souls energy applied to Sea of Sails

---

## Typography

| Role | Font | Notes |
|---|---|---|
| Headings (H1, H2) | Cinzel Decorative | Gothic-maritime serif, all-caps feel |
| Body / labels | Crimson Pro | Elegant serif, readable at small sizes |
| Numbers / data | JetBrains Mono | Monospace for data readability |

All loaded via Google Fonts single `<link>`.

---

## Color Tokens

| Token | New Value | Role |
|---|---|---|
| `--bg` | `#08090b` | Deeper black base |
| `--panel` | `#111318` | Panel background + noise texture |
| `--panel-soft` | `#161b22` | Lighter panel variant |
| `--line` | `#1e252c` | Subtle borders |
| `--line-hot` | `#2e3d48` | Emphasized borders |
| `--text` | `#eef3f5` | Primary text |
| `--muted` | `#8a9aa5` | Secondary text |
| `--accent` | `#c8922a` | Warm rusty gold (primary) |
| `--accent-glow` | `rgba(200,146,42,0.35)` | Glow shadow color |
| `--accent2` | `#5a9ab5` | Deep steel blue |
| `--good` | `#6dc98a` | Win / positive |
| `--bad` | `#e07060` | Loss / negative |

---

## Background

- Base: radial gradient from `#111318` (center) to `#050607` (corners)
- Overlay: SVG noise filter (feTurbulence) at low opacity (~0.035) — adds texture depth without being visible
- Result: feels like aged wood or deep water

---

## Header

- "Sea of Sails" eyebrow: Cinzel, `letter-spacing: 0.3em`, small, gold
- "FIREPOWER": Cinzel Decorative, massive, `text-shadow` gold glow (multi-layer)
- Decorative separator: `◆────────◆` pattern using CSS pseudo-elements
- "Combat V3" pill: metallic border, gold text, small caps

---

## Panels

- `border-top: 2px solid var(--accent)` — gold top edge on every card
- Ornamental corners: `::before / ::after` pseudo-elements with small L-shaped gold borders in each corner
- Box-shadow: `0 2px 0 rgba(200,146,42,0.15), 0 24px 64px rgba(0,0,0,0.55)`
- Background: `var(--panel)` + noise SVG as `background-image`

---

## Buttons

- **Primary:** Gold gradient (`#c8922a` → `#a87420`), metallic shine pseudo-element animated on hover, `transform: translateY(1px)` on active
- **Secondary:** Dark bg, gold border, hover brightens border and adds subtle glow
- All buttons: `letter-spacing: 0.08em`, uppercase, Cinzel or Crimson Pro

---

## Results / Outcome

- Win rate percentages: Cinzel Decorative, large, colored with `text-shadow` glow
- Appear with `fadeInUp` keyframe animation on each new simulation
- Section headers: ornamental left border `border-left: 3px solid var(--accent)`
- Loss rows: gold dividers between rows

---

## Micro-interactions

| Element | Effect |
|---|---|
| Textarea focus | Gold `box-shadow` glow, smooth transition |
| Panel border-top | Brightens on hover |
| Status message | `color` transition fade (good/bad/neutral) |
| Results reveal | `fadeInUp` + `opacity` animation |
| Primary button hover | Shine sweep animation |

---

## Implementation Files

| File | Changes |
|---|---|
| `index.html` | Add Google Fonts `<link>`, add noise SVG filter `<defs>` |
| `style.css` | Full rewrite of variables, all component styles, animations |

No changes to any `.js` files.
