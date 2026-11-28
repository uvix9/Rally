
const pool = require("../config/db");

// CREATE POST
const createPost = async (userId, title, content, postType, communityId) => {
  const query = `
    INSERT INTO posts
      (user_id, title, content, post_type, community_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;

  const values = [
    userId,
    title,
    content || null,
    postType || "text",
    communityId || null,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

// GET ALL POSTS (FEED)
const getFeed = async (limit = 20, offset = 0) => {
  const query = `
    SELECT
      p.id,
      p.title,
      p.content,
      p.post_type,
      p.created_at,
      p.updated_at,
      p.user_id,
      u.username,
      u.display_name,
      p.community_id,
      c.name AS community_name,

      (SELECT COUNT(*)
       FROM votes v
       WHERE v.post_id = p.id AND v.vote_value = 1) AS upvotes,

      (SELECT COUNT(*)
       FROM votes v
       WHERE v.post_id = p.id AND v.vote_value = -1) AS downvotes,

      (SELECT COUNT(*)
       FROM comments cm
       WHERE cm.post_id = p.id) AS comment_count

    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN communities c ON p.community_id = c.id
    ORDER BY p.created_at DESC
    LIMIT $1 OFFSET $2
  `;

  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

// GET SINGLE POST
const getPostById = async (postId) => {
  const query = `
    SELECT
      p.*,
      u.username,
      u.display_name,
      c.name AS community_name,

      (SELECT COUNT(*)
       FROM votes v
       WHERE v.post_id = p.id AND v.vote_value = 1) AS upvotes,

      (SELECT COUNT(*)
       FROM votes v
       WHERE v.post_id = p.id AND v.vote_value = -1) AS downvotes,

      (SELECT COUNT(*)
       FROM comments cm
       WHERE cm.post_id = p.id) AS comment_count

    FROM posts p
    JOIN users u ON p.user_id = u.id
    LEFT JOIN communities c ON p.community_id = c.id
    WHERE p.id = $1
  `;

  const result = await pool.query(query, [postId]);
  return result.rows[0];
};

// DELETE OWN POST
const deletePost = async (postId, userId) => {
  const query = `
    DELETE FROM posts
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [postId, userId]);
  return result.rows[0];
};

module.exports = {
  createPost,
  getFeed,
  getPostById,
  deletePost,
};
