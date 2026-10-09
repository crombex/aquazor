
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_online TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  is_blocked BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  roles TEXT DEFAULT 'user;',
  avatar_url TEXT,
  birthdate DATE,
  nickname VARCHAR(32) UNIQUE NOT NULL,
  experience INT DEFAULT 0,
  coins INT DEFAULT 0,
  special_coins INT DEFAULT 0
)