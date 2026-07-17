import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { RatingWidget } from "@/components/RatingWidget";

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id, category, title_en, title_zh, body_en, body_zh, community_rating, vote_count",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 p-16 font-sans dark:bg-black">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Classifieds
        </h1>
        <Link
          href="/post"
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Post a listing
        </Link>
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-4">
        {listings?.length === 0 && (
          <p className="text-zinc-600 dark:text-zinc-400">
            No listings yet — be the first to post.
          </p>
        )}
        {listings?.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-col gap-2 rounded-lg border border-black/[.1] bg-white p-5 dark:border-white/[.1] dark:bg-zinc-950"
          >
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              {listing.category}
            </span>
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              {listing.title_en || listing.title_zh}
            </h2>
            {listing.title_en && listing.title_zh && (
              <p className="text-sm text-zinc-500">{listing.title_zh}</p>
            )}
            <p className="text-zinc-700 dark:text-zinc-300">
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
