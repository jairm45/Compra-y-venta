/*
  # Add Profile Photos and Rating System

  1. Modified Tables
    - `profiles`
      - `avatar_url` (text) - URL to profile photo
  
    - New table `ratings`
      - `id` (uuid, primary key)
      - `seller_id` (uuid, references profiles)
      - `buyer_id` (uuid, references profiles)
      - `product_id` (uuid, references products)
      - `stars` (integer, 1-5)
      - `comment` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on ratings table
    - Users can create ratings for products they didn't publish
    - Users can view all ratings
    - Users can only update/delete their own ratings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text DEFAULT '';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  stars integer NOT NULL CHECK (stars >= 1 AND stars <= 5),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own ratings"
  ON ratings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = buyer_id AND auth.uid() != seller_id);

CREATE POLICY "Users can update own ratings"
  ON ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id)
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can delete own ratings"
  ON ratings FOR DELETE
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE INDEX IF NOT EXISTS ratings_seller_id_idx ON ratings(seller_id);
CREATE INDEX IF NOT EXISTS ratings_buyer_id_idx ON ratings(buyer_id);
CREATE INDEX IF NOT EXISTS ratings_product_id_idx ON ratings(product_id);