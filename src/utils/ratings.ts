// The locked bilingual rating words from the product spec (§3) — sincere
// set. Stored centrally so every component uses the exact same wording.
export const RATING_LABELS: Record<number, { en: string; zh: string }> = {
  1: { en: "Meh", zh: "普普" },
  2: { en: "Average", zh: "還行" },
  3: { en: "Good", zh: "不錯" },
  4: { en: "Excellent", zh: "一流" },
};

// Matches the --rate-1..4 CSS variables in globals.css — kept as literal
// hex here too since inline border-color flashes are set from JS.
export const RATE_HEX: Record<number, string> = {
  1: "#dc6b4c",
  2: "#d2a23e",
  3: "#6fa05c",
  4: "#0f766e",
};
