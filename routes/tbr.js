const express = require("express");
const requireAuth = require("../middleware/auth");
const { getBookById } = require("../services/bookService");
const { addToTbr, getTbrByUserId, removeFromTbr } = require("../services/tbrService");

const router = express.Router();

function getPositiveId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    res.json(await getTbrByUserId(req.appUserId));
  } catch (error) {
    next(error);
  }
});

router.post("/:bookId", async (req, res, next) => {
  const bookId = getPositiveId(req.params.bookId);
  if (!bookId) return res.status(400).json({ error: "A positive book id is required" });

  try {
    const book = await getBookById(bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });
    const entry = await addToTbr(req.appUserId, bookId);
    res.status(201).json(entry);
  } catch (error) {
    if (error.code === "23505") return res.status(409).json({ error: "Book is already in your TBR" });
    next(error);
  }
});

router.delete("/:bookId", async (req, res, next) => {
  const bookId = getPositiveId(req.params.bookId);
  if (!bookId) return res.status(400).json({ error: "A positive book id is required" });

  try {
    const entry = await removeFromTbr(req.appUserId, bookId);
    if (!entry) return res.status(404).json({ error: "Book is not in your TBR" });
    res.json(entry);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
