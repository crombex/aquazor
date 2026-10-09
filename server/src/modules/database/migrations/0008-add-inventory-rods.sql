CREATE TABLE inventory_rods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- уникальный идентификатор удочки в инвентаре
  user_id UUID REFERENCES users(id) NOT NULL, -- идентификатор игрока, которому принадлежит удочка
  rod_id UUID REFERENCES rods(id) NOT NULL, -- идентификатор удочки, которая находится в инвентаре
  started_at TIMESTAMPTZ, -- дата и время начала использования удочки
  finished_at TIMESTAMPTZ, -- дата и время окончания использования удочки
  deprecated BOOLEAN NOT NULL DEFAULT FALSE -- флаг, указывающий на то, что удочка больше не используется в игре
)