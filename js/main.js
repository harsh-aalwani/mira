/**
 * MIRA — Interactive Demos & Micro-interactions
 * Pure static Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScroll();
  initScrollReveals();
  initProblemConvergence();
  initCitationInspector();
  initCrossModalTabs();
  initConversationReplay();
  initNotifyForm();
});

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/**
 * Smooth Scrolling & Active Nav Highlighting
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 200;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Intersection Observer for Tactile Scroll Reveals
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * The Problem: Convergence of Scattered Files into MIRA
 */
function initProblemConvergence() {
  const toggleBtn = document.getElementById('convergenceToggleBtn');
  const sceneBox = document.getElementById('problemSceneBox');
  const statusText = document.getElementById('convergenceStatusText');

  if (!toggleBtn || !sceneBox) return;

  let isConverged = false;

  toggleBtn.addEventListener('click', () => {
    isConverged = !isConverged;
    if (isConverged) {
      sceneBox.classList.add('converged');
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9"></polyline>
          <polyline points="9 21 3 21 3 15"></polyline>
          <line x1="21" y1="3" x2="14" y2="10"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
        Separate Files Again
      `;
      if (statusText) statusText.textContent = "All files unified inside MIRA's local knowledge space";
    } else {
      sceneBox.classList.remove('converged');
      toggleBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 14 10 14 10 20"></polyline>
          <polyline points="20 10 14 10 14 4"></polyline>
          <line x1="14" y1="10" x2="21" y2="3"></line>
          <line x1="3" y1="21" x2="10" y2="14"></line>
        </svg>
        Unify with MIRA
      `;
      if (statusText) statusText.textContent = "Information scattered across different apps and folders";
    }
  });
}

/**
 * Ask Your Data: Interactive Citation Inspector
 */
const citationData = {
  meeting: {
    title: "All-Hands Recording (Audio / Transcript)",
    file: "All_Hands_10-14.m4a",
    timestamp: "14:20 – 15:45",
    type: "Audio & Transcript",
    badgeClass: "badge-audio",
    excerpt: "“...and regarding the milestone schedule, Phase 2 retrieval testing will complete by the end of November, with the desktop client build packaging scheduled for early December.”",
    context: "Speaker: Project Lead (Product Engineering Team). Extracted from automated timestamped transcription."
  },
  report: {
    title: "Project Progress Report (Page 12)",
    file: "Q4_Progress_Report.pdf",
    timestamp: "Page 12, Paragraph 3",
    type: "PDF Document",
    badgeClass: "badge-pdf",
    excerpt: "“Timeline Overview: Core multimodal retrieval pipelines are fully implemented. Final integration of the local-first indexing model remains on track for December delivery.”",
    context: "Document metadata: Created Oct 12, signed off by Engineering & Design committees."
  },
  notes: {
    title: "Sprint Planning Notes",
    file: "Sprint_Notes_Oct.md",
    timestamp: "Section 3: Key Milestones",
    type: "Markdown Note",
    badgeClass: "badge-doc",
    excerpt: "“Action Item: Confirm final usability polish and offline capability checklist before target December build freeze.”",
    context: "Personal workspace note created during weekly sprint standup."
  }
};

function initCitationInspector() {
  const chips = document.querySelectorAll('.interactive-citation-chip');
  const titleEl = document.getElementById('inspectSourceTitle');
  const fileEl = document.getElementById('inspectSourceFile');
  const timeEl = document.getElementById('inspectSourceTime');
  const excerptEl = document.getElementById('inspectSourceExcerpt');
  const contextEl = document.getElementById('inspectSourceContext');
  const badgeEl = document.getElementById('inspectSourceBadge');

  if (!chips.length || !titleEl) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const key = chip.getAttribute('data-source');
      const data = citationData[key];
      if (!data) return;

      chips.forEach(c => c.classList.remove('clay-chip-active'));
      chip.classList.add('clay-chip-active');

      // Update Inspector view with tactile fade
      const inspectorBox = document.getElementById('sourcePreviewCard');
      if (inspectorBox) {
        inspectorBox.style.opacity = '0.4';
        inspectorBox.style.transform = 'scale(0.98)';
      }

      setTimeout(() => {
        titleEl.textContent = data.title;
        fileEl.textContent = data.file;
        timeEl.textContent = data.timestamp;
        excerptEl.textContent = data.excerpt;
        contextEl.textContent = data.context;

        if (badgeEl) {
          badgeEl.textContent = data.type;
          badgeEl.className = `clay-badge ${data.badgeClass}`;
        }

        if (inspectorBox) {
          inspectorBox.style.opacity = '1';
          inspectorBox.style.transform = 'scale(1)';
        }
      }, 150);
    });
  });
}

/**
 * Cross-Modal Demonstration Tabs
 */
