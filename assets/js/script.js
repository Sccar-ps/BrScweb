document.addEventListener('DOMContentLoaded', () => {
    setupScrollProgress();
    setupConsolidatedScroll();
    setupTabs();
    setupSmoothScroll();
    addEntranceAnimations();
    setupMobileNav();
    setupMatrixRain();
    setupPageTransitions();
    setupScrollTopButton();
    setupScrollHint();
    setupStaggeredCards();
});

// ─── Scroll Progress Bar ────────────────────────────────
function setupScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);
    // Updates happen in consolidated scroll handler
    bar._update = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            bar.style.width = (window.scrollY / docHeight * 100) + '%';
        }
    };
}

// ─── Consolidated Scroll Handler ────────────────────────
function setupConsolidatedScroll() {
    const header = document.querySelector('.site-header, header');
    const scrollBar = document.querySelector('.scroll-progress');
    const scrollTopBtn = document.querySelector('.scroll-top');
    const scrollHint = document.querySelector('.scroll-hint');
    const heroRight = document.querySelector('.hero-section__media, .hero-right');
    const heroLeft = document.querySelector('.hero-section__content, .hero-left');
    const hasParallax = heroRight || heroLeft;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY;

            // Header shrink
            if (header) {
                header.classList.toggle('scrolled', scrollY > 60);
            }

            // Scroll progress bar
            if (scrollBar && scrollBar._update) {
                scrollBar._update();
            }

            // Scroll-to-top button
            if (scrollTopBtn) {
                scrollTopBtn.classList.toggle('visible', scrollY > 400);
            }

            // Scroll hint visibility
            if (scrollHint) {
                scrollHint.classList.toggle('hidden', scrollY > 100);
            }

            // Parallax (only when hero is in view)
            if (hasParallax && scrollY < window.innerHeight) {
                if (heroRight) {
                    heroRight.style.transform = `translateY(${scrollY * 0.06}px)`;
                }
                if (heroLeft) {
                    heroLeft.style.transform = `translateY(${scrollY * 0.03}px)`;
                }
            }

            ticking = false;
        });
    }, { passive: true });
}

// ─── Tabs com crossfade ─────────────────────────────────
function setupTabs() {
    const tabs = document.querySelectorAll('.tabs__trigger, .ficha .aba a');
    const tabItems = document.querySelectorAll('.tabs__item, .ficha .aba');
    const contents = document.querySelectorAll('.tabs__panel, .tab-content');
    if (contents.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            tabItems.forEach(item => item.classList.remove('is-active'));
            tabs.forEach(trigger => trigger.setAttribute('aria-selected', 'false'));

            const tabItem = tab.closest('.tabs__item, .aba');
            if (tabItem) {
                tabItem.classList.add('is-active');
            }
            tab.setAttribute('aria-selected', 'true');

            const href = tab.getAttribute('href');
            const targetId = href.startsWith('#') ? href.substring(1) : null;
            if (!targetId) return;

            const activeContent = document.querySelector('.tabs__panel.is-active, .tab-content.active-content');
            
            if (activeContent && activeContent.id !== targetId) {
                activeContent.style.opacity = '0';
                activeContent.style.transform = 'translateY(8px)';
                
                setTimeout(() => {
                    contents.forEach(c => {
                        c.style.display = 'none';
                        c.classList.remove('active-content');
                        c.classList.remove('is-active');
                        c.hidden = true;
                    });

                    const target = document.getElementById(targetId);
                    if (target) {
                        target.hidden = false;
                        target.style.display = 'block';
                        target.style.opacity = '0';
                        target.style.transform = 'translateY(8px)';
                        
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                target.classList.add('active-content');
                                target.classList.add('is-active');
                                target.style.opacity = '';
                                target.style.transform = '';
                            });
                        });
                    }
                }, 200);
            } else if (!activeContent) {
                const target = document.getElementById(targetId);
                if (target) {
                    target.hidden = false;
                    target.style.display = 'block';
                    requestAnimationFrame(() => {
                        target.classList.add('active-content');
                        target.classList.add('is-active');
                    });
                }
            }
        });
    });
}

