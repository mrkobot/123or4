"use client";

import { createContext, useContext } from "react";

type Lang = "en" | "zh";

const LanguageContext = createContext<Lang>("en");

export function LanguageProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

// Renders only the currently active language — the toggle fully
// switches the site's display language rather than showing both at
// once (locked 2026-08-07, supersedes the earlier "always show both"
// rule).
export function Bi({
  en,
  zh,
  className,
  zhClassName,
}: {
  en: string;
  zh: string;
  className?: string;
  zhClassName?: string;
}) {
  const lang = useLanguage();
  return lang === "zh" ? (
    <span className={`font-tc ${zhClassName ?? className ?? ""}`}>{zh}</span>
  ) : (
    <span className={className}>{en}</span>
  );
}

// For headline-scale content (post/restaurant titles): renders only
// the active language's title, falling back to the other language if
// the active one is missing (e.g. translation still pending).
export function TitlePair({
  en,
  zh,
  headClassName,
  subClassName,
}: {
  en: string | null | undefined;
  zh: string | null | undefined;
  headClassName?: string;
  subClassName?: string;
}) {
  const lang = useLanguage();
  const [primary, primaryIsZh, fallback, fallbackIsZh] =
    lang === "zh" ? [zh, true, en, false] : [en, false, zh, true];
  const head = primary || fallback;
  const headIsZh = primary ? primaryIsZh : fallbackIsZh;

  return head ? (
    <h2 className={`${headClassName ?? subClassName ?? ""} ${headIsZh ? "font-tc" : ""}`}>
      {head}
    </h2>
  ) : null;
}
