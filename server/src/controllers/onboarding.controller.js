const sequelize = require("../config/db");
const User = require("../models/user.model");
const OnboardingAgreement = require("../models/onboardingAgreement.model");
const RiskAssessment = require("../models/riskAssessment.model");
const {
  computeRiskScore,
  riskLevelFromScore,
} = require("../utils/riskAssessmentScore");

const AGREEMENT_CHECKBOX_FIELDS = [
  "confirmAccuracy",
  "confirmHmrcResponsibility",
  "acceptMoa",
  "acceptPrivacyPolicy",
  "acceptAml",
  "acceptLiability",
  "noAccountantAck",
  "electronicConsent",
  "agreedAll",
];

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.trim()) {
    return xf.split(",")[0].trim();
  }
  return req.ip || null;
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    onboardingCompleted: user.onboardingCompleted,
    onboardingStep: user.onboardingStep,
    fullName: user.fullName,
    agreementAccepted: user.agreementAccepted,
    agreementSignedAt: user.agreementSignedAt,
  };
}

/** Shared: POST /api/onboarding/step1 and POST /api/onboarding/agreement-step */
async function handleAgreementSubmission(req, res) {
  try {
    const body = req.body || {};

    const missingOrFalse = [];
    for (const key of AGREEMENT_CHECKBOX_FIELDS) {
      if (body[key] !== true) {
        missingOrFalse.push(key);
      }
    }
    if (missingOrFalse.length > 0) {
      return res.status(400).json({
        message: "All agreement checkboxes must be accepted (true).",
        fields: missingOrFalse,
      });
    }

    const fullNameRaw =
      (typeof body.fullName === "string" ? body.fullName.trim() : "") ||
      (typeof body.signature === "string" ? body.signature.trim() : "");
    if (!fullNameRaw) {
      return res.status(400).json({
        message: "fullName is required and cannot be empty",
      });
    }
    const fullName = fullNameRaw;

    const agreementVersion =
      typeof body.agreementVersion === "string" && body.agreementVersion.trim()
        ? body.agreementVersion.trim()
        : "v1.0";

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (Number(user.onboardingStep) !== 1) {
      return res.status(400).json({
        message: "Agreement step can only be submitted when onboarding is at step 1",
        onboardingStep: user.onboardingStep,
      });
    }

    const now = new Date();
    const ip = clientIp(req);

    await sequelize.transaction(async (t) => {
      const row = await OnboardingAgreement.findOne({
        where: { userId: user.id },
        transaction: t,
      });

      const agreementPayload = {
        agreementVersion,
        accepted: true,
        acceptedAt: now,
        confirmAccuracy: true,
        confirmHmrcResponsibility: true,
        acceptMoa: true,
        acceptPrivacyPolicy: true,
        acceptAml: true,
        acceptLiability: true,
        noAccountantAck: true,
        electronicConsent: true,
        agreedAll: true,
        fullName,
        signature: fullName,
        signedAt: now,
        ipAddress: ip,
      };

      if (row) {
        await row.update(agreementPayload, { transaction: t });
      } else {
        await OnboardingAgreement.create(
          {
            userId: user.id,
            ...agreementPayload,
          },
          { transaction: t }
        );
      }

      user.fullName = fullName;
      user.agreementAccepted = true;
      user.agreementSignedAt = now;
      user.onboardingStep = 2;
      user.onboardingCompleted = false;
      await user.save({ transaction: t });
    });

    await user.reload();

    return res.json({
      success: true,
      nextStep: 2,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("handleAgreementSubmission:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "Agreement record conflict; please retry" });
    }
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [],
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

exports.submitAgreementStep = handleAgreementSubmission;
exports.step1Agreement = handleAgreementSubmission;

exports.step2AML = async (req, res) => {
  try {
    const idDocument = req.files?.idDocument?.[0];
    const addressProof = req.files?.addressProof?.[0];
    const businessEvidence = req.files?.businessEvidence?.[0];

    if (!idDocument || !addressProof || !businessEvidence) {
      return res.status(400).json({ message: "All three documents are required" });
    }

    const pathFor = (f) => `/uploads/onboarding/${f.filename}`;

    let riskAssessment = {};
    if (typeof req.body.riskAssessment === "string" && req.body.riskAssessment.trim()) {
      try {
        riskAssessment = JSON.parse(req.body.riskAssessment);
      } catch {
        return res.status(400).json({ message: "Invalid riskAssessment JSON" });
      }
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.onboardingDocuments = {
      idDocument: pathFor(idDocument),
      addressProof: pathFor(addressProof),
      businessEvidence: pathFor(businessEvidence),
    };
    user.onboardingRiskAssessment = riskAssessment;
    user.onboardingStep = 3;
    await user.save();

    return res.json({ success: true, nextStep: 3, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/onboarding/risk-assessment
 *
 * Accepts all questionnaire fields (steps 1–4), creates or updates RiskAssessment for req.user.id,
 * then sets user.onboardingStep = 4 and user.onboardingCompleted = true.
 *
 * Step 1 — businessActivity: businessType, businessLocation, businessAge
 * Step 2 — sourceOfFunds: incomeSource, hasProofOfFunds, wealthOrigin
 * Step 3 — transaction volume: annualTurnover, transactionFrequency, highValueTransactions, cashPercentage
 * Step 4 — PEP & compliance: isPep, isPepAssociate, hasSanctions, hasAdverseMedia
 */
exports.submitRiskAssessment = async (req, res) => {
  try {
    const body = req.body || {};

    const stringFields = [
      /* step 1 */
      "businessType",
      "businessLocation",
      "businessAge",
      /* step 2 */
      "incomeSource",
      "wealthOrigin",
      /* step 3 */
      "annualTurnover",
      "transactionFrequency",
      "highValueTransactions",
      "cashPercentage",
    ];
    const trimmed = {};
    const missing = [];
    for (const key of stringFields) {
      const raw = body[key];
      if (typeof raw !== "string" || !raw.trim()) {
        missing.push(key);
      } else {
        trimmed[key] = raw.trim();
      }
    }
    if (missing.length > 0) {
      return res.status(400).json({
        message: "All fields are required",
        fields: missing,
      });
    }

    let proof = body.hasProofOfFunds;
    if (proof === "true") proof = true;
    if (proof === "false") proof = false;
    if (proof !== true && proof !== false) {
      return res.status(400).json({ message: "hasProofOfFunds must be true or false" });
    }

    const parseBool = (label) => {
      let v = body[label];
      if (v === "true") v = true;
      if (v === "false") v = false;
      return v;
    };

    const boolFields = ["isPep", "isPepAssociate", "hasSanctions", "hasAdverseMedia"];
    const bools = {};
    for (const key of boolFields) {
      const v = parseBool(key);
      if (v !== true && v !== false) {
        return res.status(400).json({ message: `${key} must be true or false` });
      }
      bools[key] = v;
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (Number(user.onboardingStep) < 3) {
      return res.status(400).json({ message: "Complete previous onboarding steps first" });
    }

    const riskScore = computeRiskScore({
      businessType: trimmed.businessType,
      businessLocation: trimmed.businessLocation,
      annualTurnover: trimmed.annualTurnover,
      highValueTransactions: trimmed.highValueTransactions,
      cashPercentage: trimmed.cashPercentage,
      isPep: bools.isPep,
      isPepAssociate: bools.isPepAssociate,
      hasSanctions: bools.hasSanctions,
      hasAdverseMedia: bools.hasAdverseMedia,
    });
    const riskLevel = riskLevelFromScore(riskScore);

    const raPayload = {
      ...trimmed,
      hasProofOfFunds: proof,
      ...bools,
      riskScore,
      riskLevel,
      completedStep: 4,
    };

    const snapshot = {
      businessType: trimmed.businessType,
      businessLocation: trimmed.businessLocation,
      businessAge: trimmed.businessAge,
      incomeSource: trimmed.incomeSource,
      hasProofOfFunds: proof,
      wealthOrigin: trimmed.wealthOrigin,
      transactionVolume: {
        turnover: trimmed.annualTurnover,
        frequency: trimmed.transactionFrequency,
        largeTransactions: trimmed.highValueTransactions,
        cashPercentage: trimmed.cashPercentage,
      },
      pepCompliance: {
        isPep: bools.isPep,
        isPepAssociate: bools.isPepAssociate,
        hasSanctions: bools.hasSanctions,
        hasAdverseMedia: bools.hasAdverseMedia,
      },
      riskScore,
      riskLevel,
    };

    await sequelize.transaction(async (t) => {
      const existing = await RiskAssessment.findOne({
        where: { userId: user.id },
        transaction: t,
      });

      if (existing) {
        await existing.update(raPayload, { transaction: t });
      } else {
        await RiskAssessment.create(
          {
            userId: user.id,
            ...raPayload,
          },
          { transaction: t }
        );
      }

      user.onboardingRiskAssessment = snapshot;
      user.onboardingStep = 4;
      user.onboardingCompleted = true;
      await user.save({ transaction: t });
    });

    await user.reload();

    return res.json({
      success: true,
      message: "Risk assessment saved. Onboarding complete.",
      riskScore,
      riskLevel,
      user: publicUser(user),
    });
  } catch (err) {
    console.error("submitRiskAssessment:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [],
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

exports.step3Questionnaire = async (req, res) => {
  try {
    const { riskAnswers } = req.body;

    if (
      riskAnswers === undefined ||
      riskAnswers === null ||
      typeof riskAnswers !== "object" ||
      Array.isArray(riskAnswers)
    ) {
      return res.status(400).json({ message: "riskAnswers must be a JSON object" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.onboardingStep < 3) {
      return res.status(400).json({ message: "Complete previous onboarding steps first" });
    }

    user.onboardingRiskAssessment = riskAnswers;
    user.onboardingCompleted = true;
    user.onboardingStep = 4;
    await user.save();

    return res.json({ success: true, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.completeOnboarding = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.onboardingCompleted = true;
    user.onboardingStep = 4;
    await user.save();

    return res.json({ message: "Onboarding complete", user: publicUser(user) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
