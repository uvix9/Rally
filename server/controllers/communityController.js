
const Community = require("../models/communityModel");

// CREATE COMMUNITY
const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Community name is required",
      });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: "Community name cannot exceed 50 characters",
      });
    }

    const community = await Community.createCommunity(
      name.trim(),
      description?.trim() || null,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Community created successfully",
      community,
    });

  } catch (error) {
    console.error("Create community error:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Community name already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create community",
    });
  }
};

// GET ALL COMMUNITIES
const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.getAllCommunities();

    return res.status(200).json({
      success: true,
      count: communities.length,
      communities,
    });

  } catch (error) {
    console.error("Get communities error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch communities",
    });
  }
};

// JOIN COMMUNITY
const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await Community.joinCommunity(
      id,
      req.user.id
    );

    return res.status(200).json({
      success: true,
      message: membership
        ? "Joined community successfully"
        : "You are already a member",
      membership: membership || null,
    });

  } catch (error) {
    console.error("Join community error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join community",
    });
  }
};

// LEAVE COMMUNITY
const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const membership = await Community.leaveCommunity(
      id,
      req.user.id
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found or owner cannot leave",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Left community successfully",
    });

  } catch (error) {
    console.error("Leave community error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to leave community",
    });
  }
};

// DELETE COMMUNITY (OWNER ONLY)
const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.deleteCommunity(
      id,
      req.user.id
    );

    if (!community) {
      return res.status(404).json({
        success: false,
        message: "Community not found or you are not the owner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Community deleted successfully",
    });

  } catch (error) {
    console.error("Delete community error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete community",
    });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
};
