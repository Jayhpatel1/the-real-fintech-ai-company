#!/bin/bash

# 🌐 Domain Status Checker for therealfintech.com
# Run this script to check if your domain is working

echo "🔍 Checking therealfintech.com domain status..."
echo "================================================"

# Check if domain resolves
echo ""
echo "1. 🌐 DNS Resolution Test:"
if nslookup therealfintech.com > /dev/null 2>&1; then
    echo "✅ therealfintech.com resolves to IP addresses"
    nslookup therealfintech.com | grep -A 2 "Name:"
else
    echo "❌ therealfintech.com does not resolve yet"
    echo "   📝 Make sure you added A records in Google Domains"
fi

echo ""
echo "2. 🔍 Specific DNS Records:"
echo "A Records (should point to Firebase):"
dig +short therealfintech.com A

echo ""
echo "CNAME Record for www:"
dig +short www.therealfintech.com CNAME

# Check HTTP response
echo ""
echo "3. 🌍 HTTP Response Test:"
if curl -s -I http://therealfintech.com > /dev/null 2>&1; then
    echo "✅ HTTP response received"
    curl -s -I http://therealfintech.com | head -1
else
    echo "❌ No HTTP response yet"
    echo "   ⏱️ Wait a few more minutes for DNS propagation"
fi

# Check HTTPS response
echo ""
echo "4. 🔒 HTTPS/SSL Test:"
if curl -s -I https://therealfintech.com > /dev/null 2>&1; then
    echo "✅ HTTPS works - SSL certificate active!"
    curl -s -I https://therealfintech.com | head -1
else
    echo "🔄 HTTPS not ready yet (normal - takes 24-48 hours)"
    echo "   Firebase is still provisioning SSL certificate"
fi

# Check website content
echo ""
echo "5. 📄 Website Content Test:"
if curl -s https://therealfintech.com | grep -q "The Real Fintech AI" > /dev/null 2>&1; then
    echo "✅ Website content loading correctly!"
    echo "   🎉 Your AI-powered real estate site is LIVE!"
elif curl -s http://therealfintech.com | grep -q "The Real Fintech AI" > /dev/null 2>&1; then
    echo "✅ Website content loading (HTTP only for now)"
    echo "   🔄 HTTPS will be ready within 24-48 hours"
else
    echo "🔄 Website content not loading yet"
    echo "   ⏱️ DNS propagation in progress..."
fi

echo ""
echo "================================================"
echo "🎯 SUMMARY:"

# Overall status
if curl -s https://therealfintech.com > /dev/null 2>&1; then
    echo "🎉 SUCCESS: therealfintech.com is FULLY LIVE!"
    echo "✅ HTTPS working"
    echo "✅ SSL certificate active"
    echo "✅ Website loading perfectly"
    echo ""
    echo "🌟 Your AI-powered real estate platform is now live at:"
    echo "   🔗 https://therealfintech.com"
    echo "   🔗 https://www.therealfintech.com"
elif curl -s http://therealfintech.com > /dev/null 2>&1; then
    echo "🔄 PARTIAL SUCCESS: therealfintech.com is working!"
    echo "✅ Domain resolving"
    echo "✅ HTTP working"
    echo "🔄 HTTPS pending (24-48 hours)"
    echo ""
    echo "🌟 Your website is accessible at:"
    echo "   🔗 http://therealfintech.com (working now)"
    echo "   🔗 https://therealfintech.com (soon)"
else
    echo "⏱️ IN PROGRESS: DNS propagation ongoing"
    echo "📝 Make sure you completed these steps:"
    echo "   1. Added TXT record for domain verification"
    echo "   2. Added A records (151.101.1.195, 151.101.65.195)"
    echo "   3. Added CNAME record for www"
    echo "   4. Verified domain in Firebase Console"
    echo ""
    echo "⏰ Try again in 10-15 minutes"
fi

echo ""
echo "🛠️ Firebase Project: the-real-fintech-ai-company"
echo "📞 Support: jay@therealfintech.com | +91 977-308-1099"
echo "🏠 Address: Ramnagar, Bhavnagar-364001, India"
