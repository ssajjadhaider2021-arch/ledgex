const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BusinessProfile = sequelize.define(
  "BusinessProfile",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "Users", key: "id" },
    },
    /** Step 1: Business Type & Company Details */
    clientType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companiesHouseNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    utrNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    /** Step 2: VAT */
    isVatRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    vatNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vatFilingFrequency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    /** Step 3: Other Registration */
    isPayrollActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    payeReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isCisRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    /** Step 4: Bookkeeping */
    accountsStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    directors: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    hasFixedAssets: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    hasDirectorsLoanAccount: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    completedStep: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "BusinessProfiles",
  }
);

const User = require("./user.model");

User.hasOne(BusinessProfile, { foreignKey: "userId", onDelete: "CASCADE" });
BusinessProfile.belongsTo(User, { foreignKey: "userId" });

module.exports = BusinessProfile;
