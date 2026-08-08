import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ListingsBrowser } from "@/components/ListingsBrowser";
import { SiteHeader } from "@/components/SiteHeader";
import { Bi } from "@/components/LanguageProvider";
import { getLanguage } from "@/utils/language";

const LISTING_FIELDS =
  "id, category, title_en, title_zh, body_en, body_zh, translation_source, price, verified, created_at, community_rating, vote_count, staff_rating, photos, city:cities(name)";

export default async function ListingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: listings } = await supabase
    .from("listings")
    .select(LISTING_FIELDS)
    .eq("status", "active")
    .order("created_at", { ascending: false });
  const lang = await getLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center">
      <SiteHeader lang={lang} signedIn={!!user} />

      <div className="flex w-full max-w-6xl flex-col gap-8 px-5 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-foreground">
            <Bi en="Classifieds" zh="分類廣告" />
          </h1>
          <Link
            href="/post"
            className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <Bi en="Post a listing" zh="張貼廣告" />
          </Link>
        </div>

        <ListingsBrowser listings={listings ?? []} />
      </div>
    </div>
  );
}