const crossModalScenarios = {
  funding: {
    query: "“Find the screenshots related to project funding.”",
    item1: {
      type: "Screenshot",
      title: "Grant_Budget_Chart.png",
      content: "Chart preview showing Q4 grant distribution: $120,000 allocated for local AI engine & multimodal UI development."
    },
    item2: {
      type: "Document",
      title: "Grant_Proposal_Final.pdf",
      content: "Section 4.1: Confirms award disbursement criteria and local privacy assurance guidelines."
    },
    item3: {
      type: "Transcript",
      title: "Meeting Recording (14:22)",
      content: "“...the grant funding was officially credited on Tuesday. We can proceed with the multimodal test suite.”"
    },
    synthesis: "MIRA synthesized the answer across 1 screenshot, 1 PDF grant document, and 1 recorded audio transcript without manual folder hunting."
  },
  meeting: {
    query: "“What feedback did we receive on the user interface?”",
    item1: {
      type: "Screenshot",
      title: "UI_Feedback_Markup.png",
      content: "Design review screenshot highlighting soft clay pill buttons and clean contrast for readability."
    },
    item2: {
      type: "Document",
      title: "Usability_Review.docx",
      content: "“Summary: Users preferred the tactile card elevation and instant citation inspectability.”"
    },
    item3: {
      type: "Transcript",
      title: "Design Sync Audio (06:15)",
      content: "“...everyone loved how the citations make it effortless to verify where each answer came from.”"
    },
    synthesis: "MIRA connected visual design markups, written document evaluations, and verbal team feedback into one coherent response."
  }
};

function initCrossModalTabs() {
  const tabs = document.querySelectorAll('.cross-modal-tab-btn');
  const queryEl = document.getElementById('crossModalQuery');
  const card1Type = document.getElementById('cmItem1Type');
  const card1Title = document.getElementById('cmItem1Title');
  const card1Content = document.getElementById('cmItem1Content');

  const card2Type = document.getElementById('cmItem2Type');
  const card2Title = document.getElementById('cmItem2Title');
  const card2Content = document.getElementById('cmItem2Content');

  const card3Type = document.getElementById('cmItem3Type');
  const card3Title = document.getElementById('cmItem3Title');
  const card3Content = document.getElementById('cmItem3Content');

  const synthesisEl = document.getElementById('cmSynthesisText');

  if (!tabs.length || !queryEl) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const scenarioKey = tab.getAttribute('data-scenario');
      const data = crossModalScenarios[scenarioKey];
      if (!data) return;

      tabs.forEach(t => t.classList.remove('clay-btn-primary'));
      tab.classList.add('clay-btn-primary');

      queryEl.textContent = data.query;

      card1Type.textContent = data.item1.type;
      card1Title.textContent = data.item1.title;
      card1Content.textContent = data.item1.content;

      card2Type.textContent = data.item2.type;
      card2Title.textContent = data.item2.title;
      card2Content.textContent = data.item2.content;

      card3Type.textContent = data.item3.type;
      card3Title.textContent = data.item3.title;
      card3Content.textContent = data.item3.content;

      synthesisEl.textContent = data.synthesis;
    });
  });
}

/**
 * Conversation Follow-up Replay Simulation
 */
function initConversationReplay() {
  const replayBtn = document.getElementById('replayConvoBtn');
  const turn1User = document.getElementById('convoTurn1User');
  const turn1Assistant = document.getElementById('convoTurn1Assistant');
  const turn2User = document.getElementById('convoTurn2User');
  const turn2Assistant = document.getElementById('convoTurn2Assistant');

  if (!replayBtn || !turn1User) return;

  replayBtn.addEventListener('click', () => {
    replayBtn.disabled = true;
    replayBtn.style.opacity = '0.6';

    // Hide all turns
    turn1User.style.opacity = '0';
    turn1Assistant.style.opacity = '0';
    turn2User.style.opacity = '0';
    turn2Assistant.style.opacity = '0';

    // Step 1: User 1
    setTimeout(() => {
      turn1User.style.opacity = '1';
      turn1User.classList.add('clay-pulse');
    }, 300);

    // Step 2: Assistant 1
    setTimeout(() => {
      turn1User.classList.remove('clay-pulse');
      turn1Assistant.style.opacity = '1';
    }, 1200);

    // Step 3: User 2 Follow-up
    setTimeout(() => {
      turn2User.style.opacity = '1';
      turn2User.classList.add('clay-pulse');
    }, 2400);

    // Step 4: Assistant 2 Contextual Answer
    setTimeout(() => {
      turn2User.classList.remove('clay-pulse');
      turn2Assistant.style.opacity = '1';
      replayBtn.disabled = false;
      replayBtn.style.opacity = '1';
    }, 3500);
  });
}

/**
 * Static Notify Form Handling (for Coming Soon / Download page)
 */
function initNotifyForm() {
  const notifyForm = document.getElementById('notifyForm');
  const toast = document.getElementById('notifyToast');

  if (notifyForm) {
    notifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = notifyForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim() !== '') {
        if (toast) {
          toast.style.display = 'block';
          toast.style.opacity = '1';
          setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { toast.style.display = 'none'; }, 400);
          }, 4500);
        }
        emailInput.value = '';
      }
    });
  }
}
