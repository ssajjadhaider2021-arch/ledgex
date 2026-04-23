const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/** Pipeline / gatekeeping status for an accountant user (PostgreSQL `accountant_status`). */
const AccountantStatus = sequelize.define(
  "AccountantStatus",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    /** High-level application outcome; can mirror or supplement `accountant_profiles.status`. */
    application_status: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: "PENDING",
    },
    kyc_status: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: "pending",
    },
    aml_screening_status: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: "pending",
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "accountant_status",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["application_status"] }],
  }
);

const User = require("./user.model");

User.hasOne(AccountantStatus, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "accountantStatus",
  onDelete: "CASCADE",
});
AccountantStatus.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

module.exports = AccountantStatus;
