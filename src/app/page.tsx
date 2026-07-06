import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: cities, error } = await supabase
    .from("cities")
    .select("name, slug, active");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-16 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        123or4 — database connectivity check
      </h1>
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
    </div>
  );
}
