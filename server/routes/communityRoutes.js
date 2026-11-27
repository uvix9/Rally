
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createCommunity,
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
} = require("../controllers/communityController");

// Get all communities (public)
router.get("/", getAllCommunities);

// Create community
router.post("/", authMiddleware, createCommunity);

// Join community
router.post("/:id/join", authMiddleware, joinCommunity);

// Leave community
router.delete("/:id/leave", authMiddleware, leaveCommunity);

// Delete own community
router.delete("/:id", authMiddleware, deleteCommunity);

module.exports = router;
