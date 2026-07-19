"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

const RATING_LABELS: Record<number, string> = {
  1: "Meh",
  2: "Average",
  3: "Good",
  4: "Excellent",
};

const RATE_STYLES: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-rate-1", text: "text-foreground" },
  2: { bg: "bg-rate-2", text: "text-foreground" },
  3: { bg: "bg-rate-3", text: "text-white" },
  4: { bg: "bg-rate-4", text: "text-white" },
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
  const [myRating, setMyRating] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;
    async function loadMyRating() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("ratings")
        .select("value")
        .eq("item_type", itemType)
        .eq("item_id", itemId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled && data) setMyRating(data.value);
    }
    loadMyRating();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemType, itemId]);

  async function rate(value: number) {
    if (myRating != null) return;
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
    setMyRating(value);
    setPending(false);
    router.refresh();
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      {myRating != null ? (
        <div
          className={`flex w-fit items-center gap-2 rounded-xl px-4 py-2 ${RATE_STYLES[myRating].bg} ${RATE_STYLES[myRating].text}`}
        >
          <span className="text-xl font-extrabold leading-none">
            {myRating}
          </span>
          <span className="text-xs font-bold">
            You rated this {RATING_LABELS[myRating]}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((value) => (
            <button
              key={value}
              type="button"
              disabled={pending}
              onClick={() => rate(value)}
              className={`flex flex-col items-center rounded-xl py-2.5 opacity-80 transition-all hover:opacity-100 disabled:opacity-50 ${RATE_STYLES[value].bg} ${RATE_STYLES[value].text}`}
            >
              <span className="text-xl font-extrabold leading-none">
                {value}
              </span>
              <span className="mt-0.5 text-[11px] font-bold leading-none">
                {RATING_LABELS[value]}
              </span>
            </button>
          ))}
        </div>
      )}
      {communityRating != null ? (
        <span className="text-xs font-bold text-text-secondary">
          Community: {Math.round(communityRating)}{" "}
          {RATING_LABELS[Math.round(communityRating)]} · {voteCount} votes
        </span>
      ) : (
        <span className="text-xs font-bold text-text-secondary">
          No ratings yet
        </span>
      )}
    </div>
  );
}
