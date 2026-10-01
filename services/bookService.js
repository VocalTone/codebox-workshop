const supabase = require("../db/serverSupabase");

const bookFields = "id, title, author, genre, description, cover_url";

async function getBooks(filters) {
  let query = supabase.from("books").select(bookFields).order("id");

  if (filters.title) query = query.ilike("title", `%${filters.title}%`);
  if (filters.author) query = query.ilike("author", `%${filters.author}%`);
  if (filters.genre) query = query.ilike("genre", `%${filters.genre}%`);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function getBookById(id) {
  const { data, error } = await supabase
    .from("books")
    .select(`${bookFields}, booktags(tags(id, name))`)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    tags: data.booktags.map((booktag) => booktag.tags),
    booktags: undefined
  };
}

module.exports = { getBookById, getBooks };
