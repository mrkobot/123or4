import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { translateText } from "@/utils/translate";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { text, sourceLang } = await request.json();
  if (!text || (sourceLang !== "en" && sourceLang !== "zh")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const translation = await translateText(text, sourceLang);
    return NextResponse.json({ translation });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
