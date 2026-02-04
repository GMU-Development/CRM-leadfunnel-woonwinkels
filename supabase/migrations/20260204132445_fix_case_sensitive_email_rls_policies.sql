/*
  # Fix case-sensitive email RLS policies

  1. Problem
    - RLS policies on admins table use case-sensitive email comparison
    - Users logging in with different email casing (e.g., Dev@gmu.online vs dev@gmu.online) cannot access their admin record
    - This causes infinite loading because queries return no data

  2. Changes
    - Drop and recreate "Users can view admin record by email" policy with LOWER() comparison
    - Drop and recreate "Users can link their account to admin record" policy with LOWER() comparison

  3. Security
    - Policies remain restrictive, only allowing access to own admin record
    - Case-insensitive matching is standard practice for email handling
*/

DROP POLICY IF EXISTS "Users can view admin record by email" ON admins;

CREATE POLICY "Users can view admin record by email"
  ON admins
  FOR SELECT
  TO authenticated
  USING (
    LOWER(email) = LOWER((SELECT users.email FROM auth.users WHERE users.id = auth.uid())::text)
  );

DROP POLICY IF EXISTS "Users can link their account to admin record" ON admins;

CREATE POLICY "Users can link their account to admin record"
  ON admins
  FOR UPDATE
  TO authenticated
  USING (
    LOWER(email) = LOWER((SELECT users.email FROM auth.users WHERE users.id = auth.uid())::text)
    AND user_id IS NULL
  )
  WITH CHECK (user_id = auth.uid());
