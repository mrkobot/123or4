import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ListingsBrowser } from "@/components/ListingsBrowser";

const LISTING_FIELDS =
  "id, category, title_en, title_zh, body_en, body_zh, translation_source, price, verified, created_at, community_rating, vote_count, city:cities(name)";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: listings } = await supabase
    .from("listings")
    .select(LISTING_FIELDS)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(9);

  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="flex w-full max-w-6xl items-center justify-between px-8 py-6">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-foreground">
            123or4.
          </span>
          <span className="text-sm text-text-secondary">
            <span className="font-tc">鳳凰城</span> · Phoenix
          </span>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/listings" className="text-sm font-bold text-foreground">
            Classifieds
          </Link>
          <span className="text-sm font-bold text-foreground/40">
            Best Eats
          </span>
          {user ? (
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm font-bold text-foreground"
              >
                Sign out
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-bold text-foreground">
              Sign in
            </Link>
          )}
          <div className="flex overflow-hidden rounded-full bg-foreground text-xs font-bold text-white">
            <span className="bg-foreground px-3 py-2">EN</span>
            <span className="px-3 py-2 font-tc text-white/50">中文</span>
          </div>
          <Link
            href="/post"
            className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            Post a listing
          </Link>
        </nav>
      </header>

      <div className="w-full max-w-6xl px-8 py-8">
        <h1 className="font-tc text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          本市的<span className="text-coral">分類廣告</span>與<span className="text-coral">最佳美食</span>
        </h1>
        <h1 className="mt-3 text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Our city&rsquo;s <span className="text-coral">classifieds</span> and
          the <span className="text-coral">best eats</span>
        </h1>

        <form className="mt-8 flex w-full max-w-xl gap-2">
          <input
            type="text"
            placeholder="Search listings, restaurants, neighborhoods"
            className="flex-1 rounded-full border border-border bg-surface px-5 py-3 text-foreground shadow-[var(--shadow-card)]"
          />
          <button
            type="submit"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-bold text-white"
          >
            Search
          </button>
        </form>
      </div>

      <div className="w-full max-w-6xl px-8 pb-16">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-extrabold text-foreground">
            Latest listings
          </h2>
          <Link
            href="/listings"
            className="text-sm font-bold text-coral hover:underline"
          >
            See all
          </Link>
        </div>
        <ListingsBrowser listings={listings ?? []} />
      </div>
    </div>
  );
}
