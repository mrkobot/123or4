"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { RATING_LABELS, RATE_HEX, RATE_BG_CLASS, RATE_TEXT_CLASS } from "@/utils/ratings";
import { Bi } from "@/components/LanguageProvider";

const CONFETTI_DOTS = 5;

function burstConfetti(button: HTMLElement, color: string) {
  for (let i = 0; i < CONFETTI_DOTS; i++) {
    const dot = document.createElement("span");
    dot.className = "rate-confetti-dot";
    dot.style.background = color;
    const angle = (Math.PI * 2 * i) / CONFETTI_DOTS;
    const dist = 32 + Math.random() * 16;
    dot.style.setProperty(
      "--tx",
      `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
    );
    button.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  }

  const ring = document.createElement("span");
  ring.className = "rate-ring";
  ring.style.background = color;
  button.appendChild(ring);
  setTimeout(() => ring.remove(), 550);

  button.classList.add("rate-btn-popping");
  setTimeout(() => button.classList.remove("rate-btn-popping"), 450);
}

// Just the voting mechanism — casting a rating and showing your own
// locked-in choice. The aggregate community score is displayed
// separately via <CommunityPill>, not duplicated here.
export function RatingWidget({
  itemType,
  itemId,
  onVote,
}: {
  itemType: "listing" | "review";
  itemId: string;
  onVote?: (value: number) => void;
}) {
  const [pending, setPending] = useState(false);
  const [myRating, setMyRating] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const btnRefs = useRef<Record<number, HTMLButtonElement | null>>({});

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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const btn = btnRefs.current[value];
    if (btn) burstConfetti(btn, RATE_HEX[value]);
    onVote?.(value);
    setMyRating(value);
    setPending(true);

    await supabase.rpc("cast_rating", {
      p_item_type: itemType,
      p_item_id: itemId,
      p_value: value,
    });
    setPending(false);
    router.refresh();
  }

  if (myRating != null) {
    return (
      <div
        className={`mt-2 flex w-fit items-center gap-2 rounded-xl px-4 py-2 ${RATE_BG_CLASS[myRating]} ${RATE_TEXT_CLASS[myRating]}`}
      >
        <span className="text-xl font-extrabold leading-none">{myRating}</span>
        <span className="text-xs font-bold">
          <Bi en="You rated this" zh="你的評分" />{" "}
          <Bi en={RATING_LABELS[myRating].en} zh={RATING_LABELS[myRating].zh} />
        </span>
      </div>
    );
  }

  return (
    <div className="mt-2 grid grid-cols-4 gap-2">
      {[1, 2, 3, 4].map((value) => (
        <button
          key={value}
          ref={(el) => {
            btnRefs.current[value] = el;
          }}
          type="button"
          disabled={pending}
          onClick={() => rate(value)}
          className={`relative flex flex-col items-center overflow-visible rounded-xl py-2.5 opacity-80 transition-all hover:opacity-100 disabled:opacity-50 ${RATE_BG_CLASS[value]} ${RATE_TEXT_CLASS[value]}`}
        >
          <span className="text-xl font-extrabold leading-none">{value}</span>
          <span className="mt-0.5 text-center text-[10px] font-bold leading-tight">
            {RATING_LABELS[value].en}
            <br />
            <span className="font-tc">{RATING_LABELS[value].zh}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
