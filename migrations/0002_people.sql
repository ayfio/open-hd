-- Saved people — only birth data, charts recompute (docs/PLATFORM.md §schema).
-- LWW sync on updated_at with tombstones; ai_access gates MCP visibility.

CREATE TABLE IF NOT EXISTS "people" (
  "id"           TEXT NOT NULL,            -- client-generated UUID (same id as localStorage)
  "user_id"      TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "name"         TEXT NOT NULL,
  "birth_date"   TEXT NOT NULL,            -- YYYY-MM-DD
  "birth_time"   TEXT NOT NULL,            -- HH:MM
  "time_unknown" INTEGER NOT NULL DEFAULT 0,
  "loc_lat"      REAL,
  "loc_lon"      REAL,
  "loc_timezone" REAL,                     -- UTC offset at birth (.5/.75 possible)
  "loc_iana"     TEXT,
  "loc_name"     TEXT,
  "ai_access"    INTEGER NOT NULL DEFAULT 0,  -- per-person MCP exposure (explicit opt-in)
  "created_at"   TEXT NOT NULL,
  "updated_at"   TEXT NOT NULL,            -- LWW key (server-stamped on accept)
  "deleted_at"   TEXT,                     -- tombstone; never hard-delete during sync
  PRIMARY KEY ("user_id", "id")
);
CREATE INDEX IF NOT EXISTS "idx_people_user_updated" ON "people"("user_id", "updated_at");
