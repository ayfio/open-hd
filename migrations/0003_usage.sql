-- Chart-unit metering (docs/PLATFORM.md §pricing): 50 units/month free.
-- A unit = one chart-computing tool call on the personal MCP endpoint.
-- Navigational tools (list_people, get_descriptions) are free.

CREATE TABLE IF NOT EXISTS "usage" (
  "user_id" TEXT NOT NULL,
  "month"   TEXT NOT NULL,   -- YYYY-MM
  "units"   INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY ("user_id", "month")
);

-- Future paid plans; everyone starts free.
CREATE TABLE IF NOT EXISTS "entitlements" (
  "user_id" TEXT PRIMARY KEY REFERENCES "user"("id") ON DELETE CASCADE,
  "plan"    TEXT NOT NULL DEFAULT 'free',  -- 'free' | 'supporter'
  "updated_at" TEXT NOT NULL
);
