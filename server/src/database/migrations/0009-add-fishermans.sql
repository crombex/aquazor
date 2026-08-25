CREATE TABLE fishermans (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  name VARCHAR(64) NOT NULL UNIQUE,
  age SMALLINT NOT NULL,
  skill DECIMAL(2, 1) NOT NULL,
  luck DECIMAL(2, 1) NOT NULL,
  avatar_url TEXT NOT NULL,
  description TEXT,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)