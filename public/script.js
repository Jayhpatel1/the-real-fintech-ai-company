// JavaScript for The Real Fintech AI Company Website

document.addEventListener('DOMContentLoaded', function () {
    const voiceSearchBtn = document.getElementById('topVoiceSearchBtn');
    const voiceResultModal = document.getElementById('voiceResultModal');
    const voiceSearchResults = document.getElementById('voiceSearchResults');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeButtons = document.querySelectorAll('.close');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Voice Recognition Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // English language recognition
    }

// Firebase real-time data update sample
    const db = firebase.firestore();

    // Fetching properties and products from Firebase
    const sampleData = {
        properties: [],
        products: {},
        services: {}
    };

    // Load properties collection
    db.collection('properties').onSnapshot(snapshot => {
        sampleData.properties = snapshot.docs.map(doc => doc.data());
        console.log('Updated properties:', sampleData.properties);
    });

    // Load products collection
    db.collection('products').onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
            let productData = doc.data();
            sampleData.products[productData.category] = sampleData.products[productData.category] || [];
            sampleData.products[productData.category].push(productData);
        });
        console.log('Updated products:', sampleData.products);
    });

    // Load services collection
    db.collection('services').onSnapshot(snapshot => {
        snapshot.docs.forEach(doc => {
            let serviceData = doc.data();
            sampleData.services[serviceData.category] = serviceData.description;
        });
        console.log('Updated services:', sampleData.services);
    });

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

    // Modal functions
    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'block';
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };

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

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
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

    // Firebase Authentication Handling
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const userType = document.getElementById('loginUserType').value;
            // Firebase login function
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Successful login logic, redirect, or display dashboard
                    alert('Welcome back, ' + userCredential.user.email + ' as ' + userType);
                })
                .catch((error) => {
                    console.error('Login error', error);
                    alert('Login failed: ' + error.message);
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
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            // Firebase sign-up function
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Successful sign-up logic, save additional user data
                    alert('Welcome, ' + fullName + ' as ' + userType);
                    // Optionally store additional user data in Firebase database
                })
                .catch((error) => {
                    console.error('Signup error', error);
                    alert('Signup failed: ' + error.message);
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
