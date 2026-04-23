const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

/** Generic uploaded files linked to an accountant user (PostgreSQL table `accountant_documents`). */
const AccountantDocument = sequelize.define(
  "AccountantDocument",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    /** Logical type, e.g. passport, aml_policy, bank_statement */
    category: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    /** Stored path, object key, or URI fragment */
    storage_path: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    original_filename: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    mime_type: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    size_bytes: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    checksum_sha256: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    /** Arbitrary metadata (PostgreSQL JSONB via Sequelize JSON type) */
    meta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    review_status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "accountant_documents",
    timestamps: true,
    underscored: true,
    indexes: [{ fields: ["user_id"] }, { fields: ["category"] }],
  }
);

const User = require("./user.model");

User.hasMany(AccountantDocument, {
  foreignKey: "user_id",
  sourceKey: "id",
  as: "accountantDocuments",
  onDelete: "CASCADE",
});
AccountantDocument.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
  as: "user",
});

module.exports = AccountantDocument;
