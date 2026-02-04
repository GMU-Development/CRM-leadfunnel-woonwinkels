/*
  # Fix Admin Policies - Remove auth.users Subquery

  1. Problem
    - RLS policies cannot access auth.users table via subquery
    - This causes "permission denied for table users" error
  
  2. Solution
    - Create security definer function to get current user email
    - Update policies to use this function instead of subquery
  
  3. Changes
    - Add get_current_user_email() function
    - Update "Users can view admin record by email" policy
    - Update "Users can link their account to admin record" policy
*/

-- Create security definer function to get current user's email
CREATE OR REPLACE FUNCTION get_current_user_email()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT email FROM auth.users WHERE id = auth.uid();
$$;

-- Drop problematic policies
DROP POLICY IF EXISTS "Users can view admin record by email" ON admins;
DROP POLICY IF EXISTS "Users can link their account to admin record" ON admins;

-- Recreate policies using the security definer function
CREATE POLICY "Users can view admin record by email"
  ON admins FOR SELECT
  TO authenticated
  USING (lower(email) = lower(get_current_user_email()));

CREATE POLICY "Users can link their account to admin record"
  ON admins FOR UPDATE
  TO authenticated
  USING (lower(email) = lower(get_current_user_email()) AND user_id IS NULL)
  WITH CHECK (user_id = auth.uid());
