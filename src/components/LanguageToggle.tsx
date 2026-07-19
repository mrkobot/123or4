"use client";

import { useRouter } from "next/navigation";
import { setLanguage } from "@/app/actions/language";

export function LanguageToggle({ current }: { current: "en" | "zh" }) {
  const router = useRouter();

  async function handle(lang: "en" | "zh") {
    await setLanguage(lang);
    router.refresh();
  }

  return (
    <div className="flex overflow-hidden rounded-full bg-foreground text-xs font-bold">
      <button
        type="button"
        onClick={() => handle("en")}
        className={`px-3 py-2 ${current === "en" ? "text-white" : "text-white/50"}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handle("zh")}
        className={`font-tc px-3 py-2 ${current === "zh" ? "text-white" : "text-white/50"}`}
      >
        中文
      </button>
    </div>
  );
}
