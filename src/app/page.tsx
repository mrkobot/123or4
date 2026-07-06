import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { translateText } from "@/utils/translate";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: cities, error } = await supabase
    .from("cities")
    .select("name, slug, active");

  const sample = "The community's classifieds, and the best eats in town.";
  let translation: string | null = null;
  let translationError: string | null = null;
  try {
    translation = await translateText(sample, "en");
  } catch (err) {
    translationError = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-16 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        123or4 — database connectivity check
      </h1>

      {user ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-lg text-zinc-700 dark:text-zinc-300">
            Signed in as {user.email}
          </p>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded-full border border-solid border-black/[.15] px-5 py-2 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.08]"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : (
        <Link
          href="/login"
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Sign in
        </Link>
      )}

      {error && (
        <p className="text-red-600">Error reaching Supabase: {error.message}</p>
      )}
      {cities && (
        <ul className="text-lg text-zinc-700 dark:text-zinc-300">
          {cities.map((city) => (
            <li key={city.slug}>
              {city.name} — {city.active ? "active" : "inactive"}
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-8 text-2xl font-semibold text-black dark:text-zinc-50">
        Translation check
      </h2>
      <p className="text-lg text-zinc-700 dark:text-zinc-300">{sample}</p>
      {translationError && (
        <p className="text-red-600">
          Error reaching Anthropic: {translationError}
        </p>
      )}
      {translation && (
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          {translation}
        </p>
      )}
    </div>
  );
}
