import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

// Columns are always [source, titleEn, titleZh, bodyEn, bodyZh] —
// titleEn/bodyEn hold the English text and titleZh/bodyZh hold the
// Chinese text regardless of which language was the posting source.
const LISTINGS = {
  hiring: [
    ["en", "Weekend server, dim sum house", "週末服務生，飲茶餐廳", "Hourly plus tips, experience preferred.", "時薪加小費，有經驗優先。"],
    ["zh", "Line cook wanted, Chinese restaurant", "誠聘廚師，中餐館", "Familiar with Cantonese and Sichuan cuisine, full-time.", "熟悉粵菜及川菜佳，全職。"],
    ["en", "Mandarin-English bilingual receptionist", "中英雙語前台接待", "Medical office, Mon-Fri, no weekends.", "醫療診所，週一至週五，週末休息。"],
    ["zh", "Massage therapist wanted", "誠徵按摩師", "Licensed preferred, flexible schedule.", "有執照者優先，彈性排班。"],
    ["en", "Delivery driver, own car required", "送貨司機，需自備車輛", "Evenings and weekends, cash daily.", "晚間及週末，現金日結。"],
    ["zh", "Grocery store cashier", "超市收銀員", "Fluent Chinese, part-time available.", "中文流利，兼職可。"],
    ["en", "Bubble tea shop, now hiring baristas", "手搖飲料店誠徵店員", "No experience necessary, will train.", "無需經驗，提供培訓。"],
    ["zh", "Accounting assistant needed", "誠聘會計助理", "QuickBooks experience, part-time.", "熟悉QuickBooks，兼職。"],
    ["en", "Nail salon seeking technician", "美甲店徵技師", "Booth rent or commission, your choice.", "可選租位或抽成。"],
    ["zh", "Mandarin tutor wanted", "誠徵中文家教", "Teaching elementary students, twice weekly.", "教授國小學生，每週兩次。"],
  ],
  rentals: [
    ["zh", "2BR near Chinatown Cultural Center", "近文化中心兩房出租", "Near grocery and bus stop, fully furnished.", "近超市與公車站，家具齊全。"],
    ["en", "Studio apartment, utilities included", "套房出租，含水電", "Walking distance to plaza, quiet building.", "步行可達廣場，安靜社區。"],
    ["zh", "3BR house for rent", "三房透天出租", "Private garage, with backyard.", "獨立車庫，帶後院。"],
    ["en", "1BR near ASU, short-term OK", "近亞利桑那州大一房出租，可短租", "Furnished, flexible lease terms.", "附家具，租約靈活。"],
    ["zh", "Room for rent, near grocery store", "分租雅房，近超市", "Shared kitchen and bath, ideal for singles.", "共用廚房衛浴，適合單身。"],
    ["en", "Townhouse, 2BR 2BA, pool access", "連棟別墅兩房兩衛，含泳池", "Gated community, pet friendly.", "封閉式社區，可養寵物。"],
    ["zh", "Private guest house for rent", "獨立套房出租", "Private entrance, basic furniture included.", "獨立入口，含基本家具。"],
    ["en", "Senior-friendly 1BR, ground floor", "適合長者一房，一樓", "No stairs, close to clinic and bus.", "無需爬樓梯，近診所與公車站。"],
    ["zh", "4BR family home for rent", "四房家庭住宅出租", "Near Chinese school, good school district.", "近中文學校，學區佳。"],
    ["en", "Furnished room, short walk to plaza", "含家具雅房，步行至廣場", "Utilities included, month to month.", "含水電，月租彈性。"],
  ],
  homes: [
    ["en", "3BR/2BA home, move-in ready", "三房兩衛住宅，可立即入住", "Updated kitchen, large backyard.", "廚房翻新，後院寬敞。"],
    ["zh", "House for sale near Chinatown", "近中國城透天別墅出售", "4BR 3BA, two-car garage.", "四房三衛，雙車庫。"],
    ["en", "Townhome, low HOA, great schools", "連棟別墅出售，管理費低，學區佳", "Two-story, community pool.", "兩層樓，社區泳池。"],
    ["zh", "Single-story house for sale", "獨棟平房出售", "Great for first-time buyers, priced to sell.", "適合首購族，價格合理。"],
    ["en", "New construction 4BR, gated community", "全新四房住宅，封閉式社區", "Solar panels included.", "含太陽能板。"],
    ["zh", "Retirement community home for sale", "退休社區平房出售", "Single-level, accessible design.", "一樓無障礙設計。"],
    ["en", "Fixer-upper, great bones, priced to sell", "待整修住宅，結構良好，價格優惠", "Cash buyers preferred.", "現金買家優先。"],
    ["zh", "3BR home near elementary school", "近學校三房住宅", "Walking distance, safe neighborhood.", "步行可達，社區安全。"],
    ["en", "Modern 2BR condo, city views", "現代兩房公寓，市景", "Rooftop deck, secure parking.", "屋頂露台，安全停車位。"],
    ["zh", "Spacious 5BR home for sale", "大坪數五房住宅出售", "Great for large families, two living rooms.", "適合大家庭，雙客廳設計。"],
  ],
  cars: [
    ["en", "2019 Honda CR-V, one owner", "2019年本田CR-V，原車主", "Clean title, well maintained.", "產權清楚，保養良好。"],
    ["zh", "2017 Toyota Camry for sale", "2017年豐田Camry出售", "Low mileage, no accident history.", "低里程，無事故紀錄。"],
    ["en", "2015 Toyota Sienna, family van", "2015年豐田Sienna家庭用車", "Great for large families, new tires.", "適合大家庭，新輪胎。"],
    ["zh", "Honda Accord, reliable commuter", "本田Accord代步車", "Fuel efficient, recently serviced.", "省油耐用，近期保養。"],
    ["en", "2020 Nissan Altima, low mileage", "2020年日產Altima，低里程", "Under warranty, non-smoker.", "保固內，無菸車主。"],
    ["zh", "Used pickup truck for sale", "二手小貨車出售", "Good for moving or hauling.", "適合搬家或載貨。"],
    ["en", "2016 Lexus RX350, luxury SUV", "2016年凌志RX350休旅車", "Leather seats, sunroof.", "真皮座椅，天窗。"],
    ["zh", "Honda Civic, fuel efficient", "本田Civic省油代步", "Great for new drivers, affordable.", "適合新手，價格親民。"],
    ["en", "2018 Mazda CX-5, like new", "2018年馬自達CX-5，近全新", "Single owner, garage kept.", "單一車主，車庫停放。"],
    ["zh", "Hyundai Elantra for sale", "現代Elantra出售", "Automatic, full airbags.", "自排，安全氣囊齊全。"],
  ],
  services: [
    ["en", "Mandarin-speaking realtor, west valley", "西谷區中文房地產經紀", "Free consultation, first-time buyer specialist.", "免費諮詢，首購族專家。"],
    ["zh", "Piano lessons, all ages welcome", "鋼琴課程，歡迎各年齡", "In-home or online lessons.", "居家或線上教學。"],
    ["en", "Immigration paperwork assistance", "移民文件協助服務", "Notary services also available.", "另提供公證服務。"],
    ["zh", "Acupuncture and TCM clinic", "中醫針灸診所", "Most insurance accepted.", "接受多數保險。"],
    ["en", "Moving and hauling, licensed and insured", "搬家貨運服務，合法保險", "Same-day service available.", "可當日服務。"],
    ["zh", "Tax preparation and bookkeeping", "報稅記帳服務", "Bilingual, specializing in small businesses.", "中英文皆可，小型企業專長。"],
    ["en", "House cleaning, weekly or bi-weekly", "居家清潔，每週或雙週", "Bonded team, free estimates.", "團隊保證，免費估價。"],
    ["zh", "Driving lessons in Mandarin", "駕照考試中文教學", "Road test accompaniment available.", "路考陪考服務。"],
    ["en", "Wedding photography, bilingual studio", "婚禮攝影，雙語工作室", "Packages starting at $800.", "方案自$800起。"],
    ["zh", "Plumbing and electrical repair", "水電維修服務", "24-hour emergency service.", "24小時緊急服務。"],
  ],
};

async function main() {
  const { data: city } = await supabase.from("cities").select("id").eq("slug", "phoenix").single();
  if (!city) throw new Error("Phoenix city not found");

  let inserted = 0;
  for (const [category, items] of Object.entries(LISTINGS)) {
    for (const [source, titleEn, titleZh, bodyEn, bodyZh] of items) {
      const { error } = await supabase.from("listings").insert({
        city_id: city.id,
        user_id: null,
        category,
        translation_source: source,
        machine_translated: true,
        status: "active",
        verified: Math.random() < 0.35,
        price: ["rentals", "homes", "cars"].includes(category)
          ? Math.floor(Math.random() * 40000) + 800
          : null,
        title_en: titleEn,
        title_zh: titleZh,
        body_en: bodyEn,
        body_zh: bodyZh,
      });
      if (error) {
        console.error(`Failed: ${titleEn}`, error.message);
      } else {
        inserted++;
      }
    }
  }
  console.log(`Inserted ${inserted} demo listings.`);
}

main();
