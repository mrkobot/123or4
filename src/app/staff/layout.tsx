import Link from "next/link";
import { requireStaff } from "@/utils/staff";

const NAV = [
  { href: "/staff", label: "Work queue" },
  { href: "/staff/restaurants/new", label: "Add restaurant" },
  { href: "/staff/listings", label: "Listings" },
  { href: "/staff/requests", label: "Client requests" },
  { href: "/staff/flags", label: "Flagged content" },
  { href: "/staff/editors", label: "Editors" },
];

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStaff();

  return (
    <div className="flex min-h-screen flex-col items-center">
      <header className="flex w-full max-w-6xl items-center justify-between px-8 py-6">
        <div className="flex items-baseline gap-2">
          <Link href="/staff" className="text-xl font-extrabold text-foreground">
            123or4 staff
          </Link>
        </div>
        <Link href="/" className="text-sm font-bold text-text-secondary hover:text-foreground">
          Back to site
        </Link>
      </header>
      <nav className="flex w-full max-w-6xl gap-2 px-8 pb-4">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full bg-surface px-4 py-2 text-sm font-bold text-foreground shadow-[var(--shadow-card)] hover:bg-surface-muted"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="w-full max-w-6xl px-8 pb-16">{children}</main>
    </div>
  );
}
