CREATE TABLE inventory_rods (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  player_id UUID REFERENCES players(id) NOT NULL,
  rod_id UUID REFERENCES rods(id) NOT NULL,
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)