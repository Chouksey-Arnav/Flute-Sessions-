/* ============================================
   ARNAV CHOUKSEY FLUTE ACADEMY — script.js
   ============================================ */

(function () {
  'use strict';

  /* ===================================================
     1. SMOOTH SCROLL
     ─────────────────────────────────────────────────
     Standard anchors scroll to the target section.
     .email-cta anchors do that FIRST, then after a
     short delay scroll to the absolute page bottom so
     the email buttons and contact info are fully in view.
     A guard prevents the bottom-scroll from looping or
     firing when the user is already near the bottom.
  ==================================================== */
  function getNavHeight() {
    var nav = document.getElementById('navbar');
    return nav ? nav.offsetHeight + 36 : 108; // +36 for ticker height
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
        if (hb) hb.classList.remove('open');
      }

      // Email CTAs: after the section scroll lands, continue to absolute bottom
      // Guard: only fire if we are NOT already within 80px of the bottom
      if (anchor.classList.contains('email-cta')) {
        setTimeout(function () {
          var distanceFromBottom =
            document.documentElement.scrollHeight -
            window.pageYOffset -
            window.innerHeight;
          if (distanceFromBottom > 80) {
            window.scrollTo({
              top: document.documentElement.scrollHeight,
              behavior: 'smooth'
            });
          }
        }, 520); // wait for initial scroll to settle
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
     4. APPLE-STYLE FADE ANIMATIONS — BULLETPROOF SYSTEM
     ─────────────────────────────────────────────────
     This implements the "invisible-by-default-via-JS"
     pattern so progressive enhancement is guaranteed:

     STEP 0  Pre-pass: assign JS-computed stagger delays
             to grouped elements (cards, pillars, etc.)
             so they cascade in gracefully as a group.

     STEP 1  Mark every .fade-el with .will-fade
             (synchronously, before first paint).
             CSS then applies: opacity:0, translateY(30px),
             scale(0.98) — the Apple "before" state.

     STEP 2  IntersectionObserver adds .is-visible when
             each element enters the viewport.
             CSS then applies: opacity:1, transform:none,
             scale:1 — the Apple "after" state.
             Observer stops watching once visible, so
             the element stays visible on scroll-back.

     STEP 3  requestAnimationFrame immediately shows
             anything already in the viewport on load,
             preventing a blank screen flash.

     NO JS path: .fade-el has no opacity:0 in CSS.
     Everything is fully visible without JavaScript. ✓
  ==================================================== */

  /* ── STEP 0: Pre-pass stagger for grouped elements ── */

  // Cards inside .cards-grid — services and tutorials
  document.querySelectorAll('.cards-grid .glass-card').forEach(function (el, i) {
    // Only auto-stagger if no manual stagger class is present
    if (!el.classList.contains('stagger-1') &&
        !el.classList.contains('stagger-2') &&
        !el.classList.contains('stagger-3') &&
        !el.classList.contains('stagger-4')) {
      el.style.transitionDelay = (i * 0.12) + 's';
    }
  });

  // Summer pillars
  document.querySelectorAll('.summer-pillars .pillar').forEach(function (el, i) {
    if (!el.classList.contains('stagger-1') &&
        !el.classList.contains('stagger-2') &&
        !el.classList.contains('stagger-3') &&
        !el.classList.contains('stagger-4')) {
      el.style.transitionDelay = (i * 0.12) + 's';
    }
  });

  // Why cards
  document.querySelectorAll('.why-content .why-card').forEach(function (el, i) {
    if (!el.classList.contains('stagger-1') &&
        !el.classList.contains('stagger-2') &&
        !el.classList.contains('stagger-3') &&
        !el.classList.contains('stagger-4')) {
      el.style.transitionDelay = (i * 0.12) + 's';
    }
  });

  // Timeline items — staggered by their natural order
  document.querySelectorAll('.timeline-item').forEach(function (item, i) {
    if (!item.classList.contains('fade-el')) {
      item.classList.add('fade-el');
    }
    // Stagger by position but cap so later items don't wait too long
    item.style.transitionDelay = Math.min(i * 0.12, 0.36) + 's';
  });

  /* ── STEP 1: Mark all .fade-el elements as hidden ── */
  var allFadeEls = document.querySelectorAll('.fade-el');

  allFadeEls.forEach(function (el) {
    el.classList.add('will-fade');
  });

  /* ── STEP 2: Observe and reveal on scroll ── */
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Stop watching — element stays visible permanently
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.06,          // Trigger early — feels more natural
    rootMargin: '0px 0px -24px 0px'  // Small bottom offset for polish
  });

  allFadeEls.forEach(function (el) { fadeObserver.observe(el); });

  /* ── STEP 3: Immediately reveal anything in the viewport right now ── */
  requestAnimationFrame(function () {
    document.querySelectorAll('.fade-el').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 10) {
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
      piece.addEventListener('animationend', function () { this.remove(); });
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
      void icon.offsetWidth; // force reflow
      icon.style.animation = 'spinOnce 0.45s ease-out forwards';
    });
    card.addEventListener('mouseleave', function () { icon.style.animation = ''; });
  });

  /* ===================================================
     9. HERO ENTRANCE — Apple-style staggered rise
     ─────────────────────────────────────────────────
     Hero children are NOT .fade-el (they're above the
     fold always) so we handle them separately with a
     matching Apple-curve stagger on load.
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
    el.style.opacity   = '0';
    el.style.transform = 'translateY(24px)';
    el.style.scale     = '0.98';
    el.style.willChange = 'opacity, transform, scale';
    // Apple ease: cubic-bezier(0.25,0.1,0.25,1) at 0.7s per element
    var delay = (0.06 + i * 0.10) + 's';
    el.style.transition =
      'opacity 0.7s cubic-bezier(0.25,0.1,0.25,1) ' + delay + ',' +
      'transform 0.7s cubic-bezier(0.25,0.1,0.25,1) ' + delay + ',' +
      'scale 0.7s cubic-bezier(0.25,0.1,0.25,1) ' + delay;
  });

  // Double rAF ensures the browser has painted the initial hidden state
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      heroEls.forEach(function (el) {
        if (!el) return;
        el.style.opacity   = '1';
        el.style.transform = 'translateY(0)';
        el.style.scale     = '1';
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
        scrollHint.style.opacity    = '0';
        scrollHint.style.transition = 'opacity 0.5s';
        window.removeEventListener('scroll', onScroll);
      }
    }, { passive: true });
  }

  /* ===================================================
     INIT
  ==================================================== */
  setBodyBg('bg-hero');

  /* Inject spinOnce keyframe once for card icon hovers */
  if (!document.getElementById('spin-style')) {
    var style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent =
      '@keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

})();
