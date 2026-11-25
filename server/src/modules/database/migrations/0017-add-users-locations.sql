CREATE TABLE users_locations (
    user_id UUID NOT NULL REFERENCES users(id),
    location_id UUID NOT NULL REFERENCES locations(id),

    PRIMARY KEY (user_id, location_id)
)