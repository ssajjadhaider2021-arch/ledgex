const fs = require("fs");
const multer = require("multer");
const path = require("path");

const uploadDir = path.join(__dirname, "..", "..", "uploads", "onboarding");
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

exports.uploadOnboardingStep2 = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if ([".pdf", ".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, JPG, and PNG files are allowed"));
  },
}).fields([
  { name: "idDocument", maxCount: 1 },
  { name: "addressProof", maxCount: 1 },
  { name: "businessEvidence", maxCount: 1 },
]);
