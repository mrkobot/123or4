import { RATE_BG_CLASS, RATE_TEXT_CLASS } from "@/utils/ratings";
import { Bi } from "@/components/LanguageProvider";

// Shield shape (not a circle) so it reads as "certified rating" rather
// than a notification-count badge. Only rendered when a staff/editor
// score actually exists — not every listing gets one.
export function EditorShieldBadge({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div
        className={`flex h-10 w-9 items-center justify-center pt-1 text-lg font-extrabold ${RATE_BG_CLASS[value]} ${RATE_TEXT_CLASS[value]}`}
        style={{ clipPath: "polygon(0 0,100% 0,100% 65%,50% 100%,0 65%)" }}
      >
        {value}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wide text-text-secondary">
        <Bi en="Editor" zh="編輯" />
      </span>
    </div>
  );
}

// Compact dark pill used for the editor score in the two-pill restaurant
// layout (people already expect this pattern from restaurant apps).
export function EditorPill({ value }: { value: number }) {
  return (
    <div className="rounded-lg bg-foreground px-2.5 py-1 text-center text-white">
      <div className="text-[9px] font-bold uppercase tracking-wide opacity-70">
        <Bi en="Editor" zh="編輯" />
      </div>
      <div className="text-base font-extrabold leading-none">{value}</div>
    </div>
  );
}

export function CommunityPill({
  rating,
  voteCount,
}: {
  rating: number | null;
  voteCount: number;
}) {
  if (rating == null) {
    return (
      <div className="rounded-lg bg-surface-muted px-2.5 py-1 text-center text-text-secondary">
        <div className="text-[9px] font-bold uppercase tracking-wide">
          <Bi en="Community" zh="社群" />
        </div>
        <div className="text-xs font-bold leading-none">
          <Bi en="No votes" zh="尚無" />
        </div>
      </div>
    );
  }

  const rounded = Math.round(rating);
  return (
    <div
      className={`rounded-lg px-2.5 py-1 text-center ${RATE_BG_CLASS[rounded]} ${RATE_TEXT_CLASS[rounded]}`}
    >
      <div className="text-[9px] font-bold uppercase tracking-wide opacity-80">
        <Bi en="Community" zh="社群" />
      </div>
      <div className="text-base font-extrabold leading-none">{rounded}</div>
      <div className="mt-0.5 text-[9px] font-bold opacity-80">
        {voteCount} <Bi en="votes" zh="票" />
      </div>
    </div>
  );
}
