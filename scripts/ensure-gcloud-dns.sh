#!/usr/bin/env bash

set -euo pipefail

# Ensure Cloud DNS A records for Firebase Hosting
# Requirements: gcloud
# Env vars:
#   PROJECT_ID (required unless set via gcloud config or .firebaserc)
#   ZONE_NAME  (optional; if unspecified, attempts to auto-detect zone for therealfintech.com)
#   APEX_NAME  (defaults to therealfintech.com.)
#   TTL        (defaults to 300)

APEX_NAME="${APEX_NAME:-therealfintech.com.}"
TTL="${TTL:-300}"
PROJECT_ID="${PROJECT_ID:-}"
ZONE_NAME="${ZONE_NAME:-}"

need_gcloud() {
  if ! command -v gcloud >/dev/null 2>&1; then
    echo "gcloud not found. Install Google Cloud SDK and authenticate." >&2
    exit 1
  fi
}

infer_project_from_firebaserc() {
  if [ -z "$PROJECT_ID" ] && [ -f "./.firebaserc" ]; then
    PROJECT_ID="$(jq -r '.projects.default' ./.firebaserc)"
    [ "$PROJECT_ID" = "null" ] && PROJECT_ID=""
  fi
}

find_zone() {
  local name_no_dot="${APEX_NAME%.}"
  if [ -n "$ZONE_NAME" ]; then
    return 0
  fi
  # Try exact match by DNS name
  ZONE_NAME="$(gcloud dns managed-zones list --project "$PROJECT_ID" --format=json | jq -r --arg n "$name_no_dot." '.[] | select(.dnsName == $n) | .name' | head -n1)"
  if [ -z "$ZONE_NAME" ]; then
    # Fallback: pick any zone that is a suffix of the domain
    ZONE_NAME="$(gcloud dns managed-zones list --project "$PROJECT_ID" --format=json | jq -r --arg n "$name_no_dot." '.[] | select($n | endswith(.dnsName)) | .name' | head -n1)"
  fi
  if [ -z "$ZONE_NAME" ]; then
    echo "Could not auto-detect Cloud DNS managed zone for $APEX_NAME in project $PROJECT_ID" >&2
    exit 1
  fi
}

ensure_a_records() {
  local desired=(199.36.158.100 199.36.158.101 199.36.158.102 199.36.158.103)
  local existing
  existing=$(gcloud dns record-sets list --project "$PROJECT_ID" --zone "$ZONE_NAME" --name "$APEX_NAME" --type A --format='value(rrdatas)' || true)

  gcloud dns record-sets transaction start --project "$PROJECT_ID" --zone "$ZONE_NAME" >/dev/null
  local change_made=false

  if [ -n "$existing" ]; then
    # Remove existing A record
    echo "Removing existing A records: $existing"
    gcloud dns record-sets transaction remove --project "$PROJECT_ID" --zone "$ZONE_NAME" --name "$APEX_NAME" --type A --ttl "$TTL" $existing >/dev/null || true
    change_made=true
  fi

  echo "Adding Firebase A records: ${desired[*]}"
  gcloud dns record-sets transaction add --project "$PROJECT_ID" --zone "$ZONE_NAME" --name "$APEX_NAME" --type A --ttl "$TTL" ${desired[*]} >/dev/null
  change_made=true

  gcloud dns record-sets transaction execute --project "$PROJECT_ID" --zone "$ZONE_NAME" >/dev/null

  echo "✅ DNS updated for $APEX_NAME in zone $ZONE_NAME"
}

main() {
  need_gcloud
  infer_project_from_firebaserc
  if [ -z "$PROJECT_ID" ]; then
    echo "Set PROJECT_ID environment variable or configure gcloud/.firebaserc" >&2
    exit 1
  fi
  gcloud config set project "$PROJECT_ID" >/dev/null
  find_zone
  ensure_a_records
}

main "$@"