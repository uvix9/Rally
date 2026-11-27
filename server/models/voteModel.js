
const pool = require("../config/db");

// CREATE OR UPDATE VOTE
const castVote = async (userId, postId, voteValue) => {
  const query = `
    INSERT INTO votes (user_id, post_id, vote_value)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, post_id)
    DO UPDATE SET
      vote_value = EXCLUDED.vote_value,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    postId,
    voteValue,
  ]);

  return result.rows[0];
};

// REMOVE VOTE
const removeVote = async (userId, postId) => {
  const query = `
    DELETE FROM votes
    WHERE user_id = $1 AND post_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    postId,
  ]);

  return result.rows[0];
};

// GET VOTE COUNTS
const getVoteCounts = async (postId) => {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE vote_value = 1)::INT AS upvotes,
      COUNT(*) FILTER (WHERE vote_value = -1)::INT AS downvotes
    FROM votes
    WHERE post_id = $1
  `;

  const result = await pool.query(query, [postId]);
  return result.rows[0];
};

module.exports = {
  castVote,
  removeVote,
  getVoteCounts,
};
