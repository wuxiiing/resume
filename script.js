(() => {
  'use strict';

  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-list');
  const navLinks = document.querySelectorAll('[data-scroll]');
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('.section');

  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Mobile nav toggle ---
  function toggleMenu(forceClose = false) {
    if (!navToggle || !navList) return;
    const isActive = forceClose ? false : !navList.classList.contains('active');
    navList.classList.toggle('active', isActive);
    navToggle.setAttribute('aria-expanded', String(isActive));
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => toggleMenu());

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navList.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMenu(true);
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('active')) {
        toggleMenu(true);
        navToggle.focus();
      }
    });
  }

  // --- Smooth scroll with offset (handled by CSS scroll-padding-top) ---
  navLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
      // Close mobile menu after navigation
      toggleMenu(true);
    });
  });

  // --- Section observer for nav highlighting ---
  // Use a Map to track visibility ratios and highlight the most visible section
  const visibilityMap = new Map();

  const observerOptions = {
    root: null,
    rootMargin: '-64px 0px -40% 0px',
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      visibilityMap.set(entry.target.id, entry.intersectionRatio);
    });

    // Find the section with the highest visibility ratio
    let maxRatio = -1;
    let activeId = null;
    visibilityMap.forEach((ratio, id) => {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        activeId = id;
      }
    });

    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (activeId && maxRatio > 0) {
      const activeLink = document.querySelector(`.nav-link[href="#${activeId}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  }, observerOptions);

  sections.forEach(section => {
    visibilityMap.set(section.id, 0);
    sectionObserver.observe(section);
  });

  // --- Live Beijing time in quick access panel ---
  const liveClock = document.querySelector('[data-live-clock]');
  if (liveClock) {
    const formatter = new Intl.DateTimeFormat('zh-CN', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    function updateLiveClock() {
      const parts = Object.fromEntries(formatter.formatToParts(new Date()).map(part => [part.type, part.value]));
      liveClock.textContent = `${parts.year}.${parts.month}.${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
    }

    updateLiveClock();
    window.setInterval(updateLiveClock, 1000);
  }
  // --- Navbar scroll state ---
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Reveal animations on scroll (optional enhancement) ---
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.card, .timeline-panel');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      revealObserver.observe(el);
    });
  }
})();

