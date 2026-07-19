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

// Renders both languages together, ordered so the current toggle
// language appears first/more prominent — never hides either one.
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
  const enSpan = (
    <span key="en" className={className}>
      {en}
    </span>
  );
  const zhSpan = (
    <span key="zh" className={`font-tc ${zhClassName ?? className ?? ""}`}>
      {zh}
    </span>
  );
  return lang === "zh" ? (
    <>
      {zhSpan} {enSpan}
    </>
  ) : (
    <>
      {enSpan} {zhSpan}
    </>
  );
}

// For headline-scale content (post/restaurant titles): the toggle
// language renders as the prominent headline, the other language as a
// smaller subhead directly below — never hidden, just de-emphasized.
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
  const [head, headIsZh, sub, subIsZh] =
    lang === "zh" ? [zh, true, en, false] : [en, false, zh, true];

  return (
    <>
      {head && (
        <h2 className={`${headClassName ?? ""} ${headIsZh ? "font-tc" : ""}`}>
          {head}
        </h2>
      )}
      {sub && (
        <p className={`${subClassName ?? ""} ${subIsZh ? "font-tc" : ""}`}>
          {sub}
        </p>
      )}
    </>
  );
}
