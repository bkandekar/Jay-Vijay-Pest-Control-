/**
 * JAY VIJAY PEST CONTROL - CORE INTERACTIVE ENGINE
 * Features: Multi-Theme Switcher, Instant Calculator, Design Customizer Drawer,
             Interactive Pest Risk Radar, Draggable Before/After Slider, Modal Manager
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. LIVE THEME SWITCHER & DESIGN DRAWER LOGIC
    // ==========================================
    const drawerOverlay = document.getElementById('designDrawerOverlay');
    const drawerCloseBtn = document.getElementById('drawerCloseBtn');
    const themeTriggers = document.querySelectorAll('.theme-trigger-btn');
    const themeOptions = document.querySelectorAll('.theme-card-option');

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('jv_pest_theme') || 'theme-urban-guard';
    applyTheme(savedTheme);

    function applyTheme(themeName) {
        document.body.classList.remove('theme-urban-guard', 'theme-bio-eco', 'theme-cyber-shield', 'theme-luxury-gold');
        document.body.classList.add(themeName);
        localStorage.setItem('jv_pest_theme', themeName);

        // Active state on drawer cards
        themeOptions.forEach(opt => {
            if (opt.dataset.theme === themeName) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    themeTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            if (drawerOverlay) {
                drawerOverlay.classList.add('active');
            }
        });
    });

    if (drawerCloseBtn) {
        drawerCloseBtn.addEventListener('click', () => {
            if (drawerOverlay) drawerOverlay.classList.remove('active');
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', (e) => {
            if (e.target === drawerOverlay) {
                drawerOverlay.classList.remove('active');
            }
        });
    }

    themeOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const theme = opt.dataset.theme;
            applyTheme(theme);
        });
    });

    // ==========================================
    // 1. INSTANT PEST TREATMENT CALCULATOR LOGIC
    // ==========================================
    
    // State variables
    let selectedProperty = { name: '1 BHK', base: 0 };
    let selectedServices = [
        { name: 'Cockroach', price: 1499 }
    ];
    let selectedPlan = { name: 'Single Visit', discount: 0 };

    const propertyGroup = document.getElementById('propertyTypeGroup');
    const pestGroup = document.getElementById('pestServicesGroup');
    const planGroup = document.getElementById('planTypeGroup');
    
    const calcTotalDisplay = document.getElementById('calcTotalDisplay');
    const calcSummaryText = document.getElementById('calcSummaryText');
    const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

    // Property Type selection listener
    if (propertyGroup) {
        propertyGroup.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                propertyGroup.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                selectedProperty = {
                    name: btn.dataset.type,
                    base: parseInt(btn.dataset.base, 10)
                };
                updateCalculatorTotal();
            });
        });
    }

    // Pest Service multi-selection listener
    if (pestGroup) {
        pestGroup.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const serviceName = btn.dataset.service;
                const price = parseInt(btn.dataset.price, 10);

                if (btn.classList.contains('active')) {
                    if (selectedServices.length > 1) {
                        btn.classList.remove('active');
                        selectedServices = selectedServices.filter(s => s.name !== serviceName);
                    }
                } else {
                    btn.classList.add('active');
                    selectedServices.push({ name: serviceName, price: price });
                }
                updateCalculatorTotal();
            });
        });
    }

    // Service Plan selection listener
    if (planGroup) {
        planGroup.querySelectorAll('.pill-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                planGroup.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                selectedPlan = {
                    name: btn.dataset.plan,
                    discount: parseFloat(btn.dataset.discount)
                };
                updateCalculatorTotal();
            });
        });
    }

    // Recalculate Total and Animate Price Display
    function updateCalculatorTotal() {
        if (!calcTotalDisplay) return;
        const pestTotal = selectedServices.reduce((sum, item) => sum + item.price, 0);
        const subtotal = selectedProperty.base + pestTotal;
        const discountAmount = subtotal * selectedPlan.discount;
        const finalTotal = Math.round(subtotal - discountAmount);

        animateValue(calcTotalDisplay, parseInt(calcTotalDisplay.innerText.replace(/,/g, ''), 10) || 0, finalTotal, 400);

        const pestNames = selectedServices.map(s => s.name).join(', ');
        const planLabel = selectedPlan.discount > 0 ? `${selectedPlan.name} (20% OFF)` : selectedPlan.name;
        if (calcSummaryText) {
            calcSummaryText.innerText = `${selectedProperty.name} • ${pestNames} • ${planLabel}`;
        }
    }

    function animateValue(element, start, end, duration) {
        if (start === end) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentVal = Math.floor(progress * (end - start) + start);
            element.innerText = currentVal.toLocaleString('en-IN');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // WhatsApp Redirect for Calculator
    if (calcWhatsAppBtn) {
        calcWhatsAppBtn.addEventListener('click', () => {
            const pestNames = selectedServices.map(s => s.name).join(', ');
            const finalPrice = calcTotalDisplay ? calcTotalDisplay.innerText : '1,499';
            
            const message = `Hi Jay Vijay Pest Control, I generated an instant estimate on your website:%0A%0A` +
                            `🏠 *Property:* ${selectedProperty.name}%0A` +
                            `🪲 *Pest Services:* ${pestNames}%0A` +
                            `📋 *Plan:* ${selectedPlan.name}%0A` +
                            `💰 *Estimated Price:* ₹${finalPrice}%0A%0A` +
                            `Please confirm my booking inspection time!`;

            if (typeof gtag === 'function') {
                gtag('event', 'calculator_completed', {
                    'property_type': selectedProperty.name,
                    'estimated_price': finalPrice,
                    'services': pestNames
                });
            }

            window.open(`https://wa.me/918329931123?text=${message}`, '_blank');
        });
    }

    updateCalculatorTotal();

    // ==========================================
    // 2. INTERACTIVE DRAGGABLE BEFORE/AFTER SLIDER
    // ==========================================
    const sliderContainer = document.getElementById('beforeAfterContainer');
    const beforeLayer = document.getElementById('beforeLayer');
    const sliderHandle = document.getElementById('sliderHandle');

    if (sliderContainer && beforeLayer && sliderHandle) {
        let isDragging = false;

        const updateSliderPosition = (clientX) => {
            const rect = sliderContainer.getBoundingClientRect();
            let offsetX = clientX - rect.left;
            if (offsetX < 0) offsetX = 0;
            if (offsetX > rect.width) offsetX = rect.width;

            const percentage = (offsetX / rect.width) * 100;
            beforeLayer.style.width = `${percentage}%`;
            sliderHandle.style.left = `${percentage}%`;
        };

        sliderContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            updateSliderPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Touch support
        sliderContainer.addEventListener('touchstart', (e) => {
            isDragging = true;
            if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
        });

        window.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            if (e.touches[0]) updateSliderPosition(e.touches[0].clientX);
        });

        window.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    // ==========================================
    // 3. INTERACTIVE PEST RISK RADAR & TABS
    // ==========================================
    const radarCards = document.querySelectorAll('.radar-card');
    radarCards.forEach(card => {
        card.addEventListener('click', () => {
            radarCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const pestName = card.dataset.pest;
            const bookBtn = card.querySelector('.open-modal-btn');
            if (!bookBtn) {
                openModal(`${pestName} Eradication Treatment`);
            }
        });
    });

    // ==========================================
    // 4. REUSABLE BOOK NOW MODAL MANAGER
    // ==========================================
    const modalOverlay = document.getElementById('bookModalOverlay');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBookingForm = document.getElementById('modalBookingForm');
    const modalServiceInput = document.getElementById('modalService');

    document.querySelectorAll('.open-modal-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = btn.dataset.service || 'General Pest Control';
            openModal(serviceName);
        });
    });

    function openModal(serviceName) {
        if (modalServiceInput) {
            modalServiceInput.value = serviceName;
        }
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    if (modalBookingForm) {
        modalBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('modalName').value.trim();
            const phone = document.getElementById('modalPhone').value.trim();
            const service = document.getElementById('modalService').value.trim();
            const address = document.getElementById('modalAddress').value.trim();
            const date = document.getElementById('modalDate').value;

            let isValid = true;
            if (!name) { showError('modalName'); isValid = false; } else { clearError('modalName'); }
            if (!phone || !/^[6-9]\d{9}$/.test(phone)) { showError('modalPhone'); isValid = false; } else { clearError('modalPhone'); }
            if (!address) { showError('modalAddress'); isValid = false; } else { clearError('modalAddress'); }

            if (!isValid) return;

            const formattedMsg = `Hi, I want to book a pest control service.%0A` +
                                 `👤 *Name:* ${encodeURIComponent(name)}%0A` +
                                 `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +
                                 `🪲 *Service:* ${encodeURIComponent(service)}%0A` +
                                 `📍 *Address:* ${encodeURIComponent(address)}` +
                                 (date ? `%0A📅 *Preferred Date:* ${encodeURIComponent(date)}` : '');

            window.open(`https://wa.me/918329931123?text=${formattedMsg}`, '_blank');
            closeModal();
            modalBookingForm.reset();
        });
    }

    // ==========================================
    // 5. CONTACT LEAD FORM VALIDATION
    // ==========================================
    const contactLeadForm = document.getElementById('contactLeadForm');
    if (contactLeadForm) {
        contactLeadForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const phone = document.getElementById('contactPhone').value.trim();
            const service = document.getElementById('contactService').value;
            const address = document.getElementById('contactAddress').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            let isValid = true;
            if (!name) { showError('contactName'); isValid = false; } else { clearError('contactName'); }
            if (!phone || !/^[6-9]\d{9}$/.test(phone)) { showError('contactPhone'); isValid = false; } else { clearError('contactPhone'); }
            if (!service) { showError('contactService'); isValid = false; } else { clearError('contactService'); }
            if (!address) { showError('contactAddress'); isValid = false; } else { clearError('contactAddress'); }

            if (!isValid) return;

            const formattedMsg = `Hi Jay Vijay Pest Control, I would like to request a free site quote:%0A` +
                                 `👤 *Name:* ${encodeURIComponent(name)}%0A` +
                                 `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +
                                 `🪲 *Service:* ${encodeURIComponent(service)}%0A` +
                                 `📍 *Address:* ${encodeURIComponent(address)}` +
                                 (message ? `%0A💬 *Message:* ${encodeURIComponent(message)}` : '');

            window.open(`https://wa.me/918329931123?text=${formattedMsg}`, '_blank');
            contactLeadForm.reset();
        });
    }

    function showError(inputId) {
        const input = document.getElementById(inputId);
        if (input && input.parentElement) input.parentElement.classList.add('has-error');
    }

    function clearError(inputId) {
        const input = document.getElementById(inputId);
        if (input && input.parentElement) input.parentElement.classList.remove('has-error');
    }

    // Sticky Header
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }
    });

    // Stats Counter Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedStats) {
                    animatedStats = true;
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.target, 10);
                        animateValue(stat, 0, target, 1500);
                    });
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-bar-section');
        if (statsSection) statsObserver.observe(statsSection);
    }
});
