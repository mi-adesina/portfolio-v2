# Michael Adesina — Developer Portfolio

Production-grade personal portfolio built with Next.js (App Router), TypeScript,
Tailwind CSS, and Supabase (Postgres, Auth, Storage). Replaces the previous
freeCodeCamp-era beginner portfolio.

> **Status:** Phase 5 of 8 — the blog is live: `/blog` and
> `/blog/[slug]` read from Supabase with category filtering, and
> `/admin/blog` has full post CRUD (create/edit/delete,
> publish/unpublish, cover/OG image upload, comma-separated tags that
> auto-create). Contact is still a placeholder.
>
> **If you're seeing `permission denied for table ...`:** apply
> `supabase/migrations/20260101000010_data_api_grants.sql` (and, if
> you haven't already, `20260101000010_grants.sql`) — RLS policies
> alone don't grant PostgREST's `anon`/`authenticated` roles table
> access; see "GRANT vs RLS" under Supabase setup below.

## Using the admin dashboard

1. Go to `/admin/login` and sign in with the account you created and
   added to `public.admins` (see "Creating your admin account" above).
2. `/admin` shows project counts and recent activity.
3. `/admin/projects` lists every project (draft and published) with
   inline status/featured toggles, a display-order field, and
   edit/delete actions.
4. `/admin/projects/new` and `/admin/projects/[id]` share one form
   covering every field from the spec — core info, links, cover/OG
   image upload, case-study content (overview/features/challenges/
   solutions/lessons learned), technology checkboxes, and SEO fields.
   The edit page also has a gallery manager below the form for
   project screenshots.

Every write goes through a Server Action in `lib/actions/projects.ts`,
which calls `requireAdmin()` first — but as before, the RLS policies
are the real enforcement, not this check.

## Using the blog

1. `/admin/blog` lists every post (draft and published) with an
   inline status toggle and edit/delete actions.
2. `/admin/blog/new` and `/admin/blog/[id]` share one form: core
   info, cover/OG image upload, content (plain text — see "Content
   format" below), and a comma-separated tags field. Tags don't need
   to exist beforehand — typing a new one creates it.
3. `published_at` is set automatically the first time a post's status
   becomes `published`, and preserved after that (unpublishing and
   republishing later won't reset it to "just now").
4. `/blog` filters by `category` (a plain text field, not a separate
   table) via `?category=`, the same pattern as the Projects
   technology filter.

### Content format

Post content is stored and rendered as plain text — paragraphs
separated by a blank line — not markdown or rich text. That's a
deliberate scope decision, not an oversight: adding a markdown
renderer is an easy follow-up (`react-markdown` or similar) once
there's an actual need for headings/code blocks/links inside posts,
but pulling one in now would be exactly the "unnecessary dependency"
the original brief asked to avoid for a single-author blog with
plain prose so far.

## Tech stack

- **Framework:** Next.js 14 (App Router), Server Components by default
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS, CSS variables for theming (light/dark)
- **Data:** Supabase (Postgres + Row Level Security) — Phase 2+
- **Auth:** Supabase Auth — Phase 4+
- **Storage:** Supabase Storage — Phase 4+
- **Deployment:** Vercel

## Local setup

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
# from your Supabase project (see "Supabase setup" below)
npm run dev
```

Then open http://localhost:3000.

## Supabase setup

1. Create a project at https://supabase.com (free tier is fine).
2. Get your credentials from **Project Settings → API**: `Project URL`
   → `NEXT_PUBLIC_SUPABASE_URL`, `anon public` key →
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `service_role` key (keep secret!) →
   `SUPABASE_SERVICE_ROLE_KEY`. Put all three in `.env.local`.
3. Apply the migrations in `supabase/migrations/` **in filename order**
   — either:
   - **Supabase CLI** (recommended): `npx supabase login`, then
     `npx supabase link --project-ref <your-project-ref>`, then
     `npx supabase db push`
   - **or** paste each file's contents into the SQL Editor in the
     Supabase Dashboard, in filename order (they're numbered).

   If your project was already migrated through
   `20260101000009_storage_buckets.sql` before this README was
   updated, you still need to run the two newer files —
   `20260101000010_grants.sql` and `20260101000010_data_api_grants.sql`
   (same numeric prefix, different files, both required; order
   between the two doesn't matter). Without them, every public page
   fails with `permission denied for table ...` — see
   "GRANT vs RLS" below.
4. (Optional, dev only) Run `supabase/seed.sql` the same way, for a
   placeholder project row to develop against. Everything in it is
   marked `[PLACEHOLDER]` — review before treating it as real content.

### GRANT vs RLS — two different gates

Row Level Security controls *which rows* a query can see or touch,
but Postgres checks something coarser first: whether the calling role
has *any* privilege on the table at all. Supabase's Data API queries
run as the `anon` role (unauthenticated requests) or `authenticated`
role (any logged-in user, admin or not) — `is_admin()` is what tells
those two apart, not the role itself. If a table never received an
explicit `GRANT` for these roles, every request fails with
`42501: permission denied for table ...` before RLS is ever consulted
— RLS can't loosen a privilege check it never got to run.

`20260101000010_data_api_grants.sql` grants each role exactly the
statement type its existing RLS policies already allow (e.g. `anon`
gets `SELECT` on `projects` because a public-read policy already
exists — the grant doesn't add access, it unblocks the check that
was silently rejecting everyone first). `public.admins` intentionally
gets no grant at all, for either role — it stays reachable only
through `is_admin()`.

### Creating your admin account

1. In the Supabase Dashboard, go to **Authentication → Users → Add
   user**, and create yourself an account with your real email.
2. Copy that user's UUID.
3. In the SQL Editor, run:
   ```sql
   insert into public.admins (user_id) values ('<paste-your-uuid-here>');
   ```
   Until this row exists, `is_admin()` returns false for everyone —
   including you — and every write to projects/blog/experience is
   rejected at the database level, not just hidden in the UI.

### Verifying database permissions are correct

After applying `20260101000010_data_api_grants.sql`:

1. **`/` loads successfully** — homepage renders (featured projects
   section shows either real cards or the "no featured projects yet"
   empty state, not an error page).
2. **`/projects` loads successfully** — same check; an empty state is
   fine, a thrown error is not.
3. **Public users can read published content, and only published
   content** — in an incognito/private window (no session, so
   requests run as `anon`): a project with `status = 'published'`
   appears on `/projects`; a project with `status = 'draft'` does
   NOT appear there or at `/projects/<its-slug>` (should 404).
4. **Admin functionality remains protected by RLS, not just grants**
   — confirm the grant alone doesn't authorize writes: while signed
   out, try to submit a write directly (e.g. via the Supabase SQL
   Editor, testing as a non-privileged role, or simply confirm
   through the app that no unauthenticated path can edit a project).
   RLS's `is_admin()` check is what should still block it; the grant
   only made the *attempt* reach that check instead of failing
   earlier for an unrelated reason.
5. Signed in as your admin account, confirm `/admin/projects` still
   lists everything (including drafts) and that create/edit/delete
   still work — the grants shouldn't have changed authorized
   behavior at all, only unblocked previously-broken public reads and
   the admin's own writes.

### How authorization actually works

Two layers, and only one of them matters for security:
- `middleware.ts` refreshes the session cookie; `/admin` routes will
  also check `auth.getUser()` before rendering (Phase 4) — this is a
  **UX** layer, so logged-out visitors get redirected instead of
  seeing a broken page.
- **Row Level Security**, defined in every migration file, is the
  **real** enforcement. Every table's policies call `is_admin()`,
  which checks the `admins` table server-side. Even a forged request
  that skips the UI entirely still can't write data without a
  matching row in `admins`. `lib/supabase/admin.ts` (the service-role
  client) is the one exception — it bypasses RLS by design, which is
  why it's `server-only` and every call site must check the session
  itself before using it.

## Environment variables

See `.env.example`. `SUPABASE_SERVICE_ROLE_KEY` must **never** be prefixed
with `NEXT_PUBLIC_` and must only be read in server-side code (route
handlers / server actions), never shipped to the browser.

## Before Phase 6

1. Supabase project created, migrations applied (through
   `20260101000010_data_api_grants.sql`), `.env.local` filled in
2. `npm install` run locally, `npm run build` and `npm run typecheck` verified
3. Your admin account created and added to `public.admins` (above)
4. Logged into `/admin`, created at least one project and one blog
   post through the real forms, and confirmed both appear on the
   public site after publishing

## Project structure (current)

```
app/
  layout.tsx        Root layout, fonts, global metadata, Person JSON-LD
  page.tsx           Home — hero + featured projects (Supabase-backed)
  about/page.tsx
  resume/page.tsx
  projects/
    page.tsx           List + technology filter (Supabase-backed)
    [slug]/page.tsx     Case-study detail page, SoftwareApplication JSON-LD
  experience/page.tsx
  blog/
    page.tsx           List + category filter (Supabase-backed)
    [slug]/page.tsx     Post detail page, Article JSON-LD
  contact/page.tsx    Placeholder — real form in Phase 6
  admin/
    login/page.tsx       Public — sign-in form (Server Action)
    (dashboard)/
      layout.tsx           Auth gate for everything below — requireAdmin()
      page.tsx              Dashboard — counts + recent projects
      projects/
        page.tsx             All projects table — status/featured/order/delete
        new/page.tsx          Create form
        [id]/page.tsx          Edit form + gallery manager
      blog/
        page.tsx             All posts table — status/delete
        new/page.tsx          Create form
        [id]/page.tsx          Edit form
  not-found.tsx
  loading.tsx
  error.tsx
  globals.css
components/
  ui/           Shared primitives (Button, ...)
  marketing/    Header, footer, hero
  projects/     ProjectCard, TechnologyFilter, TechBadge
  blog/         PostCard, CategoryFilter, TagBadge
  admin/        AdminSidebar, ProjectForm, PostForm, FormField,
                ImageGalleryManager, ConfirmSubmitButton
lib/
  fonts.ts        next/font definitions
  site-config.ts  Single source of truth for name/links/copy — edit here
  utils.ts
  auth/
    require-admin.ts  The one auth gate every admin page/action calls
  actions/
    auth.ts          signIn / signOut Server Actions
    projects.ts       Project CRUD + image upload Server Actions
    blog.ts            Post CRUD + tag resolution Server Actions
  validations/
    project.ts        zod schema + FormData parser for the project form
    blog.ts             zod schema + FormData parser for the post form
  data/
    projects.ts        Public query layer (published-only)
    blog.ts              Public query layer (published-only)
    admin-projects.ts   Admin query layer (all statuses, takes an authed client)
    admin-blog.ts        Admin query layer (all statuses, takes an authed client)
  supabase/
    client.ts     Browser client (Client Components) — RLS-scoped
    server.ts     Server client (Server Components/Actions) — RLS-scoped
    public.ts      Cookieless anon client — for public reads, generateStaticParams
    admin.ts       Service-role client — bypasses RLS, server-only (unused so far — RLS covers Phase 4's needs)
    storage.ts     Resolves a stored path to a public bucket URL
    upload.ts       Validated image upload/delete helpers used by admin actions
types/
  database.ts     Hand-written Supabase types (regenerate via CLI later)
supabase/
  migrations/     Numbered SQL migrations — schema + RLS, run in order
  seed.sql         Dev-only seed data ([PLACEHOLDER] content, review first)
middleware.ts      Refreshes the Supabase auth session cookie
```

## Editing your info

Update `lib/site-config.ts` for your name, headline, social links, resume
path, and contact email. Update `app/about/page.tsx`'s `sections` array
for your About copy — every `TODO` comment marks a spot that needs your
specifics.

## Commands

```bash
npm run dev         # local dev server
npm run build        # production build
npm run lint          # ESLint
npm run typecheck     # tsc --noEmit
```

## Adding a project

Use `/admin/projects/new` — the SQL editor is no longer required for
this. It's still useful for one-off fixes or bulk edits if you prefer
SQL; the upload convention is the same either way: `cover_image` and
`project_images.path` store a path *within* the `portfolio-images`
bucket (e.g. `my-project/abc123.png`), not a full URL — the admin
upload flow handles this for you automatically.

## Roadmap

1. ✅ Scaffold, design system, static pages
2. ✅ Supabase schema, migrations, RLS policies, generated types
3. ✅ Public projects list/filter/detail pages (Supabase-backed)
4. ✅ Admin dashboard: auth, project CRUD, image upload
5. ✅ Blog: schema, public pages, admin CRUD
6. Contact form + admin inbox
7. SEO pass (sitemap, robots, structured data, OG images), accessibility, performance
8. Final README, `.env.example` review, deployment checklist
