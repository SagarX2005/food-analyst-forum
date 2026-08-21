-- Migration: 20260821000007_profiles_extended_columns.sql
-- Description: Add extended profile columns: username, location, website,
--              linkedin_url, github_url, cover_url, skills.
--
-- Safety notes:
--   * Every column uses ADD COLUMN IF NOT EXISTS — idempotent on re-run.
--   * All columns are nullable (username) or have a safe default (skills TEXT[]).
--   * Existing rows are unaffected; no backfill is performed.
--   * The unique index on username uses a WHERE clause so multiple NULL values
--     are permitted (PostgreSQL partial index semantics).
--   * handle_new_user trigger, prevent_role_escalation trigger, and all
--     existing RLS policies are unaffected — they do not reference these columns.

--------------------------------------------------------------------------------
-- 1. ADD EXTENDED COLUMNS TO public.profiles
--------------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username     TEXT,
  ADD COLUMN IF NOT EXISTS location     TEXT,
  ADD COLUMN IF NOT EXISTS website      TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
  ADD COLUMN IF NOT EXISTS github_url   TEXT,
  ADD COLUMN IF NOT EXISTS cover_url    TEXT,
  ADD COLUMN IF NOT EXISTS skills       TEXT[] DEFAULT '{}' NOT NULL;

--------------------------------------------------------------------------------
-- 2. UNIQUE PARTIAL INDEX ON username (allows multiple NULLs)
--------------------------------------------------------------------------------

-- A standard UNIQUE constraint would prevent multiple NULL values in some DB
-- drivers, but PostgreSQL already treats NULLs as distinct in unique indexes.
-- We use a partial index for clarity and to mirror common convention.
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username
  ON public.profiles (username)
  WHERE username IS NOT NULL;

--------------------------------------------------------------------------------
-- 3. PLAIN INDEX ON username FOR FAST LOOKUP (covers WHERE username = $1)
--------------------------------------------------------------------------------

-- The partial unique index above already serves lookup queries on non-NULL
-- usernames, so no additional plain index is needed.
-- Added comment for reviewers.

--------------------------------------------------------------------------------
-- 4. COMMENT ON COLUMNS
--------------------------------------------------------------------------------

COMMENT ON COLUMN public.profiles.username IS
  'URL-safe handle chosen by the user. NULL until the user sets one. Unique among non-NULL values.';

COMMENT ON COLUMN public.profiles.skills IS
  'Array of skill/competency tags entered by the user. Defaults to empty array.';
