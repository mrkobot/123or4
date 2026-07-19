import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ListingsBrowser } from "@/components/ListingsBrowser";
import { BestEatsSection } from "@/components/BestEatsSection";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Bi } from "@/components/LanguageProvider";
import { getLanguage } from "@/utils/language";

const LISTING_FIELDS =
  "id, category, title_en, title_zh, body_en, body_zh, translation_source, price, verified, created_at, community_rating, vote_count, staff_rating, photos, city:cities(name)";

const REVIEW_FIELDS =
  "id, body_en, body_zh, editor_rating, community_rating, vote_count, restaurant:restaurants(name_en, name_zh, cuisine_en, cuisine_zh, address, photos), editor:editors(name)";

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

  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select(REVIEW_FIELDS)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);

  const reviews = (reviewsRaw ?? []).map((r) => ({
    ...r,
    restaurant: Array.isArray(r.restaurant) ? r.restaurant[0] ?? null : r.restaurant,
    editor: Array.isArray(r.editor) ? r.editor[0] ?? null : r.editor,
  }));

  const lang = await getLanguage();

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
            <Bi en="Classifieds" zh="分類廣告" />
          </Link>
          <Link href="#best-eats" className="text-sm font-bold text-foreground">
            <Bi en="Best Eats" zh="美食推薦" />
          </Link>
          {user ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm font-bold text-foreground">
                <Bi en="Sign out" zh="登出" />
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-bold text-foreground">
              <Bi en="Sign in" zh="登入" />
            </Link>
          )}
          <LanguageToggle current={lang} />
          <Link
            href="/post"
            className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <Bi en="Post a listing" zh="張貼廣告" />
          </Link>
        </nav>
      </header>

      <div className="w-full max-w-6xl px-8 py-8">
        <h1 className="font-tc text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          本市的<span className="text-coral">分類廣告</span>與<span className="text-coral">美食</span>
        </h1>
        <h1 className="mt-3 text-2xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-3xl">
          Our city&rsquo;s <span className="text-coral">classifieds</span> and
          the <span className="text-coral">best eats</span>
        </h1>

        <form className="mt-8 flex w-full max-w-xl gap-2">
          <input
            type="text"
            placeholder="Search listings, restaurants, neighborhoods / 搜尋分類廣告、餐廳、社區"
            className="flex-1 rounded-full border border-border bg-surface px-5 py-3 text-foreground shadow-[var(--shadow-card)]"
          />
          <button
            type="submit"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-bold text-white"
          >
            <Bi en="Search" zh="搜尋" />
          </button>
        </form>
      </div>

      <div className="w-full max-w-6xl px-8 pb-16">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-2xl font-extrabold text-foreground">
            <Bi en="Latest listings" zh="最新刊登" />
          </h2>
          <Link href="/listings" className="text-sm font-bold text-coral hover:underline">
            <Bi en="See all" zh="查看全部" />
          </Link>
        </div>
        <ListingsBrowser listings={listings ?? []} />
      </div>

      <div id="best-eats" className="flex w-full scroll-mt-6 justify-center">
        <BestEatsSection reviews={reviews} />
      </div>
    </div>
  );
}
