"use client";

import { useMemo, useState } from "react";
import { RatingWidget } from "@/components/RatingWidget";
import { PhotoCarousel } from "@/components/PhotoCarousel";
import { PlaceholderPhoto } from "@/components/PlaceholderPhoto";
import { Bi, TitlePair, useLanguage } from "@/components/LanguageProvider";
import { RATE_HEX } from "@/utils/ratings";
import { EditorShieldBadge, CommunityPill } from "@/components/ScoreBadges";

type Listing = {
  id: string;
  category: string;
  title_en: string | null;
  title_zh: string | null;
  body_en: string | null;
  body_zh: string | null;
  translation_source: "en" | "zh";
  price: number | null;
  verified: boolean;
  created_at: string;
  community_rating: number | null;
  vote_count: number;
  staff_rating: number | null;
  photos: string[] | null;
  city: { name: string }[] | null;
};

const CATEGORIES = [
  { value: "all", en: "All", zh: "全部", bg: "bg-foreground" },
  { value: "hiring", en: "Hiring", zh: "徵才", bg: "bg-cat-hiring" },
  { value: "rentals", en: "Rentals", zh: "租屋", bg: "bg-cat-rentals" },
  { value: "homes", en: "Homes", zh: "房屋", bg: "bg-cat-homes" },
  { value: "cars", en: "Cars", zh: "汽車", bg: "bg-cat-cars" },
  { value: "services", en: "Services", zh: "服務", bg: "bg-cat-services" },
];

const CATEGORY_TEXT: Record<string, string> = {
  hiring: "text-cat-hiring",
  rentals: "text-cat-rentals",
  homes: "text-cat-homes",
  cars: "text-cat-cars",
  services: "text-cat-services",
};

function relativeTime(iso: string, lang: "en" | "zh") {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return lang === "zh" ? "剛剛" : "just now";
  if (hours < 24) return lang === "zh" ? `${hours}小時前` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return lang === "zh" ? "今天" : "today";
  return lang === "zh" ? `${days}天前` : `${days}d ago`;
}

function ListingCard({ listing, delay }: { listing: Listing; delay: number }) {
  const cat = CATEGORIES.find((c) => c.value === listing.category);
  const [flashRate, setFlashRate] = useState<number | null>(null);
  const lang = useLanguage();
  const body = lang === "zh" ? (listing.body_zh ?? listing.body_en) : (listing.body_en ?? listing.body_zh);
  const bodyIsZh = lang === "zh" ? !!listing.body_zh : !listing.body_en && !!listing.body_zh;

  function handleVote(value: number) {
    setFlashRate(value);
    setTimeout(() => setFlashRate(null), 1400);
  }

  return (
    <div
      style={{
        animationDelay: `${delay}ms`,
        borderColor: flashRate ? RATE_HEX[flashRate] : undefined,
        transition: "border-color 400ms ease",
      }}
      className="animate-fade-in-up flex flex-col overflow-hidden rounded-2xl border-2 border-transparent bg-surface shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      {listing.photos && listing.photos.length > 0 ? (
        <PhotoCarousel photos={listing.photos} />
      ) : (
        <PlaceholderPhoto category={listing.category} />
      )}

      <div className="flex flex-col gap-1.5 p-3 sm:gap-2 sm:p-6">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <span
            className={`w-fit rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:px-2.5 sm:py-1 sm:text-[11px] ${CATEGORY_TEXT[listing.category] ?? "text-white"}`}
          >
            {cat ? <Bi en={cat.en} zh={cat.zh} /> : listing.category}
          </span>
          <div className="flex shrink-0 flex-col items-end gap-1 sm:gap-1.5">
            {listing.staff_rating != null && (
              <EditorShieldBadge value={listing.staff_rating} />
            )}
            <CommunityPill
              rating={listing.community_rating}
              voteCount={listing.vote_count}
            />
          </div>
        </div>
        <TitlePair
          en={listing.title_en}
          zh={listing.title_zh}
          headClassName="text-sm font-extrabold tracking-tight text-foreground sm:text-2xl"
        />
        {listing.price != null && (
          <p className="text-sm font-extrabold text-foreground sm:text-lg">
            ${listing.price.toLocaleString()}
            {listing.category === "rentals" && (
              <span className="text-xs font-bold text-text-secondary sm:text-sm">
                {" "}
                /<Bi en="mo" zh="月" />
              </span>
            )}
          </p>
        )}
        {body && (
          <p className={`line-clamp-2 text-xs text-foreground/80 sm:text-base ${bodyIsZh ? "font-tc" : ""}`}>
            {body}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-[10px] text-text-secondary sm:gap-2 sm:text-xs">
          {listing.verified && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-[9px] font-bold uppercase text-white sm:px-2.5 sm:py-1 sm:text-[11px]">
              <Bi en="Verified" zh="已驗證" />
            </span>
          )}
          <span>
            {lang === "zh" && (listing.city?.[0]?.name ?? "Phoenix") === "Phoenix"
              ? "鳳凰城"
              : (listing.city?.[0]?.name ?? "Phoenix")}{" "}
            · {relativeTime(listing.created_at, lang)}
          </span>
        </div>

        <RatingWidget
          itemType="listing"
          itemId={listing.id}
          onVote={handleVote}
        />
      </div>
    </div>
  );
}

export function ListingsBrowser({ listings }: { listings: Listing[] }) {
  const [category, setCategory] = useState("all");

  const filtered = useMemo(
    () =>
      category === "all"
        ? listings
        : listings.filter((l) => l.category === category),
    [listings, category],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              category === c.value
                ? `${c.bg} text-white`
                : "bg-surface text-foreground shadow-[var(--shadow-card)] hover:bg-surface-muted"
            }`}
          >
            <Bi en={c.en} zh={c.zh} />
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="col-span-2 text-text-secondary lg:col-span-3">
            <Bi
              en="No listings in this category yet — be the first to post."
              zh="此分類尚無刊登——成為第一個張貼的人。"
            />
          </p>
        )}
        {filtered.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} delay={i * 40} />
        ))}
      </div>
    </div>
  );
}
