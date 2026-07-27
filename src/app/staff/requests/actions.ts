"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/utils/staff";

export async function approveRequest(id: string) {
  const { supabase } = await requireStaff();
  await supabase.from("client_requests").update({ status: "approved" }).eq("id", id);
  revalidatePath("/staff/requests");
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
