/*
====================================
main.js - Global Scripts
- Theme Switching (localStorage)
- Navigation Active State
- Scroll/Entry Animations
====================================
*/

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    setActiveNavLink();
    initScrollAnimations();
    loadSidebarUpdates();
});

// --- Theme Switching ---
function initThemeSwitcher() {
    const switcher = document.getElementById('theme-switcher');
    const rootEl = document.documentElement; // We target <html>
    const themes = ['dark', 'light', 'purple']; // Ordered list of themes

    // 1. Read the current theme *from* the <html> tag (set by anti-flicker script)
    let currentTheme = rootEl.getAttribute('data-theme') || 'dark';
    
    // Update switcher label on load
    updateSwitcherLabel(currentTheme);

    switcher.addEventListener('click', () => {
        let currentIndex = themes.indexOf(currentTheme);
        let nextIndex = (currentIndex + 1) % themes.length;
        let nextTheme = themes[nextIndex];

        // 2. Set new theme on <html>
        rootEl.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        currentTheme = nextTheme;

        updateSwitcherLabel(nextTheme);
    });
}

function updateSwitcherLabel(theme) {
    const switcher = document.getElementById('theme-switcher');
    if (switcher) {
        switcher.textContent = theme.toUpperCase().substring(0, 1); 
        switcher.title = `Current Theme: ${theme}. Click to switch.`;
    }
}

// --- Navigation Active State ---
function setActiveNavLink() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.main-nav .nav-link');
    
    // Determine the current page file name
    let currentPage = path.split('/').pop();
    if (currentPage === '') {
        currentPage = 'index.html'; // Treat root as index.html
    }

    links.forEach(link => {
        let linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === '') {
            linkPage = 'index.html';
        }
        
        // Check for exact match
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// --- Scroll/Entry Animations (Intersection Observer) ---
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section-fade-in');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the section is visible
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// --- Sidebar Content ---
function loadSidebarUpdates() {
    const updates = [
        { date: 'Nov 2025', text: 'Finalizing a complex C++ networking project, soon release...' },
        { date: 'Oct 2025', text: 'Actively studying for the CompTIA Security+ certification exam.' },
        { date: 'Sep 2025', text: 'SPSE here i come.' },
        { date: 'Aug 2025', text: 'Deep dive into Rust.' }
    ];

    const container = document.querySelector('.sidebar .terminal-box');
    
    // Check if the container exists before trying to set its HTML
    if (container) {
        container.innerHTML = updates.map(update => `
            <div class="update-item">
                <span>// ${update.date}</span>
                ${update.text}
            </div>
        `).join('');
    }
}


/*
====================================
  Terminal Typewriter Effect
====================================
*/

/**
 * Helper function to create a delay
 * @param {number} ms - Milliseconds to wait
 */
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Types out a single line of text into an element.
 * @param {HTMLElement} el - The element to type into
 * @param {string} text - The text to type
 * @param {number} speed - The typing speed in ms
 */
async function typeLine(el, text, speed = 100) {
    el.classList.add('typing-effect');
    for (const char of text) {
        el.textContent += char;
        await wait(speed);
    }
    el.classList.remove('typing-effect');
    // Add a permanent cursor to the last line
    el.classList.add('with-cursor');
}

/**
 * Runs the hero animation sequence.
 */
async function startHeroAnimation() {
    const promptEl = document.getElementById('hero-prompt');
    const nameEl = document.getElementById('hero-name');
    const taglineEl = document.getElementById('hero-tagline');
    const actionsEl = document.getElementById('hero-actions');

    // Only run if we are on the homepage (where these elements exist)
    if (promptEl && nameEl && taglineEl && actionsEl) {
        
        // Wait for a moment before starting
        await wait(500);
        
        // Line 1: Type the prompt
        promptEl.classList.add('typing-effect');
        await wait(1000); // User "thinking" delay
        for (const char of '$ whoami') {
            promptEl.textContent += char;
            await wait(75);
        }
        promptEl.classList.remove('typing-effect');
        
        // Line 2: Type the name (output)
        await wait(300); // "Enter" key delay
        await typeLine(nameEl, 'KRYPTOS', 120);
        
        // Line 3: Type the tagline
        nameEl.classList.remove('with-cursor'); // Remove cursor from previous line
        await typeLine(taglineEl, '// Cyber sec  // Reverse Engineer // C family dev', 50);
        
        // Animation finished, show the buttons
        actionsEl.classList.remove('hidden-until-ready');
    }
}

// --- Modify the main DOMContentLoaded listener ---
// Find your existing 'DOMContentLoaded' listener at the top of main.js
// and ADD the `startHeroAnimation();` call to it.

/*
  Find this block at the top of your main.js file:
*/
document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    setActiveNavLink();
    initScrollAnimations();
    loadSidebarUpdates();
    startHeroAnimation(); // <-- ADD THIS LINE
});