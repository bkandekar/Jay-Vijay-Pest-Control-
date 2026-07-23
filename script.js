/* ==========================================================================
   JAY VIJAY PEST CONTROL - MAIN JAVASCRIPT
   - Sticky Header & Shadow
   - Mobile Menu Toggle
   - FAQ Accordion
   - Service Dropdown Auto-Selection
   - Lead Form Validation & WhatsApp Redirect
   - Google Analytics 4 (GA4) Event Tracking
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // --------------------------------------------------------------------------
    // 1. STICKY HEADER WITH SHADOW ON SCROLL
    // --------------------------------------------------------------------------
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --------------------------------------------------------------------------
    // 2. MOBILE MENU TOGGLE & ACTIVE LINK HIGHLIGHT
    // --------------------------------------------------------------------------
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu on link click & update active link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
                if (mobileToggle) {
                    const icon = mobileToggle.querySelector('i');
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --------------------------------------------------------------------------
    // 3. FAQ ACCORDION TOGGLE
    // --------------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close other open FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --------------------------------------------------------------------------
    // 4. SERVICE & PACKAGE AUTO-SELECTION IN LEAD FORM
    // --------------------------------------------------------------------------
    const serviceSelect = document.getElementById('service');
    const bookLinks = document.querySelectorAll('.service-book-link');
    const packageBtns = document.querySelectorAll('.select-package-btn');

    function preselectService(serviceName) {
        if (!serviceSelect || !serviceName) return;

        // Find exact or partial match in option values
        for (let i = 0; i < serviceSelect.options.length; i++) {
            const option = serviceSelect.options[i];
            if (option.value.toLowerCase().includes(serviceName.toLowerCase()) || 
                serviceName.toLowerCase().includes(option.value.toLowerCase())) {
                serviceSelect.selectedIndex = i;
                break;
            }
        }
    }

    bookLinks.forEach(link => {
        link.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');
            preselectService(serviceName);
        });
    });

    packageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const packageName = this.getAttribute('data-package');
            preselectService(packageName);
        });
    });

    // --------------------------------------------------------------------------
    // 5. GA4 ANALYTICS & WHATSAPP BUTTON TRACKING
    // --------------------------------------------------------------------------
    const floatingWhatsapp = document.getElementById('floatingWhatsapp');
    const heroWhatsappBtn = document.getElementById('heroWhatsappBtn');

    function trackWhatsappClick(source) {
        // Fire GA4 Event
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'whatsapp_button_click', {
                'event_category': 'engagement',
                'event_label': source || 'Floating WhatsApp Button'
            });
        }
    }

    if (floatingWhatsapp) {
        floatingWhatsapp.addEventListener('click', function() {
            trackWhatsappClick('Floating WhatsApp Button');
        });
    }

    if (heroWhatsappBtn) {
        heroWhatsappBtn.addEventListener('click', function() {
            trackWhatsappClick('Hero Section WhatsApp CTA');
        });
    }

    // --------------------------------------------------------------------------
    // 6. LEAD FORM VALIDATION & WHATSAPP REDIRECT LOGIC
    // --------------------------------------------------------------------------
    const leadForm = document.getElementById('leadForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const messageInput = document.getElementById('message');

    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            let isValid = true;

            // Clear previous error states
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('invalid');
            });

            // Validate Name
            const nameVal = nameInput ? nameInput.value.trim() : '';
            if (!nameVal) {
                document.getElementById('nameError').parentElement.classList.add('invalid');
                isValid = false;
            }

            // Validate Phone (10-15 digits, spaces, +, -, ())
            const phoneVal = phoneInput ? phoneInput.value.trim() : '';
            const phoneRegex = /^[0-9\s\+\-\(\)]{10,15}$/;
            if (!phoneVal || !phoneRegex.test(phoneVal)) {
                document.getElementById('phoneError').parentElement.classList.add('invalid');
                isValid = false;
            }

            // Validate Address
            const addressVal = addressInput ? addressInput.value.trim() : '';
            if (!addressVal) {
                document.getElementById('addressError').parentElement.classList.add('invalid');
                isValid = false;
            }

            // Validate Service Selection
            const serviceVal = serviceSelect ? serviceSelect.value : '';
            if (!serviceVal) {
                document.getElementById('serviceError').parentElement.classList.add('invalid');
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Fire GA4 booking_form_submit event
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'booking_form_submit', {
                    'service_needed': serviceVal,
                    'customer_area': addressVal,
                    'event_category': 'lead_conversion'
                });
            }

            // Construct WhatsApp Redirect URL
            // Target Phone Number: +91 98230 12345 (replace with client's real number)
            const whatsappPhoneNumber = '919823012345';
            const optionalMsgVal = messageInput ? messageInput.value.trim() : '';

            let formattedMsg = `Hi, I want pest control service.\n`;
            formattedMsg += `Name: ${nameVal}\n`;
            formattedMsg += `Address: ${addressVal}\n`;
            formattedMsg += `Service Needed: ${serviceVal}\n`;
            formattedMsg += `Phone: ${phoneVal}`;

            if (optionalMsgVal) {
                formattedMsg += `\nNote: ${optionalMsgVal}`;
            }

            const encodedMessage = encodeURIComponent(formattedMsg);
            const redirectUrl = `https://wa.me/${whatsappPhoneNumber}?text=${encodedMessage}`;

            /* NOTE FOR FUTURE DEVELOPERS / MAINTENANCE:
             * To connect a backend service (like Formspree or custom API) later:
             * 1. Send an asynchronous fetch() POST request to your endpoint here.
             * 2. e.g. await fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: new FormData(leadForm) });
             * 3. Then perform window.open(redirectUrl, '_blank') to complete WhatsApp handoff.
             */

            // Redirect user in a new tab
            window.open(redirectUrl, '_blank');

            // Reset form fields
            leadForm.reset();
        });
    }
});
