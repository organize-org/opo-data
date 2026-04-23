#!/usr/bin/env bash
# Build + deploy to S3 + invalidate CloudFront.
# See CLAUDE.md for infra details.
set -euo pipefail

AWS_PROFILE=coa-organdonation
BUCKET=opodata-org
DISTRIBUTION_ID="__FILL_IN_AFTER_BOOTSTRAP__"

cd "$(dirname "$0")"

echo "==> Installing dependencies..."
npm ci --legacy-peer-deps

echo "==> Building Gatsby site..."
npm run build

echo "==> Syncing public/ to s3://$BUCKET ..."
AWS_PROFILE=$AWS_PROFILE aws s3 sync public/ "s3://$BUCKET" --delete

echo "==> Invalidating CloudFront ($DISTRIBUTION_ID)..."
AWS_PROFILE=$AWS_PROFILE aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths '/*' \
  --query 'Invalidation.Id' --output text

echo "==> Done. https://www.opodata.org"
