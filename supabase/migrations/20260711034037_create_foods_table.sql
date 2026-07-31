/*
# Create foods table for CampusMarket

## Purpose
Adds a new "foods" (alimentos) listing category to the campus marketplace, allowing students to buy and sell food items (snacks, meals, beverages, etc.).

## New Table: foods
- `id` (uuid, primary key, auto-generated)
- `user_id` (uuid, not null, defaults to auth.uid(), FK to profiles)
- `title` (text, not null) — name of the food item
- `description` (text, default empty) — details about the food
- `price` (numeric, not null) — price in COP
- `category` (text, not null) — food category (snacks, comidas, bebidas, postres, otro)
- `image_url` (text, default empty) — optional product photo
- `created_at` (timestamptz, default now())
- `updated_at` (timestamptz, default now())

## Security
- RLS enabled on foods
- SELECT: anyone can view (public marketplace)
- INSERT/UPDATE/DELETE: authenticated users, owner-scoped via auth.uid() = user_id
- user_id defaults to auth.uid() so inserts without explicit user_id succeed
*/

CREATE TABLE IF NOT EXISTS foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'otro',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view foods" ON foods;
CREATE POLICY "Anyone can view foods"
ON foods FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Users can create own foods" ON foods;
CREATE POLICY "Users can create own foods"
ON foods FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own foods" ON foods;
CREATE POLICY "Users can update own foods"
ON foods FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own foods" ON foods;
CREATE POLICY "Users can delete own foods"
ON foods FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
