# Command Center Attack Marker UI Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make attack markers toggleable, visually highlight attacked rows, add attack/farm state controls to Farming Intel, and rerender Score/Farmy/Wraki when the active island changes.

**Architecture:** Keep all changes inside the existing Tampermonkey userscript. Extend the existing attack marker helpers and CSS, reuse them in list rows and Farming Intel, then broaden the existing island-switch watcher from Farmy-only to Score/Farmy/Wraki.

**Tech Stack:** Plain JavaScript userscript, DOM APIs, localStorage, Node syntax verification through `vm.Script`.

---

### Task 1: Red Checks

**Files:**
- Verify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Run a static check that expects missing `toggleAttackMarker` and updated refresh helper.

**Expected:** FAIL before implementation.

### Task 2: Attack Marker Toggle and Row Styling

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Add `toggleAttackMarker()`.

**Step 2:** Update click binding to toggle instead of always marking.

**Step 3:** Add row class helper for attacked entries.

**Step 4:** Add thick red row outline CSS.

### Task 3: Farming Intel Controls

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Add `isFarmSaved()`.

**Step 2:** Add an actions container in Farming Intel with farm star and attack icon.

**Step 3:** Make farm star visually active for saved farms.

### Task 4: Active Island Refresh

**Files:**
- Modify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Rename/replace `refreshFarmsTabIfVisible()` with a helper that refreshes `score`, `farms`, and `wrecks`.

**Step 2:** Update click watcher and MutationObserver to call the broader refresh helper.

### Task 5: Version and Verification

**Files:**
- Modify/verify: `tampermonkey/Sea of Sails Command Center v4.0.txt`

**Step 1:** Bump `@name`, `@version`, and `VERSION` to `4.2.2`.

**Step 2:** Run userscript syntax check.

**Step 3:** Run `npm test`.

**Step 4:** Skip commit because this workspace is not a git repository.
