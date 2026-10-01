const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findForLogin, register } = require("../services/localAuthService");

const router = express.Router();
const secret = process.env.APP_JWT_SECRET || process.env.JWT_SECRET;
const validUsername = /^[a-zA-Z0-9_-]{3,30}$/;
function publicUser(user) { return { user_id: user.user_id, username: user.username, name: user.name }; }
function issue(user) { return jwt.sign({ user_id: user.user_id, username: user.username }, secret, { algorithm: "HS256", expiresIn: "12h" }); }
function input(body) { const username = typeof body.username === "string" ? body.username.trim().toLowerCase() : ""; const password = typeof body.password === "string" ? body.password : ""; const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : ""; return validUsername.test(username) && password.length >= 8 ? { username, password, name } : null; }

router.post("/register", async (req, res, next) => { const values = input(req.body); if (!values) return res.status(400).json({ error: "Use a 3–30 character username (letters, numbers, _ or -) and an 8+ character password." }); try { const user = await register(values); res.status(201).json({ user: publicUser(user), token: issue(user) }); } catch (error) { if (error.code === "23505") return res.status(409).json({ error: "That username is already taken." }); next(error); } });
router.post("/login", async (req, res, next) => { const username = typeof req.body.username === "string" ? req.body.username.trim().toLowerCase() : ""; const password = typeof req.body.password === "string" ? req.body.password : ""; try { const user = await findForLogin(username); if (!user || !user.password_hash || !(await bcrypt.compare(password, user.password_hash))) return res.status(401).json({ error: "Invalid username or password." }); res.json({ user: publicUser(user), token: issue(user) }); } catch (error) { next(error); } });
router.post("/logout", (_req, res) => res.status(204).end());
module.exports = router;
