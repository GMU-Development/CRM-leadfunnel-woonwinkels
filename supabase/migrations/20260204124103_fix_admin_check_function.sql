/*
  # Fix Admin Check met Security Definer Functie
  
  Maak een helper functie die RLS omzeilt om oneindige recursie te voorkomen.
  Update alle policies om deze functie te gebruiken in plaats van direct de admins tabel te checken.
*/

-- Drop oude policies op admins tabel
DROP POLICY IF EXISTS "Admins can view own record" ON admins;
DROP POLICY IF EXISTS "Admins can view all admin records" ON admins;
DROP POLICY IF EXISTS "Existing admins can insert new admins" ON admins;
DROP POLICY IF EXISTS "Existing admins can update admins" ON admins;
DROP POLICY IF EXISTS "Existing admins can delete admins" ON admins;

-- Maak een security definer functie die RLS omzeilt
CREATE OR REPLACE FUNCTION is_admin(user_id_param uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins WHERE user_id = user_id_param
  );
$$;

-- Nieuwe policies voor admins tabel zonder recursie
CREATE POLICY "Anyone authenticated can view own admin record"
  ON admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all admin records"
  ON admins FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert new admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update admins"
  ON admins FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete admins"
  ON admins FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Update policies op andere tabellen om de functie te gebruiken
-- Clients table
DROP POLICY IF EXISTS "Admins can view all clients" ON clients;
DROP POLICY IF EXISTS "Admins can insert clients" ON clients;
DROP POLICY IF EXISTS "Admins can update clients" ON clients;
DROP POLICY IF EXISTS "Admins can delete clients" ON clients;

CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Leads table
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;
DROP POLICY IF EXISTS "Admins can update all leads" ON leads;
DROP POLICY IF EXISTS "Admins can insert leads" ON leads;
DROP POLICY IF EXISTS "Admins can delete leads" ON leads;

CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Lead notes table
DROP POLICY IF EXISTS "Admins can update lead notes" ON lead_notes;
DROP POLICY IF EXISTS "Admins can delete lead notes" ON lead_notes;

CREATE POLICY "Admins can update lead notes"
  ON lead_notes FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete lead notes"
  ON lead_notes FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Lead tasks table
DROP POLICY IF EXISTS "Admins can delete lead tasks" ON lead_tasks;

CREATE POLICY "Admins can delete lead tasks"
  ON lead_tasks FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Lead activity log table
DROP POLICY IF EXISTS "Admins can delete activity log" ON lead_activity_log;

CREATE POLICY "Admins can delete activity log"
  ON lead_activity_log FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Monthly ad spend table
DROP POLICY IF EXISTS "Admins can view all ad spend" ON monthly_ad_spend;
DROP POLICY IF EXISTS "Admins can insert ad spend" ON monthly_ad_spend;
DROP POLICY IF EXISTS "Admins can update ad spend" ON monthly_ad_spend;
DROP POLICY IF EXISTS "Admins can delete ad spend" ON monthly_ad_spend;

CREATE POLICY "Admins can view all ad spend"
  ON monthly_ad_spend FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert ad spend"
  ON monthly_ad_spend FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update ad spend"
  ON monthly_ad_spend FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete ad spend"
  ON monthly_ad_spend FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- Email templates table
DROP POLICY IF EXISTS "Admins can view all templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can insert templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can update templates" ON email_templates;
DROP POLICY IF EXISTS "Admins can delete templates" ON email_templates;

CREATE POLICY "Admins can view all templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));
