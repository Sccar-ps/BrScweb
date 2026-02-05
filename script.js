// Script para interatividade
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupSmoothScroll();
    addEntranceAnimations();
    setupMobileNav();
    // Removed theme toggle
    setupMatrixRain();
});

// Sistema de Abas (Tabs) para Projetos
function setupTabs() {
    const tabs = document.querySelectorAll('.ficha .aba a');
    const contents = document.querySelectorAll('.tab-content');

    if (contents.length === 0) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove estado ativo de todas as abas
            tabs.forEach(t => t.parentElement.removeAttribute('id'));
            
            // Adiciona estado ativo na aba clicada
            tab.parentElement.setAttribute('id', 'ativo');
            
            // Mapeia qual aba corresponde a qual conteúdo
            const href = tab.getAttribute('href').split('/').pop();
            const targetMap = {
                'index2.html': 'projeto1',
                'index2x1.html': 'projeto2',
                'index2x2.html': 'projeto3'
            };

            const targetId = targetMap[href];

            // Esconde os conteúdos
            contents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active-content');
            });

            // Mostra o conteúdo alvo
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
                requestAnimationFrame(() => {
                    targetContent.classList.add('active-content');
                });
            }
        });
    });
}

// Scroll suave
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href') !== "#") {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Navegação mobile (menu colapsável)
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
}

// Animações de entrada
function addEntranceAnimations() {
    const elements = document.querySelectorAll('section, .barra, fieldset, .intro-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => {
        el.classList.add('fade-up-hidden');
        observer.observe(el);
    });
}

// Animação Matrix Rain
function setupMatrixRain() {
    // Cria o canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Fallback se canvas não suportado
    
    // Configura tamanho
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Caracteres para a chuva
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    
    // Tenta recuperar estado salvo ou cria novo
    let drops = [];
    let savedDrops = null;
    
    try {
        savedDrops = sessionStorage.getItem('matrixDrops');
    } catch (e) {
        // sessionStorage não disponível
    }
    
    if (savedDrops) {
        try {
            const parsed = JSON.parse(savedDrops);
            // Verifica se o tamanho ainda é compatível
            if (parsed.length === columns) {
                drops = parsed;
            } else {
                for (let i = 0; i < columns; i++) {
                    drops[i] = Math.random() * -100;
                }
            }
        } catch (e) {
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.random() * -100;
            }
        }
    } else {
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }
    }
    
    // Salva estado antes de sair da página
    window.addEventListener('beforeunload', () => {
        try {
            sessionStorage.setItem('matrixDrops', JSON.stringify(drops));
        } catch (e) {
            // sessionStorage não disponível
        }
    });
    
    // Também salva ao clicar em links de navegação
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            try {
                sessionStorage.setItem('matrixDrops', JSON.stringify(drops));
            } catch (e) {
                // sessionStorage não disponível
            }
        });
    });
    
    // Função de desenho
    function draw() {
        // Fundo semi-transparente para criar efeito de fade
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            ctx.fillStyle = 'rgba(5, 6, 8, 0.06)';
        } else {
            ctx.fillStyle = 'rgba(245, 247, 251, 0.05)';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Cor das letras
        if (isDark) {
            ctx.fillStyle = 'rgba(210, 176, 106, 0.85)';
        } else {
            ctx.fillStyle = 'rgba(120, 93, 40, 0.7)';
        }
        ctx.font = 'bold ' + fontSize + 'px monospace';
        
        // Desenha caracteres
        for (let i = 0; i < drops.length; i++) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;
            
            ctx.fillText(char, x, y);
            
            // Reset quando sai da tela
            if (y > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            drops[i] += 0.5; // Velocidade lenta
        }
    }
    
    // Loop de animação
    setInterval(draw, 50);
}
