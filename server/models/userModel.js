
const pool = require("../config/db");

const createUser = async (username, displayName, email, passwordHash) => {
  const query = `
    INSERT INTO users (username, display_name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, display_name, email, role, created_at
  `;

  const result = await pool.query(query, [
    username,
    displayName,
    email,
    passwordHash,
  ]);

  return result.rows[0];
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT * FROM users
    WHERE LOWER(email) = LOWER($1)
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const query = `
    SELECT * FROM users
    WHERE LOWER(username) = LOWER($1)
  `;

  const result = await pool.query(query, [username]);

  return result.rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserByUsername,
};

