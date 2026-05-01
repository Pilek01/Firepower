export const SHOTS_PER_CANNON = 1;
export const SUPPRESSION_MIN = 0.15;
export const DEBRIS_RATE = 0.55;
export const WRECK_WOOD_RATE = 0.45;
export const WRECK_METAL_RATE = 0.60;

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
    cost: { wood: 2000, metal: 0, rum: 0 },
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
    cost: { wood: 4000, metal: 600, rum: 0 },
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
    cost: { wood: 5000, metal: 1200, rum: 0 },
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
    cost: { wood: 4000, metal: 500, rum: 0 },
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
    cost: { wood: 10000, metal: 3000, rum: 0 },
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
    cost: { wood: 25000, metal: 8000, rum: 0 },
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
    attack: 8,
    hp: 260,
    shield: 15,
    size: 1.2,
    cannons: 12,
    speed: 0.85,
    cargo: 20,
    cost: { wood: 15000, metal: 5600, rum: 0 },
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
    cost: { wood: 6400, metal: 1800, rum: 0 },
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
    cost: { wood: 10000, metal: 5000, rum: 2000 },
  },
  steamFrigate: {
    jsonKey: "steamFrigate",
    name: "Fregata Parowa",
    attack: 5.5,
    hp: 700,
    shield: 95,
    size: 1.15,
    cannons: 42,
    speed: 1.85,
    cargo: 0,
    crew: 85,
    cost: { wood: 190000, metal: 84000, rum: 0 },
  },
  ironclad: {
    jsonKey: "ironclad",
    name: "Pancernik",
    attack: 6,
    hp: 2100,
    shield: 420,
    size: 1.65,
    cannons: 54,
    speed: 1.05,
    cargo: 0,
    crew: 160,
    cost: { wood: 260000, metal: 140000, rum: 0 },
  },
  torpedoBoat: {
    jsonKey: "torpedoBoat",
    name: "Kuter Torpedowy",
    attack: 30,
    hp: 220,
    shield: 18,
    size: 0.65,
    cannons: 4,
    speed: 2.2,
    cargo: 0,
    crew: 35,
    cost: { wood: 116000, metal: 48000, rum: 0 },
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
  steamFrigate: ["fregata parowa", "steam frigate", "steamfrigate"],
  frigate: ["fregata", "frigate"],
  warship: ["okret wojenny", "warship"],
  shipOfTheLine: ["okret liniowy", "liniowy", "ship of the line", "shipoftheline"],
  manOfWar: ["man of war", "manofwar"],
  bomber: ["okret bombowy", "bomber"],
  fire: ["statek ogniowy", "fireship"],
  colony: ["statek kolonialny", "colony"],
  ironclad: ["pancernik", "ironclad"],
  torpedoBoat: ["kuter torpedowy", "torpedowy", "torpedo boat", "torpedoboat"],
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
      if (countMatch) {
        fleet[shipId] = Number(countMatch[1].replace(/\s/g, ""));
        break;
      }
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
  scout: "scout",
  sloop: "raider",
  brig: "line",
  cargo: "transport",
  frigate: "frigate",
  warship: "heavy",
  shipOfTheLine: "capital",
  manOfWar: "capital",
  bomber: "siege",
  fire: "suicide",
  colony: "colony",
  steamFrigate: "steam",
  ironclad: "armored",
  torpedoBoat: "torpedo",
};

