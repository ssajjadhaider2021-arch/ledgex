const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const AccountantProfile = require("./accountantProfile.model");

const AccountantAml = sequelize.define(
  "AccountantAml",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: { model: "Users", key: "id" },
    },
    aml_supervision_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aml_registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aml_policy_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    risk_assessment_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mlr_compliant: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    sanctions_pep_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "accountant_aml",
    timestamps: true,
  }
);

User.hasOne(AccountantAml, { foreignKey: "user_id", sourceKey: "id", onDelete: "CASCADE" });
AccountantAml.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

AccountantProfile.hasOne(AccountantAml, { foreignKey: "user_id", sourceKey: "user_id", onDelete: "CASCADE" });
AccountantAml.belongsTo(AccountantProfile, { foreignKey: "user_id", targetKey: "user_id" });

module.exports = AccountantAml;
