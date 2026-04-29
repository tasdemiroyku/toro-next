-- ============================================================
-- Fix: Explicit FK constraint names on messages table
-- so PostgREST can resolve the relationship to profiles.
--
-- Run in Supabase SQL Editor.
-- Safe to re-run — uses DROP IF EXISTS.
-- ============================================================

-- ── 1. Drop existing FK constraints (whatever they're named) ─────────────────

ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_listing_id_fkey;
-- Also drop any auto-generated Supabase variants
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey1;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey1;


-- ── 2. Recreate with exact names PostgREST resolves ──────────────────────────

ALTER TABLE messages
  ADD CONSTRAINT messages_listing_id_fkey
  FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE;

ALTER TABLE messages
  ADD CONSTRAINT messages_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE messages
  ADD CONSTRAINT messages_receiver_id_fkey
  FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;


-- ── 3. Reload PostgREST schema cache immediately ─────────────────────────────

NOTIFY pgrst, 'reload schema';


-- ── 4. Verify — should return 3 rows ─────────────────────────────────────────

SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name  AS references_table,
  ccu.column_name AS references_column
FROM information_schema.table_constraints       tc
JOIN information_schema.key_column_usage        kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema   = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
  AND tc.table_schema   = ccu.table_schema
WHERE tc.table_name      = 'messages'
  AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.constraint_name;