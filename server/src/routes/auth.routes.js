const express = require("express");
const router = express.Router();
const { signup, verifyEmail, login, me } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/register", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/me", authMiddleware, me);

module.exports = router;