document.addEventListener('DOMContentLoaded', () => {

    // --- ALL CONTENT MENU DRAWER LOGIC ---
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const contentDrawerOverlay = document.getElementById('content-menu-drawer');
    const drawerLinks = document.querySelectorAll('.content-drawer a');

    function openContentMenu() {
        if (contentDrawerOverlay) {
            contentDrawerOverlay.classList.add('active');
            contentDrawerOverlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeContentMenu() {
        if (contentDrawerOverlay) {
            contentDrawerOverlay.classList.remove('active');
            contentDrawerOverlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', openContentMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeContentMenu);
    }

    if (contentDrawerOverlay) {
        contentDrawerOverlay.addEventListener('click', (e) => {
            if (e.target === contentDrawerOverlay) {
                closeContentMenu();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contentDrawerOverlay && contentDrawerOverlay.classList.contains('active')) {
            closeContentMenu();
        }
    });

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeContentMenu();
        });
    });

    // --- ACCORDION LOGIC ---
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const row = toggle.parentElement;
            const content = row.querySelector('.accordion-content');
            const isActive = row.classList.contains('active');
            
            // Close other open accordions
            document.querySelectorAll('.accordion-row').forEach(otherRow => {
                if (otherRow !== row) {
                    otherRow.classList.remove('active');
                    otherRow.querySelector('.accordion-content').style.maxHeight = '0px';
                }
            });
            
            if (!isActive) {
                row.classList.add('active');
                // Set max-height to scrollHeight for a smooth dynamic transition
                content.style.maxHeight = `${content.scrollHeight}px`;
            } else {
                row.classList.remove('active');
                content.style.maxHeight = '0px';
            }
        });
    });

    // --- AUTHORISED BRANDS FILTER LOGIC ---
    const brandFilterButtons = document.querySelectorAll('.brand-filter-btn');
    const brandCards = document.querySelectorAll('.brand-card');

    if (brandFilterButtons.length > 0 && brandCards.length > 0) {
        brandFilterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                brandFilterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-brand-filter');

                brandCards.forEach(card => {
                    const cardCat = card.getAttribute('data-category');
                    if (filterValue === 'all' || cardCat === filterValue) {
                        card.classList.remove('hide');
                        card.classList.remove('anim-pop-in');
                        // Force reflow for restart of CSS animation
                        void card.offsetWidth;
                        card.classList.add('anim-pop-in');
                    } else {
                        card.classList.add('hide');
                        card.classList.remove('anim-pop-in');
                    }
                });
            });
        });
    }

    // --- QUICK INQUIRE FOR BRAND HANDLER ---
    const brandInquireBtns = document.querySelectorAll('.btn-brand-inquire');
    const serviceSelect = document.getElementById('service');
    const messageTextarea = document.getElementById('message');
    const inquirySection = document.getElementById('inquiry');

    brandInquireBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const brandName = btn.getAttribute('data-brand-name') || '';
            const serviceKey = btn.getAttribute('data-service-key') || '';

            // Update service select if matching option exists
            if (serviceSelect && serviceKey) {
                for (let i = 0; i < serviceSelect.options.length; i++) {
                    if (serviceSelect.options[i].value === serviceKey) {
                        serviceSelect.selectedIndex = i;
                        break;
                    }
                }
            }

            // Pre-fill message
            if (messageTextarea && brandName) {
                messageTextarea.value = `Hello SS Global Team, I am interested in requesting the official catalogue, pricing, and availability for ${brandName} for our project.`;
            }

            // Smooth scroll to inquiry form
            if (inquirySection) {
                inquirySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Subtle highlight animation on the form
                const formCard = document.getElementById('inquiry-form');
                if (formCard) {
                    formCard.style.transition = 'box-shadow 0.4s ease';
                    formCard.style.boxShadow = '0 0 0 3px #C5A880, 0 15px 35px rgba(0,0,0,0.08)';
                    setTimeout(() => {
                        formCard.style.boxShadow = '';
                    }, 1600);
                }
            }
        });
    });

    // --- SHOWCASE GALLERY FILTER LOGIC ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hide');
                } else {
                    if (item.classList.contains(filterValue)) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                }
            });
        });
    });

    // --- SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('is-revealed'));
    }

    // --- CLIENT-SIDE INQUIRY FORM (DIRECT EMAIL TO SALES.SSGLOBALL@GMAIL.COM) ---
    const inquiryForm = document.getElementById('inquiry-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    const resetBtn = document.getElementById('reset-inquiry-btn');
    const waDirectBtn = document.getElementById('whatsapp-direct-inquiry');
    const emailFallbackBtn = document.getElementById('email-direct-fallback');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(inquiryForm);
            const name = formData.get('name') || '';
            const email = formData.get('email') || '';
            const phone = formData.get('phone') || '';
            const serviceKey = formData.get('service') || '';
            const message = formData.get('message') || '';
            
            const serviceLabel = (serviceSelect && serviceSelect.options[serviceSelect.selectedIndex]) 
                ? serviceSelect.options[serviceSelect.selectedIndex].text 
                : serviceKey;
            
            // Set loading state on submit button
            submitBtn.textContent = 'Sending to sales.ssgloball@gmail.com...';
            submitBtn.disabled = true;

            // Prepare WhatsApp pre-filled text
            if (waDirectBtn) {
                const formattedMsg = `*Showroom Inquiry - SS Global*\n\n` +
                    `Hello SS Global Team,\n` +
                    `I would like to request product catalogues, pricing, and availability details.\n\n` +
                    `*Customer Details:*\n` +
                    `• *Name:* ${name}\n` +
                    `• *Phone:* ${phone}\n` +
                    `• *Email:* ${email || 'Not provided'}\n` +
                    `• *Brand / Department:* ${serviceLabel}\n\n` +
                    `*Requirements:*\n${message}`;
                waDirectBtn.href = `https://wa.me/919355609966?text=${encodeURIComponent(formattedMsg)}`;
            }

            // Prepare direct mailto fallback link with pre-filled subject and body
            if (emailFallbackBtn) {
                const mailSubject = `Showroom Inquiry from ${name} - SS Global`;
                const mailBody = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nDepartment / Brand: ${serviceLabel}\n\nProject Requirements:\n${message}`;
                emailFallbackBtn.href = `mailto:sales.ssgloball@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;
            }

            // Send query directly to sales.ssgloball@gmail.com via 100% frontend FormSubmit AJAX API
            const activationNotice = document.getElementById('activation-notice');
            const successTitle = document.getElementById('success-title-text');
            const successFeedback = document.getElementById('success-feedback-text');

            try {
                const payload = {
                    "Customer Name": name,
                    "Email Address": email,
                    "Phone / WhatsApp": phone,
                    "Department or Brand": serviceLabel,
                    "Project Requirements": message,
                    "_subject": `New Showroom Inquiry: ${name} (${serviceLabel})`,
                    "_replyto": email,
                    "_template": "table",
                    "_captcha": "false"
                };

                const response = await fetch('https://formsubmit.co/ajax/sales.ssgloball@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const resData = await response.json();

                if (resData && (resData.success === 'true' || resData.success === true)) {
                    if (activationNotice) activationNotice.style.display = 'none';
                    if (successTitle) successTitle.textContent = 'Inquiry Sent Successfully!';
                    if (successFeedback) {
                        successFeedback.innerHTML = 'Thank you! Your query has been delivered directly to <strong>sales.ssgloball@gmail.com</strong>. Our consultant will contact you shortly.';
                    }
                } else if (resData && resData.message && resData.message.toLowerCase().includes('activation')) {
                    if (activationNotice) activationNotice.style.display = 'block';
                    if (successTitle) successTitle.textContent = 'One-Time Setup Required';
                    if (successFeedback) {
                        successFeedback.innerHTML = 'Inquiry captured! FormSubmit has sent a 1-click confirmation to <strong>sales.ssgloball@gmail.com</strong>. Open your email and click "Activate Form" once to start receiving inquiries.';
                    }
                }
            } catch (error) {
                // If offline or local file CORS, continue gracefully
                console.warn('Form submission notice:', error);
            }

            // Show animated checkmark success card
            inquiryForm.classList.add('hidden');
            formSuccess.classList.add('visible');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    if (resetBtn && inquiryForm && formSuccess) {
        resetBtn.addEventListener('click', () => {
            inquiryForm.reset();
            submitBtn.textContent = 'Send Inquiry Request';
            submitBtn.disabled = false;
            const activationNotice = document.getElementById('activation-notice');
            if (activationNotice) activationNotice.style.display = 'none';
            formSuccess.classList.remove('visible');
            inquiryForm.classList.remove('hidden');
            inquiryForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
});
