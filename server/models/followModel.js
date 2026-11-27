
const pool = require("../config/db");

// FOLLOW USER
const followUser = async (followerId, followingId) => {
  const query = `
    INSERT INTO follows (follower_id, following_id)
    VALUES ($1, $2)
    ON CONFLICT (follower_id, following_id)
    DO NOTHING
    RETURNING *
  `;

  const result = await pool.query(query, [
    followerId,
    followingId,
  ]);

  return result.rows[0];
};

// UNFOLLOW USER
const unfollowUser = async (followerId, followingId) => {
  const query = `
    DELETE FROM follows
    WHERE follower_id = $1 AND following_id = $2
    RETURNING *
  `;

  const result = await pool.query(query, [
    followerId,
    followingId,
  ]);

  return result.rows[0];
};

// GET FOLLOWERS
const getFollowers = async (userId) => {
  const query = `
    SELECT
      u.id,
      u.username,
      u.display_name,
      f.created_at AS followed_at
    FROM follows f
    JOIN users u ON f.follower_id = u.id
    WHERE f.following_id = $1
    ORDER BY f.created_at DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

// GET FOLLOWING
const getFollowing = async (userId) => {
  const query = `
    SELECT
      u.id,
      u.username,
      u.display_name,
      f.created_at AS followed_at
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = $1
    ORDER BY f.created_at DESC
  `;

  const result = await pool.query(query, [userId]);

  return result.rows;
};

// CHECK FOLLOW STATUS
const checkFollowStatus = async (followerId, followingId) => {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM follows
      WHERE follower_id = $1 AND following_id = $2
    ) AS is_following
  `;

  const result = await pool.query(query, [
    followerId,
    followingId,
  ]);

  return result.rows[0].is_following;
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  checkFollowStatus,
};
