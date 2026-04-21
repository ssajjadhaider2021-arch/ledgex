const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const { sendVerificationEmail } = require("../services/email.service");
const { generateToken } = require("../utils/jwt");

function userPayload(user) {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName ?? null,
    role: user.role,
    isVerified: user.isVerified,
    onboardingCompleted: user.onboardingCompleted,
    onboardingStep: user.onboardingStep,
  };
}

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await User.create({
      email,
      password: hashed,
      role,
      verificationCode: code,
    });

    try {
      await sendVerificationEmail(email, code);
    } catch (emailErr) {
      console.error("Verification email failed:", emailErr.message);
      console.info("Verification code (check logs if email not configured):", code);
    }

    res.json({ message: "User created. Verify email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (String(user.verificationCode) !== String(verificationCode)) {
      return res.status(400).json({ message: "Invalid code" });
    }

    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || "dev_secret",
      { expiresIn: "7d" }
    );

    await user.reload();

    return res.json({
      success: true,
      onboardingStep: user.onboardingStep ?? 1,
      message: "Email verified successfully",
      token,
      user: userPayload(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordOk = await bcrypt.compare(password, user.password);
    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isVerified !== true) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: userPayload(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "verificationCode"] },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    return res.json(userPayload(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
