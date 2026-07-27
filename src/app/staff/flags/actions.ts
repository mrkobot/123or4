"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/utils/staff";

export async function dismissFlag(id: string) {
  const { supabase } = await requireStaff();
  await supabase.from("flags").update({ status: "dismissed" }).eq("id", id);
  revalidatePath("/staff/flags");
}

export async function removeFlaggedContent(
  flagId: string,
  itemType: "listing" | "review",
  itemId: string,
) {
  const { supabase } = await requireStaff();
  const table = itemType === "listing" ? "listings" : "reviews";
  await supabase
    .from(table)
    .update({ status: "archived", archived_reason: "Removed after flag review" })
    .eq("id", itemId);
  await supabase.from("flags").update({ status: "reviewed" }).eq("id", flagId);
  revalidatePath("/staff/flags");
}
