"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { PhotoDropzone } from "@/components/PhotoDropzone";
import { addRestaurant } from "./actions";

export function AddRestaurantForm({
  editors,
  error,
}: {
  editors: { id: string; name: string }[];
  error?: string;
}) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const inputClass =
    "rounded-lg border border-border bg-surface px-4 py-3 text-foreground";
  const labelClass = "flex flex-col gap-1 text-sm font-bold text-text-secondary";

  return (
    <form className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className={labelClass}>
        Name (English)
        <input name="name_en" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Name (Chinese)
        <input name="name_zh" required className={`font-tc ${inputClass}`} />
      </label>
      <label className={labelClass}>
        Cuisine (English)
        <input name="cuisine_en" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Cuisine (Chinese)
        <input name="cuisine_zh" required className={`font-tc ${inputClass}`} />
      </label>
      <label className={labelClass}>
        Address
        <input name="address" required className={inputClass} />
      </label>
      <label className={labelClass}>
        Hours
        <input name="hours" placeholder="10am - 9pm daily" className={inputClass} />
      </label>

      <label className="flex items-center gap-2 text-sm font-bold text-text-secondary sm:col-span-2">
        <input type="checkbox" name="verified" defaultChecked />
        Verified
      </label>

      <div className={`${labelClass} sm:col-span-2`}>
        Photos
        <PhotoDropzone
          photoUrls={photoUrls}
          onChange={setPhotoUrls}
          pathPrefix="restaurants"
        />
      </div>
      <input type="hidden" name="photos" value={JSON.stringify(photoUrls)} />

      <div className="sm:col-span-2 h-px bg-border" />

      <label className={labelClass}>
        Editor
        <select name="editor_id" required className={inputClass}>
          {editors.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </label>
      <label className={labelClass}>
        Editor rating
        <select name="editor_rating" required defaultValue="4" className={inputClass}>
          <option value="1">1 — Meh 普普</option>
          <option value="2">2 — Average 還行</option>
          <option value="3">3 — Good 不錯</option>
          <option value="4">4 — Excellent 一流</option>
        </select>
      </label>

      <label className={`${labelClass} sm:col-span-2`}>
        Review (English)
        <textarea name="body_en" required rows={4} className={inputClass} />
      </label>
      <label className={`${labelClass} sm:col-span-2`}>
        Review (Chinese)
        <textarea name="body_zh" required rows={4} className={`font-tc ${inputClass}`} />
      </label>

      {error && <p className="text-sm text-coral-deep sm:col-span-2">{error}</p>}

      <SubmitButton
        formAction={addRestaurant}
        pendingLabel="Publishing..."
        className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)] sm:col-span-2"
      >
        Publish restaurant and review
      </SubmitButton>
    </form>
  );
}
