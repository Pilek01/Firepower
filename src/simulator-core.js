export const SHOTS_PER_CANNON = 10;
export const SUPPRESSION_MIN = 0.15;
export const DEBRIS_RATE = 0.55;

export const SHIPS = {
  scout: {
    jsonKey: "longboat",
    name: "Lodz Zwiadowcza",
    attack: 1,
    hp: 20,
    shield: 2,
    size: 0.5,
    cannons: 1,
    speed: 0.6,
    cargo: 500,
    cost: { wood: 300, metal: 0, rum: 0 },
  },
  sloop: {
    jsonKey: "sloop",
    name: "Slup",
    attack: 1.8,
    hp: 150,
    shield: 25,
    size: 0.8,
    cannons: 8,
    speed: 1.5,
    cargo: 20,
    cost: { wood: 1000, metal: 200, rum: 0 },
  },
  brig: {
    jsonKey: "brig",
    name: "Bryg",
    attack: 3,
    hp: 360,
    shield: 80,
    size: 1.1,
    cannons: 18,
    speed: 1.1,
    cargo: 35,
    cost: { wood: 2200, metal: 500, rum: 0 },
  },
  cargo: {
    jsonKey: "cargoShip",
    name: "Statek Towarowy",
    attack: 1.2,
    hp: 200,
    shield: 10,
    size: 1.5,
    cannons: 6,
    speed: 1,
    cargo: 4000,
    cost: { wood: 2000, metal: 300, rum: 0 },
  },
  frigate: {
    jsonKey: "frigate",
    name: "Fregata",
    attack: 6.4,
    hp: 300,
    shield: 20,
    size: 1,
    cannons: 26,
    speed: 1.2,
    cargo: 50,
    cost: { wood: 4800, metal: 900, rum: 150 },
  },
  warship: {
    jsonKey: "warship",
    name: "Okret Wojenny",
    attack: 4.4,
    hp: 800,
    shield: 180,
    size: 1.4,
    cannons: 32,
    speed: 0.9,
    cargo: 40,
    cost: { wood: 7600, metal: 1800, rum: 300 },
  },
  shipOfTheLine: {
    jsonKey: "shipOfTheLine",
    name: "Okret Liniowy",
    attack: 10,
    hp: 1000,
    shield: 140,
    size: 1.6,
    cannons: 64,
    speed: 0.85,
    cargo: 45,
    crew: 140,
    cost: { wood: 13000, metal: 3200, rum: 0 },
  },
  bomber: {
    jsonKey: "bomber",
    name: "Okret Bombowy",
    attack: 8,
    hp: 260,
    shield: 15,
    size: 1.2,
    cannons: 12,
    speed: 0.85,
    cargo: 20,
    cost: { wood: 5600, metal: 1700, rum: 500 },
  },
  fire: {
    jsonKey: "fireShip",
    name: "Statek Ogniowy",
    attack: 24,
    hp: 160,
    shield: 10,
    size: 0.9,
    cannons: 4,
    speed: 1,
    cargo: 0,
    cost: { wood: 3600, metal: 700, rum: 700 },
  },
  colony: {
    jsonKey: "colonyShip",
    name: "Statek Kolonialny",
    attack: 1.5,
    hp: 250,
    shield: 20,
    size: 1.7,
    cannons: 4,
    speed: 0.75,
    cargo: 500,
    cost: { wood: 16000, metal: 4000, rum: 3000 },
  },
};

export const DEFAULT_MODIFIERS = {
  weaponsPct: 0,
  hullsPct: 0,
  armorPct: 0,
  cannonsFlat: 0,
};

export const DEFAULT_RESEARCH = {
  navigation: 0,
  sailing: 0,
  hulls: 0,
  weapons: 0,
  armor: 0,
  armaments: 0,
  fortifications: 0,
};

export const DEFAULT_SETTINGS = {
  runs: 500,
  maxRounds: 6,
  baseAccuracy: 0.6,
  accuracyVariance: 0.1,
  targetMode: "focused",
  planningMode: "raw",
  defenderHiddenNavigation: 0,
  defenderHiddenArmaments: 0,
};

const JSON_TO_INTERNAL = Object.fromEntries(
  Object.entries(SHIPS).map(([id, ship]) => [ship.jsonKey, id]),
);

