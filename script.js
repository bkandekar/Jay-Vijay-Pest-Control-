/**
 * PV Pest Control Services - Main JavaScript
 * Handles: Navigation, Calculator, Booking Modal, Animations
 */

// ============================================
// Configuration & Constants
// ============================================

// WhatsApp Configuration - TODO: Replace with actual WhatsApp number
const WHATSAPP_NUMBER = '919067257872'; // Defaulting to provided phone number with country code

// Base Price Table (in INR)
const BASE_PRICES = {
    // Property Size -> Pest Type -> Price Range [min, max]
    'under-500': {
        'general': [800, 1200],
        'termites': [1500, 2500],
        'cockroaches': [1000, 1500],
        'bed-bugs': [1200, 2000],
        'rodents': [1000, 1800],
        'mosquitoes': [800, 1200],
        'wood-borer': [1500, 2500]
    },
    '500-1000': {
        'general': [1200, 2000],
        'termites': [2500, 4000],
        'cockroaches': [1500, 2500],
        'bed-bugs': [2000, 3500],
        'rodents': [1500, 2500],
        'mosquitoes': [1200, 2000],
        'wood-borer': [2500, 4000]
    },
    '1000-2000': {
        'general': [2000, 3500],
        'termites': [4000, 6000],
        'cockroaches': [2500, 4000],
        'bed-bugs': [3500, 5000],
        'rodents': [2500, 4000],
        'mosquitoes': [2000, 3000],
        'wood-borer': [4000, 6000]
    },
    'over-2000': {
        'general': [3500, 6000],
        'termites': [6000, 10000],
        'cockroaches': [4000, 6000],
        'bed-bugs': [5000, 8000],
        'rodents': [4000, 6000],
        'mosquitoes': [3000, 5000],
        'wood-borer': [6000, 10000]
    }
};

// Property Type Multipliers
const PROPERTY_MULTIPLIERS = {
    'apartment': 1.0,
    'house': 1.0,
    'shop': 1.2,
    'office': 1.3,
    'warehouse': 1.5
};

// AMC Discounts
const AMC_DISCOUNTS = {
    'one-time': 0,
    'quarterly': 10, // 10% discount
    'annual': 20    // 20% discount
};

// ============================================
// DOM Elements
// ============================================

const DOM = {
    // Header & Navigation
    header: document.getElementById('header'),
    navToggle: document.getElementById('nav-toggle'),
    navList: document.querySelector('.nav-list'),
    
    // Booking Buttons
    headerBookBtn: document.getElementById('header-book-btn'),
    heroBookBtn: document.getElementById('hero-book-btn'),
    finalCtaBtn: document.getElementById('final-cta-btn'),
    bookPackageBtn: document.getElementById('book-package-btn'),
    serviceBookBtns: document.querySelectorAll('.btn-book-service'),
    
    // Modal
    modalOverlay: document.getElementById('booking-modal'),
    modal: document.querySelector('.modal'),
    modalClose: document.getElementById('modal-close'),
    bookingForm: document.getElementById('booking-form'),
    
    // Calculator
    calculatorForm: document.getElementById('calculator-form'),
    propertyType: document.getElementById('property-type'),
    propertySize: document.getElementById('property-size'),
    pestConcern: document.getElementById('pest-concern'),
    treatmentFrequency: document.getElementById('treatment-frequency'),
    estimatedCost: document.getElementById('estimated-cost'),
    discountBadge: document.getElementById('discount-badge'),
    
    // Modal Form Fields
    modalName: document.getElementById('modal-name'),
    modalPhone: document.getElementById('modal-phone'),
    modalLocality: document.getElementById('modal-locality'),
    modalPropertyType: document.getElementById('modal-property-type'),
    modalPestConcern: document.getElementById('modal-pest-concern'),
    modalDate: document.getElementById('modal-date'),
    modalNotes: document.getElementById('modal-notes'),
    
    // Error Messages
    nameError: document.getElementById('name-error'),
    phoneError: document.getElementById('phone-error'),
    
    // Redirect Message
    redirectMessage: document.getElementById('redirect-message'),
    
    // Stats Counter
    statNumbers: document.querySelectorAll('.stat-number'),
    
    // Reveal Elements
    revealElements: document.querySelectorAll('.reveal')
};

// ============================================
// Utility Functions
// ============================================

// Format Indian Rupees
function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Animate Number Count-up
function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * easeOutCubic);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('en-IN');
        }
    }
    
    requestAnimationFrame(update);
}

// URL Encode for WhatsApp
function encodeWhatsAppMessage(message) {
    return encodeURIComponent(message);
}

// Validate Phone Number (Indian format)
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/; // Indian 10-digit mobile number
    return phoneRegex.test(phone);
}

// ============================================
// Header & Navigation
// ============================================

