// Authentication and User Management
let currentUser = null;
let userProfile = null;

// Firebase Configuration (Replace with your actual Firebase config)
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};

// Initialize Firebase (only if firebase is loaded)
if (typeof firebase !== 'undefined') {
    try {
        firebase.initializeApp(firebaseConfig);
        window.auth = firebase.auth();
        window.db = firebase.firestore();
        
        // Auth state listener
        auth.onAuthStateChanged((user) => {
            currentUser = user;
            updateNavigation();
        });
    } catch (error) {
        console.log('Firebase not available or already initialized');
    }
}

// Authentication Functions
function signUp(email, password, userData) {
    if (typeof firebase === 'undefined') {
        alert('Firebase not available. Using demo mode.');
        return Promise.resolve();
    }
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            return db.collection('users').doc(userCredential.user.uid).set({
                ...userData,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        });
}

function signIn(email, password) {
    if (typeof firebase === 'undefined') {
        alert('Firebase not available. Using demo mode.');
        currentUser = { email: email, uid: 'demo-user' };
        updateNavigation();
        return Promise.resolve();
    }
    return auth.signInWithEmailAndPassword(email, password);
}

function signOut() {
    if (typeof firebase === 'undefined') {
        currentUser = null;
        updateNavigation();
        return Promise.resolve();
    }
    return auth.signOut();
}

// Update Navigation based on auth state
function updateNavigation() {
    const navButtons = document.querySelector('.nav-buttons');
    if (!navButtons) return;
    
    if (currentUser) {
        navButtons.innerHTML = `
            <button class="btn-secondary" onclick="showDashboard()">Dashboard</button>
            <button class="btn-primary" onclick="handleSignOut()">Logout</button>
        `;
    } else {
        navButtons.innerHTML = `
            <button class="btn-secondary" onclick="openModal('loginModal')">Login</button>
            <button class="btn-primary" onclick="openModal('signupModal')">Sign Up</button>
        `;
    }
}

// JavaScript for The Real Fintech AI Company Website

document.addEventListener('DOMContentLoaded', function () {
    const voiceSearchBtn = document.getElementById('voiceSearchBtn');
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
        recognition.lang = 'en-US';
    }

    // Sample property and product data for AI responses
    const sampleData = {
        properties: [
            { type: '2BHK Apartment', price: '₹45 Lakhs', location: 'Bhavnagar', area: '1200 sq ft' },
            { type: '3BHK Villa', price: '₹85 Lakhs', location: 'Ramnagar', area: '2200 sq ft' },
            { type: '1BHK Flat', price: '₹28 Lakhs', location: 'City Center', area: '800 sq ft' }
        ],
        products: {
            'solar panels': [{ name: 'Premium Solar Panel 500W', price: '₹15,000', efficiency: '22%' }],
            'shower': [{ name: 'Luxury Rain Shower', price: '₹8,500', brand: 'Premium Bath' }],
            'doors': [{ name: 'Security Steel Door', price: '₹12,000', material: 'Steel & Wood' }],
            'furniture': [{ name: 'Modern Sofa Set', price: '₹45,000', material: 'Leather' }]
        },
        services: {
            'construction': 'We provide complete construction services starting from ₹1,200 per sq ft',
            'renovation': 'Interior renovation services starting from ₹500 per sq ft',
            'demolition': 'Safe demolition services starting from ₹100 per sq ft'
        }
    };

    // Handle voice search button click
    voiceSearchBtn.addEventListener('click', function () {
        if (recognition) {
            startVoiceRecognition();
        } else {
            // Fallback for browsers without speech recognition
            simulateVoiceRecognition();
        }
    });

    function startVoiceRecognition() {
        voiceSearchBtn.classList.add('listening');
        voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Listening...</span>';
        
        recognition.start();
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase();
            processVoiceQuery(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            voiceSearchBtn.classList.remove('listening');
            voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i><span>AI Voice Search</span>';
            showError('Sorry, I couldn\'t hear you clearly. Please try again.');
        };
        
        recognition.onend = function() {
            voiceSearchBtn.classList.remove('listening');
            voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i><span>AI Voice Search</span>';
        };
    }

    function processVoiceQuery(query) {
        console.log('Processing query:', query);
        
        let results = generateAIResponse(query);
        
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
    function simulateVoiceRecognition() {
        voiceSearchBtn.classList.add('listening');
        voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i><span>Listening...</span>';
        
        setTimeout(() => {
            voiceSearchBtn.classList.remove('listening');
            voiceSearchBtn.innerHTML = '<i class="fas fa-microphone"></i><span>AI Voice Search</span>';
            
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

    // Form submissions
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