const SHIP_ALIASES = {
  scout: ["lodz zwiadowcza", "lodka zwiadowcza", "zwiadowcza", "longboat"],
  sloop: ["slup", "sloop"],
  brig: ["bryg", "brig"],
  cargo: ["statek towarowy", "towarowy", "cargo", "cargoship"],
  frigate: ["fregata", "frigate"],
  warship: ["okret wojenny", "warship"],
  shipOfTheLine: ["okret liniowy", "liniowy", "ship of the line", "shipoftheline"],
  bomber: ["okret bombowy", "bomber"],
  fire: ["statek ogniowy", "fireship"],
  colony: ["statek kolonialny", "colony"],
};

export function createRng(seed = "firepower") {
  let hash = 2166136261;
  for (let i = 0; i < String(seed).length; i += 1) {
    hash ^= String(seed).charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return () => {
    hash += 0x6d2b79f5;
    let value = hash;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function normalizeSettings(settings = {}) {
  return { ...DEFAULT_SETTINGS, ...settings };
}

export function normalizeModifiers(modifiers = {}) {
  return { ...DEFAULT_MODIFIERS, ...modifiers };
}

export function modifiersFromResearch(research = {}, talents = {}) {
  const weapons = Number(research.weapons ?? research.armaments ?? 0);
  const hulls = Number(research.hulls ?? 0);
  const armor = Number(research.armor ?? research.fortifications ?? 0);
  const coreAttack = Number(talents.core_attack ?? 0);
  const combatHp = Number(talents.combat_hp ?? 0);
  const combatAbsorb = Number(talents.combat_absorb ?? 0);
  const combatCannon = Number(talents.combat_cannon ?? 0);
  return {
    weaponsPct: weapons * 5 + coreAttack * 4,
    hullsPct: hulls * 5 + combatHp * 3,
    armorPct: armor * 5 + combatAbsorb * 3,
    cannonsFlat: combatCannon * 2,
  };
}

export function applyResearch(ship, research = {}) {
  return applyCombatModifiers(ship, modifiersFromResearch(research));
}

export function applyCombatModifiers(ship, modifiers = {}) {
  const mods = normalizeModifiers(modifiers);
  return {
    ...ship,
    attack: ship.attack * (1 + mods.weaponsPct / 100),
    hp: ship.hp * (1 + mods.hullsPct / 100),
    shield: ship.shield * (1 + mods.armorPct / 100),
    cannons: Math.max(0, ship.cannons + mods.cannonsFlat),
  };
}

export function normalizeFleetKeys(fleet = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(fleet || {})) {
    const shipId = SHIPS[key] ? key : JSON_TO_INTERNAL[key];
    if (!shipId) continue;
    const count = Math.max(0, Math.floor(Number(value) || 0));
    if (count) normalized[shipId] = (normalized[shipId] || 0) + count;
  }
  return normalized;
}

export function compareFleets(expectedFleet = {}, actualFleet = {}) {
  const expected = normalizeFleetKeys(expectedFleet);
  const actual = normalizeFleetKeys(actualFleet);
  const differences = [];
  for (const shipId of Object.keys(SHIPS)) {
    const expectedCount = expected[shipId] || 0;
    const actualCount = actual[shipId] || 0;
    if (expectedCount === actualCount) continue;
    differences.push({
      shipId,
      expected: expectedCount,
      actual: actualCount,
      delta: actualCount - expectedCount,
    });
  }
  return differences;
}

export function calculateShots(fleet = {}, modifiers = {}) {
  const safeFleet = normalizeFleetKeys(fleet);
  return Object.entries(safeFleet).reduce((sum, [shipId, count]) => {
    const ship = SHIPS[shipId];
    if (!ship) return sum;
    const stats = applyCombatModifiers(ship, modifiers);
    return sum + count * stats.cannons * SHOTS_PER_CANNON;
  }, 0);
}

export function calculateFirepower(fleet = {}, modifiers = {}) {
  const safeFleet = normalizeFleetKeys(fleet);
  return Object.entries(safeFleet).reduce((sum, [shipId, count]) => {
    const ship = SHIPS[shipId];
    if (!ship) return sum;
    const stats = applyCombatModifiers(ship, modifiers);
    return sum + count * stats.cannons * stats.attack;
  }, 0);
}

export function calculateSuppression(ownFleet, ownModifiers, enemyFleet, enemyModifiers) {
  const ownFirepower = calculateFirepower(ownFleet, ownModifiers);
  const enemyFirepower = calculateFirepower(enemyFleet, enemyModifiers);
  if (ownFirepower <= 0) return 0;
  if (enemyFirepower <= 0) return 1;
  return clamp(Math.pow(ownFirepower / enemyFirepower, 0.85), SUPPRESSION_MIN, 1);
}

export function calculateEffectiveShots(ownFleet, ownModifiers, enemyFleet, enemyModifiers) {
  return Math.round(calculateShots(ownFleet, ownModifiers) * calculateSuppression(ownFleet, ownModifiers, enemyFleet, enemyModifiers));
}

export function calculateFleetCost(fleet = {}) {
  const total = { wood: 0, metal: 0, rum: 0, points: 0 };
  for (const [shipId, count] of Object.entries(normalizeFleetKeys(fleet))) {
    const ship = SHIPS[shipId];
    if (!ship) continue;
    total.wood += ship.cost.wood * count;
    total.metal += ship.cost.metal * count;
    total.rum += ship.cost.rum * count;
  }
  total.points = total.wood + total.metal + total.rum;
  return total;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}x×\n ]/gu, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function parseFleetBlock(block) {
  const fleet = {};
  const lines = normalizeText(block).split(/\n+/).map((line) => line.trim()).filter(Boolean);
  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i];
    const next = lines[i + 1] || "";
    const combined = `${current} ${next}`;
    for (const [shipId, aliases] of Object.entries(SHIP_ALIASES)) {
      if (fleet[shipId]) continue;
      if (!aliases.some((alias) => current.includes(normalizeText(alias)))) continue;
      const countMatch = combined.match(/[x×]\s*([\d ]+)/);
      if (countMatch) fleet[shipId] = Number(countMatch[1].replace(/\s/g, ""));
    }
  }
  return fleet;
}

