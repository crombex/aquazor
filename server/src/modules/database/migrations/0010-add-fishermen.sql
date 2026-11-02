CREATE TABLE fishermen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор рыбака
  name VARCHAR(64) NOT NULL UNIQUE, -- имя рыбака
  age SMALLINT NOT NULL, -- возраст рыбака
  skill DECIMAL(3, 1) NOT NULL, -- уровень навыков рыбака
  luck DECIMAL(3, 1) NOT NULL, -- уровень удачи рыбака
  avatar_url TEXT NOT NULL, -- ссылка на изображение рыбака
  description TEXT, -- краткое описание рыбака
  level_required SMALLINT NOT NULL DEFAULT 0,
  unavailable BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что рыбак больше не используется в игре
)