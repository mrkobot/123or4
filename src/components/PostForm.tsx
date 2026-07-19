"use client";

import { useEffect, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { createClient } from "@/utils/supabase/client";
import { Bi } from "@/components/LanguageProvider";

const CATEGORIES = [
  { value: "hiring", en: "Hiring", zh: "徵才" },
  { value: "rentals", en: "Rentals", zh: "租屋" },
  { value: "homes", en: "Homes", zh: "房屋" },
  { value: "cars", en: "Cars", zh: "汽車" },
  { value: "services", en: "Services", zh: "服務" },
];

function useDebouncedTranslation(text: string, sourceLang: "en" | "zh") {
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);
  const trimmed = text.trim();

  useEffect(() => {
    if (!trimmed) return;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/translate-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, sourceLang }),
        });
        const data = await res.json();
        setTranslation(data.translation ?? "");
      } catch {
        setTranslation("");
      } finally {
        setLoading(false);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [trimmed, sourceLang]);

  return { translation: trimmed ? translation : "", loading: trimmed ? loading : false };
}

export function PostForm({
  formAction,
  error,
}: {
  formAction: (formData: FormData) => void;
  error?: string;
}) {
  const [language, setLanguage] = useState<"en" | "zh">("en");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const titlePreview = useDebouncedTranslation(title, language);
  const bodyPreview = useDebouncedTranslation(body, language);

  const previewFontClass = language === "en" ? "font-tc" : "";

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const path = `listings/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file);
      if (!uploadError) {
        const { data } = supabase.storage.from("photos").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setPhotoUrls((prev) => [...prev, ...uploaded]);
    setUploading(false);
  }

  return (
    <form className="flex flex-col gap-3">
      <label className="text-sm font-bold text-text-secondary">
        <Bi en="Category" zh="分類" />
        <select
          name="category"
          required
          className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.en} / {c.zh}
            </option>
          ))}
        </select>
      </label>

      <label className="text-sm font-bold text-text-secondary">
        <Bi en="Posting in" zh="使用語言張貼" />
        <select
          name="language"
          required
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "zh")}
          className="mt-1 w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground"
        >
          <option value="en">English / 英文</option>
          <option value="zh">Traditional Chinese / 繁體中文</option>
        </select>
      </label>

      <input
        name="title"
        type="text"
        placeholder="Title / 標題"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`rounded-lg border border-border bg-surface px-4 py-3 text-foreground ${language === "zh" ? "font-tc" : ""}`}
      />
      <textarea
        name="body"
        placeholder="Details / 內容"
        required
        rows={5}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className={`rounded-lg border border-border bg-surface px-4 py-3 text-foreground ${language === "zh" ? "font-tc" : ""}`}
      />

      <label className="text-sm font-bold text-text-secondary">
        <Bi en="Photos" zh="照片" />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="mt-1 block w-full text-sm text-foreground"
        />
      </label>
      {uploading && (
        <p className="text-xs font-bold text-text-secondary">
          <Bi en="Uploading..." zh="上傳中..." />
        </p>
      )}
      {photoUrls.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {photoUrls.map((url) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt=""
              className="h-16 w-16 rounded-lg object-cover"
            />
          ))}
        </div>
      )}
      <input type="hidden" name="photos" value={JSON.stringify(photoUrls)} />

      {(title || body) && (
        <div className="rounded-lg bg-surface-muted p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
            <Bi en="Preview" zh="預覽" />
            {(titlePreview.loading || bodyPreview.loading) && (
              <>
                {" · "}
                <Bi en="translating..." zh="翻譯中..." />
              </>
            )}
          </p>
          {titlePreview.translation && (
            <p className={`text-lg font-extrabold text-foreground ${previewFontClass}`}>
              {titlePreview.translation}
            </p>
          )}
          {bodyPreview.translation && (
            <p className={`mt-1 text-foreground/80 ${previewFontClass}`}>
              {bodyPreview.translation}
            </p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-coral-deep">{error}</p>}

      <SubmitButton
        formAction={formAction}
        pendingLabel="Posting... / 張貼中..."
        className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      >
        <Bi en="Post listing" zh="張貼廣告" />
      </SubmitButton>
    </form>
  );
}
