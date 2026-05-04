import {
  SHIPS,
  DEFAULT_MODIFIERS,
  compareFleets,
  parseBattleReportJson,
  parseFleetText,
  parseScanJson,
  runMonteCarlo,
} from "./simulator-core.js";
import { clearPlayerProfile, loadPlayerProfile, savePlayerProfile } from "./profile-storage.js";

const MODIFIERS = [
  ["weaponsPct", "Atak %"],
  ["hullsPct", "HP %"],
  ["armorPct", "Pancerz %"],
  ["accuracyPct", "Celnosc %"],
  ["cannonsFlat", "Armaty +"],
];

let loadedReport = null;
let currentAttackerFleet = {};
let currentDefenderFleet = {};
const manualDirty = { attacker: false, defender: false };

const form = document.querySelector("#sim-form");
const importStatus = document.querySelector("#import-status");
const attackerImportText = document.querySelector("#attacker-import-text");
const defenderImportText = document.querySelector("#defender-import-text");
const reportImportText = document.querySelector("#report-import-text");
const playerProfileStatus = document.querySelector("#player-profile-status");
const savePlayerProfileButton = document.querySelector("#save-player-profile");
const loadPlayerProfileButton = document.querySelector("#load-player-profile");
const clearPlayerProfileButton = document.querySelector("#clear-player-profile");

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
  importStatus.className = `status ${type}`.trim();
}

function tryParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function fleetCount(fleet) {
  return Object.values(fleet || {}).reduce((sum, count) => sum + count, 0);
}

function parseFleetInput(text) {
  const source = String(text || "").trim();
  if (!source) return { fleet: {}, modifiers: null, type: "empty" };
  const json = tryParseJson(source);
  if (json) {
    const scan = parseScanJson(json);
    return { fleet: scan.fleet, modifiers: scan.modifiers, type: "json" };
  }
  const parsed = parseFleetText(source);
  return { fleet: parsed.all, modifiers: null, type: "text" };
}

function renderModifierControls(side) {
  const host = document.querySelector(`#${side}-modifiers`);
  host.innerHTML = "";
  for (const [id, label] of MODIFIERS) {
    const item = document.createElement("label");
    item.innerHTML = `${label}<input data-side="${side}" data-modifier="${id}" type="number" step="1" value="0">`;
    host.append(item);
  }
}

function renderManualFleetControls(side) {
  const host = document.querySelector(`#${side}-manual-fleet`);
  host.innerHTML = "";
  for (const [shipId, ship] of Object.entries(SHIPS)) {
    const row = document.createElement("label");
    row.className = "manual-ship-row";
    row.innerHTML = `
      <span>${ship.name}</span>
      <input data-side="${side}" data-manual-ship="${shipId}" type="number" min="0" step="1" value="0">
    `;
    row.querySelector("input").addEventListener("input", () => {
      manualDirty[side] = true;
    });
    host.append(row);
  }
}

function setManualFleet(side, fleet) {
  document.querySelectorAll(`input[data-side="${side}"][data-manual-ship]`).forEach((input) => {
    input.value = fleet[input.dataset.manualShip] || 0;
  });
}

function getManualFleet(side) {
  const fleet = {};
  document.querySelectorAll(`input[data-side="${side}"][data-manual-ship]`).forEach((input) => {
    const count = Math.max(0, Math.floor(Number(input.value) || 0));
    if (count) fleet[input.dataset.manualShip] = count;
  });
  return fleet;
}

function setPlayerProfileStatus(message) {
  if (playerProfileStatus) playerProfileStatus.textContent = message;
}

function storageSafe() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function persistPlayerProfile() {
  savePlayerProfile(storageSafe(), getModifiers("attacker"));
  setPlayerProfileStatus("Profil zapisany.");
}

function restorePlayerProfile() {
  const savedProfile = loadPlayerProfile(storageSafe());
  if (!savedProfile) {
    setPlayerProfileStatus("Profil zapisze sie automatycznie po zmianie pol.");
    return false;
  }
  setModifiers("attacker", savedProfile);
  setPlayerProfileStatus("Wczytano zapisany profil gracza.");
  return true;
}

