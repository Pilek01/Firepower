# Command Center Auto Refresh Design

## Goal

Update Sea of Sails Command Center so repeated island clicks or scans refresh existing Score, Farm, and Wreck entries, add a one-hour attack marker on list items, and allow each list to sort by value or distance.

## Current Behavior

Score history already upserts by island key. Farms upsert when auto-save threshold is met or when saved manually, but an existing farm is not refreshed when a later scan drops below the threshold. Wrecks upsert only when the visible popup reports a positive wreck total, so a later scan with zero wrecks leaves stale wreck data.

## Proposed Behavior

Each valid island intel update should:

- refresh Score history by island key;
- refresh an existing Farm entry by island key, even when the new score is below the auto-save threshold;
- add a new Farm only when auto-save is enabled and the score is above the configured threshold;
- refresh an existing Wreck entry by island key even when wreck totals are zero;
- add a new Wreck entry only when wreck totals are positive.

Attack markers will be stored in `localStorage` with an expiry timestamp. List rows in Score, Farm, and Wreck tabs will show a compact gray attack button. Clicking it marks that island as attacked for one hour, turns the icon active, and refreshes the visible tab. Expired markers are cleaned lazily when loaded.

Sort controls will be stored in settings:

- Score: default `score`, optional `distance`;
- Farms: default `distance`, optional `score`;
- Wrecks: default `score`, optional `distance`.

## Testing

Because this is a Tampermonkey userscript, verification will be syntax checking plus focused code inspection. If practical, helper behavior can be checked by evaluating the script with Node's `vm.Script` and by reviewing the updated localStorage flows.
