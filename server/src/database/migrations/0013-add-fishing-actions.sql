CREATE TABLE fishing_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  bait_id UUID NOT NULL REFERENCES baits(id),
  rod_id UUID NOT NULL REFERENCES rods(id),
  inventory_fish_id UUID NOT NULL REFERENCES inventory_fish(id),
  fisherman_id UUID NOT NULL REFERENCES fishermans(id),
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)