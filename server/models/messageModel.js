

const pool = require("../config/db");

// CREATE OR GET CONVERSATION
const getOrCreateConversation = async (userOneId, userTwoId) => {
  const [firstUser, secondUser] = [userOneId, userTwoId].sort();

  const query = `
    INSERT INTO conversations (user_one_id, user_two_id)
    VALUES ($1, $2)
    ON CONFLICT (user_one_id, user_two_id)
    DO UPDATE SET user_one_id = EXCLUDED.user_one_id
    RETURNING *
  `;

  const result = await pool.query(query, [firstUser, secondUser]);
  return result.rows[0];
};

// GET USER CONVERSATIONS
const getUserConversations = async (userId) => {
  const query = `
    SELECT
      c.*,
      CASE
        WHEN c.user_one_id = $1 THEN u2.id
        ELSE u1.id
      END AS other_user_id,
      CASE
        WHEN c.user_one_id = $1 THEN u2.username
        ELSE u1.username
      END AS other_username,
      CASE
        WHEN c.user_one_id = $1 THEN u2.display_name
        ELSE u1.display_name
      END AS other_display_name
    FROM conversations c
    JOIN users u1 ON c.user_one_id = u1.id
    JOIN users u2 ON c.user_two_id = u2.id
    WHERE c.user_one_id = $1 OR c.user_two_id = $1
    ORDER BY c.created_at DESC
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
};

// SEND MESSAGE
const sendMessage = async (conversationId, senderId, content) => {
  const query = `
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES ($1, $2, $3)
    RETURNING *
  `;

  const result = await pool.query(query, [
    conversationId,
    senderId,
    content,
  ]);

  return result.rows[0];
};

// GET CONVERSATION MESSAGES
const getMessages = async (conversationId) => {
  const query = `
    SELECT
      m.*,
      u.username,
      u.display_name
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.conversation_id = $1
    ORDER BY m.created_at ASC
  `;

  const result = await pool.query(query, [conversationId]);
  return result.rows;
};

// MARK MESSAGES AS READ
const markMessagesAsRead = async (conversationId, userId) => {
  const query = `
    UPDATE messages
    SET is_read = TRUE
    WHERE conversation_id = $1
      AND sender_id <> $2
      AND is_read = FALSE
    RETURNING *
  `;

  const result = await pool.query(query, [conversationId, userId]);
  return result.rows;
};

// CHECK CONVERSATION PARTICIPANT
const isConversationParticipant = async (conversationId, userId) => {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM conversations
      WHERE id = $1
      AND (user_one_id = $2 OR user_two_id = $2)
    ) AS is_participant
  `;

  const result = await pool.query(query, [conversationId, userId]);
  return result.rows[0].is_participant;
};

module.exports = {
  getOrCreateConversation,
  getUserConversations,
  sendMessage,
  getMessages,
  markMessagesAsRead,
  isConversationParticipant,
};