export function parseFleetText(text) {
  const source = String(text || "");
  const result = { attacker: {}, defender: {}, all: {}, mode: "single", warnings: [] };
  const stateIndex = normalizeText(source).indexOf("stan poczatkowy");
  if (stateIndex >= 0) {
    const normalized = normalizeText(source.slice(stateIndex));
    const attackerStart = normalized.indexOf("agresor flota");
    const defenderStart = normalized.indexOf("obronca flota");
    if (attackerStart >= 0 && defenderStart > attackerStart) {
      result.attacker = parseFleetBlock(normalized.slice(attackerStart, defenderStart));
      const end = normalized.indexOf("agresor flota", defenderStart + 1);
      result.defender = parseFleetBlock(normalized.slice(defenderStart, end > defenderStart ? end : undefined));
      result.mode = "report";
      result.all = { ...result.defender };
      return result;
    }
  }
  result.all = parseFleetBlock(source);
  if (!Object.keys(result.all).length) result.warnings.push("Nie znaleziono statkow w tekscie.");
  return result;
}

export function parseJsonInput(text) {
  if (typeof text === "object" && text) return text;
  return JSON.parse(String(text || "{}"));
}

export function parseScanJson(text) {
  const json = parseJsonInput(text);
  const scan = json.scan || json;
  return {
    type: "scan",
    fleet: normalizeFleetKeys(scan.fleet || {}),
    defense: scan.defense || {},
    resources: scan.resources || {},
    research: scan.research || {},
    talents: scan.talents || {},
    modifiers: modifiersFromResearch(scan.research || {}, scan.talents || {}),
  };
}

export function parseBattleReportJson(text) {
  const json = parseJsonInput(text);
  return {
    type: "battleReport",
    attackerFleet: normalizeFleetKeys(json.forces?.initial?.aggressorFleet || {}),
    defenderFleet: normalizeFleetKeys(json.forces?.initial?.defenderFleet || {}),
    attackerModifiers: normalizeModifiers(json.modifiers?.aggressor || {}),
    defenderModifiers: normalizeModifiers(json.modifiers?.defender || {}),
    summary: json.battleSummary || {},
    rounds: json.rounds || [],
  };
}

