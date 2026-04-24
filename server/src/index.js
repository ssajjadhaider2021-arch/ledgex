require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
require("./models/user.model");
require("./models/onboardingAgreement.model");
require("./models/riskAssessment.model");
require("./models/businessProfile.model");
require("./models/accountantProfile.model");
require("./models/accountantDocuments.model");
require("./models/accountantCompliance.model");
require("./models/accountantStatus.model");
require("./models/accountantProfessional.model");
require("./models/accountantAml.model");
require("./models/accountantInsurance.model");
require("./models/accountantDataProtection.model");
require("./models/accountantDeclarations.model");
require("./models/accountantVerificationDocuments.model");
const authRoutes = require("./routes/auth.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const businessProfileRoutes = require("./routes/businessProfile.routes");
const accountantRoutes = require("./routes/accountant.routes");
const adminRoutes = require("./routes/admin.routes");
const devRoutes = require("./routes/dev.routes");

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API routes — shared body parsing (express.json) is above; auth routes first, then onboarding (per-route JWT on onboarding router)
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/business-profile", businessProfileRoutes);
app.use("/api/accountant", accountantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dev", devRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API Running");
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // Keep local schema aligned with model changes (non-destructive).
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");

    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
}

start();
