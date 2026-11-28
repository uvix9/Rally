
const Follow = require("../models/followModel");

// FOLLOW USER
const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const follow = await Follow.followUser(
      followerId,
      followingId
    );

    if (!follow) {
      return res.status(409).json({
        success: false,
        message: "Already following this user",
      });
    }

    return res.status(201).json({
      success: true,
      message: "User followed successfully",
      data: follow,
    });

  } catch (error) {
    console.error("Follow error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to follow user",
    });
  }
};

// UNFOLLOW USER
const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    const follow = await Follow.unfollowUser(
      followerId,
      followingId
    );

    if (!follow) {
      return res.status(404).json({
        success: false,
        message: "You are not following this user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });

  } catch (error) {
    console.error("Unfollow error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to unfollow user",
    });
  }
};

// GET FOLLOWERS
const getFollowers = async (req, res) => {
  try {
    const userId = req.params.userId;

    const followers = await Follow.getFollowers(userId);

    return res.status(200).json({
      success: true,
      count: followers.length,
      data: followers,
    });

  } catch (error) {
    console.error("Get followers error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get followers",
    });
  }
};

// GET FOLLOWING
const getFollowing = async (req, res) => {
  try {
    const userId = req.params.userId;

    const following = await Follow.getFollowing(userId);

    return res.status(200).json({
      success: true,
      count: following.length,
      data: following,
    });

  } catch (error) {
    console.error("Get following error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get following",
    });
  }
};

// CHECK FOLLOW STATUS
const checkFollowStatus = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.userId;

    const isFollowing = await Follow.checkFollowStatus(
      followerId,
      followingId
    );

    return res.status(200).json({
      success: true,
      isFollowing,
    });

  } catch (error) {
    console.error("Follow status error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to check follow status",
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
};
