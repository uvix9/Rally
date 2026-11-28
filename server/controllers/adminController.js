
const pool = require("../config/db");

// GET ADMIN DASHBOARD STATS
const getStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_users,
        COUNT(*) FILTER (WHERE account_status = 'active') AS active_users,
        COUNT(*) FILTER (WHERE account_status = 'suspended') AS suspended_users,
        COUNT(*) FILTER (WHERE role = 'admin') AS total_admins
      FROM users
    `);

    return res.status(200).json({
      success: true,
      stats: result.rows[0],
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, username, display_name, email, role,
             account_status, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    return res.status(200).json({
      success: true,
      users: result.rows,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

// SUSPEND OR ACTIVATE USER
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "suspended"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or suspended",
      });
    }

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own account status",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET account_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, username, email, role, account_status`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `User ${status} successfully`,
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user status",
    });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  updateUserStatus,
};
