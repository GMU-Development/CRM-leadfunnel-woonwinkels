/*
  # LeadFlow Mini-CRM - Initial Database Schema
  
  1. New Tables
    - `clients` - Klant bedrijven die leads ontvangen
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `company_name` (text) - Bedrijfsnaam
      - `contact_name` (text) - Contactpersoon naam
      - `email` (text, unique) - Email voor login
      - `logo_url` (text) - URL naar logo
      - `is_active` (boolean) - Of klant actief is
    
    - `leads` - Leads van klanten
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `client_id` (uuid, foreign key) - Referentie naar klant
      - Zichtbare velden: name, email, phone, company_name, source, campaign
      - Interne velden: click_id, ad_spend, company_info, UTM parameters, device, landing_page, form_data
      - CRM velden: status, next_action, next_action_date
      - Email tracking: email_sent_at, email_template_used
    
    - `lead_notes` - Notities bij leads
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `lead_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key naar auth.users)
      - `user_email` (text)
      - `content` (text)
    
    - `lead_tasks` - Taken gekoppeld aan leads
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `lead_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key naar auth.users)
      - `title` (text)
      - `due_date` (date)
      - `is_completed` (boolean)
      - `completed_at` (timestamp)
    
    - `lead_activity_log` - Activity log voor alle lead acties
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `lead_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key naar auth.users)
      - `user_email` (text)
      - `action_type` (text)
      - `old_value` (text)
      - `new_value` (text)
      - `description` (text)
    
    - `monthly_ad_spend` - Maandelijkse advertentie uitgaven
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key)
      - `month` (date)
      - `spend` (decimal)
      - `platform` (text)
      - Unique constraint op (client_id, month, platform)
    
    - `email_templates` - Email templates voor klanten
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `client_id` (uuid, foreign key)
      - `name` (text)
      - `subject` (text)
      - `html_content` (text)
      - `is_active` (boolean)
    
    - `admins` - Admin gebruikers
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key naar auth.users, unique)
      - `email` (text, unique)
      - `name` (text)
  
  2. Security
    - Enable RLS op alle tabellen
    - Klanten kunnen alleen hun eigen data zien
    - Admins kunnen alle data zien en bewerken
  
  3. Indexes
    - Indexes op foreign keys en veelgebruikte query velden
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text UNIQUE NOT NULL,
  logo_url text,
  is_active boolean DEFAULT true
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Zichtbaar voor klant
  name text NOT NULL,
  email text,
  phone text,
  company_name text,
  source text,
  campaign text,
  
  -- Intern/verborgen voor klant
  click_id text,
  ad_spend decimal(10,2),
  company_info jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  device text,
  landing_page text,
  form_data jsonb,
  
  -- CRM velden
  status text DEFAULT 'lead_buiten_budget',
  next_action text,
  next_action_date date,
  
  -- Email tracking
  email_sent_at timestamptz,
  email_template_used text
);

-- Create lead_notes table
CREATE TABLE IF NOT EXISTS lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  user_email text,
  content text NOT NULL
);

-- Create lead_tasks table
CREATE TABLE IF NOT EXISTS lead_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  due_date date,
  is_completed boolean DEFAULT false,
  completed_at timestamptz
);

-- Create lead_activity_log table
CREATE TABLE IF NOT EXISTS lead_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  user_email text,
  action_type text NOT NULL,
  old_value text,
  new_value text,
  description text
);

-- Create monthly_ad_spend table
CREATE TABLE IF NOT EXISTS monthly_ad_spend (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  month date NOT NULL,
  spend decimal(10,2) NOT NULL,
  platform text,
  UNIQUE(client_id, month, platform)
);

-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject text NOT NULL,
  html_content text NOT NULL,
  is_active boolean DEFAULT true
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) UNIQUE,
  email text UNIQUE NOT NULL,
  name text
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON leads(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_lead_id ON lead_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activity_log_lead_id ON lead_activity_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_monthly_ad_spend_client_id ON monthly_ad_spend(client_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_client_id ON email_templates(client_id);

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_ad_spend ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  TO authenticated
  USING (email = auth.jwt()->>'email');

CREATE POLICY "Admins can view all clients"
  ON clients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Leads policies
CREATE POLICY "Clients can view own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can view all leads"
  ON leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE email = auth.jwt()->>'email'
    )
  )
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients 
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can update all leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Allow webhook to insert leads"
  ON leads FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Admins can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Lead notes policies
CREATE POLICY "Users can view notes for accessible leads"
  ON lead_notes FOR SELECT
  TO authenticated
  USING (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert notes for accessible leads"
  ON lead_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update lead notes"
  ON lead_notes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete lead notes"
  ON lead_notes FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Lead tasks policies
CREATE POLICY "Users can view tasks for accessible leads"
  ON lead_tasks FOR SELECT
  TO authenticated
  USING (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert tasks for accessible leads"
  ON lead_tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tasks for accessible leads"
  ON lead_tasks FOR UPDATE
  TO authenticated
  USING (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete lead tasks"
  ON lead_tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Lead activity log policies
CREATE POLICY "Users can view activity for accessible leads"
  ON lead_activity_log FOR SELECT
  TO authenticated
  USING (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert activity for accessible leads"
  ON lead_activity_log FOR INSERT
  TO authenticated
  WITH CHECK (
    lead_id IN (
      SELECT id FROM leads 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email = auth.jwt()->>'email'
      )
    )
    OR
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete activity log"
  ON lead_activity_log FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Monthly ad spend policies
CREATE POLICY "Clients can view own ad spend"
  ON monthly_ad_spend FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can view all ad spend"
  ON monthly_ad_spend FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert ad spend"
  ON monthly_ad_spend FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update ad spend"
  ON monthly_ad_spend FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete ad spend"
  ON monthly_ad_spend FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Email templates policies
CREATE POLICY "Clients can view own templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE email = auth.jwt()->>'email'
    )
  );

CREATE POLICY "Admins can view all templates"
  ON email_templates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert templates"
  ON email_templates FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update templates"
  ON email_templates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete templates"
  ON email_templates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

-- Admins table policies
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can insert admins"
  ON admins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can update admins"
  ON admins FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete admins"
  ON admins FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admins 
      WHERE user_id = auth.uid()
    )
  );