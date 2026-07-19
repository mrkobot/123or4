"use client";

import { useMemo, useState } from "react";
import { RatingWidget } from "@/components/RatingWidget";

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
  city: { name: string }[] | null;
};

const CATEGORIES = [
  { value: "all", label: "All", text: "text-foreground", border: "border-foreground" },
  { value: "hiring", label: "Hiring", text: "text-cat-hiring", border: "border-cat-hiring" },
  { value: "rentals", label: "Rentals", text: "text-cat-rentals", border: "border-cat-rentals" },
  { value: "homes", label: "Homes", text: "text-cat-homes", border: "border-cat-homes" },
  { value: "cars", label: "Cars", text: "text-cat-cars", border: "border-cat-cars" },
  { value: "services", label: "Services", text: "text-cat-services", border: "border-cat-services" },
];

const CATEGORY_TEXT: Record<string, string> = {
  hiring: "text-cat-hiring",
  rentals: "text-cat-rentals",
  homes: "text-cat-homes",
  cars: "text-cat-cars",
  services: "text-cat-services",
};

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "today";
  return `${days}d ago`;
}

function ListingCard({ listing, delay }: { listing: Listing; delay: number }) {
  const hasBothLanguages = Boolean(listing.title_en && listing.title_zh);
  const [showEnglish, setShowEnglish] = useState(listing.translation_source === "en");

  const title = showEnglish ? listing.title_en : listing.title_zh;
  const body = showEnglish ? listing.body_en : listing.body_zh;
  const fontClass = showEnglish ? "" : "font-tc";

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className="animate-fade-in-up flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      <span
        className={`text-xs font-bold uppercase tracking-wide ${CATEGORY_TEXT[listing.category] ?? "text-foreground"}`}
      >
        {listing.category}
      </span>
      <h2 className={`text-2xl font-extrabold tracking-tight text-foreground ${fontClass}`}>
        {title}
      </h2>
      {listing.price != null && (
        <p className="text-lg font-extrabold text-foreground">
          ${listing.price.toLocaleString()}
          {listing.category === "rentals" && (
            <span className="text-sm font-bold text-text-secondary"> /mo</span>
          )}
        </p>
      )}
      <p className={`text-foreground/80 ${fontClass}`}>{body}</p>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        {listing.verified && (
          <span className="rounded-full bg-foreground px-2.5 py-1 text-[11px] font-bold uppercase text-white">
            Verified
          </span>
        )}
        <span>
          {listing.city?.[0]?.name ?? "Phoenix"} · {relativeTime(listing.created_at)}
        </span>
      </div>

      {hasBothLanguages && (
        <button
          type="button"
          onClick={() => setShowEnglish((v) => !v)}
          className="w-fit text-xs font-bold text-coral hover:underline"
        >
          {showEnglish ? "顯示中文" : "Show in English"}
        </button>
      )}

      <RatingWidget
        itemType="listing"
        itemId={listing.id}
        communityRating={listing.community_rating}
        voteCount={listing.vote_count}
      />
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
                ? "bg-foreground text-white"
                : "bg-surface text-foreground shadow-[var(--shadow-card)] hover:bg-surface-muted"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <p className="text-text-secondary">
            No listings in this category yet — be the first to post.
          </p>
        )}
        {filtered.map((listing, i) => (
          <ListingCard key={listing.id} listing={listing} delay={i * 40} />
        ))}
      </div>
    </div>
  );
}
