const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "..", "uploads", "accountant");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uid = req.user?.id ?? "user";
    const ext = path.extname(file.originalname || "") || "";
    const base = `${uid}-${Date.now()}-${file.fieldname}${ext}`.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, base);
  },
});

const uploader = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if ([".pdf", ".jpg", ".jpeg", ".png"].includes(ext)) return cb(null, true);
    return cb(new Error("Only PDF, JPG, and PNG files are allowed"));
  },
});

function handleUploadError(err, req, res, next) {
  if (!err) return next();
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Each file must be 10MB or smaller" });
  }
  return res.status(400).json({ message: err.message || "Upload failed" });
}

function singleUpload(fieldName) {
  return (req, res, next) => {
    uploader.single(fieldName)(req, res, (err) => handleUploadError(err, req, res, next));
  };
}

function fieldsUpload(fields) {
  return (req, res, next) => {
    uploader.fields(fields)(req, res, (err) => handleUploadError(err, req, res, next));
  };
}

module.exports = {
  uploader,
  singleUpload,
  fieldsUpload,
  handleUploadError,
};
