# Command Center Attack Marker UI Design

## Goal

Improve attack markers in Score, Farm, Wreck, and Farming Intel so they can be toggled off, visually mark attacked entries, and stay in sync when the active island changes.

## Proposed Behavior

- Clicking a gray attack icon marks the island as attacked for one hour.
- Clicking an active attack icon removes the marker immediately and turns it gray.
- Attacked entries in Score, Farmy, and Wraki get a thick red outline around the whole item.
- Farming Intel gets an attack icon next to the farm star for the current target.
- The farm star in Farming Intel uses an active style when the current target is already saved as a farm.
- When the player changes active island, Score, Farmy, and Wraki rerender so distance sorting and badges update.
- Script version bumps from `4.2.1` to `4.2.2`.

## Verification

Run a static red check before implementation, then verify with userscript syntax check and `npm test`.
