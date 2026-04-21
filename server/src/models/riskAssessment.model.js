const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const RiskAssessment = sequelize.define(
  "RiskAssessment",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "Users", key: "id" },
    },
    /** Step 1: Business Activity */
    businessType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    businessAge: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    /** Step 2: Source of Funds */
    incomeSource: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    hasProofOfFunds: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    wealthOrigin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    /** Step 3: Transaction Volume */
    annualTurnover: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transactionFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    highValueTransactions: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cashPercentage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    /** Step 4: PEP & Compliance */
    isPep: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isPepAssociate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    hasSanctions: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    hasAdverseMedia: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    riskScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    riskLevel: {
      type: DataTypes.STRING(16),
      allowNull: true,
    },
    completedStep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "RiskAssessments",
  }
);

const User = require("./user.model");

User.hasOne(RiskAssessment, { foreignKey: "userId", onDelete: "CASCADE" });
RiskAssessment.belongsTo(User, { foreignKey: "userId" });

module.exports = RiskAssessment;
