-- Not every listing gets a staff score — it's reserved for premium/paid
-- ongoing listings a poster requests, assigned by staff (Phase 5 staff
-- portal work). Nullable and separate from community_rating so the two
-- never merge, matching the same rule already enforced on reviews.
alter table public.listings
  add column staff_rating smallint check (staff_rating between 1 and 4);
