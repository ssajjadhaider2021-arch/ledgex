require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
require("./models/user.model");
require("./models/onboardingAgreement.model");
require("./models/riskAssessment.model");
require("./models/businessProfile.model");
const authRoutes = require("./routes/auth.routes");
const onboardingRoutes = require("./routes/onboarding.routes");
const businessProfileRoutes = require("./routes/businessProfile.routes");
const devRoutes = require("./routes/dev.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// API routes — shared body parsing (express.json) is above; auth routes first, then onboarding (per-route JWT on onboarding router)
app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);
app.use("/api/business-profile", businessProfileRoutes);
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

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error("DB connection failed:", err.message);
  }
}

start();
