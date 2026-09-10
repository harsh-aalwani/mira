/**
 * MIRA — Custom Theme-Matched Cursor Experience
 * Precision dot + fluid trailing aura matching MIRA's light-mode palette.
 * Automatically activates on devices with a fine pointer (mouse/trackpad).
 */

(function initMiraCursor() {
  // Only activate on fine pointer devices (exclude touchscreens/tablets)
  if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) {
    return;
  }

  // Create cursor DOM elements
  const dot = document.createElement('div');
  dot.className = 'mira-cursor-dot';

  const ring = document.createElement('div');
  ring.className = 'mira-cursor-ring';

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isHovered = false;
  let isClicked = false;
  let isVisible = false;

  function updateDotTransform() {
    const scale = isClicked ? 1.3 : isHovered ? 0.7 : 1;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(${scale})`;
  }

  // Track mouse coordinates with zero-delay dot snapping
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isVisible) {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      ringX = mouseX;
      ringY = mouseY;
    }

    updateDotTransform();
  }, { passive: true });

  // Smooth lerp physics loop for the trailing ring
  function renderLoop() {
    if (isVisible) {
      // Lerp factor 0.18 gives a silky fluid chase effect
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      const ringScale = isClicked ? 0.8 : isHovered ? 1.35 : 1;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${ringScale})`;
    }
    requestAnimationFrame(renderLoop);
  }
  requestAnimationFrame(renderLoop);

  // Check if target element is interactive
  function isInteractive(target) {
    if (!target) return false;
    return !!target.closest(
      'a, button, input, select, textarea, [role="button"], .interactive-tab-btn, .scenario-pill, .audience-tab-btn, .citation-pill-demo, .cursor-pointer, [data-interactive="true"]'
    );
  }

  // Hover detection using event delegation
  document.addEventListener('mouseover', (e) => {
    if (isInteractive(e.target)) {
      isHovered = true;
      ring.classList.add('cursor-hover');
      dot.classList.add('cursor-hover');
      updateDotTransform();
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (isInteractive(e.target)) {
      isHovered = false;
      ring.classList.remove('cursor-hover');
      dot.classList.remove('cursor-hover');
      updateDotTransform();
    }
  }, { passive: true });

  // Tactile click states
  window.addEventListener('mousedown', () => {
    isClicked = true;
    ring.classList.add('cursor-active');
    dot.classList.add('cursor-active');
    updateDotTransform();
  }, { passive: true });

  window.addEventListener('mouseup', () => {
    isClicked = false;
    ring.classList.remove('cursor-active');
    dot.classList.remove('cursor-active');
    updateDotTransform();
  }, { passive: true });

  // Fade out when cursor exits the browser window
  document.addEventListener('mouseleave', () => {
    isVisible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    isVisible = true;
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();
