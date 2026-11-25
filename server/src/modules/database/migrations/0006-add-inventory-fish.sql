
CREATE TABLE inventory_fish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор пойманной рыбы
  user_id UUID NOT NULL REFERENCES users(id), -- идентификатор игрока, который поймал рыбу
  fish_id UUID NOT NULL REFERENCES fish(id), -- идентификатор вида рыбы, которая была поймана
  weight REAL NOT NULL, -- вес пойманной рыбы
  length REAL NOT NULL, -- длина пойманной рыбы
  sell_price INT NOT NULL,
  is_sold BOOLEAN NOT NULL DEFAULT FALSE,
  caught_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
)