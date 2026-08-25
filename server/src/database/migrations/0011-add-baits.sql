CREATE TABLE baits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(64) NOT NULL,
  type SMALLINT NOT NULL,
  rarity SMALLINT NOT NULL DEFAULT 1,
  image_url TEXT NOT NULL,
  description TEXT,
  efficiency DECIMAL(2, 1),
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)