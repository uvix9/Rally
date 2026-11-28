const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages,
  markMessagesAsRead,
} = require("../controllers/messageController");

// Get all conversations of logged-in user
router.get("/conversations", authMiddleware, getUserConversations);

// Create or get a conversation
router.post("/conversations", authMiddleware, createConversation);

// Send a message
router.post("/:conversationId", authMiddleware, sendMessage);

// Get conversation messages
router.get("/:conversationId", authMiddleware, getMessages);

// Mark messages as read
router.patch("/:conversationId/read", authMiddleware, markMessagesAsRead);

module.exports = router;