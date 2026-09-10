/**
 * MIRA — Interactive Application Simulation & UI Interactions
 * Provides authentic, responsive customer demonstrations for MIRA's desktop experience.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSimulation();
  initModalityTabs();
  initSemanticSearchDemo();
  initAudienceSwitcher();
  initCitationInspector();
  initSmoothNav();
  initMobileMenu();
  initFloatingDrift();
  initScrollReveal();
});

/* -------------------------------------------------------------------------- */
/* 1. Hero Product Simulation with Auto-Sliding Timer                         */
/* -------------------------------------------------------------------------- */
const heroScenarios = [
  {
    query: "What budget was approved during the last project meeting?",
    status: "Searching 1,420 files across 5 local modalities...",
    answer: "The approved project budget was <span class='font-semibold text-slate-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200'>₹24.5 lakh</span> for Phase 2 expansion, as agreed upon unanimously during the Q3 planning review.",
    citations: [
      {
        icon: "mic",
        type: "audio",
        title: "Strategy_Sync_Audio.m4a",
        meta: "Timestamp 12:44 • 98.6% match",
        snippet: "“...so let's lock in ₹24.5 lakh for Phase 2 infrastructure and proceed with procurement.”"
      },
      {
        icon: "file-text",
        type: "doc",
        title: "Q3_Executive_Summary.pdf",
        meta: "Page 4 • Paragraph 2",
        snippet: "“Approved Capital Allocation: ₹24,50,000 for infrastructure upgrade and hiring.”"
      }
    ]
  },
  {
    query: "Show me screenshots related to the funding discussion.",
    status: "Analyzing 312 screenshots & presentation slides...",
    answer: "Located <span class='font-semibold text-slate-900 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200'>2 visual artifacts</span> discussing seed cap tables and valuation metrics from May 14th.",
    citations: [
      {
        icon: "image",
        type: "image",
        title: "cap_table_runway_slide.png",
        meta: "OCR Text & Table Graph Detected",
        snippet: "Extracted visual table: 'Series Seed: ₹18.2 Cr Pre-Money Valuation'."
      },
      {
        icon: "file-text",
        type: "doc",
        title: "TermSheet_Draft_v3.pdf",
        meta: "Page 2 • Clause 4.1",
        snippet: "“Liquidation preference structured at 1x non-participating.”"
      }
    ]
  },
  {
    query: "Where did we discuss the deployment architecture?",
    status: "Scanning technical notes, call recordings & video frames...",
    answer: "Deployment architecture was finalized across <span class='font-semibold text-slate-900 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200'>the engineering sync video</span> and the local markdown RFC.",
    citations: [
      {
        icon: "video",
        type: "video",
        title: "Architecture_Review_Call.mp4",
        meta: "Frame 08:32 • Spoken Audio & Whiteboard",
        snippet: "“We run containerized worker nodes locally with zero outbound telemetry.”"
      },
      {
        icon: "file-code",
        type: "text",
        title: "deploy_spec_rfc09.md",
        meta: "Lines 42–58 • Local Markdown",
        snippet: "“Architecture: Zero-cloud dependency; local vector index persisted at ~/Library/MIRA/index.”"
      }
    ]
  }
];

let currentHeroIndex = 0;
let typingTimeout = null;
let heroAutoSlideInterval = null;

