# Setup Instructies LeadFlow Mini-CRM

## Stap 1: Demo Gebruiker Aanmaken

Om in te loggen als de demo klant, moet je eerst een gebruiker aanmaken in Supabase:

### Optie A: Via Supabase Dashboard (Aanbevolen)

1. Ga naar je Supabase dashboard
2. Navigeer naar Authentication > Users
3. Klik op "Add user" > "Create new user"
4. Vul in:
   - Email: `jan@goudenkrakeling.nl`
   - Wachtwoord: kies een wachtwoord (bijv. `Demo123456`)
   - Auto Confirm User: Ja (vink aan)
5. Klik op "Create user"

### Optie B: Via SQL

Voer dit uit in de Supabase SQL Editor:

```sql
-- Maak een auth user aan voor de demo klant
-- LET OP: Vervang 'Demo123456' met je gewenste wachtwoord
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'jan@goudenkrakeling.nl',
  crypt('Demo123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '{}'::jsonb
);
```

## Stap 2: Inloggen

1. Start de applicatie: `npm run dev`
2. Ga naar de login pagina
3. Log in met:
   - Email: `jan@goudenkrakeling.nl`
   - Wachtwoord: het wachtwoord dat je hebt ingesteld

Je ziet nu het dashboard met 10 demo leads in verschillende statussen!

## Stap 3: Admin Gebruiker Aanmaken (Optioneel)

Om toegang te krijgen tot het admin panel:

1. Maak eerst een gebruiker aan via Supabase Dashboard (zoals hierboven)
2. Voeg je gebruiker toe aan de admins tabel:

```sql
INSERT INTO admins (email, name, user_id)
VALUES (
  'jouw@email.nl',
  'Jouw Naam',
  (SELECT id FROM auth.users WHERE email = 'jouw@email.nl')
);
```

3. Log in met je email en je hebt nu toegang tot `/admin`

## Demo Features

### Als Klant (jan@goudenkrakeling.nl):
- ✅ Bekijk 10 demo leads in Kanban bord
- ✅ Drag & drop leads tussen statussen
- ✅ Klik op lead voor details
- ✅ Voeg notities toe (sommige leads hebben al notities)
- ✅ Voeg taken toe
- ✅ Bekijk activiteit log
- ✅ Zie statistieken (totaal leads, CPL, conversie)

### Als Admin:
- ✅ Bekijk alle klanten met statistieken
- ✅ Maak nieuwe klanten aan
- ✅ Activeer/deactiveer klanten
- ✅ Bekijk klant dashboard
- ✅ Voer ad spend in per maand/platform

## Troubleshooting

### Kan niet inloggen met demo account
- Zorg dat je de gebruiker hebt aangemaakt in Supabase Auth
- Check of het email adres exact `jan@goudenkrakeling.nl` is
- Check of de gebruiker is bevestigd (email_confirmed_at is ingevuld)

### Zie geen leads
- Check of de demo data is geladen (zie migrations)
- Ververs de pagina
- Check de browser console voor errors

### Admin panel niet zichtbaar
- Zorg dat je email is toegevoegd aan de `admins` tabel
- Log opnieuw in na het toevoegen aan de admins tabel
