/* Generated from simulator-core.js and app.js so index.html works from file:// */
(function(){
const SHOTS_PER_CANNON = 1;
const SUPPRESSION_MIN = 0.15;
const DEBRIS_RATE = 0.55;
const WRECK_WOOD_RATE = 0.45;
const WRECK_METAL_RATE = 0.60;

const SHIPS = {
  dinghy: {
    jsonKey: "dinghy",
    name: "Szalupa",
    attack: 1.5,
    hp: 5,
    shield: 0,
    size: 0.45,
    cannons: 1,
    speed: 0.6,
    cargo: 3000,
    crew: 4,
    cost: { wood: 2000, metal: 0, rum: 0 },
  },
  scout: {
    jsonKey: "scoutCutter",
    name: "Kuter Zwiadowczy",
    attack: 0,
    hp: 12,
    shield: 0,
    size: 0.25,
    cannons: 0,
    speed: 2.2,
    cargo: 0,
    crew: 3,
    cost: { wood: 2500, metal: 0, rum: 0 },
  },
  sloop: {
    jsonKey: "sloop",
    name: "Slup",
    attack: 1.6,
    hp: 120,
    shield: 12,
    size: 0.75,
    cannons: 8,
    speed: 1.65,
    cargo: 80,
    crew: 18,
    cost: { wood: 4000, metal: 600, rum: 0 },
  },
  brig: {
    jsonKey: "brig",
    name: "Bryg",
    attack: 2.4,
    hp: 300,
    shield: 45,
    size: 1,
    cannons: 16,
    speed: 1.25,
    cargo: 120,
    crew: 45,
    cost: { wood: 5000, metal: 1200, rum: 0 },
  },
  xebec: {
    jsonKey: "xebec",
    name: "Szebeka",
    attack: 3.1,
    hp: 240,
    shield: 26,
    size: 0.9,
    cannons: 19,
    speed: 1.75,
    cargo: 180,
    crew: 42,
    cost: { wood: 7000, metal: 2000, rum: 0 },
  },
  cargo: {
    jsonKey: "cargoShip",
    name: "Statek Towarowy",
    attack: 0.8,
    hp: 260,
    shield: 12,
    size: 1.45,
    cannons: 4,
    speed: 0.95,
    cargo: 9000,
    crew: 22,
    cost: { wood: 5000, metal: 500, rum: 0 },
  },
  frigate: {
    jsonKey: "frigate",
    name: "Fregata",
    attack: 4.2,
    hp: 420,
    shield: 55,
    size: 1.1,
    cannons: 28,
    speed: 1.25,
    cargo: 160,
    crew: 70,
    cost: { wood: 10000, metal: 3000, rum: 0 },
  },
  warship: {
    jsonKey: "warship",
    name: "Okret Wojenny",
    attack: 4.8,
    hp: 900,
    shield: 140,
    size: 1.35,
    cannons: 36,
    speed: 0.9,
    cargo: 120,
    crew: 110,
    cost: { wood: 25000, metal: 8000, rum: 0 },
  },
  shipOfTheLine: {
    jsonKey: "shipOfTheLine",
    name: "Okret Liniowy",
    attack: 5.8,
    hp: 1250,
    shield: 190,
    size: 1.55,
    cannons: 64,
    speed: 0.8,
    cargo: 140,
    crew: 140,
    cost: { wood: 44000, metal: 15000, rum: 0 },
  },
  manOfWar: {
    jsonKey: "manOfWar",
    name: "Man-of-War",
    attack: 6.8,
    hp: 1900,
    shield: 280,
    size: 1.9,
    cannons: 90,
    speed: 0.65,
    cargo: 120,
    crew: 180,
    cost: { wood: 84000, metal: 30000, rum: 0 },
  },
  bomber: {
    jsonKey: "bomber",
    name: "Okret Bombowy",
    attack: 9.5,
    hp: 360,
    shield: 30,
    size: 1.25,
    cannons: 10,
    speed: 0.75,
    cargo: 60,
    crew: 65,
    cost: { wood: 15000, metal: 5600, rum: 0 },
  },
  fire: {
    jsonKey: "fireShip",
    name: "Statek Ogniowy",
    attack: 22,
    hp: 140,
    shield: 8,
    size: 0.8,
    cannons: 2,
    speed: 1.1,
    cargo: 0,
    crew: 12,
    cost: { wood: 6400, metal: 1800, rum: 0 },
  },
  colony: {
    jsonKey: "colonyShip",
    name: "Statek Kolonialny",
    attack: 0.5,
    hp: 350,
    shield: 25,
    size: 1.7,
    cannons: 2,
    speed: 0.7,
    cargo: 600,
    crew: 80,
    cost: { wood: 10000, metal: 5000, rum: 2000 },
  },
};

const DEFAULT_MODIFIERS = {
  weaponsPct: 0,
  hullsPct: 0,
  armorPct: 0,
  cannonsFlat: 0,
  accuracyPct: 0,
};

const DEFAULT_RESEARCH = {
  navigation: 0,
  sailing: 0,
  hulls: 0,
  weapons: 0,
  armor: 0,
  armaments: 0,
  fortifications: 0,
};

const DEFAULT_SETTINGS = {
  runs: 500,
  maxRounds: 6,
  baseAccuracy: 0.6,
  accuracyVariance: 0.1,
  targetMode: "focused",
  planningMode: "raw",
  defenderHiddenNavigation: 0,
  defenderHiddenArmaments: 0,
};

const JSON_TO_INTERNAL = {
  ...Object.fromEntries(Object.entries(SHIPS).map(([id, ship]) => [ship.jsonKey, id])),
  longboat: "dinghy",
};

const JSON_KEY_ALIASES = {
  dinghy: ["dinghy", "rowboat", "shallop", "longboat", "patache"],
  scout: ["scoutCutter", "scout", "scoutShip", "scoutBoat", "reconShip"],
  sloop: ["sloop"],
  brig: ["brig"],
  xebec: ["xebec", "zebec", "xebecShip"],
  cargo: ["cargoShip", "cargo", "cargo_ship", "transport", "transportShip", "merchantShip"],
  frigate: ["frigate"],
  warship: ["warship", "warShip", "battleShip"],
  shipOfTheLine: ["shipOfTheLine", "shipOfLine", "lineShip", "lineOfBattleShip"],
  manOfWar: ["manOfWar", "manowar", "man_o_war", "man-of-war"],
  bomber: ["bomber", "bombShip", "bombardShip", "bombVessel"],
  fire: ["fireShip", "fire_ship", "fireship"],
  colony: ["colonyShip", "colonialShip", "colony", "colonizer"],
};

function normalizeJsonKey(key) {
  return String(key || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

const NORMALIZED_JSON_TO_INTERNAL = Object.fromEntries(
  Object.entries(JSON_KEY_ALIASES).flatMap(([shipId, aliases]) => aliases.map((alias) => [normalizeJsonKey(alias), shipId])),
);

const SHIP_ALIASES = {
  dinghy: ["szalupa", "dinghy", "longboat", "lodz zwiadowcza", "lodka zwiadowcza"],
  scout: ["kuter zwiadowczy", "zwiadowczy", "scout cutter", "scoutcutter"],
  sloop: ["slup", "sloop"],
  brig: ["bryg", "brig"],
  xebec: ["szebeka", "xebec"],
  cargo: ["statek towarowy", "towarowy", "cargo", "cargoship"],
  frigate: ["fregata", "frigate"],
  warship: ["okret wojenny", "warship"],
  shipOfTheLine: ["okret liniowy", "liniowy", "ship of the line", "shipoftheline"],
  manOfWar: ["man of war", "manofwar"],
  bomber: ["okret bombowy", "bombowy", "bomber"],
  fire: ["statek ogniowy", "ogniowy", "fireship"],
  colony: ["statek kolonialny", "colony"],
};

function createRng(seed = "firepower") {
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function normalizeSettings(settings = {}) {
  return { ...DEFAULT_SETTINGS, ...settings };
}

function normalizeModifiers(modifiers = {}) {
  return { ...DEFAULT_MODIFIERS, ...modifiers };
}

function modifiersFromResearch(research = {}, talents = {}) {
  const weapons = Number(research.weapons ?? research.armaments ?? 0);
  const hulls = Number(research.hulls ?? 0);
  const armor = Number(research.armor ?? research.fortifications ?? 0);
  const accuracy = Number(research.fireControl ?? research.accuracy ?? 0);
  const coreAttack = Number(talents.core_attack ?? 0);
  const combatHp = Number(talents.combat_hp ?? 0);
  const combatAbsorb = Number(talents.combat_absorb ?? 0);
  const combatCannon = Number(talents.combat_cannon ?? 0);
  return {
    weaponsPct: weapons * 5 + coreAttack * 4,
    hullsPct: hulls * 5 + combatHp * 3,
    armorPct: armor * 5 + combatAbsorb * 3,
    cannonsFlat: combatCannon * 2,
    accuracyPct: accuracy * 5,
  };
}

function applyResearch(ship, research = {}) {
  return applyCombatModifiers(ship, modifiersFromResearch(research));
}

function applyCombatModifiers(ship, modifiers = {}) {
  const mods = normalizeModifiers(modifiers);
  return {
    ...ship,
    attack: ship.attack * (1 + mods.weaponsPct / 100),
    hp: ship.hp * (1 + mods.hullsPct / 100),
    shield: ship.shield * (1 + mods.armorPct / 100),
    cannons: Math.max(0, ship.cannons + mods.cannonsFlat),
  };
}

function normalizeFleetKeys(fleet = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(fleet || {})) {
    const shipId = SHIPS[key] ? key : JSON_TO_INTERNAL[key] || NORMALIZED_JSON_TO_INTERNAL[normalizeJsonKey(key)];
    if (!shipId) continue;
    const count = Math.max(0, Math.floor(Number(value) || 0));
    if (count) normalized[shipId] = (normalized[shipId] || 0) + count;
  }
  return normalized;
}

function compareFleets(expectedFleet = {}, actualFleet = {}) {
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

function calculateShots(fleet = {}, modifiers = {}) {
  const safeFleet = normalizeFleetKeys(fleet);
  return Object.entries(safeFleet).reduce((sum, [shipId, count]) => {
    const ship = SHIPS[shipId];
    if (!ship) return sum;
    const stats = applyCombatModifiers(ship, modifiers);
    if (stats.attack <= 0 || stats.cannons <= 0) return sum;
    return sum + count * stats.cannons * SHOTS_PER_CANNON;
  }, 0);
}

function calculateFirepower(fleet = {}, modifiers = {}) {
  const safeFleet = normalizeFleetKeys(fleet);
  return Object.entries(safeFleet).reduce((sum, [shipId, count]) => {
    const ship = SHIPS[shipId];
    if (!ship) return sum;
    const stats = applyCombatModifiers(ship, modifiers);
    return sum + count * stats.cannons * stats.attack;
  }, 0);
}

function calculateSuppression(ownFleet, ownModifiers, enemyFleet, enemyModifiers) {
  const ownFirepower = calculateFirepower(ownFleet, ownModifiers);
  const enemyFirepower = calculateFirepower(enemyFleet, enemyModifiers);
  if (ownFirepower <= 0) return 0;
  if (enemyFirepower <= 0) return 1;
  return clamp(Math.pow(ownFirepower / enemyFirepower, 0.85), SUPPRESSION_MIN, 1);
}

function calculateEffectiveShots(ownFleet, ownModifiers, enemyFleet, enemyModifiers) {
  return Math.round(calculateShots(ownFleet, ownModifiers) * calculateSuppression(ownFleet, ownModifiers, enemyFleet, enemyModifiers));
}

function calculateFleetCost(fleet = {}) {
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
      if (countMatch) {
        fleet[shipId] = Number(countMatch[1].replace(/\s/g, ""));
        break;
      }
    }
  }
  return fleet;
}

function parseFleetText(text) {
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

function parseJsonInput(text) {
  if (typeof text === "object" && text) return text;
  return JSON.parse(String(text || "{}"));
}

function parseScanJson(text) {
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

function parseBattleReportJson(text) {
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

function resolveModifiers({ modifiers, research, settings, side }) {
  if (modifiers) return normalizeModifiers(modifiers);
  const base = modifiersFromResearch(research || {});
  if (settings.planningMode === "conservative" && side === "defender") {
    base.weaponsPct += (Number(settings.defenderHiddenArmaments) || 0) * 5;
  }
  return base;
}

const SHIP_CLASSES = {
  dinghy: "scout",
  scout: "scout",
  sloop: "raider",
  brig: "escort",
  xebec: "raider",
  cargo: "transport",
  frigate: "skirmisher",
  warship: "line",
  shipOfTheLine: "line",
  manOfWar: "capital",
  bomber: "siege",
  fire: "suicide",
  colony: "colony",
};

const PROFILE_OVERRIDES = {
  dinghy: {
    combatCapable: true,
    targetWeights: { scout: 1.8, transport: 1.25, raider: 0.85 },
    defaultTargetWeight: 0.55,
    defaultDamageMultiplier: 0.70,
  },
  scout: { combatCapable: false, defaultTargetWeight: 0, defaultDamageMultiplier: 0 },
  cargo: {
    combatCapable: false,
    targetWeights: { raider: 1.6, scout: 1.3, suicide: 1.1, transport: 0.9, escort: 0.7, skirmisher: 0.6, capital: 0.45, line: 0.45 },
    defaultTargetWeight: 0.45,
    defaultDamageMultiplier: 0.60,
  },
  colony: { combatCapable: false, defaultTargetWeight: 0.35, defaultDamageMultiplier: 0.50 },
  sloop: {
    targetWeights: { transport: 2.2, scout: 1.8, colony: 1.5, raider: 1.1, escort: 0.75, capital: 0.45, line: 0.55 },
    rapidFire: { scout: 0.75, transport: 0.50, colony: 0.40 },
    damageMultipliers: { transport: 1.25, capital: 0.75, line: 0.85 },
    classAccuracyBonuses: { scout: 0.05, transport: 0.04 },
  },
  brig: {
    targetWeights: { suicide: 1.8, raider: 1.45, scout: 1.25, escort: 1.0, skirmisher: 0.9, transport: 0.8, capital: 0.45, line: 0.55 },
    rapidFire: { raider: 0.35, scout: 0.75, suicide: 0.60 },
    damageMultipliers: { raider: 1.12, scout: 1.08, capital: 0.82 },
  },
  xebec: {
    targetWeights: { transport: 2.25, scout: 1.85, colony: 1.45, raider: 1.15, siege: 1.0, escort: 0.9, skirmisher: 0.8, capital: 0.45, line: 0.55 },
    rapidFire: { transport: 0.60, scout: 0.85, colony: 0.45, raider: 0.25 },
    damageMultipliers: { transport: 1.22, scout: 1.10, capital: 0.75, line: 0.85 },
    classAccuracyBonuses: { scout: 0.05, transport: 0.04 },
  },
  frigate: {
    targetWeights: { escort: 1.45, raider: 1.35, siege: 1.1, skirmisher: 1.0, transport: 0.85, capital: 0.55, line: 0.65 },
    rapidFire: { escort: 0.35, raider: 0.35, siege: 0.25 },
    damageMultipliers: { escort: 1.12, raider: 1.10, siege: 1.15, capital: 0.85 },
  },
  warship: {
    targetWeights: { skirmisher: 3.2, escort: 2.7, line: 2.2, capital: 1.8, raider: 1.3, siege: 1.1, suicide: 0.9, transport: 0.08, colony: 0.06, scout: 0.05 },
    rapidFire: { skirmisher: 0.35, escort: 0.30, line: 0.25, raider: 0.15 },
    damageMultipliers: { skirmisher: 1.08, escort: 1.06, line: 1.05, capital: 1.02, raider: 0.85, transport: 0.65, colony: 0.6, scout: 0.45 },
  },
  shipOfTheLine: {
    targetWeights: { line: 4.0, skirmisher: 3.4, capital: 3.0, escort: 2.7, siege: 2.0, raider: 1.3, suicide: 1.0, transport: 0.08, colony: 0.06, scout: 0.05 },
    rapidFire: { line: 0.35, skirmisher: 0.35, escort: 0.30, capital: 0.25, siege: 0.15 },
    damageMultipliers: { line: 1.08, skirmisher: 1.06, capital: 1.05, escort: 1.04, raider: 0.75, transport: 0.60, colony: 0.55, scout: 0.42 },
  },
  manOfWar: {
    targetWeights: { capital: 4.2, line: 3.8, skirmisher: 3.2, escort: 2.5, siege: 1.9, raider: 1.15, suicide: 0.9, transport: 0.07, colony: 0.05, scout: 0.04 },
    rapidFire: { capital: 0.35, line: 0.35, skirmisher: 0.35, escort: 0.25, siege: 0.15 },
    damageMultipliers: { capital: 1.12, line: 1.08, skirmisher: 1.06, escort: 1.03, raider: 0.7, transport: 0.55, colony: 0.50, scout: 0.40 },
  },
  bomber: {
    targetWeights: { siege: 3.0, capital: 2.8, line: 2.5, skirmisher: 1.4, escort: 1.2, raider: 0.75, transport: 0.08, colony: 0.06, scout: 0.04 },
    rapidFire: { siege: 0.35, capital: 0.30, line: 0.30, skirmisher: 0.15 },
    damageMultipliers: { capital: 1.16, line: 1.12, siege: 1.15, skirmisher: 0.95, raider: 0.65, transport: 0.55 },
    classAccuracyBonuses: { capital: 0.06, line: 0.04 },
  },
  fire: {
    targetWeights: { capital: 1.8, line: 1.55, siege: 1.2, skirmisher: 0.65, escort: 0.55, raider: 0.45 },
    rapidFire: { capital: 0.35, line: 0.30, siege: 0.25 },
    damageMultipliers: { capital: 1.45, line: 1.35, siege: 1.25, skirmisher: 0.85, raider: 0.65, scout: 0.45 },
  },
};

function getUnitStats(shipId) {
  const ship = SHIPS[shipId];
  const override = PROFILE_OVERRIDES[shipId] || {};
  return {
    ...ship,
    defense: ship.shield,
    shipClass: SHIP_CLASSES[shipId] || "line",
    combatCapable: override.combatCapable ?? true,
    defaultTargetWeight: override.defaultTargetWeight ?? 1,
    defaultDamageMultiplier: override.defaultDamageMultiplier ?? 1,
    targetWeights: override.targetWeights || {},
    rapidFire: override.rapidFire || {},
    damageMultipliers: override.damageMultipliers || {},
    classAccuracyBonuses: override.classAccuracyBonuses || {},
  };
}

function buildGroups(fleet) {
  return Object.entries(normalizeFleetKeys(fleet))
    .map(([shipId, count]) => ({ name: shipId, stats: getUnitStats(shipId), count, damagePool: 0 }))
    .filter((group) => group.count > 0 && group.stats);
}

function fleetToMap(groups) {
  const out = {};
  for (const group of groups) {
    if (group.count > 0) out[group.name] = group.count;
  }
  return out;
}

function getSizeHitModifier(size) {
  if (size <= 0.70) return -0.15;
  if (size <= 1.00) return -0.05;
  if (size <= 1.40) return 0.05;
  if (size <= 1.70) return 0.12;
  return 0.20;
}

function applyArmor(rawDamage, armor) {
  if (rawDamage <= 0) return 0;
  const normalizedArmor = Math.max(0, armor);
  const reduced = rawDamage * 100 / (100 + normalizedArmor);
  return Math.max(reduced, rawDamage * 0.10);
}

function getTargetPriority(attackerStats, targetClass) {
  return Math.max(0, attackerStats.targetWeights[targetClass] ?? attackerStats.defaultTargetWeight ?? 0);
}

function getRapidFireMultiplier(attackerStats, targetClass) {
  return 1 + Math.max(0, attackerStats.rapidFire[targetClass] || 0);
}

function getDamageMultiplier(attackerStats, targetClass) {
  return Math.max(0, attackerStats.damageMultipliers[targetClass]
    ?? attackerStats.damageMultipliers.all
    ?? attackerStats.defaultDamageMultiplier
    ?? 1);
}

function getHitChance(attacker, attackerStats, targetStats) {
  let chance = 0.55;
  chance += getSizeHitModifier(targetStats.size);
  chance += attacker.accuracyLevel * attacker.accuracyPctPerLevel / 100;
  chance += attacker.accuracyBonusPct || 0;
  chance += attackerStats.classAccuracyBonuses[targetStats.shipClass] || 0;
  return clamp(chance, 0.20, 0.95);
}

function normalSample(rng) {
  const u1 = Math.max(Number.EPSILON, rng());
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function sampleMeanOneLognormal(rng, sigma, minV, maxV) {
  if (sigma <= 0) return 1;
  const value = Math.exp((-0.5 * sigma * sigma) + sigma * normalSample(rng));
  return clamp(value, minV, maxV);
}

function sampleHits(effectiveShots, hitChance, rng) {
  if (effectiveShots <= 0 || hitChance <= 0) return 0;
  if (hitChance >= 1) return Math.round(effectiveShots);
  const shots = Math.max(0, effectiveShots);
  const chance = clamp(hitChance, 0, 1);
  if (shots <= 5000) {
    const whole = Math.floor(shots);
    const fractional = shots - whole;
    let attempts = whole + (rng() < fractional ? 1 : 0);
    let hits = 0;
    while (attempts > 0) {
      if (rng() < chance) hits += 1;
      attempts -= 1;
    }
    return hits;
  }
  const mean = shots * chance;
  const variance = shots * chance * (1 - chance);
  if (variance <= 1e-9) return Math.round(mean);
  return Math.max(0, Math.min(Math.round(shots), Math.round(mean + normalSample(rng) * Math.sqrt(variance))));
}

function playerFromModifiers(modifiers = {}) {
  const mods = normalizeModifiers(modifiers);
  return {
    weaponsLevel: 0,
    weaponsPctPerLevel: 0,
    accuracyLevel: 0,
    accuracyPctPerLevel: 0,
    defenseLevel: 0,
    defensePctPerLevel: 0,
    hullsLevel: 0,
    hullsPctPerLevel: 0,
    attackBonusPct: mods.weaponsPct / 100,
    hullBonusPct: mods.hullsPct / 100,
    absorbBonusPct: mods.armorPct / 100,
    accuracyBonusPct: mods.accuracyPct / 100,
    cannonBonusFlat: mods.cannonsFlat,
  };
}

function isCombatCapable(group) {
  if (group.count <= 0 || !group.stats.combatCapable) return false;
  if (group.stats.attack > 1) return true;
  if (["transport", "colony", "scout"].includes(group.stats.shipClass)) return false;
  return group.stats.attack > 0 || group.stats.cannons > 0;
}

function anyCombatCapable(fleet) {
  return fleet.some(isCombatCapable);
}

function applyDamageAndCleanup(fleet, owner, roundDamageByUnit, roundEngagementsByUnit, rng) {
  const hpBonus = 1 + owner.hullsLevel * owner.hullsPctPerLevel / 100 + owner.hullBonusPct;
  for (const group of fleet) {
    if (group.count <= 0) continue;
    const hpPerShip = Math.max(1, group.stats.hp * hpBonus);
    const roundDamage = Math.max(0, roundDamageByUnit[group.name] || 0);
    const roundEngagements = Math.max(0, roundEngagementsByUnit[group.name] || 0);
    let spreadFactor = 0;
    if (roundEngagements > 0 && group.count > 0) {
      const lambda = roundEngagements / group.count;
      const focused = 1 - Math.exp(-2.5 * Math.max(0, lambda));
      const focusLuck = sampleMeanOneLognormal(rng, 0.10, 0.75, 1.25);
      spreadFactor = clamp((0.02 + 0.98 * focused) * focusLuck, 0.02, 1);
    }
    group.damagePool += roundDamage * spreadFactor;
    if (group.damagePool <= 0) continue;
    const exactDestroyed = group.damagePool / hpPerShip;
    let destroyed = Math.floor(exactDestroyed);
    if (rng() < exactDestroyed - destroyed && destroyed < group.count) destroyed += 1;
    destroyed = Math.max(0, Math.min(group.count, destroyed));
    group.count -= destroyed;
    if (destroyed > 0) group.damagePool = Math.max(0, group.damagePool - hpPerShip * destroyed);
  }
  for (let i = fleet.length - 1; i >= 0; i -= 1) {
    if (fleet[i].count <= 0) fleet.splice(i, 1);
  }
}

function resolveSideDamage(attackerSnapshot, attackerPlayer, defenderSnapshot, defenderPlayer, activeRatio, volleyLuck, rng) {
  const damageBucketByTarget = {};
  const engagementBucketByTarget = {};
  const hitsBucketByTarget = {};
  const totals = {
    cannonShots: 0,
    rapidExtraShots: 0,
    effectiveShots: 0,
    hits: 0,
    damage: 0,
    absorbed: 0,
    damageToUnit: {},
    primaryTargetClassByUnit: {},
  };
  const attackBonus = 1 + attackerPlayer.weaponsLevel * attackerPlayer.weaponsPctPerLevel / 100 + attackerPlayer.attackBonusPct;
  const armorBonus = 1 + defenderPlayer.defenseLevel * defenderPlayer.defensePctPerLevel / 100 + defenderPlayer.absorbBonusPct;

  for (const attackerGroup of attackerSnapshot) {
    if (attackerGroup.count <= 0 || attackerGroup.stats.attack <= 0) continue;
    const cannons = Math.max(0, attackerGroup.stats.cannons + attackerPlayer.cannonBonusFlat);
    if (cannons <= 0) continue;
    const baseShots = attackerGroup.count * cannons * SHOTS_PER_CANNON * Math.max(0, activeRatio);
    if (baseShots <= 0) continue;

    const targetRefs = [];
    let weightSum = 0;
    let maxWeight = -1;
    let primaryClass = "";
    for (const target of defenderSnapshot) {
      if (target.count <= 0) continue;
      const priority = getTargetPriority(attackerGroup.stats, target.stats.shipClass);
      const weight = target.count * Math.max(0.01, target.stats.size) * priority;
      if (weight <= 0) continue;
      targetRefs.push({ group: target, weight });
      weightSum += weight;
      if (weight > maxWeight) {
        maxWeight = weight;
        primaryClass = target.stats.shipClass;
      }
    }
    if (weightSum <= 0) continue;
    if (primaryClass) totals.primaryTargetClassByUnit[attackerGroup.name] = primaryClass;

    const formationLuck = sampleMeanOneLognormal(rng, 0.08, 0.80, 1.20);
    const effectiveAttack = attackerGroup.stats.attack * attackBonus;
    for (const targetRef of targetRefs) {
      const target = targetRef.group;
      const share = targetRef.weight / weightSum;
      const shotsAgainstTarget = baseShots * share;
      if (shotsAgainstTarget <= 0) continue;
      const rapid = getRapidFireMultiplier(attackerGroup.stats, target.stats.shipClass);
      const damageMult = getDamageMultiplier(attackerGroup.stats, target.stats.shipClass);
      const hitChance = getHitChance(attackerPlayer, attackerGroup.stats, target.stats);
      const expectedShots = shotsAgainstTarget * rapid;
      const sampledHits = sampleHits(expectedShots, hitChance, rng);
      const targetLuck = sampleMeanOneLognormal(rng, 0.03, 0.92, 1.08);
      const rawDamage = sampledHits * effectiveAttack * damageMult * volleyLuck * formationLuck * targetLuck;
      if (rawDamage <= 0) continue;
      const armor = Math.max(0, target.stats.defense * armorBonus);
      const finalDamage = applyArmor(rawDamage, armor);
      const absorbed = Math.max(0, rawDamage - finalDamage);
      damageBucketByTarget[target.name] = (damageBucketByTarget[target.name] || 0) + finalDamage;
      engagementBucketByTarget[target.name] = (engagementBucketByTarget[target.name] || 0) + attackerGroup.count * share;
      hitsBucketByTarget[target.name] = (hitsBucketByTarget[target.name] || 0) + sampledHits;
      totals.cannonShots += shotsAgainstTarget;
      totals.rapidExtraShots += Math.max(0, expectedShots - shotsAgainstTarget);
      totals.effectiveShots += expectedShots;
      totals.hits += sampledHits;
      totals.damage += finalDamage;
      totals.absorbed += absorbed;
      totals.damageToUnit[attackerGroup.name] = (totals.damageToUnit[attackerGroup.name] || 0) + finalDamage;
    }
  }
  return { damageBucketByTarget, engagementBucketByTarget, hitsBucketByTarget, totals };
}

function runBattle({
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
  const attackerPlayer = playerFromModifiers(attackerMods);
  const defenderPlayer = playerFromModifiers(defenderMods);
  const attackers = buildGroups(attackerStart);
  const defenders = buildGroups(defenderStart);
  const rounds = [];

  for (let round = 1; round <= mergedSettings.maxRounds && attackers.length && defenders.length; round += 1) {
    const attackerBefore = fleetToMap(attackers);
    const defenderBefore = fleetToMap(defenders);
    const attackerCountBefore = countFleet(attackerBefore);
    const defenderCountBefore = countFleet(defenderBefore);
    const attackerSnapshot = attackers.map((group) => ({ ...group }));
    const defenderSnapshot = defenders.map((group) => ({ ...group }));
    const attackerVolleyLuck = sampleMeanOneLognormal(rng, 0.10, 0.75, 1.25);
    const defenderVolleyLuck = sampleMeanOneLognormal(rng, 0.10, 0.75, 1.25);
    const attackerResolved = resolveSideDamage(attackerSnapshot, attackerPlayer, defenderSnapshot, defenderPlayer, 1, attackerVolleyLuck, rng);
    const defenderResolved = resolveSideDamage(defenderSnapshot, defenderPlayer, attackerSnapshot, attackerPlayer, 1, defenderVolleyLuck, rng);

    applyDamageAndCleanup(attackers, attackerPlayer, defenderResolved.damageBucketByTarget, defenderResolved.engagementBucketByTarget, rng);
    applyDamageAndCleanup(defenders, defenderPlayer, attackerResolved.damageBucketByTarget, attackerResolved.engagementBucketByTarget, rng);

    for (const snap of attackerSnapshot) {
      if (snap.count <= 0 || snap.stats.shipClass !== "suicide") continue;
      const consumed = Math.max(1, Math.round(snap.count));
      const live = attackers.find((group) => group.name === snap.name);
      if (live) live.count = Math.max(0, live.count - consumed);
    }
    for (const snap of defenderSnapshot) {
      if (snap.count <= 0 || snap.stats.shipClass !== "suicide") continue;
      const consumed = Math.max(1, Math.round(snap.count));
      const live = defenders.find((group) => group.name === snap.name);
      if (live) live.count = Math.max(0, live.count - consumed);
    }
    for (let i = attackers.length - 1; i >= 0; i -= 1) if (attackers[i].count <= 0) attackers.splice(i, 1);
    for (let i = defenders.length - 1; i >= 0; i -= 1) if (defenders[i].count <= 0) defenders.splice(i, 1);

    const attackerAfter = fleetToMap(attackers);
    const defenderAfter = fleetToMap(defenders);

    rounds.push({
      number: round,
      attacker: {
        before: attackerCountBefore,
        after: countFleet(attackerAfter),
        losses: diffFleet(attackerBefore, attackerAfter),
        shots: Math.round(defenderResolved.totals.cannonShots),
        rapidExtraShots: Math.round(defenderResolved.totals.rapidExtraShots),
        effectiveShots: Math.round(defenderResolved.totals.effectiveShots),
        hits: defenderResolved.totals.hits,
        damage: defenderResolved.totals.damage,
        absorbed: defenderResolved.totals.absorbed,
        damageByUnit: defenderResolved.totals.damageToUnit,
        primaryTargets: defenderResolved.totals.primaryTargetClassByUnit,
      },
      defender: {
        before: defenderCountBefore,
        after: countFleet(defenderAfter),
        losses: diffFleet(defenderBefore, defenderAfter),
        shots: Math.round(attackerResolved.totals.cannonShots),
        rapidExtraShots: Math.round(attackerResolved.totals.rapidExtraShots),
        effectiveShots: Math.round(attackerResolved.totals.effectiveShots),
        hits: attackerResolved.totals.hits,
        damage: attackerResolved.totals.damage,
        absorbed: attackerResolved.totals.absorbed,
        damageByUnit: attackerResolved.totals.damageToUnit,
        primaryTargets: attackerResolved.totals.primaryTargetClassByUnit,
      },
    });
  }

  const attackerSurvivors = fleetToMap(attackers);
  const defenderSurvivors = fleetToMap(defenders);
  const attackerLosses = diffFleet(attackerStart, attackerSurvivors);
  const defenderLosses = diffFleet(defenderStart, defenderSurvivors);
  const attackerLossCost = calculateFleetCost(attackerLosses);
  const defenderLossCost = calculateFleetCost(defenderLosses);
  let winner = "draw";
  const attackerAlive = countFleet(attackerSurvivors) > 0;
  const defenderAlive = countFleet(defenderSurvivors) > 0;
  const attackerCombatAlive = anyCombatCapable(attackers);
  const defenderCombatAlive = anyCombatCapable(defenders);
  if (!attackerAlive && defenderAlive) winner = "defender";
  else if (attackerAlive && !defenderAlive) winner = "attacker";
  else if (attackerAlive && !defenderCombatAlive) winner = "attacker";
  else if (!attackerCombatAlive && defenderCombatAlive) winner = "defender";
  else if (rounds.length >= mergedSettings.maxRounds) winner = "defender";

  const wreckage = { wood: 0, metal: 0, rum: 0 };
  const accumulateWreck = (losses) => {
    for (const [shipId, lost] of Object.entries(normalizeFleetKeys(losses))) {
      const ship = SHIPS[shipId];
      if (!ship || lost <= 0) continue;
      wreckage.wood += Math.floor(Math.max(0, ship.cost.wood) * lost * WRECK_WOOD_RATE);
      wreckage.metal += Math.floor(Math.max(0, ship.cost.metal) * lost * WRECK_METAL_RATE);
    }
  };
  accumulateWreck(attackerLosses);
  accumulateWreck(defenderLosses);

  return {
    winner,
    rounds,
    attacker: {
      start: countFleet(attackerStart),
      survivors: countFleet(attackerSurvivors),
      survivorFleet: attackerSurvivors,
      losses: attackerLosses,
      lossCost: attackerLossCost,
    },
    defender: {
      start: countFleet(defenderStart),
      survivors: countFleet(defenderSurvivors),
      survivorFleet: defenderSurvivors,
      losses: defenderLosses,
      lossCost: defenderLossCost,
    },
    debris: wreckage,
  };
}

function addFleetTotals(target, fleet) {
  for (const shipId of Object.keys(SHIPS)) {
    target[shipId] = (target[shipId] || 0) + (fleet[shipId] || 0);
  }
}

function runMonteCarlo({
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

window.FirepowerCore = { SHIPS, DEFAULT_MODIFIERS, compareFleets, parseBattleReportJson, parseFleetText, parseScanJson, runMonteCarlo };
})();

const PLAYER_PROFILE_STORAGE_KEY = "firepower.playerProfile.v1";

const PROFILE_FIELDS = ["weaponsPct", "hullsPct", "armorPct", "accuracyPct", "cannonsFlat"];

function normalizeModifiers(modifiers = {}) {
  const normalized = {};
  for (const field of PROFILE_FIELDS) {
    normalized[field] = Number(modifiers[field]) || 0;
  }
  return normalized;
}

function loadPlayerProfile(storage) {
  if (!storage) return null;
  try {
    const raw = storage.getItem(PLAYER_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1 || !parsed.modifiers) return null;
    return normalizeModifiers(parsed.modifiers);
  } catch {
    return null;
  }
}

function savePlayerProfile(storage, modifiers) {
  if (!storage) return;
  const payload = {
    version: 1,
    savedAt: new Date().toISOString(),
    modifiers: normalizeModifiers(modifiers),
  };
  storage.setItem(PLAYER_PROFILE_STORAGE_KEY, JSON.stringify(payload));
}

function clearPlayerProfile(storage) {
  if (!storage) return;
  storage.removeItem(PLAYER_PROFILE_STORAGE_KEY);
}


const { SHIPS, DEFAULT_MODIFIERS, compareFleets, parseBattleReportJson, parseFleetText, parseScanJson, runMonteCarlo } = window.FirepowerCore;

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
