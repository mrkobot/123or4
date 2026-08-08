import { cookies } from "next/headers";

// The persistent language toggle fully switches the site's display
// language (locked 2026-08-07) — see the bilingual UI rule in project
// memory for the earlier "always show both" behavior this replaced.
export async function getLanguage(): Promise<"en" | "zh"> {
  const store = await cookies();
  return store.get("lang")?.value === "zh" ? "zh" : "en";
}

// For raw strings outside <Bi> (placeholders, attributes) in server
// components that already have `lang` from getLanguage().
export function pick(lang: "en" | "zh", en: string, zh: string) {
  return lang === "zh" ? zh : en;
}
