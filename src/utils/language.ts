import { cookies } from "next/headers";

// The persistent language toggle controls UI chrome only (nav, buttons,
// labels) — posted content always shows both languages regardless (§4).
export async function getLanguage(): Promise<"en" | "zh"> {
  const store = await cookies();
  return store.get("lang")?.value === "zh" ? "zh" : "en";
}

export const CHROME = {
  en: {
    classifieds: "Classifieds",
    bestEats: "Best Eats",
    signIn: "Sign in",
    signOut: "Sign out",
    post: "Post a listing",
    latest: "Latest listings",
    seeAll: "See all",
    search: "Search",
    searchPlaceholder: "Search listings, restaurants, neighborhoods",
  },
  zh: {
    classifieds: "分類廣告",
    bestEats: "美食推薦",
    signIn: "登入",
    signOut: "登出",
    post: "張貼廣告",
    latest: "最新刊登",
    seeAll: "查看全部",
    search: "搜尋",
    searchPlaceholder: "搜尋分類廣告、餐廳、社區",
  },
} as const;