function initHeroSimulation() {
  const queryInput = document.getElementById('hero-sim-query');
  const statusEl = document.getElementById('hero-sim-status');
  const answerEl = document.getElementById('hero-sim-answer');
  const citationsContainer = document.getElementById('hero-sim-citations');
  const chips = document.querySelectorAll('.hero-query-chip');

  if (!queryInput || !statusEl || !answerEl) return;

  function runScenario(index, isManual = false) {
    currentHeroIndex = index;
    const scenario = heroScenarios[index];

    // Update chips active state with animated indicator
    chips.forEach((chip, i) => {
      // Remove any existing progress bar
      const oldBar = chip.querySelector('.slide-progress-bar');
      if (oldBar) oldBar.remove();

      if (i === index) {
        chip.classList.add('bg-indigo-600', 'text-white', 'shadow-sm', 'relative', 'overflow-hidden');
        chip.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');

        // Add visual sliding progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'slide-progress-bar';
        chip.appendChild(progressBar);
        // Animate width
        requestAnimationFrame(() => {
          progressBar.style.transition = 'width 7000ms linear';
          progressBar.style.width = '100%';
        });
      } else {
        chip.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm', 'relative', 'overflow-hidden');
        chip.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      }
    });

    // Reset view with smooth fade
    clearTimeout(typingTimeout);
    queryInput.textContent = "";
    queryInput.classList.add('typing-cursor');
    statusEl.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-ping mr-2"></span>Preparing query...`;
    answerEl.innerHTML = `<div class="h-4 bg-slate-200 rounded animate-pulse w-3/4 mb-2"></div><div class="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>`;
    citationsContainer.innerHTML = "";

    // Typewriter effect for query
    let charIdx = 0;
    const fullText = scenario.query;

    function typeChar() {
      if (charIdx < fullText.length) {
        queryInput.textContent += fullText.charAt(charIdx);
        charIdx++;
        typingTimeout = setTimeout(typeChar, 24);
      } else {
        queryInput.classList.remove('typing-cursor');
        // Transition to search status
        setTimeout(() => {
          statusEl.innerHTML = `<span class="inline-flex items-center text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full font-medium border border-indigo-100">
            <svg class="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-indigo-600" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
            ${scenario.status}
          </span>`;

          // Reveal answer with smooth slide
          setTimeout(() => {
            statusEl.innerHTML = `<span class="inline-flex items-center text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-100">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
              Grounded in local data • 0.24s
            </span>`;
            answerEl.innerHTML = `<div class="animate-fade-slide">${scenario.answer}</div>`;

            // Render citations
            citationsContainer.innerHTML = scenario.citations.map((c, idx) => `
              <div class="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all cursor-pointer group animate-fade-slide" style="animation-delay: ${idx * 80}ms">
                <div class="flex items-center justify-between mb-1.5">
                  <div class="flex items-center space-x-2">
                    <span class="p-1 rounded bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      ${getCitationIcon(c.type)}
                    </span>
                    <span class="text-xs font-semibold text-slate-800 font-mono truncate max-w-[160px] sm:max-w-xs">${c.title}</span>
                  </div>
                  <span class="text-[11px] text-slate-600 font-mono">${c.meta}</span>
                </div>
                <p class="text-xs text-slate-600 italic bg-slate-50/80 p-2 rounded border border-slate-100">${c.snippet}</p>
              </div>
            `).join('');
          }, 350);
        }, 220);
      }
    }

    typeChar();

    // Reset auto-slide timer
    resetHeroTimer();
  }

  function resetHeroTimer() {
    if (heroAutoSlideInterval) clearInterval(heroAutoSlideInterval);
    heroAutoSlideInterval = setInterval(() => {
      const nextIndex = (currentHeroIndex + 1) % heroScenarios.length;
      runScenario(nextIndex, false);
    }, 7200);
  }

  // Click handler on chips
  chips.forEach((chip, idx) => {
    chip.addEventListener('click', () => {
      runScenario(idx, true);
    });
  });

  // Start with scenario 0
  runScenario(0);
}

function getCitationIcon(type) {
  switch (type) {
    case 'audio':
      return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>`;
    case 'image':
      return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
    case 'video':
      return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>`;
    default:
      return `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`;
  }
}

