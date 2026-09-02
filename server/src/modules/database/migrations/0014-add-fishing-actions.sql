CREATE TABLE fishing_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор одного действия рыбалки
  player_id UUID NOT NULL REFERENCES players(id), -- идентификатор игрока, который совершил действие рыбалки
  location_id UUID NOT NULL REFERENCES locations(id), -- идентификатор локации, где было совершено действие рыбалки
  inventory_fish_id UUID REFERENCES inventory_fish(id), -- идентификатор пойманной рыбы, которая была получена в результате действия рыбалки
  inventory_fisherman_id UUID REFERENCES inventory_fishermans(id), -- идентификатор рыбака, который был использован в действии рыбалки
  inventory_rod_id UUID REFERENCES inventory_rods(id), -- идентификатор удочки, которая была использована в действии рыбалки
  inventory_bait_id UUID REFERENCES inventory_baits(id), -- идентификатор приманки, которая была использована в действии рыбалки
  fisherman_id UUID NOT NULL REFERENCES fishermans(id), -- идентификатор рыбака, который был использован в действии рыбалки
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- дата и время начала действия рыбалки
  finished_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP + INTERVAL '3 hours', -- дата и время окончания действия рыбалки
  is_successful BOOLEAN NOT NULL -- флаг, указывающий на успешность действия рыбалки
  -- По started_at и finished_at мы группируем разные действия рыбалки, чтобы опредеить, что это один заход рыбалки, а не несколько разных
)