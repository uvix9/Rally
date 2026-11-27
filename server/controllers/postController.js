
const Post = require("../models/postModel");

// CREATE POST
const createPost = async (req, res) => {
  try {
    const { title, content, postType, communityId } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post title is required",
      });
    }

    if (title.length > 300) {
      return res.status(400).json({
        success: false,
        message: "Title cannot exceed 300 characters",
      });
    }

    const validTypes = ["text", "image", "link"];

    if (postType && !validTypes.includes(postType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post type",
      });
    }

    const post = await Post.createPost(
      req.user.id,
      title.trim(),
      content,
      postType,
      communityId
    );

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });

  } catch (error) {
    console.error("Create post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};


// GET FEED
const getFeed = async (req, res) => {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100
    );

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const offset = (page - 1) * limit;

    const posts = await Post.getFeed(limit, offset);

    return res.status(200).json({
      success: true,
      page,
      limit,
      count: posts.length,
      posts,
    });

  } catch (error) {
    console.error("Get feed error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};


// GET SINGLE POST
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.getPostById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });

  } catch (error) {
    console.error("Get post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch post",
    });
  }
};


// DELETE OWN POST
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.deletePost(id, req.user.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found or you are not the owner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });

  } catch (error) {
    console.error("Delete post error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};


module.exports = {
  createPost,
  getFeed,
  getPostById,
  deletePost,
};
