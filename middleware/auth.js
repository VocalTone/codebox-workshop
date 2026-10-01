const jwt = require("jsonwebtoken");

const secret = process.env.APP_JWT_SECRET || process.env.JWT_SECRET;
if (!secret) throw new Error("APP_JWT_SECRET must be set in .env before starting the server");

function requireAuth(req, res, next) {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const user = jwt.verify(authorization.slice(7), secret, { algorithms: ["HS256"] });
    if (!user.user_id || !user.username) return res.status(401).json({ error: "Invalid or expired token" });
    req.user = user;
    req.appUserId = user.user_id;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = requireAuth;
