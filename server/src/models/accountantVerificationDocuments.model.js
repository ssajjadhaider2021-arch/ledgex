const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");

const AccountantVerificationDocuments = sequelize.define(
  "AccountantVerificationDocuments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    passport_or_license: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    proof_of_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualification_certificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insurance_certificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firm_registration_doc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    practice_license: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_statement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aml_supervision_doc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "under_review", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "accountant_verification_documents",
    timestamps: true,
  }
);

User.hasOne(AccountantVerificationDocuments, {
  foreignKey: "user_id",
  sourceKey: "id",
  onDelete: "CASCADE",
  constraints: false,
});
AccountantVerificationDocuments.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  constraints: false,
});

module.exports = AccountantVerificationDocuments;
