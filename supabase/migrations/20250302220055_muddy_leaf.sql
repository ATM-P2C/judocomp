/*
  # Update competitors table to use birth_date instead of age

  1. Changes
    - Add birth_date column to competitors table
    - Add check constraint for valid belt values
    - Remove age column

  2. Notes
    - We skip the data migration since we don't have the age column anymore
    - The birth_date will be set when adding new competitors
*/

-- Add birth_date column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competitors' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE competitors ADD COLUMN birth_date DATE;
  END IF;
END $$;

-- Make birth_date required
ALTER TABLE competitors 
ALTER COLUMN birth_date SET NOT NULL;

-- Drop age column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'competitors' AND column_name = 'age'
  ) THEN
    ALTER TABLE competitors DROP COLUMN age;
  END IF;
END $$;

-- Add check constraint to ensure valid belt values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage 
    WHERE table_name = 'competitors' AND constraint_name = 'valid_belt_check'
  ) THEN
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
  END IF;
END $$;