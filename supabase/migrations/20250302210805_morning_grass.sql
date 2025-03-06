/*
  # Add emergency contacts support

  1. Changes
    - Add `reference_number` to competitors table
    - Add `reference_code` to tournaments table
  2. Security
    - Update existing policies
*/

-- Add reference_number to competitors
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS reference_number TEXT;

-- Add reference_code to tournaments
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS reference_code TEXT;

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