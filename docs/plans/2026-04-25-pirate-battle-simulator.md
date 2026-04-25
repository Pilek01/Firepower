# Pirate Battle Simulator Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished local pirate battle simulator as static HTML/CSS/JS.

**Architecture:** Keep battle math in a small ES module so it can be tested separately from the UI. The browser UI imports the same module and renders inputs, aggregate results, and a sample report.

**Tech Stack:** Plain HTML, CSS, JavaScript ES modules, Node built-in test runner.

---

### Task 1: Core Battle Engine

**Files:**
- Create: `src/simulator-core.js`
- Create: `test/simulator-core.test.mjs`
- Create: `package.json`

**Steps:**
1. Write tests for ship catalog values, cannon shot count, research modifiers, deterministic simulation, and debris/loss totals.
2. Run `node --test` and confirm the tests fail because the module does not exist.
3. Implement the minimal core engine.
4. Run `node --test` and confirm all tests pass.

### Task 2: Browser UI

**Files:**
- Create: `index.html`
- Create: `style.css`
- Create: `src/app.js`

**Steps:**
1. Build a static single-page UI with attacker/defender fleet forms, research controls, settings, result summaries, and report output.
2. Wire the UI to `runMonteCarlo` from the core module.
3. Add preset fleets based on pasted reports.
4. Verify browser loading, console cleanliness, layout, and primary interactions.

### Task 3: Final Verification

**Files:**
- Review all created files.

**Steps:**
1. Run `node --test`.
2. Run `node --check src/simulator-core.js` and `node --check src/app.js`.
3. Open the page through a local server or browser automation and verify that simulation results render.
