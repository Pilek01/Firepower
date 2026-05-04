import test from "node:test";
import assert from "node:assert/strict";

import {
  PLAYER_PROFILE_STORAGE_KEY,
  clearPlayerProfile,
  loadPlayerProfile,
  savePlayerProfile,
} from "../src/profile-storage.js";

function createMemoryStorage(seed = {}) {
  const values = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

test("player profile persists combat modifiers in local storage", () => {
  const storage = createMemoryStorage();
  const modifiers = {
    weaponsPct: 65,
    hullsPct: 41,
    armorPct: 25,
    cannonsFlat: 6,
  };

  savePlayerProfile(storage, modifiers);

  assert.deepEqual(loadPlayerProfile(storage), modifiers);
  assert.equal(JSON.parse(storage.getItem(PLAYER_PROFILE_STORAGE_KEY)).version, 1);
});

test("player profile ignores corrupt saved data", () => {
  const storage = createMemoryStorage({
    [PLAYER_PROFILE_STORAGE_KEY]: "{nie json",
  });

  assert.equal(loadPlayerProfile(storage), null);
});

test("player profile can be cleared manually", () => {
  const storage = createMemoryStorage();
  savePlayerProfile(storage, { weaponsPct: 65, hullsPct: 41, armorPct: 25, cannonsFlat: 6 });

  clearPlayerProfile(storage);

  assert.equal(storage.getItem(PLAYER_PROFILE_STORAGE_KEY), null);
  assert.equal(loadPlayerProfile(storage), null);
});
