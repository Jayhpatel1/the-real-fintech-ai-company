#!/bin/bash

# AUTOMATED DNS FIX FOR THEREALFINTECH.COM SSL ISSUE
# This script will update DNS records at NS One to fix the SSL certificate issue

echo "🔧 FIXING SSL CERTIFICATE ISSUE FOR THEREALFINTECH.COM"
echo "================================================="

# Check if NS One API key is set
if [ -z "$NSONE_API_KEY" ]; then
    echo "❌ NS One API key not found!"
    echo "Please set your NS One API key:"
    echo "export NSONE_API_KEY='your-api-key-here'"
    echo ""
    echo "Or manually update DNS records at https://portal.nsone.net/"
    echo "See fix-dns-now.md for detailed instructions"
    exit 1
fi

echo "🔍 Current DNS records:"
dig +short therealfintech.com
echo ""

echo "🌐 Updating DNS records at NS One..."

# Update A records for main domain
curl -X PUT "https://api.nsone.net/v1/zones/therealfintech.com/therealfintech.com/A" \
  -H "X-NSONE-Key: $NSONE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "therealfintech.com",
    "domain": "therealfintech.com",
    "type": "A",
    "answers": [
      {"answer": ["216.239.32.21"]},
      {"answer": ["216.239.34.21"]},
      {"answer": ["216.239.36.21"]},
      {"answer": ["216.239.38.21"]}
    ]
  }'

echo ""

# Update CNAME record for www
curl -X PUT "https://api.nsone.net/v1/zones/therealfintech.com/www.therealfintech.com/CNAME" \
  -H "X-NSONE-Key: $NSONE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "therealfintech.com",
    "domain": "www.therealfintech.com", 
    "type": "CNAME",
    "answers": [
      {"answer": ["ghs.googlehosted.com"]}
    ]
  }'

echo ""
echo "✅ DNS records updated!"
echo "🕐 SSL certificates will provision in 5-15 minutes"
echo "🔒 Your site will then be secure at https://therealfintech.com"
echo ""
echo "Meanwhile, your site is LIVE and SECURE at:"
echo "👉 https://therealfintech.web.app"
