
const pool = require("../config/db");

// CREATE COMMENT
const createComment = async (postId, userId, content) => {
  const query = `
    INSERT INTO comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [
    postId,
    userId,
    content,
  ]);

  return result.rows[0];
};

// GET COMMENTS FOR A POST
const getCommentsByPost = async (postId) => {
  const query = `
    SELECT
      c.id,
      c.post_id,
      c.user_id,
      c.content,
      c.created_at,
      u.username,
      u.display_name
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = $1
    ORDER BY c.created_at ASC
  `;

  const result = await pool.query(query, [postId]);
  return result.rows;
};

// DELETE OWN COMMENT
const deleteComment = async (commentId, userId) => {
  const query = `
    DELETE FROM comments
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [
    commentId,
    userId,
  ]);

  return result.rows[0];
};

module.exports = {
  createComment,
  getCommentsByPost,
  deleteComment,
};
