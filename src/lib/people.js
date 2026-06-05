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

// The active store. Phase 3 wraps this with a SyncStore decorator when
// import.meta.env.VITE_OHD_API_BASE is set and the user signs in.
const store = LocalStore;

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

export function getLastPersonId() {
  try { return localStorage.getItem(LAST_KEY); } catch { return null; }
}

export function setLastPersonId(id) {
  try {
    if (id) localStorage.setItem(LAST_KEY, id);
    else localStorage.removeItem(LAST_KEY);
  } catch { /* private mode */ }
}
