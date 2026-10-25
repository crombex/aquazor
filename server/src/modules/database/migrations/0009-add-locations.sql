CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор локации
  title VARCHAR(255) NOT NULL, -- например 'Байкал', 'Волга', 'Куйбышевское'
  type VARCHAR(64) NOT NULL, -- например 'озеро', 'река', 'водохранилище'
  fertility DECIMAL(3, 1) NOT NULL, -- плодородность локации
  image_url TEXT NOT NULL, -- ссылка на изображение локации например 'public/images/locations/baykal.png'
  description TEXT, -- краткое описание локации 
  level_required SMALLINT NOT NULL, -- минимальный уровень игрока, необходимый для рыбалки в этой локации
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что локация больше не используется в игре
)