function buildUnits(fleet, modifiers) {
  const units = [];
  for (const [shipId, count] of Object.entries(normalizeFleetKeys(fleet))) {
    const base = SHIPS[shipId];
    if (!base) continue;
    const stats = applyCombatModifiers(base, modifiers);
    for (let i = 0; i < count; i += 1) {
      units.push({
        id: shipId,
        name: base.name,
        attack: stats.attack,
        hp: stats.hp,
        maxHp: stats.hp,
        shield: stats.shield,
        shieldLeft: stats.shield,
        cannons: stats.cannons,
        size: stats.size,
      });
    }
  }
  return units;
}

function summarizeUnits(units) {
  return units.reduce((summary, unit) => {
    if (unit.hp > 0) summary[unit.id] = (summary[unit.id] || 0) + 1;
    return summary;
  }, {});
}

function countFleet(fleet = {}) {
  return Object.values(normalizeFleetKeys(fleet)).reduce((sum, count) => sum + count, 0);
}

function diffFleet(start = {}, survivors = {}) {
  const losses = {};
  const safeStart = normalizeFleetKeys(start);
  for (const shipId of Object.keys(SHIPS)) {
    const lost = Math.max(0, (safeStart[shipId] || 0) - (survivors[shipId] || 0));
    if (lost) losses[shipId] = lost;
  }
  return losses;
}

function liveUnits(units) {
  return units.filter((unit) => unit.hp > 0);
}

function weightedTarget(units, rng) {
  const candidates = liveUnits(units);
  if (!candidates.length) return null;
  const targetWeight = (unit) => unit.size * Math.sqrt(Math.max(1, unit.maxHp) / 100);
  const totalWeight = candidates.reduce((sum, unit) => sum + targetWeight(unit), 0);
  let roll = rng() * totalWeight;
  for (const unit of candidates) {
    roll -= targetWeight(unit);
    if (roll <= 0) return unit;
  }
  return candidates[candidates.length - 1];
}

function refreshShields(units) {
  for (const unit of liveUnits(units)) unit.shieldLeft = unit.shield;
}

function removeDestroyed(units) {
  for (let i = units.length - 1; i >= 0; i -= 1) {
    if (units[i].hp <= 0) units.splice(i, 1);
  }
}

function fleetFromUnits(units) {
  return summarizeUnits(units);
}

function fireVolley(attackers, defenders, modifiers, enemyFleet, enemyModifiers, settings, rng) {
  const currentFleet = fleetFromUnits(attackers);
  const plannedShots = calculateEffectiveShots(currentFleet, modifiers, enemyFleet, enemyModifiers);
  const accuracy = clamp(
    settings.baseAccuracy + (rng() * 2 - 1) * settings.accuracyVariance,
    0.05,
    0.95,
  );
  const report = { shots: 0, hits: 0, damage: 0, absorbed: 0 };
  if (!plannedShots || !attackers.length || !defenders.length) return report;
  const totalShots = calculateShots(currentFleet, modifiers);
  const suppressionFactor = totalShots ? plannedShots / totalShots : 0;

  if (settings.targetMode === "focused" && suppressionFactor >= 0.4) {
    const liveAttackers = liveUnits(attackers);
    const rawShots = liveAttackers.map((unit) => unit.cannons * 10);
    const rawTotal = rawShots.reduce((sum, shots) => sum + shots, 0);
    const budgets = rawShots.map((shots) => {
      const exact = rawTotal ? (shots / rawTotal) * plannedShots : 0;
      return { shots: Math.floor(exact), fraction: exact - Math.floor(exact) };
    });
    let remaining = plannedShots - budgets.reduce((sum, budget) => sum + budget.shots, 0);
    for (const budget of budgets.slice().sort((a, b) => b.fraction - a.fraction)) {
      if (remaining <= 0) break;
      budget.shots += 1;
      remaining -= 1;
    }

    for (let unitIndex = 0; unitIndex < liveAttackers.length && liveUnits(defenders).length; unitIndex += 1) {
      const attacker = liveAttackers[unitIndex];
      const target = weightedTarget(defenders, rng);
      if (!target) continue;

      for (let i = 0; i < budgets[unitIndex].shots; i += 1) {
        report.shots += 1;
        if (rng() > accuracy) continue;
        const absorbed = Math.min(target.shieldLeft, attacker.attack);
        const damage = Math.max(0, attacker.attack - absorbed);
        target.shieldLeft -= absorbed;
        target.hp -= damage;
        report.hits += 1;
        report.damage += damage;
        report.absorbed += absorbed;
      }
    }

    report.damage = Math.round(report.damage);
    report.absorbed = Math.round(report.absorbed);
    return report;
  }

  let focusedTarget = null;
  let attackerIndex = 0;
  for (let i = 0; i < plannedShots && liveUnits(defenders).length; i += 1) {
    const liveAttackers = liveUnits(attackers);
    if (!liveAttackers.length) break;
    const attacker = liveAttackers[attackerIndex % liveAttackers.length];
    attackerIndex += 1;
    report.shots += 1;
    if (rng() > accuracy) continue;

    const target = settings.targetMode === "focused"
      ? (focusedTarget && focusedTarget.hp > 0 ? focusedTarget : weightedTarget(defenders, rng))
      : weightedTarget(defenders, rng);
    if (!target) continue;
    focusedTarget = settings.targetMode === "focused" ? target : null;
    const absorbed = Math.min(target.shieldLeft, attacker.attack);
    const damage = Math.max(0, attacker.attack - absorbed);
    target.shieldLeft -= absorbed;
    target.hp -= damage;
    if (target.hp <= 0) focusedTarget = null;
    report.hits += 1;
    report.damage += damage;
    report.absorbed += absorbed;
  }

  report.damage = Math.round(report.damage);
  report.absorbed = Math.round(report.absorbed);
  return report;
}

