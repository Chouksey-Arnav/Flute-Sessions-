// script.js
document.addEventListener('DOMContentLoaded', () => {

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // APPLE-STYLE BACKGROUND CHANGE + RE-TRIGGERABLE FADE
    const sections = document.querySelectorAll('.hero, .about, .services, .tutorials, .summer, .contact');
    const bgClasses = ['', 'bg2', 'bg3', 'bg4', 'bg2', 'bg3'];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                document.body.className = bgClasses[i] || '';
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.3, rootMargin: "-100px 0px" });

    sections.forEach(section => observer.observe(section));

    // Confetti on CTA
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
});            note.style.top = '-30px';
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
