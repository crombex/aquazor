CREATE TABLE fishing_action_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fishing_action_id UUID NOT NULL REFERENCES fishing_actions(id),
    slot_number SMALLINT NOT NULL,
    inventory_rod_id UUID NOT NULL REFERENCES inventory_rods(id),
    inventory_bait_id UUID REFERENCES inventory_baits(id),
    fish_id UUID REFERENCES fish(id),
    was_caught BOOLEAN NOT NULL DEFAULT FALSE,
    fish_weight REAL,
    fish_length REAL,
    fish_sell_price INT,
    experience_earned SMALLINT NOT NULL,
    bait_consumed BOOLEAN NOT NULL,
    inventory_fish_id UUID REFERENCES inventory_fish(id),

    -- 1. Номер слота должен быть положительным (начинается с 1)
    CONSTRAINT chk_slot_number_positive CHECK (slot_number > 0),

    -- 2. Связь статуса поимки (was_caught) и данных о рыбе
    CONSTRAINT chk_caught_consistency CHECK (
        (
            was_caught = TRUE
            AND fish_weight > 0
            AND fish_length > 0
            AND fish_sell_price > 0
            AND experience_earned > 0
        )
        OR
        (
            was_caught = FALSE
            AND fish_weight IS NULL
            AND fish_length IS NULL
            AND fish_sell_price IS NULL
            AND inventory_fish_id IS NULL
            AND experience_earned = 0
        )
    ),

    -- 3. Уникальность номера слота в рамках одного действия рыбалки
    CONSTRAINT uq_fishing_action_slot UNIQUE (fishing_action_id, slot_number)
);
