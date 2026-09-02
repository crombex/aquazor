
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID UNIQUE NOT NULL REFERENCES accounts(id),
  name VARCHAR(32) UNIQUE NOT NULL,
  experience INT DEFAULT 0,
  coins INT DEFAULT 0,
  special_coins INT DEFAULT 0
)