
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_online TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_blocked BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  role VARCHAR(16) DEFAULT 'user',
  avatar_url TEXT,
  birthdate DATE,
  refresh_token TEXT
)