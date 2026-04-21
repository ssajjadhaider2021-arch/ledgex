const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const OnboardingAgreement = sequelize.define(
  "OnboardingAgreement",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "Users", key: "id" },
    },
    agreementVersion: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "v1.0",
    },
    accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmAccuracy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    confirmHmrcResponsibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptMoa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptPrivacyPolicy: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptAml: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    acceptLiability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    noAccountantAck: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    electronicConsent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    agreedAll: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    /** Legacy / duplicate of fullName for older clients & DB schemas */
    signature: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    signedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ipAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "OnboardingAgreements",
  }
);

const User = require("./user.model");

User.hasOne(OnboardingAgreement, { foreignKey: "userId", onDelete: "CASCADE" });
OnboardingAgreement.belongsTo(User, { foreignKey: "userId" });

module.exports = OnboardingAgreement;
