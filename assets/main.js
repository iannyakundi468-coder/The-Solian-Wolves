document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global/Shared Variables ---
    // Contact Form Logic
    const contactEmail = document.getElementById('contact-email');
    const additionalFields = document.getElementById('contact-additional-fields');
    const contactSubmit = document.getElementById('contact-submit');

    // --- 2. Contact Form Handler (Multi-step) ---
    if (contactEmail && additionalFields) {
        contactEmail.addEventListener('focus', () => {
            if (additionalFields.style.display === 'none') {
                additionalFields.style.display = 'flex';
                // Small timeout to allow display:flex to apply before transition
                setTimeout(() => {
                    additionalFields.style.opacity = '1';
                    additionalFields.style.transform = 'translateY(0)';
                }, 10);
                if (contactSubmit) contactSubmit.innerText = 'Submit Request';
            }
        });

        // Also reveal on input just in case
        contactEmail.addEventListener('input', () => {
            if (additionalFields.style.display === 'none' && contactEmail.value.includes('@')) {
                additionalFields.style.display = 'flex';
                setTimeout(() => {
                    additionalFields.style.opacity = '1';
                    additionalFields.style.transform = 'translateY(0)';
                }, 10);
                if (contactSubmit) contactSubmit.innerText = 'Submit Request';
            }
        });
    }

    // --- 3. Navigation Helpers ---

    function smoothScrollTo(targetId) {
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 100; // Offset for fixed nav
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Handle initial hash on load
    if (window.location.hash) {
        // Delay slightly to ensure layout is stable
        setTimeout(() => {
            smoothScrollTo(window.location.hash);
        }, 300);
    }

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const targetId = href.startsWith('/#') ? href.substring(1) : href;

            if (targetId === '#' || targetId === '') return;

            // If on home page and clicking a home anchor, scroll smooth
            if (window.location.pathname === '/' || window.location.pathname === '/index' || window.location.pathname === '') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    smoothScrollTo(targetId);
                }
            }
            // Otherwise follow the link naturally to the home page where the hash logic will take over
        }, { passive: false });
    });

    // Handle Pricing Triggers (Legacy support for "Contact Us" buttons)
    document.querySelectorAll('.pricing-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceKey = btn.getAttribute('data-service');
            // If it's a direct link to #contact, let smooth scroll handle it
            if (btn.getAttribute('href') === '#contact') {
                // smooth scroll listener above catches it
                return;
            }

            // Otherwise, if it's supposed to do something else, we redirect to contact
            // but currently most are set to href="#contact"
        });
    });


    // --- 4. Page Animations & Observers (INP Optimized) ---

    // Observer Logic - Optimized for INP (yield to main thread)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px' // Start slightly before entering viewport
    };

    const observer = new IntersectionObserver((entries) => {
        // Process entries in smaller batches to avoid long tasks
        requestAnimationFrame(() => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once visible to save CPU
                }
            });
        });
    }, observerOptions);

    // Initialize observer in a background task (Idle)
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            const animateElements = document.querySelectorAll('.animate-on-scroll');
            animateElements.forEach(el => observer.observe(el));
        });
    } else {
        setTimeout(() => {
            const animateElements = document.querySelectorAll('.animate-on-scroll');
            animateElements.forEach(el => observer.observe(el));
        }, 100);
    }

});
