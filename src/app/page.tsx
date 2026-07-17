import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

const CATEGORIES = [
  { label: "Hiring", className: "text-cat-hiring" },
  { label: "Rentals", className: "text-cat-rentals" },
  { label: "Homes", className: "text-cat-homes" },
  { label: "Cars", className: "text-cat-cars" },
  { label: "Services", className: "text-cat-services" },
  { label: "Best Eats", className: "text-cat-eats" },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col items-center gap-10 p-16">
      <div className="flex w-full max-w-2xl items-center justify-between">
        <div className="text-2xl font-extrabold text-foreground">123or4</div>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-secondary">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-full border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-surface-muted"
              >
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            Sign in
          </Link>
        )}
      </div>

      <div className="flex w-full max-w-2xl flex-col gap-6 rounded-2xl bg-surface p-10 shadow-[var(--shadow-card)]">
        <div>
          <p className="text-sm font-bold text-coral">
            Classifieds and Best Eats for Chinese Americans in Phoenix{" "}
            <span className="font-tc">鳳凰城美國華人分類廣告與美食</span>
          </p>
          <h1 className="mt-2 text-4xl font-extrabold leading-tight tracking-tight text-foreground">
            The community&rsquo;s classifieds, and the best eats in town.
          </h1>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {CATEGORIES.map((c) => (
            <span key={c.label} className={`text-sm font-bold ${c.className}`}>
              {c.label}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <Link
            href="/listings"
            className="rounded-full bg-coral px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            Browse classifieds
          </Link>
          <Link
            href="/post"
            className="rounded-full border border-border px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface-muted"
          >
            Post a listing
          </Link>
        </div>
      </div>
    </div>
  );
}
