
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  castVote,
  removeVote,
  getVoteCounts,
} = require("../controllers/voteController");

// Get upvote and downvote counts
router.get("/post/:postId", getVoteCounts);

// Cast or update vote
router.post("/", authMiddleware, castVote);

// Remove own vote
router.delete("/post/:postId", authMiddleware, removeVote);

module.exports = router;
