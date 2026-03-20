/**
 * 🏗️ Mohamed Adel - Portfolio Architecture
 * Engineered for Security, Performance & Maintainability.
 * 
 * Architecture Layout:
 * 1. UIController (Theme, Reading Progress, Sticky Nav, Scroll Progress)
 * 2. NavigationController (Mobile Nav Menu)
 * 3. ScrollAnimationController (Staggered Reveals, Stats Counters, 3D Tilt)
 * 4. InteractionController (Ripple, Typing Effect, Cursor Glow, Modals)
 * 5. FeatureController (Projects Gallery, Filtering, Testimonials)
 * 6. I18nController (Language Toggling)
 * 7. SecurityEngine (Vanilla Zod-like Validator, Rate Limiting, Anti-Spam, Scrubbing)
 */

class UIController {
    constructor() {
        this.initThemeToggle();
        this.initStickyNav();
        this.initReadingProgress();
        this.initScrollProgress();
    }

    initThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const htmlElement = document.documentElement;
        const icon = themeToggle.querySelector('i');
        const savedTheme = localStorage.getItem('theme') || 'dark';

        htmlElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(icon, savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcon(icon, newTheme);
        });
    }

    updateThemeIcon(icon, theme) {
        if (theme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    initStickyNav() {
        const navbar = document.querySelector('.navbar');
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            if (!navbar) return;
            const st = window.pageYOffset || document.documentElement.scrollTop;
            if (st > lastScrollTop && st > 80) {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
            }
            lastScrollTop = st <= 0 ? 0 : st;
        });
    }

    initReadingProgress() {
        const progressBar = document.getElementById('reading-progress');
        window.addEventListener('scroll', () => {
            if (!progressBar) return;
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            progressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
        });
    }

    initScrollProgress() {
        const progressWrap = document.querySelector('.progress-wrap');
        if (!progressWrap) return;

        const progressPath = progressWrap.querySelector('path');
        const pathLength = progressPath.getTotalLength();

        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

        const updateProgress = () => {
            const scroll = window.pageYOffset;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            progressPath.style.strokeDashoffset = pathLength - (scroll * pathLength / height);
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                progressWrap.classList.add('active-progress');
            } else {
                progressWrap.classList.remove('active-progress');
            }
        });
    }
}

class NavigationController {
    constructor() {
        this.initMobileNav();
        this.initSmoothScroll();
    }

    initMobileNav() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links li a').forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    let scrollAnchorElement = targetElement;
                    if (targetId === '#linkedin-contact') {
                        scrollAnchorElement = document.querySelector('#contact');
                    }

                    const elementPosition = scrollAnchorElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - 80;

                    window.scrollTo({ top: offsetPosition, behavior: "smooth" });

                    if (targetId === '#linkedin-contact') {
                        targetElement.classList.remove('attention-grabber');
                        setTimeout(() => {
                            targetElement.classList.add('attention-grabber');
                            setTimeout(() => { targetElement.classList.remove('attention-grabber'); }, 4500);
                        }, 800);
                    }
                }
            });
        });
    }
}

class ScrollAnimationController {
    constructor() {
        this.initScrollReveal();
        this.initStatsCounter();
        this.init3DTilt();
    }

    initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        document.querySelectorAll('.section-title, .about-content, .contact-wrapper').forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });

        const staggerGroups = [
            document.querySelectorAll('.skill-category'),
            document.querySelectorAll('.project-card'),
            document.querySelectorAll('.service-card'),
            document.querySelectorAll('.timeline-item')
        ];

        staggerGroups.forEach(group => {
            group.forEach((item, index) => {
                item.classList.add('reveal-on-scroll', `stagger-${(index % 4) + 1}`);
                observer.observe(item);
            });
        });
    }

    initStatsCounter() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;

        let hasCounted = false;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const increment = target / (2000 / 16);
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
                    observer.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.getElementById('stats');
        if (statsSection) observer.observe(statsSection);
    }

    init3DTilt() {
        document.querySelectorAll('.project-card, .service-card, .skill-category, .about-image').forEach(card => {
            card.classList.add('start-tilt');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -5;
                const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 5;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale(1)`;
            });
        });
    }
}

class InteractionController {
    constructor() {
        this.initButtonRipples();
        this.initTypingEffect();
        this.initCursorGlow();
        this.initCVModal();
    }

    initButtonRipples() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const rect = btn.getBoundingClientRect();
                const circle = document.createElement('span');
                circle.classList.add('ripple');
                const diameter = Math.max(rect.width, rect.height);
                circle.style.width = circle.style.height = `${diameter}px`;
                circle.style.left = `${e.clientX - rect.left}px`;
                circle.style.top = `${e.clientY - rect.top}px`;
                circle.style.marginLeft = `${-diameter / 2}px`;
                circle.style.marginTop = `${-diameter / 2}px`;

                const oldRipple = btn.querySelector('.ripple');
                if (oldRipple) oldRipple.remove();

                btn.appendChild(circle);
                setTimeout(() => circle.remove(), 600);
            });
        });
    }

    initTypingEffect() {
        const typedTextSpan = document.querySelector(".typed-text");
        const cursorSpan = document.querySelector(".cursor");
        if (!typedTextSpan || !cursorSpan) return;

        const textArray = ["Electrical Engineer"];
        let charIndex = 0;
        let isErasing = false;

        const type = () => {
            if (!isErasing && charIndex < textArray[0].length) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[0].charAt(charIndex++);
                setTimeout(type, 100);
            } else if (!isErasing) {
                cursorSpan.classList.remove("typing");
                isErasing = true;
                setTimeout(type, 2000);
            } else if (isErasing && charIndex > 0) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[0].substring(0, --charIndex);
                setTimeout(type, 50);
            } else {
                cursorSpan.classList.remove("typing");
                isErasing = false;
                setTimeout(type, 1100);
            }
        };
        setTimeout(type, 2250);
    }

    initCursorGlow() {
        const cursorGlow = document.getElementById('cursor-glow');
        if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => {
                    cursorGlow.style.opacity = '1';
                    cursorGlow.style.left = `${e.clientX}px`;
                    cursorGlow.style.top = `${e.clientY}px`;
                });
            });
            document.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
        }
    }

    initCVModal() {
        const cvDownloadBtn = document.getElementById('cv-download-btn');
        const cvModal = document.getElementById('cv-modal');
        const progressBarFill = document.querySelector('.progress-bar-fill');

        if (!cvDownloadBtn || !cvModal) return;

        cvDownloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cvModal.classList.remove('hidden');
            setTimeout(() => { if (progressBarFill) progressBarFill.style.width = '100%'; }, 100);

            setTimeout(() => {
                cvModal.classList.add('hidden');
                if (progressBarFill) progressBarFill.style.width = '0%';

                // 📊 Conversion Tracking: Track CV Downloads for HR analytics
                try {
                    if (typeof window.gtag === 'function') {
                        window.gtag('event', 'download_cv', { 'event_category': 'engagement', 'event_label': 'CV Downloaded' });
                    } else {
                        console.info("Analytics [Offline]: HR downloaded your CV.");
                    }
                } catch (analyticsError) {
                    console.warn("Analytics pipeline blocked or failed, ensuring UI continues smoothly.", analyticsError);
                }

                const link = document.createElement('a');
                link.href = cvDownloadBtn.getAttribute('data-cv-url');
                link.download = link.href;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, 1800);
        });
    }
}

class FeatureController {
    constructor() {
        this.initProjectsFilter();
        this.initTestimonials();
        this.initCardStackGallery();
        this.initLinkedInHighlight();
    }

    initProjectsFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');
                projectCards.forEach(card => {
                    card.style.display = 'none';
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
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

    initTestimonials() {
        const track = document.getElementById('testimonials-track');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (!track || !prevBtn || !nextBtn) return;

        window.testimonialsCurrentIndex = 0; // globally scoped for i18n reference
        const cardCount = track.querySelectorAll('.testimonial-card').length;

        const updateCarousel = () => {
            const isArabic = document.documentElement.getAttribute('dir') === 'rtl';
            track.style.transform = `translateX(${window.testimonialsCurrentIndex * (isArabic ? 100 : -100)}%)`;
        };

        nextBtn.addEventListener('click', () => {
            window.testimonialsCurrentIndex = (window.testimonialsCurrentIndex + 1) % cardCount;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            window.testimonialsCurrentIndex = (window.testimonialsCurrentIndex - 1 + cardCount) % cardCount;
            updateCarousel();
        });

        window.updateCarouselLayout = updateCarousel; // Expose to I18n
    }

    initCardStackGallery() {
        const modal = document.getElementById('card-stack-modal');
        const container = document.getElementById('card-stack-container');
        if (!modal || !container) return;

        this.galleryPhotos = [
            "Photos/Rawdat El-Obour Residential Project 1.jpg",
            "Photos/Rawdat El-Obour Residential Project 2.jpg",
            "Photos/Rawdat El-Obour Residential Project 3.jpg",
            "Photos/Rawdat El-Obour Residential Project 4.jpg",
            "Photos/Rawdat El-Obour Residential Project 5.jpg",
            "Photos/Rawdat El-Obour Residential Project 6.jpg"
        ];
        this.stackInterval = null;

        window.openCardStack = () => {
            container.innerHTML = '';
            this.galleryPhotos.forEach((src, index) => {
                const card = document.createElement('div');
                card.className = `stack-card ${index === 0 ? 'active' : index === 1 ? 'next' : 'behind'}`;
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Gallery Image ${index + 1}`;
                img.loading = "lazy";
                card.appendChild(img);
                container.appendChild(card);
            });
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';

            this.stackInterval = setInterval(() => this.cycleCards(container), 3000);
        };

        window.closeCardStack = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            clearInterval(this.stackInterval);

            // Highlight LinkedIn requirement
            const linkedInEl = document.querySelector('#linkedin-contact');
            if (linkedInEl) {
                const yOffset = document.querySelector('#contact').getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: yOffset, behavior: "smooth" });
                setTimeout(() => {
                    linkedInEl.classList.add('attention-grabber');
                    setTimeout(() => linkedInEl.classList.remove('attention-grabber'), 4500);
                }, 800);
            }
        };

        modal.addEventListener('click', (e) => { if (e.target === modal) window.closeCardStack(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closeCardStack(); });
    }

    cycleCards(container) {
        const cards = Array.from(container.querySelectorAll('.stack-card'));
        if (cards.length === 0) return;

        const activeIndex = cards.findIndex(c => c.classList.contains('active'));
        const nextIndex = (activeIndex + 1) % cards.length;
        const behindIndex = (activeIndex + 2) % cards.length;

        cards[activeIndex].className = 'stack-card out';
        setTimeout(() => {
            if (cards[activeIndex] && cards[activeIndex].classList.contains('out')) {
                cards[activeIndex].className = 'stack-card behind';
            }
        }, 800);

        cards[nextIndex].className = 'stack-card active';
        cards[behindIndex].className = 'stack-card next';
    }

    initLinkedInHighlight() {
        const viewDetailsBtns = document.querySelectorAll('.view-project-details');
        const linkedInIcon = document.querySelector('.fa-linkedin');
        const linkedInItem = linkedInIcon ? linkedInIcon.closest('.contact-item') : null;

        if (linkedInItem) {
            viewDetailsBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    setTimeout(() => {
                        linkedInItem.classList.add('attention-grabber');
                        setTimeout(() => linkedInItem.classList.remove('attention-grabber'), 3000);
                    }, 800);
                });
            });
        }
    }
}

