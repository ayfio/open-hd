/**
 * Saved people — thin wrapper over natalengine's profile storage so any
 * natalengine-powered app shares the same library of saved birth data.
 */

import { getProfiles, getProfile, saveProfile, deleteProfile } from 'natalengine';

const LAST_KEY = 'ohd-last-person-id';

export const listPeople = getProfiles;
export const getPerson = getProfile;
export const deletePerson = deleteProfile;

export function savePerson(birth) {
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
