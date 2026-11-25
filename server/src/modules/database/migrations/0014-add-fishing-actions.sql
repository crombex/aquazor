CREATE TABLE fishing_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор одного действия рыбалки
  user_id UUID NOT NULL REFERENCES users(id), -- идентификатор игрока, который совершил действие рыбалки
  location_id UUID NOT NULL REFERENCES locations(id), -- идентификатор локации, где было совершено действие рыбалки
  inventory_fisherman_id UUID REFERENCES inventory_fishermen(id), -- идентификатор рыбака, который был использован в действии рыбалки
  started_at TIMESTAMPTZ DEFAULT NOW(), -- дата и время начала действия рыбалки
  finished_at TIMESTAMPTZ DEFAULT NOW(), -- дата и время окончания действия рыбалки
  status TEXT NOT NULL CHECK (status in ('pending', 'completed')) DEFAULT 'pending'
);

CREATE INDEX idx_fishing_actions_finished_at ON fishing_actions (finished_at) WHERE status = 'pending';
