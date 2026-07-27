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
