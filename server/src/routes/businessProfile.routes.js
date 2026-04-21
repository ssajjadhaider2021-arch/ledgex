const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const businessProfile = require("../controllers/businessProfile.controller");

router.get("/", authMiddleware, businessProfile.getBusinessProfile);
router.put("/step1", authMiddleware, businessProfile.saveBusinessProfileStep1);
router.put("/step2", authMiddleware, businessProfile.saveBusinessProfileStep2);
router.put("/step3", authMiddleware, businessProfile.saveBusinessProfileStep3);
router.put("/step4", authMiddleware, businessProfile.saveBusinessProfileStep4);

module.exports = router;
