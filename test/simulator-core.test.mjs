import test from "node:test";
import assert from "node:assert/strict";

import {
  DEBRIS_RATE,
  SHIPS,
  applyResearch,
  applyCombatModifiers,
  calculateShots,
  calculateFirepower,
  calculateEffectiveShots,
  compareFleets,
  createRng,
  normalizeFleetKeys,
  parseBattleReportJson,
  parseFleetText,
  parseScanJson,
  runBattle,
  runMonteCarlo,
} from "../src/simulator-core.js";

test("ship catalog contains current alpha ship stats", () => {
  assert.equal(SHIPS.scout.name, "Lodz Zwiadowcza");
  assert.equal(SHIPS.scout.attack, 1);
  assert.equal(SHIPS.brig.cannons, 18);
  assert.equal(SHIPS.warship.hp, 800);
  assert.equal(SHIPS.colony.cost.rum, 2000);
  assert.equal(SHIPS.fire.name, "Statek Ogniowy");
  assert.equal(SHIPS.shipOfTheLine.name, "Okret Liniowy");
  assert.equal(SHIPS.shipOfTheLine.attack, 10);
  assert.equal(SHIPS.shipOfTheLine.cannons, 64);
  assert.equal(SHIPS.shipOfTheLine.cost.metal, 15000);
});

test("ship catalog uses current build costs", () => {
  assert.deepEqual(Object.fromEntries(
    Object.entries(SHIPS).map(([shipId, ship]) => [shipId, ship.cost]),
  ), {
    scout: { wood: 2000, metal: 0, rum: 0 },
    sloop: { wood: 4000, metal: 600, rum: 0 },
    brig: { wood: 5000, metal: 1200, rum: 0 },
    cargo: { wood: 4000, metal: 500, rum: 0 },
    frigate: { wood: 10000, metal: 3000, rum: 0 },
    warship: { wood: 25000, metal: 8000, rum: 0 },
    shipOfTheLine: { wood: 44000, metal: 15000, rum: 0 },
    manOfWar: { wood: 84000, metal: 30000, rum: 0 },
    bomber: { wood: 15000, metal: 5600, rum: 0 },
    fire: { wood: 6400, metal: 1800, rum: 0 },
    colony: { wood: 10000, metal: 5000, rum: 2000 },
    steamFrigate: { wood: 190000, metal: 84000, rum: 0 },
    ironclad: { wood: 260000, metal: 140000, rum: 0 },
    torpedoBoat: { wood: 116000, metal: 48000, rum: 0 },
  });
});

test("only colony ship still costs rum to build", () => {
  const rumCosts = Object.fromEntries(
    Object.entries(SHIPS).map(([shipId, ship]) => [shipId, ship.cost.rum || 0]),
  );

  assert.deepEqual(rumCosts, {
    scout: 0,
    sloop: 0,
    brig: 0,
    cargo: 0,
    frigate: 0,
    warship: 0,
    shipOfTheLine: 0,
    manOfWar: 0,
    bomber: 0,
    fire: 0,
    colony: 2000,
    steamFrigate: 0,
    ironclad: 0,
    torpedoBoat: 0,
  });
});

test("v3 uses one base cannon shot per round", () => {
  const fleet = { brig: 37, cargo: 23, scout: 32, warship: 6 };
  assert.equal(calculateShots(fleet, { cannonsFlat: 0 }), 1028);
});

test("combat modifiers apply to base stats", () => {
  const modified = applyCombatModifiers(SHIPS.sloop, {
    weaponsPct: 29,
    hullsPct: 31,
    armorPct: 25,
    cannonsFlat: 6,
  });

  assert.equal(Number(modified.attack.toFixed(2)), 2.32);
  assert.equal(Number(modified.hp.toFixed(1)), 196.5);
  assert.equal(Number(modified.shield.toFixed(2)), 31.25);
  assert.equal(modified.cannons, 14);
});

test("json fleet keys normalize to internal ship ids", () => {
  assert.deepEqual(normalizeFleetKeys({
    longboat: 10,
    cargoShip: 3,
    fireShip: 2,
    shipOfTheLine: 4,
    manOfWar: 1,
    steamFrigate: 2,
    ironclad: 3,
    torpedoBoat: 5,
    warship: 1,
  }), {
    scout: 10,
    cargo: 3,
    fire: 2,
    shipOfTheLine: 4,
    manOfWar: 1,
    steamFrigate: 2,
    ironclad: 3,
    torpedoBoat: 5,
    warship: 1,
  });
});

test("compares planned fleet with battle report fleet", () => {
  assert.deepEqual(compareFleets(
    { brig: 12, cargo: 55, frigate: 10, sloop: 6, warship: 6 },
    { brig: 8, cargoShip: 55, frigate: 7, sloop: 4, warship: 4 },
  ), [
    { shipId: "sloop", expected: 6, actual: 4, delta: -2 },
    { shipId: "brig", expected: 12, actual: 8, delta: -4 },
    { shipId: "frigate", expected: 10, actual: 7, delta: -3 },
    { shipId: "warship", expected: 6, actual: 4, delta: -2 },
  ]);
});