function resolveModifiers({ modifiers, research, settings, side }) {
  if (modifiers) return normalizeModifiers(modifiers);
  const base = modifiersFromResearch(research || {});
  if (settings.planningMode === "conservative" && side === "defender") {
    base.weaponsPct += (Number(settings.defenderHiddenArmaments) || 0) * 5;
  }
  return base;
}

export function runBattle({
  attackerFleet = {},
  defenderFleet = {},
  attackerModifiers,
  defenderModifiers,
  attackerResearch = {},
  defenderResearch = {},
  settings = {},
  rng = createRng(),
} = {}) {
  const mergedSettings = normalizeSettings(settings);
  const attackerMods = resolveModifiers({ modifiers: attackerModifiers, research: attackerResearch, settings: mergedSettings, side: "attacker" });
  const defenderMods = resolveModifiers({ modifiers: defenderModifiers, research: defenderResearch, settings: mergedSettings, side: "defender" });
  const attackerStart = normalizeFleetKeys(attackerFleet);
  const defenderStart = normalizeFleetKeys(defenderFleet);
  const attackers = buildUnits(attackerStart, attackerMods);
  const defenders = buildUnits(defenderStart, defenderMods);
  const rounds = [];

  for (let round = 1; round <= mergedSettings.maxRounds && attackers.length && defenders.length; round += 1) {
    refreshShields(attackers);
    refreshShields(defenders);
    const attackerBefore = summarizeUnits(attackers);
    const defenderBefore = summarizeUnits(defenders);
    const attackerCountBefore = attackers.length;
    const defenderCountBefore = defenders.length;
    const attackerShooters = attackers.map((unit) => ({ ...unit }));
    const defenderShooters = defenders.map((unit) => ({ ...unit }));

    const attackerVolley = fireVolley(attackerShooters, defenders, attackerMods, defenderBefore, defenderMods, mergedSettings, rng);
    const defenderVolley = fireVolley(defenderShooters, attackers, defenderMods, attackerBefore, attackerMods, mergedSettings, rng);

    removeDestroyed(attackers);
    removeDestroyed(defenders);
    const attackerAfter = summarizeUnits(attackers);
    const defenderAfter = summarizeUnits(defenders);

    rounds.push({
      number: round,
      attacker: {
        before: attackerCountBefore,
        after: attackers.length,
        losses: diffFleet(attackerBefore, attackerAfter),
        ...defenderVolley,
      },
      defender: {
        before: defenderCountBefore,
        after: defenders.length,
        losses: diffFleet(defenderBefore, defenderAfter),
        ...attackerVolley,
      },
    });
  }

  const attackerSurvivors = summarizeUnits(attackers);
  const defenderSurvivors = summarizeUnits(defenders);
  const attackerLosses = diffFleet(attackerStart, attackerSurvivors);
  const defenderLosses = diffFleet(defenderStart, defenderSurvivors);
  const attackerLossCost = calculateFleetCost(attackerLosses);
  const defenderLossCost = calculateFleetCost(defenderLosses);
  const allLossCost = {
    wood: attackerLossCost.wood + defenderLossCost.wood,
    metal: attackerLossCost.metal + defenderLossCost.metal,
    rum: attackerLossCost.rum + defenderLossCost.rum,
  };
  let winner = "draw";
  if (attackers.length > 0 && defenders.length === 0) winner = "attacker";
  if (defenders.length > 0 && attackers.length === 0) winner = "defender";

  return {
    winner,
    rounds,
    attacker: {
      start: countFleet(attackerStart),
      survivors: attackers.length,
      survivorFleet: attackerSurvivors,
      losses: attackerLosses,
      lossCost: attackerLossCost,
    },
    defender: {
      start: countFleet(defenderStart),
      survivors: defenders.length,
      survivorFleet: defenderSurvivors,
      losses: defenderLosses,
      lossCost: defenderLossCost,
    },
    debris: {
      wood: Math.round(allLossCost.wood * DEBRIS_RATE),
      metal: Math.round(allLossCost.metal * DEBRIS_RATE),
      rum: Math.round(allLossCost.rum * DEBRIS_RATE),
    },
  };
}

