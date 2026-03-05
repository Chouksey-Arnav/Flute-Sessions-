/* ============================================
ARNAV CHOUKSEY FLUTE ACADEMY — script.js
IntersectionObserver, Confetti, Nav, Fades
============================================ */

(function () {
‘use strict’;

/* ===================================================
1. SMOOTH SCROLL FOR NAV LINKS
==================================================== */
document.querySelectorAll(‘a[href^=”#”]’).forEach(function (anchor) {
anchor.addEventListener(‘click’, function (e) {
const target = document.querySelector(this.getAttribute(‘href’));
if (!target) return;
e.preventDefault();
target.scrollIntoView({ behavior: ‘smooth’ });
// Close mobile menu if open
const navLinks = document.getElementById(‘nav-links’);
const hamburger = document.getElementById(‘hamburger’);
if (navLinks && navLinks.classList.contains(‘open’)) {
navLinks.classList.remove(‘open’);
hamburger.classList.remove(‘open’);
}
});
});

/* ===================================================
2. HAMBURGER MENU TOGGLE
==================================================== */
const hamburger = document.getElementById(‘hamburger’);
const navLinks  = document.getElementById(‘nav-links’);
if (hamburger && navLinks) {
hamburger.addEventListener(‘click’, function () {
hamburger.classList.toggle(‘open’);
navLinks.classList.toggle(‘open’);
});
}

/* ===================================================
3. BACKGROUND SECTION SWITCHING
Uses IntersectionObserver — changes body class
based on which section is most visible.
==================================================== */
const bgMap = {
‘home’:      ‘bg-hero’,
‘about’:     ‘bg-about’,
‘why’:       ‘bg-why’,
‘journey’:   ‘bg-journey’,
‘services’:  ‘bg-services’,
‘tutorials’: ‘bg-tutorials’,
‘summer’:    ‘bg-summer’,
‘contact’:   ‘bg-contact’,
};

const allBgClasses = Object.values(bgMap);

function setBodyBg(bgClass) {
// Remove all bg classes
allBgClasses.forEach(function (cls) {
document.body.classList.remove(cls);
});
if (bgClass) {
document.body.classList.add(bgClass);
}
}

// Track which sections are intersecting and how much
const sectionVisibility = {};

const bgObserver = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
const id = entry.target.getAttribute(‘id’);
sectionVisibility[id] = entry.intersectionRatio;
});
// Find the most visible section
let topId = null;
let topRatio = 0;
Object.keys(sectionVisibility).forEach(function (id) {
if (sectionVisibility[id] > topRatio) {
topRatio = sectionVisibility[id];
topId = id;
}
});
if (topId && bgMap[topId]) {
setBodyBg(bgMap[topId]);
}
},
{
threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
rootMargin: ‘0px’,
}
);

Object.keys(bgMap).forEach(function (id) {
const el = document.getElementById(id);
if (el) bgObserver.observe(el);
});

/* ===================================================
4. FADE IN / OUT ANIMATIONS (re-triggerable both ways)
Elements with class .fade-el
Fade in when entering viewport, fade out when leaving.
==================================================== */
const fadeEls = document.querySelectorAll(’.fade-el’);

const fadeObserver = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
// Small staggered delay based on element’s position in its parent
const siblings = entry.target.parentElement
? Array.from(entry.target.parentElement.children)
: [];
const idx = siblings.indexOf(entry.target);
const delay = Math.min(idx * 80, 300); // stagger up to 300ms
setTimeout(function () {
entry.target.classList.add(‘visible’);
}, delay);
} else {
// Fade out when scrolled out of view (in either direction)
entry.target.classList.remove(‘visible’);
}
});
},
{
threshold: 0.12,
rootMargin: ‘0px 0px -40px 0px’,
}
);

fadeEls.forEach(function (el) {
fadeObserver.observe(el);
});

/* ===================================================
5. NAVBAR SCROLL EFFECT
Slightly increase nav opacity/shadow on scroll
==================================================== */
const navbar = document.getElementById(‘navbar’);
let lastScroll = 0;

window.addEventListener(‘scroll’, function () {
const scrollY = window.scrollY;
if (navbar) {
if (scrollY > 60) {
navbar.style.background = ‘rgba(6,6,20,0.92)’;
navbar.style.boxShadow = ‘0 2px 40px rgba(0,0,0,0.5)’;
} else {
navbar.style.background = ‘’;
navbar.style.boxShadow = ‘’;
}
}
lastScroll = scrollY;
}, { passive: true });

