#!/bin/bash

echo "🚀 THEREALFINTECH.COM STATUS CHECK"
echo "=================================="

echo ""
echo "✅ WORKING URLs:"
echo "Main site: https://the-real-fintech-ai-company.web.app"
echo "Preview: https://the-real-fintech-ai-company--therealfintech-k4eirq0t.web.app"

echo ""
echo "🔍 Checking DNS for therealfintech.com..."
echo "Current A record:"
dig +short therealfintech.com

echo ""
echo "🎯 Expected Firebase IPs: 151.101.1.195, 151.101.65.195"
echo ""

echo "🌐 Testing therealfintech.com connectivity..."
if curl -s -o /dev/null -w "%{http_code}" https://therealfintech.com | grep -q "200\|301\|302"; then
    echo "✅ therealfintech.com is responding!"
else
    echo "❌ therealfintech.com not working yet. DNS needs update."
fi

echo ""
echo "📋 NEXT STEPS:"
echo "1. Update DNS records in your domain registrar"
echo "2. Point A records to Firebase IPs: 151.101.1.195 and 151.101.65.195"
echo "3. Wait 5-60 minutes for DNS propagation"
echo ""
echo "🔗 Check DNS propagation: https://dnschecker.org/#A/therealfintech.com"
echo "🔥 Use working URL now: https://the-real-fintech-ai-company.web.app"
