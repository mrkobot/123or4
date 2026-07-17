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
  community_rating: number | null;
  vote_count: number;
};

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "hiring", label: "Hiring" },
  { value: "rentals", label: "Rentals" },
  { value: "homes", label: "Homes" },
  { value: "cars", label: "Cars" },
  { value: "services", label: "Services" },
];

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
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex gap-6 border-b border-border">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`-mb-px border-b-2 pb-3 text-sm font-bold transition-colors ${
              category === c.value
                ? "border-coral text-coral"
                : "border-transparent text-foreground/70 hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <p className="text-text-secondary">
            No listings in this category yet — be the first to post.
          </p>
        )}
        {filtered.map((listing, i) => (
          <div
            key={listing.id}
            style={{ animationDelay: `${i * 40}ms` }}
            className="animate-fade-in-up flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <span className="text-xs font-bold uppercase tracking-wide text-coral">
              {listing.category}
            </span>
            <h2 className="text-lg font-bold text-foreground">
              {listing.title_en || listing.title_zh}
            </h2>
            {listing.title_en && listing.title_zh && (
              <p className="font-tc text-sm text-text-secondary">
                {listing.title_zh}
              </p>
            )}
            <p className="text-foreground/80">
              {listing.body_en || listing.body_zh}
            </p>
            <RatingWidget
              itemType="listing"
              itemId={listing.id}
              communityRating={listing.community_rating}
              voteCount={listing.vote_count}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
