require("dotenv").config({ quiet: true });

const express = require("express");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use("/api/users", userRoutes);

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
