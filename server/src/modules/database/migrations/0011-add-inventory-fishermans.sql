
CREATE TABLE inventory_fishermans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор рыбака в инвентаре
  fisherman_id UUID NOT NULL REFERENCES fishermans(id), -- идентификатор рыбака, который находится в инвентаре
  player_id UUID NOT NULL REFERENCES players(id), -- идентификатор игрока, который владеет рыбаком
  started_at TIMESTAMP, -- время начала использования рыбака
  finished_at TIMESTAMP, -- время окончания использования рыбака
  energy SMALLINT, -- уровень энергии рыбака
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что рыбак больше не используется в игре
)