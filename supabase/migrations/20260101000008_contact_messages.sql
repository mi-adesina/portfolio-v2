-- =========================================================
-- contact_messages
-- =========================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- Public visitors can submit the contact form (insert only) but can
-- never read, update, or delete messages — including their own, once
-- submitted. Only the admin can do that, from /admin/messages.
create policy "anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "admin can read contact_messages"
  on public.contact_messages for select
  using (public.is_admin());

create policy "admin can update contact_messages"
  on public.contact_messages for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "admin can delete contact_messages"
  on public.contact_messages for delete
  using (public.is_admin());
