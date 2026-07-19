import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const CUISINE_ZH = {
  "Golden Palace": "港式飲茶",
  "Shaanxi Kitchen": "麵食",
  "Little Sheep": "火鍋",
  "Cô Ba": "越南河粉",
  "Szechuan Garden": "川菜",
  "Formosa Bakery": "台式麵包",
};

async function main() {
  for (const [nameEn, cuisineZh] of Object.entries(CUISINE_ZH)) {
    const { error } = await supabase
      .from("restaurants")
      .update({ cuisine_zh: cuisineZh })
      .eq("name_en", nameEn);
    if (error) {
      console.error(`Failed: ${nameEn}`, error.message);
    } else {
      console.log(`Updated ${nameEn} -> ${cuisineZh}`);
    }
  }
}

main();
