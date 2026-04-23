const express = require("express");
const router = express.Router();
const { authenticate, isClient } = require("../middleware/auth.middleware");
const { uploadOnboardingStep2 } = require("../middleware/uploadOnboardingStep2");
const onboarding = require("../controllers/onboarding.controller");

router.post("/step1", authenticate, isClient, onboarding.step1Agreement);
router.post("/agreement-step", authenticate, isClient, onboarding.submitAgreementStep);

router.post(
  "/step2",
  authenticate,
  isClient,
  (req, res, next) => {
    uploadOnboardingStep2(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "Each file must be 10MB or smaller" });
        }
        return res.status(400).json({ message: err.message || "Upload failed" });
      }
      next();
    });
  },
  onboarding.step2AML
);

router.post("/risk-assessment", authenticate, isClient, onboarding.submitRiskAssessment);
router.post("/step3", authenticate, isClient, onboarding.step3Questionnaire);
router.post("/complete", authenticate, isClient, onboarding.completeOnboarding);

module.exports = router;
