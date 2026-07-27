import { requireStaff } from "@/utils/staff";
import { dismissFlag, removeFlaggedContent } from "./actions";

export default async function StaffFlagsPage() {
  const { supabase } = await requireStaff();

  const { data: flags } = await supabase
    .from("flags")
    .select("id, item_type, item_id, reason, status, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-foreground">Flagged content</h1>
      {flags?.length === 0 && (
        <p className="text-sm text-text-secondary">Nothing flagged right now.</p>
      )}
      <div className="flex flex-col gap-3">
        {flags?.map((f) => (
          <div
            key={f.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
          >
            <div>
              <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-bold uppercase text-text-secondary">
                {f.item_type}
              </span>
              <p className="mt-1 text-sm text-foreground">{f.reason}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <form action={dismissFlag.bind(null, f.id)}>
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface-muted"
                >
                  Dismiss
                </button>
              </form>
              <form
                action={removeFlaggedContent.bind(
                  null,
                  f.id,
                  f.item_type as "listing" | "review",
                  f.item_id,
                )}
              >
                <button
                  type="submit"
                  className="rounded-full bg-coral-deep px-3 py-1.5 text-xs font-bold text-white"
                >
                  Remove content
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