// ─── Smooth scroll ──────────────────────────────────────
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.matches('.tabs__trigger') || this.closest('.tabs__list, .ficha')) {
                return;
            }

            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// ─── Mobile nav ─────────────────────────────────────────
function setupMobileNav() {
    const toggle = document.querySelector('.site-header__menu-toggle, .nav-toggle');
    const navList = document.querySelector('.site-header__nav-list, nav ul');
    if (!toggle || !navList) return;

    const closeMenu = () => {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-open')
            && !e.target.closest('nav, .site-header__nav')
            && !e.target.closest('.nav-toggle, .site-header__menu-toggle')) {
            closeMenu();
        }
    });
}

// ─── Entrance animations ────────────────────────────────
function addEntranceAnimations() {
    const elements = document.querySelectorAll('section:not(.hero-full):not(.hero-section), .barra, fieldset, .tabs-card, .intro-card, .updates-intro, .panel, .section-panel');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    elements.forEach(el => {
        el.classList.add('fade-up-hidden');
        observer.observe(el);
    });

    // Hero elements — staggered slide in
    const heroLeft = document.querySelector('.hero-section__content, .hero-left');
    const heroRight = document.querySelector('.hero-section__media, .hero-right');

    if (heroLeft) {
        heroLeft.classList.add('slide-in-left');
        requestAnimationFrame(() => {
            setTimeout(() => heroLeft.classList.add('visible'), 150);
        });
    }
    if (heroRight) {
        heroRight.classList.add('slide-in-right');
        requestAnimationFrame(() => {
            setTimeout(() => heroRight.classList.add('visible'), 350);
        });
    }
}

// ─── Staggered cards animation ──────────────────────────
function setupStaggeredCards() {
    const grids = document.querySelectorAll('.services-grid, .certification-grid, .tech-grid, .skill-grid, .contact-grid, .contact-list');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(16px)';
                    child.style.transition = `opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.06}s, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.06}s`;
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            child.style.opacity = '1';
                            child.style.transform = 'translateY(0)';
                        });
                    });
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    grids.forEach(grid => observer.observe(grid));
}

// ─── Page transitions ───────────────────────────────────
function setupPageTransitions() {
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = href;
            }, 280);
        });
    });
}

// ─── Scroll to top button ───────────────────────────────
function setupScrollTopButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top';
    btn.setAttribute('aria-label', 'Voltar ao topo');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    // Visibility toggled by consolidated scroll handler
}

// ─── Scroll hint on hero ────────────────────────────────
function setupScrollHint() {
    const hero = document.querySelector('.hero-section, .hero-full');
    if (!hero) return;

    const hint = document.createElement('div');
    hint.className = 'scroll-hint hero-section__scroll-hint';
    hint.innerHTML = '<span>Scroll</span><span class="scroll-hint-arrow"></span>';
    hero.appendChild(hint);
    // Visibility toggled by consolidated scroll handler
}

// ─── Matrix Rain (otimizada) ────────────────────────────
function setupMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth <= 768;
    let columns, drops;
    const fontSize = isMobile ? 16 : 14; // Larger = fewer columns on mobile
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');
    let animId;

    function initDrops(cols) {
        const arr = [];
        for (let i = 0; i < cols; i++) {
            arr[i] = Math.random() * -100;
        }
        return arr;
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const newCols = Math.floor(canvas.width / fontSize);
        if (newCols !== columns) {
            columns = newCols;
            drops = initDrops(columns);
        }
    }
    resize();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 200);
    });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animId);
        } else {
            lastDraw = 0;
            animId = requestAnimationFrame(draw);
        }
    });

    let lastDraw = 0;
    const drawInterval = isMobile ? 80 : 55; // Slower frame rate on mobile

    function draw(timestamp) {
        animId = requestAnimationFrame(draw);
        if (timestamp - lastDraw < drawInterval) return;
        lastDraw = timestamp;

        ctx.fillStyle = 'rgba(5, 6, 8, 0.06)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            const brightness = 0.7 + Math.random() * 0.3;
            ctx.fillStyle = `rgba(139, 92, 246, ${brightness * 0.85})`;
            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.5;
        }
    }

    animId = requestAnimationFrame(draw);
}
