// The locked bilingual rating words from the product spec (§3) — sincere
// set. Stored centrally so every component uses the exact same wording.
export const RATING_LABELS: Record<number, { en: string; zh: string }> = {
  1: { en: "Meh", zh: "普普" },
  2: { en: "Average", zh: "還行" },
  3: { en: "Good", zh: "不錯" },
  4: { en: "Excellent", zh: "一流" },
};
