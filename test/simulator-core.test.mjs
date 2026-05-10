import test from "node:test";
import assert from "node:assert/strict";

import {
  DEBRIS_RATE,
  DEFENSES,
  DEFENSE_DEBRIS_DESTRUCTIBLE_RATE,
  SHIPS,
  applyResearch,
  applyCombatModifiers,
  calculateShots,
  calculateFirepower,
  calculateEffectiveShots,
  calculateDefenseDebris,
  compareFleets,
  createRng,
  normalizeDefenseKeys,
  normalizeFleetKeys,
  parseBattleReportJson,
  parseFleetText,
  parseScanJson,
  runBattle,
  runMonteCarlo,
} from "../src/simulator-core.js";

test("catalog contains current May ship and defense stats", () => {
  assert.equal(SHIPS.sloop.attack, 1.7);
  assert.equal(SHIPS.sloop.cost.wood, 3000);
  assert.equal(SHIPS.brig.hp, 250);
  assert.equal(SHIPS.frigate.cost.wood, 12000);
  assert.equal(SHIPS.manOfWar.attack, 7.8);
  assert.equal(SHIPS.manOfWar.cost.metal, 25000);
  assert.equal(SHIPS.indiaman.name, "Indiaman");
  assert.equal(SHIPS.indiaman.cargo, 50000);

  assert.equal(DEFENSES.smallCannon.name, "Male Dzialo");
  assert.equal(DEFENSES.smallCannon.attack, 9.2);
  assert.equal(DEFENSES.grandSeaCitadel.cost.rum, 5000000);
  assert.equal(DEFENSE_DEBRIS_DESTRUCTIBLE_RATE, 0.30);
});

test("parses defense keys and calculates capped defense debris", () => {
  assert.deepEqual(normalizeDefenseKeys({
    smallCannon: 10,
    coastalGun: 5,
    blackFortress: 1,
    grandSeaCitadel: 1,
  }), {
    smallCannon: 10,
    coastalGun: 5,
    blackFortress: 1,
    grandSeaCitadel: 1,
  });

  assert.deepEqual(calculateDefenseDebris({
    smallCannon: 10,
    coastalGun: 5,
  }), {
    wood: 607,
    metal: 3600,
    rum: 0,
  });
});

test("scan json imports defender fleet and defense separately", () => {
  const parsed = parseScanJson({
    scan: {
      fleet: { sloop: 2, indiaman: 1 },
      defense: { smallCannon: 10, coastalGun: 5 },
    },
  });

  assert.deepEqual(parsed.fleet, { sloop: 2, indiaman: 1 });
  assert.deepEqual(parsed.defense, { smallCannon: 10, coastalGun: 5 });
});

test("battle simulation includes defender defense and reports separate defense debris", () => {
  const battle = runBattle({
    attackerFleet: { bomber: 20, warship: 10 },
    defenderFleet: {},
    defenderDefense: { smallCannon: 20, coastalGun: 10 },
    attackerModifiers: { weaponsPct: 65, hullsPct: 44, armorPct: 25, accuracyPct: 40, cannonsFlat: 6 },
    defenderModifiers: { weaponsPct: 25, hullsPct: 25, armorPct: 20, accuracyPct: 25, cannonsFlat: 6 },
    settings: { maxRounds: 6 },
    rng: createRng("defense-test"),
  });

  assert.equal(battle.defender.startDefense, 30);
  assert.equal(battle.defender.defenseDebris.wood >= 0, true);
  assert.equal(battle.debris.wood >= battle.defender.defenseDebris.wood, true);
});

