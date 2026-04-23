const express = require("express");
const router = express.Router();
const { authenticate, isAccountant } = require("../middleware/auth.middleware");
const { singleUpload, fieldsUpload } = require("../middleware/uploadAccountantDocs");
const accountant = require("../controllers/accountant.controller");

router.post("/moa-sign", authenticate, isAccountant, accountant.signMoa);
router.post("/onboarding", authenticate, isAccountant, accountant.submitOnboarding);
router.post("/profile", authenticate, isAccountant, accountant.submitProfile);
router.post("/professional", authenticate, isAccountant, accountant.submitProfessional);
router.post(
  "/aml",
  authenticate,
  isAccountant,
  fieldsUpload([
    { name: "aml_supervision_file", maxCount: 1 },
    { name: "aml_policy_file", maxCount: 1 },
    { name: "risk_assessment_file", maxCount: 1 },
  ]),
  accountant.submitAml
);
router.post("/insurance", authenticate, isAccountant, singleUpload("insurance_certificate_file"), accountant.submitInsurance);
router.post("/data-protection", authenticate, isAccountant, accountant.submitDataProtection);
router.post("/declarations", authenticate, isAccountant, accountant.submitDeclarations);
router.post(
  "/verification-documents",
  authenticate,
  isAccountant,
  fieldsUpload([
    { name: "passport_or_license", maxCount: 1 },
    { name: "proof_of_address", maxCount: 1 },
    { name: "qualification_certificate", maxCount: 1 },
    { name: "insurance_certificate", maxCount: 1 },
    { name: "firm_registration_doc", maxCount: 1 },
    { name: "practice_license", maxCount: 1 },
    { name: "bank_statement", maxCount: 1 },
    { name: "aml_supervision_doc", maxCount: 1 },
  ]),
  accountant.submitVerificationDocuments
);
router.get("/verification-status", authenticate, isAccountant, accountant.getVerificationStatus);
router.get("/profile", authenticate, isAccountant, accountant.getProfile);
router.put("/profile", authenticate, isAccountant, accountant.updateProfile);

module.exports = router;
