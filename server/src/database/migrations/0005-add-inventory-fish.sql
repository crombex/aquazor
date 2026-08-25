
CREATE TABLE invetory_fish (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  fish_id UUID NOT NULL REFERENCES fish(id),
  weight DECIMAL(6,2) NOT NULL,
  length DECIMAL(4,2) NOT NULL,
  description TEXT,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)