const express = require("express");
const router = express.Router();
const { authenticate, isAdmin } = require("../middleware/auth.middleware");
const adminAccountant = require("../controllers/adminAccountant.controller");

router.get("/accountants", authenticate, isAdmin, adminAccountant.listAccountants);
router.get("/accountants/:id", authenticate, isAdmin, adminAccountant.getAccountantById);

router.post("/accountants/:id/approve", authenticate, isAdmin, adminAccountant.approveAccountant);
router.post("/accountants/:id/reject", authenticate, isAdmin, adminAccountant.rejectAccountant);
/** @deprecated Prefer POST; kept for backward compatibility */
router.put("/accountants/:id/approve", authenticate, isAdmin, adminAccountant.approveAccountant);
router.put("/accountants/:id/reject", authenticate, isAdmin, adminAccountant.rejectAccountant);

router.patch("/accountant/verify/:userId", authenticate, isAdmin, adminAccountant.verifyAccountant);

module.exports = router;
