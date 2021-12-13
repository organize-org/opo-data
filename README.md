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

## Deployment Tokens

If there is an error `Failed to persist entry: API_ERROR: Not Found` one cause may be the OAuth tokens in github may be expired or associated with an account that is no longer a bloom member. If that is the case, generate new tokens and redeploy. If on Netlify, here is the [Netlify doc on reconnecting after changing permissions](https://docs.netlify.com/visitor-access/git-gateway/#reconnect-after-changing-repository-permissions)
