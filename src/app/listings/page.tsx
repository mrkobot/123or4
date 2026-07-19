import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ListingsBrowser } from "@/components/ListingsBrowser";

const LISTING_FIELDS =
  "id, category, title_en, title_zh, body_en, body_zh, translation_source, price, verified, created_at, community_rating, vote_count, city:cities(name)";

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select(LISTING_FIELDS)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 p-16">
      <div className="flex w-full max-w-6xl items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">
          Classifieds
        </h1>
        <Link
          href="/post"
          className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
        >
          Post a listing
        </Link>
      </div>

      <div className="w-full max-w-6xl">
        <ListingsBrowser listings={listings ?? []} />
      </div>
    </div>
  );
}
