/* ============================================
   ARNAV CHOUKSEY FLUTE ACADEMY — script.js
   ============================================ */

(function () {
  'use strict';

  /* ===================================================
     1. SMOOTH SCROLL
  ==================================================== */
  function getNavHeight() {
    var nav = document.getElementById('navbar');
    return nav ? nav.offsetHeight + 36 : 108; // +36 for ticker
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - getNavHeight() - 8;
      window.scrollTo({ top: top, behavior: 'smooth' });
      // Close mobile menu
      var nl = document.getElementById('nav-links');
      var hb = document.getElementById('hamburger');
      if (nl && nl.classList.contains('open')) {
        nl.classList.remove('open');
        hb.classList.remove('open');
      }
    });
  });

  /* ===================================================
     2. HAMBURGER MENU
  ==================================================== */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
  }

  /* ===================================================
     3. BACKGROUND SWITCHING
  ==================================================== */
  var bgMap = {
    'home':      'bg-hero',
    'about':     'bg-about',
    'why':       'bg-why',
    'journey':   'bg-journey',
    'services':  'bg-services',
    'tutorials': 'bg-tutorials',
    'summer':    'bg-summer',
    'contact':   'bg-contact',
  };
  var allBgClasses = Object.values(bgMap);

  function setBodyBg(cls) {
    allBgClasses.forEach(function (c) { document.body.classList.remove(c); });
    if (cls) document.body.classList.add(cls);
  }

  var sectionVis = {};
  var bgObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      sectionVis[entry.target.id] = entry.intersectionRatio;
    });
    var topId = null, topRatio = 0;
    Object.keys(sectionVis).forEach(function (id) {
      if (sectionVis[id] > topRatio) { topRatio = sectionVis[id]; topId = id; }
    });
    if (topId && bgMap[topId]) setBodyBg(bgMap[topId]);
  }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] });

  Object.keys(bgMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) bgObserver.observe(el);
  });

  /* ===================================================
     4. BULLETPROOF FADE ANIMATIONS
     ─────────────────────────────────────────────────
     Strategy: Elements are VISIBLE by default in CSS.
     This script marks them .will-fade (hides them),
     then immediately uses IntersectionObserver to add
     .is-visible (shows them with animation).
     
     If JS never runs → everything stays visible. ✓
     If JS runs → beautiful staggered animations. ✓
     If observer is slow → rAF pass catches viewport. ✓
  ==================================================== */

  // Add fade-el to timeline items with stagger delay
  document.querySelectorAll('.timeline-item').forEach(function (item, i) {
    if (!item.classList.contains('fade-el')) {
      item.classList.add('fade-el');
    }
    item.style.transitionDelay = (i * 0.12) + 's';
  });

  var allFadeEls = document.querySelectorAll('.fade-el');

  // Step 1: Mark all fade elements as hidden (NOW, synchronously)
  allFadeEls.forEach(function (el) {
    el.classList.add('will-fade');
  });

  // Step 2: Set up observer to animate them in
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Once visible, stop observing it — keeps it visible on scroll back up
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  allFadeEls.forEach(function (el) { fadeObserver.observe(el); });

  // Step 3: Immediately show anything already in the viewport right now
  requestAnimationFrame(function () {
    allFadeEls.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 20) {
        el.classList.add('is-visible');
        fadeObserver.unobserve(el);
      }
    });
  });

  /* ===================================================
     5. NAVBAR SCROLL EFFECT
  ==================================================== */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.style.background = 'rgba(6,6,20,0.93)';
      navbar.style.boxShadow  = '0 2px 40px rgba(0,0,0,0.55)';
    } else {
      navbar.style.background = '';
      navbar.style.boxShadow  = '';
    }
  }, { passive: true });

  /* ===================================================
     6. ACTIVE NAV HIGHLIGHTING
  ==================================================== */
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) a.style.color = 'var(--teal)';
        });
      }
    });
  }, { threshold: 0.45 });

  Object.keys(bgMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) navObserver.observe(el);
  });

  /* ===================================================
     7. CONFETTI
  ==================================================== */
  var confettiContainer = document.getElementById('confetti-container');
  var confettiPieces = ['♪','♫','🎵','🎶','♬','♩','🎼','⭐','🏆','🎉','🥇'];
  var confettiColors  = ['#00f5d4','#00cfff','#ff6b9d','#7c3aed','#2ed573','#ffffff','#ffd32a','#ff6348'];

  function spawnConfetti() {
    if (!confettiContainer) return;
    confettiContainer.innerHTML = '';
    for (var i = 0; i < 65; i++) {
      var piece = document.createElement('span');
      piece.classList.add('confetti-piece');
      piece.textContent = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
      piece.style.left            = (Math.random() * 96) + '%';
      piece.style.color           = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.fontSize        = (1.0 + Math.random() * 2.0) + 'rem';
      piece.style.animationDelay  = (Math.random() * 1.3) + 's';
      piece.style.animationDuration = (1.8 + Math.random() * 2.2) + 's';
      confettiContainer.appendChild(piece);
      piece.addEventListener('animationend', function () { piece.remove(); });
    }
  }

  document.querySelectorAll('.confetti-trigger').forEach(function (btn) {
    btn.addEventListener('click', spawnConfetti);
  });

  /* ===================================================
     8. CARD ICON HOVER SPIN
  ==================================================== */
  document.querySelectorAll('.glass-card').forEach(function (card) {
    var icon = card.querySelector('.card-icon i, .why-icon i, .pillar-icon i, .contact-icon i');
    if (!icon) return;
    card.addEventListener('mouseenter', function () {
      icon.style.animation = 'none';
      void icon.offsetWidth;
      icon.style.animation = 'spinOnce 0.45s ease-out forwards';
    });
    card.addEventListener('mouseleave', function () { icon.style.animation = ''; });
  });

  /* ===================================================
     9. HERO ENTRANCE (staggered, instant on load)
  ==================================================== */
  var heroEls = [
    document.querySelector('.grade-badges'),
    document.querySelector('.free-badge'),
    document.querySelector('.hero-title'),
    document.querySelector('.hero-sub'),
    document.querySelector('.hero-sub-2'),
    document.querySelector('.hero-cta-group'),
    document.querySelector('.hero-stats'),
  ];

  heroEls.forEach(function (el, i) {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.willChange = 'opacity, transform';
    el.style.transition =
      'opacity 0.8s cubic-bezier(0.16,1,0.3,1) ' + (0.08 + i * 0.11) + 's,' +
      'transform 0.8s cubic-bezier(0.16,1,0.3,1) ' + (0.08 + i * 0.11) + 's';
  });

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroEls.forEach(function (el) {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });

  /* ===================================================
     10. SCROLL HINT — fade out on first scroll
  ==================================================== */
  var scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', function onScroll() {
      if (window.scrollY > 60) {
        scrollHint.style.opacity = '0';
        scrollHint.style.transition = 'opacity 0.5s';
        window.removeEventListener('scroll', onScroll);
      }
    }, { passive: true });
  }

  /* ===================================================
     INIT
  ==================================================== */
  setBodyBg('bg-hero');

  /* CSS keyframe for card icon spin (injected once) */
  if (!document.getElementById('spin-style')) {
    var style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = '@keyframes spinOnce { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }';
    document.head.appendChild(style);
  }

})();
