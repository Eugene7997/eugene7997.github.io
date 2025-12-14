class CurrentDate extends HTMLElement {
    // The browser calls this method when the element is
    // added to the DOM.
    connectedCallback() {
        // Create a Date object representing the current date.
        const now = new Date();

        // Format the date to DD/MM/YYYY
        const day = String(now.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed) and pad
        const year = now.getFullYear(); // Get full year

        // Set the formatted date as the text content of this element.
        this.textContent = `${day}/${month}/${year}`;
    }
}

class Header extends HTMLElement {
    connectedCallback() {
        const path = window.location.pathname.replace(/\\/g, '/');
        const prefix = ['/projects/', '/blogs/'].some(p => path.includes(p)) ? '../' : '';
        this.innerHTML = `
        <nav>
            <div class="header">
                <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
                    <i class="fa fa-bars"></i>
                </button>
                <div class="links">
                    <a href="${prefix}index.html">Home</a>&nbsp;
                    <a href="${prefix}background.html">Background</a>&nbsp;
                    <a href="${prefix}experiences.html">Experiences</a>&nbsp;
                    <a href="${prefix}projects.html">Projects</a>&nbsp;
                    <a href="${prefix}blogs.html">Blogs</a>
                </div>
                <button class="theme-toggle" aria-label="Toggle dark mode" aria-pressed="false">
                    <i class="fa fa-moon-o"></i>
                </button>
            </div>
            <div class="border" />
        </nav>
      `;

        // Hamburger menu toggle functionality
        const hamburger = this.querySelector('.hamburger');
        const hamburgerIcon = this.querySelector('.hamburger i');
        const links = this.querySelector('.links');
        const themeToggle = this.querySelector('.theme-toggle');

        // Theme toggle: persists to localStorage and updates `html` class
        function applyTheme(isDark) {
            const icon = themeToggle?.querySelector('i');
            if (isDark) {
                document.documentElement.classList.add('dark');
                if (icon) {
                    icon.className = 'fa fa-sun-o';
                }
                if (themeToggle) {
                    themeToggle.setAttribute('aria-pressed', 'true');
                }
            } else {
                document.documentElement.classList.remove('dark');
                if (icon) {
                    icon.className = 'fa fa-moon-o';
                }
                if (themeToggle) {
                    themeToggle.setAttribute('aria-pressed', 'false');
                }
            }
        }

        // Initialize theme from localStorage or prefers-color-scheme
        try {
            const saved = localStorage.getItem('theme');
            if (saved === 'dark') {
                applyTheme(true);
            } else if (saved === 'light') {
                applyTheme(false);
            } else {
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyTheme(prefersDark);
            }
        } catch (e) {
            // localStorage may be unavailable; fall back to prefers-color-scheme
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark);
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { }
                applyTheme(isDark);
            });
        }

        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', !isExpanded);
            links.classList.toggle('active');

            // Toggle between bars and times icon
            if (hamburgerIcon.classList.contains('fa-bars')) {
                hamburgerIcon.classList.remove('fa-bars');
                hamburgerIcon.classList.add('fa-times');
            } else {
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const menuLinks = this.querySelectorAll('.links a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                links.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.contains(e.target)) {
                links.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburgerIcon.classList.remove('fa-times');
                hamburgerIcon.classList.add('fa-bars');
            }
        });
    }
}

class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `    
    <footer>            
        <div class="footer">
            <p><i>Last modified: 14/12/2025</i></p>
            <p>The current date is: <current-date></current-date></p>
        </div>
    </footer>     
    `;
    }
}

