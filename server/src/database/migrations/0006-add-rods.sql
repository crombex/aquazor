CREATE TABLE rods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type SMALLINT NOT NULL,
  efficiency DECIMAL(2, 1) NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  name VARCHAR(64) UNIQUE NOT NULL,
  rarity SMALLINT NOT NULL,
  power DECIMAL(2, 1) NOT NULL,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)