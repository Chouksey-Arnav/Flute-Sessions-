// script.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name && email && message) {
            // In a real site, you'd send this to a backend. Here, just simulate success.
            formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
            formMessage.style.color = 'white';
            form.reset();
        } else {
            formMessage.textContent = 'Please fill out all required fields.';
            formMessage.style.color = 'red';
        }
    });

    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
