const express = require("express");
const authenticateJWT = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Dashboard Route
router.get("/dashboard", authenticateJWT, (req, res) => {
    res.json({ success: true, message: "Welcome to your dashboard!", userId: req.user.userId });
});

module.exports = router;
