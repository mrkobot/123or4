"use client";

import { useRouter } from "next/navigation";
import { setLanguage } from "@/app/actions/language";

export function LanguageToggle({ current }: { current: "en" | "zh" }) {
  const router = useRouter();

  async function handle(lang: "en" | "zh") {
    if (lang === current) return;
    await setLanguage(lang);
    router.refresh();
  }

  return (
    <div
      role="group"
      aria-label="Site language"
      className="relative flex rounded-full bg-surface-muted p-0.5 text-xs font-bold shadow-[var(--shadow-card)]"
    >
      <div
        className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full bg-coral transition-transform duration-200 ease-out"
        style={{ transform: current === "zh" ? "translateX(calc(100% + 4px))" : "translateX(0)" }}
      />
      <button
        type="button"
        onClick={() => handle("en")}
        aria-pressed={current === "en"}
        className={`relative z-10 px-3.5 py-2 transition-colors ${current === "en" ? "text-white" : "text-text-secondary"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handle("zh")}
        aria-pressed={current === "zh"}
        className={`font-tc relative z-10 px-3.5 py-2 transition-colors ${current === "zh" ? "text-white" : "text-text-secondary"}`}
      >
        中文
      </button>
    </div>
  );
}
