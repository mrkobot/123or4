import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

async function uploadPlaceholder(seed, index) {
  const res = await fetch(`https://picsum.photos/seed/${seed}-${index}/800/600`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const path = `demo/${seed}-${index}.jpg`;
  const { error } = await supabase.storage
    .from("photos")
    .upload(path, buffer, { contentType: "image/jpeg", upsert: true });
  if (error) {
    console.error(`Upload failed for ${path}`, error.message);
    return null;
  }
  const { data } = supabase.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}

async function main() {
  // Listings: give the first a few 0/1/many photos to show all cases.
  const { data: listings } = await supabase
    .from("listings")
    .select("id, title_en")
    .order("created_at", { ascending: false })
    .limit(6);

  if (listings) {
    // First listing: no photos (leave as-is, demonstrates the no-image case).
    // Second: one photo.
    if (listings[1]) {
      const url = await uploadPlaceholder(`listing-${listings[1].id}`, 0);
      if (url) {
        await supabase.from("listings").update({ photos: [url] }).eq("id", listings[1].id);
        console.log(`1 photo -> ${listings[1].title_en}`);
      }
    }
    // Third: three photos (carousel).
    if (listings[2]) {
      const urls = [];
      for (let i = 0; i < 3; i++) {
        const url = await uploadPlaceholder(`listing-${listings[2].id}`, i);
        if (url) urls.push(url);
      }
      await supabase.from("listings").update({ photos: urls }).eq("id", listings[2].id);
      console.log(`${urls.length} photos -> ${listings[2].title_en}`);
    }
  }

  // Restaurants: give each one 2-3 photos since Best Eats always comes with photos.
  const { data: restaurants } = await supabase.from("restaurants").select("id, name_en");

  if (restaurants) {
    for (const r of restaurants) {
      const count = 2 + Math.floor(Math.random() * 2);
      const urls = [];
      for (let i = 0; i < count; i++) {
        const url = await uploadPlaceholder(`restaurant-${r.id}`, i);
        if (url) urls.push(url);
      }
      await supabase.from("restaurants").update({ photos: urls }).eq("id", r.id);
      console.log(`${urls.length} photos -> ${r.name_en}`);
    }
  }
}

main();
