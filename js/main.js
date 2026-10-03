/**
 * FWY — Frames With You
 * Main JavaScript — Interactions, Animations, and UI Logic
 */

'use strict';

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ============================================================
// NAV SCROLL BEHAVIOUR + WHITE STATE MANAGEMENT
// ============================================================
(function initNav() {
  const nav = $('#nav');
  if (!nav) return;

  const hero = $('.hero, .page-hero');
  let lastScroll = 0;
  let ticking = false;

  function updateNav() {
    const scrollY = window.scrollY;

    // Scrolled class for background blur
    if (scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // White nav only when over a dark hero
    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      if (heroBottom > 0) {
        nav.classList.add('nav-white');
      } else {
        nav.classList.remove('nav-white');
      }
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNav);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateNav();
})();

// ============================================================
// HAMBURGER MOBILE MENU
// ============================================================
(function initMobileMenu() {
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    hamburger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on mobile link click
  $$('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      if (isOpen) toggleMenu();
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) toggleMenu();
  });
})();

// ============================================================
// SCROLL REVEAL ANIMATIONS
// ============================================================
(function initReveal() {
  const reveals = $$('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger within same parent
        const siblings = $$('.reveal', entry.target.parentElement);
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  reveals.forEach(el => observer.observe(el));
})();

// ============================================================
// COUNTER ANIMATION
// ============================================================
(function initCounters() {
  const counters = $$('[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ============================================================
// SERVICE TABS (Services Page)
// ============================================================
(function initServiceTabs() {
  const tabs = $$('.service-tab');
  const panels = $$('.service-panel');
  if (!tabs.length) return;

  function activateTab(tab) {
    const service = tab.getAttribute('data-service');

    tabs.forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });

    panels.forEach(p => {
      p.classList.remove('active');
    });

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const panel = $(`#${service}`);
    if (panel) {
      panel.classList.add('active');
      // Re-trigger reveals for newly shown content
      $$('.reveal:not(.revealed)', panel).forEach(el => {
        el.classList.add('revealed');
      });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  // Support URL hash navigation (e.g. services.html#branding)
  function activateFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const matchingTab = tabs.find(t => t.getAttribute('data-service') === hash);
      if (matchingTab) {
        activateTab(matchingTab);
        const tabNav = $('.service-tabs-nav');
        if (tabNav) {
          setTimeout(() => {
            tabNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
  }

  activateFromHash();
  window.addEventListener('hashchange', activateFromHash);
})();

// ============================================================
// CONTACT FORM
// ============================================================
(function initContactForm() {
  const form = $('#contactForm');
  if (!form) return;

  const formFields  = $('#formFields');
  const formSuccess = $('#formSuccess');

  // Pre-fill service from URL param
  const urlParams    = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('service');
  const serviceSelect = $('#contactService');
  if (serviceParam && serviceSelect) {
    const option = serviceSelect.querySelector(`option[value="${serviceParam}"]`);
    if (option) serviceSelect.value = serviceParam;
  }

  function validateField(field) {
    const group   = field.closest('.form-group');
    const errorEl = group ? group.querySelector('.form-error') : null;

    let valid   = true;
    let message = '';

    if (field.required && !field.value.trim()) {
      valid   = false;
      message = 'This field is required.';
    } else if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value.trim())) {
        valid   = false;
        message = 'Please enter a valid email address.';
      }
    }

    if (field) field.classList.toggle('invalid', !valid);
    if (errorEl) errorEl.textContent = message;

    return valid;
  }

  // Real-time validation on blur
  $$('input, select, textarea', form).forEach(field => {
    field.addEventListener('blur',  () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  function fieldVal(selector) {
    const el = $(selector, form);
    return el ? (el.value || '').trim() : '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all required fields
    let isValid = true;
    $$('input[required], select[required], textarea[required]', form).forEach(field => {
      if (!validateField(field)) isValid = false;
    });
    if (!isValid) return;

    const submitBtn = $('#submitContactForm');
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const name    = fieldVal('#contactName');
    const email   = fieldVal('#contactEmailInput');
    const phone   = fieldVal('#contactPhoneInput')  || 'Not provided';
    const service = fieldVal('#contactService')     || 'Not specified';
    const message = fieldVal('#contactMessage');

    try {
      const response = await fetch("https://formsubmit.co/ajax/contact.fwy@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `New Project Inquiry from ${name}`,
          _captcha: "false",
          name: name,
          email: email,
          phone: phone,
          service: service,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      if (data.success === "false" || data.success === false) {
        throw new Error(data.message || 'Form submission failed');
      }

      // Show success screen
      if (formFields)  formFields.hidden  = true;
      if (formSuccess) formSuccess.hidden = false;
      form.reset();

    } catch (err) {
      console.error("Form submission error:", err);
      // We don't alert the error here aggressively while testing because FormSubmit initially rejects unverified emails.
      // But we still show success only if it succeeds.
      alert('There was a problem sending your message. Please check the console log for errors, or ensure you have clicked the FormSubmit activation link in your contact.fwy@gmail.com inbox, then try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  // CTA scroll to form
  const ctaScrollBtn = $('#ctaScrollToForm');
  if (ctaScrollBtn) {
    ctaScrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const formSection = $('.contact-form-wrap');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          const firstInput = formSection.querySelector('input');
          if (firstInput) firstInput.focus();
        }, 600);
      }
    });
  }
})();


// ============================================================
// HERO PARALLAX EFFECT
// ============================================================
(function initHeroParallax() {
  const hero = $('.hero');
  if (!hero) return;

  const canvas = $('.hero-canvas');
  const logoMark = $('.hero-logo-mark');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const heroH = hero.offsetHeight;

        if (scrollY <= heroH) {
          const progress = scrollY / heroH;

          if (canvas) {
            canvas.style.transform = `translateY(${scrollY * 0.3}px)`;
          }
          if (logoMark) {
            logoMark.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
            logoMark.style.opacity = 1 - progress * 1.5;
          }
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ============================================================
// SMOOTH PAGE TRANSITIONS
// ============================================================
(function initPageTransitions() {
  // Create overlay element
  const overlay = document.createElement('div');
  overlay.className = 'page-transition';
  document.body.appendChild(overlay);

  // Entry animation on page load
  overlay.classList.add('entering');
  overlay.addEventListener('animationend', () => {
    overlay.classList.remove('entering');
  }, { once: true });

  // Exit animation on internal link click
  $$('a[href]').forEach(link => {
    const href = link.getAttribute('href');

    // Only internal links, not anchors
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('mailto:') &&
      !href.startsWith('tel:') &&
      !href.startsWith('http') &&
      !link.hasAttribute('target')
    ) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        overlay.classList.add('leaving');

        overlay.addEventListener('animationend', () => {
          window.location.href = href;
        }, { once: true });
      });
    }
  });
})();

// ============================================================
// PORTFOLIO CARD CURSOR EFFECT
// ============================================================
(function initCardEffects() {
  const cards = $$('.portfolio-card, .team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotX = (y - centerY) / centerY * 1.5;
      const rotY = (x - centerX) / centerX * 1.5;

      card.style.transform = `perspective(1000px) rotateX(${-rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
})();

// ============================================================
// LAZY IMAGE LOADING WITH FADE
// ============================================================
(function initLazyImages() {
  const images = $$('img[loading="lazy"]');

  images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';

    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  });
})();

// ============================================================
// TEXT REVEAL ANIMATION FOR HERO HEADLINE
// ============================================================
(function initHeroTextReveal() {
  const headline = $('.hero-headline');
  if (!headline) return;

  const lines = headline.innerHTML.split('<br>');
  headline.innerHTML = lines.map((line, i) => `
    <span class="hero-line-wrap" style="display:block;overflow:hidden;clip-path:inset(0 0 0 0);">
      <span class="hero-line" style="display:block;transform:translateY(100%);animation:heroLineIn 1s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.15}s forwards;">
        ${line}
      </span>
    </span>
  `).join('');

  // Inject keyframes if not present
  if (!document.getElementById('heroKeyframes')) {
    const style = document.createElement('style');
    style.id = 'heroKeyframes';
    style.textContent = `
      @keyframes heroLineIn {
        to { transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }

  // Reveal other hero elements
  const heroCont = $('.hero-content');
  if (heroCont) {
    heroCont.classList.add('revealed');
  }

  const heroSub = $('.hero-sub');
  const heroCtas = $('.hero-ctas');

  if (heroSub) {
    heroSub.style.opacity = '0';
    heroSub.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroSub.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      heroSub.style.opacity = '';
      heroSub.style.transform = '';
    }, 750);
  }

  if (heroCtas) {
    heroCtas.style.opacity = '0';
    heroCtas.style.transform = 'translateY(20px)';
    setTimeout(() => {
      heroCtas.style.transition = 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)';
      heroCtas.style.opacity = '';
      heroCtas.style.transform = '';
    }, 950);
  }
})();

// ============================================================
// BUTTON RIPPLE EFFECT
// ============================================================
(function initRipple() {
  $$('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
        transform: translate(-50%, -50%);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;

      if (!document.getElementById('rippleStyles')) {
        const style = document.createElement('style');
        style.id = 'rippleStyles';
        style.textContent = `
          @keyframes rippleAnim {
            to { width: 200px; height: 200px; opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }

      if (getComputedStyle(btn).position === 'static') {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

// ============================================================
// ACTIVE NAV LINK DETECTION
// ============================================================
(function initActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .footer-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || href === `./${currentPath}`) {
      link.classList.add('active');
    }
  });
})();
