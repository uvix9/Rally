
-- 1. CONVERSATIONS
-- Private one-to-one conversations

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_one_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_two_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT different_participants
        CHECK (user_one_id <> user_two_id),

    CONSTRAINT unique_conversation
        UNIQUE (user_one_id, user_two_id),

    CONSTRAINT ordered_participants
        CHECK (user_one_id < user_two_id)
);

-- 2. MESSAGES

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,

    sender_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    content TEXT NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation
ON messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_messages_sender
ON messages(sender_id);

-- 3. NOTIFICATIONS

CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    actor_id UUID
        REFERENCES users(id) ON DELETE SET NULL,

    type VARCHAR(30) NOT NULL,

    message TEXT NOT NULL,

    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,

    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user
ON notifications(user_id, created_at DESC);

-- 4. REPORTS
-- Users can report different types of content

CREATE TABLE IF NOT EXISTS reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    reporter_id UUID NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    reported_user_id UUID
        REFERENCES users(id) ON DELETE CASCADE,

    post_id UUID
        REFERENCES posts(id) ON DELETE CASCADE,

    comment_id UUID
        REFERENCES comments(id) ON DELETE CASCADE,

    community_id UUID
        REFERENCES communities(id) ON DELETE CASCADE,

    reason TEXT NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'pending',

    reviewed_by UUID
        REFERENCES users(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    reviewed_at TIMESTAMPTZ,

    CONSTRAINT valid_report_status
        CHECK (status IN ('pending', 'reviewed', 'actioned', 'dismissed')),

    CONSTRAINT exactly_one_report_target
        CHECK (
            num_nonnulls(
                reported_user_id,
                post_id,
                comment_id,
                community_id
            ) = 1
        )
);

CREATE INDEX IF NOT EXISTS idx_reports_status
ON reports(status, created_at DESC);

-- 5. MODERATION LOGS
-- Track admin actions

CREATE TABLE IF NOT EXISTS moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    admin_id UUID NOT NULL
        REFERENCES users(id) ON DELETE RESTRICT,

    action VARCHAR(50) NOT NULL,

    target_type VARCHAR(20) NOT NULL,

    target_id UUID NOT NULL,

    details JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_target_type
        CHECK (target_type IN ('user', 'post', 'comment', 'community'))
);

CREATE INDEX IF NOT EXISTS idx_moderation_logs_admin
ON moderation_logs(admin_id, created_at DESC);

-- 6. INDEX FOR CONVERSATION LOOKUP

CREATE INDEX IF NOT EXISTS idx_conversations_user_one
ON conversations(user_one_id);

CREATE INDEX IF NOT EXISTS idx_conversations_user_two
ON conversations(user_two_id);
