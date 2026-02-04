# Setup Instructies LeadFlow Mini-CRM

## Inloggegevens

De demo gebruikers zijn automatisch aangemaakt. Je kunt direct inloggen:

### Klant Account
- Email: `jan@goudenkrakeling.nl`
- Wachtwoord: `Demo123!`

### Admin Account
- Email: `admin@leadflow.nl`
- Wachtwoord: `Admin123!`

## Development

1. Start de applicatie: `npm run dev`
2. Ga naar de login pagina
3. Log in met bovenstaande gegevens

## Productie Deployment

### Stap 1: Omgevingsvariabelen instellen

Bij je hosting provider (Vercel, Netlify, etc.) moeten deze omgevingsvariabelen worden ingesteld:

```
VITE_SUPABASE_URL=https://yjigujqdljckaxkrjhhj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaWd1anFkbGpja2F4a3JqaGhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMDg1MjUsImV4cCI6MjA4NTc4NDUyNX0.6CS2y6wOUp3lGlLwyKrGDyCgVyB5722Kcz5fyOZ667Y
```

### Stap 2: Supabase URL Configuratie

In het Supabase Dashboard:
1. Ga naar Authentication > URL Configuration
2. Stel de "Site URL" in op je productie URL
3. Voeg je productie URL toe aan "Redirect URLs"

### Stap 3: Build en Deploy

```bash
npm run build
```

De `dist` folder bevat de productie build.

## Features

### Als Klant (jan@goudenkrakeling.nl):
- Bekijk leads in Kanban bord
- Drag & drop leads tussen statussen
- Klik op lead voor details
- Voeg notities en taken toe
- Bekijk activiteit log
- Zie statistieken

### Als Admin (admin@leadflow.nl):
- Bekijk alle klanten met statistieken
- Maak nieuwe klanten aan
- Activeer/deactiveer klanten
- Bekijk klant dashboard
- Voer ad spend in per maand/platform

## Troubleshooting

### Kan niet inloggen in productie
- Controleer of de omgevingsvariabelen correct zijn ingesteld
- Herdeployeer na het instellen van omgevingsvariabelen
- Controleer de browser console voor errors

### Zie geen data
- Ververs de pagina
- Check de browser console voor errors
- Controleer of de Supabase URL bereikbaar is
