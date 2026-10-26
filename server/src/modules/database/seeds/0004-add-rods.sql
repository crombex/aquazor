INSERT INTO rods (
  id,
  type,
  efficiency,
  power,
  rarity,
  image_url,
  description
  buy_price,
  sell_price,
  level_required
) VALUES

-- COMMON RODS

(
  '515f66d8-88d9-4f5e-a453-b38813593d92',
  'Бамбуковая удочка',
  0.10,
  0.23,
  'common',
  'public/images/rods/bambukovaya-udochka.png',
  'Простая удочка для начинающих рыбаков, подходит для ловли мелкой рыбы.',
  100,
  50,
  1
),

-- UNCOMMON RODS
(
  'dbf7da7e-e3e2-4a49-a8da-3e0afab06fa3',
  'Стекловолоконная удочка',
  0.24,
  0.33,
  'uncommon',
  'public/images/rods/steklovolokonnaya-udochka.png',
  'Интересная на вид удочка с хорошим потенциалом.',
  500,
  250,
  3
),

-- RARE RODS

-- EPIC RODS

-- LEGENDARY RODS

(
  '70f1f93a-f1e3-475d-bee6-e484259f7d0c',
  'Удочка Царя-рыбака',
  0.91,
  0.89,
  'legendary',
  'public/images/rods/udochka-tsarya-rybaka.png',
  'Артефакт из старинной легенды, по преданию не знает промаха.',
  10000,
  5000,
  50
)