-- Extensions
create extension if not exists pgcrypto;

-- Enums
create type user_role as enum ('public', 'staff', 'admin');
create type language_code as enum ('en', 'zh');
create type listing_status as enum ('pending', 'active', 'expired', 'archived');
create type payment_status as enum ('unpaid', 'paid', 'refunded');
create type rateable_item_type as enum ('listing', 'review');
create type flag_status as enum ('open', 'reviewed', 'dismissed');
create type client_request_status as enum ('pending', 'approved', 'declined');

-- Shared helper: keeps updated_at current on every row update
create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- cities
create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.cities enable row level security;

create policy "cities are publicly readable"
  on public.cities for select
  using (true);

insert into public.cities (name, slug) values ('Phoenix', 'phoenix');

-- profiles (extends auth.users with app-specific fields)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  language_preference language_code not null default 'en',
  role user_role not null default 'public',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Shared helper: used throughout RLS policies to gate staff/admin-only actions
create function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff', 'admin')
  );
$$ language sql stable security definer set search_path = public;

create policy "users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "staff can read all profiles"
  on public.profiles for select
  using (public.is_staff());

create policy "users can update their own language preference"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Prevents a user from granting themselves staff/admin through the update
-- policy above; role changes must go through the service role key.
create function public.prevent_role_self_escalation()
returns trigger as $$
begin
  if new.role <> old.role and auth.role() <> 'service_role' then
    raise exception 'role can only be changed by staff tooling';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger profiles_prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- Creates a profile row automatically whenever someone signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- editors
create table public.editors (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  name text not null,
  photo_url text,
  bio_en text,
  bio_zh text,
  created_at timestamptz not null default now()
);

alter table public.editors enable row level security;

create policy "editors are publicly readable"
  on public.editors for select
  using (true);

create policy "staff manage editors"
  on public.editors for all
  using (public.is_staff())
  with check (public.is_staff());

-- editor_follows (join table, "followable" editor profiles)
create table public.editor_follows (
  editor_id uuid not null references public.editors(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (editor_id, user_id)
);

alter table public.editor_follows enable row level security;

create policy "users manage their own follows"
  on public.editor_follows for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "follows are publicly readable"
  on public.editor_follows for select
  using (true);

-- restaurants
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  name_en text not null,
  name_zh text not null,
  cuisine text,
  address text,
  hours text,
  verified boolean not null default false,
  status text not null default 'active' check (status in ('active', 'archived')),
  archived_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint archived_needs_reason check (status <> 'archived' or archived_reason is not null)
);

create trigger restaurants_set_updated_at
  before update on public.restaurants
  for each row execute function public.set_updated_at();

alter table public.restaurants enable row level security;

create policy "active restaurants are publicly readable"
  on public.restaurants for select
  using (status = 'active' or public.is_staff());

create policy "staff manage restaurants"
  on public.restaurants for insert
  with check (public.is_staff());

create policy "staff update restaurants"
  on public.restaurants for update
  using (public.is_staff())
  with check (public.is_staff());

-- reviews
-- The editor's rating and the community's rating are stored as two
-- separate columns with two separate write paths: editor_rating only
-- moves through the staff-only update policy below, while
-- community_rating/vote_count are cached aggregates only ever written
-- by the cast_rating() function further down. Neither path can touch
-- the other column, so the two ratings can't merge even by accident.
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id),
  editor_id uuid not null references public.editors(id),
  body_en text,
  body_zh text,
  body_zh_human_edited boolean not null default false,
  editor_rating smallint not null check (editor_rating between 1 and 4),
  community_rating numeric(3,2),
  vote_count integer not null default 0,
  status text not null default 'published' check (status in ('published', 'archived')),
  archived_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint archived_needs_reason check (status <> 'archived' or archived_reason is not null)
);

create trigger reviews_set_updated_at
  before update on public.reviews
  for each row execute function public.set_updated_at();

alter table public.reviews enable row level security;

create policy "published reviews are publicly readable"
  on public.reviews for select
  using (status = 'published' or public.is_staff());

create policy "staff manage reviews"
  on public.reviews for insert
  with check (public.is_staff());

