
const Comment = require("../models/commentModel");

// CREATE COMMENT
const createComment = async (req, res) => {
  try {
    const { postId, content } = req.body;

    if (!postId || !content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post ID and comment content are required",
      });
    }

    const comment = await Comment.createComment(
      postId,
      req.user.id,
      content.trim()
    );

    return res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });

  } catch (error) {
    console.error("Create comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create comment",
    });
  }
};

// GET COMMENTS
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.getCommentsByPost(postId);

    return res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });

  } catch (error) {
    console.error("Get comments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
    });
  }
};

// DELETE OWN COMMENT
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.deleteComment(
      id,
      req.user.id
    );

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found or you are not the owner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });

  } catch (error) {
    console.error("Delete comment error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
};
