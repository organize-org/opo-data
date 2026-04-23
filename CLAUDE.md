# opo-data

Gatsby static site published at **https://www.opodata.org** (+ apex `opodata.org`).

Currently hosted on **Vercel**. Migration to AWS is **in progress but blocked** — see below.

## Migration status (as of 2026-04-23)

Moving off Vercel to AWS S3 + CloudFront in account `coa-organdonation` (245395155677, us-east-1).

**Done:**
- S3 bucket `opodata-org` created (BPA on, SSE-S3).
- ACM cert requested (`arn:aws:acm:us-east-1:245395155677:certificate/670cc374-edd6-4bb6-92da-ecb21adc2da7`, SANs: `opodata.org`, `www.opodata.org`), **pending DNS validation**.

**Blocked on:** DNS ownership for `opodata.org` is not known. The zone is at Squarespace (NS: `ns-cloud-a{1..4}.googledomains.com`, registrar: Squarespace Domains), but the Squarespace account that owns it has not been identified. The domain is NOT in either of Ari's Squarespace accounts (ari@coa.solutions, ari@perez.digital) and not in any of the AWS accounts under Coa's Organization.

**Next step:** identify the Squarespace account holder, then add two validation CNAMEs (issued when cert was requested; check ACM for current values) plus the final site CNAME to CloudFront.

**Do not guess or assume the owner.** The Vercel project under `coa-solutions` and the GitHub repo under `organize-org` do not imply domain ownership.

## Deploy (post-migration)

```
./deploy.sh
```

Builds Gatsby, syncs `public/` to S3, invalidates CloudFront. **Not yet usable** until migration completes — `DISTRIBUTION_ID` in the script is a placeholder.

## Target infrastructure

| Resource | ID |
|---|---|
| S3 bucket | `opodata-org` |
| ACM cert | `arn:aws:acm:us-east-1:245395155677:certificate/670cc374-edd6-4bb6-92da-ecb21adc2da7` |
| CloudFront distribution | not yet created |
| CloudFront SPA-rewrite function | not yet created |

DNS at Squarespace (owner TBD):
- `www.opodata.org` CNAME → `<dist>.cloudfront.net`.
- `opodata.org` apex: CNAME flattening to the same target (if Squarespace supports it) or 301 redirect to `www.opodata.org`.

## Remaining bootstrap

1. Identify Squarespace account holder.
2. Add the ACM validation CNAMEs; wait for cert `ISSUED`.
3. Create CloudFront Function for SPA fallback (rewrite non-file requests to `/index.html`).
4. Create CloudFront Origin Access Control, then the distribution (origin = S3 via OAC, aliases = `opodata.org` + `www.opodata.org`, cert attached, `DefaultRootObject` = `index.html`, SPA function on viewer-request).
5. Attach bucket policy allowing `s3:GetObject` only from that distribution's OAC.
6. Add site CNAME(s) in Squarespace.
7. Fill in `DISTRIBUTION_ID` in `deploy.sh` and run it.

## Notes

- `gatsby-plugin-netlify-cms` is configured. Git-based CMS — no backend needed.
- No CI. Manual deploy only.
- Node 22.x required (per `engines` in `package.json`).
- Domain expires 2026-07-30 (per RDAP); renewal is the responsibility of whoever owns the registrar account.
