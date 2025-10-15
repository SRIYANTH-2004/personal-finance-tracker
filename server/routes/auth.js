const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const authenticateToken = require("../middleware/auth");

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Login user
router.post("/login", login);

// GET /api/auth/me - Get current user info (protected route)
router.get("/me", authenticateToken, getMe);

module.exports = router;
