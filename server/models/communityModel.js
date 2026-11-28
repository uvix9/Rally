
const pool = require("../config/db");

// CREATE COMMUNITY
const createCommunity = async (name, description, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const communityQuery = `
      INSERT INTO communities (name, description, created_by)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const communityResult = await client.query(
      communityQuery,
      [name, description, userId]
    );

    const community = communityResult.rows[0];

    // Automatically add creator as owner
    await client.query(
      `INSERT INTO community_members (community_id, user_id, role)
       VALUES ($1, $2, 'owner')`,
      [community.id, userId]
    );

    await client.query("COMMIT");

    return community;

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
};

// GET ALL COMMUNITIES
const getAllCommunities = async () => {
  const query = `
    SELECT
      c.*,
      u.username AS creator_username,
      COUNT(cm.user_id)::INT AS member_count
    FROM communities c
    JOIN users u ON c.created_by = u.id
    LEFT JOIN community_members cm ON c.id = cm.community_id
    GROUP BY c.id, u.username
    ORDER BY c.created_at DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};

// JOIN COMMUNITY
const joinCommunity = async (communityId, userId) => {
  const query = `
    INSERT INTO community_members (community_id, user_id)
    VALUES ($1, $2)
    ON CONFLICT (community_id, user_id) DO NOTHING
    RETURNING *
  `;

  const result = await pool.query(query, [
    communityId,
    userId,
  ]);

  return result.rows[0];
};

// LEAVE COMMUNITY
const leaveCommunity = async (communityId, userId) => {
  const query = `
    DELETE FROM community_members
    WHERE community_id = $1
      AND user_id = $2
      AND role != 'owner'
    RETURNING *
  `;

  const result = await pool.query(query, [
    communityId,
    userId,
  ]);

  return result.rows[0];
};

// DELETE COMMUNITY (OWNER ONLY)
const deleteCommunity = async (communityId, userId) => {
  const query = `
    DELETE FROM communities
    WHERE id = $1 AND created_by = $2
    RETURNING *
  `;

  const result = await pool.query(query, [
    communityId,
    userId,
  ]);

  return result.rows[0];
};

module.exports = {
  createCommunity,
  getAllCommunities,
  joinCommunity,
  leaveCommunity,
  deleteCommunity,
};
