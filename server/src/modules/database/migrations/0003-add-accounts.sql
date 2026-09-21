
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_online TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_blocked BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  role roles DEFAULT 'user',
  avatar_url TEXT,
  birthdate DATE
)