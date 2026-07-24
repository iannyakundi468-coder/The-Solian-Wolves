/* ==========================================================================
   THE SOLIAN WOLVES SOFTWARE COMPANY - MASTER PRODUCTION JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Navigation & Scroll Handler ---
    const nav = document.querySelector('.main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }, { passive: true });
    }

    // --- 2. Mobile Nav Menu Drawer ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            const isActive = navLinks.classList.contains('active');
            mobileMenuBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            mobileMenuBtn.innerHTML = isActive ? `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>` : `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>`;
        });

        // Close mobile nav when clicking outside or clicking a nav link
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- 3. Dynamic Typing Animation in Hero ---
    const typingTextElement = document.getElementById('typing-text');
    if (typingTextElement) {
        const words = [
            { text: "Digital Systems", color: "#fbbf24" },
            { text: "Custom ERP & SaaS", color: "#3b82f6" },
            { text: "Mobile Applications", color: "#10b981" },
            { text: "AI Automation Pipelines", color: "#8b5cf6" },
            { text: "High-Volume Platforms", color: "#ec4899" }
        ];

        let wordIndex = 0;
        let charIndex = words[0].text.length;
        let isDeleting = true;

        function typeEffect() {
            const currentItem = words[wordIndex];
            const currentWord = currentItem.text;

            if (isDeleting) {
                typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            typingTextElement.style.color = currentItem.color;

            let typeSpeed = isDeleting ? 40 : 80;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2200; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 400; // Pause before typing new word
            }

            setTimeout(typeEffect, typeSpeed);
        }

        setTimeout(typeEffect, 1000);
    }

    // --- 4. Interactive Project Scope & ROI Calculator Widget ---
    const scopeUsersSlider = document.getElementById('calc-users');
    const scopeComplexitySelect = document.getElementById('calc-complexity');

    const outEstTimeline = document.getElementById('out-timeline');
    const outEstHoursSaved = document.getElementById('out-hours-saved');
    const outEstBudget = document.getElementById('out-budget');

    function calculateROI() {
        if (!scopeUsersSlider || !scopeComplexitySelect || !outEstTimeline || !outEstHoursSaved || !outEstBudget) return;

        const users = parseInt(scopeUsersSlider.value, 10) || 10;
        const multiplier = parseFloat(scopeComplexitySelect.value) || 1.0;

        const valUsersDisplay = document.getElementById('val-users-display');
        if (valUsersDisplay) valUsersDisplay.textContent = `${users} Users`;

        // Mathematical modeling
        const baseHoursSavedPerUser = 14; // hours/month
        const totalHoursSavedMonthly = Math.round(users * baseHoursSavedPerUser * (multiplier * 0.8));

        let weeks = Math.round(4 + (users * 0.15) * multiplier);
        if (weeks > 24) weeks = 24;

        let baseCost = Math.round((2500 + (users * 150) * multiplier) / 500) * 500;
        if (baseCost < 3000) baseCost = 3000;

        outEstTimeline.textContent = `${weeks} Weeks`;
        outEstHoursSaved.textContent = `${totalHoursSavedMonthly.toLocaleString()} hrs/mo`;
        outEstBudget.textContent = `$${baseCost.toLocaleString()}`;
    }

    if (scopeUsersSlider && scopeComplexitySelect) {
        scopeUsersSlider.addEventListener('input', calculateROI);
        scopeComplexitySelect.addEventListener('change', calculateROI);
        calculateROI(); // Initial run
    }

    // --- 5. Modal Consultation System ---
    const modalOverlay = document.getElementById('consultation-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTriggers = document.querySelectorAll('.pricing-trigger, .open-modal');

    function openModal(serviceName = '') {
        if (!modalOverlay) return;
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        const serviceInput = document.getElementById('modal-service-input');
        if (serviceInput && serviceName) {
            serviceInput.value = serviceName;
        }
    }

    function closeModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const href = trigger.getAttribute('href');
            if (href === '#contact' || trigger.classList.contains('open-modal')) {
                const service = trigger.getAttribute('data-service') || '';
                openModal(service);
            }
        });
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // --- 6. Scroll Reveal Observer ---
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));

    // --- 7. Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.startsWith('#modal')) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 8. Contact Form Handler ---
    const contactForm = document.getElementById('main-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Engineering Request Transmitted...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('Thank you! Your project consultation request has been received. Our solutions architect will respond within 12 hours.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    closeModal();
                }, 1000);
            }
        });
    }
});
