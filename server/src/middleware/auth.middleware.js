const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { getSecret } = require("../utils/jwt");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const decoded = jwt.verify(token, getSecret());
    const row = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role"],
    });
    if (!row) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = { id: row.id, email: row.email, role: row.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { authMiddleware };
