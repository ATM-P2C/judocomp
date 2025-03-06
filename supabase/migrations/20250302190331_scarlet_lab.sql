/*
  # Initial Database Schema for Judo Competition Manager

  1. New Tables
    - `users` - Stores user information and authentication
    - `clubs` - Stores club information
    - `competitors` - Stores competitor information
    - `tournaments` - Stores tournament information
    - `categories` - Stores weight and age categories
    - `combat_rules` - Stores combat rules configuration
    - `tournament_settings` - Stores tournament settings
    - `tatamis` - Stores tatami (combat surface) information
    - `matches` - Stores match information
    - `pools` - Stores pool information
    - `pool_competitors` - Stores competitors in pools
    - `volunteers` - Stores volunteer information
    - `weighing_records` - Stores weighing records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'coach', 'member')),
  club_id UUID,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create competitors table
CREATE TABLE IF NOT EXISTS competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  age_category TEXT NOT NULL,
  weight_category TEXT NOT NULL,
  age INTEGER NOT NULL,
  belt TEXT NOT NULL,
  license_number TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create combat_rules table
CREATE TABLE IF NOT EXISTS combat_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  ippon_points INTEGER NOT NULL,
  wazaari_points INTEGER NOT NULL,
  yuko_points INTEGER NOT NULL,
  max_penalties INTEGER NOT NULL,
  golden_score BOOLEAN NOT NULL DEFAULT true,
  golden_score_duration INTEGER, -- in seconds
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  organizer TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
  combat_rules_id UUID REFERENCES combat_rules(id),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create tournament_settings table
CREATE TABLE IF NOT EXISTS tournament_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  seeding_method TEXT NOT NULL CHECK (seeding_method IN ('belt', 'alphabetical', 'random')),
  pool_size INTEGER NOT NULL,
  elimination_type TEXT NOT NULL CHECK (elimination_type IN ('single', 'double', 'repechage')),
  third_place_match BOOLEAN NOT NULL DEFAULT true,
  points_for_win INTEGER NOT NULL,
  points_for_draw INTEGER NOT NULL,
  points_for_loss INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age_category TEXT NOT NULL,
  weight_category TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create tatamis table
CREATE TABLE IF NOT EXISTS tatamis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'paused')),
  table_chief_id UUID REFERENCES users(id),
  referee_id UUID REFERENCES users(id),
  current_match_id UUID,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create pools table
CREATE TABLE IF NOT EXISTS pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create pool_competitors table
CREATE TABLE IF NOT EXISTS pool_competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id UUID NOT NULL REFERENCES pools(id) ON DELETE CASCADE,
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  wins INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ,
  UNIQUE(pool_id, competitor_id)
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  competitor1_id UUID NOT NULL REFERENCES competitors(id),
  competitor2_id UUID NOT NULL REFERENCES competitors(id),
  score1 INTEGER,
  score2 INTEGER,
  penalties1 INTEGER,
  penalties2 INTEGER,
  winner_id UUID REFERENCES competitors(id),
  win_method TEXT,
  status TEXT NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  round TEXT NOT NULL,
  tatami_id UUID REFERENCES tatamis(id),
  scheduled_time TIMESTAMPTZ,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  pool_id UUID REFERENCES pools(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ,
  CHECK (competitor1_id != competitor2_id)
);

-- Add foreign key to tatamis for current_match_id
ALTER TABLE tatamis ADD CONSTRAINT tatamis_current_match_id_fkey FOREIGN KEY (current_match_id) REFERENCES matches(id) ON DELETE SET NULL;

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  time_slots TEXT[] NOT NULL,
  points INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Create weighing_records table
CREATE TABLE IF NOT EXISTS weighing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  weight NUMERIC(5,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'changed')),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Add foreign key to users for club_id
ALTER TABLE users ADD CONSTRAINT users_club_id_fkey FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE combat_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tatamis ENABLE ROW LEVEL SECURITY;
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE weighing_records ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins can read all data
CREATE POLICY "Admins can read all data" ON users
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Create similar policies for other tables
-- Clubs
CREATE POLICY "Anyone can read clubs" ON clubs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert clubs" ON clubs
  FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

CREATE POLICY "Admins can update clubs" ON clubs
  FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Competitors
CREATE POLICY "Anyone can read competitors" ON competitors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Club admins can manage their competitors" ON competitors
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner', 'coach') AND users.club_id = competitors.club_id
  ));

-- Combat Rules
CREATE POLICY "Anyone can read combat rules" ON combat_rules
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage combat rules" ON combat_rules
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Tournaments
CREATE POLICY "Anyone can read tournaments" ON tournaments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage tournaments" ON tournaments
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Tournament Settings
CREATE POLICY "Anyone can read tournament settings" ON tournament_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage tournament settings" ON tournament_settings
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Categories
CREATE POLICY "Anyone can read categories" ON categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Tatamis
CREATE POLICY "Anyone can read tatamis" ON tatamis
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage tatamis" ON tatamis
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Pools
CREATE POLICY "Anyone can read pools" ON pools
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage pools" ON pools
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Pool Competitors
CREATE POLICY "Anyone can read pool competitors" ON pool_competitors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage pool competitors" ON pool_competitors
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Matches
CREATE POLICY "Anyone can read matches" ON matches
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage matches" ON matches
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Volunteers
CREATE POLICY "Anyone can read volunteers" ON volunteers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage volunteers" ON volunteers
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Weighing Records
CREATE POLICY "Anyone can read weighing records" ON weighing_records
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage weighing records" ON weighing_records
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));