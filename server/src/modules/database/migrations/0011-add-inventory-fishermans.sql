
CREATE TABLE inventory_fishermans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор рыбака в инвентаре
  fisherman_id UUID NOT NULL REFERENCES fishermans(id), -- идентификатор рыбака, который находится в инвентаре
  user_id UUID NOT NULL REFERENCES users(id), -- идентификатор игрока, который владеет рыбаком
  started_at TIMESTAMPTZ, -- время начала использования рыбака
  finished_at TIMESTAMPTZ, -- время окончания использования рыбака
  energy SMALLINT, -- уровень энергии рыбака
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что рыбак больше не используется в игре
)