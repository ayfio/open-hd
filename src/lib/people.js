/**
 * Saved people — the single persistence seam (see docs/PLATFORM.md).
 *
 * The app talks to a PeopleStore; today there is one implementation,
 * LocalStore, wrapping natalengine's profile storage so any
 * natalengine-powered app shares the same library of saved birth data.
 *
 * When accounts ship, a SyncStore decorator wraps LocalStore here —
 * localStorage stays the live source of truth for the UI (instant,
 * offline-correct); the server becomes durable backup + cross-device
 * fan-out. Nothing outside this file changes.
 *
 * `VITE_OHD_API_BASE` unset (the default, and always the case for
 * self-hosted static builds) → pure local behavior, no network.
 */

import { getProfiles, getProfile, saveProfile, deleteProfile } from 'natalengine';

const LAST_KEY = 'ohd-last-person-id';

// ---------------------------------------------------------------------------
// LocalStore — natalengine profiles in localStorage
// ---------------------------------------------------------------------------
const LocalStore = {
  list: getProfiles,
  get: getProfile,
  delete: deleteProfile,
  save(birth) {
    return saveProfile({
      id: birth.id,
      name: birth.name || 'Unnamed',
      birthDate: birth.birthDate,
      birthTime: birth.birthTime,
      timeUnknown: !!birth.timeUnknown,
      location: birth.location ? {
        lat: birth.location.lat,
        lon: birth.location.lon,
        timezone: birth.timezone,
        iana: birth.location.iana || null,
        name: birth.location.name || null
      } : { lat: null, lon: null, timezone: birth.timezone, iana: null, name: null }
    });
  }
};

// SyncStore decorator: write-through to LocalStore (instant, offline-
// correct), with dirty-marking so the background sync pushes changes.
// Active only when a session exists (see enableSync below).
import { markDirty, markDeleted } from './sync.js';

let syncEnabled = false;
export function enableSync() { syncEnabled = true; }

const SyncStore = {
  list: LocalStore.list,
  get: LocalStore.get,
  save(birth) {
    const saved = LocalStore.save(birth);
    if (syncEnabled) markDirty(saved.id);
    return saved;
  },
  delete(id) {
    const result = LocalStore.delete(id);
    if (syncEnabled) markDeleted(id);
    return result;
  }
};

const store = SyncStore;

// ---------------------------------------------------------------------------
// Public API (stable — main.js and views depend on these names)
// ---------------------------------------------------------------------------
export const listPeople = (...args) => store.list(...args);
export const getPerson = (...args) => store.get(...args);
export const deletePerson = (...args) => store.delete(...args);
export const savePerson = (...args) => store.save(...args);

/** Profile (storage shape) → birth data (app shape). */
export function birthFromPerson(p) {
  return {
    id: p.id,
    name: p.name,
    birthDate: p.birthDate,
    birthTime: p.birthTime || '12:00',
    timeUnknown: !!p.timeUnknown,
    timezone: p.location?.timezone ?? 0,
    location: p.location && (p.location.lat != null || p.location.name || p.location.iana) ? {
      lat: p.location.lat,
      lon: p.location.lon,
      timezone: p.location.timezone,
      iana: p.location.iana || null,
      name: p.location.name || null
    } : null
  };
}

// --- AI access (per-person MCP visibility) --------------------------------
// Product metadata, deliberately NOT in the engine's profile schema —
// stored alongside and carried over sync (docs/PLATFORM.md §ai_access).
const AI_ACCESS_KEY = 'ohd-ai-access';

function readAiAccess() {
  try { return JSON.parse(localStorage.getItem(AI_ACCESS_KEY) || '{}'); } catch { return {}; }
}

export function getAiAccess(id) {
  return !!readAiAccess()[id];
}

export function setAiAccess(id, value) {
  try {
    const map = readAiAccess();
    if (value) map[id] = true;
    else delete map[id];
    localStorage.setItem(AI_ACCESS_KEY, JSON.stringify(map));
    if (syncEnabled) markDirty(id);
  } catch { /* private mode */ }
}

// Session-only: a chart someone arrived at through a share link. Kept in
// memory (not persisted) so that after they "make their own", the shared
// person is still available to compare against instead of vanishing.
let sharedGuest = null;
export function setSharedGuest(birth) { sharedGuest = birth; }
export function getSharedGuest() { return sharedGuest; }

export function getLastPersonId() {
  try { return localStorage.getItem(LAST_KEY); } catch { return null; }
}

export function setLastPersonId(id) {
  try {
    if (id) localStorage.setItem(LAST_KEY, id);
    else localStorage.removeItem(LAST_KEY);
  } catch { /* private mode */ }
}
