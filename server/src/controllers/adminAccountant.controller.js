const AccountantProfile = require("../models/accountantProfile.model");
const User = require("../models/user.model");
const AccountantDocument = require("../models/accountantDocuments.model");
const AccountantCompliance = require("../models/accountantCompliance.model");
const AccountantStatus = require("../models/accountantStatus.model");
const AccountantProfessional = require("../models/accountantProfessional.model");
const AccountantAml = require("../models/accountantAml.model");
const AccountantInsurance = require("../models/accountantInsurance.model");
const AccountantDataProtection = require("../models/accountantDataProtection.model");
const AccountantDeclarations = require("../models/accountantDeclarations.model");
const AccountantVerificationDocuments = require("../models/accountantVerificationDocuments.model");

function parseProfileId(req, res) {
  const raw = req.params.id;
  const id = Number.parseInt(raw, 10);
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ message: "Invalid accountant profile id" });
    return null;
  }
  return id;
}

function parseUserId(req, res) {
  const raw = req.params.userId;
  const id = Number.parseInt(raw, 10);
  if (!Number.isFinite(id) || id <= 0) {
    res.status(400).json({ message: "Invalid user id" });
    return null;
  }
  return id;
}

/** Nested User includes for admin detail view */
function userDetailIncludes() {
  return [
    { model: AccountantDocument, as: "accountantDocuments", required: false },
    { model: AccountantCompliance, as: "accountantCompliance", required: false },
    { model: AccountantStatus, as: "accountantStatus", required: false },
    { model: AccountantProfessional, required: false },
    { model: AccountantAml, required: false },
    { model: AccountantInsurance, required: false },
    { model: AccountantDataProtection, required: false },
    { model: AccountantDeclarations, required: false },
    { model: AccountantVerificationDocuments, required: false },
  ];
}

async function syncAccountantStatusRow(userId, { application_status, rejection_reason }) {
  let row = await AccountantStatus.findOne({ where: { user_id: userId } });
  if (!row) {
    row = await AccountantStatus.create({
      user_id: userId,
      application_status,
      rejection_reason: rejection_reason ?? null,
      reviewed_at: new Date(),
    });
    return;
  }
  await row.update({
    application_status,
    rejection_reason: rejection_reason ?? null,
    reviewed_at: new Date(),
  });
}

/** GET /api/admin/accountants — all accountant profiles with user + pipeline status */
exports.listAccountants = async (req, res) => {
  try {
    const profiles = await AccountantProfile.findAll({
      include: [
        {
          model: User,
          where: { role: "accountant" },
          attributes: [
            "id",
            "email",
            "fullName",
            "role",
            "isVerified",
            "is_accountant_approved",
            "amlStatus",
            "createdAt",
            "updatedAt",
          ],
          required: true,
          include: [{ model: AccountantStatus, as: "accountantStatus", required: false }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.json({
      accountants: profiles,
      count: profiles.length,
    });
  } catch (err) {
    console.error("listAccountants:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** GET /api/admin/accountants/:id — profile + user + related accountant tables */
exports.getAccountantById = async (req, res) => {
  try {
    const id = parseProfileId(req, res);
    if (id == null) return;

    const profile = await AccountantProfile.findByPk(id, {
      include: [
        {
          model: User,
          attributes: { exclude: ["password", "verificationCode"] },
          include: userDetailIncludes(),
        },
      ],
    });

    if (!profile) {
      return res.status(404).json({ message: "Accountant profile not found" });
    }

    return res.json({
      success: true,
      accountant: profile,
    });
  } catch (err) {
    console.error("getAccountantById:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** POST/PUT /api/admin/accountants/:id/approve */
exports.approveAccountant = async (req, res) => {
  try {
    const id = parseProfileId(req, res);
    if (id == null) return;

    const profile = await AccountantProfile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: "Accountant profile not found" });
    }

    if (profile.status !== "PENDING") {
      return res.status(400).json({
        message: "Only profiles with status PENDING can be approved",
        currentStatus: profile.status,
      });
    }

    const userId = profile.user_id;

    await profile.update({ status: "APPROVED", rejectionReason: null });
    await User.update({ is_accountant_approved: true }, { where: { id: userId } });
    await syncAccountantStatusRow(userId, {
      application_status: "APPROVED",
      rejection_reason: null,
    });

    await profile.reload({
      include: [{ model: User, attributes: ["id", "email", "fullName"] }],
    });

    return res.json({
      success: true,
      message: "Accountant approved",
      profile,
    });
  } catch (err) {
    console.error("approveAccountant:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** POST/PUT /api/admin/accountants/:id/reject */
exports.rejectAccountant = async (req, res) => {
  try {
    const id = parseProfileId(req, res);
    if (id == null) return;

    const profile = await AccountantProfile.findByPk(id);
    if (!profile) {
      return res.status(404).json({ message: "Accountant profile not found" });
    }

    if (profile.status !== "PENDING") {
      return res.status(400).json({
        message: "Only profiles with status PENDING can be rejected",
        currentStatus: profile.status,
      });
    }

    const reason =
      typeof req.body?.reason === "string" && req.body.reason.trim()
        ? req.body.reason.trim()
        : null;

    const userId = profile.user_id;

    await profile.update({ status: "REJECTED", rejectionReason: reason });
    await User.update({ is_accountant_approved: false }, { where: { id: userId } });
    await syncAccountantStatusRow(userId, {
      application_status: "REJECTED",
      rejection_reason: reason,
    });

    await profile.reload({
      include: [{ model: User, attributes: ["id", "email", "fullName"] }],
    });

    return res.json({
      success: true,
      message: "Accountant rejected",
      profile,
    });
  } catch (err) {
    console.error("rejectAccountant:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/** PATCH /api/admin/accountant/verify/:userId */
exports.verifyAccountant = async (req, res) => {
  try {
    const userId = parseUserId(req, res);
    if (userId == null) return;

    const status = typeof req.body?.status === "string" ? req.body.status.trim().toLowerCase() : "";
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "status must be approved or rejected" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const docs = await AccountantVerificationDocuments.findOne({ where: { user_id: userId } });
    if (!docs) {
      return res.status(404).json({ message: "Verification documents not found" });
    }

    if (status === "approved") {
      await docs.update({ status: "approved", reviewed_at: new Date(), rejection_reason: null });
      await user.update({ is_accountant_approved: true });
    } else {
      await docs.update({ status: "rejected", reviewed_at: new Date() });
      await user.update({ is_accountant_approved: false });
    }

    await docs.reload();
    await user.reload();

    return res.json({
      success: true,
      verification: {
        user_id: userId,
        status: docs.status,
        reviewed_at: docs.reviewed_at,
      },
      user: {
        id: user.id,
        is_accountant_approved: user.is_accountant_approved,
      },
    });
  } catch (err) {
    console.error("verifyAccountant:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
