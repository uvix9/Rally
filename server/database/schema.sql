
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    username VARCHAR(30) NOT NULL,
    display_name VARCHAR(60) NOT NULL,

    email VARCHAR(255) NOT NULL,
    password_hash TEXT,

    role VARCHAR(20) NOT NULL DEFAULT 'user',
    account_status VARCHAR(20) NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_role
        CHECK (role IN ('user', 'admin')),

    CONSTRAINT valid_account_status
        CHECK (account_status IN ('active', 'suspended'))
);

CREATE UNIQUE INDEX unique_username
ON users (LOWER(username));

CREATE UNIQUE INDEX unique_email
ON users (LOWER(email));


CREATE TABLE revoked_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_revoked_tokens_expires_at
ON revoked_tokens(expires_at);

