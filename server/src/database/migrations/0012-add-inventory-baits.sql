CREATE TABLE inventory_baits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bait_id UUID NOT NULL REFERENCES baits(id),
  player_id UUID NOT NULL REFERENCES players(id),
  quantity INT NOT NULL,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)