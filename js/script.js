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
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
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
});
