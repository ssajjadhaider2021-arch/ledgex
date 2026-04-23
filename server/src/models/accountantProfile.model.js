const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AccountantProfile = sequelize.define(
  "AccountantProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      field: "userId",
      allowNull: false,
      unique: true,
      references: { model: "Users", key: "id" },
    },
    legal_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trading_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company_number_or_utr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_line1: { type: DataTypes.STRING, allowNull: true },
    address_line2: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true },
    postcode: { type: DataTypes.STRING, allowNull: true },
    contact_name: { type: DataTypes.STRING, allowNull: true },
    contact_email: { type: DataTypes.STRING, allowNull: true },
    contact_phone: { type: DataTypes.STRING, allowNull: true },
    status: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: "PENDING",
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "rejection_reason",
    },
  },
  {
    tableName: "accountant_profiles",
    timestamps: true,
  }
);

const User = require("./user.model");

User.hasOne(AccountantProfile, { foreignKey: "user_id", sourceKey: "id", onDelete: "CASCADE" });
AccountantProfile.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

module.exports = AccountantProfile;
