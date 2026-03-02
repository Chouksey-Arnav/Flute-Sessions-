// script.js
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // FADE ANIMATIONS – TRIPLE-CHECKED & IMPROVED
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Small staggered delay for beautiful cascade effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 120);
            }
        });
    }, {
        threshold: 0.18,      // Triggers earlier for smoother feel
        rootMargin: "-60px 0px"
    });

    // Observe every section that should fade in
    document.querySelectorAll('.hero-content, .about, .services, .tutorials, .contact').forEach(section => {
        observer.observe(section);
    });

    // Confetti on CTA click
    function launchConfetti() {
        for (let i = 0; i < 90; i++) {
            const note = document.createElement('div');
            note.textContent = ['♪','♫','🎵','🎶'][Math.floor(Math.random()*4)];
            note.style.position = 'fixed';
            note.style.left = Math.random() * 100 + 'vw';
            note.style.top = '-30px';
            note.style.fontSize = Math.random()*2 + 2.5 + 'rem';
            note.style.zIndex = '99999';
            note.style.pointerEvents = 'none';
            document.body.appendChild(note);
            const duration = Math.random()*2800 + 3500;
            note.animate([
                {transform:'translateY(0) rotate(0deg)', opacity:1},
                {transform:`translateY(${window.innerHeight+400}px) rotate(${Math.random()*1400-700}deg)`, opacity:0}
            ], {duration, easing:'cubic-bezier(0.25,0.1,0.25,1)'});
            setTimeout(() => note.remove(), duration);
        }
    }

    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (Math.random() > 0.3) launchConfetti();
        });
    });
});
