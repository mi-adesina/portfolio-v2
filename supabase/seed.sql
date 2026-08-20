-- =========================================================
-- Development seed data
-- =========================================================
-- Run with: supabase db reset  (applies migrations, then this file)
-- or paste directly into the Supabase SQL editor for a fresh project.
--
-- ⚠️ PLACEHOLDER CONTENT: rows marked [PLACEHOLDER] below have
-- invented descriptions/dates and must be reviewed and replaced with
-- real project details (or deleted) from /admin before this goes
-- live. Nothing here should be treated as accurate professional
-- history until you've edited it.

insert into public.technologies (name, slug, category) values
  ('Next.js', 'nextjs', 'frontend'),
  ('React', 'react', 'frontend'),
  ('TypeScript', 'typescript', 'frontend'),
  ('JavaScript', 'javascript', 'frontend'),
  ('Tailwind CSS', 'tailwind-css', 'frontend'),
  ('Node.js', 'nodejs', 'backend'),
  ('Express.js', 'expressjs', 'backend'),
  ('MongoDB', 'mongodb', 'database'),
  ('Supabase', 'supabase', 'database'),
  ('PostgreSQL', 'postgresql', 'database')
on conflict (slug) do nothing;

-- [PLACEHOLDER] Replace with your real project. Referenced by name in
-- your brief as an example slug ("/projects/learnarc") — update or
-- remove if that's not an accurate project name/description.
insert into public.projects (
  title, slug, short_description, full_description,
  status, featured, github_url, live_url,
  features, display_order
) values (
  'LearnArc',
  'learnarc',
  '[PLACEHOLDER] One-line description — replace from /admin.',
  '[PLACEHOLDER] Full case-study description — replace from /admin.',
  'draft',
  false,
  null,
  null,
  '{}',
  1
)
on conflict (slug) do nothing;

-- Link the placeholder project to a couple of technologies as an
-- example of how project_technologies is populated.
insert into public.project_technologies (project_id, technology_id)
select p.id, t.id
from public.projects p, public.technologies t
where p.slug = 'learnarc' and t.slug in ('nextjs', 'typescript', 'supabase')
on conflict do nothing;
