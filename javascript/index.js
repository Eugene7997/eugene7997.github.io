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
                <div class="title-name">Eugene Poh</div>
                <div class="address">
                    <h3>🏠 Singapore</h3>
                </div>
                <div class="contact">
                    <a class="no-underline" href="mailto:eugene134@protonmail.com"><span>📧</span><span style="text-decoration: underline;"> eugene134@protonmail.com</span></a>
                    <a class="no-underline" href="https://www.linkedin.com/in/eugene-poh/"><span>💼</span><span style="text-decoration: underline;"> LinkedIn</span></a>
                    <a class="no-underline" href="https://github.com/Eugene7997"><span>🐙</span><span style="text-decoration: underline;"> GitHub</span></a>
                </div>
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
            <p>
                If you have any comments about the web page, you can check out this link:
                <a href="website_comments.html">Click me!</a>
            </p>
            <p><i>Last modified: 18/04/2025</i></p>
            <p>The current date is: <current-date></current-date></p>
        </div>
    </footer>     
    `;
    }
}
customElements.define('current-date', CurrentDate);
customElements.define('main-header', Header);
customElements.define('main-footer', Footer);