"use server";

import { redirect } from "next/navigation";
import { requireStaff } from "@/utils/staff";

export async function addEditor(formData: FormData) {
  const { supabase } = await requireStaff();

  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "phoenix")
    .single();

  if (!city) {
    redirect("/staff/editors?error=City not found");
  }

  const { error } = await supabase.from("editors").insert({
    city_id: city.id,
    name: formData.get("name") as string,
    photo_url: (formData.get("photo_url") as string) || null,
    bio_en: formData.get("bio_en") as string,
    bio_zh: formData.get("bio_zh") as string,
  });

  if (error) {
    redirect(`/staff/editors?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/staff/editors");
}
