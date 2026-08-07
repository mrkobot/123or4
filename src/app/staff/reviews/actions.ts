"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/utils/staff";

export async function updateReview(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = formData.get("id") as string;

  await supabase
    .from("reviews")
    .update({
      body_en: (formData.get("body_en") as string) || null,
      body_zh: (formData.get("body_zh") as string) || null,
      body_zh_human_edited: true,
      editor_rating: Number(formData.get("editor_rating")),
    })
    .eq("id", id);
  revalidatePath("/staff/reviews");
}

export async function archiveReview(formData: FormData) {
  const { supabase } = await requireStaff();
  const id = formData.get("id") as string;
  const reason = formData.get("reason") as string;
  await supabase
    .from("reviews")
    .update({ status: "archived", archived_reason: reason })
    .eq("id", id);
  revalidatePath("/staff/reviews");
}
