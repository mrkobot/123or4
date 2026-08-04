import { requireStaff } from "@/utils/staff";
import { importRestaurantsCsv } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

const COLUMNS = [
  "name_en",
  "name_zh",
  "cuisine_en",
  "cuisine_zh",
  "address",
  "hours",
  "editor_name",
  "editor_rating",
  "review_en",
  "review_zh",
  "verified",
  "photo_urls",
];

export default async function ImportRestaurantsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; created?: string; failed?: string; errors?: string }>;
}) {
  await requireStaff();
  const { error, created, failed, errors } = await searchParams;

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-card)]">
        <h1 className="mb-3 text-2xl font-extrabold text-foreground">
          Batch import restaurants
        </h1>
        <p className="mb-2 text-sm text-text-secondary">
          CSV columns, in this order:
        </p>
        <code className="mb-4 block overflow-x-auto rounded-lg bg-surface-muted p-3 text-xs text-foreground">
          {COLUMNS.join(", ")}
        </code>
        <ul className="mb-4 flex list-disc flex-col gap-1 pl-5 text-sm text-text-secondary">
          <li><code>editor_rating</code>: a number 1-4</li>
          <li><code>verified</code>: <code>yes</code> or <code>no</code></li>
          <li>
            <code>photo_urls</code>: publicly reachable image URLs, separated by
            semicolons (<code>;</code>) if there&rsquo;s more than one. Leave blank
            for no photo.
          </li>
          <li>
            <code>editor_name</code> matches an existing editor by name, or creates
            a new one automatically if it doesn&rsquo;t match.
          </li>
        </ul>

        <form action={importRestaurantsCsv} className="flex flex-col gap-3">
          <input
            type="file"
            name="csv"
            accept=".csv"
            required
            className="text-sm text-foreground"
          />
          {error && <p className="text-sm text-coral-deep">{error}</p>}
          {created && (
            <p className="text-sm font-bold text-cat-homes">
              Imported {created} restaurants{Number(failed) > 0 ? `, ${failed} failed` : ""}.
            </p>
          )}
          {errors && <p className="text-xs text-coral-deep">{errors}</p>}
          <SubmitButton
            formAction={importRestaurantsCsv}
            pendingLabel="Importing..."
            className="w-fit rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
          >
            Import CSV
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
