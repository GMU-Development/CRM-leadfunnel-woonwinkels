/*
  # Demo Data voor LeadFlow Mini-CRM
  
  1. Demo Klant
    - Bedrijf: Bakkerij De Gouden Krakeling
    - Contactpersoon: Jan de Bakker
    - Email: jan@goudenkrakeling.nl
  
  2. Demo Leads (10 stuks)
    - Variërende statussen
    - Verschillende bronnen en campagnes
    - Verschillende datums (van 1 uur tot 14 dagen geleden)
  
  3. Demo Ad Spend
    - Meerdere maanden
    - Verschillende platforms
  
  4. Demo Notities
    - Bij enkele leads
  
  5. Demo Email Template
    - Basis notificatie template
*/

-- Insert demo client
INSERT INTO clients (company_name, contact_name, email, is_active)
VALUES ('Bakkerij De Gouden Krakeling', 'Jan de Bakker', 'jan@goudenkrakeling.nl', true)
ON CONFLICT (email) DO NOTHING;

-- Insert demo leads
DO $$
DECLARE
  v_client_id uuid;
BEGIN
  SELECT id INTO v_client_id FROM clients WHERE email = 'jan@goudenkrakeling.nl';
  
  IF v_client_id IS NOT NULL THEN
    -- Lead 1
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at, next_action, next_action_date)
    VALUES (
      v_client_id,
      'Pieter Jansen',
      'pieter@example.nl',
      '06-12345678',
      'Jansen & Zn',
      'Meta Ads',
      'Broodjes Campagne',
      'lead_in_budget',
      NOW() - INTERVAL '1 day',
      'Terugbellen voor afspraak',
      CURRENT_DATE + 1
    ) ON CONFLICT DO NOTHING;

    -- Lead 2
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at)
    VALUES (
      v_client_id,
      'Maria van Dijk',
      'maria@example.nl',
      '06-23456789',
      'Van Dijk Events',
      'Google Ads',
      'Taarten Campagne',
      'in_contact',
      NOW() - INTERVAL '3 days'
    ) ON CONFLICT DO NOTHING;

    -- Lead 3
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at, next_action, next_action_date)
    VALUES (
      v_client_id,
      'Kees de Vries',
      'kees@example.nl',
      '06-34567890',
      'De Vries Horeca',
      'Meta Ads',
      'Broodjes Campagne',
      'kwalitatieve_lead',
      NOW() - INTERVAL '5 days',
      'Offerte opstellen',
      CURRENT_DATE + 3
    ) ON CONFLICT DO NOTHING;

    -- Lead 4
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at, next_action, next_action_date)
    VALUES (
      v_client_id,
      'Sophie Bakker',
      'sophie@example.nl',
      '06-45678901',
      'Bakker Catering',
      'Google Ads',
      'Catering Campagne',
      'offerte',
      NOW() - INTERVAL '7 days',
      'Offerte follow-up',
      CURRENT_DATE
    ) ON CONFLICT DO NOTHING;

    -- Lead 5
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at)
    VALUES (
      v_client_id,
      'Thomas Berg',
      'thomas@example.nl',
      '06-56789012',
      'Berg & Co',
      'Meta Ads',
      'Broodjes Campagne',
      'klant',
      NOW() - INTERVAL '14 days'
    ) ON CONFLICT DO NOTHING;

    -- Lead 6
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at)
    VALUES (
      v_client_id,
      'Lisa Smit',
      'lisa@example.nl',
      '06-67890123',
      'Smit Solutions',
      'Google Ads',
      'Taarten Campagne',
      'niet_geschikt',
      NOW() - INTERVAL '10 days'
    ) ON CONFLICT DO NOTHING;

    -- Lead 7
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at)
    VALUES (
      v_client_id,
      'Mark Visser',
      'mark@example.nl',
      '06-78901234',
      'Visser BV',
      'Meta Ads',
      'Catering Campagne',
      'lead_buiten_budget',
      NOW() - INTERVAL '2 days'
    ) ON CONFLICT DO NOTHING;

    -- Lead 8
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at, next_action, next_action_date)
    VALUES (
      v_client_id,
      'Eva Kok',
      'eva@example.nl',
      '06-89012345',
      'Kok Events',
      'Google Ads',
      'Broodjes Campagne',
      'lead_in_budget',
      NOW() - INTERVAL '4 hours',
      'Bellen om budget te bespreken',
      CURRENT_DATE + 2
    ) ON CONFLICT DO NOTHING;

    -- Lead 9
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at)
    VALUES (
      v_client_id,
      'Rick de Groot',
      'rick@example.nl',
      '06-90123456',
      'De Groot Horeca',
      'Meta Ads',
      'Taarten Campagne',
      'in_contact',
      NOW() - INTERVAL '6 days'
    ) ON CONFLICT DO NOTHING;

    -- Lead 10
    INSERT INTO leads (client_id, name, email, phone, company_name, source, campaign, status, created_at)
    VALUES (
      v_client_id,
      'Anna Mulder',
      'anna@example.nl',
      '06-01234567',
      'Mulder & Partners',
      'Google Ads',
      'Catering Campagne',
      'lead_buiten_budget',
      NOW() - INTERVAL '1 hour'
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert demo ad spend
DO $$
DECLARE
  v_client_id uuid;
BEGIN
  SELECT id INTO v_client_id FROM clients WHERE email = 'jan@goudenkrakeling.nl';
  
  IF v_client_id IS NOT NULL THEN
    INSERT INTO monthly_ad_spend (client_id, month, spend, platform)
    VALUES
      (v_client_id, '2025-01-01', 1500.00, 'Meta Ads'),
      (v_client_id, '2025-01-01', 1000.00, 'Google Ads'),
      (v_client_id, '2025-02-01', 1750.00, 'Meta Ads'),
      (v_client_id, '2025-02-01', 1250.00, 'Google Ads')
    ON CONFLICT (client_id, month, platform) DO NOTHING;
  END IF;
END $$;

-- Insert demo notes
DO $$
DECLARE
  v_lead_id uuid;
BEGIN
  SELECT id INTO v_lead_id FROM leads WHERE email = 'maria@example.nl';
  IF v_lead_id IS NOT NULL THEN
    INSERT INTO lead_notes (lead_id, user_email, content)
    VALUES (v_lead_id, 'jan@goudenkrakeling.nl', 'Gebeld, komt volgende week langs voor proeverij')
    ON CONFLICT DO NOTHING;
  END IF;

  SELECT id INTO v_lead_id FROM leads WHERE email = 'kees@example.nl';
  IF v_lead_id IS NOT NULL THEN
    INSERT INTO lead_notes (lead_id, user_email, content)
    VALUES (v_lead_id, 'jan@goudenkrakeling.nl', 'Wil graag een offerte voor wekelijkse levering van 50 broodjes')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Insert demo email template
DO $$
DECLARE
  v_client_id uuid;
BEGIN
  SELECT id INTO v_client_id FROM clients WHERE email = 'jan@goudenkrakeling.nl';
  
  IF v_client_id IS NOT NULL THEN
    INSERT INTO email_templates (client_id, name, subject, html_content, is_active)
    VALUES (
      v_client_id,
      'Nieuwe Lead Notificatie',
      'Nieuwe lead: {{lead_name}}',
      '<html><body style="font-family: Arial, sans-serif; padding: 20px;"><h2>Nieuwe lead ontvangen!</h2><p><strong>Naam:</strong> {{lead_name}}</p><p><strong>Bedrijf:</strong> {{company_name}}</p><p><strong>Email:</strong> {{lead_email}}</p><p><strong>Telefoon:</strong> {{phone}}</p><p><strong>Bron:</strong> {{source}} - {{campaign}}</p><p style="margin-top: 20px;"><a href="{{dashboard_url}}" style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Bekijk in dashboard</a></p></body></html>',
      true
    ) ON CONFLICT DO NOTHING;
  END IF;
END $$;
