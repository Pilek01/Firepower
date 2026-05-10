# Command Center Defense Debris Design

## Goal

Update Sea of Sails Command Center with current ship costs and add defense debris into Farming Intel as a separate value that contributes to score and transport.

## Current Behavior

The script calculates fleet debris from `SHIP_COSTS` using 45% wood and 60% metal. It does not parse the scan-panel `Obrona` row, so destroyed defenses are missing from Farming Score.

## Proposed Behavior

Ship costs will be updated from the provided current game values. `Indiaman` will be added to `SHIP_COSTS`.

The script will add `DEFENSE_COSTS` for:

- Małe Działo
- Działo Nadbrzeżne
- Ciężkie Działo
- Bateria Rozgrzanych Kul
- Bombarda
- Wieża Działowa
- Fort Morski
- Czarna Forteca
- Wielka Cytadela Morska

The scan-panel row labeled `Obrona` will be parsed like the existing `Flota` row. Defense debris will assume only 30% of defenses are destroyed, then apply the same debris rates as ships: 45% wood and 60% metal. Defense debris will render in its own card below fleet debris and will be included in total score and transport.

## Verification

Run the userscript syntax check through Node `vm.Script`, then run `npm test`. If sandbox blocks `npm test` with `spawn EPERM`, rerun outside the sandbox with approval.
