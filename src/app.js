import {
  DEFENSES,
  SHIPS,
  UNITS,
  DEFAULT_MODIFIERS,
  compareFleets,
  normalizeDefenseKeys,
  normalizeFleetKeys,
  parseBattleReportJson,
  parseFleetText,
  parseScanJson,
  runMonteCarlo,
} from "./simulator-core.js";
import { clearPlayerProfile, loadPlayerProfile, savePlayerProfile } from "./profile-storage.js";

const MODIFIERS = [
  ["weaponsPct", "Atak %"],
  ["hullsPct", "HP %"],
  ["armorPct", "Fortyfikacje %"],
  ["accuracyPct", "Celnosc %"],
  ["cannonsFlat", "Armaty +"],
];

const ATTACKER_MODIFIERS = MODIFIERS.filter(([id]) => id !== "armorPct");

const BATTLE_INPUT_STORAGE_KEY = "firepower.battleInputs.v1";

let loadedReport = null;
let currentAttackerFleet = {};
let currentDefenderFleet = {};
let currentDefenderDefense = {};
const manualDirty = { attacker: false, defender: false };
let simulationRunning = false;

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
  if (!source) return { fleet: {}, defense: {}, modifiers: null, type: "empty" };
  const json = tryParseJson(source);
  if (json) {
    const scan = parseScanJson(json);
    return {
      fleet: scan.fleet,
      defense: scan.defense,
      modifiers: hasModifierSource(json) ? scan.modifiers : null,
      type: "json",
    };
  }
  const parsed = parseFleetText(source);
  return {
    fleet: normalizeFleetKeys(parsed.all),
    defense: normalizeDefenseKeys(parsed.all),
    modifiers: null,
    type: "text",
  };
}

function hasModifierSource(json) {
  const scan = json?.scan || json || {};
  return Boolean(
    Object.keys(scan.research || {}).length
    || Object.keys(scan.talents || {}).length
    || Object.keys(scan.modifiers || {}).length
  );
}

