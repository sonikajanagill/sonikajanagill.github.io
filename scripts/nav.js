/* ===========================
   Shared Navigation Component
   Single source of truth for site-wide nav.
   Include via <script src="/scripts/nav.js"></script>
   and add <div id="nav-placeholder"></div> in <body>.
   =========================== */

// Set theme immediately to prevent flash of wrong theme
(function() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
})();

(function () {
    const navHTML = `
    <a href="#main-content" class="skip-to-content">Skip to content</a>
    <nav role="navigation" aria-label="Main navigation">
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <img src="/img/Sonika-Logo-Light.jpeg" alt="Sonika Janagill" class="logo-light">
                <img src="/img/Sonika-Logo-Dark.jpeg" alt="Sonika Janagill" class="logo-dark">
                <span class="nav-home-text">Home</span>
            </a>
            <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="nav-overlay" id="nav-overlay"></div>
            <ul class="nav-links" id="nav-links">
                <li><a href="/about.html">About</a></li>
                <li><a href="/articles/">Articles</a></li>
                <li><a href="/speaking/">Speaking</a></li>
                <li><a href="/contact.html">Contact</a></li>
                <li>
                    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
                        <img src="/img/Sun.png" alt="Light mode" class="theme-icon theme-icon-light">
                        <img src="/img/Moon.png" alt="Dark mode" class="theme-icon theme-icon-dark">
                    </button>
                </li>
            </ul>
        </div>
    </nav>`;

    // Inject into placeholder
    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.outerHTML = navHTML;
    }

    // Initialise hamburger menu + theme toggle after nav is in the DOM
    document.addEventListener('DOMContentLoaded', function () {
        // Hamburger menu
        const hamburger = document.getElementById('nav-hamburger');
        const navLinksEl = document.getElementById('nav-links');
        const navOverlay = document.getElementById('nav-overlay');
        if (hamburger && navLinksEl) {
            function openMenu() {
                navLinksEl.classList.add('active');
                hamburger.classList.add('active');
                if (navOverlay) navOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
            function closeMenu() {
                navLinksEl.classList.remove('active');
                hamburger.classList.remove('active');
                if (navOverlay) navOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
            hamburger.addEventListener('click', function () {
                navLinksEl.classList.contains('active') ? closeMenu() : openMenu();
            });
            if (navOverlay) navOverlay.addEventListener('click', closeMenu);
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navLinksEl.classList.contains('active')) closeMenu();
            });
            navLinksEl.querySelectorAll('a').forEach(function (l) {
                l.addEventListener('click', closeMenu);
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    });
})();
