/*
  # Update competitor schema
  
  1. Changes
    - Add birth_date column to competitors table
    - Update existing competitors to have a birth_date based on their age
    - Remove age column from competitors table
    - Update belt options to only include up to black belt
  
  2. Notes
    - Calculates birth_date from age for existing records
    - Preserves data integrity by doing the migration in steps
*/

-- Add birth_date column
ALTER TABLE competitors 
ADD COLUMN IF NOT EXISTS birth_date DATE;

-- Update existing records to have a birth_date based on their age
UPDATE competitors 
SET birth_date = (CURRENT_DATE - (age || ' years')::INTERVAL)::DATE
WHERE birth_date IS NULL AND age IS NOT NULL;

-- Make birth_date required
ALTER TABLE competitors 
ALTER COLUMN birth_date SET NOT NULL;

-- Drop age column
ALTER TABLE competitors 
DROP COLUMN IF EXISTS age;

-- Add check constraint to ensure valid belt values
ALTER TABLE competitors 
DROP CONSTRAINT IF EXISTS valid_belt_check;

ALTER TABLE competitors 
ADD CONSTRAINT valid_belt_check 
CHECK (belt IN (
  'Blanche',
  'Blanche/Jaune',
  'Jaune',
  'Jaune/Orange',
  'Orange',
  'Orange/Verte',
  'Verte',
  'Verte/Bleue',
  'Bleue',
  'Bleue/Marron',
  'Marron',
  'Noire'
));