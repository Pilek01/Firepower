# Pirate Battle Simulator Design

**Goal:** Build a local HTML/JS battle simulator for a pirate-themed OGame-like alpha.

**Scope:** Version 1 is an offline estimator, not a backend clone. It uses known ship stats, research modifiers, 10 shots per cannon, weighted target selection by size, and repeated simulations to estimate outcomes.

**Core Rules:**
- Each cannon fires 10 times per round.
- Navigation adds +5 percentage points hit chance per level.
- Hulls add +5% HP per level.
- Armaments add +5% attack per level.
- Fortifications add +5% shield absorption per level.
- Target choice is weighted by target size.
- Battles end when one side has no ships or the round limit is reached.

**UI:**
- Two side-by-side fleet panels for attacker and defender.
- Research controls for both sides.
- Simulation settings for runs, rounds, base accuracy, and seed.
- Result cards for win rates, losses, debris, and a sample round log.

**Known Alpha Caveat:** Some pasted reports have inconsistent final survivor lists, so calibration should prefer per-round losses, shots, hits, damage, and shield absorption.
