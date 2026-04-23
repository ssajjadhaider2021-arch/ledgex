const Joi = require("joi");
const AccountantProfile = require("../models/accountantProfile.model");
const AccountantProfessional = require("../models/accountantProfessional.model");
const AccountantAml = require("../models/accountantAml.model");
const AccountantInsurance = require("../models/accountantInsurance.model");
const AccountantDataProtection = require("../models/accountantDataProtection.model");
const AccountantDeclarations = require("../models/accountantDeclarations.model");
const AccountantVerificationDocuments = require("../models/accountantVerificationDocuments.model");

const ALLOWED_SERVICES = ["bookkeeping", "vat", "ct", "sa", "payroll"];

const profileSchema = Joi.object({
  legal_name: Joi.string().trim().required(),
  trading_name: Joi.string().trim().allow("", null).optional(),
  company_number_or_utr: Joi.string().trim().max(10).required(),
  address_line1: Joi.string().trim().allow("", null).optional(),
  address_line2: Joi.string().trim().allow("", null).optional(),
  city: Joi.string().trim().allow("", null).optional(),
  postcode: Joi.string().trim().allow("", null).optional(),
  contact_name: Joi.string().trim().allow("", null).optional(),
  contact_email: Joi.string().trim().email().required(),
  contact_phone: Joi.string()
    .trim()
    .pattern(/^\+[1-9]\d{7,14}$/)
    .required(),
});

const professionalSchema = Joi.object({
  professional_body: Joi.string().valid("ICAEW", "ACCA", "AAT", "CIMA", "OTHER").allow(null).optional(),
  membership_number: Joi.string().trim().required(),
  is_good_standing: Joi.boolean().valid(true).required(),
  services: Joi.array()
    .items(Joi.string().valid(...ALLOWED_SERVICES))
    .optional(),
});

const amlSchema = Joi.object({
  aml_registration_number: Joi.string().trim().allow("", null).optional(),
  mlr_compliant: Joi.boolean().valid(true).required(),
  sanctions_pep_check: Joi.boolean().valid(true).required(),
});

const insuranceSchema = Joi.object({
  insurance_certificate_file: Joi.string().trim().allow("", null).optional(),
});

const dataProtectionSchema = Joi.object({
  ico_registration_number: Joi.string().trim().required(),
  gdpr_compliant: Joi.boolean().valid(true).required(),
});

const declarationsSchema = Joi.object({
  accept_moa: Joi.boolean().valid(true).required(),
  accept_dpa: Joi.boolean().valid(true).required(),
  accept_regulatory: Joi.boolean().valid(true).required(),
});

function requireAccountant(req, res) {
  if (req.user.role !== "accountant") {
    res.status(403).json({ message: "This resource is only available for accountants" });
    return false;
  }
  return true;
}

function parseMaybeBoolean(value) {
  if (value === true || value === false) return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

function normalizeBody(body) {
  if (!body || typeof body !== "object") return {};
  const out = { ...body };
  for (const key of Object.keys(out)) {
    out[key] = parseMaybeBoolean(out[key]);
  }
  if (typeof out.services === "string") {
    try {
      out.services = JSON.parse(out.services);
    } catch {
      out.services = out.services
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return out;
}

function normalizeEmptyStringsToNull(payload) {
  const out = { ...payload };
  for (const key of Object.keys(out)) {
    if (out[key] === "") out[key] = null;
  }
  return out;
}

function validatePayload(schema, payload) {
  const { value, error } = schema.validate(payload, {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });
  if (!error) return { value };
  return {
    error: {
      message: "Validation failed",
      errors: error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      })),
    },
  };
}

async function upsertByUser(Model, userId, payload) {
  const existing = await Model.findOne({ where: { user_id: userId } });
  if (existing) {
    await existing.update(payload);
    await existing.reload();
    return { row: existing, created: false };
  }
  const row = await Model.create({ user_id: userId, ...payload });
  return { row, created: true };
}

