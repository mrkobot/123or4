import { requireStaff } from "@/utils/staff";
import { AddRestaurantForm } from "./AddRestaurantForm";

export default async function NewRestaurantPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase } = await requireStaff();

  const { data: editors } = await supabase
    .from("editors")
    .select("id, name")
    .order("name");

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
      <h1 className="mb-6 text-2xl font-extrabold text-foreground">
        Add restaurant and review
      </h1>
      <AddRestaurantForm editors={editors ?? []} error={error} />
    </div>
  );
}
