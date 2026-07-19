import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const RESTAURANTS = [
  {
    nameEn: "Golden Palace",
    nameZh: "金宮",
    cuisineEn: "Hong Kong dim sum",
    cuisineZh: "港式飲茶",
    address: "Chandler, AZ",
    hours: "10am - 9pm daily",
    rating: 4,
    bodyEn:
      "A neighborhood staple since 1998 — the har gow still snap the way they should, and the cart still comes to you. In twelve years the kitchen has not once coasted.",
    bodyZh:
      "自1998年以來的社區支柱——蝦餃依然爽脆，推車依然會來到你桌前。十二年來廚房從未鬆懈過。",
  },
  {
    nameEn: "Shaanxi Kitchen",
    nameZh: "陝西廚房",
    cuisineEn: "Hand-pulled noodles",
    cuisineZh: "麵食",
    address: "Mesa, AZ",
    hours: "11am - 8:30pm, closed Tuesdays",
    rating: 4,
    bodyEn:
      "The biang biang noodles are worth the drive alone — wide, chewy, and coated in enough chili oil to make you sweat a little. Order the cumin lamb on the side.",
    bodyZh:
      "光是biangbiang麵就值得專程開車前來——寬厚有嚼勁，裹滿辣油讓人微微冒汗。建議加點孜然羊肉。",
  },
  {
    nameEn: "Little Sheep",
    nameZh: "小肥羊",
    cuisineEn: "Hot pot",
    cuisineZh: "火鍋",
    address: "Tempe, AZ",
    hours: "5pm - 11pm daily",
    rating: 3,
    bodyEn:
      "Reliable hot pot for a group, though the broth options have gotten pricier without much change to the recipe. Still the best spot in the valley for a Friday night crowd.",
    bodyZh:
      "適合多人聚餐的可靠火鍋店，湯底價格上漲但配方未見改進。仍是谷區週五夜晚聚會的首選。",
  },
  {
    nameEn: "Cô Ba",
    nameZh: "Cô Ba",
    cuisineEn: "Vietnamese pho",
    cuisineZh: "越南河粉",
    address: "Phoenix, AZ",
    hours: "9am - 8pm daily",
    rating: 4,
    bodyEn:
      "The broth simmers for eighteen hours and you can tell. This is the pho we send visiting family to on their first morning in town.",
    bodyZh:
      "湯頭熬煮十八小時，吃得出來。這是我們帶初訪親戚第一天早上必去的河粉店。",
  },
  {
    nameEn: "Szechuan Garden",
    nameZh: "四川園",
    cuisineEn: "Sichuan",
    cuisineZh: "川菜",
    address: "Gilbert, AZ",
    hours: "11am - 9:30pm daily",
    rating: 3,
    bodyEn:
      "Mapo tofu has real heat, not the watered-down version some places serve for non-Chinese diners. Ask for it spicy and they'll actually make it spicy.",
    bodyZh:
      "麻婆豆腐真的夠辣，不是某些店為非華人顧客準備的清淡版。要求辣一點，他們真的會做辣。",
  },
  {
    nameEn: "Formosa Bakery",
    nameZh: "福爾摩沙麵包店",
    cuisineEn: "Taiwanese bakery",
    cuisineZh: "台式麵包",
    address: "Chandler, AZ",
    hours: "7am - 7pm daily",
    rating: 4,
    bodyEn:
      "The pork floss buns sell out by early afternoon most days — get there before 11 if you want one. Their taro bread is criminally underrated.",
    bodyZh:
      "肉鬆麵包大多在下午前就賣完——想買到請11點前到。芋頭麵包被嚴重低估。",
  },
];

async function main() {
  const { data: city } = await supabase.from("cities").select("id").eq("slug", "phoenix").single();
  if (!city) throw new Error("Phoenix city not found");

  const { data: editor, error: editorError } = await supabase
    .from("editors")
    .insert({
      city_id: city.id,
      name: "Lisa Chang",
      bio_en: "Phoenix's food friend, eating her way through the valley one dim sum cart at a time.",
      bio_zh: "鳳凰城的美食好朋友，一輛推車接一輛，吃遍整個谷區。",
    })
    .select("id")
    .single();

  if (editorError || !editor) {
    console.error("Failed to create editor", editorError?.message);
    return;
  }

  let inserted = 0;
  for (const r of RESTAURANTS) {
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .insert({
        city_id: city.id,
        name_en: r.nameEn,
        name_zh: r.nameZh,
        cuisine: r.cuisineEn,
        address: r.address,
        hours: r.hours,
        verified: true,
        status: "active",
      })
      .select("id")
      .single();

    if (restaurantError || !restaurant) {
      console.error(`Failed restaurant: ${r.nameEn}`, restaurantError?.message);
      continue;
    }

    const { error: reviewError } = await supabase.from("reviews").insert({
      restaurant_id: restaurant.id,
      editor_id: editor.id,
      body_en: r.bodyEn,
      body_zh: r.bodyZh,
      body_zh_human_edited: true,
      editor_rating: r.rating,
      status: "published",
    });

    if (reviewError) {
      console.error(`Failed review: ${r.nameEn}`, reviewError.message);
    } else {
      inserted++;
    }
  }
  console.log(`Inserted 1 editor and ${inserted} restaurants with reviews.`);
}

main();