exports.submitProfile = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const parsed = validatePayload(profileSchema, normalizeBody(req.body));
    if (parsed.error) return res.status(400).json(parsed.error);
    const payload = normalizeEmptyStringsToNull(parsed.value);

    const { row, created } = await upsertByUser(AccountantProfile, req.user.id, payload);
    return res.status(created ? 201 : 200).json({ success: true, profile: row });
  } catch (err) {
    console.error("submitProfile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.submitProfessional = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const parsed = validatePayload(professionalSchema, normalizeBody(req.body));
    if (parsed.error) return res.status(400).json(parsed.error);

    const { row, created } = await upsertByUser(
      AccountantProfessional,
      req.user.id,
      normalizeEmptyStringsToNull(parsed.value)
    );
    return res.status(created ? 201 : 200).json({ success: true, professional: row });
  } catch (err) {
    console.error("submitProfessional:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.submitAml = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const parsed = validatePayload(amlSchema, normalizeBody(req.body));
    if (parsed.error) return res.status(400).json(parsed.error);

    const payload = normalizeEmptyStringsToNull(parsed.value);
    const amlSupervision = req.files?.aml_supervision_file?.[0];
    const amlPolicy = req.files?.aml_policy_file?.[0];
    const riskAssessment = req.files?.risk_assessment_file?.[0];
    if (amlSupervision) payload.aml_supervision_file = `/uploads/accountant/${amlSupervision.filename}`;
    if (amlPolicy) payload.aml_policy_file = `/uploads/accountant/${amlPolicy.filename}`;
    if (riskAssessment) payload.risk_assessment_file = `/uploads/accountant/${riskAssessment.filename}`;

    const { row, created } = await upsertByUser(AccountantAml, req.user.id, payload);
    return res.status(created ? 201 : 200).json({ success: true, aml: row });
  } catch (err) {
    console.error("submitAml:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.submitInsurance = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const parsed = validatePayload(insuranceSchema, normalizeBody(req.body));
    if (parsed.error) return res.status(400).json(parsed.error);

    const payload = normalizeEmptyStringsToNull(parsed.value);
    const insuranceFromSingle = req.file;
    const insuranceFromFields = req.files?.insurance_certificate_file?.[0];
    const insurance = insuranceFromSingle || insuranceFromFields;
    if (insurance) {
      payload.insurance_certificate_file = `/uploads/accountant/${insurance.filename}`;
    }

    const { row, created } = await upsertByUser(AccountantInsurance, req.user.id, payload);
    return res.status(created ? 201 : 200).json({ success: true, insurance: row });
  } catch (err) {
    console.error("submitInsurance:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.submitDataProtection = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const parsed = validatePayload(dataProtectionSchema, normalizeBody(req.body));
    if (parsed.error) return res.status(400).json(parsed.error);

    const { row, created } = await upsertByUser(
      AccountantDataProtection,
      req.user.id,
      normalizeEmptyStringsToNull(parsed.value)
    );
    return res.status(created ? 201 : 200).json({ success: true, data_protection: row });
  } catch (err) {
    console.error("submitDataProtection:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.submitDeclarations = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const parsed = validatePayload(declarationsSchema, normalizeBody(req.body));
    if (parsed.error) return res.status(400).json(parsed.error);

    const { row, created } = await upsertByUser(AccountantDeclarations, req.user.id, parsed.value);
    return res.status(created ? 201 : 200).json({ success: true, declarations: row });
  } catch (err) {
    console.error("submitDeclarations:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.submitVerificationDocuments = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;

    const requiredFileFields = [
      "passport_or_license",
      "proof_of_address",
      "qualification_certificate",
      "insurance_certificate",
      "firm_registration_doc",
      "bank_statement",
      "aml_supervision_doc",
    ];
    const missing = requiredFileFields.filter((field) => !req.files?.[field]?.[0]);
    if (missing.length > 0) {
      return res.status(400).json({
        message: "Missing required files",
        fields: missing,
      });
    }

    const payload = {
      passport_or_license: `/uploads/accountant/${req.files.passport_or_license[0].filename}`,
      proof_of_address: `/uploads/accountant/${req.files.proof_of_address[0].filename}`,
      qualification_certificate: `/uploads/accountant/${req.files.qualification_certificate[0].filename}`,
      insurance_certificate: `/uploads/accountant/${req.files.insurance_certificate[0].filename}`,
      firm_registration_doc: `/uploads/accountant/${req.files.firm_registration_doc[0].filename}`,
      bank_statement: `/uploads/accountant/${req.files.bank_statement[0].filename}`,
      aml_supervision_doc: `/uploads/accountant/${req.files.aml_supervision_doc[0].filename}`,
      status: "under_review",
      submitted_at: new Date(),
      reviewed_at: null,
    };

    const practiceLicense = req.files?.practice_license?.[0];
    if (practiceLicense) {
      payload.practice_license = `/uploads/accountant/${practiceLicense.filename}`;
    }

    const { row, created } = await upsertByUser(AccountantVerificationDocuments, req.user.id, payload);
    return res.status(created ? 201 : 200).json({
      success: true,
      message: "Verification documents submitted successfully",
      verification_documents: row,
    });
  } catch (err) {
    console.error("submitVerificationDocuments:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getVerificationStatus = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;

    const row = await AccountantVerificationDocuments.findOne({
      where: { user_id: req.user.id },
      attributes: ["status", "submitted_at", "reviewed_at"],
    });

    if (!row) {
      return res.status(404).json({
        message: "Verification documents not found",
      });
    }

    return res.json({
      status: row.status,
      submitted_at: row.submitted_at,
      reviewed_at: row.reviewed_at,
    });
  } catch (err) {
    console.error("getVerificationStatus:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** Backward-compatible endpoint aliases */
exports.submitOnboarding = exports.submitProfile;
exports.updateProfile = exports.submitProfile;

exports.getProfile = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const profile = await AccountantProfile.findOne({ where: { user_id: req.user.id } });
    if (!profile) return res.status(404).json({ message: "Accountant profile not found" });
    return res.json({ success: true, profile });
  } catch (err) {
    console.error("getProfile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.signMoa = async (req, res) => {
  try {
    if (!requireAccountant(req, res)) return;
    const fullName = typeof req.body?.fullName === "string" ? req.body.fullName.trim() : "";
    const firmName = typeof req.body?.firmName === "string" ? req.body.firmName.trim() : "";
    const accepted = req.body?.accepted;

    if (!fullName || !firmName) {
      return res.status(400).json({ message: "fullName and firmName are required" });
    }
    if (accepted !== true) {
      return res.status(400).json({ message: "accepted must be true" });
    }

    // Backward-compatible Step 1: seed minimal required profile fields.
    // Remaining details are completed in onboarding step APIs.
    const profileDefaults = {
      legal_name: firmName || fullName,
      trading_name: firmName || null,
      company_number_or_utr: "PENDING",
      contact_name: fullName,
    };

    const existingProfile = await AccountantProfile.findOne({ where: { user_id: req.user.id } });
    let profile;
    if (existingProfile) {
      await existingProfile.update({
        legal_name: existingProfile.legal_name || profileDefaults.legal_name,
        trading_name: existingProfile.trading_name || profileDefaults.trading_name,
        company_number_or_utr: existingProfile.company_number_or_utr || profileDefaults.company_number_or_utr,
        contact_name: fullName,
      });
      await existingProfile.reload();
      profile = existingProfile;
    } else {
      profile = await AccountantProfile.create({
        user_id: req.user.id,
        ...profileDefaults,
      });
    }

    const existingDeclarations = await AccountantDeclarations.findOne({ where: { user_id: req.user.id } });
    if (existingDeclarations) {
      await existingDeclarations.update({ accept_moa: true });
    } else {
      await AccountantDeclarations.create({
        user_id: req.user.id,
        accept_moa: true,
        accept_dpa: null,
        accept_regulatory: null,
      });
    }

    return res.json({ success: true, profile });
  } catch (err) {
    console.error("signMoa:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
