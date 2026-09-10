/* ==========================================================================
   MIRA MAIN CLIENT CONTROLLER
   Scroll Wayfinding, Navbar Morphing, Modality Cards & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Wayfinding Navbar Scroll Morphing
  const nav = document.querySelector('.metro-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }, { passive: true });

  // 2. Mobile Nav Toggle
  const navToggle = document.querySelector('.nav-toggle-btn');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
    });

    // Close when clicking any nav link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('nav-open');
      });
    });
  }

  // 3. Smooth Anchor Scrolling with Wayfinding Offset
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 4. Hero Visual Stage Interactive Magnetic Mouse Movement
  const heroStage = document.querySelector('.hero-visual-stage');
  const tokens = document.querySelectorAll('.format-clay-token');
  if (heroStage && tokens.length > 0) {
    heroStage.addEventListener('mousemove', (e) => {
      const rect = heroStage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      tokens.forEach((token, index) => {
        const factor = (index + 1) * 6;
        token.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    });

    heroStage.addEventListener('mouseleave', () => {
      tokens.forEach(token => {
        token.style.transform = '';
      });
    });
  }

  // 5. Scroll-Triggered Fade / Elevation Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.clay-card, .format-clay-slab, .route-panel, .tech-station-slab').forEach(el => {
    scrollObserver.observe(el);
  });

  // 6. Interactive Modality Cards: Click to expand / highlight
  const modalityCards = document.querySelectorAll('.modality-tactile-card');
  modalityCards.forEach(card => {
    card.addEventListener('click', () => {
      modalityCards.forEach(c => c.classList.remove('active-expanded'));
      card.classList.add('active-expanded');
    });
  });

  // 7. Coming Soon Simulated Form Feedback
  const notifyForm = document.getElementById('cs-notify-form');
  const notifyInput = document.getElementById('cs-notify-email');
  const notifySuccess = document.getElementById('cs-notify-success');

  if (notifyForm && notifyInput && notifySuccess) {
    notifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = notifyInput.value.trim();
      if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }
      notifyForm.style.display = 'none';
      notifySuccess.style.display = 'block';
    });
  }
});
