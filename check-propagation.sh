# Simple script to check if DNS is propagating correctly
DOMAIN="therealfintech.com"
EXTERNAL_IPS=(151.101.1.195 151.101.65.195)

# Function to check DNS
check_dns() {
  echo "Checking DNS propagation for $DOMAIN..."
  for IP in "${EXTERNAL_IPS[@]}"; do
    if nslookup $DOMAIN | grep -q "$IP"; then
      echo "✅ $DOMAIN resolves to correct IP: $IP"
    else
      echo "❌ $DOMAIN does not resolve to $IP"
      return 1
    fi
  done
  return 0
}

# Function to check HTTP connection
check_http() {
  echo "Checking HTTP connection for $DOMAIN..."
  if curl -s -I http://$DOMAIN | grep -q "200 OK"; then
    echo "✅ HTTP connection successful"
  else
    echo "❌ HTTP connection failed"
    return 1
  fi
}

# Function to check HTTPS connection
check_https() {
  echo "Checking HTTPS connection for $DOMAIN..."
  if curl -s -I https://$DOMAIN | grep -q "200 OK"; then
    echo "✅ HTTPS connection successful"
  else
    echo "❌ HTTPS connection failed"
    echo "Possibly due to SSL certificate not being issued yet"
    return 1
  fi
}

# Run checks
check_dns && check_http && check_https
