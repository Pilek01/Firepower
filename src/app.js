import {
  SHIPS,
  DEFAULT_MODIFIERS,
  compareFleets,
  parseBattleReportJson,
  parseFleetText,
  parseScanJson,
  runMonteCarlo,
} from "./simulator-core.js";

const MODIFIERS = [
  ["weaponsPct", "Uzbrojenie %"],
  ["hullsPct", "Kadłuby %"],
  ["armorPct", "Pancerz %"],
  ["cannonsFlat", "Armaty +"],
];

let loadedReport = null;

const form = document.querySelector("#sim-form");
const importStatus = document.querySelector("#import-status");
const attackerImportText = document.querySelector("#attacker-import-text");
const defenderImportText = document.querySelector("#defender-import-text");
const reportImportText = document.querySelector("#report-import-text");

function formatNumber(value, digits = 0) {
  return new Intl.NumberFormat("pl-PL", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value || 0);
}

function formatPercent(value) {
  return `${formatNumber(value * 100, 1)}%`;
}

function setStatus(message, type = "") {
  importStatus.textContent = message;
  importStatus.className = type;
}

function shipMeta(ship) {
  return `atk ${ship.attack} · hp ${ship.hp} · pancerz ${ship.shield} · armaty ${ship.cannons}`;
}

function renderFleetControls(side) {
  const host = document.querySelector(`#${side}-fleet`);
  host.innerHTML = "";
  for (const [shipId, ship] of Object.entries(SHIPS)) {
    const row = document.createElement("label");
    row.className = "ship-row";
    row.innerHTML = `
      <span class="ship-name">
        <strong>${ship.name}</strong>
        <span>${shipMeta(ship)}</span>
      </span>
      <input data-side="${side}" data-ship="${shipId}" type="number" min="0" step="1" value="0">
    `;
    host.append(row);
  }
}

function renderModifierControls(side) {
  const host = document.querySelector(`#${side}-modifiers`);
  host.innerHTML = "";
  for (const [id, label] of MODIFIERS) {
    const item = document.createElement("label");
    item.innerHTML = `
      ${label}
      <input data-side="${side}" data-modifier="${id}" type="number" step="1" value="0">
    `;
    host.append(item);
  }
}

function setFleet(side, fleet) {
  document.querySelectorAll(`input[data-side="${side}"][data-ship]`).forEach((input) => {
    input.value = fleet[input.dataset.ship] || 0;
  });
}

function getFleet(side) {
  const fleet = {};
  document.querySelectorAll(`input[data-side="${side}"][data-ship]`).forEach((input) => {
    const count = Math.max(0, Math.floor(Number(input.value) || 0));
    if (count) fleet[input.dataset.ship] = count;
  });
  return fleet;
}

function setModifiers(side, modifiers) {
  const values = { ...DEFAULT_MODIFIERS, ...modifiers };
  document.querySelectorAll(`input[data-side="${side}"][data-modifier]`).forEach((input) => {
    input.value = values[input.dataset.modifier] || 0;
  });
}

function getModifiers(side) {
  const modifiers = { ...DEFAULT_MODIFIERS };
  document.querySelectorAll(`input[data-side="${side}"][data-modifier]`).forEach((input) => {
    modifiers[input.dataset.modifier] = Number(input.value) || 0;
  });
  return modifiers;
}

function getSettings() {
  return {
    runs: Math.max(1, Math.floor(Number(document.querySelector("#runs").value) || 1)),
    maxRounds: Math.max(1, Math.floor(Number(document.querySelector("#max-rounds").value) || 1)),
    baseAccuracy: Math.max(0.05, Math.min(0.95, Number(document.querySelector("#base-accuracy").value) / 100 || 0.5)),
    accuracyVariance: Math.max(0, Math.min(0.25, Number(document.querySelector("#accuracy-variance").value) / 100 || 0)),
    targetMode: document.querySelector("#target-mode").value,
  };
}

