/* ==========================================================================
   Carnatic Cafe - Premium Website JavaScript
   Designed by: Antigravity UI/UX
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-level physics
        smoothWheel: true,
        orientation: 'vertical'
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize Lenis with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);

    // 2. Preloader & Entrance Timeline
    window.addEventListener('load', () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                initHeroEntrance();
            }, 600);
        }
    });

    function initHeroEntrance() {
        const tl = gsap.timeline();
        tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
          .to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
          .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
          .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6')
          .to('.scroll-indicator', { opacity: 1, y: 0, duration: 0.5 }, '-=0.4')
          .to('.floating-cup', { opacity: 0.8, scale: 1, duration: 1, ease: 'back.out(1.7)' }, '-=0.5');
    }

    // 3. Desktop Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        const animateFollower = () => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            requestAnimationFrame(animateFollower);
        };
        requestAnimationFrame(animateFollower);

        // Hover Micro-interactions for Cursor
        const hoverItems = 'a, button, .menu-category-card, .dish-card, .gallery-item, .faq-trigger, .timeline-node, .theme-toggle';
        document.querySelectorAll(hoverItems).forEach(item => {
            item.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            item.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    }

    // 4. Scroll Tracking (Navbar, Back to top, Floating action, Progress bar)
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        
        // Progress Bar
        const progress = document.querySelector('.scroll-progress');
        if (progress) progress.style.width = scrollPercent + '%';

        // Sticky Navbar
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Back To Top Button
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) {
            if (scrollTop > 600) {
                backToTop.classList.add('active');
            } else {
                backToTop.classList.remove('active');
            }
        }

        // Floating Bottom Actions (Mobile & Desktop)
        const floatingActions = document.querySelector('.floating-actions');
        if (floatingActions) {
            if (scrollTop > 400) {
                floatingActions.classList.add('active');
            } else {
                floatingActions.classList.remove('active');
            }
        }
        
        // Active Nav Link highlight based on scroll position
        const sections = document.querySelectorAll('section[id], header[id]');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${id}"]`);
            
            if (navLink && scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        });
    });

    // Back to top click handler
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            lenis.scrollTo(0, { duration: 1.5 });
        });
    }

    // Smooth scroll for all hash anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, { offset: -80, duration: 1.5 });
            }
        });
    });

    // 5. Mobile Burger Menu
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('active');
            if (navMenu.classList.contains('active')) {
                lenis.stop(); // Freeze background scrolling
            } else {
                lenis.start();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navMenu.classList.remove('active');
                lenis.start();
            });
        });
    }

    // 6. Theme Manager (Light/Dark Mode Toggle)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        const getPreferredTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) return savedTheme;
            return systemPrefersDark.matches ? 'dark' : 'light';
        };

        const setTheme = (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            if (themeIcon) {
                themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        };

        // Initialize theme
        setTheme(getPreferredTheme());

        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // 7. About Section Counter Animations
    const statsSection = document.querySelector('.about-stats');
    let statsAnimated = false;

    if (statsSection) {
        const animateStats = () => {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds animation
                const stepTime = 30;
                const steps = duration / stepTime;
                const increment = target / steps;
                let current = 0;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.innerText = target + (counter.getAttribute('data-suffix') || '');
                        clearInterval(timer);
                    } else {
                        counter.innerText = Math.floor(current) + (counter.getAttribute('data-suffix') || '');
                    }
                }, stepTime);
            });
        };

        ScrollTrigger.create({
            trigger: statsSection,
            start: 'top 80%',
            onEnter: () => {
                if (!statsAnimated) {
                    animateStats();
                    statsAnimated = true;
                }
            }
        });
    }

    // 8. Dining Timeline Slider Interaction
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const panes = document.querySelectorAll('.timeline-detail-pane');
    const progress = document.querySelector('.timeline-progress');

    if (timelineNodes.length > 0 && progress) {
        timelineNodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                // Update dots active class
                timelineNodes.forEach(n => n.classList.remove('active'));
                node.classList.add('active');

                // Update detail pane transition
                panes.forEach(pane => {
                    pane.classList.remove('active');
                    pane.style.display = 'none';
                });
                
                const activePane = panes[index];
                activePane.style.display = 'flex';
                // Trigger reflow to restart animation
                void activePane.offsetWidth;
                activePane.classList.add('active');

                // Update timeline progress bar width
                const pct = (index / (timelineNodes.length - 1)) * 100;
                progress.style.width = pct + '%';
            });
        });
    }

    // 9. Menu Categories Modal Manager
    const modal = document.getElementById('menu-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalIcon = document.getElementById('modal-icon');
    const modalText = document.getElementById('modal-text');
    const modalClose = document.getElementById('modal-close');
    const modalBackdrop = document.getElementById('modal-backdrop');

    const categoryData = {
        breakfast: {
            title: "Traditional Breakfast",
            icon: "fa-solid fa-mug-hot",
            text: "Start your day with hot, fluffy idlis dipped in fresh sambar, crispy spiced vadas, and hand-frothed Filter Coffee. Experience the genuine taste of a Bangalore morning, served daily starting 10:00 AM."
        },
        dosas: {
            title: "Signature Dosas",
            icon: "fa-solid fa-circle-notch",
            text: "Our pride. Savor our butter-laden Benne Dosa, the spicy Malleswaram Dosa, or the perfectly crispy Set Dosa. Made from top-quality fermented rice-lentil batter and pure ghee, crisp outside and soft inside."
        },
        idlis: {
            title: "Soft Steamed Idlis",
            icon: "fa-solid fa-circle",
            text: "Incredibly soft, cloud-like steamed rice cakes served with authentic Karnataka gun powder (podi) mixed with melted ghee, spicy sambar, and cool coconut chutney."
        },
        vadas: {
            title: "Crispy Fried Vadas",
            icon: "fa-solid fa-circle-dot",
            text: "Savory lentil donuts, crisped golden brown on the exterior and fluffy within. Infused with crushed black peppercorns, curry leaves, and ginger for a delicious spice kick."
        },
        coffee: {
            title: "Premium Filter Coffee",
            icon: "fa-solid fa-coffee",
            text: "Brewed to perfection using the finest chicory-coffee blend from Karnataka, dynamically frothed in traditional brass tumblers. Rich, aromatic, and deeply satisfying."
        },
        desserts: {
            title: "Divine Desserts",
            icon: "fa-solid fa-ice-cream",
            text: "Satisfy your sweet tooth with our legendary melt-in-your-mouth Mysore Pak, cardamom-infused Kesari Bath, or sweet Pongal, made using pure ghee and organic jaggery."
        },
        healthy: {
            title: "Healthy Veg Selections",
            icon: "fa-solid fa-leaf",
            text: "Clean, light, and nutritious South Indian delicacies prepared with healthy grains, coconut oil, and locally sourced organic vegetables to keep your dining light and wholesome."
        }
    };

    if (modal && modalTitle && modalText) {
        document.querySelectorAll('.menu-category-card').forEach(card => {
            card.addEventListener('click', () => {
                const cat = card.getAttribute('data-category');
                if (categoryData[cat]) {
                    modalTitle.innerText = categoryData[cat].title;
                    modalIcon.className = categoryData[cat].icon + " menu-modal-icon";
                    modalText.innerText = categoryData[cat].text;
                    modal.classList.add('active');
                    lenis.stop();
                }
            });
        });

        const closeMenuModal = () => {
            modal.classList.remove('active');
            lenis.start();
        };

        if (modalClose) modalClose.addEventListener('click', closeMenuModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeMenuModal);
    }

    // 10. Reviews Carousel (Testimonial Infinite Marquee CSS-driven)
    // Managed via marquee class and hover pause styles in CSS.

    // 11. Pinterest Lightbox Modal for Gallery
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightbox && lightboxImg && lightboxClose) {
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    lenis.stop();
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lenis.start();
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg && e.target !== lightboxClose) {
                closeLightbox();
            }
        });
    }

    // 12. FAQ Accordion Toggle
    document.querySelectorAll('.faq-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.parentNode;
            const content = item.querySelector('.faq-content');
            const isActive = item.classList.contains('active');

            // Close other accordions for clean UX
            document.querySelectorAll('.faq-item').forEach(el => {
                el.classList.remove('active');
                const inner = el.querySelector('.faq-content');
                if (inner) inner.style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });

    // 13. Smart Live Hours Status Card
    function updateLiveHoursStatus() {
        const statusBadge = document.getElementById('live-status-badge');
        const countdownTimer = document.getElementById('live-countdown');
        if (!statusBadge || !countdownTimer) return;

        // Current Local Time check
        const now = new Date();
        const curHour = now.getHours();
        const curMin = now.getMinutes();
        const timeInMinutes = curHour * 60 + curMin;

        // Opening timings: 10:00 (600 mins) to 22:30 (1350 mins)
        const openLimit = 10 * 60;
        const closeLimit = 22 * 60 + 30;

        if (timeInMinutes >= openLimit && timeInMinutes < closeLimit) {
            statusBadge.innerText = '🟢 Open Now';
            statusBadge.className = 'live-badge open';

            const remaining = closeLimit - timeInMinutes;
            const hours = Math.floor(remaining / 60);
            const mins = remaining % 60;
            let timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

            countdownTimer.innerHTML = `We close in <span>${timeString}</span>. Call to book your visit!`;
        } else {
            statusBadge.innerText = '🔴 Closed';
            statusBadge.className = 'live-badge closed';

            let remaining = 0;
            if (timeInMinutes < openLimit) {
                remaining = openLimit - timeInMinutes;
            } else {
                remaining = (24 * 60 - timeInMinutes) + openLimit;
            }

            const hours = Math.floor(remaining / 60);
            const mins = remaining % 60;
            let timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

            countdownTimer.innerHTML = `We open in <span>${timeString}</span> (at 10:00 AM).`;
        }
    }
    updateLiveHoursStatus();
    setInterval(updateLiveHoursStatus, 30000); // refresh every 30s

    // 14. GSAP Scroll Animations
    // Slide fade-in reveals for general elements
    const revealElements = document.querySelectorAll('.gsap-reveal');
    revealElements.forEach(el => {
        gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    });

    // Stagger fade-in reveals for card grids
    const staggerGrids = document.querySelectorAll('.gsap-stagger-grid');
    staggerGrids.forEach(grid => {
        const items = grid.querySelectorAll('.gsap-stagger-item');
        gsap.from(items, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: grid,
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });
    });
});
