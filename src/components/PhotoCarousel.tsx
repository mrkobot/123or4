"use client";

import { useState } from "react";

export function PhotoCarousel({
  photos,
  className,
}: {
  photos: string[];
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  if (photos.length === 1) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photos[0]}
        alt=""
        className={`h-40 w-full object-cover ${className ?? ""}`}
      />
    );
  }

  return (
    <div className={`group relative h-40 w-full overflow-hidden ${className ?? ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photos[index]} alt="" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={() => setIndex((i) => (i - 1 + photos.length) % photos.length)}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => setIndex((i) => (i + 1) % photos.length)}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
      >
        ›
      </button>
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {photos.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}
