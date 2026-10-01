const express = require("express");
const requireAuth = require("../middleware/auth");
const { getBookById, getBooks } = require("../services/bookService");
const { createReview, getReviewsByBookId } = require("../services/reviewService");

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

router.get("/", async (req, res, next) => {
  try {
    res.json(await getBooks(req.query));
  } catch (error) {
    next(error);
  }
});

router.get("/:id/reviews", async (req, res, next) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ error: "A positive book id is required" });

  try {
    const book = await getBookById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(await getReviewsByBookId(id));
  } catch (error) {
    next(error);
  }
});

router.post("/:id/reviews", requireAuth, async (req, res, next) => {
  const id = getPositiveId(req.params.id);
  const input = getReviewInput(req.body);
  if (!id || !input) return res.status(400).json({ error: "A positive book id, review_text, and star_rating from 1 to 5 are required" });

  try {
    const book = await getBookById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    const review = await createReview({ userId: req.appUserId, bookId: id, ...input });
    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ error: "A positive book id is required" });

  try {
    const book = await getBookById(id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
