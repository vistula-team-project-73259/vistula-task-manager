-- Run in the Supabase SQL Editor of a separate demonstration project.
-- These policies intentionally allow anyone to change all demonstration tasks.
begin;
create table if not exists public.tasks (
  id bigint generated always as identity primary key,
  title text not null check (length(btrim(title)) > 0),
  description text,
  completed boolean not null default false
);
alter table public.tasks enable row level security;
grant usage on schema public to anon;
grant select, insert, update, delete on public.tasks to anon;
grant usage, select on sequence public.tasks_id_seq to anon;
drop policy if exists "Demo public read" on public.tasks;
drop policy if exists "Demo public insert" on public.tasks;
drop policy if exists "Demo public update" on public.tasks;
drop policy if exists "Demo public delete" on public.tasks;
create policy "Demo public read" on public.tasks for select to anon using (true);
create policy "Demo public insert" on public.tasks for insert to anon with check (true);
create policy "Demo public update" on public.tasks for update to anon using (true) with check (true);
create policy "Demo public delete" on public.tasks for delete to anon using (true);
commit;
