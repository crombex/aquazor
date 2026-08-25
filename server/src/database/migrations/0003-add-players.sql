
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  account_id UUID UNIQUE NOT NULL REFERENCES accounts(id),
  name VARCHAR(64),
  experience INT,
  coins INT DEFAULT 0,
  special_coins INT DEFAULT 0
)