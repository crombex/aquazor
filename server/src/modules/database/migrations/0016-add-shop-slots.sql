CREATE TABLE shop_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item UUID NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 0),
  price INT NOT NULL
)