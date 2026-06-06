/**
 * Optional account sync — the SyncStore side of the PeopleStore seam.
 *
 * Design (docs/PLATFORM.md):
 * - localStorage stays the live source of truth; the server is durable
 *   backup + cross-device fan-out.
 * - Dirty-set tracking: UI-path saves/deletes mark ids dirty; sync pushes
 *   dirty records (LWW on the server), pulls deltas, applies remote rows
 *   that aren't locally dirty. Convergent and boring on purpose.
 * - Enabled only when the build has an API base (VITE_OHD_API_BASE) AND
 *   the user signed in. Static self-hosted builds: all of this is dead code.
 */

import { getProfiles, saveProfile, deleteProfile } from 'natalengine';
import { getAiAccess, setAiAccess } from './people.js';

const API = import.meta.env.VITE_OHD_API_BASE; // undefined = sync disabled
const CURSOR_KEY = 'ohd-sync-cursor';
const DIRTY_KEY = 'ohd-sync-dirty';     // ids with unpushed local edits
const DELETES_KEY = 'ohd-sync-deletes'; // tombstones awaiting push

export const syncAvailable = API !== undefined;
const base = API || ''; // '' = same origin

let syncing = false;
let onChange = null; // callback: remote changes were applied → re-render

// --- tiny persisted sets -----------------------------------------------
function readSet(key) {
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { return new Set(); }
}
function writeSet(key, set) {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch { /* private mode */ }
}

export function markDirty(id) {
  if (!syncAvailable || !id) return;
  const dirty = readSet(DIRTY_KEY);
  dirty.add(id);
  writeSet(DIRTY_KEY, dirty);
  scheduleSync();
}

export function markDeleted(id) {
  if (!syncAvailable || !id) return;
  const deletes = readSet(DELETES_KEY);
  deletes.add(id);
  writeSet(DELETES_KEY, deletes);
  const dirty = readSet(DIRTY_KEY);
  dirty.delete(id);
  writeSet(DIRTY_KEY, dirty);
  scheduleSync();
}

// --- auth ----------------------------------------------------------------
async function api(path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    credentials: 'include',
    headers: { 'content-type': 'application/json' },
    ...options
  });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

export async function getSessionUser() {
  if (!syncAvailable) return null;
  try {
    const data = await api('/api/auth/get-session');
    return data?.user || null;
  } catch {
    return null;
  }
}

export async function requestMagicLink(email) {
  return api('/api/auth/sign-in/magic-link', {
    method: 'POST',
    body: JSON.stringify({ email, callbackURL: '/' })
  });
}

export async function signOut() {
  try { await api('/api/auth/sign-out', { method: 'POST', body: '{}' }); } catch { /* best effort */ }
}

// --- sync engine -----------------------------------------------------------
function profileToWire(p) {
  return {
    id: p.id,
    name: p.name,
    birthDate: p.birthDate,
    birthTime: p.birthTime,
    timeUnknown: !!p.timeUnknown,
    location: p.location || null,
    aiAccess: getAiAccess(p.id),
    updatedAt: p.updatedAt,
    createdAt: p.createdAt
  };
}

/**
 * One full sync round: push dirty + tombstones, pull deltas, apply.
 * First sign-in: every local person is dirty (the one-time merge).
 */
export async function syncNow({ firstMerge = false } = {}) {
  if (!syncAvailable || syncing) return false;
  syncing = true;
  try {
    const profiles = getProfiles();
    const dirty = firstMerge ? new Set(profiles.map(p => p.id)) : readSet(DIRTY_KEY);
    const deletes = readSet(DELETES_KEY);

    const changes = [
      ...profiles.filter(p => dirty.has(p.id)).map(p => profileToWire(p)),
      ...[...deletes].map(id => ({ id, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }))
    ];
    const since = firstMerge ? '' : (localStorage.getItem(CURSOR_KEY) || '');

    const data = await api('/api/sync', {
      method: 'POST',
      body: JSON.stringify({ since, changes })
    });

    // Push succeeded — clear what we sent
    writeSet(DIRTY_KEY, new Set());
    writeSet(DELETES_KEY, new Set());

    // Apply remote deltas. Skip rows we just marked dirty again mid-flight
    // (local edits win until the next push) and rows we deleted locally.
    const stillDirty = readSet(DIRTY_KEY);
    let applied = 0;
    for (const c of data.changes || []) {
      if (stillDirty.has(c.id)) continue;
      if (c.deletedAt) {
        deleteProfile(c.id);
        applied++;
        continue;
      }
      saveProfile({
        id: c.id,
        name: c.name,
        birthDate: c.birthDate,
        birthTime: c.birthTime,
        timeUnknown: c.timeUnknown,
        location: c.location
      });
      setAiAccess(c.id, !!c.aiAccess);
      applied++;
    }

    try { localStorage.setItem(CURSOR_KEY, data.now); } catch { /* private mode */ }
    if (applied && onChange) onChange();
    return true;
  } catch (e) {
    console.warn('sync failed (will retry):', e.message);
    return false;
  } finally {
    syncing = false;
  }
}

let timer = null;
export function scheduleSync(delay = 2000) {
  if (!syncAvailable) return;
  clearTimeout(timer);
  timer = setTimeout(() => syncNow(), delay);
}

/** Start background sync: first merge, then on focus + after writes. */
export function startSync({ onRemoteChange } = {}) {
  if (!syncAvailable) return;
  onChange = onRemoteChange || null;
  const merged = localStorage.getItem(CURSOR_KEY) !== null;
  syncNow({ firstMerge: !merged });
  window.addEventListener('focus', () => scheduleSync(200));
}
