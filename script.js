/* ============================================
   ARNAV CHOUKSEY FLUTE ACADEMY — script.js
   v3 · Particles · Carousel · 3D Tilt · Form
   ============================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     UTILITY
  ───────────────────────────────────────── */
  function getNavOffset() {
    var nav = document.getElementById('navbar');
    return nav ? nav.offsetHeight + 36 + 8 : 114;
  }

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────
     1. SMOOTH SCROLL + EMAIL-CTA BOTTOM SCROLL
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();

      var top = target.getBoundingClientRect().top + window.pageYOffset - getNavOffset();
      window.scrollTo({ top: top, behavior: 'smooth' });

      // Close mobile menu
      var nl = document.getElementById('nav-links');
      var hb = document.getElementById('hamburger');
      if (nl && nl.classList.contains('open')) {
        nl.classList.remove('open');
        if (hb) { hb.classList.remove('open'); hb.setAttribute('aria-expanded', 'false'); }
      }

      // Email CTAs: scroll to bottom after section arrives
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

  /* ─────────────────────────────────────────
     2. HAMBURGER
  ───────────────────────────────────────── */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
  }

  /* ─────────────────────────────────────────
     3. DYNAMIC BACKGROUND SWITCHING
  ───────────────────────────────────────── */
  var bgMap = {
    'home':         'bg-hero',
    'about':        'bg-about',
    'why':          'bg-why',
    'journey':      'bg-journey',
    'testimonials': 'bg-testimonials',
    'services':     'bg-services',
    'tutorials':    'bg-tutorials',
    'summer':       'bg-summer',
    'faq':          'bg-faq',
    'contact':      'bg-contact',
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

  /* ─────────────────────────────────────────
     4. PARTICLE CANVAS
     ─────────────────────────────────────────
     Lightweight canvas-based musical note
     particles. Each particle is a random
     Unicode music symbol that floats upward
     and fades. Respects prefers-reduced-motion.

     Performance approach:
     - Max 28 particles on desktop, 12 on mobile
     - Uses requestAnimationFrame with a 40ms
       minimum frame gap (~25 fps) to stay smooth
       without burning battery
     - Canvas sized to viewport, resizes on
       window resize via ResizeObserver
  ───────────────────────────────────────── */
  var canvas  = document.getElementById('particle-canvas');
  var ctx     = canvas ? canvas.getContext('2d') : null;

  if (ctx && !prefersReducedMotion) {
    var SYMBOLS   = ['♪','♫','♬','♩','♭','♯','♮','𝄞'];
    var COLORS    = [
      'rgba(0,245,212,',   // teal
      'rgba(0,207,255,',   // cyan
      'rgba(124,58,237,',  // purple
      'rgba(255,107,157,', // pink
      'rgba(255,211,42,',  // yellow
    ];
    var MAX_MOBILE   = 12;
    var MAX_DESKTOP  = 28;
    var particles    = [];
    var lastFrame    = 0;
    var frameGap     = 40; // ms between frames (~25fps)
    var rafId;

    function isMobile() { return window.innerWidth < 600; }

    function resizeCanvas() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();

    if (window.ResizeObserver) {
      new ResizeObserver(resizeCanvas).observe(document.body);
    } else {
      window.addEventListener('resize', resizeCanvas, { passive: true });
    }

    function makeParticle() {
      var col = COLORS[Math.floor(Math.random() * COLORS.length)];
      return {
        x:       Math.random() * canvas.width,
        y:       canvas.height + Math.random() * 80,
        size:    14 + Math.random() * 28,
        speed:   0.3 + Math.random() * 0.55,
        drift:   (Math.random() - 0.5) * 0.25,
        opacity: 0.04 + Math.random() * 0.09,
        symbol:  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        color:   col,
        rotation:  (Math.random() - 0.5) * 0.6,
        rotSpeed:  (Math.random() - 0.5) * 0.008,
        angle:   0,
      };
    }

    function initParticles() {
      var count = isMobile() ? MAX_MOBILE : MAX_DESKTOP;
      particles = [];
      for (var i = 0; i < count; i++) {
        var p = makeParticle();
        // Spread initial positions vertically
        p.y = Math.random() * canvas.height;
        particles.push(p);
      }
    }
    initParticles();

    function tick(now) {
      rafId = requestAnimationFrame(tick);
      if (now - lastFrame < frameGap) return;
      lastFrame = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var maxCount = isMobile() ? MAX_MOBILE : MAX_DESKTOP;

      particles.forEach(function (p) {
        p.y       -= p.speed;
        p.x       += p.drift;
        p.angle   += p.rotSpeed;

        // Fade in near bottom, fade out near top
        var progress  = 1 - (p.y / canvas.height);
        var fadeIn    = Math.min(progress * 10, 1);
        var fadeOut   = Math.min((1 - progress) * 6, 1);
        var alpha     = p.opacity * fadeIn * fadeOut;

        ctx.save();
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.font        = p.size + 'px serif';
        ctx.fillStyle   = p.color + alpha.toFixed(3) + ')';
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();

        // Recycle off-screen particles
        if (p.y < -80 || p.x < -100 || p.x > canvas.width + 100) {
          Object.assign(p, makeParticle());
        }
      });

      // Keep count up to max (in case of resize)
      while (particles.length < maxCount) { particles.push(makeParticle()); }
      while (particles.length > maxCount) { particles.pop(); }
    }

    requestAnimationFrame(tick);

    // Pause when tab hidden to save battery
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        lastFrame = 0;
        rafId = requestAnimationFrame(tick);
      }
    });
  }

  /* ─────────────────────────────────────────
     5. APPLE-STYLE FADE SYSTEM
  ───────────────────────────────────────── */

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
  applyAutoStagger('.why-content .why-card');
  applyAutoStagger('.summer-pillars .pillar');
  applyAutoStagger('.timeline-item', 0.12, 0.36);
  applyAutoStagger('.contact-methods > *', 0.10, 0.36);
  applyAutoStagger('.about-accolades .accolade');
  applyAutoStagger('.testimonials-grid .testimonial-card', 0.12, 0.42);
  applyAutoStagger('.faq-item', 0.06, 0.36);

  // Director quote stagger
  var dqBlock = document.querySelector('.director-quote-block');
  if (dqBlock) {
    [dqBlock.querySelector('.dq-text'),
     dqBlock.querySelector('.dq-attribution'),
     dqBlock.querySelector('.dq-context')].forEach(function (el, i) {
      if (!el) return;
      el.classList.add('fade-el');
      el.style.transitionDelay = (0.15 + i * 0.14) + 's';
    });
  }

  // Mark + observe all .fade-el — fires EVERY time (scroll down AND back up)
  var allFadeEls = document.querySelectorAll('.fade-el');
  allFadeEls.forEach(function (el) { el.classList.add('will-fade'); });

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        // Remove so it re-animates next time it enters the viewport
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  allFadeEls.forEach(function (el) { fadeObserver.observe(el); });

  // Immediately reveal anything already in viewport on load
  requestAnimationFrame(function () {
    document.querySelectorAll('.fade-el').forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 10) {
        el.classList.add('is-visible');
      }
    });
  });

  /* ─────────────────────────────────────────
     6. NAVBAR SOLIDIFICATION + ACTIVE LINKS
  ───────────────────────────────────────── */
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

  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.style.color = '';
          a.removeAttribute('aria-current');
          if (a.getAttribute('href') === '#' + id) {
            a.style.color = 'var(--teal)';
            a.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, { threshold: 0.45 });

  Object.keys(bgMap).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) navObserver.observe(el);
  });

  /* ─────────────────────────────────────────
     7. CONFETTI
  ───────────────────────────────────────── */
  var confettiContainer = document.getElementById('confetti-container');
  var confettiPieces = ['♪','♫','🎵','🎶','♬','♩','🎼','⭐','🏆','🎉','🥇','🎊','✨','♭','♯'];
  var confettiColors  = ['#00f5d4','#00cfff','#ff6b9d','#7c3aed','#2ed573','#ffffff','#ffd32a','#ff6348'];

  function spawnConfetti() {
    if (!confettiContainer || prefersReducedMotion) return;
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

  /* ─────────────────────────────────────────
     8. CARD ICON SPIN ON HOVER
  ───────────────────────────────────────── */
  if (!document.getElementById('spin-style')) {
    var spinStyle = document.createElement('style');
    spinStyle.id = 'spin-style';
    spinStyle.textContent =
      '@keyframes spinOnce { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }';
    document.head.appendChild(spinStyle);
  }

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

  /* ─────────────────────────────────────────
     9. HERO ENTRANCE
  ───────────────────────────────────────── */
  var heroSelectors = ['.grade-badges','.free-badge','.hero-title','.hero-sub','.hero-sub-2','.hero-cta-group','.hero-stats'];
  var heroEls = heroSelectors.map(function (sel) { return document.querySelector(sel); });

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

  /* ─────────────────────────────────────────
     10. SCROLL HINT
  ───────────────────────────────────────── */
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

  /* ─────────────────────────────────────────
     11. DIRECTOR QUOTE BREATHING GLOW
  ───────────────────────────────────────── */
  var dqEl = document.querySelector('.director-quote-block');
  if (dqEl) {
    var dqSeen = false;
    var dqViewObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !dqSeen) {
        dqSeen = true;
        dqEl.classList.add('dq-alive');
        dqViewObserver.unobserve(dqEl);
      }
    }, { threshold: 0.5 });
    dqViewObserver.observe(dqEl);
  }

  /* ─────────────────────────────────────────
     12. COVER FLOW GRADE PLAN CAROUSEL
     ─────────────────────────────────────────
     Shows 4 grade plan cards in a 3D cover-flow
     style. The active card is full-size; adjacent
     cards are scaled/dimmed; far cards more so.

     Interaction:
     - Arrow buttons prev/next
     - Grade dot buttons (labelled 5th–8th)
     - Arrow key keyboard nav (←/→) when focused
     - Touch/swipe on mobile (touchstart/touchend)

     State is tracked in `current` (0-3).
     The track is repositioned by setting
     translateX so the centre of the active
     card aligns with the centre of the viewport.
  ───────────────────────────────────────── */
  var cfTrack  = document.getElementById('cf-track');
  var cfPrev   = document.getElementById('cf-prev');
  var cfNext   = document.getElementById('cf-next');
  var cfDots   = document.querySelectorAll('.cf-dot');
  var cfWrapper = document.getElementById('cf-wrapper');

  if (cfTrack && cfPrev && cfNext) {
    var slides    = Array.from(cfTrack.querySelectorAll('.cf-slide'));
    var total     = slides.length;
    var current   = 0;

    function getSlideWidth() {
      if (!slides[0]) return 300;
      return slides[0].offsetWidth;
    }

    function getGap() {
      // Read gap from computed style (24px default)
      var style = window.getComputedStyle(cfTrack);
      return parseInt(style.columnGap || style.gap || '24', 10) || 24;
    }

    function getCfViewportWidth() {
      var vp = cfTrack.parentElement; // .cf-viewport
      return vp ? vp.offsetWidth : window.innerWidth;
    }

    function updateCarousel(animate) {
      var sw  = getSlideWidth();
      var gap = getGap();
      var vpW = getCfViewportWidth();

      // Offset to centre active slide
      var offset = -(current * (sw + gap)) + (vpW - sw) / 2;
      cfTrack.style.transform = 'translateX(' + offset + 'px)';

      slides.forEach(function (slide, i) {
        slide.classList.remove('cf-active', 'cf-adjacent', 'cf-far');
        var dist = Math.abs(i - current);
        if (dist === 0) slide.classList.add('cf-active');
        else if (dist === 1) slide.classList.add('cf-adjacent');
        else slide.classList.add('cf-far');
        // Accessibility: hide inactive from assistive tech
        slide.setAttribute('aria-hidden', dist === 0 ? 'false' : 'true');
      });

      cfDots.forEach(function (dot, i) {
        var active = i === current;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-selected', String(active));
      });

      cfPrev.disabled = current === 0;
      cfNext.disabled = current === total - 1;
    }

    function goTo(idx) {
      current = Math.max(0, Math.min(idx, total - 1));
      updateCarousel(true);
    }

    cfPrev.addEventListener('click', function () { goTo(current - 1); });
    cfNext.addEventListener('click', function () { goTo(current + 1); });

    cfDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(this.getAttribute('data-slide'), 10));
      });
    });

    // Click on adjacent slide to navigate to it
    slides.forEach(function (slide, i) {
      slide.addEventListener('click', function () {
        if (i !== current) goTo(i);
      });
    });

    // Keyboard navigation
    if (cfWrapper) {
      cfWrapper.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          goTo(current + (e.key === 'ArrowRight' ? 1 : -1));
        }
      });
    }

    // Touch swipe
    var touchStartX = 0;
    cfTrack.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    cfTrack.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) goTo(current + (delta < 0 ? 1 : -1));
    }, { passive: true });

    // Init + recalculate on resize
    updateCarousel(false);
    window.addEventListener('resize', function () { updateCarousel(false); }, { passive: true });
  }

  /* ─────────────────────────────────────────
     13. 3D MAGNETIC CARD TILT
     ─────────────────────────────────────────
     On pointer-capable devices, each .glass-card
     subtly tilts toward the mouse position,
     creating a 3D "looking at you" effect.
     Maximum tilt is ±8° on each axis.
     Tilt resets smoothly on mouse leave.
  ───────────────────────────────────────── */
  if (!prefersReducedMotion && window.matchMedia('(hover:hover)').matches) {
    var MAX_TILT = 8;

    document.querySelectorAll('.glass-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect  = card.getBoundingClientRect();
        var cx    = rect.left + rect.width  / 2;
        var cy    = rect.top  + rect.height / 2;
        var rx    = ((e.clientY - cy) / (rect.height / 2)) * MAX_TILT;
        var ry    = ((cx - e.clientX)  / (rect.width  / 2)) * MAX_TILT;
        card.style.transform = 'translateY(-6px) perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
        card.style.transition = 'transform 0.08s linear, box-shadow 0.08s linear';
        card.style.boxShadow  = '0 24px 60px rgba(0,0,0,0.45), 0 0 40px rgba(0,245,212,0.10)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transition = 'transform 0.55s cubic-bezier(0.25,0.1,0.25,1), box-shadow 0.55s';
        card.style.transform  = '';
        card.style.boxShadow  = '';
      });
    });
  }

  /* ─────────────────────────────────────────
     14. FAQ ACCORDION KEYBOARD ACCESSIBILITY
  ───────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var summary = item.querySelector('.faq-question');
    if (!summary) return;
    // Ensure details toggle works for keyboard users
    summary.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.open = !item.open;
      }
    });
  });

  /* ─────────────────────────────────────────
     15. CONTACT FORM — Web3Forms submission
     ─────────────────────────────────────────
     Key: 1318ba71-3ec3-4981-aa06-012090ac3b9e
     POST to https://api.web3forms.com/submit
     Uses FormData (multipart) — no Content-Type
     header so browser sets the boundary itself.
     Checks json.success (Web3Forms always 200).
  ───────────────────────────────────────── */
  var contactForm = document.getElementById('contact-form');
  var formSuccess = document.getElementById('form-success');
  var formError   = document.getElementById('form-error');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var submitBtn = contactForm.querySelector('.form-submit');
      var origHTML  = submitBtn ? submitBtn.innerHTML : '';

      // Show spinner
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>&nbsp;Sending…';
      }

      // Hide any previous messages
      if (formSuccess) formSuccess.setAttribute('hidden', '');
      if (formError)   formError.setAttribute('hidden', '');

      // Build FormData — picks up ALL inputs including hidden access_key
      var payload = new FormData(contactForm);

      // POST to Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    payload
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.success === true) {
          // ✅ SUCCESS
          contactForm.reset();
          if (formSuccess) formSuccess.removeAttribute('hidden');
          if (formError)   formError.setAttribute('hidden', '');
          spawnConfetti();
        } else {
          // Web3Forms returned success:false — show error + log reason
          console.warn('Web3Forms rejected:', data.message);
          if (formError)   formError.removeAttribute('hidden');
          if (formSuccess) formSuccess.setAttribute('hidden', '');
        }
      })
      .catch(function (err) {
        // Network error or JSON parse failure
        console.error('Form submission error:', err);
        if (formError)   formError.removeAttribute('hidden');
        if (formSuccess) formSuccess.setAttribute('hidden', '');
      })
      .finally(function () {
        // Re-enable button no matter what
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origHTML;
        }
      });
    });
  }

  /* ─────────────────────────────────────────
     16. TESTIMONIAL HOVER LIFT
     (subtle glow pulse on star hover)
  ───────────────────────────────────────── */
  document.querySelectorAll('.testimonial-card').forEach(function (card) {
    var stars = card.querySelector('.testimonial-stars');
    if (!stars) return;
    card.addEventListener('mouseenter', function () {
      stars.style.transition = 'letter-spacing 0.3s ease, filter 0.3s ease';
      stars.style.letterSpacing = '4px';
      stars.style.filter = 'drop-shadow(0 0 6px rgba(255,211,42,0.6))';
    });
    card.addEventListener('mouseleave', function () {
      stars.style.letterSpacing = '';
      stars.style.filter = '';
    });
  });

  /* ─────────────────────────────────────────
     17. STAT NUMBER COUNT-UP ANIMATION
     ─────────────────────────────────────────
     When hero stats come into view, animate
     numeric stat values from 0 to their target.
  ───────────────────────────────────────── */
  var statsBlock = document.querySelector('.hero-stats');
  if (statsBlock && !prefersReducedMotion) {
    var statsDone = false;
    var statsObs  = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !statsDone) {
        statsDone = true;
        statsObs.unobserve(statsBlock);
        // Only animate the "1st" and "2x" numerics
        document.querySelectorAll('.stat-num').forEach(function (el) {
          var text = el.textContent.trim();
          var match = text.match(/^(\d+)/);
          if (!match) return;
          var target = parseInt(match[1], 10);
          var suffix = text.replace(match[1], '');
          var start  = 0;
          var dur    = 900;
          var startT = performance.now();
          function step(now) {
            var elapsed = now - startT;
            var progress = Math.min(elapsed / dur, 1);
            var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      }
    }, { threshold: 0.8 });
    statsObs.observe(statsBlock);
  }

  /* ─────────────────────────────────────────
     INIT
  ───────────────────────────────────────── */
  setBodyBg('bg-hero');

})();
