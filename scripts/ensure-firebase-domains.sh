#!/usr/bin/env bash

set -euo pipefail

# Ensures Firebase custom domains exist and waits for SSL certificates to be ACTIVE
# Requirements: firebase-tools, jq
# Env vars (with defaults):
#   PROJECT_ID (defaults to .firebaserc projects.default)
#   APEX_DOMAIN (defaults to therealfintech.com)
#   WWW_DOMAIN  (defaults to www.therealfintech.com)
#   TIMEOUT_SEC (defaults to 1800)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if ! command -v firebase >/dev/null 2>&1; then
  echo "firebase CLI not found. Install with: npm i -g firebase-tools" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq not found. Install with: sudo apt-get update && sudo apt-get install -y jq" >&2
  exit 1
fi

PROJECT_ID="${PROJECT_ID:-}"
if [ -z "$PROJECT_ID" ]; then
  if [ -f "$ROOT_DIR/.firebaserc" ]; then
    PROJECT_ID="$(jq -r '.projects.default' "$ROOT_DIR/.firebaserc")"
  fi
fi

if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "null" ]; then
  echo "PROJECT_ID not set and not found in .firebaserc" >&2
  exit 1
fi

APEX_DOMAIN="${APEX_DOMAIN:-therealfintech.com}"
WWW_DOMAIN="${WWW_DOMAIN:-www.therealfintech.com}"
TIMEOUT_SEC="${TIMEOUT_SEC:-1800}"

list_domains_json() {
  firebase hosting:domains:list --project "$PROJECT_ID" --json --non-interactive 2>/dev/null || echo '{"result":[]}'
}

has_domain() {
  local domain="$1"
  list_domains_json | jq -e --arg d "$domain" '.result[]? | select(.domain == $d)' >/dev/null 2>&1
}

get_status() {
  local domain="$1"
  list_domains_json | jq -r --arg d "$domain" '.result[]? | select(.domain == $d) | .status // "UNKNOWN"'
}

ensure_domain() {
  local domain="$1"
  if has_domain "$domain"; then
    echo "Domain already attached: $domain (status: $(get_status "$domain"))"
  else
    echo "Attaching domain: $domain"
    # Note: This is idempotent; will fail if already exists, which we guard above
    firebase hosting:domains:add "$domain" --project "$PROJECT_ID" --non-interactive || true
  fi
}

wait_for_active() {
  local domain="$1"
  local deadline=$(( $(date +%s) + TIMEOUT_SEC ))
  echo "Waiting for certificate ACTIVE for $domain (timeout ${TIMEOUT_SEC}s)"
  while true; do
    local status
    status="$(get_status "$domain")"
    echo " - $domain status: $status"
    if [ "$status" = "ACTIVE" ]; then
      echo "✅ $domain is ACTIVE"
      return 0
    fi
    if [ $(date +%s) -ge $deadline ]; then
      echo "⚠️ Timeout waiting for $domain to become ACTIVE. Current status: $status"
      return 1
    fi
    sleep 20
  done
}

main() {
  echo "Project: $PROJECT_ID"
  echo "Apex:    $APEX_DOMAIN"
  echo "WWW:     $WWW_DOMAIN"

  ensure_domain "$APEX_DOMAIN"
  ensure_domain "$WWW_DOMAIN"

  # Waiting is optional; proceed best-effort
  wait_for_active "$APEX_DOMAIN" || true
  wait_for_active "$WWW_DOMAIN" || true
}

main "$@"