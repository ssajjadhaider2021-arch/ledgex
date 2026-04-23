const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/** One row per accountant user — regulatory / compliance snapshot (PostgreSQL `accountant_compliance`). */
const AccountantCompliance = sequelize.define(
  "AccountantCompliance",
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
    aml_supervisory_body: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    aml_registration_reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pi_cover_currency: {
      type: DataTypes.STRING(8),
      allowNull: true,
      defaultValue: "GBP",
    },
    pi_cover_amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: true,
    },
    pi_certificate_expires_on: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ico_registration_number: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    gdpr_controls_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_compliance_review_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    extra: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "accountant_compliance",
    timestamps: true,
    underscored: true,
  }
);

const User = require("./user.model");

User.hasOne(AccountantCompliance, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "accountantCompliance",
  onDelete: "CASCADE",
});
AccountantCompliance.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

module.exports = AccountantCompliance;
