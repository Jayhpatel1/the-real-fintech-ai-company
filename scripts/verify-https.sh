#!/usr/bin/env bash

set -euo pipefail

APEX="${APEX_DOMAIN:-therealfintech.com}"
WWW="${WWW_DOMAIN:-www.therealfintech.com}"
TIMEOUT_SEC="${TIMEOUT_SEC:-1800}"
SLEEP_SEC="${SLEEP_SEC:-20}"

need_cmd() { command -v "$1" >/dev/null 2>&1 || { echo "$1 not found" >&2; exit 1; }; }
need_cmd curl
need_cmd openssl

check_http_ok() {
  local host="$1"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://$host") || true
  [[ "$code" =~ ^(200|301|302)$ ]]
}

san_includes() {
  local host="$1"
  local sans
  sans=$(openssl s_client -servername "$host" -connect "$host:443" -showcerts </dev/null 2>/dev/null | openssl x509 -noout -ext subjectAltName 2>/dev/null | tr -d '\r') || true
  echo "$sans" | grep -qi "DNS:$host"
}

wait_until_ready() {
  local host="$1"
  local deadline=$(( $(date +%s) + TIMEOUT_SEC ))
  echo "Waiting for $host to be HTTPS-ready (timeout ${TIMEOUT_SEC}s)"
  while true; do
    local ok_https=false ok_san=false
    if check_http_ok "$host"; then ok_https=true; fi
    if san_includes "$host"; then ok_san=true; fi
    echo " - $host: status_ok=$ok_https san_ok=$ok_san"
    if $ok_https && $ok_san; then
      echo "✅ $host is HTTPS-ready"
      return 0
    fi
    if [ $(date +%s) -ge $deadline ]; then
      echo "❌ Timeout waiting for $host"
      return 1
    fi
    sleep "$SLEEP_SEC"
  done
}

main() {
  wait_until_ready "$APEX"
  wait_until_ready "$WWW"
}

main "$@"