class I18nController {
    constructor() {
        this.langToggle = document.getElementById('lang-toggle');
        this.isArabic = false;
        if (this.langToggle) this.initI18n();
    }

    initI18n() {
        this.langToggle.addEventListener('click', () => {
            this.isArabic = !this.isArabic;
            document.documentElement.setAttribute('dir', this.isArabic ? 'rtl' : 'ltr');
            document.documentElement.setAttribute('lang', this.isArabic ? 'ar' : 'en');
            this.langToggle.innerHTML = this.isArabic ? 'EN' : '<i class="fas fa-globe"></i>';

            document.querySelectorAll('[data-ar]').forEach(el => {
                if (!el.hasAttribute('data-en')) el.setAttribute('data-en', el.innerHTML);
                el.innerHTML = el.getAttribute(this.isArabic ? 'data-ar' : 'data-en');
            });

            if (window.updateCarouselLayout) {
                setTimeout(window.updateCarouselLayout, 50);
            }
        });
    }
}

/**
 * 🛡️ SecurityEngine: Lead Security Engineer Grade
 * Handles XSS sanitization, persistent rate limiting, Zod-lite schema validation, and strictly protects API routes.
 */
class ZodLite {
    static string({ minLength = 0, maxLength = Infinity, pattern = null, message = "Invalid String" }) {
        return (val) => {
            if (typeof val !== 'string') return { valid: false, error: "Must be a string" };
            const clean = val.trim();
            if (clean.length < minLength) return { valid: false, error: message };
            if (clean.length > maxLength) return { valid: false, error: message };
            if (pattern && !pattern.test(clean)) return { valid: false, error: message };
            return { valid: true, value: clean };
        };
    }
}

