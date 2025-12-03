// Reusable header component
function loadHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <div class="header-content">
            <a href="index.html" class="logo">Your Name</a>
            <nav>
                <a href="index.html">Home</a>
                <a href="projects.html">Projects</a>
                <a href="publications.html">Publications</a>
                <a href="cv.html">CV</a>
                <a href="hobbies.html">Hobbies & Books</a>
                <a href="contact.html">Contact</a>
            </nav>
        </div>
    `;
    document.body.insertBefore(header, document.body.firstChild);
}

// Load header when DOM is ready
document.addEventListener('DOMContentLoaded', loadHeader);