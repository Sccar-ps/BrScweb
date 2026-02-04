// Script para interatividade modernizada
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupSmoothScroll();
    addEntranceAnimations();
    setupThemeToggle();
    setupMatrixRain();
});

// Sistema de Tema Escuro/Claro
function setupThemeToggle() {
    // Cria o botão de toggle
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.setAttribute('aria-label', 'Alternar tema');
    toggleBtn.innerHTML = `
        <svg class="moon-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>
        </svg>
        <svg class="sun-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
        </svg>
    `;
    document.body.appendChild(toggleBtn);

    // Carrega tema salvo ou usa preferência do sistema
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (e) {
        // localStorage não disponível (modo privado/bloqueado)
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Toggle do tema
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        try {
            localStorage.setItem('theme', newTheme);
        } catch (e) {
            // localStorage não disponível
        }
    });
}

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

            // Esconde todos os conteúdos
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
    if (!ctx) return; // Fallback se canvas não for suportado
    
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
            ctx.fillStyle = 'rgba(15, 23, 42, 0.04)';
        } else {
            ctx.fillStyle = 'rgba(232, 238, 247, 0.04)';
        }
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Cor das letras
        if (isDark) {
            ctx.fillStyle = 'rgba(96, 165, 250, 0.8)';
        } else {
            ctx.fillStyle = 'rgba(37, 99, 235, 0.75)';
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
