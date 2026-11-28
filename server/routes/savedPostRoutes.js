
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  savePost,
  unsavePost,
  getSavedPosts,
} = require("../controllers/savedPostController");

// Get logged-in user's saved posts
router.get("/", authMiddleware, getSavedPosts);

// Save a post
router.post("/", authMiddleware, savePost);

// Unsave a post
router.delete("/:postId", authMiddleware, unsavePost);

module.exports = router;
