
CREATE TABLE fish (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор рыбы
  type VARCHAR(64) NOT NULL, -- например 'щука обыкновенная'
  max_weight REAL NOT NULL, -- например 20.5 (килограммы)
  min_weight REAL NOT NULL, -- например 0.5 (килограммы)
  max_length REAL NOT NULL, -- например 1.5 (метры)
  min_length REAL NOT NULL, -- например 0.1 (метры)
  min_chance REAL NOT NULL, -- минимальный шанс поймать рыбу, например 0.01 (1%)
  max_chance REAL NOT NULL, -- максимальный шанс поймать рыбу, например 0.06 (6%)
  image_url TEXT NOT NULL, -- ссылка на изображение рыбы, например 'public/images/fish/chyka-obiknpvennaya.png'
  description TEXT, -- краткое описание про рыбу, её повадки, где водится и т.д.
  rarity rarity_enum NOT NULL DEFAULT 'common', -- рекость рыбы, влияет на шанс поймать её
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что рыба больше не водится в игре и не может быть поймана
)