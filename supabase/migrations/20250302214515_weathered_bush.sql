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

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can read emergency contacts" ON emergency_contacts;
  DROP POLICY IF EXISTS "Club admins can manage their competitors' emergency contacts" ON emergency_contacts;
  DROP POLICY IF EXISTS "Admins can manage all emergency contacts" ON emergency_contacts;
END $$;

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

-- Add reference numbers to existing competitors
UPDATE competitors 
SET reference_number = 'JC-' || floor(random() * 900000 + 100000)::text
WHERE reference_number IS NULL;

-- Add reference codes to existing tournaments
UPDATE tournaments 
SET reference_code = 'T' || floor(random() * 90000 + 10000)::text
WHERE reference_code IS NULL;