-- Switch community rating aggregation from mean to mode. Averaging a
-- 1-4 discrete scale can land on a value nobody actually voted for
-- (e.g. votes of 2,2,2,4 average to 2.5); mode shows the value most
-- voters actually picked. Ties break toward the higher (more positive)
-- value.
create or replace function public.cast_rating(
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
          select value from public.ratings
          where item_type = 'listing' and item_id = p_item_id
          group by value
          order by count(*) desc, value desc
          limit 1
        ),
        vote_count = (
          select count(*) from public.ratings
          where item_type = 'listing' and item_id = p_item_id
        )
    where id = p_item_id;
  elsif p_item_type = 'review' then
    update public.reviews
    set community_rating = (
          select value from public.ratings
          where item_type = 'review' and item_id = p_item_id
          group by value
          order by count(*) desc, value desc
          limit 1
        ),
        vote_count = (
          select count(*) from public.ratings
          where item_type = 'review' and item_id = p_item_id
        )
    where id = p_item_id;
  end if;
end;
$$ language plpgsql security definer set search_path = public;

-- Track when a client request has been turned into a draft listing, so
-- staff don't accidentally convert the same request twice.
alter table public.client_requests
  add column converted_listing_id uuid references public.listings(id);

-- Staff need to be able to insert listings on a requester's behalf (the
-- request itself is submitted anonymously, so there's no user_id to
-- attribute the listing to). The existing insert policy only allows a
-- signed-in user to post as themselves.
create policy "staff insert listings"
  on public.listings for insert
  with check (public.is_staff());