/* -------------------------------------------------------------------------- */
/* 2. Multimodal Modality Explorer Tabs                                       */
/* -------------------------------------------------------------------------- */
const modalityData = {
  docs: {
    title: "Document Intelligence",
    tagline: "Reports, PDFs, Word documents, spreadsheets & notes",
    description: "Ask specific questions across thousands of pages. MIRA parses complex layouts, multi-column tables, headers, and footnotes without losing semantic context.",
    actionQuery: "“Summarize the key indemnification clauses across our 2024 vendor agreements.”",
    badge: "Full text & structural indexing",
    previewType: "docs",
    previewContent: `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div class="flex items-center space-x-2">
            <span class="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span class="font-mono text-xs font-semibold text-slate-700">Vendor_Master_Agreement_v4.pdf</span>
          </div>
          <span class="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Page 18 of 64</span>
        </div>
        <div class="space-y-2 text-xs text-slate-600 leading-relaxed font-sans">
          <p class="text-slate-400">Section 14.1 — Limitation of Liability</p>
          <p class="bg-amber-100/70 border-l-2 border-amber-500 pl-2.5 py-1 text-slate-900 font-medium">
            “Each party's aggregate cumulative liability shall not exceed the total fees paid under this Agreement in the preceding twelve (12) calendar months.”
          </p>
          <p class="text-slate-400">Section 14.2 — Mutual Indemnification for IP Infringement...</p>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span class="inline-flex items-center text-emerald-600 font-medium"><svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Verified against source</span>
          <span class="font-mono text-[11px]">Indexed 0.08s</span>
        </div>
      </div>
    `
  },
  images: {
    title: "Visual & Screenshot Extraction",
    tagline: "Screenshots, whiteboard sketches, graphs & diagrams",
    description: "Screenshots contain some of your most valuable knowledge. MIRA detects text, figures, charts, and spatial relationships so you can ask about images without manually tagging them.",
    actionQuery: "“Show me the chart from our team sync showing quarterly churn rate.”",
    badge: "Spatial OCR & diagram understanding",
    previewType: "images",
    previewContent: `
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div class="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 aspect-video flex flex-col justify-between p-4">
          <!-- Simulated screenshot canvas -->
          <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 opacity-90"></div>
          <div class="relative z-10 flex justify-between items-center text-xs text-slate-300">
            <span class="font-mono">CleanShot_2024-08-11_ProductMetrics.png</span>
            <span class="bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30 text-[10px]">Detected Table & Line Graph</span>
          </div>
          <!-- Bounding box highlight -->
          <div class="relative z-10 border-2 border-emerald-400 bg-emerald-400/10 rounded-lg p-3 my-2 backdrop-blur-xs">
            <div class="flex items-center justify-between text-[11px] text-emerald-300 font-mono mb-1">
              <span>BOUNDING BOX #1</span>
              <span>CONFIDENCE 99.1%</span>
            </div>
            <p class="text-white text-xs font-semibold">“Net Revenue Churn Rate: 1.4% (Down from 2.1% in Q1)”</p>
          </div>
          <div class="relative z-10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Resolution: 2560x1440</span>
            <span>Retrieved via visual query</span>
          </div>
        </div>
      </div>
    `
  },
  audio: {
    title: "Conversations & Meeting Audio",
    tagline: "Recorded discussions, voice memos & client briefings",
    description: "Never lose a spoken commitment. MIRA automatically transcribes and indexes your local audio files with precise speaker timestamps, making conversations instantly searchable.",
    actionQuery: "“When did Rahul mention the deadline for client signoff?”",
    badge: "Local transcription with timestamps",
    previewType: "audio",
    previewContent: `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-3">
            <button class="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm hover:bg-indigo-700 transition">
              <svg class="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <div>
              <p class="text-xs font-bold text-slate-900 font-mono">Partner_Sync_Recording.m4a</p>
              <p class="text-[11px] text-slate-600">Duration: 42m 18s • Speaker: Rahul V.</p>
            </div>
          </div>
          <!-- Animated sound waves -->
          <div class="flex items-end space-x-1 h-6 px-2 py-1 bg-indigo-50 rounded-lg border border-indigo-100">
            <span class="w-1 bg-indigo-600 rounded-full wave-bar" style="height: 10px;"></span>
            <span class="w-1 bg-indigo-600 rounded-full wave-bar" style="height: 18px;"></span>
            <span class="w-1 bg-indigo-600 rounded-full wave-bar" style="height: 24px;"></span>
            <span class="w-1 bg-indigo-600 rounded-full wave-bar" style="height: 14px;"></span>
            <span class="w-1 bg-indigo-600 rounded-full wave-bar" style="height: 20px;"></span>
            <span class="w-1 bg-indigo-600 rounded-full wave-bar" style="height: 8px;"></span>
          </div>
        </div>
        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5">
          <div class="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>TIMESTAMP 23:45</span>
            <span class="text-indigo-600 font-semibold">MATCH FOUND</span>
          </div>
          <p class="font-medium text-slate-900 bg-white p-2 rounded border border-slate-200">
            “Rahul: The absolute cutoff for client signoff is next Friday at 5 PM before the release branch cuts.”
          </p>
        </div>
      </div>
    `
  },
  video: {
    title: "Video Footage & Keyframe Sync",
    tagline: "All-hands meetings, screen recordings, tutorials & presentations",
    description: "Don't sit through hours of recordings to find one sentence or visual slide. MIRA synchronizes spoken dialogue with on-screen visual keyframes for instant retrieval.",
    actionQuery: "“Show me the exact moment during the all-hands when the new product UI was demonstrated.”",
    badge: "Keyframe extraction & multimodal sync",
    previewType: "video",
    previewContent: `
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div class="rounded-xl overflow-hidden bg-slate-950 aspect-video relative flex flex-col justify-between p-4 text-white">
          <div class="flex items-center justify-between text-xs text-slate-300">
            <span class="font-mono">Company_Townhall_July.mp4</span>
            <span class="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/30">Jump to 34:12</span>
          </div>
          <div class="flex items-center justify-center">
            <div class="p-3 bg-white/20 backdrop-blur-md rounded-full border border-white/30 cursor-pointer hover:scale-110 transition">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
          <div class="bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10 text-xs">
            <div class="flex justify-between items-center text-[10px] text-slate-400 mb-1">
              <span>On-Screen Slide: "MIRA Native Desktop UI"</span>
              <span class="text-emerald-400 font-mono">Score 99.8%</span>
            </div>
            <p class="text-slate-200 text-[11px] truncate">Presenter: "Here is the unified omni-search interface running on local metal..."</p>
          </div>
        </div>
      </div>
    `
  },
  text: {
    title: "Notes & Plain Text Knowledge",
    tagline: "Markdown notes, personal logs, pasted snippets & transcripts",
    description: "Unstructured thoughts and scratch notes carry immense context. MIRA links them naturally with your heavy files without requiring tags, folders, or rigid organization.",
    actionQuery: "“What did I note down about the pricing feedback from our beta testers?”",
    badge: "Semantic context linking",
    previewType: "text",
    previewContent: `
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <span class="font-mono text-xs font-semibold text-slate-700">~/Notes/UserFeedback_Draft.md</span>
          <span class="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">Updated Yesterday</span>
        </div>
        <div class="space-y-2 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p class="text-slate-400"># Beta Cohort Notes</p>
          <p>- 18 out of 20 users requested offline desktop-only operation.</p>
          <p class="bg-indigo-50 text-indigo-900 p-1.5 rounded border border-indigo-200 font-semibold">
            - "Pricing feedback: Prefer one-time license or straightforward team seat rather than metered API tokens."
          </p>
          <p>- Need faster shortcut for global spotlight invoke.</p>
        </div>
        <div class="mt-3 text-right">
          <span class="text-[11px] text-indigo-600 font-medium">Cross-referenced with 4 audio interviews →</span>
        </div>
      </div>
    `
  }
};

