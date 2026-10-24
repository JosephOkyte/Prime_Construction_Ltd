/* ==========================================================================
   PRIME CONSTRUCTION — MAIN APPLICATION LOGIC
   Navigation, Counters, Project Filters, and Contact Handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. STICKY HEADER & SCROLL BEHAVIOR
  // =========================================================================
  const header = document.querySelector('.main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // =========================================================================
  // 2. MOBILE MENU TOGGLE
  // =========================================================================
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = navLinks.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', isExpanded ? 'x' : 'menu');
        if (window.lucide) window.lucide.createIcons();
      }
    });

    // Close when clicking a nav link on mobile
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('mobile-open') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          if (window.lucide) window.lucide.createIcons();
        }
      }
    });
  }

  // =========================================================================
  // 3. ANIMATED METRICS COUNTER (INTERSECTION OBSERVER)
  // =========================================================================
  const counterElements = document.querySelectorAll('.metric-number[data-target]');
  let hasAnimatedCounters = false;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimatedCounters) {
        hasAnimatedCounters = true;
        counterElements.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target'));
          const suffix = counter.getAttribute('data-suffix') || '';
          const isDecimal = target % 1 !== 0;
          let current = 0;
          const duration = 1800; // ms
          const stepTime = 20;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            counter.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
          }, stepTime);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.2 });

  const metricsStrip = document.querySelector('.hero-metrics-strip');
  if (metricsStrip) {
    counterObserver.observe(metricsStrip);
  }

  // =========================================================================
  // 4. PROJECT CATEGORY FILTERING
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. CONTACT FORM HANDLER
  // =========================================================================
  const contactForm = document.getElementById('mainContactForm');
  const formFeedback = document.getElementById('contactFormFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Transmitting to Prime HQ...';

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        if (formFeedback) {
          formFeedback.style.display = 'block';
          formFeedback.innerHTML = `
            <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); color: #15803d; padding: 16px; border-radius: 8px; margin-top: 16px; font-size: 0.875rem;">
              <strong>Thank you for reaching out.</strong> Your project inquiry has been logged with our Abuja Executive Desk. A senior engineering consultant will review your specifications and contact you at the provided email within 24 business hours. You may also follow up directly at <a href="mailto:primeconst@gmail.com" style="text-decoration: underline; font-weight: 600;">primeconst@gmail.com</a>.
            </div>
          `;
          setTimeout(() => {
            formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 100);
        }
      }, 1000);
    });
  }
});
