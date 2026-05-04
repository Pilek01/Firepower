export const PLAYER_PROFILE_STORAGE_KEY = "firepower.playerProfile.v1";

const PROFILE_FIELDS = ["weaponsPct", "hullsPct", "armorPct", "accuracyPct", "cannonsFlat"];

function normalizeModifiers(modifiers = {}) {
  const normalized = {};
  for (const field of PROFILE_FIELDS) {
    normalized[field] = Number(modifiers[field]) || 0;
  }
  return normalized;
}

export function loadPlayerProfile(storage) {
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

export function savePlayerProfile(storage, modifiers) {
  if (!storage) return;
  const payload = {
    version: 1,
    savedAt: new Date().toISOString(),
    modifiers: normalizeModifiers(modifiers),
  };
  storage.setItem(PLAYER_PROFILE_STORAGE_KEY, JSON.stringify(payload));
}

export function clearPlayerProfile(storage) {
  if (!storage) return;
  storage.removeItem(PLAYER_PROFILE_STORAGE_KEY);
}
