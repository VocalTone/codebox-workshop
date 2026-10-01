require("dotenv").config({ quiet: true });
const supabase = require("../db/serverSupabase");
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function findCover(book) {
  const query = new URLSearchParams({ title: book.title, author: book.author, limit: "10" });
  const response = await fetch(`https://openlibrary.org/search.json?${query}`);
  if (!response.ok) return null;
  const { docs = [] } = await response.json();
  const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  const exact = docs.find((doc) => doc.cover_i && normalize(doc.title || "") === normalize(book.title) && doc.author_name?.some((author) => normalize(author) === normalize(book.author)));
  const coverUrl = exact ? `https://covers.openlibrary.org/b/id/${exact.cover_i}-L.jpg` : null;
  if (!coverUrl) return null;
  const coverResponse = await fetch(coverUrl, { headers: { Range: "bytes=0-0" } });
  return coverResponse.ok && coverResponse.headers.get("content-type")?.startsWith("image/") ? coverUrl : null;
}

(async () => {
  const { data: books, error } = await supabase.from("books").select("id, title, author, cover_url").is("cover_url", null).order("id");
  if (error) throw error;
  for (const book of books) {
    try { const coverUrl = await findCover(book); if (coverUrl) { const { error: updateError } = await supabase.from("books").update({ cover_url: coverUrl }).eq("id", book.id); if (updateError) throw updateError; console.log(`${book.title} — found`); } else console.log(`${book.title} — no reliable cover found`); } catch { console.log(`${book.title} — no reliable cover found`); }
    await wait(350);
  }
})();
