"use server";

import Papa from "papaparse";
import { redirect } from "next/navigation";
import { requireStaff } from "@/utils/staff";

type Row = {
  name_en: string;
  name_zh: string;
  cuisine_en: string;
  cuisine_zh: string;
  address: string;
  hours: string;
  editor_name: string;
  editor_rating: string;
  review_en: string;
  review_zh: string;
  verified: string;
  photo_urls: string;
};

export async function importRestaurantsCsv(formData: FormData) {
  const { supabase } = await requireStaff();

  const file = formData.get("csv") as File;
  if (!file || file.size === 0) {
    redirect("/staff/restaurants/import?error=No file selected");
  }

  const text = await file.text();
  const parsed = Papa.parse<Row>(text, { header: true, skipEmptyLines: true });

  if (parsed.errors.length > 0) {
    redirect(
      `/staff/restaurants/import?error=${encodeURIComponent(parsed.errors[0].message)}`,
    );
  }

  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "phoenix")
    .single();
  if (!city) {
    redirect("/staff/restaurants/import?error=City not found");
  }

  const editorCache = new Map<string, string>();
  let created = 0;
  const failures: string[] = [];

  for (const row of parsed.data) {
    if (!row.name_en?.trim()) continue;

    let editorId = editorCache.get(row.editor_name);
    if (!editorId) {
      const { data: existing } = await supabase
        .from("editors")
        .select("id")
        .eq("name", row.editor_name)
        .maybeSingle();
      if (existing) {
        editorId = existing.id;
      } else {
        const { data: newEditor, error: editorError } = await supabase
          .from("editors")
          .insert({ city_id: city.id, name: row.editor_name })
          .select("id")
          .single();
        if (editorError || !newEditor) {
          failures.push(`${row.name_en}: could not create editor "${row.editor_name}"`);
          continue;
        }
        editorId = newEditor.id;
      }
      editorCache.set(row.editor_name, editorId as string);
    }

    const photos = (row.photo_urls || "")
      .split(";")
      .map((u) => u.trim())
      .filter(Boolean);

    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .insert({
        city_id: city.id,
        name_en: row.name_en,
        name_zh: row.name_zh,
        cuisine_en: row.cuisine_en,
        cuisine_zh: row.cuisine_zh,
        address: row.address,
        hours: row.hours,
        verified: row.verified?.trim().toLowerCase() === "yes",
        photos,
      })
      .select("id")
      .single();

    if (restaurantError || !restaurant) {
      failures.push(`${row.name_en}: ${restaurantError?.message ?? "insert failed"}`);
      continue;
    }

    const rating = Number(row.editor_rating);
    const { error: reviewError } = await supabase.from("reviews").insert({
      restaurant_id: restaurant.id,
      editor_id: editorId,
      body_en: row.review_en,
      body_zh: row.review_zh,
      body_zh_human_edited: true,
      editor_rating: Number.isFinite(rating) ? rating : 3,
      status: "published",
    });

    if (reviewError) {
      failures.push(`${row.name_en}: ${reviewError.message}`);
      continue;
    }

    created++;
  }

  const summary = `created=${created}&failed=${failures.length}${
    failures.length > 0 ? `&errors=${encodeURIComponent(failures.slice(0, 5).join(" | "))}` : ""
  }`;
  redirect(`/staff/restaurants/import?${summary}`);
}
