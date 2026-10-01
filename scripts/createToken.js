require("dotenv").config({ quiet: true });

const jwt = require("jsonwebtoken");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in .env before generating a token");
}

const token = jwt.sign(
  { id: 1, name: "Alex" },
  process.env.JWT_SECRET,
  { algorithm: "HS256", expiresIn: "15m" }
);

console.log(token);
