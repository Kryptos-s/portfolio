/*
main.js — global stuff
theme switcher, active nav link, scroll fade-in, sidebar updates, hero typewriter.
*/

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    setActiveNavLink();
    initScrollAnimations();
    loadSidebarUpdates();
    startHeroAnimation();
});

// --- Theme Switching ---
function initThemeSwitcher() {
    const switcher = document.getElementById('theme-switcher');
    if (!switcher) return;

    const rootEl = document.documentElement;
    const themes = ['dark', 'light', 'purple'];

    let currentTheme = rootEl.getAttribute('data-theme') || 'dark';
    updateSwitcherLabel(currentTheme);

    switcher.addEventListener('click', () => {
        const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
        const nextTheme = themes[nextIndex];
        rootEl.setAttribute('data-theme', nextTheme);
        try { localStorage.setItem('theme', nextTheme); } catch (_) {}
        currentTheme = nextTheme;
        updateSwitcherLabel(nextTheme);
    });
}

function updateSwitcherLabel(theme) {
    const switcher = document.getElementById('theme-switcher');
    if (!switcher) return;
    switcher.textContent = theme.toUpperCase().substring(0, 1);
    switcher.title = `Current Theme: ${theme}. Click to switch.`;
}

// --- Navigation Active State ---
function setActiveNavLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.main-nav .nav-link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (path === '/' && href === '/') {
            link.classList.add('active');
        } else if (href !== '/' && path.startsWith(href)) {
            link.classList.add('active');
        }
    });
}

// --- Scroll/Entry Animations ---
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section-fade-in');
    if (!sections.length) return;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
}

// --- Sidebar Content ---
function loadSidebarUpdates() {
    const updates = [
        { date: 'Nov 2025', text: 'wrapping up a C++ networking project. release soon.' },
        { date: 'Oct 2025', text: 'studying for Security+.' },
        { date: 'Sep 2025', text: 'SPSE here i come.' },
        { date: 'Aug 2025', text: 'deep dive into Rust.' }
    ];

    const container = document.querySelector('.sidebar .terminal-box');
    if (!container) return;

    container.textContent = '';
    const frag = document.createDocumentFragment();
    updates.forEach(update => {
        const item = document.createElement('div');
        item.className = 'update-item';
        const span = document.createElement('span');
        span.textContent = `// ${update.date}`;
        item.appendChild(span);
        item.appendChild(document.createTextNode(' ' + update.text));
        frag.appendChild(item);
    });
    container.appendChild(frag);
}

// --- Hero typewriter ---
function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function typeLine(el, text, speed = 100) {
    el.classList.add('typing-effect');
    for (const char of text) {
        el.textContent += char;
        await wait(speed);
    }
    el.classList.remove('typing-effect');
    el.classList.add('with-cursor');
}

async function startHeroAnimation() {
    const promptEl = document.getElementById('hero-prompt');
    const nameEl = document.getElementById('hero-name');
    const taglineEl = document.getElementById('hero-tagline');
    const actionsEl = document.getElementById('hero-actions');

    if (!(promptEl && nameEl && taglineEl && actionsEl)) return;

    await wait(500);

    promptEl.classList.add('typing-effect');
    await wait(1000);
    for (const char of '$ whoami') {
        promptEl.textContent += char;
        await wait(75);
    }
    promptEl.classList.remove('typing-effect');

    await wait(300);
    await typeLine(nameEl, 'KRYPTOS', 120);

    nameEl.classList.remove('with-cursor');
    await typeLine(taglineEl, '// cyber sec // reverse engineer // C-family dev', 50);

    actionsEl.classList.remove('hidden-until-ready');
}