function deletePlayerProfile() {
  clearPlayerProfile(storageSafe());
  setPlayerProfileStatus("Usunieto zapisany profil.");
}

function setModifiers(side, modifiers, { persist = false } = {}) {
  const values = { ...DEFAULT_MODIFIERS, ...(modifiers || {}) };
  document.querySelectorAll(`input[data-side="${side}"][data-modifier]`).forEach((input) => {
    input.value = values[input.dataset.modifier] || 0;
  });
  if (side === "attacker" && persist) persistPlayerProfile();
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
  };
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
  if (!sample?.rounds?.length) {
    host.textContent = "Brak rund do pokazania.";
    return;
  }
  for (const round of sample.rounds) {
    const entry = document.createElement("article");
    entry.className = "round-entry";
    entry.innerHTML = `
      <h3>Runda ${round.number}</h3>
      <p>Agresor: ${formatNumber(round.defender.damage)} dmg, ${formatNumber(round.defender.hits)} trafien, ${formatNumber(round.defender.shots)} strzalow + ${formatNumber(round.defender.rapidExtraShots)} rapid.</p>
      <p>Obronca: ${formatNumber(round.attacker.damage)} dmg, ${formatNumber(round.attacker.hits)} trafien, ${formatNumber(round.attacker.shots)} strzalow + ${formatNumber(round.attacker.rapidExtraShots)} rapid.</p>
      <p>Flota: agresor ${round.attacker.before} -> ${round.attacker.after}; obronca ${round.defender.before} -> ${round.defender.after}.</p>
    `;
    host.append(entry);
  }
}

function renderReportCompare(result) {
  const host = document.querySelector("#report-compare");
  if (!loadedReport?.rounds?.length) {
    host.textContent = "Wklej raport JSON w debug, aby zobaczyc porownanie.";
    return;
  }
  const reportRound = loadedReport.rounds[0];
  const simRound = result.sample?.rounds?.[0];
  if (!simRound) {
    host.textContent = "Symulacja nie ma rund do porownania.";
    return;
  }
  const defenderDiff = compareFleets(loadedReport.plannedFleet?.defender || {}, loadedReport.defenderFleet);
  const warnings = defenderDiff.length
    ? `<div class="compare-warning"><strong>Flota wroga roznila sie od raportu</strong><ul>${defenderDiff.map((diff) => `<li>${SHIPS[diff.shipId]?.name || diff.shipId}: sym ${formatNumber(diff.expected)}, raport ${formatNumber(diff.actual)}</li>`).join("")}</ul></div>`
    : "";
  host.innerHTML = `
    ${warnings}
    <div class="compare-row"><span>Strzaly agresora</span><strong>${formatNumber(simRound.defender.shots)} / ${formatNumber(reportRound.fire?.aggressorShots)}</strong></div>
    <div class="compare-row"><span>Strzaly obroncy</span><strong>${formatNumber(simRound.attacker.shots)} / ${formatNumber(reportRound.fire?.defenderShots)}</strong></div>
    <div class="compare-row"><span>Obrazenia agresora</span><strong>${formatNumber(simRound.defender.damage)} / ${formatNumber(reportRound.damage?.aggressor)}</strong></div>
    <div class="compare-row"><span>Obrazenia obroncy</span><strong>${formatNumber(simRound.attacker.damage)} / ${formatNumber(reportRound.damage?.defender)}</strong></div>
  `;
}

function loadAttacker() {
  const parsed = parseFleetInput(attackerImportText.value);
  currentAttackerFleet = parsed.fleet;
  if (parsed.modifiers) setModifiers("attacker", parsed.modifiers, { persist: true });
  setManualFleet("attacker", currentAttackerFleet);
  manualDirty.attacker = false;
  setStatus(`Wczytano moja flote: ${fleetCount(currentAttackerFleet)} jednostek.`, "good");
}

