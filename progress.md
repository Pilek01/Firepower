Original prompt: mam dla ciebie challenge. Kuzyn robi grę która jest kopią ogame ale w świecie piratów. czy dało by rady zrobić symulator bitew ?

Progress:
- Designed V1 as a local HTML/JS battle simulator with pirate theme.
- Confirmed from cousin: each cannon fires 10 times per round, constant for all ships.
- Added design and implementation plan docs.
- Added failing core tests before implementation.
- Implemented tested battle core in `src/simulator-core.js`.
- Implemented static browser UI in `index.html`, `style.css`, and `src/app.js`.
- Verified desktop and mobile rendering with Playwright screenshots under `output/web-game/`.
- Fixed direct file opening by switching `index.html` to a generated classic `src/browser-bundle.js`.
- Added paste import: full battle reports fill attacker and defender; scan-like single fleet text fills the selected side.
- Added V0.1.1 two-window import: "Moja flota" fills attacker and "Skan przeciwnika" fills defender.
- Added V0.1.2 focused target mode. Each ship now keeps firing at its selected target during its own volley, which better matches reports where small defenders can still destroy one attacker ship.
- Added V0.1.3 conservative planning mode. By default it applies hidden defender Navigation +3 and Armaments +3 so unknown research does not understate attack risk.
- Rebuilt as FIREPOWER V0.2 with new base ship stats, JSON scan/report imports, V0.2 modifiers, firepower suppression, and a red/black/gold UI.

TODO:
- Continue calibrating damage/target selection against fresh JSON reports from the current game version.
- Add any future ships to `SHIPS` as they become buildable.
- If the backend exposes exact targeting order, replace the current focused target approximation.
