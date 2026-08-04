-- Anyone signing up with a @whatiflove.org address is trusted staff by
-- default (your own domain, not open signup) — saves manually promoting
-- each teammate. Existing accounts on that domain are backfilled too.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    case
      when new.email ilike '%@whatiflove.org' then 'staff'::user_role
      else 'public'::user_role
    end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

update public.profiles p
set role = 'staff'
from auth.users u
where p.id = u.id
  and u.email ilike '%@whatiflove.org'
  and p.role = 'public';
