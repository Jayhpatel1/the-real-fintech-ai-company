// JavaScript for The Real Fintech AI Company Website

// Ensure functions are available immediately - before DOM loads
(function() {
    'use strict';
    
    // Global modal functions - Available immediately
    window.openModal = function(modalId) {
        console.log('🔓 Opening modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            modal.style.opacity = '0';
            document.body.style.overflow = 'hidden';
            
            // Fade in animation
            setTimeout(() => {
                modal.style.opacity = '1';
            }, 10);
            
            console.log('✅ Modal opened successfully:', modalId);
        } else {
            console.error('❌ Modal not found:', modalId);
            alert('Modal not found: ' + modalId);
        }
    };

    window.closeModal = function(modalId) {
        console.log('🔒 Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            // Fade out animation
            modal.style.opacity = '0';
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 200);
            console.log('✅ Modal closed successfully:', modalId);
        }
    };
    
    // Test function to verify functions are working
    window.testModal = function() {
        console.log('🧪 Testing modal functions...');
        alert('Modal functions are loaded and working!');
    };
    
    console.log('🚀 Modal functions loaded immediately');
})();

document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 DOMContentLoaded - Script initialized');
    
    // Log all important elements to debug
    console.log('🔍 Debugging elements:', {
        loginModal: document.getElementById('loginModal'),
        signupModal: document.getElementById('signupModal'),
        loginBtn: document.querySelector('button[onclick*="loginModal"]'),
        signupBtn: document.querySelector('button[onclick*="signupModal"]'),
        authButtons: document.getElementById('authButtons'),
        hamburger: document.querySelector('.hamburger'),
        navMenu: document.querySelector('.nav-menu')
    });
    
    const voiceSearchBtn = document.getElementById('topVoiceSearchBtn');
    const voiceResultModal = document.getElementById('voiceResultModal');
    const voiceSearchResults = document.getElementById('voiceSearchResults');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeButtons = document.querySelectorAll('.close');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Test modal functions immediately
    console.log('🧪 Testing if modal functions are accessible:', {
        openModal: typeof window.openModal,
        closeModal: typeof window.closeModal,
        testModal: typeof window.testModal
    });
    
    // Add event listeners directly to buttons as backup
    const loginButton = document.querySelector('button[onclick*="loginModal"]');
    const signupButton = document.querySelector('button[onclick*="signupModal"]');
    
    if (loginButton) {
        console.log('✅ Adding backup event listener to login button');
        loginButton.addEventListener('click', function(e) {
            console.log('🔘 Login button clicked (backup handler)');
            e.preventDefault();
            e.stopPropagation();
            // Add active state
            loginButton.classList.add('active');
            setTimeout(() => loginButton.classList.remove('active'), 300);
            openModal('loginModal');
        });
    } else {
        console.error('❌ Login button not found!');
    }
    
    if (signupButton) {
        console.log('✅ Adding backup event listener to signup button');
        signupButton.addEventListener('click', function(e) {
            console.log('🔘 Signup button clicked (backup handler)');
            e.preventDefault();
            e.stopPropagation();
            // Add active state
            signupButton.classList.add('active');
            setTimeout(() => signupButton.classList.remove('active'), 300);
            openModal('signupModal');
        });
    } else {
        console.error('❌ Signup button not found!');
    }

    // Voice Recognition Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // English language recognition
    }

// Firebase real-time data update sample - Initialize with error handling
    let db;
    try {
        db = firebase.firestore();
        console.log('✅ Firebase Firestore initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Firebase Firestore:', error);
        // Create a fallback object to prevent errors
        db = {
            collection: () => ({
                doc: () => ({
                    get: () => Promise.resolve({ exists: false }),
                    set: () => Promise.resolve(),
                    onSnapshot: () => {}
                }),
                onSnapshot: () => {}
            })
        };
    }

    // Fetching properties and products from Firebase
    const sampleData = {
        properties: [],
        products: {},
        services: {}
    };

    // Load data collections with error handling
    try {
        // Load properties collection
        db.collection('properties').onSnapshot(snapshot => {
            sampleData.properties = snapshot.docs.map(doc => doc.data());
            console.log('Updated properties:', sampleData.properties);
        }, error => {
            console.warn('Properties collection not available:', error);
            // Fallback data
            sampleData.properties = [
                { type: '2 BHK Apartment', price: '₹45 Lakhs', location: 'Mumbai', area: '850 sq ft' },
                { type: '3 BHK Villa', price: '₹1.2 Cr', location: 'Delhi', area: '1200 sq ft' }
            ];
        });

        // Load products collection
        db.collection('products').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                let productData = doc.data();
                sampleData.products[productData.category] = sampleData.products[productData.category] || [];
                sampleData.products[productData.category].push(productData);
            });
            console.log('Updated products:', sampleData.products);
        }, error => {
            console.warn('Products collection not available:', error);
        });

        // Load services collection
        db.collection('services').onSnapshot(snapshot => {
            snapshot.docs.forEach(doc => {
                let serviceData = doc.data();
                sampleData.services[serviceData.category] = serviceData.description;
            });
            console.log('Updated services:', sampleData.services);
        }, error => {
            console.warn('Services collection not available:', error);
        });
    } catch (error) {
        console.warn('Firebase collections not available, using fallback data:', error);
        // Initialize with fallback data
        sampleData.properties = [
            { type: '2 BHK Apartment', price: '₹45 Lakhs', location: 'Mumbai', area: '850 sq ft' },
            { type: '3 BHK Villa', price: '₹1.2 Cr', location: 'Delhi', area: '1200 sq ft' }
        ];
        sampleData.products = {
            solar: [{ name: 'Solar Panel 500W', price: '₹15,000', efficiency: '22%' }],
            furniture: [{ name: 'Luxury Sofa Set', price: '₹85,000', material: 'Leather' }]
        };
        sampleData.services = {
            construction: 'Complete construction services with experienced professionals',
            renovation: 'Home renovation and remodeling services'
        };
    }

    // Text-to-Speech functionality
    const synth = window.speechSynthesis;
    let isFirstTouch = true;
    
