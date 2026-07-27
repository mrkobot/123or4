"use server";

import { redirect } from "next/navigation";
import { requireStaff } from "@/utils/staff";

export async function addRestaurant(formData: FormData) {
  const { supabase } = await requireStaff();

  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "phoenix")
    .single();

  if (!city) {
    redirect("/staff/restaurants/new?error=City not found");
  }

  let photos: string[] = [];
  try {
    photos = JSON.parse(formData.get("photos") as string) || [];
  } catch {
    photos = [];
  }

  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .insert({
      city_id: city.id,
      name_en: formData.get("name_en") as string,
      name_zh: formData.get("name_zh") as string,
      cuisine_en: formData.get("cuisine_en") as string,
      cuisine_zh: formData.get("cuisine_zh") as string,
      address: formData.get("address") as string,
      hours: formData.get("hours") as string,
      verified: formData.get("verified") === "on",
      photos,
    })
    .select("id")
    .single();

  if (restaurantError || !restaurant) {
    redirect(
      `/staff/restaurants/new?error=${encodeURIComponent(restaurantError?.message ?? "Could not create restaurant")}`,
    );
  }

  const { error: reviewError } = await supabase.from("reviews").insert({
    restaurant_id: restaurant.id,
    editor_id: formData.get("editor_id") as string,
    body_en: formData.get("body_en") as string,
    body_zh: formData.get("body_zh") as string,
    body_zh_human_edited: true,
    editor_rating: Number(formData.get("editor_rating")),
    status: "published",
  });

  if (reviewError) {
    redirect(`/staff/restaurants/new?error=${encodeURIComponent(reviewError.message)}`);
  }

  redirect("/staff?added=restaurant");
}
