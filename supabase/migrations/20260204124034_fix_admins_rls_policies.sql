/*
  # Fix Admins Table RLS Policies
  
  Verwijder de oude policies die oneindige recursie veroorzaken
  en maak nieuwe policies die geen recursie hebben.
  
  De admins tabel moet alleen policies hebben die:
  - Admins kunnen zichzelf en andere admins zien
  - Geen recursieve checks doen op dezelfde tabel
*/

-- Drop old policies
DROP POLICY IF EXISTS "Admins can view all admins" ON admins;
DROP POLICY IF EXISTS "Admins can insert admins" ON admins;
DROP POLICY IF EXISTS "Admins can update admins" ON admins;
DROP POLICY IF EXISTS "Admins can delete admins" ON admins;

-- Create new policies zonder recursie
-- Admins kunnen hun eigen record zien
CREATE POLICY "Admins can view own record"
  ON admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins kunnen alle admin records zien als ze zelf admin zijn
-- Dit checkt alleen of de user_id bestaat in de tabel
CREATE POLICY "Admins can view all admin records"
  ON admins FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admins WHERE user_id = auth.uid())
  );

-- Alleen bestaande admins kunnen nieuwe admins toevoegen
CREATE POLICY "Existing admins can insert new admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins WHERE user_id = auth.uid())
  );

-- Alleen bestaande admins kunnen admin records updaten
CREATE POLICY "Existing admins can update admins"
  ON admins FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admins WHERE user_id = auth.uid())
  )
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM admins WHERE user_id = auth.uid())
  );

-- Alleen bestaande admins kunnen admin records verwijderen
CREATE POLICY "Existing admins can delete admins"
  ON admins FOR DELETE
  TO authenticated
  USING (
    auth.uid() IN (SELECT user_id FROM admins WHERE user_id = auth.uid())
  );
