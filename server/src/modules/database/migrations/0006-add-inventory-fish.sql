
CREATE TABLE inventory_fish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор пойманной рыбы
  user_id UUID NOT NULL REFERENCES users(id), -- идентификатор игрока, который поймал рыбу
  fish_id UUID NOT NULL REFERENCES fish(id), -- идентификатор вида рыбы, которая была поймана
  weight DECIMAL(6,2) NOT NULL, -- вес пойманной рыбы
  length DECIMAL(4,2) NOT NULL, -- длина пойманной рыбы
  description TEXT, -- краткое описание пойманной рыбы
  sell_price INT NOT NULL
)