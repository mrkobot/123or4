"use client";

import { useMemo, useState } from "react";
import { RatingWidget } from "@/components/RatingWidget";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { PlaceholderPhoto } from "@/components/PlaceholderPhoto";
import { RATING_LABELS } from "@/utils/ratings";
import { Bi, TitlePair } from "@/components/LanguageProvider";

type Review = {
  id: string;
  body_en: string | null;
  body_zh: string | null;
  editor_rating: number;
  community_rating: number | null;
  vote_count: number;
  restaurant: {
    name_en: string;
    name_zh: string;
    cuisine_en: string | null;
    cuisine_zh: string | null;
    address: string | null;
    photos: string[] | null;
  } | null;
  editor: { name: string } | null;
};

function locationOf(address: string | null) {
  return address?.split(",")[0]?.trim() ?? "Phoenix";
}

export function BestEatsSection({ reviews }: { reviews: Review[] }) {
  const [location, setLocation] = useState("all");
  const [query, setQuery] = useState("");

  const locations = useMemo(
    () => Array.from(new Set(reviews.map((r) => locationOf(r.restaurant?.address ?? null)))),
    [reviews],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reviews.filter((r) => {
      const matchesLocation =
        location === "all" || locationOf(r.restaurant?.address ?? null) === location;
      const matchesQuery =
        !q ||
        r.restaurant?.name_en?.toLowerCase().includes(q) ||
        r.restaurant?.name_zh?.includes(q) ||
        r.restaurant?.cuisine_en?.toLowerCase().includes(q) ||
        r.restaurant?.cuisine_zh?.includes(q);
      return matchesLocation && matchesQuery;
    });
  }, [reviews, location, query]);

  if (reviews.length === 0) return null;

  const [featured, ...rest] = filtered.length > 0 ? filtered : reviews;

  return (
    <div className="w-full max-w-6xl px-8 pb-16">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold text-foreground">
          <Bi en="Best Eats" zh="美食推薦" />
        </h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cuisine, dish, restaurant / 搜尋菜系、餐點、餐廳"
          className="w-full max-w-xs rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground shadow-[var(--shadow-card)]"
        />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setLocation("all")}
          className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
            location === "all"
              ? "bg-cat-eats text-white"
              : "bg-surface text-foreground shadow-[var(--shadow-card)] hover:bg-surface-muted"
          }`}
        >
          <Bi en="All areas" zh="全部地區" />
        </button>
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={() => setLocation(loc)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              location === loc
                ? "bg-cat-eats text-white"
                : "bg-surface text-foreground shadow-[var(--shadow-card)] hover:bg-surface-muted"
            }`}
          >
            {loc}
          </button>
        ))}
      </div>

      {featured && (
        <div className="mb-4 flex flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)] md:flex-row">
          {featured.restaurant?.photos && featured.restaurant.photos.length > 0 ? (
            <PhotoCarousel
              photos={featured.restaurant.photos}
              className="h-56 md:h-auto md:w-2/5"
            />
          ) : (
            <PlaceholderPhoto category="eats" className="h-56 md:h-auto md:w-2/5" />
          )}
          <div className="flex-1 p-6">
            <span className="text-xs font-bold uppercase tracking-wide text-cat-eats">
              <Bi en="This week's pick" zh="本週精選" />
            </span>
            <TitlePair
              en={featured.restaurant?.name_en}
              zh={featured.restaurant?.name_zh}
              headClassName="mt-1 text-2xl font-extrabold tracking-tight text-foreground"
              subClassName="text-sm font-bold text-text-secondary"
            />
            <p className="mt-1 text-sm text-text-secondary">
              <Bi
                en={featured.restaurant?.cuisine_en ?? ""}
                zh={featured.restaurant?.cuisine_zh ?? ""}
              />{" "}
              · {featured.restaurant?.address}
            </p>
            {featured.editor && (
              <p className="mt-2 text-xs font-bold text-text-secondary">
                <Bi en="Reviewed by" zh="評論者" /> {featured.editor.name}
              </p>
            )}

            <div className="mt-4">
              <div className="text-[11px] font-bold uppercase tracking-wide text-text-secondary">
                <Bi en="Editor" zh="編輯" />
              </div>
              <div className="text-2xl font-extrabold text-foreground">
                {featured.editor_rating}{" "}
                <span className="text-sm">
                  <Bi
                    en={RATING_LABELS[featured.editor_rating].en}
                    zh={RATING_LABELS[featured.editor_rating].zh}
                  />
                </span>
              </div>
            </div>

            <p className="mt-4 text-foreground/80">{featured.body_en}</p>
            <p className="font-tc mt-2 text-foreground/80">{featured.body_zh}</p>

            <RatingWidget
              itemType="review"
              itemId={featured.id}
              communityRating={featured.community_rating}
              voteCount={featured.vote_count}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {rest.length === 0 && filtered.length === 0 && (
          <p className="text-text-secondary">
            <Bi en="No restaurants match that search." zh="沒有符合搜尋條件的餐廳。" />
          </p>
        )}
        {rest.map((review) => (
          <div
            key={review.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-card)]"
          >
            {review.restaurant?.photos && review.restaurant.photos.length > 0 ? (
              <PhotoCarousel photos={review.restaurant.photos} />
            ) : (
              <PlaceholderPhoto category="eats" />
            )}
            <div className="flex flex-col gap-1 p-5">
              <TitlePair
                en={review.restaurant?.name_en}
                zh={review.restaurant?.name_zh}
                headClassName="text-lg font-extrabold tracking-tight text-foreground"
                subClassName="text-xs font-bold text-text-secondary"
              />
              <p className="text-xs text-text-secondary">
                <Bi
                  en={review.restaurant?.cuisine_en ?? ""}
                  zh={review.restaurant?.cuisine_zh ?? ""}
                />
              </p>
              <div className="mt-1 text-sm font-extrabold text-foreground">
                {review.editor_rating}{" "}
                <span className="text-xs font-bold">
                  <Bi
                    en={RATING_LABELS[review.editor_rating].en}
                    zh={RATING_LABELS[review.editor_rating].zh}
                  />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
