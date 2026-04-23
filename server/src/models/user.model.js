const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verificationCode: { type: DataTypes.STRING },
  fullName: { type: DataTypes.STRING, allowNull: true },
  agreementAccepted: { type: DataTypes.BOOLEAN, defaultValue: false },
  agreementSignedAt: { type: DataTypes.DATE, allowNull: true },
  onboardingCompleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  onboardingStep: { type: DataTypes.INTEGER, defaultValue: 1 },
  onboardingDocuments: { type: DataTypes.JSON, allowNull: true },
  onboardingRiskAssessment: { type: DataTypes.JSON, allowNull: true },
  amlStatus: { type: DataTypes.STRING, defaultValue: "pending" },
  is_accountant_approved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
});

module.exports = User;
