import { cookies } from "next/headers";

// The persistent language toggle never hides either language — every
// piece of UI text shows both English and Chinese always (see the
// bilingual UI rule in project memory). The toggle only controls which
// language is ordered first / visually more prominent, via <Bi>.
export async function getLanguage(): Promise<"en" | "zh"> {
  const store = await cookies();
  return store.get("lang")?.value === "zh" ? "zh" : "en";
}
