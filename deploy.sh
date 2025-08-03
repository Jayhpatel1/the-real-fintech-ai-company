#!/bin/bash

echo "🚀 Deploying RealFinTech website to Netlify..."

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to Netlify
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=.next
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "🌍 Your website should be live at: https://therealfintech.com"
        echo ""
        echo "📋 Next steps:"
        echo "1. Set up custom domain in Netlify dashboard"
        echo "2. Configure DNS settings for therealfintech.com"
        echo "3. Enable HTTPS (automatic with Netlify)"
        echo "4. Set up form handling for contact forms"
    else
        echo "❌ Deployment failed!"
        echo "Please check your Netlify configuration and try again."
    fi
else
    echo "❌ Build failed!"
    echo "Please fix the build errors and try again."
fi