test("ship catalog contains current alpha ship stats", () => {
  assert.equal(SHIPS.dinghy.name, "Szalupa");
  assert.equal(SHIPS.dinghy.attack, 1.5);
  assert.equal(SHIPS.scout.name, "Kuter Zwiadowczy");
  assert.equal(SHIPS.scout.attack, 0);
  assert.equal(SHIPS.sloop.cannons, 8);
  assert.equal(SHIPS.brig.cannons, 16);
  assert.equal(SHIPS.xebec.name, "Szebeka");
  assert.equal(SHIPS.xebec.cargo, 180);
  assert.equal(SHIPS.cargo.cannons, 4);
  assert.equal(SHIPS.warship.hp, 900);
  assert.equal(SHIPS.shipOfTheLine.name, "Okret Liniowy");
  assert.equal(SHIPS.shipOfTheLine.attack, 5.9);
  assert.equal(SHIPS.bomber.name, "Okret Bombowy");
  assert.equal(SHIPS.fire.name, "Statek Ogniowy");
  assert.equal(SHIPS.fire.attack, 22);
  assert.equal(SHIPS.colony.cost.rum, 2000);
});

test("ship catalog uses current build costs", () => {
  assert.deepEqual(Object.fromEntries(
    Object.entries(SHIPS).map(([shipId, ship]) => [shipId, ship.cost]),
  ), {
    dinghy: { wood: 2000, metal: 0, rum: 0 },
    scout: { wood: 2500, metal: 0, rum: 0 },
    sloop: { wood: 3000, metal: 500, rum: 0 },
    brig: { wood: 6000, metal: 1500, rum: 0 },
    xebec: { wood: 7000, metal: 2000, rum: 0 },
    cargo: { wood: 5000, metal: 500, rum: 0 },
    indiaman: { wood: 20000, metal: 1500, rum: 0 },
    frigate: { wood: 12000, metal: 3100, rum: 0 },
    warship: { wood: 25000, metal: 8000, rum: 0 },
    shipOfTheLine: { wood: 44000, metal: 15000, rum: 0 },
    manOfWar: { wood: 85000, metal: 25000, rum: 0 },
    bomber: { wood: 15000, metal: 5600, rum: 0 },
    fire: { wood: 6400, metal: 1800, rum: 0 },
    colony: { wood: 10000, metal: 5000, rum: 2000 },
  });
});

test("only colony ship still costs rum to build", () => {
  const rumCosts = Object.fromEntries(
    Object.entries(SHIPS).map(([shipId, ship]) => [shipId, ship.cost.rum || 0]),
  );

  assert.deepEqual(rumCosts, {
    dinghy: 0,
    scout: 0,
    sloop: 0,
    brig: 0,
    xebec: 0,
    cargo: 0,
    indiaman: 0,
    frigate: 0,
    warship: 0,
    shipOfTheLine: 0,
    manOfWar: 0,
    bomber: 0,
    fire: 0,
    colony: 2000,
  });
});

test("v3 uses one base cannon shot per round", () => {
  const fleet = { brig: 37, cargo: 23, dinghy: 32, scout: 15, warship: 6 };
  assert.equal(calculateShots(fleet, { cannonsFlat: 0 }), 932);
});

test("combat modifiers apply to base stats", () => {
  const modified = applyCombatModifiers(SHIPS.sloop, {
    weaponsPct: 29,
    hullsPct: 31,
    armorPct: 25,
    cannonsFlat: 6,
  });

  assert.equal(Number(modified.attack.toFixed(2)), 2.19);
  assert.equal(Number(modified.hp.toFixed(1)), 183.4);
  assert.equal(Number(modified.shield.toFixed(2)), 17.5);
  assert.equal(modified.cannons, 14);
});

