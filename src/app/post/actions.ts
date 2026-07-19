"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { translateText } from "@/utils/translate";

export async function postListing(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const category = formData.get("category") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const sourceLang = formData.get("language") as "en" | "zh";
  let photos: string[] = [];
  try {
    photos = JSON.parse((formData.get("photos") as string) ?? "[]");
  } catch {
    photos = [];
  }

  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "phoenix")
    .single();

  if (!city) {
    redirect("/post?error=City not found");
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      city_id: city.id,
      user_id: user.id,
      category,
      translation_source: sourceLang,
      machine_translated: true,
      status: "active",
      photos,
      [sourceLang === "en" ? "title_en" : "title_zh"]: title,
      [sourceLang === "en" ? "body_en" : "body_zh"]: body,
    })
    .select("id")
    .single();

  if (error || !listing) {
    redirect(`/post?error=${encodeURIComponent(error?.message ?? "Could not post listing")}`);
  }

  // Post goes live immediately in the source language; the other-language
  // version fills in right after via the translation API (§4, §15).
  try {
    const translatedTitle = await translateText(title, sourceLang);
    const translatedBody = await translateText(body, sourceLang);
    const targetLang = sourceLang === "en" ? "zh" : "en";

    const admin = createAdminClient();
    await admin
      .from("listings")
      .update({
        [targetLang === "en" ? "title_en" : "title_zh"]: translatedTitle,
        [targetLang === "en" ? "body_en" : "body_zh"]: translatedBody,
      })
      .eq("id", listing.id);
  } catch {
    // Listing is already live in the source language; a failed
    // translation shouldn't block the post, just leave the other
    // language blank for now.
  }

  redirect("/listings");
}