function addFleetTotals(target, fleet) {
  for (const shipId of Object.keys(SHIPS)) {
    target[shipId] = (target[shipId] || 0) + (fleet[shipId] || 0);
  }
}

export function runMonteCarlo({
  attackerFleet = {},
  defenderFleet = {},
  attackerModifiers,
  defenderModifiers,
  attackerResearch = {},
  defenderResearch = {},
  settings = {},
  seed = "firepower",
} = {}) {
  const mergedSettings = normalizeSettings(settings);
  const runs = Math.max(1, Math.floor(mergedSettings.runs || 1));
  const outcomes = { attacker: 0, defender: 0, draw: 0 };
  const averageAttackerSurvivors = {};
  const averageDefenderSurvivors = {};
  const averageAttackerLosses = {};
  const averageDefenderLosses = {};
  const averageDebris = { wood: 0, metal: 0, rum: 0 };
  let averageAttackerLossPoints = 0;
  let averageDefenderLossPoints = 0;
  let sample = null;

  for (let i = 0; i < runs; i += 1) {
    const battle = runBattle({
      attackerFleet,
      defenderFleet,
      attackerModifiers,
      defenderModifiers,
      attackerResearch,
      defenderResearch,
      settings: mergedSettings,
      rng: createRng(`${seed}:${i}`),
    });
    outcomes[battle.winner] += 1;
    addFleetTotals(averageAttackerSurvivors, battle.attacker.survivorFleet);
    addFleetTotals(averageDefenderSurvivors, battle.defender.survivorFleet);
    addFleetTotals(averageAttackerLosses, battle.attacker.losses);
    addFleetTotals(averageDefenderLosses, battle.defender.losses);
    averageAttackerLossPoints += battle.attacker.lossCost.points;
    averageDefenderLossPoints += battle.defender.lossCost.points;
    averageDebris.wood += battle.debris.wood;
    averageDebris.metal += battle.debris.metal;
    averageDebris.rum += battle.debris.rum;
    if (!sample) sample = battle;
  }

  for (const shipId of Object.keys(SHIPS)) {
    averageAttackerSurvivors[shipId] = (averageAttackerSurvivors[shipId] || 0) / runs;
    averageDefenderSurvivors[shipId] = (averageDefenderSurvivors[shipId] || 0) / runs;
    averageAttackerLosses[shipId] = (averageAttackerLosses[shipId] || 0) / runs;
    averageDefenderLosses[shipId] = (averageDefenderLosses[shipId] || 0) / runs;
  }

  return {
    runs,
    outcomes,
    outcomeRates: {
      attacker: outcomes.attacker / runs,
      defender: outcomes.defender / runs,
      draw: outcomes.draw / runs,
    },
    averageAttackerSurvivors,
    averageDefenderSurvivors,
    averageAttackerLosses,
    averageDefenderLosses,
    averageAttackerLossPoints: averageAttackerLossPoints / runs,
    averageDefenderLossPoints: averageDefenderLossPoints / runs,
    averageDebris: {
      wood: averageDebris.wood / runs,
      metal: averageDebris.metal / runs,
      rum: averageDebris.rum / runs,
    },
    sample,
  };
}
