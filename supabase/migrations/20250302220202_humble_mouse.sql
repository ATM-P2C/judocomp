-- Add birth_date column with a default value
ALTER TABLE competitors 
ADD COLUMN IF NOT EXISTS birth_date DATE DEFAULT '2000-01-01';

-- Make birth_date required after setting a default
ALTER TABLE competitors 
ALTER COLUMN birth_date SET NOT NULL;

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