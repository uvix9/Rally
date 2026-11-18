
const pool = require("../config/db");
const crypto = require("crypto");

// Token ko hash karna (raw token database mein store nahi karenge)
const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

// Logout ke time token revoke karna
const revokeToken = async (token, expiresAt) => {
  const tokenHash = hashToken(token);

  const query = `
    INSERT INTO revoked_tokens (token_hash, expires_at)
    VALUES ($1, $2)
    ON CONFLICT (token_hash) DO NOTHING
  `;

  await pool.query(query, [tokenHash, expiresAt]);
};

// Check karna ki token pehle revoke hua hai ya nahi
const isTokenRevoked = async (token) => {
  const tokenHash = hashToken(token);

  const query = `
    SELECT id FROM revoked_tokens
    WHERE token_hash = $1
  `;

  const result = await pool.query(query, [tokenHash]);

  return result.rows.length > 0;
};

module.exports = {
  revokeToken,
  isTokenRevoked,
};