function fleetCount(fleet) {
  return Object.values(fleet || {}).reduce((sum, count) => sum + count, 0);
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function importAttacker() {
  const text = attackerImportText.value.trim();
  if (!text) {
    setStatus("Wklej najpierw moją flotę.", "bad");
    return;
  }
  const json = tryParseJson(text);
  if (json) {
    const scan = parseScanJson(json);
    setFleet("attacker", scan.fleet);
    setModifiers("attacker", scan.modifiers);
    setStatus(`Wczytano agresora z JSON: ${fleetCount(scan.fleet)} jednostek.`, "good");
  } else {
    const parsed = parseFleetText(text);
    setFleet("attacker", parsed.all);
    setStatus(`Wczytano agresora z tekstu: ${fleetCount(parsed.all)} jednostek.`, "good");
  }
  simulate();
}

function importDefender() {
  const text = defenderImportText.value.trim();
  if (!text) {
    setStatus("Wklej najpierw skan przeciwnika.", "bad");
    return;
  }
  const json = tryParseJson(text);
  if (json) {
    const scan = parseScanJson(json);
    setFleet("defender", scan.fleet);
    setModifiers("defender", scan.modifiers);
    setStatus(`Wczytano obrońcę z JSON: ${fleetCount(scan.fleet)} jednostek i bonusy ze skanu.`, "good");
  } else {
    const parsed = parseFleetText(text);
    setFleet("defender", parsed.all);
    setStatus(`Wczytano obrońcę z tekstu: ${fleetCount(parsed.all)} jednostek.`, "good");
  }
  simulate();
}

function importReport() {
  const text = reportImportText.value.trim();
  if (!text) {
    setStatus("Wklej najpierw raport JSON.", "bad");
    return;
  }
  try {
    const plannedFleet = {
      attacker: getFleet("attacker"),
      defender: getFleet("defender"),
    };
    loadedReport = parseBattleReportJson(text);
    loadedReport.plannedFleet = plannedFleet;
    setFleet("attacker", loadedReport.attackerFleet);
    setFleet("defender", loadedReport.defenderFleet);
    setModifiers("attacker", loadedReport.attackerModifiers);
    setModifiers("defender", loadedReport.defenderModifiers);
    setStatus("Wczytano raport JSON: floty i modyfikatory ustawione.", "good");
    simulate();
  } catch (error) {
    setStatus(`Nie udało się odczytać raportu JSON: ${error.message}`, "bad");
  }
}

function renderFleetList(hostId, values) {
  const host = document.querySelector(hostId);
  host.innerHTML = "";
  for (const [shipId, ship] of Object.entries(SHIPS)) {
    const value = values[shipId] || 0;
    if (value <= 0.01) continue;
    const item = document.createElement("li");
    item.innerHTML = `<span>${ship.name}</span><strong>${formatNumber(value, value < 10 ? 1 : 0)}</strong>`;
    host.append(item);
  }
  if (!host.children.length) {
    const item = document.createElement("li");
    item.innerHTML = "<span>brak strat</span><strong>0</strong>";
    host.append(item);
  }
}

function renderDebris(debris) {
  document.querySelector("#debris-output").innerHTML = `
    <span>Drewno ${formatNumber(debris.wood)}</span>
    <span>Metal ${formatNumber(debris.metal)}</span>
    <span>Rum ${formatNumber(debris.rum)}</span>
  `;
}

function renderBattleLog(sample) {
  const host = document.querySelector("#battle-log");
  host.innerHTML = "";
  if (!sample || !sample.rounds.length) {
    host.textContent = "Brak rund do pokazania.";
    return;
  }
  for (const round of sample.rounds) {
    const entry = document.createElement("article");
    entry.className = "round-entry";
    entry.innerHTML = `
      <h3>Runda ${round.number}</h3>
      <p>Agresor: ${formatNumber(round.defender.damage)} obrażeń, ${formatNumber(round.defender.hits)} trafień z ${formatNumber(round.defender.shots)} strzałów. Obrońca pochłonął ${formatNumber(round.defender.absorbed)}.</p>
      <p>Obrońca: ${formatNumber(round.attacker.damage)} obrażeń, ${formatNumber(round.attacker.hits)} trafień z ${formatNumber(round.attacker.shots)} strzałów. Agresor pochłonął ${formatNumber(round.attacker.absorbed)}.</p>
      <p>Flota agresora ${round.attacker.before} → ${round.attacker.after}; flota obrońcy ${round.defender.before} → ${round.defender.after}.</p>
    `;
    host.append(entry);
  }
}

function renderFleetWarnings(label, differences) {
  if (!differences.length) return "";
  const rows = differences.map((diff) => {
    const ship = SHIPS[diff.shipId];
    return `<li>${ship?.name || diff.shipId}: symulacja ${formatNumber(diff.expected)}, raport ${formatNumber(diff.actual)}</li>`;
  }).join("");
  return `
    <div class="compare-warning">
      <strong>${label}: flota z symulacji różni się od raportu</strong>
      <ul>${rows}</ul>
    </div>
  `;
}

function renderReportCompare(result) {
  const host = document.querySelector("#report-compare");
  if (!loadedReport || !loadedReport.rounds?.length) {
    host.textContent = "Wklej raport JSON, aby zobaczyć różnice.";
    return;
  }
  const reportRound = loadedReport.rounds[0];
  const simRound = result.sample?.rounds?.[0];
  if (!simRound) {
    host.textContent = "Symulacja nie ma rund do porównania.";
    return;
  }
  const plannedAttackerDiff = loadedReport.plannedFleet
    ? compareFleets(loadedReport.plannedFleet.attacker, loadedReport.attackerFleet)
    : [];
  const plannedDefenderDiff = loadedReport.plannedFleet
    ? compareFleets(loadedReport.plannedFleet.defender, loadedReport.defenderFleet)
    : [];
  const fleetWarnings = renderFleetWarnings("Agresor", plannedAttackerDiff) + renderFleetWarnings("Obrońca", plannedDefenderDiff);
  host.innerHTML = `
    ${fleetWarnings}
    <div class="compare-row"><span>Strzały agresora</span><strong>${formatNumber(simRound.defender.shots)} / ${formatNumber(reportRound.fire.aggressorShots)}</strong></div>
    <div class="compare-row"><span>Strzały obrońcy</span><strong>${formatNumber(simRound.attacker.shots)} / ${formatNumber(reportRound.fire.defenderShots)}</strong></div>
    <div class="compare-row"><span>Obrażenia agresora</span><strong>${formatNumber(simRound.defender.damage)} / ${formatNumber(reportRound.damage.aggressor)}</strong></div>
    <div class="compare-row"><span>Obrażenia obrońcy</span><strong>${formatNumber(simRound.attacker.damage)} / ${formatNumber(reportRound.damage.defender)}</strong></div>
  `;
}

function simulate() {
  const result = runMonteCarlo({
    attackerFleet: getFleet("attacker"),
    defenderFleet: getFleet("defender"),
    attackerModifiers: getModifiers("attacker"),
    defenderModifiers: getModifiers("defender"),
    settings: getSettings(),
    seed: document.querySelector("#seed").value || "firepower",
  });
  document.querySelector("#attacker-rate").textContent = formatPercent(result.outcomeRates.attacker);
  document.querySelector("#defender-rate").textContent = formatPercent(result.outcomeRates.defender);
  document.querySelector("#draw-rate").textContent = formatPercent(result.outcomeRates.draw);
  document.querySelector("#attacker-loss-points").textContent = `${formatNumber(result.averageAttackerLossPoints)} pkt`;
  document.querySelector("#defender-loss-points").textContent = `${formatNumber(result.averageDefenderLossPoints)} pkt`;
  renderFleetList("#attacker-losses", result.averageAttackerLosses);
  renderFleetList("#defender-losses", result.averageDefenderLosses);
  renderDebris(result.averageDebris);
  renderBattleLog(result.sample);
  renderReportCompare(result);
}

function clearImports() {
  attackerImportText.value = "";
  defenderImportText.value = "";
  reportImportText.value = "";
  loadedReport = null;
  setStatus("Import wyczyszczony.");
  renderReportCompare({ sample: null });
}

function init() {
  renderFleetControls("attacker");
  renderFleetControls("defender");
  renderModifierControls("attacker");
  renderModifierControls("defender");
  setFleet("attacker", { warship: 89 });
  setFleet("defender", { brig: 11, cargo: 3, frigate: 6, sloop: 8 });
  setModifiers("attacker", { weaponsPct: 29, hullsPct: 31, armorPct: 25, cannonsFlat: 6 });
  setModifiers("defender", { weaponsPct: 20, hullsPct: 15, armorPct: 0, cannonsFlat: 0 });
  simulate();
}

document.querySelector("#import-attacker").addEventListener("click", importAttacker);
document.querySelector("#import-defender").addEventListener("click", importDefender);
document.querySelector("#import-report").addEventListener("click", importReport);
document.querySelector("#clear-imports").addEventListener("click", clearImports);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  simulate();
});

init();
