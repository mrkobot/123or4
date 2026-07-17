"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const RATING_LABELS: Record<number, string> = {
  1: "Meh",
  2: "Average",
  3: "Good",
  4: "Excellent",
};

export function RatingWidget({
  itemType,
  itemId,
  communityRating,
  voteCount,
}: {
  itemType: "listing" | "review";
  itemId: string;
  communityRating: number | null;
  voteCount: number;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function rate(value: number) {
    setPending(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    await supabase.rpc("cast_rating", {
      p_item_type: itemType,
      p_item_id: itemId,
      p_value: value,
    });
    setPending(false);
    router.refresh();
  }

  return (
    <div className="mt-1 flex items-center gap-4">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((value) => (
          <button
            key={value}
            type="button"
            disabled={pending}
            onClick={() => rate(value)}
            title={RATING_LABELS[value]}
            className="h-8 w-8 rounded-full bg-surface-muted text-sm font-bold text-foreground transition-all hover:bg-coral hover:text-white disabled:opacity-50"
          >
            {value}
          </button>
        ))}
      </div>
      {communityRating != null ? (
        <span className="flex items-baseline gap-1.5 font-extrabold text-coral">
          <span className="text-xl">{Math.round(communityRating)}</span>
          <span className="text-xs font-bold">
            {RATING_LABELS[Math.round(communityRating)]} · {voteCount} votes
          </span>
        </span>
      ) : (
        <span className="text-xs font-bold text-text-secondary">
          No ratings yet
        </span>
      )}
    </div>
  );
}
