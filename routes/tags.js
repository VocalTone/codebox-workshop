const express = require("express");
const { getBooksByTagId, getTagById, getTags } = require("../services/tagService");

const router = express.Router();

function getPositiveId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

router.get("/", async (req, res, next) => {
  try {
    res.json(await getTags());
  } catch (error) {
    next(error);
  }
});

router.get("/:id/books", async (req, res, next) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ error: "A positive tag id is required" });

  try {
    const tag = await getTagById(id);
    if (!tag) return res.status(404).json({ error: "Tag not found" });
    res.json(await getBooksByTagId(id));
  } catch (error) {
    next(error);
  }
});

module.exports = router;
