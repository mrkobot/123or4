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
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((value) => (
          <button
            key={value}
            type="button"
            disabled={pending}
            onClick={() => rate(value)}
            title={RATING_LABELS[value]}
            className="h-8 w-8 rounded-full border border-black/[.15] text-sm font-medium transition-colors hover:bg-black/[.06] disabled:opacity-50 dark:border-white/[.2] dark:hover:bg-white/[.1]"
          >
            {value}
          </button>
        ))}
      </div>
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        {communityRating != null
          ? `${RATING_LABELS[Math.round(communityRating)]} (${voteCount} votes)`
          : "No ratings yet"}
      </span>
    </div>
  );
}
