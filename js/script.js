document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 1. Dark Mode Toggle
    // ------------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');

    // Initial setup
    const initialTheme = savedTheme || 'dark';
    htmlElement.setAttribute('data-theme', initialTheme);
    updateIcon(initialTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // ------------------------------------------------------------------
    // 2. Mobile Navigation Toggle
    // ------------------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ------------------------------------------------------------------
    // 3. Smooth Scrolling & Scroll Animation (Enhanced)
    // ------------------------------------------------------------------

    // Smooth Scroll for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;

                // If scrolling to LinkedIn, calculate offset based on the parent #contact section
                // so the user sees the "Get In Touch" header and the whole form.
                let scrollAnchorElement = targetElement;
                if (targetId === '#linkedin-contact') {
                    scrollAnchorElement = document.querySelector('#contact');
                }

                const elementPosition = scrollAnchorElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Add flashing logic if target is linkedin-contact
                if (targetId === '#linkedin-contact') {
                    // Remove the class first in case it's already there to restart animation
                    targetElement.classList.remove('attention-grabber');
                    // Wait for smooth scroll to finish (approx 800ms) before flashing
                    setTimeout(() => {
                        targetElement.classList.add('attention-grabber');
                        setTimeout(() => {
                            targetElement.classList.remove('attention-grabber');
                        }, 4500); // 3 pulses (1.5s * 3)
                    }, 800);
                }
            }
        });
    });

    // Scroll Reveal with Stagger
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal classes to main sections
    const sections = document.querySelectorAll('.section-title, .about-content, .contact-wrapper');
    sections.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });

    // Staggered Items (Cards, Skills)
    const staggerGroups = [
        document.querySelectorAll('.skill-category'),
        document.querySelectorAll('.project-card'),
        document.querySelectorAll('.service-card'),
        document.querySelectorAll('.timeline-item')
    ];

    staggerGroups.forEach(group => {
        group.forEach((item, index) => {
            item.classList.add('reveal-on-scroll');
            // Cycle through delay classes 1-4
            const delayClass = `stagger-${(index % 4) + 1}`;
            item.classList.add(delayClass);
            observer.observe(item);
        });
    });

    // ------------------------------------------------------------------
    // 4. Cursor Glow Effect
    // ------------------------------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');

    if (cursorGlow) {
        // Only enable on non-touch devices
        if (window.matchMedia("(pointer: fine)").matches) {
            document.addEventListener('mousemove', (e) => {
                // Use requestAnimationFrame for performance
                requestAnimationFrame(() => {
                    cursorGlow.style.opacity = '1';
                    cursorGlow.style.left = e.clientX + 'px';
                    cursorGlow.style.top = e.clientY + 'px';
                });
            });

            document.addEventListener('mouseleave', () => {
                cursorGlow.style.opacity = '0';
            });
        }
    }

    // ------------------------------------------------------------------
    // 5. 3D Tilt Effect on Cards
    // ------------------------------------------------------------------
    const tiltCards = document.querySelectorAll('.project-card, .service-card, .skill-category, .about-image');

    tiltCards.forEach(card => {
        card.classList.add('start-tilt'); // Add transition class

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 10 degrees)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Invert Y for tilt
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
        });
    });

    // ------------------------------------------------------------------
    // 6. Button Ripple Effect
    // ------------------------------------------------------------------
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const circle = document.createElement('span');
            circle.classList.add('ripple');
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';

            // Make ripple size proportional
            const diameter = Math.max(rect.width, rect.height);
            circle.style.width = circle.style.height = diameter + 'px';
            circle.style.marginLeft = -diameter / 2 + 'px';
            circle.style.marginTop = -diameter / 2 + 'px';

            // Remove old ripples to keep DOM clean
            const oldRipple = btn.querySelector('.ripple');
            if (oldRipple) {
                oldRipple.remove();
            }

            btn.appendChild(circle);

            // Clean up after animation
            setTimeout(() => {
                circle.remove();
            }, 600);
        });
    });

    // ------------------------------------------------------------------
    // 7. Scroll Progress Button
    // ------------------------------------------------------------------
    const progressWrap = document.querySelector('.progress-wrap');
    if (progressWrap) {
        const progressPath = progressWrap.querySelector('path');
        const pathLength = progressPath.getTotalLength();

        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

        const updateProgress = () => {
            const scroll = window.pageYOffset;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress);

        const offset = 50;

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > offset) {
                progressWrap.classList.add('active-progress');
            } else {
                progressWrap.classList.remove('active-progress');
            }
        });
    }

    // ------------------------------------------------------------------
    // 8. Project "View Details" Interaction
    // ------------------------------------------------------------------
    const viewDetailsBtns = document.querySelectorAll('.view-project-details');
    // Assuming the LinkedIn contact item is the FIRST one or specifically identifiable.
    // Based on HTML structure: <div class="contact-item"><i class="fab fa-linkedin"></i>...</div>
    // Let's find the contact item containing the LinkedIn icon.
    const linkedInIcon = document.querySelector('.fa-linkedin');
    const linkedInItem = linkedInIcon ? linkedInIcon.closest('.contact-item') : null;

    if (linkedInItem) {
        viewDetailsBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Allow default scroll to #contact, but add highlight after a delay
                setTimeout(() => {
                    linkedInItem.classList.add('attention-grabber');

                    // Remove after 3 seconds (2 pulses)
                    setTimeout(() => {
                        linkedInItem.classList.remove('attention-grabber');
                    }, 3000);
                }, 800); // Wait for scroll (approx)
            });
        });
    }

    // ------------------------------------------------------------------
    // 9. Typing Effect
    // ------------------------------------------------------------------
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = ["Electrical Engineer"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    if (textArray.length && typedTextSpan) {
        setTimeout(type, newTextDelay + 250);
    }

    // ------------------------------------------------------------------
    // 10. Vibe Engineered Architecture (Security & Submission)
    // ------------------------------------------------------------------

    /**
     * ==============================================================================
     * 🏗️ PORTFOLIO CONFIGURATION (User-Centric Data Layer)
     * ==============================================================================
     */
    const PortfolioConfig = {
        api: {
            webformsKey: "54df8a96-9799-40ea-9e13-49e8535f74a6",
            submissionEndpoint: "https://api.web3forms.com/submit"
        },
        identity: {
            name: "Mohamed Adel",
            title: "Electrical Site Engineer & Talent Acquisition Specialist",
            obfuscatedEmail: {
                user: "mohamedadelshafei20",
                domain: "gmail.com"
            }
        },
        securityRules: {
            contactForm: {
                name: {
                    pattern: /^[a-zA-Z\s\.\-']{2,50}$/,
                    maxLength: 50,
                    errorMessage: "Invalid Name. strictly 2-50 letters/spaces allowed."
                },
                email: {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    maxLength: 100,
                    errorMessage: "Invalid Email format."
                },
                message: {
                    pattern: /^.{10,1000}$/s,
                    minLength: 10,
                    maxLength: 1000,
                    errorMessage: "Message must be strictly between 10 and 1000 characters."
                }
            }
        }
    };

    const deepFreeze = (obj) => {
        Object.keys(obj).forEach(prop => {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) deepFreeze(obj[prop]);
        });
        return Object.freeze(obj);
    };
    deepFreeze(PortfolioConfig);

    /**
     * ==============================================================================
     * 🛡️ THE SECURITY ENGINE (Processing, Sanitization & Logic)
     * ==============================================================================
     */
    const SecurityEngine = (() => {
        const sanitizeHTML = (input) => {
            if (typeof input !== 'string') return '';
            const escapeMap = {
                '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;'
            };
            return input.replace(/[&<>"']/g, match => escapeMap[match]);
        };

        const validateField = (fieldName, rawValue) => {
            const rules = PortfolioConfig.securityRules.contactForm[fieldName];
            if (!rules) return { isValid: false, error: "System Error: Field rules undefined." };

            const processValue = rawValue.trim();

            if (rules.minLength && processValue.length < rules.minLength) {
                return { isValid: false, error: rules.errorMessage };
            }
            if (rules.maxLength && processValue.length > rules.maxLength) {
                return { isValid: false, error: rules.errorMessage };
            }

            if (!rules.pattern.test(processValue)) {
                return { isValid: false, error: rules.errorMessage };
            }

            return { isValid: true, sanitizedValue: sanitizeHTML(processValue) };
        };

        const setStatus = (element, message, type = 'info') => {
            if (!element) return;
            element.textContent = message;
            element.style.display = 'block';
            element.style.color = type === 'error' ? 'red' : (type === 'success' ? 'var(--primary-color)' : 'var(--text-secondary)');
        };

        const initSecureDOM = () => {
            const emailLink = document.getElementById('protected-email');
            if (emailLink) {
                const safeEmail = `${PortfolioConfig.identity.obfuscatedEmail.user}@${PortfolioConfig.identity.obfuscatedEmail.domain}`;
                emailLink.textContent = safeEmail;
                emailLink.href = `mailto:${safeEmail}`;
            }
        };

        return { sanitize: sanitizeHTML, validate: validateField, updateStatus: setStatus, initDOM: initSecureDOM };
    })();

    // Initialize DOM Protections dynamically
    SecurityEngine.initDOM();

    /**
     * ==============================================================================
     * 🚀 SECURE FORM SUBMISSION (Integration & Transport)
     * ==============================================================================
     */
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    const honeypotField = document.getElementById('honeypot');

    if (contactForm && formResult) {
        let lastSubmitTime = 0; // for rate limiting

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // --- 1. Rate Limiting Check (1 submission per 60 seconds) ---
            const now = Date.now();
            if (now - lastSubmitTime < 60000) {
                SecurityEngine.updateStatus(formResult, "Please wait a minute before sending another message.", "error");
                return;
            }

            SecurityEngine.updateStatus(formResult, "Validating...", "info");

            if (honeypotField && honeypotField.value.trim().length > 0) {
                console.warn("Security Alert: Suspicious activity blocked.");
                SecurityEngine.updateStatus(formResult, "Message sent successfully! I will get back to you soon.", "success");
                contactForm.reset();
                setTimeout(() => { formResult.style.display = "none"; }, 5000);
                return;
            }

            const formData = new FormData(contactForm);
            const rawPayload = Object.fromEntries(formData);
            const securePayload = {};

            const fieldsToValidate = ['name', 'email', 'message'];
            let isFormValid = true;

            for (const field of fieldsToValidate) {
                const rawValue = rawPayload[field] || '';
                const validationScore = SecurityEngine.validate(field, rawValue);

                if (!validationScore.isValid) {
                    SecurityEngine.updateStatus(formResult, validationScore.error, "error");
                    isFormValid = false;
                    break;
                }
                securePayload[field] = validationScore.sanitizedValue;
            }

            if (!isFormValid) return;

            securePayload.access_key = SecurityEngine.sanitize(PortfolioConfig.api.webformsKey);
            securePayload.subject = SecurityEngine.sanitize("New Secure Contact Request");
            if (rawPayload.botcheck) {
                securePayload.botcheck = SecurityEngine.sanitize(rawPayload.botcheck);
            }

            try {
                SecurityEngine.updateStatus(formResult, "Encrypting and sending payload...", "info");

                const response = await fetch(PortfolioConfig.api.submissionEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(securePayload)
                });

                const jsonResponse = await response.json();

                if (response.status === 200) {
                    const safeSuccessMessage = SecurityEngine.sanitize(jsonResponse.message || "Message sent successfully! I will get back to you soon.");
                    SecurityEngine.updateStatus(formResult, safeSuccessMessage, "success");
                    contactForm.reset();
                    lastSubmitTime = Date.now(); // Record success time for rate limit
                } else {
                    console.error("API Error Status:", SecurityEngine.sanitize(String(response.status)));
                    SecurityEngine.updateStatus(formResult, "Service structure unavailable. Please try again.", "error");
                }
            } catch (networkError) {
                console.error("Transmission Error.");
                SecurityEngine.updateStatus(formResult, "Secure connection failed. Please check your network.", "error");
            } finally {
                setTimeout(() => { formResult.style.display = "none"; }, 6000);
            }
        });
    }

    // ------------------------------------------------------------------
    // 11. Projects Filtering
    // ------------------------------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                projectCards.forEach(card => {
                    card.style.display = 'none'; // Instantly hide all to reset layout

                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex'; // Instantly show matching (since it's a flex column)
                        // Tiny delay to ensure CSS registers the block display before fading in
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                    }
                });
            });
        });
    }

    // ------------------------------------------------------------------
    // 12. Email Obfuscation
    // ------------------------------------------------------------------
    const protectedEmail = document.getElementById('protected-email');
    if (protectedEmail) {
        const user = "mohamedadelshafei20";
        const domain = "gmail.com";
        const email = user + "@" + domain;
        // Decode and set the email on page load
        protectedEmail.textContent = email;
        protectedEmail.href = "mailto:" + email;
    }

    // Code removed to revert geometric canvas

    // ------------------------------------------------------------------
    // 13. Multi-language Support (i18n)
    // ------------------------------------------------------------------
    const langToggle = document.getElementById('lang-toggle');
    let isArabic = false;

    if (langToggle) {
        langToggle.addEventListener('click', () => {
            isArabic = !isArabic;
            document.documentElement.setAttribute('dir', isArabic ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', isArabic ? 'ar' : 'en');
            langToggle.innerHTML = isArabic ? 'EN' : '<i class="fas fa-globe"></i>';

            const elementsToTranslate = document.querySelectorAll('[data-ar]');
            elementsToTranslate.forEach(el => {
                if (!el.hasAttribute('data-en')) {
                    // Save the English original text
                    el.setAttribute('data-en', el.innerHTML);
                }

                if (isArabic) {
                    el.innerHTML = el.getAttribute('data-ar');
                } else {
                    el.innerHTML = el.getAttribute('data-en');
                }
            });
        });
    }

    // ------------------------------------------------------------------
    // 14. Testimonials Carousel
    // ------------------------------------------------------------------
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = track.querySelectorAll('.testimonial-card');
        const cardCount = cards.length;

        function updateCarousel() {
            // Adjust translate direction based on language currently active
            track.style.transform = `translateX(${currentIndex * (isArabic ? 100 : -100)}%)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cardCount;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cardCount) % cardCount;
            updateCarousel();
        });

        // Handle RTL switch gracefully
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                setTimeout(updateCarousel, 50); // slight delay to allow layout
            });
        }
    }

    // ------------------------------------------------------------------
    // 15. Advanced CV Download Modal
    // ------------------------------------------------------------------
    const cvDownloadBtn = document.getElementById('cv-download-btn');
    const cvModal = document.getElementById('cv-modal');
    const progressBarFill = document.querySelector('.progress-bar-fill');

    if (cvDownloadBtn && cvModal) {
        cvDownloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const cvUrl = cvDownloadBtn.getAttribute('data-cv-url');

            // Show Modal
            cvModal.classList.remove('hidden');

            // Start Loading Animation
            setTimeout(() => {
                if (progressBarFill) progressBarFill.style.width = '100%';
            }, 100);

            // Hide and download after delay
            setTimeout(() => {
                cvModal.classList.add('hidden');
                if (progressBarFill) progressBarFill.style.width = '0%'; // reset

                // Trigger actual download explicitly
                const link = document.createElement('a');
                link.href = cvUrl;
                link.download = cvUrl; // default download name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 1800);
        });
    }

    // ------------------------------------------------------------------
    // 16. Basic Anti-Scraping & Copy Protection - REMOVED
    // ------------------------------------------------------------------

    // ------------------------------------------------------------------
    // 17. Reading Progress Bar
    // ------------------------------------------------------------------
    const progressBar = document.getElementById('reading-progress');
    window.addEventListener('scroll', () => {
        if (progressBar) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercentage = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = scrollPercentage + '%';
        }
    });

    // ------------------------------------------------------------------
    // 18. Stats Counter Animation
    // ------------------------------------------------------------------
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true; // prevent re-running
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000; // ms
                        const increment = target / (duration / 16); // 60fps

                        let currentCount = 0;
                        const updateCounter = () => {
                            currentCount += increment;
                            if (currentCount < target) {
                                counter.innerText = Math.ceil(currentCount);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                    });
                    observer.disconnect(); // Stop observing once animated
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% of section is visible

        const statsSection = document.getElementById('stats');
        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }

    // ------------------------------------------------------------------
    // 19. Smart Sticky Navbar
    // ------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        if (!navbar) return;

        let st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop && st > 80) {
            // Scroll Down
            navbar.classList.add('navbar-hidden');
        } else {
            // Scroll Up
            navbar.classList.remove('navbar-hidden');
        }
        lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
    });

    // ------------------------------------------------------------------
    // 20. Animated Card Stack Gallery
    // ------------------------------------------------------------------
    const cardStackModal = document.getElementById('card-stack-modal');
    const cardStackContainer = document.getElementById('card-stack-container');
    let stackInterval = null;

    // Photos paths array (dynamically matching the requested files)
    const galleryPhotos = [
        "Photos/Rawdat El-Obour Residential Project 1.jpg",
        "Photos/Rawdat El-Obour Residential Project 2.jpg",
        "Photos/Rawdat El-Obour Residential Project 3.jpg",
        "Photos/Rawdat El-Obour Residential Project 4.jpg",
        "Photos/Rawdat El-Obour Residential Project 5.jpg",
        "Photos/Rawdat El-Obour Residential Project 6.jpg"
    ];

    window.openCardStack = function () {
        if (!cardStackModal || !cardStackContainer) return;

        // Render cards
        cardStackContainer.innerHTML = '';
        galleryPhotos.forEach((src, index) => {
            const card = document.createElement('div');
            card.classList.add('stack-card');

            // Set initial state
            if (index === 0) card.classList.add('active');
            else if (index === 1) card.classList.add('next');
            else card.classList.add('behind');

            const img = document.createElement('img');
            img.src = src;
            img.alt = `Gallery Image ${index + 1}`;
            img.loading = "lazy";

            card.appendChild(img);
            cardStackContainer.appendChild(card);
        });

        cardStackModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Start cycling
        startCardCycle();
    };

    window.closeCardStack = function () {
        if (!cardStackModal) return;
        cardStackModal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        stopCardCycle();

        // Specific requirement: scroll to LinkedIn contact immediately after closing
        const targetElement = document.querySelector('#linkedin-contact');
        const scrollAnchorElement = document.querySelector('#contact');

        if (targetElement && scrollAnchorElement) {
            const headerOffset = 80;
            const elementPosition = scrollAnchorElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Highlight the LinkedIn card
            targetElement.classList.remove('attention-grabber');
            setTimeout(() => {
                targetElement.classList.add('attention-grabber');
                setTimeout(() => {
                    targetElement.classList.remove('attention-grabber');
                }, 4500); // 3 pulses
            }, 800);
        }
    };

    function startCardCycle() {
        stopCardCycle(); // ensure clean state
        stackInterval = setInterval(cycleCards, 3000); // Change image every 3 seconds
    }

    function stopCardCycle() {
        if (stackInterval) {
            clearInterval(stackInterval);
            stackInterval = null;
        }
    }

    function cycleCards() {
        if (!cardStackContainer) return;

        const cards = Array.from(cardStackContainer.querySelectorAll('.stack-card'));
        if (cards.length === 0) return;

        // Find current state indices
        const activeIndex = cards.findIndex(c => c.classList.contains('active'));
        const nextIndex = (activeIndex + 1) % cards.length;
        const behindIndex = (activeIndex + 2) % cards.length;

        // Transition active card out
        cards[activeIndex].className = 'stack-card out';

        // Wait a short delay, then move it to the back
        setTimeout(() => {
            if (cards[activeIndex] && cards[activeIndex].classList.contains('out')) {
                cards[activeIndex].className = 'stack-card behind';
            }
        }, 800); // matches CSS transition time

        // Promote next to active
        cards[nextIndex].className = 'stack-card active';

        // Promote behind to next
        cards[behindIndex].className = 'stack-card next';
    }

    // Modal close listeners
    if (cardStackModal) {
        cardStackModal.addEventListener('click', (e) => {
            if (e.target === cardStackModal) {
                window.closeCardStack();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !cardStackModal.classList.contains('hidden')) {
                window.closeCardStack();
            }
        });
    }

});
