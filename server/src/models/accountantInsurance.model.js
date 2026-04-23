const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const AccountantProfile = require("./accountantProfile.model");

const AccountantInsurance = sequelize.define(
  "AccountantInsurance",
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
    insurance_certificate_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "accountant_insurance",
    timestamps: true,
  }
);

User.hasOne(AccountantInsurance, { foreignKey: "user_id", sourceKey: "id", onDelete: "CASCADE" });
AccountantInsurance.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

AccountantProfile.hasOne(AccountantInsurance, { foreignKey: "user_id", sourceKey: "user_id", onDelete: "CASCADE" });
AccountantInsurance.belongsTo(AccountantProfile, { foreignKey: "user_id", targetKey: "user_id" });

module.exports = AccountantInsurance;
