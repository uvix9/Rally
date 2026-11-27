const Message = require("../models/messageModel");

// CREATE OR GET CONVERSATION
const createConversation = async (req, res) => {
  try {
    const userOneId = req.user.id;
    const userTwoId = req.body.userId;

    if (!userTwoId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (userOneId === userTwoId) {
      return res.status(400).json({
        success: false,
        message: "You cannot message yourself",
      });
    }

    const conversation = await Message.getOrCreateConversation(
      userOneId,
      userTwoId
    );

    return res.status(200).json({
      success: true,
      message: "Conversation created or retrieved successfully",
      data: conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

// GET USER CONVERSATIONS
const getUserConversations = async (req, res) => {
  try {
    const conversations = await Message.getUserConversations(req.user.id);

    return res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get conversations",
    });
  }
};

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const senderId = req.user.id;
    const { content } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const message = await Message.sendMessage(
      conversationId,
      senderId,
      content.trim()
    );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send message error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};

// GET MESSAGES
const getMessages = async (req, res) => {
  try {
    const messages = await Message.getMessages(req.params.conversationId);

    return res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error("Get messages error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to get messages",
    });
  }
};

// MARK MESSAGES AS READ
const markMessagesAsRead = async (req, res) => {
  try {
    const updatedMessages = await Message.markMessagesAsRead(
      req.params.conversationId,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      count: updatedMessages.length,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark messages as read error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark messages as read",
    });
  }
};

module.exports = {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages,
  markMessagesAsRead,
};