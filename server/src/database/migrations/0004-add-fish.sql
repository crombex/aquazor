
CREATE TABLE fish (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  type VARCHAR(64) NOT NULL,
  max_weight INT NOT NULL,
  min_weight INT NOT NULL,
  max_length INT NOT NULL,
  min_length INT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  rarity ENUM('common', 'uncommon', 'rare', 'epic', 'legendary') NOT NULL DEFAULT 'common',
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)