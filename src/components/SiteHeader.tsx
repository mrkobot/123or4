"use client";

import { useState } from "react";
import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Bi } from "@/components/LanguageProvider";

export function SiteHeader({
  lang,
  signedIn,
}: {
  lang: "en" | "zh";
  signedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full bg-page-tint/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-foreground sm:text-2xl">123or4.</span>
          <span className="hidden text-sm text-text-secondary sm:inline">
            <span className="font-tc">鳳凰城</span> · Phoenix
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/listings" className="text-sm font-bold text-foreground">
            <Bi en="Classifieds" zh="分類廣告" />
          </Link>
          <Link href="#best-eats" className="text-sm font-bold text-foreground">
            <Bi en="Best Eats" zh="美食推薦" />
          </Link>
          {signedIn ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-sm font-bold text-foreground">
                <Bi en="Sign out" zh="登出" />
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-bold text-foreground">
              <Bi en="Sign in" zh="登入" />
            </Link>
          )}
          <LanguageToggle current={lang} />
          <Link
            href="/post"
            className="rounded-full bg-coral px-5 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            <Bi en="Post a listing" zh="張貼廣告" />
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle current={lang} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-foreground"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-page-tint px-5 pb-4 md:hidden">
          <Link
            href="/listings"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-3 text-sm font-bold text-foreground"
          >
            <Bi en="Classifieds" zh="分類廣告" />
          </Link>
          <Link
            href="#best-eats"
            onClick={() => setOpen(false)}
            className="rounded-lg px-2 py-3 text-sm font-bold text-foreground"
          >
            <Bi en="Best Eats" zh="美食推薦" />
          </Link>
          {signedIn ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="w-full rounded-lg px-2 py-3 text-left text-sm font-bold text-foreground">
                <Bi en="Sign out" zh="登出" />
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-3 text-sm font-bold text-foreground"
            >
              <Bi en="Sign in" zh="登入" />
            </Link>
          )}
          <Link
            href="/post"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-coral px-5 py-3 text-center text-sm font-bold text-white shadow-[var(--shadow-card)]"
          >
            <Bi en="Post a listing" zh="張貼廣告" />
          </Link>
        </nav>
      )}
    </header>
  );
}
