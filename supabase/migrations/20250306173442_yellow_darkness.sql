/*
  # Add RLS policies for menu management
  
  1. Changes
    - Enable RLS on menu_categories and menu_items tables if not already enabled
    - Add policies for admins to manage menu categories and items if they don't exist
    - Add policies for authenticated users to read menu data if they don't exist
    
  2. Security
    - Only admins and owners can manage menu items and categories
    - All authenticated users can read menu data
*/

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'menu_categories' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'menu_items' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Add policies for menu_categories if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'menu_categories' 
    AND policyname = 'Admins can manage menu categories'
  ) THEN
    CREATE POLICY "Admins can manage menu categories"
      ON menu_categories
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role IN ('admin', 'owner')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'menu_categories' 
    AND policyname = 'Anyone can read menu categories'
  ) THEN
    CREATE POLICY "Anyone can read menu categories"
      ON menu_categories
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Add policies for menu_items if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'menu_items' 
    AND policyname = 'Admins can manage menu items'
  ) THEN
    CREATE POLICY "Admins can manage menu items"
      ON menu_items
      FOR ALL
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM users
          WHERE users.id = auth.uid()
          AND users.role IN ('admin', 'owner')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'menu_items' 
    AND policyname = 'Anyone can read menu items'
  ) THEN
    CREATE POLICY "Anyone can read menu items"
      ON menu_items
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;