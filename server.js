const express = require("express");

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Peter Piper picked a peck of pickled peppers.");
});

app.get("/about", (req, res) => {
  res.send("This is my CodeBox app!");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
