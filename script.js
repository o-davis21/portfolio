/* =========================================================
   1) PARTICLES.JS (safe, optional)
   ========================================================= */
(function initParticles() {
  // Only run if particles.js is loaded and the #particles container exists
  if (typeof window.particlesJS !== 'function') return;
  const container = document.getElementById('particles');
  if (!container) return;

  window.particlesJS('particles', {
    particles: {
      number: { value: 6, density: { enable: true, value_area: 1000 } },
      color: { value: '#1b1e34' },
      shape: {
        type: 'polygon',
        stroke: { width: 0, color: '#000' },
        polygon: { nb_sides: 6 }
      },
      opacity: { value: 0.3, random: true, anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false } },
      size: { value: 100, random: false, anim: { enable: true, speed: 10, size_min: 40, sync: false } },
      line_linked: { enable: false, distance: 200, color: '#ffffff', opacity: 1, width: 2 },
      move: { enable: true, speed: 8, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: false, mode: 'grab' }, onclick: { enable: false, mode: 'push' }, resize: true },
      modes: {
        grab: { distance: 400, line_linked: { opacity: 1 } },
        bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
        repulse: { distance: 200, duration: 0.4 },
        push: { particles_nb: 4 },
        remove: { particles_nb: 2 }
      }
    },
    retina_detect: true
  });

  // --- Optional: lightweight particle counter & FPS (disabled by default) ---
  const ENABLE_STATS = false; // set to true if you include stats.min.js
  if (!ENABLE_STATS) return;

  if (typeof window.Stats === 'function') {
    const stats = new window.Stats();
    stats.setMode(0); // 0: fps
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    const counter = document.querySelector('.js-count-particles');

    function update() {
      stats.begin();
      stats.end();
      const pDom = window.pJSDom && window.pJSDom[0];
      if (pDom && pDom.pJS && pDom.pJS.particles && pDom.pJS.particles.array && counter) {
        counter.textContent = String(pDom.pJS.particles.array.length);
      }
      requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
})();

/* =========================================================
   2) HAMBURGER NAV (accessible, safe on pages w/o new header)
   ========================================================= */
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('primary-nav'); // <ul id="primary-nav">
  const overlay = document.querySelector('.nav-overlay');

  // Graceful exit if header not upgraded yet
  if (!toggle || !navMenu || !overlay) return;

  const focusableSel = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function openMenu() {
    lastFocused = document.activeElement;
    document.body.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
    overlay.hidden = false;

    // Focus first focusable in the panel
    const first = navMenu.querySelector(focusableSel);
    if (first) first.focus();

    document.addEventListener('keydown', trapTab);
    document.addEventListener('keydown', onEsc);
  }

  function closeMenu() {
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    overlay.hidden = true;

    document.removeEventListener('keydown', trapTab);
    document.removeEventListener('keydown', onEsc);

    if (lastFocused && typeof lastFocused.focus === 'function') toggle.focus();
  }

  function trapTab(e) {
    if (e.key !== 'Tab') return;
    const focusables = navMenu.querySelectorAll(focusableSel);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function onEsc(e) {
    if (e.key === 'Escape') closeMenu();
  }

  // Toggle
  toggle.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('nav-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Overlay click closes
  overlay.addEventListener('click', closeMenu);

  // Click a link inside the panel → close
  navMenu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) closeMenu();
  });

  // If resizing up to desktop while open, close
  const desktopMQ = window.matchMedia('(min-width: 900px)');
  if (desktopMQ && typeof desktopMQ.addEventListener === 'function') {
    desktopMQ.addEventListener('change', (mq) => {
      if (mq.matches && document.body.classList.contains('nav-open')) closeMenu();
    });
  } else if (desktopMQ && typeof desktopMQ.addListener === 'function') {
    // Safari < 14 fallback
    desktopMQ.addListener((mq) => {
      if (mq.matches && document.body.classList.contains('nav-open')) closeMenu();
    });
  }
})();