function speakWelcomeMessage() {
        const welcomeMessage = "Hello, this is The Real Fintech AI Company. I can help with searching anything on this website: buy, sell, or rent properties? Check out products & services? Find PG or hostel? You can search anything and place an order through voice command.";
        
        const utterance = new SpeechSynthesisUtterance(welcomeMessage);
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        utterance.lang = 'en-US'; // Set to English
        
        // Use an English voice if available
        const voices = synth.getVoices();
        const englishVoice = voices.find(voice => voice.lang.includes('en-US'));
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        synth.speak(utterance);
        
        utterance.onend = function() {
            // After welcome message, start listening
            setTimeout(() => {
                if (recognition) {
                    startVoiceRecognition();
                } else {
                    simulateVoiceRecognition();
                }
            }, 500);
        };
    }

    // Voice search function to be used by both buttons
    function handleVoiceSearch(buttonElement) {
        if (isFirstTouch) {
            isFirstTouch = false;
            buttonElement.innerHTML = '\u003ci class="fas fa-microphone"\u003e\u003c/i\u003e\u003cspan\u003eListening...\u003c/span\u003e';
            speakWelcomeMessage();
        } else {
            if (recognition) {
                startVoiceRecognition(buttonElement);
            } else {
                simulateVoiceRecognition(buttonElement);
            }
        }
    }

    // Handle voice search button click
    if (voiceSearchBtn) {
        voiceSearchBtn.addEventListener('click', function () {
            handleVoiceSearch(voiceSearchBtn);
        });
    }

    // Advanced AI features setup
    
    // Initialize Chatbot
    function initChatbot() {
        const chatbot = document.createElement('script');
        chatbot.src = 'https://example.com/chatbot-sdk.js'; // Hypothetical URL
        document.body.appendChild(chatbot);
        chatbot.onload = function() {
            // Initialize chatbot interface
            window.launchChatbot({
                token: 'YOUR_ACCESS_TOKEN',
                theme: 'light',
                language: 'en',
                aiFeatures: ['recommendations', 'smart-assist']
            });
        };
    }

    // AI-Powered Recommendations
    function getAIRecommendations(query) {
        if (!query) {
            console.error('Invalid query for AI recommendations');
            return '<p>No recommendations available</p>';
        }
        // Simulate fetching recommendations
        let recommendations = [
            'Luxury Villa',
            'Eco-Friendly Apartments',
            'Pre-Approved Loan Offers'
        ];
        let recommendationHTML = '<div class="ai-recommendations">';
            recommendationHTML += '<h4>Recommended for you:</h4><ul>';
            recommendations.forEach(item => {
                recommendationHTML += '<li>' + item + '</li>';
            });
            recommendationHTML += '</ul></div>';
        return recommendationHTML;
    }
    
    // Smart Contract Simulation
    function simulateSmartContract() {
        console.log('Simulating smart contracts for real estate deals...');
        // Mockup for smart contract interaction
        return '<h5>Smart Contract Summary:</h5>' +
               '<p>Agreement ID: SC123456</p>' +
               '<p>Terms verified: 100%</p>' +
               '<p>Status: Executed Successfully</p>';
    }

    // Enhanced voice query processing
    function processEnhancedQuery(query) {
        console.log('Enhanced processing for query:', query);
        let enhancedResults = generateEnhancedAIResponse(query);
        enhancedResults += getAIRecommendations(query);
        enhancedResults += simulateSmartContract();
        voiceResultModal.style.display = 'block';
        voiceSearchResults.innerHTML = enhancedResults;
    }

    initChatbot();  // Initialize chatbot when the script loads

    function generateEnhancedAIResponse(query) {
        let response = '\u003cdiv class="ai-response"\u003e';
        response += '\u003ch3i class="fas fa-robot"\u003e\u003c/i\u003e AI Enhanced Response\u003c/h3\u003e';
        response += '\u003cdiv class="query-display"\u003eYou asked: "' + query + '"\u003c/div\u003e';
        if (query.includes('bungalow') || query.includes('villa') || query.includes('mansion')) {
            response += '\u003cdiv class="result-section"\u003e';
            response += '\u003ch4\u003e\u003ci class="fas fa-home"\u003e\u003c/i\u003e Properties Found\u003c/h4\u003e';
            sampleData.properties.forEach(prop => {
                if (prop.type.includes('Villa') || prop.type.includes('Bungalow')) {
                    response += `\u003cdiv class="property-card"\u003e`;
                    response += `\u003ch5\u003e${prop.type}\u003c/h5\u003e`;
                    response += `\u003cp\u003e\u003cstrong\u003ePrice:\u003c/strong\u003e ${prop.price}\u003c/p\u003e`;
                    response += `\u003cp\u003e\u003cstrong\u003eLocation:\u003c/strong\u003e ${prop.location}\u003c/p\u003e`;
                    response += `\u003cbutton class="btn-primary" onclick="alert('Contact us for more details!')"\u003eContact Now\u003c/button\u003e`;
                    response += `\u003c/div\u003e`;
                }
            });
            response += '\u003c/div\u003e';
        }
        if (!response.includes('result-section')) {
            response += '\u003cdiv class="result-section"\u003e';
            response += '\u003ch4\u003e\u003ci class="fas fa-info-circle"\u003e\u003c/i\u003e How Can We Help?\u003c/h4\u003e';
            response += '\u003cp\u003eI can help you with enhanced features:\u003c/p\u003e';
            response += '\u003cul\u003e';
            response += '\u003cli\u003eFinding bungalows and mansions\u003c/li\u003e';
            response += '\u003c/ul\u003e';
            response += '\u003cp\u003eTry saying something like:\u003c/p\u003e';
            response += '\u003cul\u003e';
            response += '\u003cli\u003e"Show me bungalows in Mumbai"\u003c/li\u003e';
            response += '\u003c/ul\u003e';
            response += '\u003c/div\u003e';
        }
        response += '\u003cdiv class="contact-cta"\u003e';
        response += '\u003cp\u003e\u003cstrong\u003eReady to proceed?\u003c/strong\u003e\u003c/p\u003e';
        response += '\u003cdiv class="cta-buttons"\u003e';
        response += '\u003cbutton class="btn-primary" onclick="window.location.href=\'#contact\'; closeModal(\'voiceResultModal\');"\u003eContact Us\u003c/button\u003e';
        response += '\u003cbutton class="btn-secondary" onclick="closeModal(\'voiceResultModal\');"\u003eSearch Again\u003c/button\u003e';
        response += '\u003c/div\u003e';
        response += '\u003c/div\u003e';
        response += '\u003c/div\u003e';
        return response;
    }

    function startVoiceRecognition(buttonElement = voiceSearchBtn) {
        buttonElement.innerHTML = '<i class="fas fa-microphone"></i><span>Listening...</span>';
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            processVoiceQuery(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            buttonElement.classList.remove('listening');
            buttonElement.innerHTML = '<i class="fas fa-microphone"></i><span>AI Voice Search</span>';
            showError('Sorry, I could not hear you clearly. Please try again.');
        };
        
        recognition.onend = function() {
            buttonElement.classList.remove('listening');
            buttonElement.innerHTML = '<i class="fas fa-microphone"></i><span>AI Voice Search</span>';
        };
    }

    function processVoiceQuery(query) {
        console.log('Processing query:', query);
        
        // Clean and normalize the query
        const normalizedQuery = query.toLowerCase().trim();
        
        // Enhanced keyword detection
        const keywords = {
            buy: ['buy', 'purchase', 'buying', 'get', 'need', 'want'],
            sell: ['sell', 'selling', 'sale'],
            rent: ['rent', 'rental', 'renting', 'lease'],
            property: ['house', 'home', 'flat', 'apartment', 'property', 'plot', 'land', 'building'],
            location: ['mumbai', 'delhi', 'bhavnagar', 'ahmedabad', 'surat', 'bangalore', 'pune', 'hyderabad'],
            products: ['solar', 'panel', 'battery', 'door', 'furniture', 'inverter', 'system']
        };
        
        // Check for enhanced queries
        const isBuyQuery = keywords.buy.some(keyword => normalizedQuery.includes(keyword));
        const isSellQuery = keywords.sell.some(keyword => normalizedQuery.includes(keyword));
        const isRentQuery = keywords.rent.some(keyword => normalizedQuery.includes(keyword));
        
        if (isBuyQuery || isSellQuery || isRentQuery) {
            let enhancedResults = generateEnhancedAIResponse(normalizedQuery, {isBuy: isBuyQuery, isSell: isSellQuery, isRent: isRentQuery});
            voiceResultModal.style.display = 'block';
            voiceSearchResults.innerHTML = enhancedResults;
            return;
        }
        
        let results = generateAIResponse(normalizedQuery);
        
        voiceResultModal.style.display = 'block';
        voiceSearchResults.innerHTML = results;
    }

    // Add missing function declarations for global context
    window.performAdvancedSearch = performAdvancedSearch;
    window.resetFilters = resetFilters;
    window.applySuggestion = applySuggestion;
    window.changeStep = changeStep;

    function generateAIResponse(query) {
        let response = '<div class="ai-response">';
        response += '<h3><i class="fas fa-robot"></i> AI Assistant Response</h3>';
        response += '<div class="query-display">You asked: "' + query + '"</div>';
        
        // Property search
        if (query.includes('bhk') || query.includes('apartment') || query.includes('flat') || query.includes('villa')) {
            response += '<div class="result-section">';
            response += '<h4><i class="fas fa-home"></i> Properties Found</h4>';
            sampleData.properties.forEach(prop => {
                response += `<div class="property-card">`;
                response += `<h5>${prop.type}</h5>`;
                response += `<p><strong>Price:</strong> ${prop.price}</p>`;
                response += `<p><strong>Location:</strong> ${prop.location}</p>`;
                response += `<p><strong>Area:</strong> ${prop.area}</p>`;
                response += `<button class="btn-primary" onclick="alert('Contact us at +91 977-308-1099 for more details!')">Contact Now</button>`;
                response += `</div>`;
            });
            response += '</div>';
        }
        
        // Product search
        for (let product in sampleData.products) {
            if (query.includes(product)) {
                response += '<div class="result-section">';
                response += `<h4><i class="fas fa-shopping-cart"></i> ${product.charAt(0).toUpperCase() + product.slice(1)} Products</h4>`;
                sampleData.products[product].forEach(item => {
                    response += `<div class="product-card">`;
                    response += `<h5>${item.name}</h5>`;
                    response += `<p><strong>Price:</strong> ${item.price}</p>`;
                    if (item.efficiency) response += `<p><strong>Efficiency:</strong> ${item.efficiency}</p>`;
                    if (item.brand) response += `<p><strong>Brand:</strong> ${item.brand}</p>`;
                    if (item.material) response += `<p><strong>Material:</strong> ${item.material}</p>`;
                    response += `<button class="btn-primary" onclick="alert('Contact us at jay@therealfintech.com for product details!')">Get Quote</button>`;
                    response += `</div>`;
                });
                response += '</div>';
                break;
            }
        }
        
        // Service search
        for (let service in sampleData.services) {
            if (query.includes(service)) {
                response += '<div class="result-section">';
                response += `<h4><i class="fas fa-tools"></i> ${service.charAt(0).toUpperCase() + service.slice(1)} Services</h4>`;
                response += `<div class="service-info">`;
                response += `<p>${sampleData.services[service]}</p>`;
                response += `<button class="btn-primary" onclick="alert('Call us at +91 977-308-1099 for service booking!')">Book Service</button>`;
                response += `</div>`;
                response += '</div>';
                break;
            }
        }
        
        // Default response if no specific match
        if (!response.includes('result-section')) {
            response += '<div class="result-section">';
            response += '<h4><i class="fas fa-info-circle"></i> How Can We Help?</h4>';
            response += '<p>I can help you with:</p>';
            response += '<ul>';
            response += '<li>Finding properties (apartments, villas, flats)</li>';
            response += '<li>Real estate products (solar panels, doors, furniture, etc.)</li>';
            response += '<li>Construction and renovation services</li>';
            response += '<li>Investment advice and zero brokerage deals</li>';
            response += '</ul>';
            response += '<p>Try saying something like:</p>';
            response += '<ul>';
            response += '<li>"Show me 2BHK apartments under 50 lakhs"</li>';
            response += '<li>"I need solar panels for my home"</li>';
            response += '<li>"Construction services in Bhavnagar"</li>';
            response += '</ul>';
            response += '</div>';
        }
        
        response += '<div class="contact-cta">';
        response += '<p><strong>Ready to proceed?</strong></p>';
        response += '<div class="cta-buttons">';
        response += '<button class="btn-primary" onclick="window.location.href=\'#contact\'; closeModal(\'voiceResultModal\');">Contact Us</button>';
        response += '<button class="btn-secondary" onclick="closeModal(\'voiceResultModal\');">Search Again</button>';
        response += '</div>';
        response += '</div>';
        
        response += '</div>';
        return response;
    }

    // Simulate voice recognition for browsers without support
    function simulateVoiceRecognition(buttonElement = voiceSearchBtn) {
        buttonElement.classList.add('listening');
        buttonElement.innerHTML = '<i class="fas fa-microphone"></i><span>Listening...</span>';
        
        setTimeout(() => {
            buttonElement.classList.remove('listening');
            buttonElement.innerHTML = '<i class="fas fa-microphone"></i><span>AI Voice Search</span>';
            
            // Simulate a sample query
            const sampleQueries = [
                'show me 2bhk apartments',
                'i need solar panels',
                'construction services',
                'furniture for home'
            ];
            const randomQuery = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
            processVoiceQuery(randomQuery);
        }, 2000);
    }

