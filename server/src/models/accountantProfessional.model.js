const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const AccountantProfile = require("./accountantProfile.model");

const AccountantProfessional = sequelize.define(
  "AccountantProfessional",
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
    professional_body: {
      type: DataTypes.ENUM("ICAEW", "ACCA", "AAT", "CIMA", "OTHER"),
      allowNull: true,
    },
    membership_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_good_standing: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    services: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: "accountant_professional",
    timestamps: true,
  }
);

User.hasOne(AccountantProfessional, { foreignKey: "user_id", sourceKey: "id", onDelete: "CASCADE" });
AccountantProfessional.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

AccountantProfile.hasOne(AccountantProfessional, { foreignKey: "user_id", sourceKey: "user_id", onDelete: "CASCADE" });
AccountantProfessional.belongsTo(AccountantProfile, { foreignKey: "user_id", targetKey: "user_id" });

module.exports = AccountantProfessional;
