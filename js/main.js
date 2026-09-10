/**
 * MIRA Main Site Interactions
 * Smooth navigation, problem toggle, multimodal convergence,
 * scroll observers, and citation interactive preview.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Scroll-driven "Scattered to Organized" Transformation
    const problemDesk = document.getElementById('problem-desk');
    const toggleScattered = document.getElementById('toggle-scattered');
    const toggleOrganized = document.getElementById('toggle-organized');

    if (problemDesk) {
      const cards = [
        { el: problemDesk.querySelector('.sc-1'), scattered: { x: -35, y: 30, rot: -10 } },
        { el: problemDesk.querySelector('.sc-2'), scattered: { x: 30, y: -25, rot: 11 } },
        { el: problemDesk.querySelector('.sc-3'), scattered: { x: 45, y: -30, rot: 7 } },
        { el: problemDesk.querySelector('.sc-4'), scattered: { x: -30, y: 35, rot: -12 } },
        { el: problemDesk.querySelector('.sc-5'), scattered: { x: 90, y: -40, rot: -6 } },
        { el: problemDesk.querySelector('.sc-6'), scattered: { x: -80, y: -35, rot: 9 } }
      ];

      const centralHub = problemDesk.querySelector('.problem-central-hub');

      let currentProgress = 0;
      let targetProgress = 0;
      let manualOverride = false;
      let manualTimeout = null;

      function updateCards(p) {
        cards.forEach(item => {
          if (!item.el) return;
          // When p = 0: scattered; when p = 1: organized (x=0, y=0, rot=0)
          const x = item.scattered.x * (1 - p);
          const y = item.scattered.y * (1 - p);
          const rot = item.scattered.rot * (1 - p);
          item.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`;
        });

        if (centralHub) {
          const hubScale = 0.55 + 0.45 * p;
          const hubOpacity = Math.max(0, Math.min(1, (p - 0.15) / 0.75));
          centralHub.style.transform = `translate(-50%, -50%) scale(${hubScale})`;
          centralHub.style.opacity = hubOpacity.toString();
          centralHub.style.pointerEvents = p > 0.6 ? 'auto' : 'none';
        }

        if (toggleScattered && toggleOrganized) {
          if (p >= 0.5) {
            toggleOrganized.classList.add('active');
            toggleScattered.classList.remove('active');
          } else {
            toggleScattered.classList.add('active');
            toggleOrganized.classList.remove('active');
          }
        }
      }

      function onScroll() {
        if (manualOverride) return;
        const rect = problemDesk.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Start transforming when top of desk reaches 85% of viewport
        // Fully organized when top of desk reaches 22% of viewport
        const startY = windowHeight * 0.85;
        const endY = windowHeight * 0.22;
        
        let p = (startY - rect.top) / (startY - endY);
        p = Math.max(0, Math.min(1, p));
        targetProgress = p;
      }

      // Smooth RAF loop for 60fps / 120fps motion
      function animate() {
        if (!manualOverride) {
          currentProgress += (targetProgress - currentProgress) * 0.12;
          if (Math.abs(targetProgress - currentProgress) < 0.001) {
            currentProgress = targetProgress;
          }
          updateCards(currentProgress);
        }
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();

      // Support manual toggle buttons
      if (toggleScattered) {
        toggleScattered.addEventListener('click', () => {
          manualOverride = true;
          targetProgress = 0;
          currentProgress = 0;
          updateCards(0);
          clearTimeout(manualTimeout);
          manualTimeout = setTimeout(() => { manualOverride = false; }, 1200);
        });
      }

      if (toggleOrganized) {
        toggleOrganized.addEventListener('click', () => {
          manualOverride = true;
          targetProgress = 1;
          currentProgress = 1;
          updateCards(1);
          clearTimeout(manualTimeout);
          manualTimeout = setTimeout(() => { manualOverride = false; }, 1200);
        });
      }
    }

    // 2. Sequential Scroll-Driven Checklist for Step 2 ("MIRA understands it")
    const understandChecklist = document.getElementById('understand-checklist');
    if (understandChecklist) {
      const understandItems = understandChecklist.querySelectorAll('.understand-item');

      function onScrollUnderstand() {
        const rect = understandChecklist.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Starts ticking when the checklist enters 85% of viewport
        // All 4 ticked when top reaches 30% of viewport
        const startY = windowHeight * 0.85;
        const endY = windowHeight * 0.30;

        let p = (startY - rect.top) / (startY - endY);
        p = Math.max(0, Math.min(1, p));

        const thresholds = [0.12, 0.38, 0.64, 0.88];
        understandItems.forEach((item, index) => {
          if (p >= thresholds[index]) {
            item.classList.add('ticked');
          } else {
            item.classList.remove('ticked');
          }
        });
      }

      // Also allow direct tactile clicks
      understandItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', () => {
          item.classList.toggle('ticked');
        });
      });

      window.addEventListener('scroll', onScrollUnderstand, { passive: true });
      window.addEventListener('resize', onScrollUnderstand, { passive: true });
      onScrollUnderstand();
    }

    // 3. Sequential Scroll-Driven Pop for Cross-Modal Understanding ("The answer can be hiding anywhere.")
    // Left-to-right & top-to-bottom: rn-1 (top-left) -> rn-2 (top-right) -> rn-3 (bottom-left) -> rn-4 (bottom-right)
    const crossModalScene = document.getElementById('cross-modal-scene');
    if (crossModalScene) {
      const centerCard = document.getElementById('radial-center-card');
      const nodes = [
        { el: crossModalScene.querySelector('.rn-1'), line: crossModalScene.querySelector('.rl-1'), threshold: 0.12 },
        { el: crossModalScene.querySelector('.rn-2'), line: crossModalScene.querySelector('.rl-2'), threshold: 0.38 },
        { el: crossModalScene.querySelector('.rn-3'), line: crossModalScene.querySelector('.rl-3'), threshold: 0.64 },
        { el: crossModalScene.querySelector('.rn-4'), line: crossModalScene.querySelector('.rl-4'), threshold: 0.88 }
      ];

      function onScrollCrossModal() {
        const rect = crossModalScene.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Starts popping when top of scene reaches 85% of viewport
        // All 4 popped when top reaches 25% of viewport
        const startY = windowHeight * 0.85;
        const endY = windowHeight * 0.25;

        let p = (startY - rect.top) / (startY - endY);
        p = Math.max(0, Math.min(1, p));

        let allPopped = true;
        nodes.forEach(item => {
          if (p >= item.threshold) {
            if (item.el && !item.el.classList.contains('node-popped')) {
              item.el.classList.add('node-popped');
            }
            if (item.line && !item.line.classList.contains('active')) {
              item.line.classList.add('active');
            }
          } else {
            allPopped = false;
            if (item.el && item.el.classList.contains('node-popped')) {
              item.el.classList.remove('node-popped');
            }
            if (item.line && item.line.classList.contains('active')) {
              item.line.classList.remove('active');
            }
          }
        });

        if (centerCard) {
          if (allPopped) {
            centerCard.classList.add('all-connected');
          } else {
            centerCard.classList.remove('all-connected');
          }
        }
      }

      window.addEventListener('scroll', onScrollCrossModal, { passive: true });
      window.addEventListener('resize', onScrollCrossModal, { passive: true });
      onScrollCrossModal();
    }

    // 4. Staggered Left-to-Right Pop-Up Entrance for Audience Cards ("Built for people who have a lot to remember.")
    const audienceGrid = document.getElementById('audience-grid');
    if (audienceGrid) {
      const cards = audienceGrid.querySelectorAll('.audience-card');
      let audienceAnimated = false;

      function triggerAudiencePop() {
        if (audienceAnimated) return;
        const rect = audienceGrid.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Triggers pop-up sequence as soon as the top of the audience section reaches 82% of viewport
        if (rect.top <= windowHeight * 0.82) {
          audienceAnimated = true;
          cards.forEach((card, idx) => {
            setTimeout(() => {
              card.classList.add('card-revealed');
            }, idx * 220); // 0ms, 220ms, 440ms: deliberate, satisfying sequential pop-ups
          });
          window.removeEventListener('scroll', triggerAudiencePop);
        }
      }

      window.addEventListener('scroll', triggerAudiencePop, { passive: true });
      window.addEventListener('resize', triggerAudiencePop, { passive: true });
      triggerAudiencePop();
    }

    // 5. Interactive Privacy Diagram Ping
    const localZone = document.querySelector('.zone-local');
    if (localZone) {
      localZone.style.cursor = 'pointer';
      localZone.title = 'Protected On-Device Core (Click to ping)';
      localZone.addEventListener('click', () => {
        localZone.style.boxShadow = '0 0 32px rgba(37, 99, 235, 0.35)';
        localZone.style.borderColor = '#2563EB';
        setTimeout(() => {
          localZone.style.boxShadow = '';
          localZone.style.borderColor = '';
        }, 1000);
      });
    }

    const cloudZone = document.querySelector('.zone-cloud');
    if (cloudZone) {
      cloudZone.style.cursor = 'pointer';
      cloudZone.title = 'Optional External Models (Bring Your Own API)';
      cloudZone.addEventListener('click', () => {
        cloudZone.style.boxShadow = '0 0 28px rgba(124, 58, 237, 0.3)';
        cloudZone.style.borderColor = '#8B5CF6';
        setTimeout(() => {
          cloudZone.style.boxShadow = '';
          cloudZone.style.borderColor = '';
        }, 1000);
      });
    }

    // 6. Mobile Navigation Menu Toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn && navLinks) {
      menuBtn.addEventListener('click', () => {
        const isOpen = navLinks.style.display === 'flex';
        navLinks.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
          navLinks.style.flexDirection = 'column';
          navLinks.style.position = 'absolute';
          navLinks.style.top = '70px';
          navLinks.style.left = '24px';
          navLinks.style.right = '24px';
          navLinks.style.background = 'white';
          navLinks.style.padding = '24px';
          navLinks.style.borderRadius = '24px';
          navLinks.style.boxShadow = '0 12px 30px rgba(0,0,0,0.12)';
        }
      });
    }

    // 4. Smooth Anchor Link Handler
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // 5. Scroll Reveal with IntersectionObserver
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      revealObserver.observe(el);
    });
  });
})();
