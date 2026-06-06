/**
 * People sync — LWW deltas with tombstones (docs/PLATFORM.md §sync).
 *
 *   POST /api/sync  { since?: ISO, changes?: [PersonRecord] }
 *     → { now: ISO, changes: [PersonRecord incl. tombstones since `since`] }
 *
 * Per-record last-write-wins: an incoming change applies iff its updatedAt
 * is newer than the stored row's. Accepted writes are re-stamped with
 * server time so the cursor clock is trustworthy. Tombstones (deletedAt)
 * propagate like edits and never resurrect.
 */

// Generous while we grow — proper tier gating comes with payments later
// (decision 2026-06-06: make it all work for anyone with an account).
const MAX_PEOPLE_FREE = 100;

function rowToWire(r) {
  return {
    id: r.id,
    name: r.name,
    birthDate: r.birth_date,
    birthTime: r.birth_time,
    timeUnknown: !!r.time_unknown,
    location: (r.loc_lat != null || r.loc_name || r.loc_iana) ? {
      lat: r.loc_lat,
      lon: r.loc_lon,
      timezone: r.loc_timezone,
      iana: r.loc_iana,
      name: r.loc_name
    } : null,
    aiAccess: !!r.ai_access,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    deletedAt: r.deleted_at || null
  };
}

function validChange(c) {
  return c && typeof c.id === 'string' && c.id.length <= 64 &&
    (c.deletedAt || (
      typeof c.name === 'string' && c.name.length <= 200 &&
      /^\d{4}-\d{2}-\d{2}$/.test(c.birthDate || '') &&
      /^\d{1,2}:\d{2}$/.test(c.birthTime || '')
    ));
}

export async function handleSync(env, session, request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'invalid JSON' }, { status: 400 });
  }

  const userId = session.user.id;
  const since = typeof body.since === 'string' ? body.since : '';
  const changes = Array.isArray(body.changes) ? body.changes.slice(0, 200) : [];
  const now = new Date().toISOString();

  for (const c of changes) {
    if (!validChange(c)) continue;

    const existing = await env.DB
      .prepare('SELECT updated_at FROM people WHERE user_id = ?1 AND id = ?2')
      .bind(userId, c.id).first();

    // LWW: apply iff strictly newer than what we hold
    if (existing && String(c.updatedAt || '') <= existing.updated_at) continue;

    if (!existing && !c.deletedAt) {
      // Free-tier cap counts live (non-tombstoned) rows
      const { cnt } = await env.DB
        .prepare('SELECT COUNT(*) AS cnt FROM people WHERE user_id = ?1 AND deleted_at IS NULL')
        .bind(userId).first();
      if (cnt >= MAX_PEOPLE_FREE) continue; // silently skipped; pull won't echo it back
    }

    await env.DB.prepare(`
      INSERT INTO people (user_id, id, name, birth_date, birth_time, time_unknown,
                          loc_lat, loc_lon, loc_timezone, loc_iana, loc_name,
                          ai_access, created_at, updated_at, deleted_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)
      ON CONFLICT (user_id, id) DO UPDATE SET
        name = excluded.name,
        birth_date = excluded.birth_date,
        birth_time = excluded.birth_time,
        time_unknown = excluded.time_unknown,
        loc_lat = excluded.loc_lat,
        loc_lon = excluded.loc_lon,
        loc_timezone = excluded.loc_timezone,
        loc_iana = excluded.loc_iana,
        loc_name = excluded.loc_name,
        ai_access = excluded.ai_access,
        updated_at = excluded.updated_at,
        deleted_at = excluded.deleted_at
    `).bind(
      userId, c.id,
      c.name || 'Unnamed',
      c.birthDate || '1900-01-01',
      c.birthTime || '12:00',
      c.timeUnknown ? 1 : 0,
      c.location?.lat ?? null,
      c.location?.lon ?? null,
      c.location?.timezone ?? null,
      c.location?.iana ?? null,
      c.location?.name ?? null,
      c.aiAccess ? 1 : 0,
      c.createdAt || now,
      now,                       // server-stamped LWW clock
      c.deletedAt ? now : null
    ).run();
  }

  // Delta pull: everything newer than the client's cursor (incl. tombstones)
  const { results } = await env.DB.prepare(
    'SELECT * FROM people WHERE user_id = ?1 AND updated_at > ?2 ORDER BY updated_at'
  ).bind(userId, since).all();

  return Response.json({ now, changes: results.map(rowToWire) });
}
