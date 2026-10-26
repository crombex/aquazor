CREATE TABLE shop_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item UUID NOT NULL,
  quantity INT NOT NULL,
  price INT NOT NULL
)