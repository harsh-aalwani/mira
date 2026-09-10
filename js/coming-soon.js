/**
 * MIRA Coming Soon - Interactive Waitlist & Orb Physics
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('waitlistForm');
  const feedback = document.getElementById('waitlistFeedback');
  const orb = document.getElementById('comingSoonOrb');

  if (form && feedback) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('waitlistEmail');
      const email = emailInput?.value.trim();

      if (!email || !email.includes('@')) {
        feedback.textContent = 'Please enter a valid email address.';
        feedback.style.color = '#B83831';
        feedback.style.display = 'block';
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Securing Priority...';
      }

      setTimeout(() => {
        form.style.display = 'none';
        feedback.innerHTML = `
          <div class="clay-sunken" style="padding: 24px; border-radius: 20px; text-align: center;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #E2EFE7; color: #468A65; display: inline-flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 12px;">✓</div>
            <h4 style="font-size: 1.2rem; font-weight: 800; color: #1E2024; margin-bottom: 6px;">You are on the private access list!</h4>
            <p style="font-size: 0.92rem; color: #4A4E58;">We have recorded <strong style="color: #7C5EB6;">${email}</strong>. You'll receive early build notifications when the desktop client is available.</p>
          </div>
        `;
        feedback.style.display = 'block';
      }, 700);
    });
  }

  // Interactive 3D orb tracking
  if (orb && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (clientX - centerX) / centerX;
      const deltaY = (clientY - centerY) / centerY;

      orb.style.transform = `translate(${deltaX * 18}px, ${deltaY * 18}px) scale(1.02)`;
    });
  }
});
