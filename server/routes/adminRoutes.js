
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getStats,
  getAllUsers,
  updateUserStatus,
} = require("../controllers/adminController");

// All routes require admin authentication
router.use(authMiddleware, adminMiddleware);

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/status", updateUserStatus);

module.exports = router;
