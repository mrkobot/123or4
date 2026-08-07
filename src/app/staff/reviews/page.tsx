import { requireStaff } from "@/utils/staff";
import { updateReview, archiveReview } from "./actions";

export default async function StaffReviewsPage() {
  const { supabase } = await requireStaff();

  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select(
      "id, body_en, body_zh, editor_rating, status, created_at, restaurant:restaurants(name_en, name_zh), editor:editors(name)",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const reviews = (reviewsRaw ?? []).map((r) => ({
    ...r,
    restaurant: Array.isArray(r.restaurant) ? (r.restaurant[0] ?? null) : r.restaurant,
    editor: Array.isArray(r.editor) ? (r.editor[0] ?? null) : r.editor,
  }));

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-foreground">Reviews</h1>
      <div className="flex flex-col gap-3">
        {reviews?.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
          >
            <div>
              <span className="font-bold text-foreground">
                {r.restaurant?.name_en || r.restaurant?.name_zh}
              </span>
              <span className="ml-2 text-xs text-text-secondary">
                {r.status} · edited by {r.editor?.name} · editor rated {r.editor_rating}
              </span>
              <p className="mt-1 max-w-xl truncate text-sm text-text-secondary">
                {r.body_en}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <details className="relative">
                <summary className="cursor-pointer list-none rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface-muted">
                  Edit
                </summary>
                <form
                  action={updateReview}
                  className="absolute right-0 z-10 mt-2 flex w-80 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card-hover)]"
                >
                  <input type="hidden" name="id" value={r.id} />
                  <select
                    name="editor_rating"
                    defaultValue={r.editor_rating}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  >
                    <option value="1">1 — Meh 普普</option>
                    <option value="2">2 — Average 還行</option>
                    <option value="3">3 — Good 不錯</option>
                    <option value="4">4 — Excellent 一流</option>
                  </select>
                  <textarea
                    name="body_en"
                    defaultValue={r.body_en ?? ""}
                    placeholder="Review (English)"
                    rows={3}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  />
                  <textarea
                    name="body_zh"
                    defaultValue={r.body_zh ?? ""}
                    placeholder="Review (Chinese)"
                    rows={3}
                    className="font-tc rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Save changes
                  </button>
                </form>
              </details>
              {r.status !== "archived" && (
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded-full border border-border px-3 py-1.5 text-xs font-bold text-coral-deep hover:bg-surface-muted">
                    Archive
                  </summary>
                  <form
                    action={archiveReview}
                    className="absolute right-0 z-10 mt-2 flex w-64 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card-hover)]"
                  >
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      name="reason"
                      required
                      placeholder="Reason for archiving"
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-coral-deep px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Confirm archive
                    </button>
                  </form>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
