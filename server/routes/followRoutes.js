
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
} = require("../controllers/followController");

// Follow a user
router.post("/:userId", authMiddleware, followUser);

// Unfollow a user
router.delete("/:userId", authMiddleware, unfollowUser);

// Get user's followers
router.get("/:userId/followers", getFollowers);

// Get users followed by a user
router.get("/:userId/following", getFollowing);

// Check follow status
router.get("/:userId/status", authMiddleware, checkFollowStatus);

module.exports = router;
