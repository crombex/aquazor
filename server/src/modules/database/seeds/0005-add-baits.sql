INSERT INTO baits (
  id,
  type,
  rarity,
  image_url,
  description,
  efficiency,
  buy_price,
  sell_price,
  level_required
) VALUES 

-- COMMON BAITS

(
  '706a956c-911a-4488-833a-7a8920e2a064',
  'червь дождевой',
  'common',
  'public/images/baits/cherv-dozhdevoi.png',
  'обычный червячок, на которого рыбачили все мы',
  0.13,
  10,
  5,
  0
),

-- UNCOMMON BAITS

(
  '16aa03ab-6cf0-4e03-a3e0-98b8a94306d1',
  'мотыль',
  'uncommon',
  'public/images/baits/motyl.png',
  'крошечный червячок, который живет в воде и является любимой приманкой для многих рыб',
  0.21,
  25,
  13,
  3
),

-- RARE BAITS

(
  'f16293f2-467e-4439-a380-8404b751ff45',
  'кукурузное зерно',
  'rare',
  'public/images/baits/kukuruznoe-zerno.png',
  'зерно кукурузы, которое привлекает многих рыб, особенно карпов',
  0.35,
  40,
  20,
  8
),

-- EPIC BAITS

(
  '376c1cc6-3f38-4f3c-8052-5a897e3e1a70',
  'живой лосось',
  'epic',
  'public/images/baits/zhivoy-losos.png',
  'живой лосось, который является редкой и дорогой приманкой для крупных хищных рыб',
  0.55,
  90,
  45,
  15
)

-- LEGENDARY BAITS