function initModalityTabs() {
  const tabs = document.querySelectorAll('.modality-tab-btn');
  const container = document.getElementById('modality-detail-container');

  if (!tabs.length || !container) return;

  const modalityKeys = ['docs', 'images', 'audio', 'video', 'text'];
  let currentModalityIdx = 0;
  let modalityAutoInterval = null;
  let isHovered = false;

  function renderModality(key, isManual = false) {
    const data = modalityData[key];
    if (!data) return;

    currentModalityIdx = modalityKeys.indexOf(key);

    tabs.forEach(btn => {
      // Remove any existing progress bar
      const oldBar = btn.querySelector('.slide-progress-bar');
      if (oldBar) oldBar.remove();

      const active = btn.dataset.modality === key;
      if (active) {
        btn.classList.add('border-indigo-600', 'bg-indigo-50/70', 'text-indigo-700', 'shadow-xs', 'relative', 'overflow-hidden');
        btn.classList.remove('border-transparent', 'text-slate-600', 'hover:bg-slate-100');

        // Progress bar for active tab
        const progressBar = document.createElement('div');
        progressBar.className = 'slide-progress-bar';
        btn.appendChild(progressBar);
        requestAnimationFrame(() => {
          progressBar.style.transition = 'width 5500ms linear';
          progressBar.style.width = '100%';
        });
      } else {
        btn.classList.remove('border-indigo-600', 'bg-indigo-50/70', 'text-indigo-700', 'shadow-xs', 'relative', 'overflow-hidden');
        btn.classList.add('border-transparent', 'text-slate-600', 'hover:bg-slate-100');
      }
    });

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fade-slide">
        <div class="lg:col-span-5 space-y-4">
          <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-medium">
            <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
            <span>${data.badge}</span>
          </div>
          <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">${data.title}</h3>
          <p class="text-sm font-medium text-slate-600">${data.tagline}</p>
          <p class="text-sm text-slate-600 leading-relaxed">${data.description}</p>
          <div class="pt-2">
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span class="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-semibold block mb-1">Example Natural Query</span>
              <p class="text-xs font-semibold text-slate-800 italic">${data.actionQuery}</p>
            </div>
          </div>
        </div>
        <div class="lg:col-span-7">
          ${data.previewContent}
        </div>
      </div>
    `;

    resetModalityTimer();
  }

  function resetModalityTimer() {
    if (modalityAutoInterval) clearInterval(modalityAutoInterval);
    modalityAutoInterval = setInterval(() => {
      if (!isHovered) {
        currentModalityIdx = (currentModalityIdx + 1) % modalityKeys.length;
        renderModality(modalityKeys[currentModalityIdx], false);
      }
    }, 5600);
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      renderModality(btn.dataset.modality, true);
    });
  });

  // Pause auto-sliding on hover
  container.addEventListener('mouseenter', () => { isHovered = true; });
  container.addEventListener('mouseleave', () => { isHovered = false; });

  // Default to docs
  renderModality('docs');
}

/* -------------------------------------------------------------------------- */
/* 3. Semantic Search Interactive Sandbox                                      */
/* -------------------------------------------------------------------------- */
const searchScenarios = {
  "q1": {
    prompt: "Find the report about our 2024 international project.",
    highlight: "Matching conceptual meaning: 'Global Expansion', 'Cross-Border Operations', 'Europe & APAC'",
    results: [
      {
        title: "CrossBorder_Expansion_Strategy_2024.pdf",
        type: "PDF Document",
        score: "99.2% relevance",
        snippet: "“...the 2024 international roadmap across EMEA and APAC represents an initial CAPEX investment of ₹4.2 Cr.”",
        path: "~/Documents/Work/Expansion/StrategicPlan.pdf",
        icon: "file-text"
      },
      {
        title: "Europe_Consultant_Debrief.m4a",
        type: "Audio Recording",
        score: "94.7% relevance",
        snippet: "“Discussion at 04:15: Compliance requirements for GDPR and overseas cloud storage restrictions.”",
        path: "~/Recordings/2024_Global_Sync.m4a",
        icon: "mic"
      }
    ]
  },
  "q2": {
    prompt: "Show me screenshots related to the funding discussion.",
    highlight: "Matching visual semantics: cap tables, valuation spreadsheets, investor deck slides",
    results: [
      {
        title: "Screenshot_CapTable_SeriesSeed.png",
        type: "Visual OCR & Diagram",
        score: "98.9% relevance",
        snippet: "Visual bounding box detected: Founder ownership 68%, ESOP pool 12%, Seed investors 20%.",
        path: "~/Screenshots/Screen_Shot_2024-05-19.png",
        icon: "image"
      },
      {
        title: "Investor_Questions_AllHands.mp4",
        type: "Video Keyframe",
        score: "92.4% relevance",
        snippet: "Frame 19:40: On-screen slide detailing projected runway and round structure.",
        path: "~/Videos/Investor_Briefing.mp4",
        icon: "video"
      }
    ]
  },
  "q3": {
    prompt: "What decisions were made during the last meeting?",
    highlight: "Extracting action items, consensus agreements, and deadlines across voice and notes",
    results: [
      {
        title: "Leadership_Weekly_Sync.m4a",
        type: "Audio Transcription",
        score: "98.1% relevance",
        snippet: "“Consensus reached: 1) Push release date by 4 days for QA, 2) Hire two frontend contractors immediately.”",
        path: "~/VoiceMemos/Leadership_Oct14.m4a",
        icon: "mic"
      },
      {
        title: "Meeting_Action_Items.md",
        type: "Markdown Note",
        score: "96.5% relevance",
        snippet: "“Owner: Priya to finalize cloud transition checklist by Thursday afternoon.”",
        path: "~/Notes/Sprint_Standups/Oct14.md",
        icon: "file-code"
      }
    ]
  },
  "q4": {
    prompt: "Where did we discuss the deployment architecture?",
    highlight: "Correlating infrastructure diagrams, code reviews, and architectural RFC discussions",
    results: [
      {
        title: "System_Architecture_Proposal.pdf",
        type: "PDF Document",
        score: "99.4% relevance",
        snippet: "“Section 3.2: Local embedding model running via ONNX Runtime directly on NVIDIA CUDA & Windows DirectML.”",
        path: "~/Projects/Architecture/SystemRFC_01.pdf",
        icon: "file-text"
      },
      {
        title: "Whiteboard_Session_Photo.jpg",
        type: "Image Diagram",
        score: "93.8% relevance",
        snippet: "Diagram extraction: Local SQLite vector table bounded by OS sandbox boundary.",
        path: "~/Photos/Whiteboard_Nov2.jpg",
        icon: "image"
      }
    ]
  }
};

function initSemanticSearchDemo() {
  const buttons = document.querySelectorAll('.semantic-query-btn');
  const queryDisplay = document.getElementById('semantic-active-query');
  const highlightDisplay = document.getElementById('semantic-highlight-tag');
  const resultsContainer = document.getElementById('semantic-results-container');

  if (!buttons.length || !queryDisplay || !resultsContainer) return;

  function triggerQuery(key) {
    const scenario = searchScenarios[key];
    if (!scenario) return;

    buttons.forEach(btn => {
      if (btn.dataset.scenario === key) {
        btn.classList.add('border-indigo-600', 'bg-indigo-50/60', 'text-indigo-900', 'font-semibold', 'shadow-xs');
        btn.classList.remove('border-slate-200', 'bg-white', 'text-slate-700');
      } else {
        btn.classList.remove('border-indigo-600', 'bg-indigo-50/60', 'text-indigo-900', 'font-semibold', 'shadow-xs');
        btn.classList.add('border-slate-200', 'bg-white', 'text-slate-700');
      }
    });

    queryDisplay.textContent = `“${scenario.prompt}”`;
    highlightDisplay.innerHTML = `<span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-1.5"></span>${scenario.highlight}`;

    // Animate results appearing
    resultsContainer.innerHTML = scenario.results.map((res, i) => `
      <div class="p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-all shadow-xs hover-lift animate-fade-in" style="animation-delay: ${i * 120}ms">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center space-x-2.5">
            <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              ${getCitationIcon(res.icon)}
            </div>
            <div>
              <h4 class="text-xs font-bold text-slate-900 font-mono">${res.title}</h4>
              <span class="text-[11px] text-slate-600 font-mono">${res.path}</span>
            </div>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
            ${res.score}
          </span>
        </div>
        <p class="text-xs text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100 italic">
          ${res.snippet}
        </p>
      </div>
    `).join('');
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => triggerQuery(btn.dataset.scenario));
  });

  // Initial trigger
  triggerQuery("q1");
}

