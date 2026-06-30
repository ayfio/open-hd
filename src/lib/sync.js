/**
 * Optional account sync — Cloudflare Worker compatible
 */

import { getProfiles, saveProfile, deleteProfile } from 'natalengine';
import { getAiAccess, setAiAccess } from './people.js';

// API base: в Worker передаётся через env, в браузере — через import.meta.env
const API = typeof import.meta !== 'undefined' 
  ? import.meta.env.VITE_OHD_API_BASE 
  : undefined;

const CURSOR_KEY = 'ohd-sync-cursor';
const DIRTY_KEY = 'ohd-sync-dirty';
const DELETES_KEY = 'ohd-sync-deletes';

export const syncAvailable = !!API;

let syncing = false;
let onChange = null;

// --- tiny persisted sets -----------------------------------------------
function readSet(key) {
  if (typeof localStorage === 'undefined') return new Set();
  try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } 
  catch { return new Set(); }
}

function writeSet(key, set) {
  if (typeof localStorage === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify([...set])); } 
  catch { /* private mode */ }
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

// --- auth (Worker-compatible) ------------------------------------------
async function api(path, options = {}, env = null) {
  const base = env?.API_BASE || API || '';
  
  // Подготовка заголовков: в Worker берём токен из env/request, в браузере — из cookies
  const headers = {
    'content-type': 'application/json',
    ...(options.headers || {})
  };
  
  // Если есть токен в env (Worker) — добавляем его
  if (env?.AUTH_TOKEN) {
    headers['authorization'] = `Bearer ${env.AUTH_TOKEN}`;
  }
  
  const res = await fetch(`${base}${path}`, {
    // credentials удаляем — в Workers не поддерживается
    headers,
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

export async function getSessionUser(env = null) {
  if (!syncAvailable) return null;
  try {
    const data = await api('/api/auth/get-session', {}, env);
    return data?.user || null;
  } catch {
    return null;
  }
}

export async function requestMagicLink(email, env = null) {
  return api('/api/auth/sign-in/magic-link', {
    method: 'POST',
    body: { email, callbackURL: '/' }
  }, env);
}

export async function signOut(env = null) {
  try { 
    await api('/api/auth/sign-out', { method: 'POST', body: {} }, env); 
  } catch { /* best effort */ }
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

export async function syncNow({ firstMerge = false, env = null } = {}) {
  if (!syncAvailable || syncing) return false;
  syncing = true;
  
  try {
    const profiles = getProfiles();
    const dirty = firstMerge 
      ? new Set(profiles.map(p => p.id)) 
      : readSet(DIRTY_KEY);
    const deletes = readSet(DELETES_KEY);

    const changes = [
      ...profiles.filter(p => dirty.has(p.id)).map(p => profileToWire(p)),
      ...[...deletes].map(id => ({ 
        id, 
        deletedAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      }))
    ];
    
    const since = firstMerge ? '' : (readSet(CURSOR_KEY) || '');

    const data = await api('/api/sync', {
      method: 'POST',
      body: { since, changes }
    }, env);

    writeSet(DIRTY_KEY, new Set());
    writeSet(DELETES_KEY, new Set());

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

    try { 
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CURSOR_KEY, data.now); 
      }
    } catch { /* private mode */ }
    
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

export function startSync({ onRemoteChange, env = null } = {}) {
  if (!syncAvailable) return;
  onChange = onRemoteChange || null;
  
  let merged = false;
  if (typeof localStorage !== 'undefined') {
    merged = localStorage.getItem(CURSOR_KEY) !== null;
  }
  
  syncNow({ firstMerge: !merged, env });
  
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', () => scheduleSync(200));
  }
}
