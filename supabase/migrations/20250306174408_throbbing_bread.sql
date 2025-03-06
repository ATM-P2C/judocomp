/*
  # Menu Management Tables and Policies

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

-- Create menu_categories table if it doesn't exist
CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  "order" integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz
);

-- Create menu_items table if it doesn't exist
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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage menu categories" ON menu_categories;
DROP POLICY IF EXISTS "Anyone can read menu categories" ON menu_categories;
DROP POLICY IF EXISTS "Admins can manage menu items" ON menu_items;
DROP POLICY IF EXISTS "Anyone can read menu items" ON menu_items;

-- Enable RLS
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Create policies for menu_categories
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
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'owner')
  )
);

CREATE POLICY "Anyone can read menu categories" 
ON menu_categories 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policies for menu_items
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
) 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'owner')
  )
);

CREATE POLICY "Anyone can read menu items" 
ON menu_items 
FOR SELECT 
TO authenticated 
USING (true);