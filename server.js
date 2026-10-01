require("dotenv").config({ quiet: true });

const express = require("express");
const requireAuth = require("./middleware/auth");
const bookRoutes = require("./routes/books");
const reviewRoutes = require("./routes/reviews");
const tagRoutes = require("./routes/tags");
const tbrRoutes = require("./routes/tbr");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from CodeBox!");
});

app.get("/about", (req, res) => {
  res.send("This is my CodeBox app!");
});

app.get("/api/student", (req, res) => {
  res.json({
    name: "Aanya",
    major: "Computer Science",
    school: "Cal Poly"
  });
});

app.get("/api/me", requireAuth, (req, res) => {
  res.json({ id: req.user.id, name: req.user.name });
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/me/tbr", tbrRoutes);

app.use((error, req, res, next) => {
  console.error("Supabase request failed", {
    route: req.originalUrl,
    type: error.name || "UnknownError",
    code: error.code || "UNKNOWN",
    status: error.status || 500
  });

  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
