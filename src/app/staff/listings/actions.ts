"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/utils/staff";

export async function toggleVerified(id: string, verified: boolean) {
  const { supabase } = await requireStaff();
  await supabase.from("listings").update({ verified }).eq("id", id);
  revalidatePath("/staff/listings");
}

export async function archiveListing(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = formData.get("id") as string;
  const reason = formData.get("reason") as string;
  await supabase
    .from("listings")
    .update({ status: "archived", archived_reason: reason })
    .eq("id", id);
  revalidatePath("/staff/listings");
}

export async function updateListing(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = formData.get("id") as string;
  const price = formData.get("price") as string;

  await supabase
    .from("listings")
    .update({
      category: formData.get("category") as string,
      status: formData.get("status") as string,
      title_en: (formData.get("title_en") as string) || null,
      title_zh: (formData.get("title_zh") as string) || null,
      body_en: (formData.get("body_en") as string) || null,
      body_zh: (formData.get("body_zh") as string) || null,
      price: price ? Number(price) : null,
    })
    .eq("id", id);
  revalidatePath("/staff/listings");
}
