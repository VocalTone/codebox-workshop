const express = require("express");
const requireAuth = require("../middleware/auth");
const {
  createUser,
  deleteUser,
  findUserById,
  getUsers,
  updateUser
} = require("../services/userService");

const router = express.Router();

function getUserId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function getUserName(value) {
  const name = typeof value === "string" ? value.trim() : "";
  return name || null;
}

router.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  const id = getUserId(req.body.id);
  const name = getUserName(req.body.name);

  if (!id || !name) {
    return res.status(400).json({ error: "A positive id and name are required" });
  }

  try {
    const user = await createUser({ id, name });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, async (req, res, next) => {
  const id = getUserId(req.params.id);
  const name = getUserName(req.body.name);

  if (!id || !name) {
    return res.status(400).json({ error: "A positive id and name are required" });
  }

  try {
    const user = await updateUser(id, name);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  const id = getUserId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "A positive id is required" });
  }

  try {
    const user = await deleteUser(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
