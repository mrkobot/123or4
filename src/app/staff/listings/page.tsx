import { requireStaff } from "@/utils/staff";
import { toggleVerified, archiveListing, updateListing } from "./actions";

const CATEGORIES = ["hiring", "rentals", "homes", "cars", "services"];

export default async function StaffListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ draft?: string }>;
}) {
  const { draft } = await searchParams;
  const { supabase } = await requireStaff();

  const { data: listings } = await supabase
    .from("listings")
    .select(
      "id, category, title_en, title_zh, body_en, body_zh, price, status, verified, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-foreground">Listings</h1>
      {draft && (
        <p className="text-sm text-cat-homes">
          Draft listing created from a client request — it&apos;s pending and not
          publicly visible until you set its category, verify it, and move it
          to active.
        </p>
      )}
      <div className="flex flex-col gap-3">
        {listings?.map((l) => (
          <div
            key={l.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
          >
            <div>
              <span className="mr-2 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-bold uppercase text-text-secondary">
                {l.category}
              </span>
              <span className="font-bold text-foreground">
                {l.title_en || l.title_zh}
              </span>
              <span className="ml-2 text-xs text-text-secondary">
                {l.status}
                {l.verified ? " · verified" : ""}
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
              <form action={toggleVerified.bind(null, l.id, !l.verified)}>
                <button
                  type="submit"
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface-muted"
                >
                  {l.verified ? "Unverify" : "Verify"}
                </button>
              </form>
              <details className="relative">
                <summary className="cursor-pointer list-none rounded-full border border-border px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface-muted">
                  Edit
                </summary>
                <form
                  action={updateListing}
                  className="absolute right-0 z-10 mt-2 flex w-80 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card-hover)]"
                >
                  <input type="hidden" name="id" value={l.id} />
                  <select
                    name="category"
                    defaultValue={l.category}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {l.status !== "archived" && (
                    <select
                      name="status"
                      defaultValue={l.status}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    >
                      <option value="pending">pending (draft, not public)</option>
                      <option value="active">active (live on site)</option>
                    </select>
                  )}
                  {l.status === "archived" && (
                    <input type="hidden" name="status" value="archived" />
                  )}
                  <input
                    name="title_en"
                    defaultValue={l.title_en ?? ""}
                    placeholder="Title (English)"
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  />
                  <input
                    name="title_zh"
                    defaultValue={l.title_zh ?? ""}
                    placeholder="Title (Chinese)"
                    className="font-tc rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  />
                  <textarea
                    name="body_en"
                    defaultValue={l.body_en ?? ""}
                    placeholder="Details (English)"
                    rows={3}
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  />
                  <textarea
                    name="body_zh"
                    defaultValue={l.body_zh ?? ""}
                    placeholder="Details (Chinese)"
                    rows={3}
                    className="font-tc rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  />
                  <input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={l.price ?? ""}
                    placeholder="Price"
                    className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-foreground px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Save changes
                  </button>
                </form>
              </details>
              {l.status !== "archived" && (
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded-full border border-border px-3 py-1.5 text-xs font-bold text-coral-deep hover:bg-surface-muted">
                    Archive
                  </summary>
                  <form
                    action={archiveListing}
                    className="absolute right-0 z-10 mt-2 flex w-64 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card-hover)]"
                  >
                    <input type="hidden" name="id" value={l.id} />
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
