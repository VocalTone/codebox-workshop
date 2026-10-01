const express = require("express");
const requireAuth = require("../middleware/auth");
const { deleteReview, getReviewById, updateReview } = require("../services/reviewService");

const router = express.Router();

function getPositiveId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function getReviewInput(body) {
  const reviewText = typeof body.review_text === "string" ? body.review_text.trim() : "";
  const starRating = Number(body.star_rating);
  return reviewText && Number.isInteger(starRating) && starRating >= 1 && starRating <= 5
    ? { reviewText, starRating }
    : null;
}

router.put("/:id", requireAuth, async (req, res, next) => {
  const id = getPositiveId(req.params.id);
  const input = getReviewInput(req.body);
  if (!id || !input) return res.status(400).json({ error: "A positive review id, review_text, and star_rating from 1 to 5 are required" });

  try {
    const review = await getReviewById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.user_id !== req.appUserId) return res.status(403).json({ error: "You cannot edit this review" });
    res.json(await updateReview(id, input));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ error: "A positive review id is required" });

  try {
    const review = await getReviewById(id);
    if (!review) return res.status(404).json({ error: "Review not found" });
    if (review.user_id !== req.appUserId) return res.status(403).json({ error: "You cannot delete this review" });
    res.json(await deleteReview(id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
