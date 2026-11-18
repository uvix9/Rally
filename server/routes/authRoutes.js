const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;


module.exports = router;

