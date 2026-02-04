/*
  # Create Demo Users

  1. New Users
    - Demo client user: jan@goudenkrakeling.nl (password: Demo123!)
    - Admin user: admin@leadflow.nl (password: Admin123!)
  
  2. User Setup
    - Create authenticated users in auth.users
    - Confirm email addresses automatically
    - Set up proper authentication metadata
  
  3. Admin Setup
    - Add admin user to admins table
    - Link admin to auth user
*/

-- Create demo client user for jan@goudenkrakeling.nl
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'jan@goudenkrakeling.nl',
  crypt('Demo123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'jan@goudenkrakeling.nl'
);

-- Create admin user
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  confirmation_sent_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@leadflow.nl',
  crypt('Admin123!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@leadflow.nl'
);

-- Add admin to admins table
INSERT INTO admins (email, name, user_id)
SELECT 
  'admin@leadflow.nl',
  'Admin User',
  id
FROM auth.users
WHERE email = 'admin@leadflow.nl'
ON CONFLICT (email) DO NOTHING;
