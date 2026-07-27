import { requireStaff } from "@/utils/staff";
import { addEditor } from "./actions";

export default async function StaffEditorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const { supabase } = await requireStaff();

  const { data: editors } = await supabase
    .from("editors")
    .select("id, name, bio_en, bio_zh, photo_url")
    .order("name");

  const inputClass = "rounded-lg border border-border bg-surface px-4 py-3 text-foreground";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-4 text-2xl font-extrabold text-foreground">Editors</h1>
        <div className="flex flex-col gap-3">
          {editors?.map((e) => (
            <div
              key={e.id}
              className="rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
            >
              <span className="font-bold text-foreground">{e.name}</span>
              <p className="text-sm text-text-secondary">{e.bio_en}</p>
              <p className="font-tc text-sm text-text-secondary">{e.bio_zh}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <h2 className="mb-4 text-lg font-extrabold text-foreground">Add editor</h2>
        <form action={addEditor} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm font-bold text-text-secondary">
            Name
            <input name="name" required className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-text-secondary">
            Photo URL
            <input name="photo_url" className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-text-secondary sm:col-span-2">
            Bio (English)
            <textarea name="bio_en" rows={2} className={inputClass} />
          </label>
          <label className="flex flex-col gap-1 text-sm font-bold text-text-secondary sm:col-span-2">
            Bio (Chinese)
            <textarea name="bio_zh" rows={2} className={`font-tc ${inputClass}`} />
          </label>
          {error && <p className="text-sm text-coral-deep sm:col-span-2">{error}</p>}
          <button
            type="submit"
            className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] sm:col-span-2"
          >
            Add editor
          </button>
        </form>
      </div>
    </div>
  );
}
