CREATE TABLE rods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор удочки
  efficiency DECIMAL(3, 1) NOT NULL, -- эффективность удочки, влияет на шанс поймать рыбу
  description TEXT, -- краткое описание удочки
  image_url TEXT NOT NULL, -- ссылка на изображение удочки например 'public/images/rods/derevyannaya-ydochka.png'
  type VARCHAR(64) UNIQUE NOT NULL, -- например 'деревянная удочка'
  rarity rarity_enum NOT NULL DEFAULT 'common', -- редкость удочки, влияет на шанс поймать рыбу
  power DECIMAL(3, 1) NOT NULL, -- сила удочки, влияет на шанс поймать рыбу
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что удочка больше не используется в игре
)