/* -------------------------------------------------------------------------- */
/* 4. Customer Audiences & Persona Switcher                                   */
/* -------------------------------------------------------------------------- */
const personaData = {
  companies: {
    badge: "For Teams & Enterprises",
    title: "Make fragmented company knowledge instantly accessible.",
    description: "Break information silos without uploading confidential IP to third-party public clouds. Onboard team members, query historical decisions, and cross-reference product docs, call recordings, and client contracts in seconds.",
    exampleQuery: "“What did the team decide about the product launch timeline?”",
    exampleAnswer: "“During the September 18 All-Hands, the launch was shifted to November 14 to allow for an additional week of security audit compliance.”",
    sources: ["Product_Roadmap_Q4.pdf", "Executive_Sync_Sept18.m4a"],
    benefits: [
      "No confidential company documents sent to external third parties",
      "Unified search across legacy PDFs, modern Slack exports & meeting audio",
      "Instant onboarding: new hires can ask questions about past decisions"
    ]
  },
  researchers: {
    badge: "For Researchers & Academics",
    title: "Spend less time organizing files and more time thinking.",
    description: "Literature reviews, conference recordings, lab notes, and data charts become an interconnected research repository. Query across hundreds of papers by concept without having to memorize folder structures or file naming conventions.",
    exampleQuery: "“Which documents discuss this specific evaluation methodology?”",
    exampleAnswer: "“Three studies analyze this: Section 4.2 in the 2023 Meta-Analysis and the audio debrief with Dr. Chen from the Oxford Symposium.”",
    sources: ["Clinical_Trial_Synthesis.pdf", "Dr_Chen_Interview.m4a"],
    benefits: [
      "Synthesizes insights across written publications and verbal lab recordings",
      "Verifiable citation tracing directly to page numbers and mathematical figures",
      "Completely offline operation for sensitive and proprietary research findings"
    ]
  },
  individuals: {
    badge: "For Privacy-Conscious Individuals",
    title: "Your personal knowledge vault, completely under your control.",
    description: "Tax forms, health records, travel tickets, home renovation screenshots, and personal audio notes. MIRA gives you an effortless second brain that runs on your laptop, works without Wi-Fi, and keeps your private life private.",
    exampleQuery: "“Where did I save the document about my project warranties?”",
    exampleAnswer: "“Found in your scanned receipt folder: The solar panel warranty expires October 2029 under contract #SO-8821.”",
    sources: ["Warranty_Certificate_Scan.png", "Home_Renovation_Notes.md"],
    benefits: [
      "Completely private: personal records and receipts never touch a remote server",
      "Works completely offline during travel or flights without needing an internet connection",
      "Never lose a receipt, screenshot or spoken voice note again"
    ]
  }
};

