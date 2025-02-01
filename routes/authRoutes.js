const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/email");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const activationCode = crypto.randomBytes(3).toString("hex");

    const user = new User({ name, email, password, activationCode });
    await user.save();

    await transporter.sendMail({
        to: email,
        subject: "Activate Your Account",
        text: `Your activation code is: ${activationCode}`,
    });

    res.json({ success: true, message: "Check your email for the activation code." });
});

// Activate Account
router.post("/activate", async (req, res) => {
    const { email, activationCode } = req.body;
    const user = await User.findOne({ email, activationCode });

    if (!user) return res.status(400).json({ success: false, message: "Invalid activation code." });

    user.isActive = true;
    user.activationCode = null;
    await user.save();

    res.json({ success: true, message: "Account activated!" });
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, isActive: true });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ success: false, message: "Invalid credentials or account not activated." });
    }

    const twoFactorCode = crypto.randomBytes(3).toString("hex");
    user.twoFactorCode = twoFactorCode;
    await user.save();

    await transporter.sendMail({
        to: email,
        subject: "Your 2FA Code",
        text: `Your 2FA code is: ${twoFactorCode}`,
    });

    res.json({ success: true, message: "Check your email for the 2FA code." });
});

// Verify 2FA & Generate JWT
router.post("/verify-2fa", async (req, res) => {
    const { email, twoFactorCode } = req.body;
    const user = await User.findOne({ email, twoFactorCode });

    if (!user) return res.status(400).json({ success: false, message: "Invalid 2FA code." });

    user.twoFactorCode = null;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, message: "Access granted!", token });
});

module.exports = router;
