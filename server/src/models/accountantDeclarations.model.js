const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const AccountantProfile = require("./accountantProfile.model");

const AccountantDeclarations = sequelize.define(
  "AccountantDeclarations",
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
    accept_moa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    accept_dpa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    accept_regulatory: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    tableName: "accountant_declarations",
    timestamps: true,
  }
);

User.hasOne(AccountantDeclarations, { foreignKey: "user_id", sourceKey: "id", onDelete: "CASCADE" });
AccountantDeclarations.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });

AccountantProfile.hasOne(AccountantDeclarations, { foreignKey: "user_id", sourceKey: "user_id", onDelete: "CASCADE" });
AccountantDeclarations.belongsTo(AccountantProfile, { foreignKey: "user_id", targetKey: "user_id" });

module.exports = AccountantDeclarations;
