const supabase = require("../db/serverSupabase");

async function getTbrByUserId(userId) {
  const { data, error } = await supabase
    .from("tbr")
    .select("added_at, books(id, title, author, genre, description)")
    .eq("user_id", userId)
    .order("added_at", { ascending: false });

  if (error) throw error;
  return data.map(({ books, ...entry }) => ({ ...entry, book: books }));
}

async function addToTbr(userId, bookId) {
  const { data, error } = await supabase
    .from("tbr")
    .insert({ user_id: userId, book_id: bookId })
    .select("user_id, book_id, added_at")
    .single();

  if (error) throw error;
  return data;
}

async function removeFromTbr(userId, bookId) {
  const { data, error } = await supabase
    .from("tbr")
    .delete()
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .select("user_id, book_id, added_at")
    .maybeSingle();

  if (error) throw error;
  return data;
}

module.exports = { addToTbr, getTbrByUserId, removeFromTbr };