function initNavigation() {
    // Mobile Nav Toggle
    if (DOM.navToggle && DOM.navList) {
        DOM.navToggle.addEventListener('click', () => {
            DOM.navToggle.classList.toggle('active');
            DOM.navList.classList.toggle('active');
        });
    }
    
    // Close mobile nav when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            DOM.navToggle?.classList.remove('active');
            DOM.navList?.classList.remove('active');
        });
    });
    
    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            DOM.header?.classList.add('scrolled');
        } else {
            DOM.header?.classList.remove('scrolled');
        }
    });
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Instant Pest Treatment Calculator
// ============================================

let calculatorState = {
    propertyType: '',
    propertySize: '',
    pestConcern: '',
    treatmentFrequency: ''
};

function initCalculator() {
    // Input Change Handlers
    [DOM.propertyType, DOM.propertySize, DOM.pestConcern, DOM.treatmentFrequency].forEach(select => {
        if (select) {
            select.addEventListener('change', (e) => {
                const { id, value } = e.target;
                calculatorState[id] = value;
                calculateEstimate();
            });
        }
    });
    
    // Book Package Button
    if (DOM.bookPackageBtn) {
        DOM.bookPackageBtn.addEventListener('click', () => {
            openModalWithCalculatorData();
        });
    }
}

function calculateEstimate() {
    const { propertyType, propertySize, pestConcern, treatmentFrequency } = calculatorState;
    
    // Check if all required fields are selected
    if (!propertyType || !propertySize || !pestConcern || !treatmentFrequency) {
        DOM.estimatedCost.textContent = 'Select all options to calculate';
        DOM.discountBadge.textContent = '';
        DOM.bookPackageBtn.disabled = true;
        return;
    }
    
    // Get base price
    const sizePrices = BASE_PRICES[propertySize];
    if (!sizePrices || !sizePrices[pestConcern]) {
        DOM.estimatedCost.textContent = 'Invalid selection';
        return;
    }
    
    let [minPrice, maxPrice] = sizePrices[pestConcern];
    
    // Apply property type multiplier
    const multiplier = PROPERTY_MULTIPLIERS[propertyType] || 1.0;
    const multipliedMin = Math.round(minPrice * multiplier);
    const multipliedMax = Math.round(maxPrice * multiplier);
    
    // Apply AMC discount
    const discountPercent = AMC_DISCOUNTS[treatmentFrequency] || 0;
    const discountMultiplier = 1 - (discountPercent / 100);
    
    const finalMin = Math.round(multipliedMin * discountMultiplier);
    const finalMax = Math.round(multipliedMax * discountMultiplier);
    
    // Display estimate with animation
    animateCostDisplay(finalMin, finalMax);
    
    // Display discount badge
    if (discountPercent > 0) {
        DOM.discountBadge.textContent = `Save ${discountPercent}% with AMC`;
    } else {
        DOM.discountBadge.textContent = '';
    }
    
    // Enable book button
    DOM.bookPackageBtn.disabled = false;
}

function animateCostDisplay(min, max) {
    const currentText = DOM.estimatedCost.textContent;
    
    // Only animate if we have a previous range
    if (currentText.includes('₹')) {
        // Simple fade animation
        DOM.estimatedCost.style.opacity = '0';
        setTimeout(() => {
            DOM.estimatedCost.textContent = `${formatINR(min)} – ${formatINR(max)}`;
            DOM.estimatedCost.style.opacity = '1';
        }, 200);
    } else {
        // First time - just set
        DOM.estimatedCost.textContent = `${formatINR(min)} – ${formatINR(max)}`;
    }
}

function openModalWithCalculatorData() {
    const { propertyType, propertySize, pestConcern, treatmentFrequency } = calculatorState;
    
    // Map calculator values to modal values
    const propertyTypeMap = {
        'apartment': 'Apartment',
        'house': 'Independent House',
        'shop': 'Shop',
        'office': 'Office',
        'warehouse': 'Warehouse'
    };
    
    const pestConcernMap = {
        'general': 'General Pests',
        'termites': 'Termites',
        'cockroaches': 'Cockroaches',
        'bed-bugs': 'Bed Bugs',
        'rodents': 'Rodents',
        'mosquitoes': 'Mosquitoes',
        'wood-borer': 'Wood Borer'
    };
    
    // Pre-fill modal fields
    if (propertyType) {
        DOM.modalPropertyType.value = propertyTypeMap[propertyType] || '';
    }
    if (pestConcern) {
        DOM.modalPestConcern.value = pestConcernMap[pestConcern] || '';
    }
    
    // Open modal
    openModal();
}

// ============================================
// Booking Modal
// ============================================