function showError(message) {
        voiceResultModal.style.display = 'block';
        voiceSearchResults.innerHTML = `
            <div class="error-message">
                <h3><i class="fas fa-exclamation-triangle"></i> Error</h3>
                <p>${message}</p>
                <button class="btn-primary" onclick="closeModal('voiceResultModal')">Try Again</button>
            </div>
        `;
    }

    // Modal functions are already defined globally above

    // Handle modal closing
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            this.parentElement.parentElement.style.display = 'none';
        });
    });

    // Close modals when clicking outside
    window.onclick = function (event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === signupModal) {
            signupModal.style.display = 'none';
        }
        if (event.target === voiceResultModal) {
            voiceResultModal.style.display = 'none';
        }
    };

    // Mobile menu toggle - Fix hamburger functionality
    if (hamburger && navMenu) {
        console.log('✅ Hamburger menu initialized');
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🍔 Hamburger clicked - toggling menu');
            
            // Toggle active class on both elements
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Log the current state
            console.log('Menu active:', navMenu.classList.contains('active'));
            console.log('Hamburger active:', hamburger.classList.contains('active'));
            
            // Add/remove mobile auth buttons
            if (navMenu.classList.contains('active')) {
                addMobileAuthButtons();
                console.log('📱 Mobile menu opened - added auth buttons');
            } else {
                removeMobileAuthButtons();
                console.log('📱 Mobile menu closed - removed auth buttons');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                if (navMenu.classList.contains('active')) {
                    console.log('🔒 Closing menu - clicked outside');
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    removeMobileAuthButtons();
                }
            }
        });
        
        // Make navigation links clickable
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Don't prevent default for navigation - let links work
                console.log('📍 Navigation link clicked:', this.textContent);
                
                // Close mobile menu after link click
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                removeMobileAuthButtons();
            });
        });
    } else {
        console.error('❌ Hamburger or navMenu not found:', { hamburger, navMenu });
    }
    
    // Function to add Login & Signup buttons to mobile menu
    function addMobileAuthButtons() {
        // Check if buttons already exist
        if (document.querySelector('.mobile-auth-buttons')) {
            return;
        }
        
        const mobileAuthContainer = document.createElement('div');
        mobileAuthContainer.className = 'mobile-auth-buttons';
        mobileAuthContainer.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1rem;
            padding: 1rem 2rem;
            border-top: 1px solid #e2e8f0;
            margin-top: 1rem;
        `;
        
        const loginBtn = document.createElement('button');
        loginBtn.textContent = 'Login';
        loginBtn.className = 'mobile-login-btn';
        loginBtn.style.cssText = `
            background: linear-gradient(135deg, var(--accent-blue) 0%, var(--deep-blue) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        loginBtn.onclick = function() {
            // Add active state
            loginBtn.classList.add('active');
            setTimeout(() => loginBtn.classList.remove('active'), 300);
            openModal('loginModal');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            removeMobileAuthButtons();
        };
        
        const signupBtn = document.createElement('button');
        signupBtn.textContent = 'Sign Up';
        signupBtn.className = 'mobile-signup-btn';
        signupBtn.style.cssText = `
            background: linear-gradient(135deg, var(--saffron-primary) 0%, var(--golden) 50%, var(--saffron-bright) 100%);
            color: white;
            border: 2px solid var(--saffron-primary);
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        signupBtn.onclick = function() {
            // Add active state
            signupBtn.classList.add('active');
            setTimeout(() => signupBtn.classList.remove('active'), 300);
            openModal('signupModal');
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            removeMobileAuthButtons();
        };
        
        mobileAuthContainer.appendChild(loginBtn);
        mobileAuthContainer.appendChild(signupBtn);
        navMenu.appendChild(mobileAuthContainer);
    }
    
    // Function to remove mobile auth buttons
    function removeMobileAuthButtons() {
        const mobileAuthButtons = document.querySelector('.mobile-auth-buttons');
        if (mobileAuthButtons) {
            mobileAuthButtons.remove();
        }
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Firebase Authentication State Listener with error handling
    try {
        firebase.auth().onAuthStateChanged((user) => {
            console.log('🔥 Firebase Auth State Changed:', user ? `User logged in: ${user.email}` : 'User logged out');
        
        if (user) {
            // User is signed in
            currentUser = user;
            console.log('✅ User is signed in:', user.email);
            
            // IMMEDIATELY hide login/signup buttons and show loading state
            const authButtons = document.getElementById('authButtons');
            const navUserProfile = document.getElementById('navUserProfile');
            
            if (authButtons) {
                authButtons.style.display = 'none';
                console.log('✅ Hidden auth buttons');
            }
            
            if (navUserProfile) {
                navUserProfile.style.display = 'flex';
                // Show loading state
                document.getElementById('navUserName').textContent = 'Loading...';
                document.getElementById('navUserType').textContent = 'Please wait';
                console.log('✅ Showing user profile area');
            }
            
            // Load user data from Firestore
            db.collection('users').doc(user.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('✅ User data loaded from Firestore:', userData);
                    
                    // Update UI with user data
                    showUserProfile(user, userData);
                    
                    // Force UI update
                    setTimeout(() => {
                        console.log('🔄 Forcing UI refresh...');
                        showUserProfile(user, userData);
                    }, 100);
                    
                } else {
                    console.error('❌ No user data found in Firestore for user:', user.uid);
                    // Create basic user data if it doesn't exist
                    const basicUserData = {
                        uid: user.uid,
                        email: user.email,
                        fullName: user.displayName || 'User',
                        userType: 'customer', // Default to customer
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };
                    
                    // Save basic data to Firestore
                    db.collection('users').doc(user.uid).set(basicUserData).then(() => {
                        console.log('✅ Created basic user profile');
                        showUserProfile(user, basicUserData);
                    }).catch((error) => {
                        console.error('❌ Error creating user profile:', error);
                        // Still show user with basic info
                        showUserProfile(user, basicUserData);
                    });
                }
            }).catch((error) => {
                console.error('❌ Error getting user data:', error);
                // Show user with basic email info even if Firestore fails
                const fallbackData = {
                    fullName: user.displayName || user.email.split('@')[0],
                    userType: 'customer',
                    email: user.email
                };
                showUserProfile(user, fallbackData);
            });
        } else {
            // User is signed out
            console.log('❌ User is signed out');
            currentUser = null;
            currentUserData = null;
            
            // Reset UI to logged out state
            const authButtons = document.getElementById('authButtons');
            const navUserProfile = document.getElementById('navUserProfile');
            const userProfileHeader = document.getElementById('userProfileHeader');
            
            if (authButtons) {
                authButtons.style.display = 'flex';
                console.log('✅ Showing auth buttons');
            }
            
            if (navUserProfile) {
                navUserProfile.style.display = 'none';
                console.log('✅ Hidden user profile');
            }
            
            if (userProfileHeader) {
                userProfileHeader.style.display = 'none';
                console.log('✅ Hidden profile header');
            }
            
            // Hide all dashboards and show home
            const dashboards = document.querySelectorAll('.user-dashboard');
            dashboards.forEach(dashboard => {
                dashboard.style.display = 'none';
            });
            
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.style.display = 'block';
                console.log('✅ Showing home section');
            }
        }
        });
    } catch (error) {
        console.error('❌ Firebase Auth not available:', error);
        // Show auth buttons by default if Firebase is not available
        const authButtons = document.getElementById('authButtons');
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
    }
    
    // Firebase Authentication Handling
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Authentication helper functions
    function showAuthError(message) {
        // Remove any existing error messages
        const existingError = document.querySelector('.auth-error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error-message';
        errorDiv.style.cssText = `
            background: #fee;
            border: 1px solid #fcc;
            color: #c33;
            padding: 12px;
            border-radius: 6px;
            margin: 10px 0;
            font-size: 14px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span style="margin-left: 8px;">${message}</span>
            <button onclick="this.parentElement.remove()" style="
                float: right;
                background: none;
                border: none;
                color: #c33;
                cursor: pointer;
                font-size: 16px;
            ">×</button>
        `;
        
        // Add to active modal
        const activeModal = document.querySelector('.modal[style*="block"]');
        if (activeModal) {
            const modalContent = activeModal.querySelector('.modal-content');
            const form = modalContent.querySelector('form');
            if (form) {
                form.insertBefore(errorDiv, form.firstChild);
            }
        }
    }
    
    function showAuthSuccess(message) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.auth-error-message, .auth-success-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'auth-success-message';
        successDiv.style.cssText = `
            background: #efe;
            border: 1px solid #cfc;
            color: #363;
            padding: 12px;
            border-radius: 6px;
            margin: 10px 0;
            font-size: 14px;
            text-align: center;
        `;
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span style="margin-left: 8px;">${message}</span>
        `;
        
        // Add to active modal
        const activeModal = document.querySelector('.modal[style*="block"]');
        if (activeModal) {
            const modalContent = activeModal.querySelector('.modal-content');
            const form = modalContent.querySelector('form');
            if (form) {
                form.insertBefore(successDiv, form.firstChild);
            }
        }
    }
    
    // Global variables for current user
    let currentUser = null;
    let currentUserData = null;
    
    // Supported user types and their display names
    const USER_TYPES = {
        'customer': 'Customer',
        'broker': 'Broker', 
        'builder': 'Builder',
        'shop_owner': 'Shop Owner',
        'service_provider': 'Service Provider'
    };
    
    // Helper function to format user type display names
    function formatUserTypeDisplay(userType) {
        return USER_TYPES[userType] || userType.charAt(0).toUpperCase() + userType.slice(1);
    }
    
    // Helper function to validate user type
    function isValidUserType(userType) {
        return Object.keys(USER_TYPES).includes(userType);
    }
    
    // Dashboard action functions
    window.searchProperties = function(type) {
        alert(`Searching for properties to ${type}. Feature coming soon!`);
    };
    
    window.openAdvancedSearch = function() {
        alert('Advanced search feature coming soon!');
    };
    
    window.postRequirement = function() {
        alert('Post requirement feature coming soon!');
    };
    
    window.addProperty = function(type) {
        alert(`Add property for ${type} feature coming soon!`);
    };
    
    window.importProperties = function() {
        alert('Bulk import feature coming soon!');
    };
    
    window.viewAllListings = function() {
        alert('View all listings feature coming soon!');
    };
    
    window.launchProject = function(type) {
        alert(`Launch ${type} project feature coming soon!`);
    };
    
    window.uploadFloorPlans = function() {
        alert('Upload floor plans feature coming soon!');
    };
    
    window.viewAllProjects = function() {
        alert('View all projects feature coming soon!');
    };
    
    window.viewSalesReport = function() {
        alert('Sales report feature coming soon!');
    };
    
    window.addProduct = function(category) {
        alert(`Add ${category} products feature coming soon!`);
    };
    
    window.bulkUploadProducts = function() {
        alert('Bulk upload products feature coming soon!');
    };
    
    window.manageInventory = function() {
        alert('Manage inventory feature coming soon!');
    };
    
    window.addService = function(type) {
        alert(`Add ${type} service feature coming soon!`);
    };
    
    window.setServiceArea = function() {
        alert('Set service area feature coming soon!');
    };
    
    window.manageServices = function() {
        alert('Manage services feature coming soon!');
    };
    
    window.viewCalendar = function() {
        alert('Calendar view feature coming soon!');
    };
    
    // User profile functions
    window.editProfile = function() {
        alert('Edit profile feature coming soon!');
    };
    
    window.viewSettings = function() {
        alert('Settings feature coming soon!');
    };
    
    window.toggleUserDropdown = function() {
        const dropdown = document.getElementById('userDropdown');
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    };
    
    window.goToDashboard = function() {
        if (currentUserData) {
            showDashboard(currentUserData.userType);
        }
        // Close dropdown
        document.getElementById('userDropdown').style.display = 'none';
    };
    
    window.logoutUser = function() {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            console.warn('Firebase not available, performing client-side logout');
            // Perform client-side logout
            currentUser = null;
            currentUserData = null;
            
            // Reset UI to logged out state
            const authButtons = document.getElementById('authButtons');
            const navUserProfile = document.getElementById('navUserProfile');
            const userProfileHeader = document.getElementById('userProfileHeader');
            
            if (authButtons) authButtons.style.display = 'flex';
            if (navUserProfile) navUserProfile.style.display = 'none';
            if (userProfileHeader) userProfileHeader.style.display = 'none';
            
            // Hide all dashboards and show home
            const dashboards = document.querySelectorAll('.user-dashboard');
            dashboards.forEach(dashboard => dashboard.style.display = 'none');
            
            const homeSection = document.getElementById('home');
            if (homeSection) homeSection.style.display = 'block';
            
            alert('Logged out successfully!');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        firebase.auth().signOut().then(() => {
            // Hide user profile and dashboards
            document.getElementById('navUserProfile').style.display = 'none';
            document.getElementById('userProfileHeader').style.display = 'none';
            document.getElementById('authButtons').style.display = 'flex';
            
            // Hide all dashboards
            const dashboards = document.querySelectorAll('.user-dashboard');
            dashboards.forEach(dashboard => {
                dashboard.style.display = 'none';
            });
            
            // Show hero section
            document.getElementById('home').style.display = 'block';
            
            // Reset global variables
            currentUser = null;
            currentUserData = null;
            
            alert('Logged out successfully!');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }).catch((error) => {
            console.error('Logout error:', error);
            alert('Error logging out. Please try again.');
        });
    };
    
    function showUserProfile(user, userData) {
        console.log('🚀 showUserProfile called with:', { user: user?.email, userData });
        
        currentUser = user;
        currentUserData = userData;
        
        // Validate user data - provide fallback values
        if (!userData) {
            console.warn('⚠️ No userData provided, using fallback');
            userData = {
                fullName: user?.displayName || user?.email?.split('@')[0] || 'User',
                userType: 'customer',
                email: user?.email
            };
        }
        
        if (!userData.userType) {
            console.warn('⚠️ No userType provided, defaulting to customer');
            userData.userType = 'customer';
        }
        
        // FORCE IMMEDIATE UI UPDATE
        console.log('🔄 Forcing immediate UI update...');
        
        // 1. IMMEDIATELY hide auth buttons
        const authButtons = document.getElementById('authButtons');
        if (authButtons) {
            authButtons.style.display = 'none';
            console.log('✅ Auth buttons hidden');
        } else {
            console.error('❌ authButtons element not found!');
        }
        
        // 2. IMMEDIATELY show user profile
        const navUserProfile = document.getElementById('navUserProfile');
        if (navUserProfile) {
            navUserProfile.style.display = 'flex';
            console.log('✅ User profile shown');
        } else {
            console.error('❌ navUserProfile element not found!');
        }
        
        // 3. Format user type display name
        const userTypeDisplay = formatUserTypeDisplay(userData.userType);
        const displayName = userData.fullName || user?.displayName || user?.email?.split('@')[0] || 'User';
        
        console.log('📝 Updating profile with:', { displayName, userTypeDisplay });
        
        // 4. Update navigation user info
        const navUserNameEl = document.getElementById('navUserName');
        const navUserTypeEl = document.getElementById('navUserType');
        
        if (navUserNameEl) {
            navUserNameEl.textContent = displayName;
            console.log('✅ Nav user name updated:', displayName);
        } else {
            console.error('❌ navUserName element not found!');
        }
        
        if (navUserTypeEl) {
            navUserTypeEl.textContent = userTypeDisplay;
            console.log('✅ Nav user type updated:', userTypeDisplay);
        } else {
            console.error('❌ navUserType element not found!');
        }
        
        // 5. Update profile header if it exists
        const userNameEl = document.getElementById('userName');
        const userTypeEl = document.getElementById('userType');
        const userEmailEl = document.getElementById('userEmail');
        const userProfileHeader = document.getElementById('userProfileHeader');
        
        if (userNameEl) {
            userNameEl.textContent = displayName;
            console.log('✅ Profile name updated');
        }
        
        if (userTypeEl) {
            userTypeEl.textContent = userTypeDisplay;
            console.log('✅ Profile type updated');
        }
        
        if (userEmailEl) {
            userEmailEl.textContent = user?.email || 'No email';
            console.log('✅ Profile email updated');
        }
        
        if (userProfileHeader) {
            userProfileHeader.style.display = 'block';
            console.log('✅ Profile header shown');
        }
        
        // 6. Force a reflow to ensure changes are applied
        if (navUserProfile) {
            navUserProfile.offsetHeight; // Force reflow
        }
        
        console.log(`🎉 User profile fully loaded for ${userTypeDisplay}: ${displayName}`);
        
        // Update global reference
        currentUserData = userData;
    }
    
    function showDashboard(userType) {
        // Validate user type
        if (!isValidUserType(userType)) {
            console.error('Invalid user type:', userType);
            alert(`Invalid user type: ${userType}. Please contact support.`);
            return;
        }
        
        console.log(`Showing dashboard for user type: ${userType}`);
        
        // Hide hero section and all dashboards first
        document.getElementById('home').style.display = 'none';
        const dashboards = document.querySelectorAll('.user-dashboard');
        dashboards.forEach(dashboard => {
            dashboard.style.display = 'none';
        });
        
        // Show specific dashboard
        const targetDashboard = document.getElementById(`${userType}-dashboard`);
        if (targetDashboard) {
            targetDashboard.style.display = 'block';
            targetDashboard.scrollIntoView({ behavior: 'smooth' });
            console.log(`Dashboard displayed successfully for ${formatUserTypeDisplay(userType)}`);
        } else {
            console.error(`Dashboard not found for user type: ${userType}`);
            alert(`Dashboard not available for ${formatUserTypeDisplay(userType)}. Please contact support.`);
            // Show home section as fallback
            document.getElementById('home').style.display = 'block';
            return;
        }
        
        // Load user-specific data (simulate for now)
        loadUserData(userType);
    }
    
    function loadUserData(userType) {
        console.log(`Loading user data for ${userType}`);
        
        // Helper function to safely update element text content
        function safeUpdateElement(elementId, textContent) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = textContent;
            } else {
                console.warn(`Element not found: ${elementId}`);
            }
        }
        
        // Simulate loading user-specific data with error handling
        try {
            switch(userType) {
                case 'customer':
                    safeUpdateElement('customerSavedProperties', '3');
                    safeUpdateElement('customerActiveRequests', '1');
                    safeUpdateElement('customerViewedProperties', '15');
                    console.log('Customer dashboard data loaded successfully');
                    break;
                case 'broker':
                    safeUpdateElement('brokerActiveListings', '12');
                    safeUpdateElement('brokerLeads', '8');
                    safeUpdateElement('brokerCommission', '₹45,000');
                    console.log('Broker dashboard data loaded successfully');
                    break;
                case 'builder':
                    safeUpdateElement('builderActiveProjects', '2');
                    safeUpdateElement('builderUnitsAvailable', '24');
                    safeUpdateElement('builderUnitsSold', '6');
                    console.log('Builder dashboard data loaded successfully');
                    break;
                case 'shop_owner':
                    safeUpdateElement('shopProducts', '18');
                    safeUpdateElement('shopOrders', '5');
                    safeUpdateElement('shopRevenue', '₹28,500');
                    console.log('Shop Owner dashboard data loaded successfully');
                    break;
                case 'service_provider':
                    safeUpdateElement('servicesOffered', '4');
                    safeUpdateElement('activeBookings', '7');
                    safeUpdateElement('serviceRevenue', '₹32,000');
                    console.log('Service Provider dashboard data loaded successfully');
                    break;
                default:
                    console.warn(`No data loader defined for user type: ${userType}`);
            }
        } catch (error) {
            console.error(`Error loading user data for ${userType}:`, error);
        }
    }
    
    function redirectAfterAuth() {
        // Load user data from firestore and use the stored userType
        if (currentUser) {
            db.collection('users').doc(currentUser.uid).get().then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    console.log('Redirecting with user data:', userData);
                    showUserProfile(currentUser, userData);
                    // Use the userType stored in Firestore, not from the form
                    showDashboard(userData.userType);
                } else {
                    console.error('No user data found in Firestore');
                    alert('User profile not found. Please contact support.');
                }
            }).catch((error) => {
                console.error('Error getting user data:', error);
                alert('Error loading user profile. Please try refreshing the page.');
            });
        }
    }
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const userType = document.getElementById('loginUserType').value;
            
            // Input validation
            if (!email.trim()) {
                showAuthError('Please enter your email address.');
                return;
            }
            
            if (!password.trim()) {
                showAuthError('Please enter your password.');
                return;
            }
            
            // Show loading state
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Signing In...';
            submitBtn.disabled = true;
            
            // Firebase login function with error handling
            if (typeof firebase === 'undefined' || !firebase.auth) {
                showAuthError('Firebase authentication is not available. Please refresh the page and try again.');
                return;
            }
            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    showAuthSuccess('Welcome back! Redirecting to your dashboard...');
                    setTimeout(() => {
                        closeModal('loginModal');
                        redirectAfterAuth();
                    }, 1500);
                })
                .catch((error) => {
                    console.error('Login error', error);
                    let errorMessage = 'Login failed. Please try again.';
                    
                    // Handle specific error codes
                    switch(error.code) {
                        case 'auth/user-not-found':
                            errorMessage = 'No account found with this email. Please sign up first.';
                            break;
                        case 'auth/wrong-password':
                            errorMessage = 'Incorrect password. Please try again.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Please enter a valid email address.';
                            break;
                        case 'auth/too-many-requests':
                            errorMessage = 'Too many failed attempts. Please try again later.';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage = 'Network error. Please check your internet connection.';
                            break;
                        default:
                            errorMessage = error.message;
                    }
                    
                    showAuthError(errorMessage);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fullName = document.getElementById('signupFullName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('signupPhone').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const userType = document.getElementById('signupUserType').value;
            
            // Input validation
            if (!fullName.trim()) {
                showAuthError('Please enter your full name.');
                return;
            }
            
            if (!email.trim()) {
                showAuthError('Please enter your email address.');
                return;
            }
            
            if (!phone.trim()) {
                showAuthError('Please enter your phone number.');
                return;
            }
            
            if (password.length < 6) {
                showAuthError('Password must be at least 6 characters long.');
                return;
            }
            
            if (password !== confirmPassword) {
                showAuthError('Passwords do not match.');
                return;
            }
            
            // Show loading state
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Creating Account...';
            submitBtn.disabled = true;
            
            // Firebase sign-up function with error handling
            if (typeof firebase === 'undefined' || !firebase.auth) {
                showAuthError('Firebase authentication is not available. Please refresh the page and try again.');
                return;
            }
            
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Store additional user data in Firestore
                    const user = userCredential.user;
                    const userData = {
                        uid: user.uid,
                        email: email,
                        fullName: fullName,
                        phone: phone,
                        userType: userType,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        profileComplete: false
                    };
                    
                    // Save to Firestore
                    return db.collection('users').doc(user.uid).set(userData);
                })
                .then(() => {
                    showAuthSuccess('Account created successfully! Welcome to The Real Fintech AI Company!');
                    setTimeout(() => {
                        closeModal('signupModal');
                        // Redirect based on user type
                        redirectAfterAuth();
                    }, 2000);
                })
                .catch((error) => {
                    console.error('Signup error', error);
                    let errorMessage = 'Signup failed. Please try again.';
                    
                    // Handle specific error codes
                    switch(error.code) {
                        case 'auth/email-already-in-use':
                            errorMessage = 'This email is already registered. Please use the Login form or try a different email address.';
                            break;
                        case 'auth/invalid-email':
                            errorMessage = 'Please enter a valid email address.';
                            break;
                        case 'auth/weak-password':
                            errorMessage = 'Password is too weak. Please choose a stronger password.';
                            break;
                        case 'auth/network-request-failed':
                            errorMessage = 'Network error. Please check your internet connection and try again.';
                            break;
                        default:
                            errorMessage = error.message;
                    }
                    
                    showAuthError(errorMessage);
                })
                .finally(() => {
                    // Reset button state
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your inquiry! We will contact you within 24 hours.');
            this.reset();
        });
    }

    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Floating window color cycling animation (saffron, red, blue every 4 seconds)
    const floatingButton = document.getElementById('admin-float-btn');
    if (floatingButton) {
        const colors = [
            'linear-gradient(135deg, #F4C430 0%, #D2691E 100%)', // Saffron
            'linear-gradient(135deg, #FF0000 0%, #CC0000 100%)', // Red
            'linear-gradient(135deg, #0000FF 0%, #000099 100%)'  // Blue
        ];
        
        let colorIndex = 0;
        
        // Initial color
        const button = floatingButton.querySelector('button');
        if (button) {
            button.style.background = colors[colorIndex];
        }
        
        // Change color every 4 seconds
        setInterval(() => {
            if (button) {
                colorIndex = (colorIndex + 1) % colors.length;
                button.style.background = colors[colorIndex];
                button.style.boxShadow = `0 4px 20px ${colorIndex === 0 ? 'rgba(244, 196, 48, 0.4)' : colorIndex === 1 ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 255, 0.4)'}`;
            }
        }, 4000);
    }
});
