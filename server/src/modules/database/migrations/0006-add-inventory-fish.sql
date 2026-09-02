
CREATE TABLE inventory_fish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор пойманной рыбы
  player_id UUID NOT NULL REFERENCES players(id), -- идентификатор игрока, который поймал рыбу
  fish_id UUID NOT NULL REFERENCES fish(id), -- идентификатор вида рыбы, которая была поймана
  weight DECIMAL(6,2) NOT NULL, -- вес пойманной рыбы
  length DECIMAL(4,2) NOT NULL, -- длина пойманной рыбы
  description TEXT, -- краткое описание пойманной рыбы
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что рыба больше не используется в игре
)