-- Cuisine was a single English-only field; split into bilingual columns
-- matching the pattern used everywhere else (name_en/name_zh, etc).
alter table public.restaurants rename column cuisine to cuisine_en;
alter table public.restaurants add column cuisine_zh text;
