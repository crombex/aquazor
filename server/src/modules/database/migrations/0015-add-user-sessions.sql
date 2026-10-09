CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expired_at TIMESTAMPTZ NOT NULL,
  device TEXT
)