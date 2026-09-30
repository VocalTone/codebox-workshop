const express = require("express");
const { getUsers, findUserById } = require("../services/userService");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(getUsers());
});

router.get("/:id", (req, res) => {
  const user = findUserById(req.params.id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

module.exports = router;
