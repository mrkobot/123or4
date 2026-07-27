import { requireStaff } from "@/utils/staff";
import { approveRequest, declineRequest } from "./actions";

export default async function StaffRequestsPage() {
  const { supabase } = await requireStaff();

  const { data: requests } = await supabase
    .from("client_requests")
    .select("id, business_name, contact_name, contact_email, contact_phone, requested_action, status, decline_reason, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-foreground">Client requests</h1>
      {requests?.length === 0 && (
        <p className="text-sm text-text-secondary">No requests yet.</p>
      )}
      <div className="flex flex-col gap-3">
        {requests?.map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4 shadow-[var(--shadow-card)]"
          >
            <div>
              <span className="font-bold text-foreground">{r.business_name}</span>
              <span className="ml-2 text-xs uppercase text-text-secondary">{r.status}</span>
              <p className="text-sm text-text-secondary">{r.requested_action}</p>
              <p className="text-xs text-text-secondary">
                {r.contact_name} · {r.contact_email} · {r.contact_phone}
              </p>
              {r.decline_reason && (
                <p className="text-xs text-coral-deep">Declined: {r.decline_reason}</p>
              )}
            </div>
            {r.status === "pending" && (
              <div className="flex shrink-0 gap-2">
                <form action={approveRequest.bind(null, r.id)}>
                  <button
                    type="submit"
                    className="rounded-full bg-cat-homes px-3 py-1.5 text-xs font-bold text-white"
                  >
                    Approve
                  </button>
                </form>
                <details className="relative">
                  <summary className="cursor-pointer list-none rounded-full border border-border px-3 py-1.5 text-xs font-bold text-coral-deep hover:bg-surface-muted">
                    Decline
                  </summary>
                  <form
                    action={declineRequest}
                    className="absolute right-0 z-10 mt-2 flex w-64 flex-col gap-2 rounded-xl border border-border bg-surface p-3 shadow-[var(--shadow-card-hover)]"
                  >
                    <input type="hidden" name="id" value={r.id} />
                    <input
                      name="reason"
                      required
                      placeholder="Reason for declining"
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-coral-deep px-3 py-1.5 text-xs font-bold text-white"
                    >
                      Confirm decline
                    </button>
                  </form>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
