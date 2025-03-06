/*
  # Add menu management tables and policies
  
  1. New Tables
    - menu_categories
      - id (uuid, primary key) 
      - name (text)
      - order (integer)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    - menu_items
      - id (uuid, primary key)
      - category_id (uuid, foreign key)
      - name (text)
      - description (text)
      - price (numeric)
      - available (boolean)
      - order (integer)
      - image_url (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
      
  2. Security
    - Enable RLS on both tables
    - Admins and owners can manage menu items and categories
    - All authenticated users can read menu data
*/

-- Create menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  available boolean DEFAULT true NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz
);

-- Enable RLS
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_categories
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

-- Create policies for menu_items
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