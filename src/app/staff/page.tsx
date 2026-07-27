import Link from "next/link";
import { requireStaff } from "@/utils/staff";

export default async function StaffHomePage() {
  const { supabase } = await requireStaff();

  const [{ data: requests }, { data: flags }, { data: expiring }] = await Promise.all([
    supabase
      .from("client_requests")
      .select("id, business_name, requested_action, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true }),
    supabase
      .from("flags")
      .select("id, item_type, item_id, reason, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: true }),
    supabase
      .from("listings")
      .select("id, title_en, title_zh, expires_at")
      .eq("status", "active")
      .not("expires_at", "is", null)
      .order("expires_at", { ascending: true })
      .limit(10),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-extrabold text-foreground">Work queue</h1>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground">
            Client requests ({requests?.length ?? 0})
          </h2>
          <Link href="/staff/requests" className="text-sm font-bold text-coral">
            View all
          </Link>
        </div>
        {requests?.length === 0 && (
          <p className="text-sm text-text-secondary">Nothing pending.</p>
        )}
        <div className="flex flex-col gap-2">
          {requests?.slice(0, 5).map((r) => (
            <div key={r.id} className="rounded-lg bg-surface-muted p-3 text-sm">
              <span className="font-bold text-foreground">{r.business_name}</span>{" "}
              <span className="text-text-secondary">— {r.requested_action}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground">
            Flagged content ({flags?.length ?? 0})
          </h2>
          <Link href="/staff/flags" className="text-sm font-bold text-coral">
            View all
          </Link>
        </div>
        {flags?.length === 0 && (
          <p className="text-sm text-text-secondary">Nothing flagged.</p>
        )}
        <div className="flex flex-col gap-2">
          {flags?.slice(0, 5).map((f) => (
            <div key={f.id} className="rounded-lg bg-surface-muted p-3 text-sm">
              <span className="font-bold text-foreground">{f.item_type}</span>{" "}
              <span className="text-text-secondary">— {f.reason}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-foreground">
            Listings nearing expiry ({expiring?.length ?? 0})
          </h2>
          <Link href="/staff/listings" className="text-sm font-bold text-coral">
            View all
          </Link>
        </div>
        {expiring?.length === 0 && (
          <p className="text-sm text-text-secondary">
            None yet — auto-expiry isn&rsquo;t wired up to set expiry dates yet.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {expiring?.map((l) => (
            <div key={l.id} className="rounded-lg bg-surface-muted p-3 text-sm">
              <span className="font-bold text-foreground">
                {l.title_en || l.title_zh}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
