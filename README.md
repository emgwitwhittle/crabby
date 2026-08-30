# Crabby

A family crabbing log — the best spots and hauls, tracked digitally instead of in notebooks.

Built with Next.js (App Router) and Tailwind CSS, backed by an Airtable base with three tables: **Locations**, **Haul**, and **Users**.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Airtable credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Set these in `.env.local` (never committed):

- `AIRTABLE_API_KEY` — a personal access token with read/write scopes on the base
- `AIRTABLE_BASE_ID` — the base ID (starts with `app...`)

The Airtable table and field names are expected to match exactly what's described below. If you rename a field in Airtable, update the corresponding constant in `src/lib/airtable.ts`.

## How login works

There's no username/password. Each Airtable **Users** record has a `Random token` formula field (`RECORD_ID()`), so a user's token is just their own record ID. Share a link like:

```
https://your-app-url/login/<record-id>
```

Visiting it sets a permanent, non-expiring `httpOnly` cookie identifying that user on that device. Once logged in, "Added by" auto-populates on any new Location or Haul they create. No email sending is involved — links are generated in Airtable and shared manually.

## Project structure

- `src/lib/airtable.ts` — server-only Airtable client, typed records, and CRUD helpers. All Airtable table/field names live here.
- `src/lib/session.ts` — cookie-based session helpers (`getCurrentUser`).
- `src/lib/calendar.ts` — season-restricted (July–September, 2020–present) calendar month math.
- `src/lib/actions.ts` — server actions for creating Locations and Haul entries.
- `src/app/` — pages: Home, Locations (list/detail/new), Haul (list/detail/new), Calendar day detail, and the token login route.

## Reporting

Not built yet by design — the data layer (`src/lib/airtable.ts`) is a natural place to add aggregation/reporting queries later without restructuring the app.
