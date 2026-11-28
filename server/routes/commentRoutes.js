const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");

// Get comments of a post
router.get("/post/:postId", getCommentsByPost);

// Create comment
router.post("/", authMiddleware, createComment);

// Delete own comment
router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