test("legacy suppression helper still reports relative firepower", () => {
  const ownFleet = { sloop: 1 };
  const enemyFleet = { warship: 89 };
  const ownModifiers = { weaponsPct: 0, hullsPct: 0, armorPct: 0, cannonsFlat: 0 };
  const enemyModifiers = { weaponsPct: 29, hullsPct: 31, armorPct: 25, cannonsFlat: 6 };

  assert.equal(calculateShots(ownFleet, ownModifiers), 8);
  assert.equal(calculateEffectiveShots(ownFleet, ownModifiers, enemyFleet, enemyModifiers), 1);
  assert.equal(calculateFirepower(enemyFleet, enemyModifiers) > calculateFirepower(ownFleet, ownModifiers), true);
});

test("parses scan json into defender fleet and modifiers", () => {
  const parsed = parseScanJson(JSON.stringify({
    scan: {
      fleet: { cargoShip: 3, warship: 2 },
      research: { hulls: 4, navigation: 5, sailing: 5, shipBuilding: 4, weapons: 4 },
      talents: {},
    },
  }));

  assert.deepEqual(parsed.fleet, { cargo: 3, warship: 2 });
  assert.deepEqual(parsed.modifiers, {
    weaponsPct: 20,
    hullsPct: 20,
    armorPct: 0,
    cannonsFlat: 0,
  });
});

test("parses battle report json with modifiers and rounds", () => {
  const parsed = parseBattleReportJson(JSON.stringify({
    modifiers: {
      aggressor: { weaponsPct: 29, hullsPct: 31, armorPct: 25, cannonsFlat: 6 },
      defender: { weaponsPct: 20, hullsPct: 15, armorPct: 0, cannonsFlat: 0 },
    },
    forces: {
      initial: {
        aggressorFleet: { warship: 89 },
        defenderFleet: { brig: 11, cargoShip: 3, frigate: 6, sloop: 8 },
      },
    },
    rounds: [{ round: 1, fire: { aggressorShots: 3164, defenderShots: 654 } }],
  }));

  assert.deepEqual(parsed.attackerFleet, { warship: 89 });
  assert.deepEqual(parsed.defenderFleet, { brig: 11, cargo: 3, frigate: 6, sloop: 8 });
  assert.equal(parsed.attackerModifiers.cannonsFlat, 6);
  assert.equal(parsed.rounds[0].fire.defenderShots, 654);
});

test("battle simulation is deterministic with a seeded rng", () => {
  const battle = runBattle({
    attackerFleet: { brig: 5, sloop: 10 },
    defenderFleet: { cargo: 12, sloop: 8 },
    attackerResearch: { navigation: 3, hulls: 2, armaments: 2, fortifications: 1 },
    defenderResearch: { navigation: 2, hulls: 1, armaments: 1, fortifications: 2 },
    settings: { maxRounds: 6, baseAccuracy: 0.5, accuracyVariance: 0.04 },
    rng: createRng("seeded-battle"),
  });

  assert.equal(battle.rounds.length > 0, true);
  assert.equal(["attacker", "defender", "draw"].includes(battle.winner), true);
  assert.deepEqual(battle, runBattle({
    attackerFleet: { brig: 5, sloop: 10 },
    defenderFleet: { cargo: 12, sloop: 8 },
    attackerResearch: { navigation: 3, hulls: 2, armaments: 2, fortifications: 1 },
    defenderResearch: { navigation: 2, hulls: 1, armaments: 1, fortifications: 2 },
    settings: { maxRounds: 6, baseAccuracy: 0.5, accuracyVariance: 0.04 },
    rng: createRng("seeded-battle"),
  }));
});

test("monte carlo aggregates wins, losses, survivors, and debris", () => {
  const result = runMonteCarlo({
    attackerFleet: { brig: 15, cargo: 23 },
    defenderFleet: { brig: 4, cargo: 20, sloop: 24 },
    attackerResearch: { navigation: 5, hulls: 3, armaments: 4, fortifications: 4 },
    defenderResearch: { navigation: 3, hulls: 2, armaments: 3, fortifications: 2 },
    settings: { runs: 25, maxRounds: 6, baseAccuracy: 0.5, accuracyVariance: 0.05 },
    seed: "report-like",
  });

  assert.equal(result.runs, 25);
  assert.equal(result.outcomes.attacker + result.outcomes.defender + result.outcomes.draw, 25);
  assert.equal(result.sample.rounds.length > 0, true);
  assert.equal(result.averageAttackerLossPoints > 0, true);
  assert.equal(result.averageDebris.wood > 0, true);
});

test("wreck debris uses current 55 percent battle debris rate", () => {
  assert.equal(DEBRIS_RATE, 0.55);
});

