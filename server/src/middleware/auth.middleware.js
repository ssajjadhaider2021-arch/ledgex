const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AccountantProfile = require("../models/accountantProfile.model");
const { getCookieName, getSecret } = require("../utils/jwt");

/**
 * Authenticate request from JWT cookie (with bearer fallback for backward compatibility).
 * Attaches `req.user` and, for accountants, `req.accountantProfile`.
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length).trim() : null;
  const cookieToken = req.cookies?.[getCookieName()];
  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, getSecret());
    const row = await User.findByPk(decoded.id, {
      attributes: ["id", "email", "role"],
    });
    if (!row) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: row.id, email: row.email, role: row.role };
    req.accountantProfile = null;

    if (row.role === "accountant") {
      const profile = await AccountantProfile.findOne({
        where: { user_id: row.id },
      });
      req.accountantProfile = profile;
    }

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function ensureRole(role, message) {
  return function roleGuard(req, res, next) {
    if (req.user?.role !== role) {
      return res.status(403).json({ message });
    }
    return next();
  };
}

/** Use after authenticate — only users with role "admin". */
const isAdmin = ensureRole("admin", "Admin access required");
/** Use after authenticate — only users with role "accountant". */
const isAccountant = ensureRole("accountant", "Accountant access required");
/** Use after authenticate — only users with role "client". */
const isClient = ensureRole("client", "Client access required");

/**
 * Use after authMiddleware on routes that should mimic “dashboard” access for accountants.
 * Non-accountants pass through unchanged.
 *
 * Accountant rules:
 * - No profile → 403 ACCOUNTANT_PROFILE_MISSING (complete onboarding first)
 * - PENDING → 403 ACCOUNTANT_PENDING (“waiting approval”)
 * - REJECTED → 403 ACCOUNTANT_REJECTED
 * - APPROVED → next()
 *
 * Do not attach this to accountant onboarding/profile APIs (those must work while PENDING).
 */
function requireAccountantDashboardAccess(req, res, next) {
  if (req.user?.role !== "accountant") {
    return next();
  }

  const profile = req.accountantProfile;

  if (!profile) {
    return res.status(403).json({
      code: "ACCOUNTANT_PROFILE_MISSING",
      message:
        "Complete your accountant onboarding and submit your profile for approval before accessing the dashboard.",
    });
  }

  if (profile.status === "PENDING") {
    return res.status(403).json({
      code: "ACCOUNTANT_PENDING",
      message:
        "Your accountant application is awaiting approval. You will have full access once it is approved.",
    });
  }

  if (profile.status === "REJECTED") {
    return res.status(403).json({
      code: "ACCOUNTANT_REJECTED",
      message:
        "Your accountant application was not approved. Contact support if you believe this is an error.",
    });
  }

  if (profile.status === "APPROVED") {
    return next();
  }

  return res.status(403).json({
    code: "ACCOUNTANT_STATUS_UNKNOWN",
    message: "Unable to verify accountant access.",
  });
}

module.exports = {
  authenticate,
  isAdmin,
  isAccountant,
  isClient,
  // Backward-compatible aliases
  authMiddleware: authenticate,
  requireAdmin: isAdmin,
  requireAccountantDashboardAccess,
};
