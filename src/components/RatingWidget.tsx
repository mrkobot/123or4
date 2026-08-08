"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { RATING_LABELS, RATE_HEX } from "@/utils/ratings";
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

// The "Vote" pill is the thumb — there's no separate instructional text
// above the track. At rest it just reads "Vote"; dragging relabels it
// live with the rate word; once cast, it stays parked on a dimmed track
// as the permanent "you rated this" marker instead of swapping to a
// different component.
function VoteTrack({
  lockedValue,
  disabled,
  onCommit,
}: {
  lockedValue: number | null;
  disabled: boolean;
  onCommit: (value: number, pill: HTMLElement) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const locked = lockedValue != null;

  function handlePointerDown(e: React.PointerEvent) {
    if (locked || disabled || !trackRef.current) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setHoverValue(quartileFromClientX(trackRef.current, e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (locked || disabled || !trackRef.current) return;
    if (e.pointerType !== "mouse" && !dragging) return;
    setHoverValue(quartileFromClientX(trackRef.current, e.clientX));
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragging || locked || disabled || !trackRef.current || !pillRef.current) return;
    setDragging(false);
    const value = quartileFromClientX(trackRef.current, e.clientX);
    setHoverValue(value);
    onCommit(value, pillRef.current);
  }

  function handlePointerLeave() {
    if (!dragging) setHoverValue(null);
  }

  const activeValue = lockedValue ?? hoverValue;
  const pillLeft = activeValue != null ? `${((activeValue - 0.5) / 4) * 100}%` : "50%";
  const pillColor = activeValue != null ? RATE_HEX[activeValue] : "var(--text-secondary)";

  return (
    <div className="mt-2">
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        role="slider"
        aria-label="Rate 1 to 4"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={activeValue ?? undefined}
        aria-disabled={locked || disabled}
        tabIndex={locked ? -1 : 0}
        className={`relative h-2.5 w-full rounded-full transition-opacity ${locked ? "opacity-40" : disabled ? "" : "cursor-pointer"}`}
        style={{
          background:
            "linear-gradient(90deg, var(--rate-1), var(--rate-2), var(--rate-3), var(--rate-4))",
          touchAction: "none",
        }}
      >
        <div
          ref={pillRef}
          className="absolute top-1/2 flex h-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center whitespace-nowrap rounded-full bg-surface px-3.5 text-xs font-bold"
          style={{
            left: pillLeft,
            border: `2px solid ${pillColor}`,
            color: activeValue != null ? pillColor : "var(--text-secondary)",
            background: locked && activeValue != null ? pillColor : undefined,
            boxShadow: "0 2px 6px rgba(20,24,31,0.15)",
          }}
        >
          {activeValue == null ? (
            <Bi en="Vote" zh="投票" />
          ) : (
            <span style={{ color: locked ? "white" : pillColor }} className="flex items-center gap-1">
              {activeValue}
              <span className="opacity-80">·</span>
              <Bi en={RATING_LABELS[activeValue].en} zh={RATING_LABELS[activeValue].zh} />
            </span>
          )}
        </div>
      </div>
      {!locked && (
        <div className="mt-1.5 flex items-center justify-between text-[10px] font-bold text-text-secondary">
          <span>
            <Bi en={RATING_LABELS[1].en} zh={RATING_LABELS[1].zh} />
          </span>
          <span>
            <Bi en={RATING_LABELS[4].en} zh={RATING_LABELS[4].zh} />
          </span>
        </div>
      )}
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

  async function rate(value: number, pill: HTMLElement) {
    if (myRating != null || pending) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Lock the pill in place immediately (optimistic) so the confetti
    // bursts right where it lands, instead of waiting on the network
    // round-trip before the UI settles.
    setMyRating(value);
    setPending(true);
    burstConfetti(pill, RATE_HEX[value]);
    onVote?.(value);

    await supabase.rpc("cast_rating", {
      p_item_type: itemType,
      p_item_id: itemId,
      p_value: value,
    });
    setPending(false);
    router.refresh();
  }

  return <VoteTrack lockedValue={myRating} disabled={pending} onCommit={rate} />;
}