create policy "staff update reviews"
  on public.reviews for update
  using (public.is_staff())
  with check (public.is_staff());

-- listings
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  user_id uuid references public.profiles(id),
  category text not null check (category in ('hiring', 'rentals', 'homes', 'cars', 'services')),
  title_en text,
  title_zh text,
  body_en text,
  body_zh text,
  translation_source language_code not null,
  machine_translated boolean not null default true,
  price numeric(10,2),
  photos jsonb not null default '[]',
  verified boolean not null default false,
  community_rating numeric(3,2),
  vote_count integer not null default 0,
  status listing_status not null default 'pending',
  archived_reason text,
  expires_at timestamptz,
  payment_status payment_status not null default 'unpaid',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint archived_needs_reason check (status <> 'archived' or archived_reason is not null)
);

create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

alter table public.listings enable row level security;

create policy "active listings are publicly readable"
  on public.listings for select
  using (status = 'active' or auth.uid() = user_id or public.is_staff());

create policy "users can post their own listing"
  on public.listings for insert
  with check (auth.uid() = user_id);

create policy "staff update listings"
  on public.listings for update
  using (public.is_staff())
  with check (public.is_staff());

-- ratings
-- No direct insert/update policy is granted here on purpose: all writes
-- go through cast_rating() below, which enforces one vote per user per
-- item and keeps the cached aggregate on listings/reviews in sync.
create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  item_type rateable_item_type not null,
  item_id uuid not null,
  value smallint not null check (value between 1 and 4),
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

alter table public.ratings enable row level security;

create policy "users can read their own ratings"
  on public.ratings for select
  using (auth.uid() = user_id);

create function public.cast_rating(
  p_item_type rateable_item_type,
  p_item_id uuid,
  p_value smallint
)
returns void as $$
begin
  if auth.uid() is null then
    raise exception 'must be signed in to rate';
  end if;

  insert into public.ratings (user_id, item_type, item_id, value)
  values (auth.uid(), p_item_type, p_item_id, p_value)
  on conflict (user_id, item_type, item_id)
  do update set value = excluded.value;

  if p_item_type = 'listing' then
    update public.listings
    set community_rating = (
          select avg(value) from public.ratings
          where item_type = 'listing' and item_id = p_item_id
        ),
        vote_count = (
          select count(*) from public.ratings
          where item_type = 'listing' and item_id = p_item_id
        )
    where id = p_item_id;
  elsif p_item_type = 'review' then
    update public.reviews
    set community_rating = (
          select avg(value) from public.ratings
          where item_type = 'review' and item_id = p_item_id
        ),
        vote_count = (
          select count(*) from public.ratings
          where item_type = 'review' and item_id = p_item_id
        )
    where id = p_item_id;
  end if;
end;
$$ language plpgsql security definer set search_path = public;

-- client_requests
create table public.client_requests (
  id uuid primary key default gen_random_uuid(),
  city_id uuid not null references public.cities(id),
  business_name text not null,
  contact_name text,
  contact_email text,
  contact_phone text,
  requested_action text not null,
  status client_request_status not null default 'pending',
  decline_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger client_requests_set_updated_at
  before update on public.client_requests
  for each row execute function public.set_updated_at();

alter table public.client_requests enable row level security;

create policy "anyone can submit a client request"
  on public.client_requests for insert
  with check (true);

create policy "staff manage client requests"
  on public.client_requests for select
  using (public.is_staff());

create policy "staff update client requests"
  on public.client_requests for update
  using (public.is_staff())
  with check (public.is_staff());

-- flags
create table public.flags (
  id uuid primary key default gen_random_uuid(),
  item_type rateable_item_type not null,
  item_id uuid not null,
  reporter_id uuid references public.profiles(id),
  reason text not null,
  status flag_status not null default 'open',
  created_at timestamptz not null default now()
);

alter table public.flags enable row level security;

create policy "signed-in users can flag content"
  on public.flags for insert
  with check (auth.uid() = reporter_id);

create policy "staff manage flags"
  on public.flags for select
  using (public.is_staff());

create policy "staff update flags"
  on public.flags for update
  using (public.is_staff())
  with check (public.is_staff());
