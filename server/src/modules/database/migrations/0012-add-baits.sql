CREATE TABLE baits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор приманки
  type VARCHAR(64) UNIQUE NOT NULL, -- например 'червь дождевой'
  rarity rarity_enum NOT NULL DEFAULT 'common', -- редкость приманки, влияет на шанс поймать рыбу
  image_url TEXT NOT NULL, -- ссылка на изображение приманки например 'public/images/baits/cherv-dozhdevoi.png'
  description TEXT, -- краткое описание приманки
  efficiency DECIMAL(3, 1), -- эффективность приманки
  buy_price INT NOT NULL,
  sell_price INT NOT NULL,
  level_required SMALLINT NOT NULL DEFAULT 0,
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что приманка больше не используется в игре
)