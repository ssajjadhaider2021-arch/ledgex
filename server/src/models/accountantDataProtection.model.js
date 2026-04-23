const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const AccountantProfile = require("./accountantProfile.model");

const AccountantDataProtection = sequelize.define(
  "AccountantDataProtection",
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
    ico_registration_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gdpr_compliant: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "accountant_data_protection",
    timestamps: true,
  }
);

User.hasOne(AccountantDataProtection, { foreignKey: "user_id", sourceKey: "id", onDelete: "CASCADE" });
AccountantDataProtection.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

AccountantProfile.hasOne(AccountantDataProtection, { foreignKey: "user_id", sourceKey: "user_id", onDelete: "CASCADE" });
AccountantDataProtection.belongsTo(AccountantProfile, { foreignKey: "user_id", targetKey: "user_id" });

module.exports = AccountantDataProtection;
