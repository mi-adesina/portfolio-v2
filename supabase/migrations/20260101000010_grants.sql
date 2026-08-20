-- The app calls is_admin() directly via supabase.rpc('is_admin') to
-- decide whether to show /admin at all (a UX check — RLS is what
-- actually enforces the write restrictions regardless of this).
-- Postgres grants EXECUTE on new functions to PUBLIC by default, but
-- this makes the dependency explicit rather than relying on that.
grant execute on function public.is_admin() to authenticated;
