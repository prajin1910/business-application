// Business Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentUser = null;
    const API_BASE = '/api';
    
    // Check if user is logged in on page load
    checkAuthStatus();
    
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
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(13, 110, 253, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
        }
    });
    
    // Gallery image hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Form submissions
    setupFormHandlers();
    
    // Animation on scroll
    setupScrollAnimations();
    
    // Add form validation
    addFormValidation();
    
    // Initialize carousel controls
    initializeCarousel();
    
    // Initialize accordion animations
    initializeAccordion();
    
    // Initialize gallery lightbox
    initializeGallery();
    
    // Initialize navbar mobile menu
    initializeMobileMenu();
    
    // Initialize tooltips and popovers
    initializeBootstrapComponents();
});

// Authentication functions
function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Verify token with server
        fetch('/api/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Token invalid');
        })
        .then(data => {
            currentUser = data.user;
            updateUIForLoggedInUser();
        })
        .catch(error => {
            localStorage.removeItem('authToken');
            updateUIForLoggedOutUser();
        });
    }
}

function updateUIForLoggedInUser() {
    const loginBtn = document.querySelector('button[onclick="showLoginModal()"]');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.classList.add('d-none');
    if (logoutBtn) {
        logoutBtn.classList.remove('d-none');
        logoutBtn.innerHTML = `<i class="fas fa-user me-1"></i>${currentUser.username}`;
    }
}

function updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('button[onclick="showLoginModal()"]');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.classList.remove('d-none');
    if (logoutBtn) logoutBtn.classList.add('d-none');
}

function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showContactModal() {
    const modal = new bootstrap.Modal(document.getElementById('contactModal'));
    modal.show();
}

function logout() {
    localStorage.removeItem('authToken');
    currentUser = null;
    updateUIForLoggedOutUser();
    showAlert('Logged out successfully!', 'success');
}

