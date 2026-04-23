const express = require("express");
const router = express.Router();
const { authenticate, isClient } = require("../middleware/auth.middleware");
const businessProfile = require("../controllers/businessProfile.controller");

router.get("/", authenticate, isClient, businessProfile.getBusinessProfile);
router.put("/step1", authenticate, isClient, businessProfile.saveBusinessProfileStep1);
router.put("/step2", authenticate, isClient, businessProfile.saveBusinessProfileStep2);
router.put("/step3", authenticate, isClient, businessProfile.saveBusinessProfileStep3);
router.put("/step4", authenticate, isClient, businessProfile.saveBusinessProfileStep4);

module.exports = router;
