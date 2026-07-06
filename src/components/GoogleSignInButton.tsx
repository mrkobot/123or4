"use client";

import { createClient } from "@/utils/supabase/client";

export function GoogleSignInButton() {
  const supabase = createClient();

  async function handleClick() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full rounded-full border border-solid border-black/[.15] px-5 py-3 text-base font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.2] dark:hover:bg-white/[.08]"
    >
      Continue with Google
    </button>
  );
}
