import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { postListing } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

const CATEGORIES = [
  { value: "hiring", label: "Hiring" },
  { value: "rentals", label: "Rentals" },
  { value: "homes", label: "Homes" },
  { value: "cars", label: "Cars" },
  { value: "services", label: "Services" },
];

export default async function PostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 p-16">
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-[var(--shadow-card)]">
        <h1 className="mb-6 text-2xl font-extrabold text-foreground">
          Post a classified
        </h1>

        <form className="flex flex-col gap-3">
          <label className="text-sm font-bold text-text-secondary">
            Category
            <select
              name="category"
              required
              className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold text-text-secondary">
            Posting in
            <select
              name="language"
              required
              className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
            >
              <option value="en">English</option>
              <option value="zh">Traditional Chinese</option>
            </select>
          </label>

          <input
            name="title"
            type="text"
            placeholder="Title"
            required
            className="rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
          />
          <textarea
            name="body"
            placeholder="Details"
            required
            rows={5}
            className="rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
          />

          {error && <p className="text-sm text-coral-deep">{error}</p>}

          <SubmitButton
            formAction={postListing}
            pendingLabel="Posting..."
            className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            Post listing
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
