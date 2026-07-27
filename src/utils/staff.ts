import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Every /staff page must call this before rendering anything sensitive —
// RLS also blocks staff-only writes at the DB level, but this stops
// non-staff from even seeing the work queue UI.
export async function requireStaff() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "staff" && profile.role !== "admin")) {
    redirect("/");
  }

  return { supabase, user };
}
