# OPO Dashboard

A tabular and geospatial dashboard for Organ Procurement Organization (OPO) metrics.

## Running

Obtain the Airtable API Key.
Then create a `.env` file in the base directory (e.g. based on the `example.env`: `cp example.env .env`).
Populate `AIRTABLE_API_KEY=[value]` with the API key value.

(With `node` and `npm` installed:)

Install: `npm ci`

Dev: `npm start`
Dev CMS (in another terminal, may require install): `npx netlify-cms-proxy-server`

Prod: `npm run build && npm run serve`
