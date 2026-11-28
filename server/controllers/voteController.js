
const Vote = require("../models/voteModel");

// CAST OR UPDATE VOTE
const castVote = async (req, res) => {
  try {
    const { postId, voteValue } = req.body;

    // Validate input
    if (!postId || ![1, -1].includes(voteValue)) {
      return res.status(400).json({
        success: false,
        message: "Valid post ID and vote value (1 or -1) are required",
      });
    }

    const vote = await Vote.castVote(
      req.user.id,
      postId,
      voteValue
    );

    return res.status(200).json({
      success: true,
      message: "Vote submitted successfully",
      vote,
    });

  } catch (error) {
    console.error("Cast vote error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit vote",
    });
  }
};

// REMOVE VOTE
const removeVote = async (req, res) => {
  try {
    const { postId } = req.params;

    const vote = await Vote.removeVote(
      req.user.id,
      postId
    );

    if (!vote) {
      return res.status(404).json({
        success: false,
        message: "Vote not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vote removed successfully",
    });

  } catch (error) {
    console.error("Remove vote error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove vote",
    });
  }
};

// GET VOTE COUNTS
const getVoteCounts = async (req, res) => {
  try {
    const { postId } = req.params;

    const counts = await Vote.getVoteCounts(postId);

    return res.status(200).json({
      success: true,
      postId,
      ...counts,
    });

  } catch (error) {
    console.error("Get vote counts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vote counts",
    });
  }
};

module.exports = {
  castVote,
  removeVote,
  getVoteCounts,
};
