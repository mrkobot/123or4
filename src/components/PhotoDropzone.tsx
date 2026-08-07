"use client";

import { useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Bi } from "@/components/LanguageProvider";

export function PhotoDropzone({
  photoUrls,
  onChange,
  pathPrefix,
  bilingual = false,
}: {
  photoUrls: string[];
  onChange: (urls: string[]) => void;
  pathPrefix: string;
  bilingual?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const path = `${pathPrefix}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file);
      if (!uploadError) {
        const { data } = supabase.storage.from("photos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    onChange([...photoUrls, ...uploaded]);
    setUploading(false);
  }

  function removeAt(url: string) {
    onChange(photoUrls.filter((u) => u !== url));
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
          dragActive
            ? "border-coral bg-coral/5"
            : "border-border bg-surface-muted hover:border-text-secondary/40"
        }`}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="text-text-secondary"
        >
          <path
            d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-sm font-bold text-foreground">
          {bilingual ? (
            <Bi en="Drag photos here or click to browse" zh="拖曳照片至此或點擊瀏覽" />
          ) : (
            "Drag photos here or click to browse"
          )}
        </p>
        <p className="text-xs text-text-secondary">
          {bilingual ? (
            <Bi en="On mobile, this opens your photo library or camera" zh="在手機上，會開啟相簿或相機" />
          ) : (
            "On mobile, this opens your photo library, camera, or files"
          )}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          onClick={(e) => e.stopPropagation()}
          className="hidden"
        />
      </div>

      {uploading && (
        <p className="text-xs font-bold text-text-secondary">
          {bilingual ? <Bi en="Uploading..." zh="上傳中..." /> : "Uploading..."}
        </p>
      )}

      {photoUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photoUrls.map((url) => (
            <div key={url} className="group relative h-20 w-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-20 w-20 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(url);
                }}
                aria-label="Remove photo"
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-white shadow-[var(--shadow-card)] opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
