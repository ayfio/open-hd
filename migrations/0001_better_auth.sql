-- better-auth core schema (SQLite/D1), per the documented table definitions.
-- Dates stored as ISO-8601 TEXT; booleans as INTEGER 0/1 (better-auth's
-- kysely sqlite convention).

CREATE TABLE IF NOT EXISTS "user" (
  "id"            TEXT PRIMARY KEY,
  "name"          TEXT NOT NULL,
  "email"         TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL DEFAULT 0,
  "image"         TEXT,
  "createdAt"     TEXT NOT NULL,
  "updatedAt"     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id"        TEXT PRIMARY KEY,
  "userId"    TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "token"     TEXT NOT NULL UNIQUE,
  "expiresAt" TEXT NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "createdAt" TEXT NOT NULL,
  "updatedAt" TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_session_userId" ON "session"("userId");
CREATE INDEX IF NOT EXISTS "idx_session_token" ON "session"("token");

CREATE TABLE IF NOT EXISTS "account" (
  "id"                    TEXT PRIMARY KEY,
  "userId"                TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accountId"             TEXT NOT NULL,
  "providerId"            TEXT NOT NULL,
  "accessToken"           TEXT,
  "refreshToken"          TEXT,
  "accessTokenExpiresAt"  TEXT,
  "refreshTokenExpiresAt" TEXT,
  "scope"                 TEXT,
  "idToken"               TEXT,
  "password"              TEXT,
  "createdAt"             TEXT NOT NULL,
  "updatedAt"             TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_account_userId" ON "account"("userId");

CREATE TABLE IF NOT EXISTS "verification" (
  "id"         TEXT PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value"      TEXT NOT NULL,
  "expiresAt"  TEXT NOT NULL,
  "createdAt"  TEXT NOT NULL,
  "updatedAt"  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_verification_identifier" ON "verification"("identifier");