// Form handlers
function setupFormHandlers() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    currentUser = data.user;
                    updateUIForLoggedInUser();
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                    showAlert(`Welcome back, ${data.user.username}!`, 'success');
                    loginForm.reset();
                } else {
                    showAlert(data.message || 'Login failed', 'danger');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'danger');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Registering...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    localStorage.setItem('authToken', data.token);
                    currentUser = data.user;
                    updateUIForLoggedInUser();
                    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                    showAlert(`Welcome, ${data.user.username}! Registration successful.`, 'success');
                    registerForm.reset();
                } else {
                    showAlert(data.message || 'Registration failed', 'danger');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'danger');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const phone = document.getElementById('contactPhone').value;
            const message = document.getElementById('contactMessage').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, phone, message })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    bootstrap.Modal.getInstance(document.getElementById('contactModal')).hide();
                    showAlert('Message sent successfully! We\'ll get back to you soon.', 'success');
                    contactForm.reset();
                } else {
                    showAlert(data.message || 'Failed to send message', 'danger');
                }
            } catch (error) {
                showAlert('Network error. Please try again.', 'danger');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Alert system
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.custom-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show custom-alert`;
    alertDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv) {
            alertDiv.remove();
        }
    }, 5000);
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.card, .accordion-item, .gallery-item, .about-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Form validation enhancement
function addFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('input', function() {
                validateField(this);
            });
            
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
        
        // Password strength indicator for registration
        const passwordInput = form.querySelector('#registerPassword');
        if (passwordInput) {
            addPasswordStrengthIndicator(passwordInput);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing validation classes
    field.classList.remove('is-valid', 'is-invalid');
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Password validation
    if (fieldId.includes('Password') && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters long';
        }
    }
    
    // Phone validation
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Username validation
    if (fieldId.includes('Username') && value) {
        if (value.length < 3) {
            isValid = false;
            errorMessage = 'Username must be at least 3 characters long';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            isValid = false;
            errorMessage = 'Username can only contain letters, numbers, and underscores';
        }
    }
    
    // Apply validation styling
    if (value) {
        field.classList.add(isValid ? 'is-valid' : 'is-invalid');
        
        // Show/hide error message
        let errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (!isValid) {
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.className = 'invalid-feedback';
                field.parentNode.appendChild(errorDiv);
            }
            errorDiv.textContent = errorMessage;
        } else if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    return isValid;
}

function addPasswordStrengthIndicator(passwordInput) {
    const strengthIndicator = document.createElement('div');
    strengthIndicator.className = 'password-strength mt-2';
    strengthIndicator.innerHTML = `
        <div class="progress" style="height: 5px;">
            <div class="progress-bar" role="progressbar" style="width: 0%"></div>
        </div>
        <small class="text-muted">Password strength: <span class="strength-text">Enter password</span></small>
    `;
    
    passwordInput.parentNode.appendChild(strengthIndicator);
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        const progressBar = strengthIndicator.querySelector('.progress-bar');
        const strengthText = strengthIndicator.querySelector('.strength-text');
        
        // Update progress bar
        progressBar.style.width = strength.percentage + '%';
        progressBar.className = `progress-bar bg-${strength.color}`;
        strengthText.textContent = strength.text;
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    if (password.length >= 8) score += 25;
    if (password.match(/[a-z]/)) score += 25;
    if (password.match(/[A-Z]/)) score += 25;
    if (password.match(/[0-9]/)) score += 25;
    if (password.match(/[^a-zA-Z0-9]/)) score += 25;
    
    let strength = {};
    if (score < 50) {
        strength = { percentage: score, color: 'danger', text: 'Weak' };
    } else if (score < 75) {
        strength = { percentage: score, color: 'warning', text: 'Medium' };
    } else {
        strength = { percentage: score, color: 'success', text: 'Strong' };
    }
    
    return strength;
}

// Carousel initialization
function initializeCarousel() {
    const carousel = document.querySelector('#heroCarousel');
    if (carousel) {
        // Pause on hover
        carousel.addEventListener('mouseenter', function() {
            bootstrap.Carousel.getInstance(carousel).pause();
        });
        
        // Resume on leave
        carousel.addEventListener('mouseleave', function() {
            bootstrap.Carousel.getInstance(carousel).cycle();
        });
        
        // Add keyboard navigation
        document.addEventListener('keydown', function(e) {
            const carouselInstance = bootstrap.Carousel.getInstance(carousel);
            if (carouselInstance) {
                if (e.key === 'ArrowLeft') {
                    carouselInstance.prev();
                } else if (e.key === 'ArrowRight') {
                    carouselInstance.next();
                }
            }
        });
    }
}

// Accordion animation enhancement
function initializeAccordion() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon) {
                setTimeout(() => {
                    if (this.classList.contains('collapsed')) {
                        icon.style.transform = 'rotate(0deg)';
                    } else {
                        icon.style.transform = 'rotate(180deg)';
                    }
                }, 100);
            }
        });
    });
}

// Gallery lightbox initialization
function initializeGallery() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            createLightbox(this.src, this.alt);
        });
        
        // Add cursor pointer style
        img.style.cursor = 'pointer';
    });
}

function createLightbox(src, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        z-index: 10001;
        transition: transform 0.2s ease;
    `;
    
    // Add hover effect to close button
    closeBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2)';
    });
    
    closeBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Show lightbox
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
    
    // Close handlers
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        document.body.style.overflow = '';
        setTimeout(() => {
            if (document.body.contains(lightbox)) {
                document.body.removeChild(lightbox);
            }
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Mobile menu initialization
function initializeMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on nav links
        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target)) {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    }
}

// Initialize Bootstrap components
function initializeBootstrapComponents() {
    // Initialize tooltips if any
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(function (tooltipTriggerEl) {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers if any
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.forEach(function (popoverTriggerEl) {
        new bootstrap.Popover(popoverTriggerEl);
    });
}

// Statistics counter animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h4');
    const speed = 200;
    
    counters.forEach(counter => {
        const animate = () => {
            const value = +counter.getAttribute('data-target') || +counter.innerText.replace(/\D/g, '');
            const data = +counter.innerText.replace(/\D/g, '') || 0;
            
            const time = value / speed;
            if (data < value) {
                counter.innerText = Math.ceil(data + time) + '+';
                setTimeout(animate, 1);
            } else {
                counter.innerText = value + '+';
            }
        };
        
        // Set data-target attribute if not present
        if (!counter.getAttribute('data-target')) {
            counter.setAttribute('data-target', counter.innerText.replace(/\D/g, ''));
        }
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Page load optimizations
window.addEventListener('load', function() {
    // Hide loading spinner if exists
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Start counter animations
    animateCounters();
    
    // Lazy load images
    lazyLoadImages();
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimizations
const optimizedScrollHandler = throttle(function() {
    const scrollTop = window.pageYOffset;
    
    // Update navbar background
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(13, 110, 253, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
        }
    }
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && scrollTop < heroSection.offsetHeight) {
        heroSection.style.transform = `translateY(${scrollTop * 0.5}px)`;
    }
}, 16);

// Replace the existing scroll event listener
window.removeEventListener('scroll', function() {});
window.addEventListener('scroll', optimizedScrollHandler);

// Error handling for API calls
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showAlert('An unexpected error occurred. Please try again.', 'danger');
});

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}