class ShowerThoughts extends HTMLElement {
    connectedCallback() {
        const thoughts = [
            "Why do kids need to brush their teeth if they are going to fall out anyway?",
            "Why are we considered wet during a shower but not when we swim?",
            "The word \"swims\" is the same upside down.",
            "Why does cheaper restaurants usually require payment upfront, while expensive ones trust you to pay later?",
            "The sun is the lowest on the food chain yet it can defeat any animal.",
            "Are Humans are man made?"
        ];

        this.innerHTML = `
            <div class="shower-thoughts">
                <div class="accordion">
                    <div class="accordion-item">
                        <button class="accordion-header" aria-expanded="false" aria-controls="thoughts-content">
                            <span class="accordion-title">Shower Thoughts</span>
                            <span class="accordion-icon">+</span>
                        </button>
                        <div class="accordion-content" id="thoughts-content">
                            <div class="accordion-body">
                                <div class="thought-display">${thoughts[0]}</div>
                            </div>
                            <button class="next-thought-btn">Tell me more!</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        let currentThought = 0;
        const thoughtDisplay = this.querySelector('.thought-display');
        const nextBtn = this.querySelector('.next-thought-btn');
        const accordionHeader = this.querySelector('.accordion-header');
        const accordionContent = this.querySelector('.accordion-content');
        const icon = this.querySelector('.accordion-icon');

        // Accordion functionality
        accordionHeader.addEventListener('click', () => {
            const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';

            if (isExpanded) {
                accordionHeader.setAttribute('aria-expanded', 'false');
                accordionContent.style.maxHeight = '0px';
                icon.textContent = '+';
            } else {
                accordionHeader.setAttribute('aria-expanded', 'true');
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
                icon.textContent = '−';
            }
        });

        // Cycle through thoughts functionality
        nextBtn.addEventListener('click', () => {
            currentThought = (currentThought + 1) % thoughts.length;
            thoughtDisplay.style.opacity = '0';
            thoughtDisplay.style.transform = 'rotateY(90deg)';

            setTimeout(() => {
                thoughtDisplay.textContent = thoughts[currentThought];
                thoughtDisplay.style.opacity = '1';
                thoughtDisplay.style.transform = 'rotateY(0deg)';
            }, 300);
        });
    }
}

class PlaceholderMedia extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <svg width="600" height="360" viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg" role="img"
                aria-label="Project placeholder">
                <defs>
                    <linearGradient id="g" x1="0" x2="1">
                        <stop offset="0" stop-color="#e9eef8" />
                        <stop offset="1" stop-color="#f6fbff" />
                    </linearGradient>
                </defs>
                <rect width="600" height="360" fill="url(#g)" rx="8" />
                <g fill="#c7d6ef" opacity="0.9">
                    <rect x="36" y="36" width="160" height="120" rx="6" />
                    <rect x="220" y="36" width="324" height="28" rx="6" />
                    <rect x="220" y="74" width="200" height="14" rx="4" />
                    <rect x="220" y="98" width="140" height="14" rx="4" />
                </g>
            </svg>
        `;
    }
}

customElements.define('current-date', CurrentDate);
customElements.define('main-header', Header);
customElements.define('main-footer', Footer);
customElements.define('shower-thoughts', ShowerThoughts);
customElements.define('placeholder-media', PlaceholderMedia);

document.addEventListener('click', function (e) {
    const stopSelectors = [
        '.project-title',
        '.project-desc',
        '.project-tech',
        '.project-dates',
        '.project-status',
        '.project-links a'
    ];
    // If the click originated on an anchor inside any element matching stopSelectors, 
    // stop propagation so the card's onclick won't override it.
    if (stopSelectors.some(sel => e.target.closest(sel))) {
        e.stopPropagation();
    }
}, true);

// Generic handler: any element with `data-focus-target` will scroll-to and focus the target element.
document.addEventListener('DOMContentLoaded', () => {
    const triggers = document.querySelectorAll('[data-focus-target]');
    if (!triggers || triggers.length === 0) return;

    function scrollAndFocus(target, { offset = 0, autoplay = false } = {}) {
        if (!target) return;

        // If the target isn't naturally focusable, give it a temporary tabindex so it can receive focus.
        let addedTempTabindex = false;
        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
            addedTempTabindex = true;
        }

        try {
            if (offset && Number.isFinite(offset) && offset !== 0) {
                const rect = target.getBoundingClientRect();
                const top = window.scrollY + rect.top - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            } else {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Focus after a short delay so the smooth scroll doesn't get interrupted.
            setTimeout(() => {
                try {
                    target.focus({ preventScroll: true });
                } catch (e) {
                    target.focus();
                }

                if (autoplay && typeof target.play === 'function') {
                    target.play().catch(() => { /* ignore play errors */ });
                }
            }, 400);
        } catch (err) {
            // Fallback: immediate focus
            try {
                target.focus({ preventScroll: true });
            } catch (e) {
                target.focus();
            }
            if (autoplay && typeof target.play === 'function') target.play().catch(() => { });
        }

        // Optionally clean up the temporary tabindex later if needed. We leave it so keyboard users
        // can still tab to the element, which is often beneficial for accessibility.
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (ev) => {
            // Allow native button behavior to stay intact for non-action triggers; prevent default
            // to avoid accidental form submits when used inside forms.
            ev.preventDefault();

            const selector = trigger.getAttribute('data-focus-target');
            if (!selector) return;

            const target = document.querySelector(selector);
            if (!target) return;

            const autoplay = trigger.hasAttribute('data-autoplay');
            const offsetAttr = trigger.getAttribute('data-focus-offset');
            const offset = offsetAttr ? parseInt(offsetAttr, 10) || 0 : 0;

            scrollAndFocus(target, { offset, autoplay });
        });
    });
});