test("parses attacker and defender fleets from a pasted battle report", () => {
  const parsed = parseFleetText(`
Stan początkowy
⛵ Agresor — flota
210 jednostek
⛵ Bryg
×50
📦 Statek Towarowy
×50
🛶 Łódź Zwiadowcza
×100
🛶 Slup
×10
🚢 Obrońca — flota
127 jednostek
⛵ Bryg
×18
📦 Statek Towarowy
×17
🚢 Fregata
×1
🛶 Slup
×91
⛵ Agresor — flota
65 przeżyło
`);

  assert.equal(parsed.mode, "report");
  assert.deepEqual(parsed.attacker, { scout: 100, sloop: 10, brig: 50, cargo: 50 });
  assert.deepEqual(parsed.defender, { sloop: 91, brig: 18, cargo: 17, frigate: 1 });
});

test("parses a single scan-like fleet into one fleet object", () => {
  const parsed = parseFleetText(`
Bryg
x12
Statek Towarowy
x7
Okręt Wojenny
x2
`);

  assert.equal(parsed.mode, "single");
  assert.deepEqual(parsed.all, { brig: 12, cargo: 7, warship: 2 });
});

test("parses ship of the line from pasted fleet text", () => {
  const parsed = parseFleetText(`
Okret Liniowy
x4
Man-of-War
x1
Fregata Parowa
x2
Pancernik
x3
Kuter Torpedowy
x5
`);

  assert.equal(parsed.mode, "single");
  assert.deepEqual(parsed.all, { shipOfTheLine: 4, manOfWar: 1, steamFrigate: 2, ironclad: 3, torpedoBoat: 5 });
});

test("v02 report-like fight uses suppression and keeps defender losses plausible", () => {
  const result = runMonteCarlo({
    attackerFleet: { warship: 89 },
    defenderFleet: { brig: 11, cargo: 3, frigate: 6, sloop: 8 },
    attackerModifiers: { weaponsPct: 29, hullsPct: 31, armorPct: 25, cannonsFlat: 6 },
    defenderModifiers: { weaponsPct: 20, hullsPct: 15, armorPct: 0, cannonsFlat: 0 },
    settings: {
      runs: 50,
      maxRounds: 6,
      baseAccuracy: 0.5,
      accuracyVariance: 0.05,
      targetMode: "focused",
    },
    seed: "real-report-2026-04-25",
  });

  assert.equal(result.outcomes.attacker, 50);
  assert.equal(result.averageDefenderLossPoints, 196500);
  assert.equal(result.sample.rounds[0].defender.shots <= calculateShots({ warship: 89 }, { cannonsFlat: 6 }), true);
});

test("v02 large fight resolves with v02 ship costs and suppression enabled", () => {
  const result = runMonteCarlo({
    attackerFleet: { brig: 15, cargo: 60, scout: 10, warship: 99 },
    defenderFleet: { brig: 45, cargo: 48, frigate: 19, sloop: 64, warship: 11 },
    attackerModifiers: { weaponsPct: 29, hullsPct: 28, armorPct: 25, cannonsFlat: 6 },
    defenderModifiers: { weaponsPct: 20, hullsPct: 20, armorPct: 0, cannonsFlat: 0 },
    settings: {
      runs: 20,
      maxRounds: 6,
      baseAccuracy: 0.5,
      accuracyVariance: 0.05,
      targetMode: "focused",
    },
    seed: "large-real-report",
  });

  assert.equal(result.outcomes.attacker + result.outcomes.defender + result.outcomes.draw, 20);
  assert.equal(result.averageDefenderLossPoints > 300000, true);
  assert.equal(result.sample.rounds[0].attacker.shots > 0, true);
});

test("v3 one-round sweep exposes base and rapid shots separately", () => {
  const result = runMonteCarlo({
    attackerFleet: { brig: 50, cargo: 100, frigate: 8, warship: 103 },
    defenderFleet: { brig: 22, cargo: 22, frigate: 15, sloop: 21, warship: 7 },
    attackerModifiers: { weaponsPct: 29, hullsPct: 31, armorPct: 25, cannonsFlat: 6 },
    defenderModifiers: { weaponsPct: 25, hullsPct: 20, armorPct: 0, cannonsFlat: 0 },
    settings: {
      runs: 40,
      maxRounds: 6,
      baseAccuracy: 0.6,
      accuracyVariance: 0.1,
      targetMode: "focused",
    },
    seed: "alexi-one-round-report",
  });

  assert.equal(result.outcomes.attacker, 40);
  assert.equal(result.averageDefenderLossPoints > 280000, true);
  assert.equal(result.sample.rounds[0].defender.shots > 3000, true);
  assert.equal(result.sample.rounds[0].defender.effectiveShots >= result.sample.rounds[0].defender.shots, true);
  assert.equal(result.sample.rounds[0].defender.rapidExtraShots >= 0, true);
});
