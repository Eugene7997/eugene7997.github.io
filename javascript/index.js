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
      this.innerHTML = `
        <nav>            
            <div class="header">
                <div class="links">
                    <a href="index.html">Home</a>&nbsp;
                    <a href="background.html">Background</a>&nbsp;
                    <a href="projects.html">Projects</a>&nbsp;
                    <a href="blogs.html">Blogs</a>
                </div>
            </div>
            <div class="border" />
        </nav>
      `;
    }
}

class Footer extends HTMLElement {
connectedCallback() {
    this.innerHTML = `    
    <footer>            
        <div class="footer">
            <p><i>Last modified: 09/08/2025</i></p>
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

customElements.define('current-date', CurrentDate);
customElements.define('main-header', Header);
customElements.define('main-footer', Footer);
customElements.define('shower-thoughts', ShowerThoughts);