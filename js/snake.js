/**
 * Claymorphic Snake Game Easter Egg Engine (High Performance & Low Overhead)
 * 
 * Features:
 * - Deterministic RAF delta-time game loop (independent of display refresh rate: 60Hz, 120Hz, 144Hz+)
 * - performance.now() exact timestamp countdown (immune to thread stutter/setInterval drift)
 * - Zero heavy canvas shadowBlur passes or particle loops (ultra-lightweight on low-end devices)
 * - 6 floating modality items as targets, hard perimeter borders, Web Audio synthesized tones
 */

(function () {
  'use strict';

  // 6 Floating Knowledge Modalities
  const MODALITIES = [
    { id: 'pdf', name: 'PDF', icon: '📄', color: '#4F46E5', bg: '#EEF2FF', label: 'PDF Report' },
    { id: 'docx', name: 'DOCX', icon: '📝', color: '#0284C7', bg: '#E0F2FE', label: 'Word Draft' },
    { id: 'img', name: 'IMG', icon: '🖼️', color: '#0891B2', bg: '#ECFEFF', label: 'Visual Chart' },
    { id: 'audio', name: 'AUDIO', icon: '🎙️', color: '#7C3AED', bg: '#F5F3FF', label: 'Voice Audio' },
    { id: 'video', name: 'VIDEO', icon: '🎬', color: '#3B82F6', bg: '#EFF6FF', label: 'Video Clip' },
    { id: 'txt', name: 'TXT', icon: '📋', color: '#475569', bg: '#F8FAFC', label: 'Text Note' }
  ];

  const GRID_SIZE = 20; // 20x20 grid
  const CANVAS_RES = 400; // 400x400 canvas internal resolution
  const CELL_SIZE = CANVAS_RES / GRID_SIZE; // 20px per cell
  const STEP_INTERVAL_MS = 125; // 8 moves per second, constant regardless of display Hz

  // DOM Elements
  let coreOrb = null;
  let csCard = null;
  let gameWrapper = null;
  let canvas = null;
  let ctx = null;
  let countdownOverlay = null;
  let countdownNumber = null;
  let progressRing = null;
  let statusOverlay = null;
  let statusIcon = null;
  let statusHeadline = null;
  let statusBody = null;
  let statusActions = null;

  // Game Loop & Timing Variables
  let isGameActive = false;
  let gameLoopId = null;
  let lastFrameTime = 0;
  let accumulator = 0;
  let countdownRafId = null;

  // Game State
  let snake = [];
  let direction = { x: 1, y: 0 };
  let nextDirection = { x: 1, y: 0 };
  let hasProcessedMove = true;
  let currentFood = null;
  let collectedModalities = new Set();
  let remainingModalities = [];
  let gameStartTime = 0;
  let foodPulse = 0;

  // Reusable Audio Context to minimize memory & garbage collection
  let sharedAudioCtx = null;
  function getAudioContext() {
    if (!sharedAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  }

  // Lightweight Sound Synthesizer (Zero asset loading, micro-durations)
  function playTone(type) {
    try {
      const actx = getAudioContext();
      if (!actx) return;

      const t = actx.currentTime;
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.connect(gain);
      gain.connect(actx.destination);

      if (type === 'count-tick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.09);
      } else if (type === 'count-go') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.exponentialRampToValueAtTime(1320, t + 0.18);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.22);
      } else if (type === 'eat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587, t);
        osc.frequency.exponentialRampToValueAtTime(987, t + 0.1);
        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.start(t);
        osc.stop(t + 0.13);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.25);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.start(t);
        osc.stop(t + 0.3);
      } else if (type === 'victory') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523, t);
        osc.frequency.exponentialRampToValueAtTime(1046, t + 0.25);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.start(t);
        osc.stop(t + 0.3);
      }
    } catch (e) {
      // Audio optional
    }
  }

  // Construct Snake Game DOM
  function createGameDOM() {
    gameWrapper = document.createElement('div');
    gameWrapper.className = 'snake-game-wrapper';
    gameWrapper.id = 'snake-game-modal';

    gameWrapper.innerHTML = `
      <!-- Header & HUD -->
      <div class="snake-hud-header">
        <div class="snake-title-group">
          <div class="snake-game-title">
            <span>🐍 MIRA Knowledge Runner</span>
          </div>
          <div class="snake-game-subtitle">
            Navigate walls &amp; retrieve all 6 orbiting modalities
          </div>
        </div>
        <button class="snake-close-btn" id="snake-close-btn" title="Exit Game">✕</button>
      </div>

      <!-- Modalities Collection Tray -->
      <div class="snake-modalities-tray" id="snake-modalities-tray">
        ${MODALITIES.map(m => `
          <div class="modality-slot" id="slot-${m.id}" data-id="${m.id}" title="${m.label}">
            <div class="slot-icon">${m.icon}</div>
            <div class="slot-name">${m.name}</div>
          </div>
        `).join('')}
      </div>

      <!-- Canvas Stage with Hard Borders -->
      <div class="snake-canvas-container">
        <canvas id="snake-canvas" width="${CANVAS_RES}" height="${CANVAS_RES}"></canvas>

        <!-- Deterministic Timestamp Countdown Overlay -->
        <div class="snake-countdown-overlay" id="snake-countdown">
          <div class="countdown-dial-wrapper">
            <svg class="countdown-svg" viewBox="0 0 140 140">
              <circle class="countdown-svg-bg" cx="70" cy="70" r="58" />
              <circle class="countdown-svg-progress" id="countdown-progress-ring" cx="70" cy="70" r="58" />
            </svg>
            <div class="countdown-number" id="countdown-number">3</div>
          </div>
          <div class="countdown-label">Synchronizing Space...</div>
        </div>

        <!-- Status Overlay (Game Over / Victory) -->
        <div class="snake-status-overlay" id="snake-status-overlay">
          <div class="status-badge-icon" id="status-icon">🎉</div>
          <div class="status-headline" id="status-headline">Status</div>
          <div class="status-body" id="status-body">Description</div>
          <div class="status-actions" id="status-actions">
            <!-- Injected dynamically -->
          </div>
        </div>
      </div>

      <!-- Responsive On-Screen Tactile D-Pad -->
      <div class="snake-dpad">
        <button class="dpad-btn dpad-up" id="dpad-up" aria-label="Up">▲</button>
        <button class="dpad-btn dpad-left" id="dpad-left" aria-label="Left">◀</button>
        <button class="dpad-btn dpad-down" id="dpad-down" aria-label="Down">▼</button>
        <button class="dpad-btn dpad-right" id="dpad-right" aria-label="Right">▶</button>
      </div>

      <!-- Control Instructions -->
      <div class="snake-instructions">
        <span>Controls:</span>
        <span class="key-badge">W A S D</span> or <span class="key-badge">Arrow Keys</span>
        <span>• Solid Perimeter Borders</span>
      </div>
    `;

    document.querySelector('.coming-soon-wrapper').appendChild(gameWrapper);

    // Cache elements
    canvas = document.getElementById('snake-canvas');
    ctx = canvas.getContext('2d', { alpha: false }); // alpha false optimizes compositor performance
    countdownOverlay = document.getElementById('snake-countdown');
    countdownNumber = document.getElementById('countdown-number');
    progressRing = document.getElementById('countdown-progress-ring');
    statusOverlay = document.getElementById('snake-status-overlay');
    statusIcon = document.getElementById('status-icon');
    statusHeadline = document.getElementById('status-headline');
    statusBody = document.getElementById('status-body');
    statusActions = document.getElementById('status-actions');

    // Close button
    document.getElementById('snake-close-btn').addEventListener('click', closeGame);

    // D-Pad handlers
    document.getElementById('dpad-up').addEventListener('click', () => setDirection(0, -1));
    document.getElementById('dpad-down').addEventListener('click', () => setDirection(0, 1));
    document.getElementById('dpad-left').addEventListener('click', () => setDirection(-1, 0));
    document.getElementById('dpad-right').addEventListener('click', () => setDirection(1, 0));

    // Touch swipe handling on canvas
    let touchStartX = 0;
    let touchStartY = 0;
    canvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) > 18) {
        if (absDx > absDy) {
          setDirection(dx > 0 ? 1 : -1, 0);
        } else {
          setDirection(0, dy > 0 ? 1 : -1);
        }
      }
    }, { passive: true });
  }

  // Keyboard navigation
  function handleKeyDown(e) {
    if (!isGameActive && !statusOverlay.classList.contains('active')) return;

    if (e.key === 'ArrowUp' || e.key === 'KeyW' || e.code === 'KeyW') {
      e.preventDefault();
      setDirection(0, -1);
    } else if (e.key === 'ArrowDown' || e.key === 'KeyS' || e.code === 'KeyS') {
      e.preventDefault();
      setDirection(0, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'KeyA' || e.code === 'KeyA') {
      e.preventDefault();
      setDirection(-1, 0);
    } else if (e.key === 'ArrowRight' || e.key === 'KeyD' || e.code === 'KeyD') {
      e.preventDefault();
      setDirection(1, 0);
    } else if (e.key === 'Escape') {
      closeGame();
    } else if (e.key === ' ' || e.code === 'Space') {
      const primaryBtn = statusActions.querySelector('.clay-btn-primary');
      if (primaryBtn && statusOverlay.classList.contains('active')) {
        e.preventDefault();
        primaryBtn.click();
      }
    }
  }

  function setDirection(dx, dy) {
    // Only accept 1 direction change per grid tick to prevent self-collision on quick taps
    if (!hasProcessedMove) return;

    // Prevent immediate 180-degree turn
    if (direction.x + dx === 0 && direction.y + dy === 0) return;

    nextDirection = { x: dx, y: dy };
    hasProcessedMove = false;
  }

  // Exact Spring Pop Animation for Countdown Numbers (Web Animations API)
  function triggerPop(text, soundType) {
    countdownNumber.textContent = text;
    playTone(soundType);

    try {
      countdownNumber.animate([
        { transform: 'scale(0.3)', opacity: 0 },
        { transform: 'scale(1.22)', opacity: 1, offset: 0.28 },
        { transform: 'scale(0.96)', opacity: 1, offset: 0.68 },
        { transform: 'scale(1)', opacity: 1, offset: 0.88 },
        { transform: 'scale(0.94)', opacity: 0.9, offset: 1.0 }
      ], {
        duration: 900,
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        fill: 'forwards'
      });
    } catch (e) {
      // Fallback
    }
  }

  // Open Game with Smooth Transition
  function openGame() {
    if (gameWrapper.classList.contains('active')) return;

    coreOrb.classList.add('orb-easter-egg-pop');
    setTimeout(() => coreOrb.classList.remove('orb-easter-egg-pop'), 400);

    csCard.classList.add('cs-card-hidden');
    gameWrapper.classList.add('active');

    // Wait 350ms for the modal opening transition to settle first
    // so the visitor experiences the full 1.0s of "3" from the very start
    setTimeout(() => {
      startPreciseCountdown();
    }, 350);
  }

  // Close Game & Return to Coming Soon Screen
  function closeGame() {
    isGameActive = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (countdownRafId) cancelAnimationFrame(countdownRafId);

    statusOverlay.classList.remove('active');
    countdownOverlay.classList.remove('active');
    gameWrapper.classList.remove('active');
    csCard.classList.remove('cs-card-hidden');
  }

  // Precise Timestamp-Based Countdown with 100% Synchronized Visual Dial & Pop
  function startPreciseCountdown() {
    isGameActive = false;
    if (gameLoopId) cancelAnimationFrame(gameLoopId);
    if (countdownRafId) cancelAnimationFrame(countdownRafId);

    statusOverlay.classList.remove('active');
    countdownOverlay.classList.add('active');

    resetGameState();
    renderStaticBoard();

    const TOTAL_COUNTDOWN_MS = 3000;
    const RING_CIRCUMFERENCE = 365;
    if (progressRing) progressRing.style.strokeDashoffset = '0px';

    const startTimestamp = performance.now();
    let currentPhase = -1;

    function countdownStep(now) {
      const elapsed = now - startTimestamp;

      // Update circular SVG progress ring in real-time
      if (progressRing) {
        const progress = Math.min(Math.max(elapsed / TOTAL_COUNTDOWN_MS, 0), 1);
        progressRing.style.strokeDashoffset = (RING_CIRCUMFERENCE * progress) + 'px';
      }

      if (elapsed < 1000) {
        if (currentPhase !== 3) {
          currentPhase = 3;
          triggerPop('3', 'count-tick');
        }
      } else if (elapsed < 2000) {
        if (currentPhase !== 2) {
          currentPhase = 2;
          triggerPop('2', 'count-tick');
        }
      } else if (elapsed < 3000) {
        if (currentPhase !== 1) {
          currentPhase = 1;
          triggerPop('1', 'count-tick');
        }
      } else if (elapsed < 3500) {
        if (currentPhase !== 0) {
          currentPhase = 0;
          triggerPop('GO!', 'count-go');
        }
      } else {
        // Complete countdown: dissolve overlay and launch game loop
        countdownOverlay.classList.remove('active');
        startGameLoop();
        return;
      }

      countdownRafId = requestAnimationFrame(countdownStep);
    }

    countdownRafId = requestAnimationFrame(countdownStep);
  }

  // Reset Game State
  function resetGameState() {
    snake = [
      { x: 7, y: 10 },
      { x: 6, y: 10 },
      { x: 5, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    nextDirection = { x: 1, y: 0 };
    hasProcessedMove = true;
    collectedModalities = new Set();
    remainingModalities = [...MODALITIES];
    gameStartTime = performance.now();
    accumulator = 0;
    foodPulse = 0;

    // Reset UI Tray
    document.querySelectorAll('.modality-slot').forEach(slot => {
      slot.classList.remove('collected');
    });

    // Spawn first modality item
    spawnNextFood();
  }

  // Spawn Next Modality Item
  function spawnNextFood() {
    if (remainingModalities.length === 0) {
      currentFood = null;
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingModalities.length);
    const mod = remainingModalities[randomIndex];

    // Find random free cell inside borders (grid coordinate 1 to 18)
    let validCell = null;
    let attempts = 0;
    while (!validCell && attempts < 250) {
      attempts++;
      const rx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      const ry = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;

      const collidesWithSnake = snake.some(s => s.x === rx && s.y === ry);
      if (!collidesWithSnake) {
        validCell = { x: rx, y: ry, modality: mod };
      }
    }

    currentFood = validCell || { x: 10, y: 5, modality: mod };
  }

  // Fixed Timestep / Delta-Time Game Loop (Decoupled from screen refresh rate)
  function startGameLoop() {
    isGameActive = true;
    lastFrameTime = performance.now();
    accumulator = 0;

    function frame(currentTime) {
      if (!isGameActive) return;

      // Calculate real-world delta time in milliseconds
      const delta = Math.min(currentTime - lastFrameTime, 100); // Clamp to avoid spiral on tab switch
      lastFrameTime = currentTime;
      accumulator += delta;

      // Consume accumulator in exact fixed timesteps
      while (accumulator >= STEP_INTERVAL_MS) {
        updateStep();
        accumulator -= STEP_INTERVAL_MS;
      }

      foodPulse += delta * 0.005;
      render();

      gameLoopId = requestAnimationFrame(frame);
    }

    gameLoopId = requestAnimationFrame(frame);
  }

  // Grid Step Update (Moves snake exactly 1 cell)
  function updateStep() {
    direction = nextDirection;
    hasProcessedMove = true;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 1. Wall Collision (Hard solid border 0..GRID_SIZE-1)
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      triggerGameOver('Border Wall Collision');
      return;
    }

    // 2. Self Collision
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        triggerGameOver('Self Collision');
        return;
      }
    }

    // Advance snake
    snake.unshift(head);

    // 3. Food Collection Check
    if (currentFood && head.x === currentFood.x && head.y === currentFood.y) {
      handleItemCollected(currentFood.modality);
    } else {
      // Normal move: remove tail
      snake.pop();
    }
  }

  // Handle Modality Item Collection
  function handleItemCollected(mod) {
    playTone('eat');
    collectedModalities.add(mod.id);

    // Remove from remaining list
    remainingModalities = remainingModalities.filter(m => m.id !== mod.id);

    // Light up HUD slot
    const slot = document.getElementById(`slot-${mod.id}`);
    if (slot) slot.classList.add('collected');

    // Check Victory: All 6 Collected!
    if (collectedModalities.size === MODALITIES.length) {
      triggerVictory();
    } else {
      spawnNextFood();
    }
  }

  // Game Over Handler
  function triggerGameOver() {
    isGameActive = false;
    playTone('gameover');

    statusIcon.textContent = '💥';
    statusHeadline.textContent = 'Signal Interrupted';
    statusBody.textContent = `You retrieved ${collectedModalities.size} of 6 modalities before colliding with the perimeter.`;

    statusActions.innerHTML = `
      <button class="clay-btn clay-btn-primary" id="btn-retry">
        Try Again ↺
      </button>
      <button class="clay-btn clay-btn-secondary" id="btn-exit-go">
        Return to Launch
      </button>
    `;

    document.getElementById('btn-retry').addEventListener('click', startPreciseCountdown);
    document.getElementById('btn-exit-go').addEventListener('click', closeGame);

    statusOverlay.classList.add('active');
  }

  // Victory Handler (Lightweight, zero confetti overhead)
  function triggerVictory() {
    isGameActive = false;
    playTone('victory');

    const elapsedSeconds = ((performance.now() - gameStartTime) / 1000).toFixed(1);

    statusIcon.textContent = '🎉';
    statusHeadline.textContent = 'All 6 Modalities Retrieved!';
    statusBody.textContent = `Synchronized in ${elapsedSeconds}s! All documents, recordings, visuals, and notes successfully indexed.`;

    statusActions.innerHTML = `
      <button class="clay-btn clay-btn-primary" id="btn-replay">
        Play Again ↺
      </button>
      <button class="clay-btn clay-btn-secondary" id="btn-exit-vic">
        Return to Launch
      </button>
    `;

    document.getElementById('btn-replay').addEventListener('click', startPreciseCountdown);
    document.getElementById('btn-exit-vic').addEventListener('click', closeGame);

    statusOverlay.classList.add('active');
  }

  // Render Static Board Before Start
  function renderStaticBoard() {
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, CANVAS_RES, CANVAS_RES);
    drawGridLines();
    drawFoodItem();
    drawSnakeBody();
  }

  // High-Efficiency Render Routine (Zero shadowBlur, pure crisp 2D shapes)
  function render() {
    // Fill canvas background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, CANVAS_RES, CANVAS_RES);

    drawGridLines();
    drawFoodItem();
    drawSnakeBody();
  }

  // Background Grid Guide
  function drawGridLines() {
    // Subtle dotted grid
    ctx.fillStyle = '#CBD5E1';
    for (let x = 1; x < GRID_SIZE; x++) {
      for (let y = 1; y < GRID_SIZE; y++) {
        ctx.fillRect(x * CELL_SIZE - 1, y * CELL_SIZE - 1, 2, 2);
      }
    }

    // Border Guideline
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, CANVAS_RES - 2, CANVAS_RES - 2);
  }

  // Draw Modality Item (Food) - Lightweight & Crisp
  function drawFoodItem() {
    if (!currentFood) return;

    const mod = currentFood.modality;
    const px = currentFood.x * CELL_SIZE;
    const py = currentFood.y * CELL_SIZE;
    const padding = 2;
    const size = CELL_SIZE - padding * 2;

    // Tile Body
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(px + padding, py + padding, size, size, 5);
    ctx.fill();

    // Tile Border in Modality Color
    ctx.strokeStyle = mod.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Icon Emoji
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mod.icon, px + CELL_SIZE / 2, py + CELL_SIZE / 2 + 1);
  }

  // Draw Snake - High-speed, Clay-styled rounded segments without GPU blur
  function drawSnakeBody() {
    if (snake.length === 0) return;

    const len = snake.length;

    // 1. Draw Body Segments
    for (let i = len - 1; i > 0; i--) {
      const seg = snake[i];
      const cx = seg.x * CELL_SIZE + CELL_SIZE / 2;
      const cy = seg.y * CELL_SIZE + CELL_SIZE / 2;
      const t = i / len;

      // Gradient color interpolation: Indigo to Lavender
      const r = Math.round(79 + t * 50);
      const g = Math.round(70 + t * 60);
      const b = Math.round(229 + t * 20);

      const radius = (CELL_SIZE / 2) * (1 - t * 0.22);

      // Outer segment circle
      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(radius, 4), 0, Math.PI * 2);
      ctx.fill();

      // Top-left glossy clay reflection (pure fill, 0% blur cost)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
      ctx.beginPath();
      ctx.arc(cx - radius * 0.32, cy - radius * 0.32, radius * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw Snake Head
    const head = snake[0];
    const hx = head.x * CELL_SIZE + CELL_SIZE / 2;
    const hy = head.y * CELL_SIZE + CELL_SIZE / 2;
    const headRadius = CELL_SIZE * 0.5;

    // Head base
    ctx.fillStyle = '#4338CA';
    ctx.beginPath();
    ctx.arc(hx, hy, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Head highlight
    ctx.fillStyle = '#818CF8';
    ctx.beginPath();
    ctx.arc(hx - 2, hy - 2, headRadius * 0.55, 0, Math.PI * 2);
    ctx.fill();

    // Directional Eyes
    drawEyes(hx, hy, headRadius, direction);
  }

  // Draw Eyes Looking in Movement Direction
  function drawEyes(hx, hy, r, dir) {
    let eye1 = { x: 0, y: 0 };
    let eye2 = { x: 0, y: 0 };

    if (dir.x === 1) { // Right
      eye1 = { x: r * 0.28, y: -r * 0.34 };
      eye2 = { x: r * 0.28, y: r * 0.34 };
    } else if (dir.x === -1) { // Left
      eye1 = { x: -r * 0.28, y: -r * 0.34 };
      eye2 = { x: -r * 0.28, y: r * 0.34 };
    } else if (dir.y === -1) { // Up
      eye1 = { x: -r * 0.34, y: -r * 0.28 };
      eye2 = { x: r * 0.34, y: -r * 0.28 };
    } else { // Down
      eye1 = { x: -r * 0.34, y: r * 0.28 };
      eye2 = { x: r * 0.34, y: r * 0.28 };
    }

    [eye1, eye2].forEach(offset => {
      // White eye
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(hx + offset.x, hy + offset.y, r * 0.24, 0, Math.PI * 2);
      ctx.fill();

      // Pupil offset toward direction
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(hx + offset.x + dir.x * 1.5, hy + offset.y + dir.y * 1.5, r * 0.12, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Initialize Easter Egg
  function init() {
    coreOrb = document.getElementById('cs-core-orb') || document.querySelector('.cs-core-orb');
    csCard = document.querySelector('.cs-card');

    if (!coreOrb || !csCard) return;

    createGameDOM();

    // Trigger on central orb click
    coreOrb.addEventListener('click', openGame);
    coreOrb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGame();
      }
    });

    // Window Key Listener
    window.addEventListener('keydown', handleKeyDown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
