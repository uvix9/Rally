
const SavedPost = require("../models/savedPostModel");

// SAVE POST
const savePost = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
    }

    const savedPost = await SavedPost.savePost(
      req.user.id,
      postId
    );

    return res.status(200).json({
      success: true,
      message: savedPost
        ? "Post saved successfully"
        : "Post is already saved",
      savedPost: savedPost || null,
    });

  } catch (error) {
    console.error("Save post error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save post",
    });
  }
};

// UNSAVE POST
const unsavePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const savedPost = await SavedPost.unsavePost(
      req.user.id,
      postId
    );

    if (!savedPost) {
      return res.status(404).json({
        success: false,
        message: "Saved post not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post removed from saved posts",
    });

  } catch (error) {
    console.error("Unsave post error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unsave post",
    });
  }
};

// GET SAVED POSTS
const getSavedPosts = async (req, res) => {
  try {
    const posts = await SavedPost.getSavedPosts(req.user.id);

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });

  } catch (error) {
    console.error("Get saved posts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch saved posts",
    });
  }
};

module.exports = {
  savePost,
  unsavePost,
  getSavedPosts,
};
