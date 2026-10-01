const supabase = require("../db/serverSupabase");

async function getReviewsByBookId(bookId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, review_text, star_rating, created_at, users!reviews_user_id_fkey(name)")
    .eq("book_id", bookId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data.map(({ users, ...review }) => ({ ...review, user: users }));
}

async function createReview({ userId, bookId, reviewText, starRating }) {
  const { data, error } = await supabase
    .from("reviews")
    .insert({ user_id: userId, book_id: bookId, review_text: reviewText, star_rating: starRating })
    .select("id, user_id, book_id, review_text, star_rating, created_at")
    .single();

  if (error) throw error;
  return data;
}

async function getReviewById(id) {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, user_id, book_id, review_text, star_rating, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function updateReview(id, { reviewText, starRating }) {
  const { data, error } = await supabase
    .from("reviews")
    .update({ review_text: reviewText, star_rating: starRating })
    .eq("id", id)
    .select("id, user_id, book_id, review_text, star_rating, created_at")
    .single();

  if (error) throw error;
  return data;
}

async function deleteReview(id) {
  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", id)
    .select("id, user_id, book_id, review_text, star_rating, created_at")
    .single();

  if (error) throw error;
  return data;
}

module.exports = { createReview, deleteReview, getReviewById, getReviewsByBookId, updateReview };
