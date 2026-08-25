CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(64) NOT NULL,
  fertility DECIMAL(2, 1) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  level_required SMALLINT NOT NULL,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)