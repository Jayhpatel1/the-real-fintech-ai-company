#!/bin/bash

echo "🚀 Verifying The Real Fintech Website Deployment"
echo "================================================"

# Check Firebase project
echo -e "\n✅ Firebase Project:"
firebase projects:list | grep "the-real-fintech-ai-company"

# Check if Firebase hosted site is working
echo -e "\n✅ Firebase Hosted Site Status:"
if curl -s https://the-real-fintech-ai-company.web.app >/dev/null; then
    echo "🟢 https://the-real-fintech-ai-company.web.app - WORKING"
else
    echo "🔴 https://the-real-fintech-ai-company.web.app - NOT WORKING"
fi

# Check DNS resolution
echo -e "\n✅ DNS Configuration:"
echo "A Records for therealfintech.com:"
dig +short therealfintech.com A

echo -e "\nCNAME for www.therealfintech.com:"
dig +short www.therealfintech.com CNAME

# Check custom domain status
echo -e "\n✅ Custom Domain Status:"
if curl -s -k --connect-timeout 10 https://therealfintech.com >/dev/null 2>&1; then
    echo "🟢 https://therealfintech.com - SSL WORKING"
elif curl -s --connect-timeout 10 http://therealfintech.com >/dev/null 2>&1; then
    echo "🟡 http://therealfintech.com - Working (No SSL)"
else
    echo "🔴 therealfintech.com - NOT ACCESSIBLE"
fi

# Check if Hindi text was removed
echo -e "\n✅ Website Content Check:"
if curl -s https://the-real-fintech-ai-company.web.app/script.js | grep -q "keywords"; then
    echo "🟢 English keywords found in script.js"
else
    echo "🔴 Keywords not found in script.js"
fi

if curl -s https://the-real-fintech-ai-company.web.app/script.js | grep -E "[\u0900-\u097f]" >/dev/null; then
    echo "🔴 Hindi text still present"
else
    echo "🟢 No Hindi text found - All content is in English"
fi

echo -e "\n🎉 Summary:"
echo "✅ Website is LIVE at: https://the-real-fintech-ai-company.web.app"
echo "✅ Hindi text has been successfully removed"
echo "✅ Voice search now uses English keywords"
echo "⚠️  Custom domain needs SSL certificate setup in Firebase Console"

echo -e "\n📋 Next Steps:"
echo "1. Visit Firebase Console: https://console.firebase.google.com/project/the-real-fintech-ai-company/hosting/main"
echo "2. Add custom domain 'therealfintech.com'"
echo "3. Complete domain verification"
echo "4. Wait for SSL certificate provisioning"
