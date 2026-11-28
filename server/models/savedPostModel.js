
const pool = require("../config/db");

// SAVE POST
const savePost = async (userId, postId) => {
  const query = `
    INSERT INTO saved_posts (user_id, post_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, post_id)
    DO NOTHING
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    postId,
  ]);

  return result.rows[0];
};

// UNSAVE POST
const unsavePost = async (userId, postId) => {
  const query = `
    DELETE FROM saved_posts
    WHERE user_id = $1 AND post_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [
    userId,
    postId,
  ]);

  return result.rows[0];
};

// GET SAVED POSTS
const getSavedPosts = async (userId) => {
  const query = `
    SELECT
      p.*,
      u.username,
      u.display_name,
      sp.saved_at
    FROM saved_posts sp
    JOIN posts p ON sp.post_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE sp.user_id = $1
    ORDER BY sp.saved_at DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

module.exports = {
  savePost,
  unsavePost,
  getSavedPosts,
};

