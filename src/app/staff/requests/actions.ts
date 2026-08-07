"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireStaff } from "@/utils/staff";

export async function approveRequest(id: string) {
  const { supabase } = await requireStaff();
  await supabase.from("client_requests").update({ status: "approved" }).eq("id", id);
  revalidatePath("/staff/requests");
}

// Turns a client request into a draft listing (status "pending", not
// publicly visible yet) pre-filled from the request's free-text fields,
// then hands off to the listings edit form to fill in category/price/
// photos before publishing. There's no user_id to attribute the listing
// to since requests are submitted anonymously — it's left unowned and
// staff-managed like any other draft.
export async function convertRequestToListing(id: string) {
  const { supabase } = await requireStaff();

  const { data: request } = await supabase
    .from("client_requests")
    .select("business_name, requested_action, converted_listing_id")
    .eq("id", id)
    .single();

  if (!request || request.converted_listing_id) {
    redirect("/staff/requests?error=Request already converted or not found");
  }

  const { data: city } = await supabase
    .from("cities")
    .select("id")
    .eq("slug", "phoenix")
    .single();

  if (!city) {
    redirect("/staff/requests?error=City not found");
  }

  const { data: listing, error } = await supabase
    .from("listings")
    .insert({
      city_id: city.id,
      category: "services",
      translation_source: "en",
      machine_translated: false,
      status: "pending",
      title_en: request.business_name,
      body_en: request.requested_action,
      photos: [],
    })
    .select("id")
    .single();

  if (error || !listing) {
    redirect(
      `/staff/requests?error=${encodeURIComponent(error?.message ?? "Could not create draft listing")}`,
    );
  }

  await supabase
    .from("client_requests")
    .update({ status: "approved", converted_listing_id: listing.id })
    .eq("id", id);

  redirect("/staff/listings?draft=1");
}

export async function declineRequest(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = formData.get("id") as string;
  const reason = formData.get("reason") as string;
  await supabase
    .from("client_requests")
    .update({ status: "declined", decline_reason: reason })
    .eq("id", id);
  revalidatePath("/staff/requests");
}
