const sequelize = require("../config/db");
const BusinessProfile = require("../models/businessProfile.model");

const ALLOWED_CLIENT_TYPES = new Set(["ltd", "llp", "sole_trader", "partnership", "landlord"]);
const VAT_FILING_FREQUENCIES = new Set(["monthly", "quarterly", "annually"]);
const COMPANIES_HOUSE_REGEX = /^[A-Z]{2}[0-9]{6}$/;
const UTR_REGEX = /^[0-9]{10}$/;

function normalizeCompaniesHouseNumber(raw) {
  if (typeof raw !== "string") return "";
  return raw.trim().replace(/\s+/g, "").toUpperCase();
}

function normalizeUtr(raw) {
  if (typeof raw !== "string") return "";
  return raw.trim().replace(/\D/g, "");
}

function parseBool(body, key) {
  let v = body[key];
  if (v === "true") return true;
  if (v === "false") return false;
  return v;
}

function requireClient(req, res) {
  if (req.user.role !== "client") {
    res.status(403).json({ message: "Business profile is only available for clients" });
    return false;
  }
  return true;
}

exports.getBusinessProfile = async (req, res) => {
  try {
    if (!requireClient(req, res)) return;
    const row = await BusinessProfile.findOne({ where: { userId: req.user.id } });
    return res.json({ profile: row });
  } catch (err) {
    console.error("getBusinessProfile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** PUT step 1: clientType, companiesHouseNumber (ltd only), utrNumber */
exports.saveBusinessProfileStep1 = async (req, res) => {
  try {
    if (!requireClient(req, res)) return;
    const body = req.body || {};

    const clientType = typeof body.clientType === "string" ? body.clientType.trim().toLowerCase() : "";
    if (!clientType || !ALLOWED_CLIENT_TYPES.has(clientType)) {
      return res.status(400).json({ message: "clientType is invalid or missing" });
    }

    const utrNumber = normalizeUtr(body.utrNumber);
    if (!UTR_REGEX.test(utrNumber)) {
      return res.status(400).json({ message: "utrNumber must be exactly 10 digits" });
    }

    let companiesHouseNumber = null;
    if (clientType === "ltd") {
      companiesHouseNumber = normalizeCompaniesHouseNumber(body.companiesHouseNumber);
      if (!companiesHouseNumber) {
        return res.status(400).json({ message: "companiesHouseNumber is required for Limited Company" });
      }
      if (!COMPANIES_HOUSE_REGEX.test(companiesHouseNumber)) {
        return res.status(400).json({
          message: "companiesHouseNumber must match format e.g. SC123456 (two letters + six digits)",
        });
      }
    }

    await sequelize.transaction(async (t) => {
      const existing = await BusinessProfile.findOne({
        where: { userId: req.user.id },
        transaction: t,
      });

      const payload = {
        clientType,
        utrNumber,
        companiesHouseNumber,
        completedStep: Math.max(existing?.completedStep ?? 1, 2),
      };

      if (existing) {
        await existing.update(payload, { transaction: t });
      } else {
        await BusinessProfile.create(
          {
            userId: req.user.id,
            ...payload,
          },
          { transaction: t }
        );
      }
    });

    const profile = await BusinessProfile.findOne({ where: { userId: req.user.id } });

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("saveBusinessProfileStep1:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [],
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

/** PUT step 2: VAT — isVatRegistered, vatNumber (if registered), vatFilingFrequency (if registered) */
exports.saveBusinessProfileStep2 = async (req, res) => {
  try {
    if (!requireClient(req, res)) return;
    const body = req.body || {};

    const isVatRegistered = parseBool(body, "isVatRegistered");
    if (isVatRegistered !== true && isVatRegistered !== false) {
      return res.status(400).json({ message: "isVatRegistered must be true or false" });
    }

    let vatNumber = null;
    let vatFilingFrequency = null;

    if (isVatRegistered) {
      const vn = typeof body.vatNumber === "string" ? body.vatNumber.trim() : "";
      if (!vn) {
        return res.status(400).json({ message: "vatNumber is required when VAT registered" });
      }
      vatNumber = vn;

      const freq =
        typeof body.vatFilingFrequency === "string" ? body.vatFilingFrequency.trim().toLowerCase() : "";
      if (!VAT_FILING_FREQUENCIES.has(freq)) {
        return res.status(400).json({
          message: "vatFilingFrequency must be one of: monthly, quarterly, annually",
        });
      }
      vatFilingFrequency = freq;
    }

    const existing = await BusinessProfile.findOne({ where: { userId: req.user.id } });
    if (!existing || !existing.clientType) {
      return res.status(400).json({ message: "Complete step 1 before step 2" });
    }

    await sequelize.transaction(async (t) => {
      await existing.update(
        {
          isVatRegistered,
          vatNumber,
          vatFilingFrequency,
          completedStep: Math.max(existing.completedStep ?? 1, 3),
        },
        { transaction: t }
      );
    });

    const profile = await BusinessProfile.findOne({ where: { userId: req.user.id } });

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("saveBusinessProfileStep2:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [],
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

/** PUT step 3: payroll / PAYE / CIS — booleans required; payeReference optional */
exports.saveBusinessProfileStep3 = async (req, res) => {
  try {
    if (!requireClient(req, res)) return;
    const body = req.body || {};

    const isPayrollActive = parseBool(body, "isPayrollActive");
    const isCisRegistered = parseBool(body, "isCisRegistered");
    if (isPayrollActive !== true && isPayrollActive !== false) {
      return res.status(400).json({ message: "isPayrollActive must be true or false" });
    }
    if (isCisRegistered !== true && isCisRegistered !== false) {
      return res.status(400).json({ message: "isCisRegistered must be true or false" });
    }

    const payeRaw = typeof body.payeReference === "string" ? body.payeReference.trim() : "";
    const payeReference = payeRaw || null;

    const existing = await BusinessProfile.findOne({ where: { userId: req.user.id } });
    if (!existing || !existing.clientType || Number(existing.completedStep) < 3) {
      return res.status(400).json({ message: "Complete step 2 before step 3" });
    }

    await sequelize.transaction(async (t) => {
      await existing.update(
        {
          isPayrollActive,
          payeReference,
          isCisRegistered,
          completedStep: Math.max(existing.completedStep ?? 1, 4),
        },
        { transaction: t }
      );
    });

    const profile = await BusinessProfile.findOne({ where: { userId: req.user.id } });

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("saveBusinessProfileStep3:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [],
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

function isValidDateOnlyString(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s.trim())) return false;
  const parts = s.trim().split("-").map(Number);
  const [y, m, d] = parts;
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function normalizeDirectors(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((x) => (typeof x === "string" ? x.trim() : String(x ?? "").trim()))
    .filter(Boolean);
}

/** PUT step 4: bookkeeping — accountsStartDate, directors[], checkboxes */
exports.saveBusinessProfileStep4 = async (req, res) => {
  try {
    if (!requireClient(req, res)) return;
    const body = req.body || {};

    const dateRaw = typeof body.accountsStartDate === "string" ? body.accountsStartDate.trim() : "";
    if (!dateRaw || !isValidDateOnlyString(dateRaw)) {
      return res.status(400).json({ message: "accountsStartDate must be a valid date (YYYY-MM-DD)" });
    }
    const accountsStartDate = dateRaw;

    const directors = normalizeDirectors(body.directors);
    if (directors.length < 1) {
      return res.status(400).json({ message: "At least one director or partner name is required" });
    }

    let hasFixedAssets = parseBool(body, "hasFixedAssets");
    let hasDirectorsLoanAccount = parseBool(body, "hasDirectorsLoanAccount");
    if (hasFixedAssets !== true && hasFixedAssets !== false) hasFixedAssets = false;
    if (hasDirectorsLoanAccount !== true && hasDirectorsLoanAccount !== false) hasDirectorsLoanAccount = false;

    const existing = await BusinessProfile.findOne({ where: { userId: req.user.id } });
    if (!existing || !existing.clientType || Number(existing.completedStep) < 4) {
      return res.status(400).json({ message: "Complete step 3 before step 4" });
    }

    await sequelize.transaction(async (t) => {
      await existing.update(
        {
          accountsStartDate,
          directors,
          hasFixedAssets,
          hasDirectorsLoanAccount,
          completedStep: Math.max(existing.completedStep ?? 1, 5),
        },
        { transaction: t }
      );
    });

    const profile = await BusinessProfile.findOne({ where: { userId: req.user.id } });

    return res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("saveBusinessProfileStep4:", err);
    if (err.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: err.errors?.map((e) => ({ field: e.path, message: e.message })) || [],
      });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
