import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

type SourceLanguage = "en" | "zh";

const LANGUAGE_NAMES: Record<SourceLanguage, string> = {
  en: "English",
  zh: "Traditional Chinese",
};

// Machine translation for classifieds, which post live immediately and
// have their other-language version filled in moments later (§4, §15).
// Editorial reviews route through a separate human-edit step and should
// not call this directly for final content.
export async function translateText(
  text: string,
  sourceLang: SourceLanguage,
): Promise<string> {
  const targetLang: SourceLanguage = sourceLang === "en" ? "zh" : "en";

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system:
      `Translate the user's message from ${LANGUAGE_NAMES[sourceLang]} to ` +
      `${LANGUAGE_NAMES[targetLang]}. Reply with only the translation, ` +
      "no commentary, no quotation marks.",
    messages: [{ role: "user", content: text }],
  });

  const block = message.content[0];
  if (block.type !== "text") {
    throw new Error("Unexpected response type from translation model");
  }
  return block.text.trim();
}
