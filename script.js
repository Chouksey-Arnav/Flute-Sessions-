/* ============================================
   ARNAV CHOUKSEY FLUTE ACADEMY — script.js
   Apple-smooth · Bulletproof · Grade-aware
   ============================================ */

(function () {
  'use strict';

  /* ===================================================
     1. SMOOTH SCROLL + EMAIL-CTA BOTTOM SCROLL
     ─────────────────────────────────────────────────
     Regular anchors scroll to the target section,
     offset by the fixed navbar height + ticker.

     .email-cta anchors do that FIRST, then after a
     520 ms delay (letting the section scroll settle),
     they continue all the way to the absolute bottom
     of the page so email addresses and CTAs are fully
     visible. A guard skips the second scroll if the
     user is already within 80 px of the bottom.
  ==================================================== */
  function getNavOffset() {
    var nav = document.getElementById('navbar');
    return nav ? nav.offsetHeight + 36 + 8 : 114;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      var top = target.getBoundingClientRect().top + window.pageYOffset - getNavOffset();
      window.scrollTo({ top: top, behavior: 'smooth' });

      var nl = document.getElementById('nav-links');
      var hb = document.getElementById('hamburger');
      if (nl && nl.classList.contains('open')) {
        nl.classList.remove('open');
        if (hb) hb.classList.remove('open');
      }

      if (anchor.classList.contains('email-cta')) {
        setTimeout(function () {
          var distFromBottom =
            document.documentElement.scrollHeight -
            window.pageYOffset - window.innerHeight;
          if (distFromBottom > 80) {
            window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
          }
        }, 520);
      }
    });
  });

  /* ===================================================
     2. HAMBURGER MENU TOGGLE
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
     3. DYNAMIC BACKGROUND SWITCHING
     ─────────────────────────────────────────────────
     Tracks which section occupies the most viewport
     space and applies the matching body class, which
     drives the radial-gradient background colours.
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
     4. APPLE-STYLE FADE SYSTEM — BULLETPROOF
     ─────────────────────────────────────────────────
     STEP 0  Auto-stagger pre-pass: assign computed
             transition-delay values to grouped elements
             so they cascade in gracefully as a group.

     STEP 1  Mark every .fade-el with .will-fade
             (synchronously, before first paint).
             CSS applies: opacity:0, translateY(30px),
             scale(0.98) — the "before" state.

     STEP 2  IntersectionObserver adds .is-visible when
             each element enters the viewport, triggering
             the "after" state: opacity:1, transform:none.
             Observer then stops watching — element stays
             visible permanently on scroll-back.

     STEP 3  rAF pre-reveal: anything already in the
             viewport on load gets .is-visible immediately
             so there's never a flash of hidden content.

     NO-JS guarantee: .fade-el has NO opacity:0 in base
     CSS — only .will-fade hides elements. Everything
     is fully visible without JavaScript. ✓
  ==================================================== */

  /* ── STEP 0: Auto-stagger helper ─────────────────── */
  function hasManualStagger(el) {
    return el.classList.contains('stagger-1') ||
           el.classList.contains('stagger-2') ||
           el.classList.contains('stagger-3') ||
           el.classList.contains('stagger-4');
  }

  function applyAutoStagger(selector, increment, max) {
    increment = increment || 0.12;
    max       = max       || 0.48;
    document.querySelectorAll(selector).forEach(function (el, i) {
      if (!hasManualStagger(el)) {
        el.style.transitionDelay = Math.min(i * increment, max) + 's';
      }
    });
  }

  applyAutoStagger('.cards-grid .glass-card');
  applyAutoStagger('.grade-plans-grid .grade-plan-card');
  applyAutoStagger('.why-content .why-card');
  applyAutoStagger('.summer-pillars .pillar');
  applyAutoStagger('.timeline-item', 0.12, 0.36);
  applyAutoStagger('.contact-methods .contact-card');
  applyAutoStagger('.about-accolades .accolade');

  /* Tight cascade for plan-list items inside grade plan cards */
  document.querySelectorAll('.grade-plan-card').forEach(function (card) {
    card.querySelectorAll('.plan-list li').forEach(function (li, i) {
      li.style.transitionDelay = Math.min(i * 0.06, 0.30) + 's';
    });
  });

  /* Director quote block: stagger its child elements after the
     block itself fades in, for a beautiful reveal sequence     */
  var dqBlock = document.querySelector('.director-quote-block');
  if (dqBlock) {
    var dqChildren = [
      dqBlock.querySelector('.dq-text'),
      dqBlock.querySelector('.dq-attribution'),
      dqBlock.querySelector('.dq-context'),
    ];
    dqChildren.forEach(function (el, i) {
      if (!el) return;
      el.classList.add('fade-el');
      el.style.transitionDelay = (0.15 + i * 0.14) + 's';
    });
  }

  /* ── STEP 1: Mark all .fade-el elements as hidden ── */
  var allFadeEls = document.querySelectorAll('.fade-el');
  allFadeEls.forEach(function (el) {
    el.classList.add('will-fade');
  });

  /* ── STEP 2: Observe and reveal on scroll ────────── */
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold:  0.06,
    rootMargin: '0px 0px -20px 0px'
  });

  allFadeEls.forEach(function (el) { fadeObserver.observe(el); });

  /* ── STEP 3: Immediately reveal in-viewport elements ─ */
  requestAnimationFrame(function () {
    document.querySelectorAll('.fade-el').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 10) {
        el.classList.add('is-visible');
        fadeObserver.unobserve(el);
      }
    });
  });

  /* ── Extra: plan-list items get fade-el treatment ── */
  document.querySelectorAll('.grade-plan-card .plan-list li').forEach(function (li) {
    if (!li.classList.contains('fade-el')) {
      li.classList.add('fade-el', 'will-fade');
      fadeObserver.observe(li);
    }
  });

  /* ===================================================
     5. NAVBAR — SCROLL SOLIDIFICATION
  ==================================================== */
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.style.background = 'rgba(6,6,20,0.95)';
      navbar.style.boxShadow  = '0 2px 40px rgba(0,0,0,0.55)';
    } else {
      navbar.style.background = '';
      navbar.style.boxShadow  = '';
    }
  }, { passive: true });

  /* ===================================================
     6. ACTIVE NAV LINK HIGHLIGHTING
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
     7. CONFETTI — Musical Note Shower
  ==================================================== */
  var confettiContainer = document.getElementById('confetti-container');
  var confettiPieces = ['♪','♫','🎵','🎶','♬','♩','🎼','⭐','🏆','🎉','🥇','🎊','✨','♭','♯'];
  var confettiColors  = ['#00f5d4','#00cfff','#ff6b9d','#7c3aed','#2ed573','#ffffff','#ffd32a','#ff6348'];

  function spawnConfetti() {
    if (!confettiContainer) return;
    confettiContainer.innerHTML = '';
    for (var i = 0; i < 72; i++) {
      var piece = document.createElement('span');
      piece.classList.add('confetti-piece');
      piece.textContent             = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
      piece.style.left              = (Math.random() * 96) + '%';
      piece.style.color             = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      piece.style.fontSize          = (1.0 + Math.random() * 2.0) + 'rem';
      piece.style.animationDelay    = (Math.random() * 1.3) + 's';
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
  if (!document.getElementById('spin-style')) {
    var spinStyle = document.createElement('style');
    spinStyle.id = 'spin-style';
    spinStyle.textContent =
      '@keyframes spinOnce { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
    document.head.appendChild(spinStyle);
  }

  document.querySelectorAll('.glass-card').forEach(function (card) {
    var icon = card.querySelector(
      '.card-icon i, .why-icon i, .pillar-icon i, .contact-icon i'
    );
    if (!icon) return;
    card.addEventListener('mouseenter', function () {
      icon.style.animation = 'none';
      void icon.offsetWidth;
      icon.style.animation = 'spinOnce 0.45s ease-out forwards';
    });
    card.addEventListener('mouseleave', function () { icon.style.animation = ''; });
  });

  /* ===================================================
     9. HERO ENTRANCE — Apple staggered rise
     ─────────────────────────────────────────────────
     Hero elements are always above the fold so we
     handle them separately from the scroll-fade system.
     Double rAF guarantees the browser has painted the
     hidden state before we animate in.
  ==================================================== */
  var heroSelectors = [
    '.grade-badges', '.free-badge', '.hero-title',
    '.hero-sub', '.hero-sub-2', '.hero-cta-group', '.hero-stats',
  ];

  var heroEls = heroSelectors.map(function (sel) {
    return document.querySelector(sel);
  });

  heroEls.forEach(function (el, i) {
    if (!el) return;
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(24px)';
    el.style.scale      = '0.98';
    el.style.willChange = 'opacity, transform, scale';
    var delay = (0.06 + i * 0.10) + 's';
    el.style.transition =
      'opacity 0.7s cubic-bezier(0.25,0.1,0.25,1) ' + delay + ',' +
      'transform 0.7s cubic-bezier(0.25,0.1,0.25,1) ' + delay + ',' +
      'scale 0.7s cubic-bezier(0.25,0.1,0.25,1) ' + delay;
  });

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
     10. SCROLL HINT — Fade on first scroll
  ==================================================== */
  var scrollHint = document.querySelector('.scroll-hint');
  if (scrollHint) {
    window.addEventListener('scroll', function fadeHint() {
      if (window.scrollY > 60) {
        scrollHint.style.transition = 'opacity 0.5s ease';
        scrollHint.style.opacity    = '0';
        window.removeEventListener('scroll', fadeHint);
      }
    }, { passive: true });
  }

  /* ===================================================
     11. DIRECTOR QUOTE — Subtle breathing glow
     ─────────────────────────────────────────────────
     Once the director quote block scrolls into view
     (detected by IntersectionObserver), give it a
     slow, breathing border glow to make it feel alive
     and draw the eye to the important quote.
  ==================================================== */
  var dqEl = document.querySelector('.director-quote-block');
  if (dqEl) {
    var dqSeen = false;
    var dqViewObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !dqSeen) {
        dqSeen = true;
        // Add a breathing class that drives a CSS pulse
        dqEl.classList.add('dq-alive');
        dqViewObserver.unobserve(dqEl);
      }
    }, { threshold: 0.5 });
    dqViewObserver.observe(dqEl);

    // Inject the breathing animation once
    if (!document.getElementById('dq-style')) {
      var dqStyle = document.createElement('style');
      dqStyle.id = 'dq-style';
      dqStyle.textContent =
        '.dq-alive { animation: dqBreath 4s ease-in-out infinite; }' +
        '@keyframes dqBreath {' +
        '  0%,100% { box-shadow: 0 0 20px rgba(0,245,212,0.10), 0 0 0 1px rgba(0,245,212,0.20); }' +
        '  50%      { box-shadow: 0 0 44px rgba(0,245,212,0.28), 0 0 0 1px rgba(0,245,212,0.45); }' +
        '}';
      document.head.appendChild(dqStyle);
    }
  }

  /* ===================================================
     12. UNLOCK BOX HOVER GLOW
  ==================================================== */
  /* Handled purely in CSS now — hover rules live in
     .unlock-box:hover, .unlock-box-blue:hover, etc.  */

  /* ===================================================
     INIT
  ==================================================== */
  setBodyBg('bg-hero');

})();
