/**
 * MIRA — Coming Soon Page Interactions
 * Handles ambient physics, cursor parallax drift, and visual staging effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initFloatingDrift();
});

function initFloatingDrift() {
  const floaters = document.querySelectorAll('.interactive-float');
  if (!floaters.length || window.innerWidth < 768) return;

  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 16;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 16;

        floaters.forEach((el, index) => {
          const factor = (index % 3 + 1) * 0.35;
          el.style.transform = `translate3d(${mouseX * factor}px, ${mouseY * factor}px, 0)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });
}
