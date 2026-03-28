// Script para interatividade — versão melhorada com transições fluidas
document.addEventListener('DOMContentLoaded', () => {
    setupScrollProgress();
    setupHeaderShrink();
    setupTabs();
    setupSmoothScroll();
    addEntranceAnimations();
    setupMobileNav();
    setupMatrixRain();
    setupPageTransitions();
    setupScrollTopButton();
    setupParallax();
    setupScrollHint();
    setupStaggeredCards();
});

// ─── Scroll Progress Bar ────────────────────────────────
function setupScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            bar.style.width = (scrollTop / docHeight * 100) + '%';
        }
    }, { passive: true });
}

// ─── Header shrink on scroll ────────────────────────────
function setupHeaderShrink() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ─── Tabs com crossfade ─────────────────────────────────
function setupTabs() {
    const tabs = document.querySelectorAll('.ficha .aba a');
    const contents = document.querySelectorAll('.tab-content');

    if (contents.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();

            tabs.forEach(t => t.parentElement.removeAttribute('id'));
            tab.parentElement.setAttribute('id', 'ativo');

            const href = tab.getAttribute('href');
            let targetId = href.startsWith('#') ? href.substring(1) : null;
            
            // Fallback for old file-based links if they still exist anywhere
            if (!targetId) {
                const mapOldLinks = {
                    'index2.html': 'projeto1',
                    'index2x1.html': 'projeto2',
                    'index2x2.html': 'projeto3'
                };
                targetId = mapOldLinks[href.split('/').pop()];
            }

            // Crossfade: fade out active, then fade in target
            const activeContent = document.querySelector('.tab-content.active-content');
            
            if (activeContent && activeContent.id !== targetId) {
                activeContent.style.opacity = '0';
                activeContent.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    contents.forEach(c => {
                        c.style.display = 'none';
                        c.classList.remove('active-content');
                    });

                    const target = document.getElementById(targetId);
                    if (target) {
                        target.style.display = 'block';
                        target.style.opacity = '0';
                        target.style.transform = 'translateY(10px)';
                        
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                target.classList.add('active-content');
                                target.style.opacity = '';
                                target.style.transform = '';
                            });
                        });
                    }
                }, 250);
            } else if (!activeContent) {
                const target = document.getElementById(targetId);
                if (target) {
                    target.style.display = 'block';
                    requestAnimationFrame(() => {
                        target.classList.add('active-content');
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
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

// ─── Mobile nav ─────────────────────────────────────────
function setupMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('nav ul');

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
        link.addEventListener('click', () => {
            if (document.body.classList.contains('nav-open')) {
                closeMenu();
            }
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (document.body.classList.contains('nav-open') 
            && !e.target.closest('nav') 
            && !e.target.closest('.nav-toggle')) {
            closeMenu();
        }
    });
}

// ─── Entrance animations (staggered) ───────────────────
function addEntranceAnimations() {
    const elements = document.querySelectorAll('section, .barra, fieldset, .intro-card, .panel');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => {
        el.classList.add('fade-up-hidden');
        observer.observe(el);
    });

    // Hero elements — slide in left/right
    const heroLeft = document.querySelector('.hero-left');
    const heroRight = document.querySelector('.hero-right');
    if (heroLeft) {
        heroLeft.classList.add('slide-in-left');
        setTimeout(() => heroLeft.classList.add('visible'), 200);
    }
    if (heroRight) {
        heroRight.classList.add('slide-in-right');
        setTimeout(() => heroRight.classList.add('visible'), 400);
    }
}

// ─── Staggered cards animation ──────────────────────────
function setupStaggeredCards() {
    const grids = document.querySelectorAll('.services-grid, .tech-grid');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const children = entry.target.children;
                Array.from(children).forEach((child, i) => {
                    child.style.opacity = '0';
                    child.style.transform = 'translateY(20px)';
                    child.style.transition = `opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08}s, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.08}s`;
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
    // Intercept local navigation links for smooth page transitions
    document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        // Only intercept local HTML links (not external, not anchors, not javascript)
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Save matrix state before transition
            try {
                const canvas = document.getElementById('matrix-canvas');
                if (canvas && canvas._matrixDrops) {
                    sessionStorage.setItem('matrixDrops', JSON.stringify(canvas._matrixDrops));
                }
            } catch (err) { /* ignore */ }

            document.body.classList.add('page-exit');
            setTimeout(() => {
                window.location.href = href;
            }, 300);
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

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}



// ─── Parallax on scroll ─────────────────────────────────
function setupParallax() {
    const heroRight = document.querySelector('.hero-right');
    const heroLeft = document.querySelector('.hero-left');
    if (!heroRight && !heroLeft) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                if (heroRight) {
                    heroRight.style.transform = `translateY(${scrollY * 0.08}px)`;
                }
                if (heroLeft) {
                    heroLeft.style.transform = `translateY(${scrollY * 0.04}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ─── Scroll hint on hero ────────────────────────────────
function setupScrollHint() {
    const hero = document.querySelector('.hero-full');
    if (!hero) return;

    const hint = document.createElement('div');
    hint.className = 'scroll-hint';
    hint.innerHTML = '<span>Scroll</span><span class="scroll-hint-arrow"></span>';
    hero.appendChild(hint);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            hint.classList.add('hidden');
        } else {
            hint.classList.remove('hidden');
        }
    }, { passive: true });
}

// ─── Matrix Rain (otimizada com requestAnimationFrame) ──
function setupMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let columns, drops;
    const fontSize = 14;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');

    function initDrops(cols) {
        const arr = [];
        let savedDrops = null;
        try { savedDrops = sessionStorage.getItem('matrixDrops'); } catch (e) { /* ignore */ }

        if (savedDrops) {
            try {
                const parsed = JSON.parse(savedDrops);
                if (parsed.length === cols) return parsed;
            } catch (e) { /* ignore */ }
        }
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
        resizeTimer = setTimeout(resize, 150);
    });

    // Store drops on canvas element for page transition access
    canvas._matrixDrops = drops;

    window.addEventListener('beforeunload', () => {
        try { sessionStorage.setItem('matrixDrops', JSON.stringify(drops)); } catch (e) { /* ignore */ }
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            try { sessionStorage.setItem('matrixDrops', JSON.stringify(drops)); } catch (e) { /* ignore */ }
        });
    });

    // Throttled drawing with requestAnimationFrame
    let lastDraw = 0;
    const drawInterval = 50; // ms between frames

    function draw(timestamp) {
        requestAnimationFrame(draw);

        if (timestamp - lastDraw < drawInterval) return;
        lastDraw = timestamp;

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        ctx.fillStyle = isDark ? 'rgba(5, 6, 8, 0.06)' : 'rgba(245, 247, 251, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = 'bold ' + fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            // Slight color variation for depth
            const brightness = 0.7 + Math.random() * 0.3;
            if (isDark) {
                ctx.fillStyle = `rgba(139, 92, 246, ${brightness * 0.85})`;
            } else {
                ctx.fillStyle = `rgba(99, 102, 241, ${brightness * 0.7})`;
            }

            ctx.fillText(char, x, y);

            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i] += 0.5;
        }

        // Keep reference updated
        canvas._matrixDrops = drops;
    }

    requestAnimationFrame(draw);
}
