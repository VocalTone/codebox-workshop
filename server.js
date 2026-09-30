require("dotenv").config();

const express = require("express");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Peter Piper picked a peck of pickled peppers.");
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

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
