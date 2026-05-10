# Command Center Auto Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refresh existing Score, Farm, and Wreck entries after repeated island scans, add one-hour attack markers, and add sort controls by value or distance.

**Architecture:** Keep all behavior inside the existing Tampermonkey userscript. Extend localStorage with a small attack-marker map and new settings fields, then reuse the existing render and bind pattern for the three affected tabs.

**Tech Stack:** Plain JavaScript userscript, DOM APIs, localStorage, Node syntax verification through `vm.Script`.

---

### Task 1: Settings and Attack Marker Storage

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1: Add constants and setting defaults**

Add an attack marker key and one-hour TTL near the existing storage constants:

```js
const ATTACK_MARKERS_KEY = "sos_attack_markers_v1";
const ATTACK_MARKER_TTL = 60 * 60 * 1000;
```

Extend `loadSettings()` success and fallback objects with:

```js
scoreSort: raw.scoreSort || "score",
farmSort: raw.farmSort || "distance",
wrecksSort: raw.wrecksSort || "score",
```

**Step 2: Add attack-marker helpers**

Create helpers near the storage helpers:

```js
function loadAttackMarkers() { ... }
function saveAttackMarkers(markers) { ... }
function isAttackMarked(key) { ... }
function markAttack(key) { ... }
function renderAttackMarkerButton(key) { ... }
```

Expired markers should be removed lazily by `loadAttackMarkers()`.

**Step 3: Verify syntax**

Run:

```bash
node -e "const fs=require('fs'); const vm=require('vm'); new vm.Script(fs.readFileSync('tampermonkey/Sea of Sails Command Center v4.0.txt','utf8')); console.log('syntax ok')"
```

Expected: `syntax ok`.

### Task 2: Refresh Existing Farm and Wreck Data

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1: Add existing-entry refresh helpers**

Add functions:

```js
function hasFarm(key) { ... }
function refreshExistingFarmFromIntel(intel) { ... }
function hasWreck(key) { ... }
function refreshExistingWreckFromIntel(intel) { ... }
```

**Step 2: Update `updateIntelLoop()`**

After score history is updated, refresh an existing farm regardless of threshold. Keep threshold logic only for adding new farms.

Refresh existing wreck data from `intel.wreckTotal` even if it is zero. Keep positive-wreck popup logic for adding new wreck entries.

**Step 3: Verify stale-data behavior by inspection**

Confirm the code path for a below-threshold scan still calls the existing-farm refresh helper and does not remove the farm.

### Task 3: Sort Controls

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1: Add sort helpers**

Add small helpers for sort values and labels:

```js
function normalizeSort(value, fallback) { ... }
function renderSortControl(id, current) { ... }
```

**Step 2: Update Score, Farm, and Wreck rendering**

Use `s.scoreSort`, `s.farmSort`, and `s.wrecksSort` to choose sorting:

- Score `score`: score desc, distance asc tiebreaker.
- Score `distance`: distance asc, score desc tiebreaker.
- Farm `distance`: existing distance-first behavior.
- Farm `score`: score desc, distance asc tiebreaker.
- Wreck `score`: total desc, distance asc tiebreaker.
- Wreck `distance`: distance asc, total desc tiebreaker.

**Step 3: Bind sort controls**

Add event listeners in `bindScoreEvents()`, `bindFarmsEvents()`, and `bindWrecksEvents()` to save the selected sort and rerender.

### Task 4: Attack Marker UI

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1: Add CSS**

Add styles for a small top-right attack marker button in `.sos-farm-item` and `.sos-result`.

**Step 2: Render buttons**

Render attack marker buttons in Score history items, Farm items, and Wreck items.

**Step 3: Bind clicks**

Add one shared binder:

```js
function bindAttackMarkerEvents() { ... }
```

Call it after rendering the active tab.

### Task 5: Final Verification

**Files:**
- Verify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1: Syntax check**

Run the `vm.Script` check and expect `syntax ok`.

**Step 2: Inspect key lines**

Confirm:

- `ATTACK_MARKERS_KEY` exists;
- farms refresh existing entries below threshold;
- wrecks refresh existing entries to zero;
- sort controls exist in all three tabs;
- attack buttons are rendered and bound.

**Step 3: Commit**

Skip commit: this folder is not a git repository.