function initModal() {
    // Open Modal Handlers
    const openModalHandlers = [
        DOM.headerBookBtn,
        DOM.heroBookBtn,
        DOM.finalCtaBtn,
        ...DOM.serviceBookBtns
    ];
    
    openModalHandlers.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Pre-fill service if coming from service card
                if (btn.dataset.service) {
                    DOM.modalPestConcern.value = btn.dataset.service;
                }
                
                openModal();
            });
        }
    });
    
    // Close Modal Handlers
    if (DOM.modalClose) {
        DOM.modalClose.addEventListener('click', closeModal);
    }
    
    if (DOM.modalOverlay) {
        DOM.modalOverlay.addEventListener('click', (e) => {
            if (e.target === DOM.modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && DOM.modalOverlay.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Form Submission
    if (DOM.bookingForm) {
        DOM.bookingForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Real-time Validation
    if (DOM.modalName) {
        DOM.modalName.addEventListener('blur', () => validateField('name'));
        DOM.modalName.addEventListener('input', () => clearError('name'));
    }
    
    if (DOM.modalPhone) {
        DOM.modalPhone.addEventListener('blur', () => validateField('phone'));
        DOM.modalPhone.addEventListener('input', () => clearError('phone'));
    }
}

function openModal() {
    DOM.modalOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    DOM.modalOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    DOM.bookingForm?.reset();
    clearError('name');
    clearError('phone');
}

function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    switch (field) {
        case 'name':
            if (!DOM.modalName.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your full name';
            }
            break;
            
        case 'phone':
            if (!DOM.modalPhone.value.trim()) {
                isValid = false;
                errorMessage = 'Please enter your phone number';
            } else if (!validatePhone(DOM.modalPhone.value.trim())) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit Indian mobile number';
            }
            break;
    }
    
    if (!isValid) {
        showError(field, errorMessage);
    } else {
        clearError(field);
    }
    
    return isValid;
}

function showError(field, message) {
    const errorElement = field === 'name' ? DOM.nameError : DOM.phoneError;
    const inputElement = field === 'name' ? DOM.modalName : DOM.modalPhone;
    
    if (errorElement) {
        errorElement.textContent = message;
    }
    if (inputElement) {
        inputElement.classList.add('error');
    }
}

function clearError(field) {
    const errorElement = field === 'name' ? DOM.nameError : DOM.phoneError;
    const inputElement = field === 'name' ? DOM.modalName : DOM.modalPhone;
    
    if (errorElement) {
        errorElement.textContent = '';
    }
    if (inputElement) {
        inputElement.classList.remove('error');
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate required fields
    const isNameValid = validateField('name');
    const isPhoneValid = validateField('phone');
    
    if (!isNameValid || !isPhoneValid) {
        return;
    }
    
    // Collect form data
    const formData = {
        name: DOM.modalName.value.trim(),
        phone: DOM.modalPhone.value.trim(),
        locality: DOM.modalLocality.value.trim(),
        propertyType: DOM.modalPropertyType.value,
        pestConcern: DOM.modalPestConcern.value,
        date: DOM.modalDate.value,
        notes: DOM.modalNotes.value.trim()
    };
    
    // Construct WhatsApp message
    const message = constructWhatsAppMessage(formData);
    
    // Show redirecting message
    showRedirectingMessage();
    
    // Redirect to WhatsApp after a short delay
    setTimeout(() => {
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeWhatsAppMessage(message)}`;
        window.location.href = whatsappUrl;
    }, 1500);
}

function constructWhatsAppMessage(formData) {
    const lines = [
        `📋 *New Pest Control Booking Request*`,
        ``,
        `👤 *Customer Name:* ${formData.name}`,
        `📞 *Phone:* ${formData.phone}`,
        formData.locality ? `📍 *Locality:* ${formData.locality}` : '',
        formData.propertyType ? `🏠 *Property Type:* ${formData.propertyType}` : '',
        formData.pestConcern ? `🐜 *Pest Concern:* ${formData.pestConcern}` : '',
        formData.date ? `📅 *Preferred Date:* ${formData.date}` : '',
        formData.notes ? `📝 *Notes:* ${formData.notes}` : '',
        ``,
        `*Source:* PV Pest Control Services Website`,
        `*Timestamp:* ${new Date().toLocaleString('en-IN')}`
    ].filter(line => line.trim() !== '');
    
    return lines.join('\n');
}

function showRedirectingMessage() {
    closeModal();
    DOM.redirectMessage?.classList.add('active');
}

// ============================================
// Stats Counter Animation
// ============================================

function initStatsCounter() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateNumber(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    DOM.statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ============================================
// Scroll Reveal Animations
// ============================================

function initScrollReveal() {
    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    // Add reveal class to elements that should animate in
    const revealSelectors = [
        '.pain-card',
        '.service-card',
        '.stat-card',
        '.feature-card',
        '.process-step',
        '.testimonial-card',
        '.gallery-item',
        '.section-header'
    ];
    
    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    });
}

// ============================================
// Service Card Hover Effect
// ============================================

function initServiceCardEffects() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ============================================
// Initialize Everything
// ============================================

function init() {
    // Core Features
    initNavigation();
    initCalculator();
    initModal();
    initStatsCounter();
    
    // Enhancements
    initScrollReveal();
    initServiceCardEffects();
    
    console.log('🛡️ PV Pest Control Services - Website Initialized');
    console.log(`WhatsApp Number: ${WHATSAPP_NUMBER}`);
    console.log('TODO: Replace WhatsApp number in script.js if needed');
}

// Run on DOM Load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// Export for Testing (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateEstimate,
        validatePhone,
        formatINR,
        constructWhatsAppMessage
    };
}
