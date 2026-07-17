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
    <div className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 p-16 font-sans dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
        Post a classified
      </h1>

      <form className="flex w-full max-w-md flex-col gap-3">
        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          Category
          <select
            name="category"
            required
            className="mt-1 w-full rounded-lg border border-black/[.15] px-4 py-3 dark:border-white/[.2] dark:bg-zinc-900"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm text-zinc-600 dark:text-zinc-400">
          Posting in
          <select
            name="language"
            required
            className="mt-1 w-full rounded-lg border border-black/[.15] px-4 py-3 dark:border-white/[.2] dark:bg-zinc-900"
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
          className="rounded-lg border border-black/[.15] px-4 py-3 dark:border-white/[.2] dark:bg-zinc-900"
        />
        <textarea
          name="body"
          placeholder="Details"
          required
          rows={5}
          className="rounded-lg border border-black/[.15] px-4 py-3 dark:border-white/[.2] dark:bg-zinc-900"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <SubmitButton
          formAction={postListing}
          pendingLabel="Posting..."
          className="rounded-full bg-foreground px-5 py-3 text-base font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Post listing
        </SubmitButton>
      </form>
    </div>
  );
}
