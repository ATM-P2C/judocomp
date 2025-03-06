-- Fix the relationship between tatamis and matches
ALTER TABLE tatamis DROP CONSTRAINT IF EXISTS tatamis_current_match_id_fkey;
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_tatami_id_fkey;

-- Add the constraints back with proper ON DELETE behavior
ALTER TABLE tatamis
  ADD CONSTRAINT tatamis_current_match_id_fkey 
  FOREIGN KEY (current_match_id) 
  REFERENCES matches(id) 
  ON DELETE SET NULL;

ALTER TABLE matches
  ADD CONSTRAINT matches_tatami_id_fkey 
  FOREIGN KEY (tatami_id) 
  REFERENCES tatamis(id) 
  ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS matches_tatami_id_idx ON matches(tatami_id);
CREATE INDEX IF NOT EXISTS tatamis_current_match_id_idx ON tatamis(current_match_id);