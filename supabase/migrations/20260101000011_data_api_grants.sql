-- =========================================================
-- Data API privilege audit & fix
-- =========================================================
-- Root cause: every prior migration enabled RLS and wrote policies,
-- but RLS is the *second* gate, not the first. Before Postgres ever
-- evaluates a row policy, it checks whether the calling role has the
-- underlying table privilege (SELECT/INSERT/UPDATE/DELETE) at all.
-- Supabase's PostgREST layer runs as the `anon` role for
-- unauthenticated requests and `authenticated` for logged-in
-- requests (regardless of whether that user is our admin — is_admin()
-- is what distinguishes "logged in" from "our one admin", not the
-- role). Since these tables never received an explicit GRANT for
-- those roles, every request failed with 42501 before RLS was
-- consulted at all, matching the reported error.
--
-- This migration only adds the privilege each role needs to attempt
-- what its RLS policies already allow — it grants nothing that
-- widens actual access, since RLS still filters every row and every
-- statement exactly as before. Nothing here touches `public.admins`:
-- it intentionally has zero grants and zero policies, and stays that
-- way — the only sanctioned way to consult it is is_admin(), a
-- SECURITY DEFINER function that bypasses RLS internally but is not
-- itself reachable by anon/authenticated selecting the table.

-- ---------------------------------------------------------
-- Schema usage
-- ---------------------------------------------------------
-- Normally provisioned automatically when a Supabase project is
-- created. Included defensively so this set of migrations is
-- reproducible on its own, without assuming that bootstrap step ran.
grant usage on schema public to anon, authenticated;

-- ---------------------------------------------------------
-- technologies — public read; admin (via is_admin()) writes
-- ---------------------------------------------------------
grant select on public.technologies to anon, authenticated;
grant insert, update, delete on public.technologies to authenticated;

-- ---------------------------------------------------------
-- projects — public read of published rows; admin writes
-- ---------------------------------------------------------
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

-- ---------------------------------------------------------
-- project_technologies — public read via published parent; admin writes
-- ---------------------------------------------------------
grant select on public.project_technologies to anon, authenticated;
grant insert, update, delete on public.project_technologies to authenticated;

-- ---------------------------------------------------------
-- project_images — public read via published parent; admin writes
-- ---------------------------------------------------------
grant select on public.project_images to anon, authenticated;
grant insert, update, delete on public.project_images to authenticated;

-- ---------------------------------------------------------
-- experience — public read (no draft/published gate); admin writes
-- ---------------------------------------------------------
grant select on public.experience to anon, authenticated;
grant insert, update, delete on public.experience to authenticated;

-- ---------------------------------------------------------
-- blog_posts — public read of published rows; admin writes
-- ---------------------------------------------------------
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

-- ---------------------------------------------------------
-- tags — public read; admin (via is_admin()) writes
-- ---------------------------------------------------------
grant select on public.tags to anon, authenticated;
grant insert, update, delete on public.tags to authenticated;

-- ---------------------------------------------------------
-- blog_post_tags — public read via published parent; admin insert/delete
-- ---------------------------------------------------------
-- No UPDATE grant: there is no UPDATE policy on this table (a join
-- row is replaced via delete+insert, never modified in place), so
-- granting UPDATE privilege here would be a privilege with nothing
-- to authorize it — exactly the "excessive grant" this audit is
-- meant to avoid.
grant select on public.blog_post_tags to anon, authenticated;
grant insert, delete on public.blog_post_tags to authenticated;

-- ---------------------------------------------------------
-- contact_messages — anonymous insert-only; admin read/manage
-- ---------------------------------------------------------
-- Both anon (typical site visitor) and authenticated (e.g. testing
-- the form while signed in) can submit — matches the existing
-- "anyone can submit a contact message" policy, which is
-- unconditional (`with check (true)`). Neither role gets SELECT,
-- UPDATE, or DELETE: those stay authenticated-only, further gated by
-- is_admin() in the existing policies, so a signed-in non-admin
-- (hypothetically, if one ever exists) still can't read messages —
-- RLS denies it even though the grant is present.
grant insert on public.contact_messages to anon, authenticated;
grant select, update, delete on public.contact_messages to authenticated;

-- ---------------------------------------------------------
-- storage.objects — mirrors the storage RLS policies from
-- 20260101000009_storage_buckets.sql
-- ---------------------------------------------------------
-- Supabase's own project bootstrap normally grants these already
-- (Storage ships pre-provisioned); included explicitly so this
-- migration set is reproducible without relying on that. Access is
-- still governed entirely by the RLS policies on storage.objects:
-- SELECT is unrestricted (matches the public bucket), INSERT/UPDATE/
-- DELETE require is_admin() regardless of this grant.
grant select on storage.objects to anon, authenticated;
grant insert, update, delete on storage.objects to authenticated;

-- Note: public.is_admin()'s EXECUTE grant to `authenticated` was
-- already added in 20260101000010_grants.sql and is not repeated
-- here to avoid two migrations claiming the same change.