const PROFILE_OVERRIDES = {
  scout: { combatCapable: false, defaultTargetWeight: 0.35, defaultDamageMultiplier: 0.75 },
  cargo: { combatCapable: false, defaultTargetWeight: 0.55, defaultDamageMultiplier: 0.65 },
  colony: { combatCapable: false, defaultTargetWeight: 0.35, defaultDamageMultiplier: 0.50 },
  sloop: {
    targetWeights: { transport: 2.2, scout: 1.7, siege: 1.25, suicide: 1.25, capital: 0.65, heavy: 0.75 },
    rapidFire: { scout: 0.75, transport: 0.50 },
    damageMultipliers: { transport: 1.25, capital: 0.75, heavy: 0.85 },
    classAccuracyBonuses: { scout: 0.05, transport: 0.04 },
  },
  brig: {
    targetWeights: { raider: 1.35, frigate: 1.1, transport: 1.1, capital: 0.8 },
    rapidFire: { raider: 0.25 },
    damageMultipliers: { raider: 1.12, capital: 0.82 },
  },
  frigate: {
    targetWeights: { line: 1.25, siege: 1.25, raider: 1.15, heavy: 0.9 },
    rapidFire: { raider: 0.35, transport: 0.25 },
    damageMultipliers: { line: 1.12, siege: 1.15, capital: 0.85 },
  },
  warship: {
    targetWeights: { heavy: 1.2, capital: 1.15, line: 1.1, raider: 0.75 },
    rapidFire: { line: 0.20 },
    damageMultipliers: { heavy: 1.08, capital: 1.05, raider: 0.85 },
  },
  shipOfTheLine: {
    targetWeights: { capital: 1.35, heavy: 1.25, line: 1.1, transport: 0.55, scout: 0.35 },
    rapidFire: { line: 0.25, heavy: 0.20 },
    damageMultipliers: { capital: 1.15, heavy: 1.12, armored: 0.85, raider: 0.75, scout: 0.65 },
  },
  manOfWar: {
    targetWeights: { capital: 1.45, heavy: 1.3, armored: 1.2, line: 1.1, transport: 0.45, scout: 0.25 },
    rapidFire: { line: 0.25, heavy: 0.20 },
    damageMultipliers: { capital: 1.2, heavy: 1.12, armored: 0.8, raider: 0.7, scout: 0.55 },
  },
  bomber: {
    targetWeights: { siege: 1.4, heavy: 1.15, capital: 1.15, transport: 0.55, raider: 0.45 },
    damageMultipliers: { heavy: 1.2, capital: 1.2, line: 0.95, raider: 0.65 },
    classAccuracyBonuses: { heavy: 0.04, capital: 0.06 },
  },
  fire: {
    targetWeights: { capital: 1.7, heavy: 1.45, line: 1.1, transport: 0.35, scout: 0.2 },
    damageMultipliers: { capital: 1.45, heavy: 1.35, armored: 1.25, line: 1.15, transport: 0.65, scout: 0.45 },
  },
  steamFrigate: {
    targetWeights: { raider: 1.45, transport: 1.3, siege: 1.15, line: 1.1, capital: 0.75, armored: 0.7 },
    rapidFire: { raider: 0.50, transport: 0.35, scout: 0.25 },
    damageMultipliers: { raider: 1.2, transport: 1.1, capital: 0.82, armored: 0.75 },
    classAccuracyBonuses: { raider: 0.06, scout: 0.05 },
  },
  ironclad: {
    targetWeights: { capital: 1.3, heavy: 1.25, armored: 1.2, siege: 1.1, raider: 0.5, scout: 0.25 },
    rapidFire: { heavy: 0.15, line: 0.15 },
    damageMultipliers: { capital: 1.12, heavy: 1.1, armored: 1.05, raider: 0.7, scout: 0.55 },
  },
  torpedoBoat: {
    targetWeights: { capital: 1.9, armored: 1.65, heavy: 1.45, line: 0.75, transport: 0.35, scout: 0.2, raider: 0.45 },
    rapidFire: { capital: 0.35, armored: 0.30, heavy: 0.25 },
    damageMultipliers: { capital: 1.55, armored: 1.45, heavy: 1.35, line: 0.85, raider: 0.55, scout: 0.4 },
    classAccuracyBonuses: { capital: 0.08, armored: 0.06, heavy: 0.04 },
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

export function applyArmor(rawDamage, armor) {
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
