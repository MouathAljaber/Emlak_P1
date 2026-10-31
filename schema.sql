CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  club_name TEXT NOT NULL,
  country TEXT NOT NULL,
  team_type TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  players INTEGER,
  staff INTEGER,
  age_group TEXT,
  level TEXT,
  dates TEXT,
  nights INTEGER,
  budget TEXT,
  services TEXT[] NOT NULL DEFAULT '{}',
  extras TEXT,
  message TEXT,
  consent BOOLEAN NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS enquiries_status_idx ON enquiries (status);
