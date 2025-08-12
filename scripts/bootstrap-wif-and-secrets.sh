#!/usr/bin/env bash

set -euo pipefail

# Bootstrap Workload Identity Federation (WIF) and output GitHub secrets values
# Requirements: gcloud, jq; optional: gh (to set secrets automatically)
# Env vars you may override:
#   PROJECT_ID (default from .firebaserc if available)
#   REPO (e.g., therealfintech/website)
#   POOL_ID (default: github-pool)
#   PROVIDER_ID (default: github)
#   SA_ID (default: firebase-deployer)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT_ID="${PROJECT_ID:-}"
REPO="${REPO:-therealfintech/website}"
POOL_ID="${POOL_ID:-github-pool}"
PROVIDER_ID="${PROVIDER_ID:-github}"
SA_ID="${SA_ID:-firebase-deployer}"

need() { command -v "$1" >/dev/null 2>&1 || { echo "$1 not found" >&2; exit 1; }; }
need gcloud
need jq

if [ -z "$PROJECT_ID" ] && [ -f "$ROOT_DIR/.firebaserc" ]; then
  PROJECT_ID="$(jq -r '.projects.default' "$ROOT_DIR/.firebaserc")"
fi
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "null" ]; then
  echo "Set PROJECT_ID env var or ensure .firebaserc exists" >&2
  exit 1
fi

echo "Using project: $PROJECT_ID"

gcloud config set project "$PROJECT_ID" >/dev/null

# Create workload identity pool and provider
if ! gcloud iam workload-identity-pools describe "$POOL_ID" --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$POOL_ID" --location=global --display-name="GitHub WIF Pool"
fi
if ! gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" --workload-identity-pool="$POOL_ID" --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
    --workload-identity-pool="$POOL_ID" \
    --location=global \
    --display-name="GitHub Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --issuer-uri="https://token.actions.githubusercontent.com"
fi

# Create service account and grant roles
if ! gcloud iam service-accounts describe "$SA_ID@$PROJECT_ID.iam.gserviceaccount.com" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$SA_ID" --display-name="Firebase Deployer (WIF)"
fi

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_ID@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin" >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SA_ID@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator" >/dev/null

# Allow GitHub repo to impersonate SA via WIF
PROJECT_NUMBER=$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')
gcloud iam service-accounts add-iam-policy-binding "$SA_ID@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_ID/attribute.repository/$REPO" >/dev/null || true

# Output values for GitHub secrets
WIP_RESOURCE=$(gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" --workload-identity-pool="$POOL_ID" --location=global --format='value(name)')
SA_EMAIL="$SA_ID@$PROJECT_ID.iam.gserviceaccount.com"

echo ""
echo "Set the following GitHub repository secrets:"
echo "- GCP_WORKLOAD_IDENTITY_PROVIDER: $WIP_RESOURCE"
echo "- GCP_WIF_SERVICE_ACCOUNT: $SA_EMAIL"

echo ""
if command -v gh >/dev/null 2>&1; then
  echo "Attempting to set secrets via gh (requires gh auth login and correct repo)."
  gh secret set GCP_WORKLOAD_IDENTITY_PROVIDER -b"$WIP_RESOURCE" || true
  gh secret set GCP_WIF_SERVICE_ACCOUNT -b"$SA_EMAIL" || true
fi

echo "Done. Your GitHub Actions can now authenticate without JSON keys."