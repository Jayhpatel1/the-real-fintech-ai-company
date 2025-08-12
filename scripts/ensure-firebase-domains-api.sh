#!/usr/bin/env bash

set -euo pipefail

# Attach custom domains to Firebase Hosting using REST API
# Requirements: gcloud, jq
# Env vars:
#   PROJECT_ID (defaults to .firebaserc projects.default)
#   SITE_ID (defaults to the-real-fintech-ai-company)
#   APEX_DOMAIN (defaults to therealfintech.com)
#   WWW_DOMAIN (defaults to www.therealfintech.com)
#   TIMEOUT_SEC (defaults to 1800)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "$1 not found" >&2; exit 1; }; }
need_cmd gcloud
need_cmd jq

PROJECT_ID="${PROJECT_ID:-}"
if [ -z "$PROJECT_ID" ]; then
  if [ -f "$ROOT_DIR/.firebaserc" ]; then
    PROJECT_ID="$(jq -r '.projects.default' "$ROOT_DIR/.firebaserc")"
    [ "$PROJECT_ID" = "null" ] && PROJECT_ID=""
  fi
fi
if [ -z "$PROJECT_ID" ]; then
  echo "PROJECT_ID not set" >&2
  exit 1
fi

SITE_ID="${SITE_ID:-the-real-fintech-ai-company}"
APEX_DOMAIN="${APEX_DOMAIN:-therealfintech.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.therealfintech.com}"
TIMEOUT_SEC="${TIMEOUT_SEC:-1800}"

api_base="https://firebasehosting.googleapis.com/v1beta1"
site_path="sites/${SITE_ID}"

access_token() {
  gcloud auth print-access-token
}

ensure_domain_api() {
  local domain="$1"
  local token
  token="$(access_token)"

  # Check if domain exists
  local existing
  existing=$(curl -sS -H "Authorization: Bearer $token" "$api_base/$site_path/domains" | jq -r --arg d "$domain" '.domains[]? | select(.domainName == $d) | .status' || true)
  if [ -n "$existing" ]; then
    echo "Domain already present: $domain (status: $existing)"
    return 0
  fi

  echo "Creating domain: $domain"
  curl -sS -X POST -H "Authorization: Bearer $token" -H "Content-Type: application/json" \
    "$api_base/$site_path/domains" \
    -d "{\"domainName\":\"$domain\"}" >/dev/null
}

get_status_api() {
  local domain="$1"
  local token
  token="$(access_token)"
  curl -sS -H "Authorization: Bearer $token" "$api_base/$site_path/domains" | jq -r --arg d "$domain" '.domains[]? | select(.domainName == $d) | .status // "UNKNOWN"'
}

wait_for_active() {
  local domain="$1"
  local deadline=$(( $(date +%s) + TIMEOUT_SEC ))
  echo "Waiting for $domain to become ACTIVE (timeout ${TIMEOUT_SEC}s)"
  while true; do
    local status
    status="$(get_status_api "$domain")"
    echo " - $domain status: $status"
    if [ "$status" = "ACTIVE" ]; then
      echo "✅ $domain is ACTIVE"
      return 0
    fi
    if [ $(date +%s) -ge $deadline ]; then
      echo "⚠️ Timeout waiting for $domain to become ACTIVE (last: $status)"
      return 1
    fi
    sleep 20
  done
}

main() {
  echo "Project: $PROJECT_ID"
  echo "Site:    $SITE_ID"
  echo "Apex:    $APEX_DOMAIN"
  echo "WWW:     $WWW_DOMAIN"

  gcloud config set project "$PROJECT_ID" >/dev/null

  ensure_domain_api "$APEX_DOMAIN"
  ensure_domain_api "$WWW_DOMAIN"

  wait_for_active "$APEX_DOMAIN" || true
  wait_for_active "$WWW_DOMAIN" || true
}

main "$@"