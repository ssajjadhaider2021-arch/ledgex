const jwt = require("jsonwebtoken");

function getSecret() {
  return process.env.JWT_SECRET || "dev_secret";
}

function getCookieName() {
  return process.env.JWT_COOKIE_NAME || "ledgex_token";
}

function getCookieOptions() {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
}

function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

module.exports = { generateToken, getSecret, getCookieName, getCookieOptions };
