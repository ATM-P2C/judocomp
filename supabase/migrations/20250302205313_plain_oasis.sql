/*
  # Add emergency contacts and competitor reference numbers

  1. New Tables
    - `emergency_contacts`
      - `id` (uuid, primary key)
      - `competitor_id` (uuid, foreign key to competitors)
      - `first_name` (text)
      - `last_name` (text)
      - `phone_number` (text)
      - `relationship` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Changes
    - Add `reference_number` column to `competitors` table
    - Add `reference_code` column to `tournaments` table
  
  3. Security
    - Enable RLS on `emergency_contacts` table
    - Add policies for `emergency_contacts` table
*/

-- Add reference_number to competitors
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS reference_number TEXT;

-- Add reference_code to tournaments
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS reference_code TEXT;

-- Create emergency_contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for emergency_contacts
CREATE POLICY "Anyone can read emergency contacts" ON emergency_contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Club admins can manage their competitors' emergency contacts" ON emergency_contacts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    JOIN competitors ON competitors.id = emergency_contacts.competitor_id
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner', 'coach') AND users.club_id = competitors.club_id
  ));

CREATE POLICY "Admins can manage all emergency contacts" ON emergency_contacts
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.role IN ('admin', 'owner')
  ));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS emergency_contacts_competitor_id_idx ON emergency_contacts(competitor_id);