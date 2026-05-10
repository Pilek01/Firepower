# Command Center Defense Debris Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update ship costs and include defense debris in Farming Intel, Score, and Farms.

**Architecture:** Extend the existing single-file Tampermonkey userscript. Add defense costs and parsing alongside fleet parsing, then thread the calculated defense debris through existing intel, score history, farm storage, and UI rendering.

**Tech Stack:** Plain JavaScript userscript, DOM APIs, localStorage, Node syntax verification through `vm.Script`.

---

### Task 1: Update Cost Tables

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Update `SHIP_COSTS` with current wood/metal values and add `Indiaman`.

**Step 2:** Add `DEFENSE_COSTS` below `SHIP_COSTS`.

**Step 3:** Run userscript syntax check and expect `syntax ok`.

### Task 2: Parse and Calculate Defense Debris

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Add a generic scan-row unit parser so `Flota` and `Obrona` can share parsing.

**Step 2:** Add `parseDefenseFromScanPanel()`.

**Step 3:** Add `calculateDefenseDebris()` using 30% destroyed defense, then 45% wood and 60% metal debris rates.

**Step 4:** Run userscript syntax check and expect `syntax ok`.

### Task 3: Thread Defense Debris Through Intel and Storage

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Include defense debris in `grandTotal` and transport.

**Step 2:** Add `defenseDebrisTotal` and related fields to current intel.

**Step 3:** Store `defenseDebrisTotal` in Score and Farm entries.

**Step 4:** Update score signature so defense changes refresh UI and storage.

### Task 4: Render Defense Debris

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Add a card under `Złom z floty` named `Złom z obrony`.

**Step 2:** Update farm list summary to show defense debris separately.

**Step 3:** Show unknown defense names if parsing finds costs missing.

### Task 5: Final Verification

**Files:**
- Verify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Run userscript syntax check.

**Step 2:** Run `npm test`; rerun with escalation if sandbox blocks spawning.

**Step 3:** Skip commit because this workspace is not a git repository.
