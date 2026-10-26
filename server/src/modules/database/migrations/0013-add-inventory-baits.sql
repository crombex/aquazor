CREATE TABLE inventory_baits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор приманки в инвентаре
  bait_id UUID NOT NULL REFERENCES baits(id), -- идентификатор приманки, которая находится в инвентаре
  user_id UUID NOT NULL REFERENCES users(id), -- идентификатор игрока, которому принадлежит приманка
  quantity INT NOT NULL, -- количество приманки в инвентаре
)