function renderModifierControls(side) {
  const host = document.querySelector(`#${side}-modifiers`);
  host.innerHTML = "";
  const list = side === "attacker" ? ATTACKER_MODIFIERS : MODIFIERS;
  for (const [id, label] of list) {
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

function renderManualDefenseControls() {
  const host = document.querySelector("#defender-manual-defense");
  if (!host) return;
  host.innerHTML = "";
  for (const [defenseId, defense] of Object.entries(DEFENSES)) {
    const row = document.createElement("label");
    row.className = "manual-ship-row";
    row.innerHTML = `
      <span>${defense.name}</span>
      <input data-side="defender" data-manual-defense="${defenseId}" type="number" min="0" step="1" value="0">
    `;
    row.querySelector("input").addEventListener("input", () => {
      manualDirty.defender = true;
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

function setManualDefense(defense) {
  document.querySelectorAll("input[data-manual-defense]").forEach((input) => {
    input.value = defense[input.dataset.manualDefense] || 0;
  });
}

function getManualDefense() {
  const defense = {};
  document.querySelectorAll("input[data-manual-defense]").forEach((input) => {
    const count = Math.max(0, Math.floor(Number(input.value) || 0));
    if (count) defense[input.dataset.manualDefense] = count;
  });
  return defense;
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

function persistBattleInputs() {
  const storage = storageSafe();
  if (!storage) return;
  storage.setItem(BATTLE_INPUT_STORAGE_KEY, JSON.stringify({
    attackerText: attackerImportText.value,
    defenderText: defenderImportText.value,
    reportText: reportImportText.value,
  }));
}

function restoreBattleInputs() {
  const storage = storageSafe();
  if (!storage) return false;

  try {
    const saved = JSON.parse(storage.getItem(BATTLE_INPUT_STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return false;

    attackerImportText.value = typeof saved.attackerText === "string" ? saved.attackerText : "";
    defenderImportText.value = typeof saved.defenderText === "string" ? saved.defenderText : "";
    reportImportText.value = typeof saved.reportText === "string" ? saved.reportText : "";
    return true;
  } catch {
    return false;
  }
}

function clearBattleInputsStorage() {
  const storage = storageSafe();
  if (storage) storage.removeItem(BATTLE_INPUT_STORAGE_KEY);
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

function getDefenseRepairRate() {
  const val = Number(document.querySelector("#defense-repair-rate")?.value) || 0;
  return Math.min(100, Math.max(0, val)) / 100;
}

async function runSimulationChunked(params, onProgress) {
  const totalRuns = params.settings.runs;
  const chunkSize = Math.max(50, Math.ceil(totalRuns / 20));
  const acc = {
    outcomes: { attacker: 0, defender: 0, draw: 0 },
    attackerLossPoints: 0,
    defenderLossPoints: 0,
    defenseLossPoints: 0,
    debris: { wood: 0, metal: 0, rum: 0 },
    defenseDebris: { wood: 0, metal: 0, rum: 0 },
    attackerLosses: {},
    defenderLosses: {},
    sample: null,
    done: 0,
  };
  let chunk = 0;
  while (acc.done < totalRuns) {
    const batchRuns = Math.min(chunkSize, totalRuns - acc.done);
    const r = runMonteCarlo({
      ...params,
      settings: { ...params.settings, runs: batchRuns },
      seed: `${params.seed}:c${chunk}`,
    });
    acc.outcomes.attacker += r.outcomes.attacker;
    acc.outcomes.defender += r.outcomes.defender;
    acc.outcomes.draw += r.outcomes.draw;
    acc.attackerLossPoints += r.averageAttackerLossPoints * batchRuns;
    acc.defenderLossPoints += r.averageDefenderLossPoints * batchRuns;
    acc.defenseLossPoints += (r.averageDefenseLossPoints || 0) * batchRuns;
    acc.debris.wood += r.averageDebris.wood * batchRuns;
    acc.debris.metal += r.averageDebris.metal * batchRuns;
    acc.debris.rum += r.averageDebris.rum * batchRuns;
    acc.defenseDebris.wood += r.averageDefenseDebris.wood * batchRuns;
    acc.defenseDebris.metal += r.averageDefenseDebris.metal * batchRuns;
    acc.defenseDebris.rum += r.averageDefenseDebris.rum * batchRuns;
    for (const [id, val] of Object.entries(r.averageAttackerLosses)) {
      acc.attackerLosses[id] = (acc.attackerLosses[id] || 0) + val * batchRuns;
    }
    for (const [id, val] of Object.entries(r.averageDefenderLosses)) {
      acc.defenderLosses[id] = (acc.defenderLosses[id] || 0) + val * batchRuns;
    }
    if (!acc.sample) acc.sample = r.sample;
    acc.done += batchRuns;
    chunk++;
    onProgress(acc.done / totalRuns);
    await new Promise(res => setTimeout(res, 0));
  }
  const n = acc.done;
  const attackerLosses = {};
  const defenderLosses = {};
  for (const [id, val] of Object.entries(acc.attackerLosses)) attackerLosses[id] = val / n;
  for (const [id, val] of Object.entries(acc.defenderLosses)) defenderLosses[id] = val / n;
  return {
    runs: n,
    outcomes: acc.outcomes,
    outcomeRates: {
      attacker: acc.outcomes.attacker / n,
      defender: acc.outcomes.defender / n,
      draw: acc.outcomes.draw / n,
    },
    averageAttackerLosses: attackerLosses,
    averageDefenderLosses: defenderLosses,
    averageAttackerLossPoints: acc.attackerLossPoints / n,
    averageDefenderLossPoints: acc.defenderLossPoints / n,
    averageDefenseLossPoints: acc.defenseLossPoints / n,
    averageDebris: { wood: acc.debris.wood / n, metal: acc.debris.metal / n, rum: acc.debris.rum / n },
    averageDefenseDebris: { wood: acc.defenseDebris.wood / n, metal: acc.defenseDebris.metal / n, rum: acc.defenseDebris.rum / n },
    sample: acc.sample,
  };
}

function renderFleetList(hostId, values) {
  const host = document.querySelector(hostId);
  host.innerHTML = "";
  for (const [shipId, ship] of Object.entries(UNITS)) {
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
  document.querySelector("#fleet-debris-output").innerHTML = `
    <span>Drewno ${formatNumber(debris.wood)}</span>
    <span>Metal ${formatNumber(debris.metal)}</span>
    <span>Rum ${formatNumber(debris.rum)}</span>
  `;
}

function renderDefenseDebris(debris) {
  document.querySelector("#defense-debris-output").innerHTML = `
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
  if (parsed.modifiers) setModifiers("attacker", { ...parsed.modifiers, armorPct: 0 }, { persist: true });
  setManualFleet("attacker", currentAttackerFleet);
  manualDirty.attacker = false;
  persistBattleInputs();
  setStatus(`Wczytano moja flote: ${fleetCount(currentAttackerFleet)} jednostek.`, "good");
}

function loadDefender() {
  const parsed = parseFleetInput(defenderImportText.value);
  currentDefenderFleet = parsed.fleet;
  currentDefenderDefense = parsed.defense;
  if (parsed.modifiers) setModifiers("defender", parsed.modifiers);
  setManualFleet("defender", currentDefenderFleet);
  setManualDefense(currentDefenderDefense);
  manualDirty.defender = false;
  persistBattleInputs();
  setStatus(`Wczytano wroga: ${fleetCount(currentDefenderFleet)} floty, ${fleetCount(currentDefenderDefense)} obrony.`, "good");
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

async function simulate() {
  if (simulationRunning) return;
  simulationRunning = true;

  currentAttackerFleet = getManualFleet("attacker");
  currentDefenderFleet = getManualFleet("defender");
  currentDefenderDefense = getManualDefense();
  if (!fleetCount(currentAttackerFleet) && attackerImportText.value.trim()) loadAttacker();
  if (!fleetCount(currentDefenderFleet) && !fleetCount(currentDefenderDefense) && defenderImportText.value.trim()) loadDefender();

  const progressEl = document.querySelector("#sim-progress");
  const progressBar = document.querySelector("#sim-progress-bar");
  const progressPct = document.querySelector("#sim-progress-pct");
  progressEl.hidden = false;
  progressBar.style.width = "0%";
  progressPct.textContent = "0%";

  let result;
  try {
    result = await runSimulationChunked({
      attackerFleet: currentAttackerFleet,
      defenderFleet: currentDefenderFleet,
      defenderDefense: currentDefenderDefense,
      attackerModifiers: getModifiers("attacker"),
      defenderModifiers: getModifiers("defender"),
      settings: getSettings(),
      seed: document.querySelector("#seed").value || "firepower",
    }, (progress) => {
      const pct = Math.round(progress * 100);
      progressBar.style.width = `${pct}%`;
      progressPct.textContent = `${pct}%`;
    });
  } finally {
    progressEl.hidden = true;
    simulationRunning = false;
  }
  const repairRate = getDefenseRepairRate();
  const repairedDefensePoints = (result.averageDefenseLossPoints || 0) * repairRate;
  const correctedDefenderLossPoints = result.averageDefenderLossPoints - repairedDefensePoints;
  const correctedDefenseDebris = {
    wood: result.averageDefenseDebris.wood * (1 - repairRate),
    metal: result.averageDefenseDebris.metal * (1 - repairRate),
    rum: result.averageDefenseDebris.rum * (1 - repairRate),
  };

  document.querySelector("#attacker-rate").textContent = formatPercent(result.outcomeRates.attacker);
  document.querySelector("#defender-rate").textContent = formatPercent(result.outcomeRates.defender);
  document.querySelector("#draw-rate").textContent = formatPercent(result.outcomeRates.draw);
  document.querySelector("#attacker-loss-points").textContent = `${formatNumber(result.averageAttackerLossPoints)} pkt`;
  document.querySelector("#defender-loss-points").textContent = `${formatNumber(correctedDefenderLossPoints)} pkt`;
  document.querySelector("#defender-repair-note").textContent = repairRate > 0 ? `−${formatNumber(repairedDefensePoints)} naprawa` : "";
  renderFleetList("#attacker-losses", result.averageAttackerLosses);
  renderFleetList("#defender-losses", result.averageDefenderLosses);
  renderDebris(result.averageDebris);
  renderDefenseDebris(correctedDefenseDebris);
  renderBattleLog(result.sample);
  renderReportCompare(result);
}

function clearImports() {
  attackerImportText.value = "";
  defenderImportText.value = "";
  reportImportText.value = "";
  clearBattleInputsStorage();
  currentAttackerFleet = {};
  currentDefenderFleet = {};
  currentDefenderDefense = {};
  setManualFleet("attacker", {});
  setManualFleet("defender", {});
  setManualDefense({});
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
  renderManualDefenseControls();
  restoreBattleInputs();
  if (attackerImportText.value.trim()) loadAttacker();
  if (defenderImportText.value.trim()) loadDefender();
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
  persistBattleInputs();
});
defenderImportText.addEventListener("input", () => {
  manualDirty.defender = false;
  persistBattleInputs();
});
reportImportText.addEventListener("input", persistBattleInputs);
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
window.addEventListener("beforeunload", () => {
  persistPlayerProfile();
  persistBattleInputs();
});

init();
