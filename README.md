# LeadFlow Mini-CRM

Een minimalistische, strakke lead management CRM voor marketing bureaus. Beheer leads van Google Ads en Meta Ads campagnes met een intuïtief Kanban-bord.

## Features

- **Lead Management**: Beheer alle leads in een overzichtelijk Kanban-bord
- **Drag & Drop**: Versleep leads tussen verschillende statussen
- **Lead Details**: Bekijk en bewerk lead informatie, voeg notities en taken toe
- **Statistieken**: Real-time dashboard met KPIs (totaal leads, CPL, conversieratio)
- **Admin Panel**: Beheer klanten en voer ad spend in
- **n8n Webhook**: Automatisch leads ontvangen via webhooks

## Demo Accounts

De applicatie is vooraf geconfigureerd met demo accounts:

### Demo Klant Account
- **Email**: jan@goudenkrakeling.nl
- **Wachtwoord**: Demo123!
- Toegang tot: Dashboard met 10 demo leads voor Bakkerij De Gouden Krakeling

### Admin Account
- **Email**: admin@leadflow.nl
- **Wachtwoord**: Admin123!
- Toegang tot: Admin panel om klanten te beheren en ad spend in te voeren

## Inloggen

1. Start de applicatie
2. Ga naar de login pagina
3. Log in met een van de demo accounts hierboven
4. Begin met het beheren van leads!

## Lead Statussen

1. Lead buiten budget
2. Lead in budget
3. In Contact
4. Kwalitatieve Lead
5. Offerte
6. Klant
7. Niet geschikt / Lost

## Webhook Endpoint

Leads kunnen automatisch worden toegevoegd via een POST request naar:

```
POST /rest/v1/leads
```

Payload voorbeeld:
```json
{
  "client_id": "uuid-van-klant",
  "name": "Lead Naam",
  "email": "lead@email.nl",
  "phone": "06-12345678",
  "company_name": "Bedrijf",
  "source": "Meta Ads",
  "campaign": "Campagne Naam",
  "utm_source": "facebook",
  "utm_medium": "paid"
}
```

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Drag & Drop**: @dnd-kit
- **Date handling**: date-fns

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
