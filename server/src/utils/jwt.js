const jwt = require("jsonwebtoken");

function getSecret() {
  return process.env.JWT_SECRET || "dev_secret";
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

module.exports = { generateToken, getSecret };
