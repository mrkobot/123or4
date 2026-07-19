import { RatingWidget } from "@/components/RatingWidget";

const RATING_LABELS: Record<number, string> = {
  1: "Meh",
  2: "Average",
  3: "Good",
  4: "Excellent",
};

type Review = {
  id: string;
  body_en: string | null;
  body_zh: string | null;
  editor_rating: number;
  community_rating: number | null;
  vote_count: number;
  restaurant: {
    name_en: string;
    name_zh: string;
    cuisine: string | null;
    address: string | null;
  } | null;
  editor: { name: string } | null;
};

export function BestEatsSection({
  reviews,
  heading,
  fontClass,
}: {
  reviews: Review[];
  heading: string;
  fontClass: string;
}) {
  if (reviews.length === 0) return null;

  const [featured, ...rest] = reviews;

  return (
    <div className="w-full max-w-6xl px-8 pb-16">
      <h2 className={`mb-4 text-2xl font-extrabold text-foreground ${fontClass}`}>
        {heading}
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] lg:col-span-1">
          <span className="text-xs font-bold uppercase tracking-wide text-cat-eats">
            This week&rsquo;s pick
          </span>
          <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
            {featured.restaurant?.name_en}
          </h3>
          <h3 className="font-tc text-2xl font-extrabold tracking-tight text-foreground">
            {featured.restaurant?.name_zh}
          </h3>
          <p className="mt-1 text-sm text-text-secondary">
            {featured.restaurant?.cuisine} · {featured.restaurant?.address}
          </p>
          {featured.editor && (
            <p className="mt-2 text-xs font-bold text-text-secondary">
              Reviewed by {featured.editor.name}
            </p>
          )}

          <div className="mt-4 flex gap-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wide text-text-secondary">
                Editor
              </div>
              <div className="text-2xl font-extrabold text-foreground">
                {featured.editor_rating}{" "}
                <span className="text-sm">
                  {RATING_LABELS[featured.editor_rating]}
                </span>
              </div>
            </div>
          </div>

          <p className="mt-4 text-foreground/80">{featured.body_en}</p>
          <p className="font-tc mt-2 text-foreground/80">{featured.body_zh}</p>

          <RatingWidget
            itemType="review"
            itemId={featured.id}
            communityRating={featured.community_rating}
            voteCount={featured.vote_count}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2">
          {rest.map((review) => (
            <div
              key={review.id}
              className="flex flex-col gap-1 rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-card)]"
            >
              <h3 className="text-lg font-extrabold tracking-tight text-foreground">
                {review.restaurant?.name_en}
              </h3>
              <h3 className="font-tc text-lg font-extrabold tracking-tight text-foreground">
                {review.restaurant?.name_zh}
              </h3>
              <p className="text-xs text-text-secondary">
                {review.restaurant?.cuisine}
              </p>
              <div className="mt-1 text-sm font-extrabold text-foreground">
                {review.editor_rating}{" "}
                <span className="text-xs font-bold">
                  {RATING_LABELS[review.editor_rating]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