function initAudienceSwitcher() {
  const buttons = document.querySelectorAll('.audience-tab-btn');
  const container = document.getElementById('audience-detail-card');

  if (!buttons.length || !container) return;

  function renderPersona(key) {
    const p = personaData[key];
    if (!p) return;

    buttons.forEach(btn => {
      const active = btn.dataset.persona === key;
      if (active) {
        btn.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
        btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btn.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      }
    });

    container.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 bg-white/90 rounded-3xl border border-slate-200 shadow-card">
        <div class="lg:col-span-6 space-y-4">
          <span class="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">${p.badge}</span>
          <h3 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">${p.title}</h3>
          <p class="text-sm text-slate-600 leading-relaxed">${p.description}</p>
          <ul class="space-y-2.5 pt-2">
            ${p.benefits.map(b => `
              <li class="flex items-start text-xs text-slate-700 font-medium">
                <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mr-2.5 mt-0.5 shrink-0 text-[10px]">✓</span>
                <span>${b}</span>
              </li>
            `).join('')}
          </ul>
        </div>
        <div class="lg:col-span-6">
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
            <div class="text-xs font-mono text-slate-600 font-semibold uppercase tracking-wider">Example Interaction</div>
            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span class="text-[10px] font-mono font-bold text-indigo-600 uppercase">Question</span>
              <p class="text-xs font-bold text-slate-900 mt-0.5">${p.exampleQuery}</p>
            </div>
            <div class="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
              <span class="text-[10px] font-mono font-bold text-emerald-600 uppercase">Grounded Response</span>
              <p class="text-xs text-slate-800 mt-0.5">${p.exampleAnswer}</p>
              <div class="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-2">
                ${p.sources.map(s => `
                  <span class="inline-flex items-center text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    <span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"></span>
                    ${s}
                  </span>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => renderPersona(btn.dataset.persona));
  });

  renderPersona('companies');
}

/* -------------------------------------------------------------------------- */
/* 5. Citations & Trust Interactive Inspector                                 */
/* -------------------------------------------------------------------------- */
function initCitationInspector() {
  const pills = document.querySelectorAll('.citation-pill-demo');
  const detailsBox = document.getElementById('citation-detail-inspect');

  if (!pills.length || !detailsBox) return;

  const citationDetails = {
    "c1": {
      title: "Audio Transcript • Meeting_Recording_July10.m4a",
      timestamp: "12:44 – 13:10",
      confidence: "99.4% verbatim match",
      quote: "“So Rahul and Sarah agreed on the ₹24.5 lakh cap for phase 2. The procurement paperwork will be drafted on Monday.”",
      context: "Recorded in Conference Room B via local conference microphone. Transcribed locally using high-accuracy neural model."
    },
    "c2": {
      title: "Document Excerpt • Q3_Project_Charter_Signed.pdf",
      timestamp: "Page 4, Clause 2.1",
      confidence: "98.9% semantic alignment",
      quote: "“Total Authorized Expenditure: The steering committee hereby authorises ₹2,450,000 INR for Q3 execution milestones.”",
      context: "Digital signature verified. OCR processed table geometry and currency formatting."
    }
  };

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('ring-2', 'ring-indigo-600', 'bg-indigo-100'));
      pill.classList.add('ring-2', 'ring-indigo-600', 'bg-indigo-100');

      const id = pill.dataset.citation;
      const data = citationDetails[id];
      if (!data) return;

      detailsBox.innerHTML = `
        <div class="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm animate-fade-in">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold font-mono text-indigo-700">${data.title}</span>
            <span class="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-semibold">${data.confidence}</span>
          </div>
          <p class="text-xs font-mono text-slate-600 mb-2">Position: ${data.timestamp}</p>
          <div class="p-3 bg-amber-50/70 border-l-3 border-amber-500 rounded text-xs text-slate-800 font-serif italic mb-2">
            ${data.quote}
          </div>
          <p class="text-[11px] text-slate-500">${data.context}</p>
        </div>
      `;
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 6. Smooth Navigation & Header Glass Effect                                 */
/* -------------------------------------------------------------------------- */
function initSmoothNav() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('bg-white/85', 'backdrop-blur-md', 'shadow-xs', 'border-b', 'border-slate-200/80');
      header.classList.remove('bg-transparent');
    } else {
      header.classList.remove('bg-white/85', 'backdrop-blur-md', 'shadow-xs', 'border-b', 'border-slate-200/80');
      header.classList.add('bg-transparent');
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 7. Mobile Menu Toggle                                                      */
/* -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu-panel');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* -------------------------------------------------------------------------- */
/* 8. Floating Elements Subtle Parallax Drift on Mouse Move                   */
/* -------------------------------------------------------------------------- */
function initFloatingDrift() {
  const floaters = document.querySelectorAll('.interactive-float');
  if (!floaters.length || window.innerWidth < 768) return;

  let ticking = false;

  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

        floaters.forEach((el, index) => {
          const factor = (index % 3 + 1) * 0.4;
          el.style.transform = `translate3d(${mouseX * factor}px, ${mouseY * factor}px, 0)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });
}

/* -------------------------------------------------------------------------- */
/* 9. Smooth Scroll-Triggered Reveal Animations                               */
/* -------------------------------------------------------------------------- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach((el, i) => {
    // Add subtle stagger delay if within a group
    if (el.dataset.stagger) {
      el.style.transitionDelay = `${parseInt(el.dataset.stagger) * 90}ms`;
    }
    observer.observe(el);
  });
}