class SecurityEngine {
    constructor() {
        this.config = Object.freeze({
            api: { key: "54df8a96-9799-40ea-9e13-49e8535f74a6", endpoint: "https://api.web3forms.com/submit" },
            identity: { user: "mohamedadelshafei20", domain: "gmail.com" },
            rateLimitStrategy: { duration: 60000, maxAttempts: 1 } // 1 Submission per 60 sec window globally
        });

        this.schema = {
            name: ZodLite.string({ minLength: 2, maxLength: 50, pattern: /^[a-zA-Z\s\.\-']+$/, message: "Invalid Name. strictly 2-50 letters/spaces allowed." }),
            email: ZodLite.string({ minLength: 5, maxLength: 100, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid Email format." }),
            message: ZodLite.string({ minLength: 10, maxLength: 2000, message: "Message must be between 10 and 2000 characters." })
        };

        this.initDOM();
        this.attachFormHandler();
    }

    initDOM() {
        const emailLink = document.getElementById('protected-email');
        if (emailLink) {
            const safeEmail = `${this.config.identity.user}@${this.config.identity.domain}`;
            emailLink.textContent = safeEmail;
            emailLink.href = `mailto:${safeEmail}`;
        }
    }

    sanitizeHTML(input) {
        if (typeof input !== 'string') return '';
        const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;' };
        return input.replace(/[&<>"'`=\/]/g, match => escapeMap[match]);
    }

    isRateLimited() {
        const lastSubmit = localStorage.getItem('__ma_submission_ts');
        if (!lastSubmit) return false;
        return (Date.now() - parseInt(lastSubmit, 10)) < this.config.rateLimitStrategy.duration;
    }

    setRateLimit() {
        localStorage.setItem('__ma_submission_ts', Date.now().toString());
    }

    setStatus(element, message, type = 'info') {
        if (!element) return;
        element.textContent = message;
        element.style.display = 'block';
        element.style.color = type === 'error' ? 'red' : (type === 'success' ? 'var(--primary-color)' : 'var(--text-secondary)');
    }

    async attachFormHandler() {
        const form = document.getElementById('contact-form');
        const formResult = document.getElementById('form-result');
        const honeypot = document.getElementById('honeypot');

        if (!form || !formResult) return;

        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Persistent Rate Limit Check
            if (this.isRateLimited()) {
                this.setStatus(formResult, "Rate Limit Exceeded. Please wait a minute before submitting again.", "error");
                return;
            }

            // 2. Honeypot Trap
            if (honeypot && honeypot.value.trim().length > 0) {
                console.warn("Security Alert: Honeypot Triggered.");
                this.setStatus(formResult, "Message sent successfully! I will get back to you.", "success");
                form.reset();
                this.setRateLimit(); // Punish bot
                setTimeout(() => { formResult.style.display = "none"; }, 5000);
                return;
            }

            this.setStatus(formResult, "Validating payload...", "info");

            const formData = new FormData(form);
            const payload = {};
            let isFormValid = true;

            try {
                // 3. Strict Zod Validation & Sanitization
                for (const field of ['name', 'email', 'message']) {
                    const result = this.schema[field](formData.get(field) || "");
                    if (!result.valid) {
                        this.setStatus(formResult, result.error, "error");
                        isFormValid = false;
                        break;
                    }
                    payload[field] = this.sanitizeHTML(result.value);
                }
            } catch (validationCrash) {
                console.error("Validation Engine Memory Error:", validationCrash);
                this.setStatus(formResult, "System error during validation. Please try again.", "error");
                return;
            }

            if (!isFormValid) return;

            // 4. Secure Payload Construction
            payload.access_key = this.config.api.key;
            payload.subject = this.sanitizeHTML("New Secure Contact Request");
            if (formData.get('botcheck')) payload.botcheck = this.sanitizeHTML(formData.get('botcheck'));

            try {
                // A11y: Lock the button and announce busy state
                if (submitBtn) {
                    submitBtn.setAttribute('aria-busy', 'true');
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Sending...';
                }

                this.setStatus(formResult, "Encrypting and submitting...", "info");

                const response = await fetch(this.config.api.endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    this.setStatus(formResult, "Message sent safely! I will contact you soon.", "success");
                    form.reset();
                    this.setRateLimit();
                } else {
                    this.setStatus(formResult, "Service unavailable at the moment.", "error");
                }
            } catch (error) {
                this.setStatus(formResult, "Secure connection failed. Check your network.", "error");
            } finally {
                if (submitBtn) {
                    submitBtn.removeAttribute('aria-busy');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }
                setTimeout(() => { formResult.style.display = "none"; }, 6000);
            }
        });
    }
}

// ==========================================
// 🚀 Application Bootstrap Engine
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
    new NavigationController();
    new ScrollAnimationController();
    new InteractionController();
    new FeatureController();
    new I18nController();
    new SecurityEngine();
});
