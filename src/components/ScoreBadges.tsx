import { RATE_BG_CLASS, RATE_TEXT_CLASS } from "@/utils/ratings";
import { Bi } from "@/components/LanguageProvider";

// Shield shape (not a circle) so it reads as "certified rating" rather
// than a notification-count badge. Only rendered when a staff/editor
// score actually exists — not every listing gets one.
export function EditorShieldBadge({ value }: { value: number }) {
  return (
    <div className="flex flex-col items-end gap-0.5 sm:gap-1">
      <div
        className={`flex h-7 w-6 items-center justify-center pt-0.5 text-sm font-extrabold sm:h-10 sm:w-9 sm:pt-1 sm:text-lg ${RATE_BG_CLASS[value]} ${RATE_TEXT_CLASS[value]}`}
        style={{ clipPath: "polygon(0 0,100% 0,100% 65%,50% 100%,0 65%)" }}
      >
        {value}
      </div>
      <span className="hidden text-[9px] font-bold uppercase tracking-wide text-text-secondary sm:inline">
        <Bi en="Editor" zh="編輯" />
      </span>
    </div>
  );
}

// Compact dark pill used for the editor score in the two-pill restaurant
// layout (people already expect this pattern from restaurant apps).
export function EditorPill({ value }: { value: number }) {
  return (
    <div className="rounded-md bg-foreground px-1.5 py-0.5 text-center text-white sm:rounded-lg sm:px-2.5 sm:py-1">
      <div className="text-[7px] font-bold uppercase tracking-wide opacity-70 sm:text-[9px]">
        <Bi en="Editor" zh="編輯" />
      </div>
      <div className="text-xs font-extrabold leading-none sm:text-base">{value}</div>
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
      <div className="rounded-md bg-surface-muted px-1.5 py-0.5 text-center text-text-secondary sm:rounded-lg sm:px-2.5 sm:py-1">
        <div className="text-[7px] font-bold uppercase tracking-wide sm:text-[9px]">
          <Bi en="Community" zh="社群" />
        </div>
        <div className="text-[10px] font-bold leading-none sm:text-xs">
          <Bi en="No votes" zh="尚無" />
        </div>
      </div>
    );
  }

  const rounded = Math.round(rating);
  return (
    <div
      className={`rounded-md px-1.5 py-0.5 text-center sm:rounded-lg sm:px-2.5 sm:py-1 ${RATE_BG_CLASS[rounded]} ${RATE_TEXT_CLASS[rounded]}`}
    >
      <div className="text-[7px] font-bold uppercase tracking-wide opacity-80 sm:text-[9px]">
        <Bi en="Community" zh="社群" />
      </div>
      <div className="text-xs font-extrabold leading-none sm:text-base">{rounded}</div>
      <div className="mt-0.5 hidden text-[9px] font-bold opacity-80 sm:block">
        {voteCount} <Bi en="votes" zh="票" />
      </div>
    </div>
  );
}
