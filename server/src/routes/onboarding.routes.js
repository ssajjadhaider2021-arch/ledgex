const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth.middleware");
const { uploadOnboardingStep2 } = require("../middleware/uploadOnboardingStep2");
const onboarding = require("../controllers/onboarding.controller");

router.post("/step1", authMiddleware, onboarding.step1Agreement);
router.post("/agreement-step", authMiddleware, onboarding.submitAgreementStep);

router.post(
  "/step2",
  authMiddleware,
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

router.post("/risk-assessment", authMiddleware, onboarding.submitRiskAssessment);
router.post("/step3", authMiddleware, onboarding.step3Questionnaire);
router.post("/complete", authMiddleware, onboarding.completeOnboarding);

module.exports = router;
