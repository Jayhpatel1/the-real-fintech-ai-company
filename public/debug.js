// Simple debug script to test hamburger menu functionality
console.log('🔧 Debug script loaded');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Debug DOMContentLoaded fired');
    
    // Test basic modal functionality
    window.openModal = function(modalId) {
        console.log('🔧 Debug openModal called:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            console.log('🔧 Modal opened successfully');
        } else {
            console.error('🔧 Modal not found:', modalId);
        }
    };
    
    window.closeModal = function(modalId) {
        console.log('🔧 Debug closeModal called:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            console.log('🔧 Modal closed successfully');
        }
    };
    
    // Test hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    console.log('🔧 Debug elements found:', {
        hamburger: !!hamburger,
        navMenu: !!navMenu
    });
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔧 Debug hamburger clicked');
            
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            console.log('🔧 Classes toggled:', {
                navMenuActive: navMenu.classList.contains('active'),
                hamburgerActive: hamburger.classList.contains('active')
            });
        });
        
        console.log('🔧 Hamburger event listener added');
    } else {
        console.error('🔧 Hamburger elements not found');
    }
    
    // Test modal buttons
    const loginBtn = document.querySelector('button[onclick*="loginModal"]');
    const signupBtn = document.querySelector('button[onclick*="signupModal"]');
    
    console.log('🔧 Modal buttons found:', {
        loginBtn: !!loginBtn,
        signupBtn: !!signupBtn
    });
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            console.log('🔧 Debug login button clicked');
            e.preventDefault();
            openModal('loginModal');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function(e) {
            console.log('🔧 Debug signup button clicked');
            e.preventDefault();
            openModal('signupModal');
        });
    }
});
