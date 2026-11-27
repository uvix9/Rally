
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createPost,
  getFeed,
  getPostById,
  deletePost,
} = require("../controllers/postController");

// Public: Get all posts
router.get("/", getFeed);

// Public: Get one post
router.get("/:id", getPostById);

// Protected: Create post
router.post("/", authMiddleware, createPost);

// Protected: Delete own post
router.delete("/:id", authMiddleware, deletePost);

module.exports = router;
