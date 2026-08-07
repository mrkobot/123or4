"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { RATING_LABELS, RATE_HEX, RATE_BG_CLASS, RATE_TEXT_CLASS } from "@/utils/ratings";
import { Bi } from "@/components/LanguageProvider";

const CONFETTI_DOTS = 5;

function burstConfetti(anchor: HTMLElement, color: string) {
  for (let i = 0; i < CONFETTI_DOTS; i++) {
    const dot = document.createElement("span");
    dot.className = "rate-confetti-dot";
    dot.style.background = color;
    const angle = (Math.PI * 2 * i) / CONFETTI_DOTS;
    const dist = 28 + Math.random() * 14;
    dot.style.setProperty(
      "--tx",
      `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px)`,
    );
    anchor.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  }

  const ring = document.createElement("span");
  ring.className = "rate-ring";
  ring.style.background = color;
  anchor.appendChild(ring);
  setTimeout(() => ring.remove(), 550);

  anchor.classList.add("rate-btn-popping");
  setTimeout(() => anchor.classList.remove("rate-btn-popping"), 450);
}

function quartileFromClientX(track: HTMLElement, clientX: number) {
  const rect = track.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  return Math.min(4, Math.max(1, Math.ceil(ratio * 4)));
}

function GradientTrack({
  disabled,
  onCommit,
}: {
  disabled: boolean;
  onCommit: (value: number, thumb: HTMLElement) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  function handleMove(e: React.MouseEvent) {
    if (!trackRef.current) return;
    setHoverValue(quartileFromClientX(trackRef.current, e.clientX));
  }

  function handleClick(e: React.MouseEvent) {
    if (disabled || !trackRef.current || !thumbRef.current) return;
    const value = quartileFromClientX(trackRef.current, e.clientX);
    setHoverValue(value);
    onCommit(value, thumbRef.current);
  }

  const thumbLeft = hoverValue != null ? `${((hoverValue - 0.5) / 4) * 100}%` : null;

  return (
    <div className="mt-2">
      <div
        ref={trackRef}
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverValue(null)}
        onClick={handleClick}
        role="slider"
        aria-label="Rate 1 to 4"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={hoverValue ?? undefined}
        tabIndex={0}
        className={`relative h-3.5 w-full rounded-full ${disabled ? "" : "cursor-pointer"}`}
        style={{
          background:
            "linear-gradient(90deg, var(--rate-1), var(--rate-2), var(--rate-3), var(--rate-4))",
        }}
      >
        {thumbLeft && (
          <div
            ref={thumbRef}
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-[left] duration-150"
            style={{
              left: thumbLeft,
              border: `3px solid ${RATE_HEX[hoverValue as number]}`,
              boxShadow: "0 0 0 1px rgba(20,24,31,0.08)",
            }}
          />
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold text-text-secondary">
        <span>
          <Bi en={RATING_LABELS[1].en} zh={RATING_LABELS[1].zh} />
        </span>
        <span
          className="text-xs font-bold"
          style={{ color: hoverValue != null ? RATE_HEX[hoverValue] : undefined }}
        >
          {hoverValue != null && (
            <Bi en={RATING_LABELS[hoverValue].en} zh={RATING_LABELS[hoverValue].zh} />
          )}
        </span>
        <span>
          <Bi en={RATING_LABELS[4].en} zh={RATING_LABELS[4].zh} />
        </span>
      </div>
    </div>
  );
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
  const [committing, setCommitting] = useState<number | null>(null);
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

  async function rate(value: number, thumb: HTMLElement) {
    if (myRating != null || committing != null) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    burstConfetti(thumb, RATE_HEX[value]);
    onVote?.(value);
    setCommitting(value);
    setPending(true);

    await supabase.rpc("cast_rating", {
      p_item_type: itemType,
      p_item_id: itemId,
      p_value: value,
    });
    setPending(false);

    // Let the confetti/pop animation finish before swapping to the
    // locked "you voted" state, instead of cutting it off mid-play.
    setTimeout(() => {
      setMyRating(value);
      router.refresh();
    }, 550);
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

  return <GradientTrack disabled={pending || committing != null} onCommit={rate} />;
}
