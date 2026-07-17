import { createClient } from "@supabase/supabase-js";

// Service-role client for trusted, automated server-side operations only
// (writing back machine translations, auto-expiring listings, etc).
// Bypasses RLS entirely — never expose this client or its key to the
// browser, and never use it to act on a user's behalf.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
