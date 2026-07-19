"use client";

import { useEffect, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";

const CATEGORIES = [
  { value: "hiring", label: "Hiring" },
  { value: "rentals", label: "Rentals" },
  { value: "homes", label: "Homes" },
  { value: "cars", label: "Cars" },
  { value: "services", label: "Services" },
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

  const titlePreview = useDebouncedTranslation(title, language);
  const bodyPreview = useDebouncedTranslation(body, language);

  const otherLangLabel = language === "en" ? "Traditional Chinese" : "English";
  const previewFontClass = language === "en" ? "font-tc" : "";

  return (
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
          value={language}
          onChange={(e) => setLanguage(e.target.value as "en" | "zh")}
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={`rounded-lg border border-border bg-surface px-4 py-3 text-foreground ${language === "zh" ? "font-tc" : ""}`}
      />
      <textarea
        name="body"
        placeholder="Details"
        required
        rows={5}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className={`rounded-lg border border-border bg-surface px-4 py-3 text-foreground ${language === "zh" ? "font-tc" : ""}`}
      />

      {(title || body) && (
        <div className="rounded-lg bg-surface-muted p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
            Preview in {otherLangLabel}
            {(titlePreview.loading || bodyPreview.loading) && " · translating..."}
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
        pendingLabel="Posting..."
        className="rounded-full bg-coral px-5 py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
      >
        Post listing
      </SubmitButton>
    </form>
  );
}