/* ===================================================
6. ACTIVE NAV LINK HIGHLIGHTING
==================================================== */
const navAnchors = document.querySelectorAll(’.nav-links a[href^=”#”]’);

const navObserver = new IntersectionObserver(
function (entries) {
entries.forEach(function (entry) {
if (entry.isIntersecting) {
const id = entry.target.getAttribute(‘id’);
navAnchors.forEach(function (a) {
a.style.color = ‘’;
if (a.getAttribute(‘href’) === ‘#’ + id) {
a.style.color = ‘var(–teal)’;
}
});
}
});
},
{
threshold: 0.45,
}
);

Object.keys(bgMap).forEach(function (id) {
const el = document.getElementById(id);
if (el) navObserver.observe(el);
});

/* ===================================================
7. CONFETTI ON CTA CLICK
Musical notes fall across the screen
==================================================== */
const confettiContainer = document.getElementById(‘confetti-container’);
const confettiPieces = [‘♪’, ‘♫’, ‘🎵’, ‘🎶’, ‘♬’, ‘♩’, ‘🎼’, ‘♪’, ‘♫’];
const confettiColors = [
‘#00f5d4’, ‘#00cfff’, ‘#e879f9’, ‘#7c3aed’, ‘#a3e635’,
‘#ffffff’, ‘#fbbf24’, ‘#f472b6’, ‘#34d399’
];

function spawnConfetti() {
if (!confettiContainer) return;

```
// Clear old pieces first
confettiContainer.innerHTML = '';

const total = 55;
for (let i = 0; i < total; i++) {
  const piece = document.createElement('span');
  piece.classList.add('confetti-piece');

  // Random note emoji/char
  piece.textContent = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];

  // Random horizontal position
  piece.style.left = Math.random() * 100 + 'vw';

  // Random color
  piece.style.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];

  // Random size
  const size = 1.0 + Math.random() * 1.8;
  piece.style.fontSize = size + 'rem';

  // Random delay so they fall in waves
  const delay = Math.random() * 1.2;
  piece.style.animationDelay = delay + 's';

  // Random duration
  const dur = 2.0 + Math.random() * 2.0;
  piece.style.animationDuration = dur + 's';

  confettiContainer.appendChild(piece);

  // Remove piece after animation ends
  piece.addEventListener('animationend', function () {
    piece.remove();
  });
}
```

}

// Attach to all confetti triggers
document.querySelectorAll(’.confetti-trigger’).forEach(function (btn) {
btn.addEventListener(‘click’, function (e) {
spawnConfetti();
});
});

/* ===================================================
8. CARD ICON SPIN ON HOVER (extra flair)
The CSS handles most of it, but we ensure
the animation resets properly via JS.
==================================================== */
document.querySelectorAll(’.glass-card’).forEach(function (card) {
const icon = card.querySelector(’.card-icon i, .why-icon i, .pillar-icon i, .contact-icon i’);
if (!icon) return;

```
card.addEventListener('mouseenter', function () {
  icon.style.animation = 'none';
  // Force reflow to restart animation
  void icon.offsetWidth;
  icon.style.animation = 'spinOnce 0.5s ease-out forwards';
});

card.addEventListener('mouseleave', function () {
  icon.style.animation = '';
});
```

});

/* ===================================================
9. HERO TITLE — subtle text shimmer on load
==================================================== */
const heroTitle = document.querySelector(’.hero-title’);
if (heroTitle) {
heroTitle.style.opacity = ‘0’;
heroTitle.style.transform = ‘translateY(30px)’;
heroTitle.style.transition = ‘opacity 1s ease 0.3s, transform 1s ease 0.3s’;
requestAnimationFrame(function () {
requestAnimationFrame(function () {
heroTitle.style.opacity = ‘1’;
heroTitle.style.transform = ‘translateY(0)’;
});
});
}

// Also animate hero badge and sub text
const heroBadge = document.querySelector(’.hero-badge’);
const heroSubs  = document.querySelectorAll(’.hero-sub’);
const heroStats = document.querySelector(’.hero-stats’);
const heroCtas  = document.querySelector(’.hero-cta-group’);

[heroBadge, …heroSubs, heroCtas, heroStats].forEach(function (el, i) {
if (!el) return;
el.style.opacity = ‘0’;
el.style.transform = ‘translateY(24px)’;
el.style.transition = ’opacity 0.9s ease ’ + (0.15 + i * 0.12) + ’s, transform 0.9s ease ’ + (0.15 + i * 0.12) + ‘s’;
requestAnimationFrame(function () {
requestAnimationFrame(function () {
el.style.opacity = ‘1’;
el.style.transform = ‘translateY(0)’;
});
});
});

/* ===================================================
10. SCROLL HINT — hide after first scroll
==================================================== */
const scrollHint = document.querySelector(’.scroll-hint’);
if (scrollHint) {
window.addEventListener(‘scroll’, function onFirstScroll() {
if (window.scrollY > 80) {
scrollHint.style.opacity = ‘0’;
scrollHint.style.transition = ‘opacity 0.5s’;
window.removeEventListener(‘scroll’, onFirstScroll);
}
}, { passive: true });
}

/* ===================================================
11. TIMELINE ITEM STAGGER
Each timeline item fades in with a slight delay
We add data-delay attributes via JS for staggering
==================================================== */
document.querySelectorAll(’.timeline-item’).forEach(function (item, i) {
item.classList.add(‘fade-el’);
item.style.transitionDelay = (i * 0.12) + ‘s’;
fadeObserver.observe(item);
});

/* ===================================================
INIT
==================================================== */
// Set initial bg class
setBodyBg(‘bg-hero’);

// Log init (helpful for debugging, no console errors)
// console.log(’[FlutAcademy] Script initialized successfully.’);

})();