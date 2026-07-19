-- Restaurants didn't get a photos column in the initial schema; listings
-- already has one.
alter table public.restaurants add column photos jsonb not null default '[]';

-- Public storage bucket for listing and restaurant photos. Public because
-- these are publicly browsable pages — no signed URLs needed for reads.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "authenticated users can upload photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'photos');

create policy "anyone can view photos"
  on storage.objects for select
  using (bucket_id = 'photos');
