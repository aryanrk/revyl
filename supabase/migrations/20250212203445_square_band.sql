/*
  # Add interests field to profiles table

  1. Changes
    - Add `interests` array field to profiles table to store user interests
    - Add default empty array value
    - Update existing rows with empty array

  2. Security
    - No changes to RLS policies needed as the existing policies cover the new field
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'interests'
  ) THEN
    ALTER TABLE profiles ADD COLUMN interests text[] DEFAULT '{}';
  END IF;
END $$;