const express = require("express");
const router = express.Router();
const { signup, verifyEmail, login, logout, me } = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");

router.post("/signup", signup);
router.post("/register", signup);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticate, me);

module.exports = router;