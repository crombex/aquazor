CREATE TABLE users_locations (
    user_id TEXT NOT NULL,
    location_id TEXT NOT NULL,

    PRIMARY KEY (user_id, location_id)
)