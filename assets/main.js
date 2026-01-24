document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global/Shared Variables (initialized only after DOM is ready) ---
    const modal = document.getElementById('service-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalExpectations = document.getElementById('modal-expectations');
    const modalPrice = document.getElementById('modal-price');
    const paymentSelection = document.getElementById('payment-selection');
    const btnContactCustom = document.getElementById('btn-contact-custom');

    const modalCtaLink = document.getElementById('modal-cta-link');

    let currentService = null;

    // Mapping of service keys to their Shopify Product handles/URLs
    const serviceUrls = {
        'audit': '/products/deep-dive-audit',
        'web-dev': '/products/full-cycle-website-development',
        'cro': '/products/growth-partner-cro',
        'seo': '/products/seo-listings',
        'apps': '/products/custom-app-development',
        'free-audit': '#contact'
    };

    // Helper to get Shopify data or fallback to hardcoded
    function getProductData(handle, fallback) {
        const shopifyData = window.ShopifyProductData && window.ShopifyProductData[handle];
        if (shopifyData) {
            // Construct direct checkout link if variantId exists
            const checkoutLink = shopifyData.variantId ? `/cart/${shopifyData.variantId}:1` : shopifyData.url;
            return {
                title: shopifyData.title,
                desc: shopifyData.desc || fallback.desc,
                price: shopifyData.price,
                link: checkoutLink
            };
        }
        return fallback;
    }

    const serviceData = {
        audit: getProductData('deep-dive-audit', {
            title: "Deep Dive Audit",
            desc: "A surgical analysis of your digital presence. We find where you're bleeding money.",
            price: "$997 (Limited Offer)",
            link: serviceUrls.audit
        }),
        'web-dev': getProductData('web-dev', {
            title: "Full-Cycle Website Development",
            desc: "Custom-built revenue engines from concept to deployment. Optimized for sub-second speed and global scale.",
            price: "Custom Quote",
            link: serviceUrls['web-dev']
        }),
        cro: getProductData('growth-partner-cro', {
            title: "Growth Partner (CRO)",
            desc: "Continuous testing and optimization to maximize your Revenue Per User.",
            price: "$4,500/mo",
            link: serviceUrls.cro
        }),
        seo: getProductData('seo-listings', {
            title: "SEO Listings",
            desc: "Climb the rankings and own your niche with technical and content SEO.",
            price: "$2,500/mo",
            link: serviceUrls.seo
        }),
        apps: getProductData('custom-app-development', {
            title: "Custom App Development",
            desc: "Bespoke software solutions to solve unique business problems.",
            price: "Custom",
            link: serviceUrls.apps
        }),
        'free-audit': {
            title: "Free One-Time Audit",
            desc: "A complimentary high-level review to identify immediate opportunities for improvement.",
            price: "Free",
            link: serviceUrls['free-audit']
        }
    };

    // Keep expectations hardcoded for now as they are not in the product description
    const serviceExpectations = {
        audit: [
            "Comprehensive UX/UI Audit",
            "Performance & Speed Analysis",
            "SEO Gap Analysis & Keyword Blueprint",
            "Competitor Benchmark Report",
            "Accessibility (a11y) Compliance Check",
            "Tech Stack Modernization Roadmap",
            "Free 30-min Strategy Call"
        ],
        'web-dev': [
            "Conceptual Architecture & UX Prototyping",
            "Premium Design Systems & UI Excellence",
            "High-Performance Engineering (Next.js/Shopify)",
            "Global Multi-Currency & Language Setup",
            "Continuous Integration & Deployment (CI/CD)",
            "Post-Launch Technical Support (24/7)"
        ],
        cro: [
            "Everything in Deep Dive Audit",
            "Monthly A/B Testing Regime",
            "Heatmap & User Behavior Analysis",
            "Funnel & Checkout Optimization",
            "Cart Abandonment Recovery Tuning",
            "Weekly Tactical Strategy Syncs",
            "Dedicated Project Manager"
        ],
        seo: [
            "Keyword Strategy & Gap Analysis",
            "Technical SEO Fixes (Schema/Speed)",
            "Backlink Profile Analysis",
            "Rich Snippets Implementation"
        ],
        apps: [
            "Full-Stack Development Team (24/7)",
            "Custom App & SaaS Architecture",
            "Headless & Headless API Integration",
            "Enterprise Security Hardening",
            "Infrastructure & Database Tuning",
            "Unlimited UI/UX Design Requests",
            "White-label Analytics Dashboard"
        ],
        'free-audit': [
            "Basic Speed Check",
            "UX Quick Win Report",
            "SEO Health Check",
            "3 Actionable Tips"
        ]
    };

    // --- 2. Helper Functions ---

    function resetModalViews() {
        if (!paymentSelection) return;
        paymentSelection.style.display = 'flex';
        if (modalCtaLink) modalCtaLink.style.display = 'flex';
        if (btnContactCustom) btnContactCustom.style.display = 'none';
    }

    function openServiceModal(serviceKey) {
        if (!serviceKey || !serviceData[serviceKey] || !modal) return;

        const data = serviceData[serviceKey];
        currentService = data;

        // Batch DOM updates before showing modal
        if (modalTitle) modalTitle.innerText = data.title;
        if (modalDesc) modalDesc.innerText = data.desc;
        if (modalPrice) modalPrice.innerText = data.price;

        const expectations = serviceExpectations[serviceKey] || [];
        if (modalExpectations) {
            const fragment = document.createDocumentFragment();
            expectations.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span style="color: #3b82f6; margin-right: 0.5rem;">✓</span> ${item}`;
                li.style.marginBottom = '0.5rem';
                fragment.appendChild(li);
            });
            modalExpectations.innerHTML = '';
            modalExpectations.appendChild(fragment);
        }

        resetModalViews();

        // Handle Custom / Free / Normal Link Logic
        const buyButtonContainer = document.getElementById('buy-button-container');
        if (serviceKey === 'cro') {
            if (modalCtaLink) modalCtaLink.style.display = 'none';
            if (btnContactCustom) btnContactCustom.style.display = 'none';
            if (buyButtonContainer) buyButtonContainer.style.display = 'block';
        } else {
            if (buyButtonContainer) buyButtonContainer.style.display = 'none';
            if (modalCtaLink) {
                modalCtaLink.href = data.link;

                if (data.price === 'Custom' || data.price === 'Free') {
                    modalCtaLink.style.display = 'none';
                    if (btnContactCustom) {
                        btnContactCustom.style.display = 'flex';
                        btnContactCustom.innerText = data.price === 'Free' ? 'Get Your Free Audit' : 'Contact Us';
                        btnContactCustom.onclick = () => {
                            modal.style.display = 'none';
                            const contactSection = document.querySelector('#contact');
                            if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
                        };
                    }
                } else {
                    modalCtaLink.style.display = 'flex';
                    if (btnContactCustom) btnContactCustom.style.display = 'none';
                }
            }
        }

        // Show modal in the next frame to avoid presentation delay
        requestAnimationFrame(() => {
            modal.style.display = 'flex';
            modal.setAttribute('aria-hidden', 'false');
        });
    }

    // --- 3. Event Listeners ---

    // Service Card Clicks (Scroll to Deep Dive)
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.getAttribute('data-service');
            const targetId = `detail-${serviceKey}`;
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                requestAnimationFrame(() => {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

                    // Yield non-essential highlight to main thread idle time
                    setTimeout(() => {
                        targetElement.style.transition = 'background 0.5s';
                        const originalBg = targetElement.style.background;
                        targetElement.style.background = 'rgba(59, 130, 246, 0.05)';
                        setTimeout(() => {
                            targetElement.style.background = originalBg;
                        }, 1000);
                    }, 100);
                });
            } else {
                openServiceModal(serviceKey);
            }
        });
    });

    // Pricing Button Clicks
    document.querySelectorAll('.pricing-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const serviceKey = btn.getAttribute('data-service');
            if (serviceKey) {
                e.preventDefault();
                openServiceModal(serviceKey);
            }
        });
    });

    // Close Modal Logic
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- 4. Contact Form Handler (Multi-step) ---
    const contactForm = document.getElementById('contact-form');
    const contactEmail = document.getElementById('contact-email');
    const additionalFields = document.getElementById('contact-additional-fields');
    const contactSubmit = document.getElementById('contact-submit');
    const formStep1 = document.getElementById('form-step-1');
    const thankYouSection = document.getElementById('thank-you-section');
    const upsellContainer = document.getElementById('upsell-container');
    const upsellPlans = document.getElementById('upsell-plans');

    if (contactEmail && additionalFields) {
        contactEmail.addEventListener('focus', () => {
            if (additionalFields.style.display === 'none') {
                additionalFields.style.display = 'flex';
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

    // Non-functional mock handler removed. Using Shopify native {% form 'contact' %} in contact.liquid

    function showUpsellLogic() {
        if (!upsellContainer || !upsellPlans) return;

        const currentServiceKey = currentService ? Object.keys(serviceData).find(key => serviceData[key].title === currentService.title) : null;

        let upsellingItems = [];

        if (!currentServiceKey || currentServiceKey === 'free-audit' || currentServiceKey === 'audit') {
            // Upsell to Growth Partner and Total Dominance
            upsellingItems = ['cro', 'apps'];
        } else if (currentServiceKey === 'cro' || currentServiceKey === 'seo') {
            // Upsell to Total Dominance
            upsellingItems = ['apps'];
        } else if (currentServiceKey === 'apps') {
            // Highest plan, no upsell
            upsellingItems = [];
        } else {
            // Default
            upsellingItems = ['cro', 'apps'];
        }

        if (upsellingItems.length > 0) {
            upsellPlans.innerHTML = '';
            upsellingItems.forEach(key => {
                const item = serviceData[key];
                const card = document.createElement('div');
                card.style.cssText = `
                    padding: 1.5rem;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 1rem;
                    background: rgba(255,255,255,0.02);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                `;
                card.innerHTML = `
                    <div>
                        <h4 style="margin: 0; font-size: 1rem;">${item.title}</h4>
                        <p style="margin: 4px 0 0 0; font-size: 0.8rem; color: var(--text-secondary);">${item.price}</p>
                    </div>
                    <span style="color: #3b82f6;">&rarr;</span>
                `;
                card.addEventListener('mouseover', () => {
                    card.style.borderColor = '#3b82f6';
                    card.style.background = 'rgba(59,130,246,0.05)';
                });
                card.addEventListener('mouseout', () => {
                    card.style.borderColor = 'rgba(255,255,255,0.1)';
                    card.style.background = 'rgba(255,255,255,0.02)';
                });
                card.addEventListener('click', () => {
                    window.location.hash = 'pricing';
                    location.reload(); // Simple way to reset and show pricing, or we could open modal
                });
                upsellPlans.appendChild(card);
            });
            upsellContainer.style.display = 'block';
        } else {
            upsellContainer.style.display = 'none';
        }
    }


    // --- 4. Page Animations & Observers ---

    // --- 5. Navigation Helpers ---

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
