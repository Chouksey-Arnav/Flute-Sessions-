// script.js
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll reveal for every card
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 80);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.service-card, .tutorial-card').forEach(card => {
        observer.observe(card);
    });

    // Extra hover glow on profile
    const profile = document.querySelector('.profile-img');
    if (profile) {
        profile.addEventListener('mousemove', (e) => {
            const rect = profile.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            profile.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -25}deg) rotateY(${(x - 0.5) * 35}deg)`;
        });
        profile.addEventListener('mouseleave', () => {
            profile.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
        });
    }

    // Confetti explosion when clicking any big CTA
    function launchConfetti() {
        for (let i = 0; i < 90; i++) {
            const note = document.createElement('div');
            note.textContent = ['♪','♫','🎵','🎶'][Math.floor(Math.random()*4)];
            note.style.position = 'fixed';
            note.style.left = Math.random() * 100 + 'vw';
            note.style.top = '-30px';
            note.style.fontSize = Math.random() * 2 + 2.5 + 'rem';
            note.style.zIndex = '99999';
            note.style.pointerEvents = 'none';
            document.body.appendChild(note);

            const duration = Math.random() * 2800 + 3500;
            note.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 400}px) rotate(${Math.random()*1400 - 700}deg)`, opacity: 0 }
            ], { duration: duration, easing: 'cubic-bezier(0.25,0.1,0.25,1)' });

            setTimeout(() => note.remove(), duration);
        }
    }

    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (Math.random() > 0.3) launchConfetti();
        });
    });

    // One-time confetti on page load for extra fun
    setTimeout(() => {
        if (Math.random() > 0.5) launchConfetti();
    }, 1200);
});
