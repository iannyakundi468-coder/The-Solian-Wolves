document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Global/Shared Variables (initialized only after DOM is ready) ---
    const modal = document.getElementById('service-modal');
    const closeModal = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalExpectations = document.getElementById('modal-expectations');
    const modalPrice = document.getElementById('modal-price');

    // Payment UI Elements
    const paymentSelection = document.getElementById('payment-selection');
    const viewPayPal = document.getElementById('view-paypal');
    const viewCard = document.getElementById('view-card');
    const btnPayPayPal = document.getElementById('btn-pay-paypal');
    const btnPayCard = document.getElementById('btn-pay-card');
    const btnContactCustom = document.getElementById('btn-contact-custom');
    const backBtns = document.querySelectorAll('#back-from-paypal, #back-from-card');

    let currentService = null;

    const serviceData = {
        audit: {
            title: "Deep Dive Audit",
            desc: "A surgical analysis of your digital presence. We find where you're bleeding money.",
            expectations: [
                "Comprehensive UX/UI Audit",
                "Performance & Speed Analysis",
                "SEO Gap Analysis & Keyword Blueprint",
                "Competitor Benchmark Report",
                "Accessibility (a11y) Compliance Check",
                "Tech Stack Modernization Roadmap",
                "Free 30-min Strategy Call"
            ],
            price: "$997 (Limited Offer)",
            rawPrice: 997,
            billingType: 'one-time',
            link: "#audit-checkout"
        },
        cro: {
            title: "Growth Partner (CRO)",
            desc: "Continuous testing and optimization to maximize your Revenue Per User.",
            expectations: [
                "Everything in Deep Dive Audit",
                "Monthly A/B Testing Regime",
                "Heatmap & User Behavior Analysis",
                "Funnel & Checkout Optimization",
                "Cart Abandonment Recovery Tuning",
                "Weekly Tactical Strategy Syncs",
                "Dedicated Project Manager"
            ],
            price: "$4,500/mo",
            rawPrice: 4500,
            billingType: 'subscription',
            planId: 'P-8M889809WC5135716NFSZP6A', // Live PayPal Plan ID
            link: "#cro-checkout"
        },
        seo: {
            title: "SEO Listings",
            desc: "Climb the rankings and own your niche with technical and content SEO.",
            expectations: [
                "Keyword Strategy & Gap Analysis",
                "Technical SEO Fixes (Schema/Speed)",
                "Backlink Profile Analysis",
                "Rich Snippets Implementation"
            ],
            price: "$2,500/mo",
            rawPrice: 2500,
            billingType: 'subscription',
            planId: 'P-3BV81863N5378132YNFSZJ3Y', // Live PayPal Plan ID
            link: "#seo-checkout"
        },
        apps: {
            title: "Custom App Development",
            desc: "Bespoke software solutions to solve unique business problems.",
            expectations: [
                "Full-Stack Development Team (24/7)",
                "Custom App & SaaS Architecture",
                "Headless & Headless API Integration",
                "Enterprise Security Hardening",
                "Infrastructure & Database Tuning",
                "Unlimited UI/UX Design Requests",
                "White-label Analytics Dashboard"
            ],
            price: "Custom",
            rawPrice: null,
            billingType: 'one-time',
            link: "#contact"
        },
        'free-audit': {
            title: "Free One-Time Audit",
            desc: "A complimentary high-level review to identify immediate opportunities for improvement.",
            expectations: [
                "Basic Speed Check",
                "UX Quick Win Report",
                "SEO Health Check",
                "3 Actionable Tips"
            ],
            price: "Free",
            rawPrice: 0,
            billingType: 'one-time',
            link: "#contact"
        }
    };

    // --- 2. Helper Functions ---

    function resetModalViews() {
        if (!paymentSelection) return;
        paymentSelection.style.display = 'flex';
        if (viewPayPal) viewPayPal.style.display = 'none';
        if (viewCard) viewCard.style.display = 'none';

        // Reset Buttons Visibility
        if (btnPayPayPal) btnPayPayPal.style.display = 'flex';
        if (btnPayCard) btnPayCard.style.display = 'flex';
        if (btnContactCustom) btnContactCustom.style.display = 'none';
    }

    function openServiceModal(serviceKey) {
        if (!serviceKey || !serviceData[serviceKey]) return;
        if (!modal) return;

        const data = serviceData[serviceKey];
        currentService = data;

        if (modalTitle) modalTitle.innerText = data.title;
        if (modalDesc) modalDesc.innerText = data.desc;
        if (modalPrice) modalPrice.innerText = data.price;

        // Populate List
        if (modalExpectations) {
            modalExpectations.innerHTML = '';
            data.expectations.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<span style="color: #3b82f6; margin-right: 0.5rem;">✓</span> ${item}`;
                li.style.marginBottom = '0.5rem';
                modalExpectations.appendChild(li);
            });
        }

        resetModalViews();

        // Handle Custom / Free Logic
        if ((data.price === 'Custom' || data.price === 'Free') && btnContactCustom) {
            if (btnPayPayPal) btnPayPayPal.style.display = 'none';
            if (btnPayCard) btnPayCard.style.display = 'none';
            btnContactCustom.style.display = 'flex';
            btnContactCustom.innerText = data.price === 'Free' ? 'Get Your Free Audit' : 'Contact Us';

            btnContactCustom.onclick = () => {
                modal.style.display = 'none';
                const contactSection = document.querySelector('#contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            };
        }

        modal.style.display = 'flex';
    }

    // --- 3. Event Listeners ---

    // Service Card Clicks (Scroll to Deep Dive)
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', () => {
            const serviceKey = card.getAttribute('data-service');
            const targetId = `detail-${serviceKey}`;
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Optional: add a brief highlight effect
                targetElement.style.transition = 'background 0.5s';
                const originalBg = targetElement.style.background;
                targetElement.style.background = 'rgba(59, 130, 246, 0.05)';
                setTimeout(() => {
                    targetElement.style.background = originalBg;
                }, 1000);
            } else {
                // Fallback to modal if detail section doesn't exist
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

    // Payment Flow - PayPal Wallet
    if (btnPayPayPal) {
        btnPayPayPal.addEventListener('click', () => {
            if (!paymentSelection || !viewPayPal) return;
            paymentSelection.style.display = 'none';
            viewPayPal.style.display = 'block';

            const container = document.getElementById('paypal-button-container');
            if (container) container.innerHTML = '';

            if (currentService && window.paypal) {
                const config = {
                    fundingSource: paypal.FUNDING.PAYPAL,
                    createOrder: function (data, actions) {
                        if (currentService.billingType === 'one-time' && currentService.rawPrice > 0) {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        currency_code: 'USD',
                                        value: currentService.rawPrice.toString()
                                    },
                                    description: currentService.title
                                }]
                            });
                        }
                    },
                    createSubscription: function (data, actions) {
                        if (currentService.billingType === 'subscription') {
                            return actions.subscription.create({
                                'plan_id': currentService.planId
                            });
                        }
                    },
                    onApprove: function (data, actions) {
                        console.log('Payment Approved:', data);
                        if (currentService.billingType === 'subscription') {
                            alert('Subscription successful! ID: ' + data.subscriptionID);
                        } else {
                            return actions.order.capture().then(function (details) {
                                alert('Transaction completed by ' + details.payer.name.given_name);
                            });
                        }
                        modal.style.display = 'none';
                    },
                    onCancel: function (data) {
                        console.log('Payment Cancelled:', data);
                    },
                    onError: function (err) {
                        console.error('PayPal Error:', err);
                        alert('There was an error with the PayPal flow. Please try again or contact us.');
                    }
                };

                paypal.Buttons(config).render('#paypal-button-container');
            }
        });
    }

    // Payment Flow - Card
    if (btnPayCard) {
        btnPayCard.addEventListener('click', () => {
            if (!paymentSelection || !viewCard) return;
            paymentSelection.style.display = 'none';
            viewCard.style.display = 'block';

            const container = document.getElementById('card-button-container');
            if (container) container.innerHTML = '';

            if (currentService && window.paypal) {
                const config = {
                    style: {
                        layout: 'vertical'
                    },
                    fundingSource: paypal.FUNDING.CARD,
                    createOrder: function (data, actions) {
                        if (currentService.billingType === 'one-time' && currentService.rawPrice > 0) {
                            return actions.order.create({
                                purchase_units: [{
                                    amount: {
                                        currency_code: 'USD',
                                        value: currentService.rawPrice.toString()
                                    },
                                    description: currentService.title
                                }]
                            });
                        }
                    },
                    createSubscription: function (data, actions) {
                        if (currentService.billingType === 'subscription') {
                            return actions.subscription.create({
                                'plan_id': currentService.planId
                            });
                        }
                    },
                    onApprove: function (data, actions) {
                        console.log('Card Payment Approved:', data);
                        if (currentService.billingType === 'subscription') {
                            alert('Subscription successful! ID: ' + data.subscriptionID);
                        } else {
                            return actions.order.capture().then(function (details) {
                                alert('Transaction completed by ' + details.payer.name.given_name);
                            });
                        }
                        modal.style.display = 'none';
                    },
                    onCancel: function (data) {
                        console.log('Card Payment Cancelled:', data);
                    },
                    onError: function (err) {
                        console.error('Card PayPal Error:', err);
                        alert('There was an error processing your card. Please try again or use a different method.');
                    }
                };

                paypal.Buttons(config).render('#card-button-container');
            }
        });
    }

    // Back Buttons
    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            resetModalViews();
        });
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

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            if (data.email) {
                // Simulate form submission (In production, use fetch to your backend or Formspree)
                console.log('Form Submitted:', data);

                // Switch to Thank You state
                if (formStep1 && thankYouSection) {
                    formStep1.style.opacity = '0';
                    setTimeout(() => {
                        formStep1.style.display = 'none';
                        thankYouSection.style.display = 'block';
                        setTimeout(() => {
                            thankYouSection.style.opacity = '1';
                            thankYouSection.style.transform = 'translateY(0)';
                            showUpsellLogic();
                        }, 10);
                    }, 500);
                }
            }
        });
    }

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

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Observer Logic (consolidated)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

});
