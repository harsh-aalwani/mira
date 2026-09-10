/**
 * Tactile Clay Cursor & Multi-Skin Easter Egg Engine
 * Cycles through 12 fun, professional, futuristic, and playful cursor variations
 * when the visitor clicks the central MIRA Hero Core Orb or interactive hint badge.
 * 
 * Hardware-accelerated with translate3d, particle trail physics,
 * tactile squash & stretch spring animations, Web Audio chime synthesizer,
 * and persistent session memory.
 */

(function () {
  'use strict';

  // 12 Distinctive Handcrafted Cursor Variations
  const cursorModes = [
    {
      id: 'pearl',
      name: 'Clay Pulse',
      category: 'Tactile 3D',
      icon: '🔮',
      symbol: '',
      hotspot: 'center',
      trail: false,
      desc: 'Soft 3D Ice-Blue Clay Pearl',
      hideNative: true
    },
    {
      id: 'cyber',
      name: 'Cyber HUD Reticle',
      category: 'Futuristic',
      icon: '🎯',
      symbol: '',
      hotspot: 'center',
      trail: false,
      desc: 'Sci-Fi Targeting System with Lock-On',
      hideNative: true
    },
    {
      id: 'magic',
      name: 'Cosmic Magic Wand',
      category: 'Whimsical',
      icon: '🪄',
      symbol: '🪄',
      hotspot: 'top-left',
      trail: 'sparkles',
      desc: 'Cosmic Wand Emitting Stardust Sparks',
      hideNative: true
    },
    {
      id: 'cat',
      name: 'Puffy Cat Paw',
      category: 'Cute & Playful',
      icon: '🐾',
      symbol: '🐾',
      hotspot: 'top-left',
      trail: 'paws',
      desc: 'Soft Kitten Toe Beans with Footprints',
      hideNative: true
    },
    {
      id: 'pizza',
      name: 'Cheesy Pizza Slice',
      category: 'Fun & Food',
      icon: '🍕',
      symbol: '🍕',
      hotspot: 'top-left',
      trail: 'pizza',
      desc: 'Fresh Pizza Slice with Cheese Pulls',
      hideNative: true
    },
    {
      id: 'retro',
      name: '8-Bit Arcade Gauntlet',
      category: 'Gaming',
      icon: '👾',
      symbol: '👾',
      hotspot: 'top-left',
      trail: 'retro',
      desc: 'Nostalgic Pixel Hand with Phosphor Glow',
      hideNative: true
    },
    {
      id: 'blob',
      name: 'Squishy Jelly Slime',
      category: 'Tactile Clay',
      icon: '🫧',
      symbol: '',
      hotspot: 'center',
      trail: 'bubbles',
      desc: 'Bioluminescent Velocity-Morphing Slime',
      hideNative: true
    },
    {
      id: 'blackhole',
      name: 'Cosmic Singularity',
      category: 'Sci-Fi Deep Void',
      icon: '🌌',
      symbol: '',
      hotspot: 'center',
      trail: 'cosmic',
      desc: 'Gravitational Vortex with Accretion Ring',
      hideNative: true
    },
    {
      id: 'party',
      name: 'Confetti Party Popper',
      category: 'Celebration',
      icon: '🎉',
      symbol: '🎉',
      hotspot: 'top-left',
      trail: 'confetti',
      desc: 'Party Popper Showering Confetti Bursts',
      hideNative: true
    },
    {
      id: 'laser',
      name: 'Studio Precision Laser',
      category: 'Engineering',
      icon: '⊕',
      symbol: '',
      hotspot: 'center',
      trail: 'laser',
      desc: 'Surgical Red Dot with Millimeter Crosshairs',
      hideNative: true
    },
    {
      id: 'crown',
      name: 'Royal Golden Crown',
      category: 'VIP Luxury',
      icon: '👑',
      symbol: '👑',
      hotspot: 'top-left',
      trail: 'crown',
      desc: 'Regal Shimmering Gold with Diamond Gleam',
      hideNative: true
    },
    {
      id: 'system',
      name: 'Classic System Pointer',
      category: 'Original OS',
      icon: '🖥️',
      symbol: '',
      hotspot: 'center',
      trail: false,
      desc: 'Default OS Arrow with Gentle Clay Aura',
      hideNative: false
    }
  ];

  // Retrieve saved preference or default to 0
  let savedIndex = 0;
  try {
    const stored = sessionStorage.getItem('mira_cursor_skin');
    if (stored !== null) {
      savedIndex = parseInt(stored, 10) % cursorModes.length;
      if (isNaN(savedIndex)) savedIndex = 0;
    }
  } catch (e) {
    savedIndex = 0;
  }

  let currentModeIndex = savedIndex;

  // DOM Elements
  const dot = document.createElement('div');
  dot.id = 'clay-cursor-dot';
  dot.className = 'clay-cursor-dot';
  dot.style.opacity = '0';
  document.body.appendChild(dot);

  const ring = document.createElement('div');
  ring.id = 'clay-cursor-ring';
  ring.className = 'clay-cursor-ring';
  ring.style.opacity = '0';
  document.body.appendChild(ring);

  // Easter Egg Toast Container
  const toast = document.createElement('div');
  toast.className = 'easter-egg-toast';
  toast.id = 'easter-egg-toast';
  document.body.appendChild(toast);
  let toastTimer = null;

  // Mouse coordinate trackers
  let mouseX = -100;
  let mouseY = -100;
  let prevMouseX = -100;
  let prevMouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let velocity = 0;
  let lastParticleTime = 0;
  let hasMovedMouse = false;
  let isWindowFocused = true;

  // Audio synthesizer for celebratory clicks
  function playMelodicChime(step) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Pentatonic harmonic notes for pleasing feedback
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      const rootFreq = notes[step % notes.length];

      // Primary tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(rootFreq, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(rootFreq * 1.5, ctx.currentTime + 0.15);
      gain1.gain.setValueAtTime(0.12, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.23);

      // Chime harmonic overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(rootFreq * 2, ctx.currentTime);
      gain2.gain.setValueAtTime(0.06, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Audio is an enhancement; fails gracefully
    }
  }

  // Particle Emitter
  function spawnParticle(x, y, type) {
    const p = document.createElement('div');
    p.className = 'cursor-particle';
    const offsetX = (Math.random() * 26 - 13);
    const offsetY = (Math.random() * 26 - 13);
    p.style.transform = `translate3d(${x + offsetX}px, ${y + offsetY}px, 0)`;

    if (type === 'sparkles') {
      const sparkles = ['✨', '⭐', '💫', '✦'];
      p.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      p.style.fontSize = '16px';
    } else if (type === 'paws') {
      const paws = ['🐾', '💖', '🌸'];
      p.textContent = paws[Math.floor(Math.random() * paws.length)];
      p.style.fontSize = '14px';
    } else if (type === 'pizza') {
      const crumbs = ['🍕', '🧀', '✨'];
      p.textContent = crumbs[Math.floor(Math.random() * crumbs.length)];
      p.style.fontSize = '14px';
    } else if (type === 'retro') {
      const pixels = ['👾', '🟩', '⭐', '⚡'];
      p.textContent = pixels[Math.floor(Math.random() * pixels.length)];
      p.style.fontSize = '14px';
    } else if (type === 'bubbles') {
      const bubbles = ['🫧', '💧', '✨'];
      p.textContent = bubbles[Math.floor(Math.random() * bubbles.length)];
      p.style.fontSize = '16px';
    } else if (type === 'cosmic') {
      const cosmic = ['🌌', '🟣', '✦', '⭐'];
      p.textContent = cosmic[Math.floor(Math.random() * cosmic.length)];
      p.style.fontSize = '13px';
    } else if (type === 'confetti') {
      const confetti = ['🎉', '🎊', '🎈', '🍬', '✨'];
      p.textContent = confetti[Math.floor(Math.random() * confetti.length)];
      p.style.fontSize = '16px';
    } else if (type === 'laser') {
      p.textContent = '•';
      p.style.color = '#EF4444';
      p.style.fontSize = '20px';
      p.style.textShadow = '0 0 6px #EF4444';
    } else if (type === 'crown') {
      const jewels = ['👑', '💎', '✨', '⭐'];
      p.textContent = jewels[Math.floor(Math.random() * jewels.length)];
      p.style.fontSize = '15px';
    }

    document.body.appendChild(p);
    setTimeout(() => {
      p.remove();
    }, 650);
  }

  // Apply Cursor Mode
  function applyCursorMode(index, playFeedback = true) {
    currentModeIndex = ((index % cursorModes.length) + cursorModes.length) % cursorModes.length;
    const mode = cursorModes[currentModeIndex];

    try {
      sessionStorage.setItem('mira_cursor_skin', currentModeIndex.toString());
    } catch (e) {}

    // 1. Toggle native cursor visibility
    if (mode.hideNative) {
      document.documentElement.classList.add('mira-custom-cursor');
    } else {
      document.documentElement.classList.remove('mira-custom-cursor');
    }

    // 2. Update DOM classnames & icons
    dot.className = `clay-cursor-dot mode-${mode.id} hotspot-${mode.hotspot}`;
    ring.className = `clay-cursor-ring mode-${mode.id}`;
    dot.textContent = mode.symbol;
    dot.setAttribute('data-mode', mode.id);

    // 3. Play audio & show toast feedback
    if (playFeedback) {
      playMelodicChime(currentModeIndex);
      showToast(mode);
    }
  }

  // Interactive Toast Notification
  function showToast(mode) {
    if (toastTimer) clearTimeout(toastTimer);

    toast.innerHTML = `
      <div class="toast-content" style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:1.8rem; line-height:1; filter:drop-shadow(0 2px 6px rgba(0,0,0,0.15));">${mode.icon}</span>
        <div style="text-align:left;">
          <div style="color:var(--text-primary); font-size:0.95rem; font-weight:800; display:flex; align-items:center; gap:8px;">
            <span>Easter Egg: ${mode.name}</span>
            <span style="font-size:0.7rem; padding:2px 8px; border-radius:12px; background:var(--primary-subtle); color:var(--primary); font-weight:700;">
              ${mode.category}
            </span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted); font-weight:600; margin-top:2px;">
            ${mode.desc} · <span style="color:var(--primary); font-weight:700;">${currentModeIndex + 1} of ${cursorModes.length}</span>
          </div>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px; margin-left:12px;">
        <button id="toast-next-btn" class="clay-btn" style="padding:6px 14px; font-size:0.75rem; border-radius:20px; cursor:pointer;" title="Next cursor">
          Next Skin ⇥
        </button>
        <button id="toast-close-btn" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:1.1rem; padding:4px;" title="Dismiss">
          ✕
        </button>
      </div>
    `;

    toast.classList.add('toast-active');

    // Attach toast button handlers
    const nextBtn = document.getElementById('toast-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyCursorMode(currentModeIndex + 1, true);
      });
    }

    const closeBtn = document.getElementById('toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toast.classList.remove('toast-active');
      });
    }

    toastTimer = setTimeout(() => {
      toast.classList.remove('toast-active');
    }, 3600);
  }

  // Mouse movement listener
  window.addEventListener('mousemove', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;

    const dx = mouseX - prevMouseX;
    const dy = mouseY - prevMouseY;
    velocity = Math.sqrt(dx * dx + dy * dy);

    if (!hasMovedMouse) {
      hasMovedMouse = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }

    // Position dot based on active hotspot
    const activeMode = cursorModes[currentModeIndex];
    if (activeMode.hotspot === 'top-left') {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-4px, -4px)`;
    } else {
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }

    // Dynamic slime stretch if blob mode is active
    if (activeMode.id === 'blob' && velocity > 2) {
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      const stretch = Math.min(1 + velocity * 0.02, 1.45);
      const squash = Math.max(1 - velocity * 0.015, 0.75);
      dot.style.transform += ` rotate(${angle}deg) scale(${stretch}, ${squash})`;
    }

    // Spawn trail particles with throttle
    if (activeMode.trail && Date.now() - lastParticleTime > 75) {
      spawnParticle(mouseX, mouseY, activeMode.trail);
      lastParticleTime = Date.now();
    }
  }, { passive: true });

  // Smooth lerp loop for aura ring
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  // Mouse leave/enter window visibility
  document.addEventListener('mouseleave', () => {
    isWindowFocused = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    isWindowFocused = true;
    if (hasMovedMouse) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
  });

  // Tactile press squish feedback on click
  window.addEventListener('mousedown', () => {
    dot.classList.add('cursor-pressed');
    ring.classList.add('cursor-pressed');
  });

  window.addEventListener('mouseup', () => {
    dot.classList.remove('cursor-pressed');
    ring.classList.remove('cursor-pressed');
  });

  // Interactive Hover Magnets
  function setupHoverListeners() {
    const interactiveElements = document.querySelectorAll(
      'a, button, .clay-btn, .clay-card-hover, .citation-chip, .demo-preset-pill, .format-card, .toggle-btn, .hero-core-orb'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('cursor-hover');
        dot.classList.add('cursor-hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('cursor-hover');
        dot.classList.remove('cursor-hover');
      });
    });
  }

  // Hero Core Orb Easter Egg Trigger (Secret)
  function setupEasterEgg() {
    const heroOrb = document.getElementById('hero-core-orb') || document.querySelector('.hero-core-orb');

    function triggerCycle(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (heroOrb) {
        // Rubber squash & stretch spring bounce
        heroOrb.classList.remove('orb-easter-egg-pop');
        void heroOrb.offsetWidth; // Force CSS reflow
        heroOrb.classList.add('orb-easter-egg-pop');
      }

      // Increment mode
      applyCursorMode(currentModeIndex + 1, true);
    }

    if (heroOrb) {
      heroOrb.style.cursor = 'pointer';
      heroOrb.addEventListener('click', triggerCycle);
      heroOrb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          triggerCycle(e);
        }
      });
    }
  }

  // Initialize
  function init() {
    setupHoverListeners();
    setupEasterEgg();
    // Initialize without audio chime on initial page load
    applyCursorMode(currentModeIndex, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global methods for external triggers or dev console
  window.reinitClayCursor = setupHoverListeners;
  window.cycleCursorMode = () => applyCursorMode(currentModeIndex + 1, true);
  window.setCursorMode = (idx) => applyCursorMode(idx, true);
})();
