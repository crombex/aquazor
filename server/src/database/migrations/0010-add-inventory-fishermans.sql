
CREATE TABLE inventory_fishermans (
  id UUID PRIMARY KEY DEFAULT get_random_uuid(),
  fisherman_id UUID NOT NULL REFERENCES fishermans(id),
  player_id UUID NOT NULL REFERENCES players(id),
  started_at TIMESTAMP,
  finished_at TIMESTAMP,
  energy SMALLINT,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE
)