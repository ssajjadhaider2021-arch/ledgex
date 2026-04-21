/**
 * Development-only routes. Disabled when NODE_ENV=production.
 */
const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.delete("/reset-users", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).json({ message: "Not found" });
  }
  try {
    await User.destroy({ where: {}, truncate: true });
    return res.json({ message: "All users deleted", success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
