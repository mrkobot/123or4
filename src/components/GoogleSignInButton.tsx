"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { createClient } from "@/utils/supabase/client";

// Uses Google Identity Services directly (rather than an OAuth redirect
// through Supabase's servers) so the consent screen shows this site's own
// domain to the user instead of the raw Supabase project URL.
export function GoogleSignInButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  function handleScriptLoad() {
    if (!window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      callback: async (response) => {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: response.credential,
        });
        if (!error) {
          router.push("/");
          router.refresh();
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 320,
    });
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <div ref={buttonRef} className="flex w-full justify-center" />
    </>
  );
}
