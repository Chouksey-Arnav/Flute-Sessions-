/* ============================================
   ARNAV CHOUKSEY FLUTE ACADEMY — script.js
   Apple-smooth · Bulletproof · Grade-aware
   ============================================ */

(function () {
  'use strict';

  /* ===================================================
     1. SMOOTH SCROLL + EMAIL-CTA BOTTOM SCROLL
     ─────────────────────────────────────────────────
     Regular anchors → scroll to section top (offset for
     fixed navbar + ticker bar).

     .email-cta anchors → do the section scroll first,
     then after 520 ms (enough for the smooth scroll to
     settle) continue all the way to the absolute bottom
     of the page, so the email addresses and big CTA
     button are always fully in view.

     Guard: if the user is already within 80 px of the
     bottom we skip the second scroll so it never loops
     or double-fires.
  ==================================================== */
  function getNavOffset() {
    var nav = document.getElementById('navbar');
    /* nav sits below the 36-px ticker; add 8 px breathing room */
    return nav ? nav.offsetHeight + 36 + 8 : 114;
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      /* ── Primary scroll: to the section ── */
      var top = target.getBoundingClientRect().top + window.pageYOffset - getNavOffset();
      window.scrollTo({ top: top, behavior: 'smooth' });

      /* ── Close mobile nav if open ── */
      var nl = document.getElementById('nav-links');
      var hb = document.getElementById('hamburger');
      if (nl && nl.classList.contains('open')) {
        nl.classList.remove('open');
        if (hb) hb.classList.remove('open');
      }

      /* ── Secondary scroll: email CTAs continue to page bottom ── */
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
     An IntersectionObserver tracks how much of each
     named section is visible. The section with the
     highest intersection ratio "wins" and its matching
     body class drives the radial-gradient background.
     This gives a seamless, smooth colour shift as the
     user scrolls through the page.
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
     4. APPLE-STYLE FADE ANIMATION SYSTEM — BULLETPROOF
     ─────────────────────────────────────────────────
     Design philosophy: Mirror Apple.com's polished
     "fade up + scale" entrance. Elements enter with a
     30 px upward rise and a subtle scale pull-back
     (0.98 → 1.0), driven by Apple's standard easing
     curve cubic-bezier(0.25, 0.1, 0.25, 1) at 0.6 s.

     Architecture (4 steps):

     STEP 0  STAGGER PRE-PASS
             Before any hiding happens, compute and set
             transition-delay on every element inside a
             "group" (cards-grid, grade-plans-grid, why
             cards, summer pillars, timeline items, plan-
             list items). Elements with a manual stagger-N
             class are skipped — their delay is handled
             by CSS. The pre-pass groups use increments
             of 0.12 s, capped at 0.48 s so no element
             ever waits more than half a second.

     STEP 1  HIDE (will-fade)
             Synchronously add .will-fade to every
             .fade-el. This triggers the CSS "before"
             state: opacity:0, translateY(30px),
             scale:0.98. Because this happens before the
             browser's first paint the user never sees
             elements pop in and then hide.

     STEP 2  OBSERVE (fadeObserver)
             An IntersectionObserver watches every
             .fade-el. When one enters the viewport it
             gets .is-visible, which triggers the CSS
             "after" state: opacity:1, transform:none,
             scale:1. The observer then stops watching
             that element so it stays visible permanently.

     STEP 3  VIEWPORT PRE-REVEAL (rAF pass)
             On the next animation frame, anything that
             is already in the viewport is immediately
             marked .is-visible, preventing a flash of
             hidden content on page load (especially
             important for above-the-fold sections).

     PROGRESSIVE ENHANCEMENT GUARANTEE
             .fade-el has NO opacity:0 in CSS — only JS
             adds .will-fade to hide elements. If JS is
             disabled or slow, every element is visible
             by default. ✓
  ==================================================== */

  /* ── STEP 0: Compute stagger delays for groups ──────
     Rules:
     • Skip elements that already have a manual stagger
       class (stagger-1…4) — their CSS delay takes over.
     • Cap auto-stagger at 0.48 s (every 4th+ item).
     • Use 0.12 s increments — feels snappy but distinct.
  ─────────────────────────────────────────────────── */
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

  /* Main service cards (4-up grid) */
  applyAutoStagger('.cards-grid .glass-card');

  /* Grade-specific plan cards (3-up grid below services) */
  applyAutoStagger('.grade-plans-grid .grade-plan-card');

  /* Why-free cards */
  applyAutoStagger('.why-content .why-card');

  /* Summer pillars */
  applyAutoStagger('.summer-pillars .pillar');

  /* Timeline items — auto-stagger but cap earlier (0.36 s)
     so the timeline doesn't feel sluggish on mobile      */
  applyAutoStagger('.timeline-item', 0.12, 0.36);

  /* Plan-list items inside grade plan cards — very tight
     stagger (0.06 s) so they cascade but feel fast       */
  document.querySelectorAll('.grade-plan-card').forEach(function (card) {
    card.querySelectorAll('.plan-list li').forEach(function (li, i) {
      li.style.transitionDelay = Math.min(i * 0.06, 0.30) + 's';
    });
  });

  /* Contact method cards */
  applyAutoStagger('.contact-methods .contact-card');

  /* About accolades */
  applyAutoStagger('.about-accolades .accolade');

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
        fadeObserver.unobserve(entry.target); /* permanent — no re-hide */
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

  /* ===================================================
     5. NAVBAR — SCROLL SOLIDIFICATION
     ─────────────────────────────────────────────────
     Below 80 px scroll the navbar is semi-transparent
     glass. Past 80 px it solidifies slightly to stay
     readable over section content.
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
     ─────────────────────────────────────────────────
     Watches each section. When a section is ≥ 45 %
     visible, its corresponding nav link is highlighted
     in teal. Only one link is active at a time.
  ==================================================== */
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.style.color = '';
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--teal)';
          }
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
     ─────────────────────────────────────────────────
     Any element with .confetti-trigger spawns 65 emoji
     confetti pieces that fall with randomised position,
     colour, size, delay, and duration. Each piece
     removes itself when its CSS animation ends.
  ==================================================== */
  var confettiContainer = document.getElementById('confetti-container');
  var confettiPieces = ['♪','♫','🎵','🎶','♬','♩','🎼','⭐','🏆','🎉','🥇','🎊','✨'];
  var confettiColors  = ['#00f5d4','#00cfff','#ff6b9d','#7c3aed','#2ed573','#ffffff','#ffd32a','#ff6348'];

  function spawnConfetti() {
    if (!confettiContainer) return;
    confettiContainer.innerHTML = '';
    for (var i = 0; i < 65; i++) {
      var piece = document.createElement('span');
      piece.classList.add('confetti-piece');
      piece.textContent           = confettiPieces[Math.floor(Math.random() * confettiPieces.length)];
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
     ─────────────────────────────────────────────────
     On mouseenter, every glass card triggers a single
     360° spin on its first found icon (.card-icon i,
     .why-icon i, .pillar-icon i, .contact-icon i).
     The animation is injected as a <style> tag once so
     it lives in the CSS cascade, not as inline style.
  ==================================================== */
  /* Inject the @keyframes once */
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
      void icon.offsetWidth; /* force reflow so animation restarts */
      icon.style.animation = 'spinOnce 0.45s ease-out forwards';
    });
    card.addEventListener('mouseleave', function () {
      icon.style.animation = '';
    });
  });

  /* ===================================================
     9. HERO ENTRANCE — Apple staggered rise
     ─────────────────────────────────────────────────
     Hero children are always above the fold so the
     fade-el observer would reveal them instantly anyway.
     Instead we handle them here with a precise, ordered
     stagger matching Apple's product-page entrances:
       • Start at 0.06 s, add 0.10 s per element.
       • Use the same cubic-bezier(0.25,0.1,0.25,1).
       • Use double rAF to guarantee the browser has
         painted the hidden state before animating in.
  ==================================================== */
  var heroSelectors = [
    '.grade-badges',
    '.free-badge',
    '.hero-title',
    '.hero-sub',
    '.hero-sub-2',
    '.hero-cta-group',
    '.hero-stats',
  ];

  var heroEls = heroSelectors.map(function (sel) {
    return document.querySelector(sel);
  });

  /* Set initial hidden state for each hero element */
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

  /* Double rAF: first frame paints hidden, second triggers animation */
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
     ─────────────────────────────────────────────────
     The chevron + "Keep scrolling" hint at the bottom
     of the hero fades out the moment the user scrolls
     more than 60 px. The listener removes itself after
     firing once so it doesn't run on every scroll event.
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
     11. UNLOCK BOX HOVER GLOW
     ─────────────────────────────────────────────────
     The grade "Unlocks" boxes in the journey timeline
     get a subtle teal glow on hover to draw attention
     to the progression chain and make them feel
     interactive/inspirational.
  ==================================================== */
  document.querySelectorAll('.unlock-box').forEach(function (box) {
    box.addEventListener('mouseenter', function () {
      this.style.transition  = 'box-shadow 0.3s ease, border-color 0.3s ease';
      this.style.boxShadow   = '0 0 18px rgba(0,245,212,0.25)';
      this.style.borderColor = 'rgba(0,245,212,0.45)';
    });
    box.addEventListener('mouseleave', function () {
      this.style.boxShadow   = '';
      this.style.borderColor = '';
    });
  });

  document.querySelectorAll('.unlock-box-blue').forEach(function (box) {
    box.addEventListener('mouseenter', function () {
      this.style.transition  = 'box-shadow 0.3s ease, border-color 0.3s ease';
      this.style.boxShadow   = '0 0 18px rgba(0,207,255,0.25)';
      this.style.borderColor = 'rgba(0,207,255,0.45)';
    });
    box.addEventListener('mouseleave', function () {
      this.style.boxShadow   = '';
      this.style.borderColor = '';
    });
  });

  document.querySelectorAll('.unlock-box-gold').forEach(function (box) {
    box.addEventListener('mouseenter', function () {
      this.style.transition  = 'box-shadow 0.3s ease, border-color 0.3s ease';
      this.style.boxShadow   = '0 0 18px rgba(255,211,42,0.25)';
      this.style.borderColor = 'rgba(255,211,42,0.45)';
    });
    box.addEventListener('mouseleave', function () {
      this.style.boxShadow   = '';
      this.style.borderColor = '';
    });
  });

  /* ===================================================
     12. GRADE PLAN CARD — Plan-list item fade-el setup
     ─────────────────────────────────────────────────
     The individual list items inside grade plan cards
     are marked as fade-el so they cascade in beautifully
     as the cards scroll into view. We add them to the
     fadeObserver after the main allFadeEls pass.
  ==================================================== */
  document.querySelectorAll('.grade-plan-card .plan-list li').forEach(function (li) {
    if (!li.classList.contains('fade-el')) {
      li.classList.add('fade-el', 'will-fade');
      fadeObserver.observe(li);
    }
  });

  /* ===================================================
     INIT
  ==================================================== */
  setBodyBg('bg-hero');

})();