function loadDefender() {
  const parsed = parseFleetInput(defenderImportText.value);
  currentDefenderFleet = parsed.fleet;
  if (parsed.modifiers) setModifiers("defender", parsed.modifiers);
  setManualFleet("defender", currentDefenderFleet);
  manualDirty.defender = false;
  setStatus(`Wczytano flote wroga: ${fleetCount(currentDefenderFleet)} jednostek.`, "good");
}

function loadReport() {
  const text = reportImportText.value.trim();
  if (!text) {
    setStatus("Wklej raport JSON w debug.", "bad");
    return;
  }
  try {
    loadedReport = parseBattleReportJson(text);
    loadedReport.plannedFleet = {
      attacker: currentAttackerFleet,
      defender: currentDefenderFleet,
    };
    setStatus("Raport JSON gotowy do porownania.", "good");
    simulate();
  } catch (error) {
    setStatus(`Nie udalo sie odczytac raportu: ${error.message}`, "bad");
  }
}

function simulate() {
  currentAttackerFleet = getManualFleet("attacker");
  currentDefenderFleet = getManualFleet("defender");
  if (!fleetCount(currentAttackerFleet) && attackerImportText.value.trim()) loadAttacker();
  if (!fleetCount(currentDefenderFleet) && defenderImportText.value.trim()) loadDefender();
  const result = runMonteCarlo({
    attackerFleet: currentAttackerFleet,
    defenderFleet: currentDefenderFleet,
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
  currentAttackerFleet = {};
  currentDefenderFleet = {};
  setManualFleet("attacker", {});
  setManualFleet("defender", {});
  manualDirty.attacker = false;
  manualDirty.defender = false;
  loadedReport = null;
  setStatus("Wyczyszczono.");
  simulate();
}

window.FirepowerBridge = {
  load({ attackerText = "", defenderText = "", attackerJson = null, defenderJson = null } = {}) {
    const hasAttacker = Boolean(attackerJson || attackerText);
    const hasDefender = Boolean(defenderJson || defenderText);

    if (attackerJson) attackerImportText.value = JSON.stringify(attackerJson, null, 2);
    else if (attackerText) attackerImportText.value = attackerText;
    if (defenderJson) defenderImportText.value = JSON.stringify(defenderJson, null, 2);
    else if (defenderText) defenderImportText.value = defenderText;

    if (hasAttacker) loadAttacker();
    if (hasDefender) loadDefender();
    simulate();
  },
};

function init() {
  renderModifierControls("attacker");
  renderModifierControls("defender");
  renderManualFleetControls("attacker");
  renderManualFleetControls("defender");
  attackerImportText.value = "Okret Wojenny x10\nBryg x20\nStatek Towarowy x20";
  defenderImportText.value = "Bryg x12\nSlup x24\nStatek Towarowy x10";
  loadAttacker();
  loadDefender();
  restorePlayerProfile();
  simulate();
}

document.querySelector("#load-attacker").addEventListener("click", () => {
  loadAttacker();
  simulate();
});
document.querySelector("#load-defender").addEventListener("click", () => {
  loadDefender();
  simulate();
});
document.querySelector("#import-report").addEventListener("click", loadReport);
document.querySelector("#clear-imports").addEventListener("click", clearImports);
attackerImportText.addEventListener("input", () => {
  manualDirty.attacker = false;
});
defenderImportText.addEventListener("input", () => {
  manualDirty.defender = false;
});
document.querySelectorAll('input[data-side="attacker"][data-modifier]').forEach((input) => {
  input.addEventListener("input", persistPlayerProfile);
  input.addEventListener("change", persistPlayerProfile);
});
savePlayerProfileButton?.addEventListener("click", persistPlayerProfile);
loadPlayerProfileButton?.addEventListener("click", () => {
  restorePlayerProfile();
  simulate();
});
clearPlayerProfileButton?.addEventListener("click", deletePlayerProfile);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!manualDirty.attacker) loadAttacker();
  else currentAttackerFleet = getManualFleet("attacker");
  if (!manualDirty.defender) loadDefender();
  else currentDefenderFleet = getManualFleet("defender");
  persistPlayerProfile();
  simulate();
});
window.addEventListener("beforeunload", persistPlayerProfile);

init();
