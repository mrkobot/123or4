import { Bi } from "@/components/LanguageProvider";

const PLACEHOLDER_IMAGES: Record<string, string> = {
  hiring: "https://picsum.photos/seed/123or4-hiring/800/600",
  rentals: "https://picsum.photos/seed/123or4-rentals/800/600",
  homes: "https://picsum.photos/seed/123or4-homes/800/600",
  cars: "https://picsum.photos/seed/123or4-cars/800/600",
  services: "https://picsum.photos/seed/123or4-services/800/600",
  eats: "https://picsum.photos/seed/123or4-eats/800/600",
};

const CATEGORY_COLOR: Record<string, string> = {
  hiring: "var(--cat-hiring)",
  rentals: "var(--cat-rentals)",
  homes: "var(--cat-homes)",
  cars: "var(--cat-cars)",
  services: "var(--cat-services)",
  eats: "var(--cat-eats)",
};

export function PlaceholderPhoto({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const src = PLACEHOLDER_IMAGES[category] ?? PLACEHOLDER_IMAGES.services;
  const color = CATEGORY_COLOR[category] ?? CATEGORY_COLOR.services;

  return (
    <div className={`relative h-40 w-full overflow-hidden ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="h-full w-full object-cover"
        style={{ filter: "grayscale(1) contrast(1.05)" }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: color, mixBlendMode: "multiply", opacity: 0.6 }}
      />
      <span className="absolute bottom-2 left-2 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        <Bi en="No photo yet" zh="尚無照片" />
      </span>
    </div>
  );
}
