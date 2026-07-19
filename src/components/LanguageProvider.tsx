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