test("json fleet keys normalize to internal ship ids", () => {
  assert.deepEqual(normalizeFleetKeys({
    dinghy: 10,
    scoutCutter: 4,
    longboat: 3,
    cargoShip: 3,
    manOfWar: 1,
    shipOfTheLine: 2,
    bomber: 3,
    fireShip: 4,
    xebec: 7,
    warship: 1,
  }), {
    dinghy: 13,
    scout: 4,
    cargo: 3,
    manOfWar: 1,
    shipOfTheLine: 2,
    bomber: 3,
    fire: 4,
    xebec: 7,
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
      research: { fireControl: 4, hulls: 4, navigation: 5, sailing: 5, shipBuilding: 4, weapons: 4 },
      talents: {},
    },
  }));

  assert.deepEqual(parsed.fleet, { cargo: 3, warship: 2 });
  assert.deepEqual(parsed.modifiers, {
    weaponsPct: 20,
    hullsPct: 20,
    armorPct: 0,
    cannonsFlat: 0,
    accuracyPct: 20,
  });
});

test("fire control is the only research source for combat accuracy", () => {
  assert.equal(parseScanJson({ scan: { research: { fireControl: 8, navigation: 9 } } }).modifiers.accuracyPct, 40);
  assert.equal(parseScanJson({ scan: { research: { navigation: 9 } } }).modifiers.accuracyPct, 0);
});

test("parses english scan json ship keys into current ship ids", () => {
  const parsed = parseScanJson({
    scan: {
      fleet: {
        rowboat: 1,
        patache: 9,
        scoutCutter: 2,
        cargo_ship: 3,
        shipOfLine: 4,
        manowar: 5,
        bombShip: 6,
        fire_ship: 7,
        colonialShip: 8,
      },
    },
  });

  assert.deepEqual(parsed.fleet, {
    dinghy: 10,
    scout: 2,
    cargo: 3,
    shipOfTheLine: 4,
    manOfWar: 5,
    bomber: 6,
    fire: 7,
    colony: 8,
  });
});

test("parses current backend scan fleet keys", () => {
  const parsed = parseScanJson({
    scan: {
      fleet: {
        bombVessel: 2,
        brig: 6,
        fireShip: 1,
        frigate: 1,
        longboat: 1,
        patache: 2,
        sloop: 2,
        warship: 2,
        xebec: 1,
      },
    },
  });

  assert.deepEqual(parsed.fleet, {
    bomber: 2,
    brig: 6,
    fire: 1,
    frigate: 1,
    dinghy: 3,
    sloop: 2,
    warship: 2,
    xebec: 1,
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
Szalupa
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
  assert.deepEqual(parsed.attacker, { dinghy: 100, sloop: 10, brig: 50, cargo: 50 });
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

test("parses new raider and scout names from pasted fleet text", () => {
  const parsed = parseFleetText(`
Szalupa
x4
Kuter Zwiadowczy
x1
Szebeka
x2
Man-of-War
x3
Okret Liniowy
x4
Okret Bombowy
x5
Statek Ogniowy
x6
`);

  assert.equal(parsed.mode, "single");
  assert.deepEqual(parsed.all, { dinghy: 4, scout: 1, xebec: 2, manOfWar: 3, shipOfTheLine: 4, bomber: 5, fire: 6 });
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
  assert.equal(result.averageDefenderLossPoints, 217600);
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

test("heavy line fleets prioritize combat ships before transports", () => {
  const result = runBattle({
    attackerFleet: { cargo: 676, frigate: 1, manOfWar: 250, shipOfTheLine: 323, warship: 383 },
    defenderFleet: { brig: 83, cargo: 153, frigate: 55, dinghy: 51, sloop: 46, warship: 27 },
    attackerModifiers: { weaponsPct: 65, hullsPct: 44, armorPct: 25, accuracyPct: 40, cannonsFlat: 6 },
    defenderModifiers: { weaponsPct: 25, hullsPct: 25, armorPct: 20, accuracyPct: 0, cannonsFlat: 0 },
    settings: { maxRounds: 6 },
    rng: createRng("target-calibration"),
  });

  const targets = result.rounds[0].defender.primaryTargets;
  assert.notEqual(targets.manOfWar, "transport");
  assert.notEqual(targets.shipOfTheLine, "transport");
  assert.notEqual(targets.warship, "transport");
});
