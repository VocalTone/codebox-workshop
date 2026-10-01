const supabase = require("../db/serverSupabase");

async function getTags() {
  const { data, error } = await supabase.from("tags").select("id, name").order("name");
  if (error) throw error;
  return data;
}

async function getTagById(id) {
  const { data, error } = await supabase.from("tags").select("id, name").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

async function getBooksByTagId(tagId) {
  const { data, error } = await supabase
    .from("booktags")
    .select("books(id, title, author, genre, description)")
    .eq("tag_id", tagId);

  if (error) throw error;
  return data.map((booktag) => booktag.books);
}

module.exports = { getBooksByTagId, getTagById, getTags };
