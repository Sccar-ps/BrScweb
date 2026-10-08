// ─── Idade e ano (sempre atualizados, sem editar o HTML) ───────────────
function ageFrom(isoDate, now = new Date()) {
    const [year, month, day] = isoDate.split('-').map(Number);
    const hadBirthday = now.getMonth() + 1 > month || (now.getMonth() + 1 === month && now.getDate() >= day);
    return now.getFullYear() - year - (hadBirthday ? 0 : 1);
}

function setupDates() {
    document.querySelectorAll('[data-age]').forEach(el => {
        el.textContent = ageFrom(el.dataset.birth);
    });
    document.querySelectorAll('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
    });
}

// ─── Rolagem: header, barra de progresso e botão de topo ───────────────
function setupScroll() {
    const header = document.querySelector('.site-header');
    const progress = document.querySelector('.scroll-progress');
    const topButton = document.querySelector('.scroll-top');
    let ticking = false;

    const update = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        header?.classList.toggle('is-scrolled', y > 24);
        progress?.style.setProperty('--progress', max > 0 ? Math.min(y / max, 1) : 0);
        topButton?.classList.toggle('is-visible', y > 480);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });
    update();

    topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Menu mobile ───────────────────────────────────────────────────────
function setupNav() {
    const header = document.querySelector('.site-header');
    const toggle = header?.querySelector('.nav-toggle');
    if (!toggle) return;

    const setOpen = open => {
        header.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };

    toggle.addEventListener('click', () => setOpen(!header.classList.contains('is-open')));
    header.querySelectorAll('.site-nav__link').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('click', e => {
        if (!header.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && header.classList.contains('is-open')) {
            setOpen(false);
            toggle.focus();
        }
    });
}

// ─── Revelar elementos ao rolar (com escalonamento em grades) ──────────
function setupReveal() {
    document.querySelectorAll('[data-stagger]').forEach(group => {
        Array.from(group.children).forEach((child, i) => child.style.setProperty('--reveal-delay', `${i * 70}ms`));
    });

    const items = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    items.forEach(el => observer.observe(el));
}

// ─── Brilho dos cartões seguindo o cursor ──────────────────────────────
function setupSpotlight() {
    if (!window.matchMedia('(hover: hover)').matches) return;

    document.addEventListener('pointermove', e => {
        const card = e.target.closest?.('.card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    }, { passive: true });
}

setupDates();
setupScroll();
setupNav();
setupReveal();
setupSpotlight();
