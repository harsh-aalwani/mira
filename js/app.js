/**
 * MIRA Interactive Marketing Website Engine
 * Tactile simulations, multimodal pipelines, live desktop mockup, and smooth page transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroTransformation();
  initScatterToggle();
  initPipelineVisualizer();
  initCrossModalMatrix();
  initDesktopSimulator();
  initCitationInspector();
  initCard3DTilt();
  initPageTransitions();
});

/* ===================================================
   STICKY NAVBAR & MOBILE MENU
   =================================================== */
function initNavbar() {
  const dock = document.querySelector('.navbar-dock');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      dock?.classList.add('scrolled');
    } else {
      dock?.classList.remove('scrolled');
    }
  });

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile drawer when clicking a link
    mobileDrawer.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
      });
    });
  }
}

/* ===================================================
   HERO LIVE TRANSFORMATION CYCLE
   Query -> Relevant Context -> Grounded Answer -> Citations
   =================================================== */
function initHeroTransformation() {
  const stepIndicator = document.getElementById('heroFlowStep');
  const stepContent = document.getElementById('heroFlowContent');
  const progressFill = document.getElementById('heroFlowProgress');

  if (!stepIndicator || !stepContent || !progressFill) return;

  const steps = [
    {
      step: '1. User Query Ingestion',
      content: '“Show me the report discussing international development in 2024.”',
      progress: '25%'
    },
    {
      step: '2. Multimodal Context Retrieved',
      content: 'Discovered Global_Initiatives_2024.pdf (Pages 42–45) & Memo_Aug24.docx',
      progress: '50%'
    },
    {
      step: '3. Grounded Synthesis',
      content: '“In 2024, international initiatives allocated $45M toward resilient regional infrastructure [1].”',
      progress: '75%'
    },
    {
      step: '4. Source Citations Verified',
      content: 'Verified grounded sources: Global_Initiatives_2024.pdf:42 (98% match)',
      progress: '100%'
    }
  ];

  let currentIdx = 0;
  setInterval(() => {
    currentIdx = (currentIdx + 1) % steps.length;
    const item = steps[currentIdx];
    stepIndicator.style.opacity = '0';
    stepContent.style.opacity = '0';

    setTimeout(() => {
      stepIndicator.textContent = item.step;
      stepContent.textContent = item.content;
      progressFill.style.width = item.progress;
      stepIndicator.style.opacity = '1';
      stepContent.style.opacity = '1';
    }, 200);
  }, 3600);
}

/* ===================================================
   SCATTERED TO CONNECTED VISUALIZER
   =================================================== */
function initScatterToggle() {
  const arena = document.getElementById('scatterArena');
  const btn = document.getElementById('toggleScatterBtn');
  if (!arena || !btn) return;

  let isConnected = false;

  btn.addEventListener('click', () => {
    isConnected = !isConnected;
    if (isConnected) {
      arena.classList.remove('state-scattered');
      arena.classList.add('state-connected');
      btn.textContent = 'View Scattered State';
    } else {
      arena.classList.remove('state-connected');
      arena.classList.add('state-scattered');
      btn.textContent = 'Unify into Knowledge Space';
    }
  });
}

/* ===================================================
   HOW MIRA UNDERSTANDS (4 PIPELINES)
   =================================================== */
const pipelineData = {
  documents: {
    name: 'Documents Pipeline',
    description: 'Extracts formatted text and layout from PDF and DOCX files, splits them into semantic paragraphs, and computes vector embeddings for accurate contextual retrieval.',
    steps: [
      { title: 'Source Input', tech: 'PDF / DOCX', icon: 'file' },
      { title: 'Text Extraction', tech: 'Layout Parser', icon: 'extract' },
      { title: 'Semantic Chunking', tech: 'Context Chunks', icon: 'split' },
      { title: 'Embedding Gen', tech: 'Vector Embeddings', icon: 'embed' },
      { title: 'Knowledge Index', tech: 'FAISS / ChromaDB', icon: 'index' }
    ]
  },
  images: {
    name: 'Images & Visuals Pipeline',
    description: 'Processes screenshots, scanned documents, charts, and photos using Optical Character Recognition (OCR), BLIP captioning, and OpenCLIP joint image-text embeddings.',
    steps: [
      { title: 'Visual Input', tech: 'Image / Screenshot', icon: 'file' },
      { title: 'Text Recognition', tech: 'OCR Engine', icon: 'extract' },
      { title: 'Captioning', tech: 'BLIP Model', icon: 'split' },
      { title: 'Joint Embedding', tech: 'OpenCLIP ViT', icon: 'embed' },
      { title: 'Knowledge Index', tech: 'FAISS / ChromaDB', icon: 'index' }
    ]
  },
  audio: {
    name: 'Audio Recordings Pipeline',
    description: 'Transcribes recorded meetings, voice memos, interviews, and discussions using FasterWhisper, aligns speech timestamps, and indexes searchable transcript segments.',
    steps: [
      { title: 'Audio Stream', tech: 'MP3 / WAV / M4A', icon: 'file' },
      { title: 'Transcription', tech: 'FasterWhisper', icon: 'extract' },
      { title: 'Timestamp Alignment', tech: 'Segment Chunks', icon: 'split' },
      { title: 'Embedding Gen', tech: 'Semantic Vectors', icon: 'embed' },
      { title: 'Knowledge Index', tech: 'FAISS / ChromaDB', icon: 'index' }
    ]
  },
  video: {
    name: 'Video Presentations Pipeline',
    description: 'Extracts keyframes at semantic intervals, processes visual slides via OpenCLIP, and transcribes spoken dialogue via FasterWhisper for unified cross-modal video search.',
    steps: [
      { title: 'Video Stream', tech: 'MP4 / MOV / MKV', icon: 'file' },
      { title: 'Keyframe Extraction', tech: 'Frame Decoders', icon: 'extract' },
      { title: 'Speech to Text', tech: 'FasterWhisper', icon: 'split' },
      { title: 'Multimodal Fusion', tech: 'Joint Embeddings', icon: 'embed' },
      { title: 'Knowledge Index', tech: 'FAISS / ChromaDB', icon: 'index' }
    ]
  }
};

function initPipelineVisualizer() {
  const tabBtns = document.querySelectorAll('.pipeline-tab');
  const track = document.getElementById('pipelineStageTrack');
  const titleEl = document.getElementById('pipelinePanelTitle');
  const descEl = document.getElementById('pipelinePanelDesc');

  if (!tabBtns.length || !track || !titleEl || !descEl) return;

  function renderPipeline(key) {
    const data = pipelineData[key];
    if (!data) return;

    titleEl.textContent = data.name;
    descEl.textContent = data.description;

    track.innerHTML = data.steps.map((step, idx) => `
      <div class="pipeline-step-node">
        <div class="step-circle ${idx === 3 || idx === 4 ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${getStepIconSvg(step.icon)}
          </svg>
        </div>
        <div class="step-node-title">${step.title}</div>
        <div class="step-node-tech">${step.tech}</div>
      </div>
    `).join('');
  }

  function getStepIconSvg(type) {
    switch (type) {
      case 'file': return '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>';
      case 'extract': return '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>';
      case 'split': return '<polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line>';
      case 'embed': return '<circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>';
      case 'index': return '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line>';
      default: return '<circle cx="12" cy="12" r="4"></circle>';
    }
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-pipeline');
      renderPipeline(target);
    });
  });

  renderPipeline('documents');
}

/* ===================================================
   CROSS-MODAL RETRIEVAL MATRIX
   =================================================== */
const crossModalScenarios = {
  'text-image': {
    queryTag: 'Text Query → Image Retrieval',
    queryText: '“Find screenshots related to the project funding discussion”',
    resultType: 'Screenshot (PNG)',
    resultName: 'Slack_Strategy_Funding_Meeting_Jul24.png',
    resultMatch: '96.4% Relevance Match',
    resultDesc: 'Detected text via OCR: “Grant allocation confirmed at $240,000 for Q3 compute infrastructure.” Visual match detected financial spreadsheet thumbnail inside frame.',
    citation: 'Image OCR Block #4 • Visual CLIP Cosine Similarity: 0.892'
  },
  'text-doc': {
    queryTag: 'Text Query → Document Retrieval',
    queryText: '“Which report discusses international development in 2024?”',
    resultType: 'PDF Document',
    resultName: 'Global_Initiatives_2024_Final.pdf',
    resultMatch: '98.1% Relevance Match',
    resultDesc: 'Extracted Section 4.2: “Overview of multi-national development trajectories and humanitarian aid disbursement across sovereign partner agencies.”',
    citation: 'Page 42, Paragraph 3 • Semantic Chunk ID: #CHUNK_8421'
  },
  'image-text': {
    queryTag: 'Image Input → Text Retrieval',
    queryText: 'User provided: [Architecture_Diagram_V2.png]',
    resultType: 'Technical Markdown / Docx',
    resultName: 'System_Deployment_Architecture_Specification.docx',
    resultMatch: '94.8% Relevance Match',
    resultDesc: 'Matched architectural schema to documentation: “Describes FastAPI distributed workers communicating via local Unix domain sockets to Ollama inference engine.”',
    citation: 'Section 3.1: Network Topologies • Docx Chunk #12'
  },
  'audio-doc': {
    queryTag: 'Audio Recording → Document Cross-Reference',
    queryText: '“Recorded Audio: Weekly_Leadership_Sync_Aug12.m4a”',
    resultType: 'Spreadsheet / Meeting Memo',
    resultName: 'Q3_Approved_Budget_Consolidated.xlsx',
    resultMatch: '95.6% Relevance Match',
    resultDesc: 'FasterWhisper transcribed: “...and we signed off on the revised hardware allowance during yesterday’s call.” Matched directly to line 14 of the finance document.',
    citation: 'Timestamp: [14:22 - 14:48] • Audio Segment #28'
  },
  'video-text': {
    queryTag: 'Video Recording → Document Synthesis',
    queryText: '“Find where the new deployment pipeline was demonstrated in video”',
    resultType: 'Video Presentation & Spec',
    resultName: 'Sprint_Demo_Recording_Jul18.mp4',
    resultMatch: '93.7% Relevance Match',
    resultDesc: 'Keyframe at 08:34 matched slide titled “Local Containerized Execution”. Transcribed audio: “...here you can see the local retrieval engine executing on the M3 chip.”',
    citation: 'Keyframe #242 at [08:34] • Whisper Transcript Block #12'
  }
};

function initCrossModalMatrix() {
  const navBtns = document.querySelectorAll('.crossmodal-nav-btn');
  const tagEl = document.getElementById('cmInputTag');
  const queryEl = document.getElementById('cmInputQuery');
  const resTypeEl = document.getElementById('cmResultType');
  const resNameEl = document.getElementById('cmResultName');
  const resMatchEl = document.getElementById('cmResultMatch');
  const resDescEl = document.getElementById('cmResultDesc');
  const resCitEl = document.getElementById('cmResultCitation');

  if (!navBtns.length || !tagEl || !queryEl) return;

  function updateScenario(key) {
    const data = crossModalScenarios[key];
    if (!data) return;

    tagEl.textContent = data.queryTag;
    queryEl.textContent = data.queryText;
    resTypeEl.textContent = data.resultType;
    resNameEl.textContent = data.resultName;
    resMatchEl.textContent = data.resultMatch;
    resDescEl.textContent = data.resultDesc;
    resCitEl.textContent = data.citation;
  }

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-cm');
      updateScenario(target);
    });
  });
}

/* ===================================================
   SIMULATED MIRA DESKTOP APPLICATION
   Interactive queries, realistic response typing, and citations
   =================================================== */
const desktopQueries = [
  {
    pillText: 'International Dev 2024',
    userQuery: 'Show me the report discussing international development in 2024.',
    miraResponse: 'Based on your internal documents, international development priorities for 2024 were formally established in the Global Initiatives Annual Plan <span class="citation-chip" data-cit="1">[1]</span>. Key funding streams focus on sustainable infrastructure, environmental mitigation, and decentralized education programs across Latin America and Southeast Asia <span class="citation-chip" data-cit="2">[2]</span>.',
    sources: [
      { name: 'Global_Initiatives_2024_Final.pdf', snippet: 'Page 42: "Priority objectives and budget disbursement for multilateral regional development in 2024."' },
      { name: 'Executive_Board_Minutes_Jan24.docx', snippet: 'Item 4: "Approved global development allocation of $45M across targeted regional sectors."' }
    ]
  },
  {
    pillText: 'Project Funding Screenshot',
    userQuery: 'Find the screenshot mentioning project funding.',
    miraResponse: 'Found 1 high-confidence visual match in your screenshots library <span class="citation-chip" data-cit="1">[1]</span>. The screenshot captured a Slack thread with the finance director on July 14th confirming: "Seed allocation of $240,000 for local compute infrastructure has been signed off and scheduled for release."',
    sources: [
      { name: 'Slack_Strategy_Funding_Jul14.png', snippet: 'OCR detected: "...seed allocation of $240,000 for local compute infrastructure has been signed off..."' },
      { name: 'Grant_Agreement_Draft_v2.pdf', snippet: 'Appendix C: Matching schedule of equipment and server requisitions.' }
    ]
  },
  {
    pillText: 'Last Meeting Budget',
    userQuery: 'What budget was approved during the last meeting?',
    miraResponse: 'During the leadership meeting on August 12th, the committee approved a total operational budget of $580,000 for Q3/Q4 <span class="citation-chip" data-cit="1">[1]</span>, including $240,000 dedicated to local server provisioning and $85,000 for data retention compliance audits <span class="citation-chip" data-cit="2">[2]</span>.',
    sources: [
      { name: 'Leadership_Sync_Recording_Aug12.m4a', snippet: 'Transcript at [18:40]: "We have consensus on the $580k total allocation for the remainder of the fiscal year."' },
      { name: 'Q3_Budget_Summary_Approved.xlsx', snippet: 'Row 18: Operational line items and hardware budget authorization.' }
    ]
  },
  {
    pillText: 'Deployment Architecture',
    userQuery: 'Which document contains the deployment architecture?',
    miraResponse: 'The architecture is detailed in the System Specification Document <span class="citation-chip" data-cit="1">[1]</span>. It outlines the Electron desktop client communicating through a local FastAPI daemon, coordinating MemoryAgentV2 with ChromaDB and FasterWhisper for on-device multimodal ingestion.',
    sources: [
      { name: 'System_Architecture_Spec_v3.pdf', snippet: 'Section 2.4: "Modular Desktop Layering and IPC Protocol Specification."' },
      { name: 'Backend_Service_Topology.png', snippet: 'Diagram showing Electron -> FastAPI -> MemoryAgentV2 local workflow.' }
    ]
  }
];

function initDesktopSimulator() {
  const pills = document.querySelectorAll('.sample-query-pill');
  const userMsgEl = document.getElementById('desktopUserMsg');
  const miraBubbleEl = document.getElementById('desktopMiraBubble');
  const sourcesGridEl = document.getElementById('desktopSourcesGrid');

  if (!pills.length || !userMsgEl || !miraBubbleEl) return;

  function loadQuery(idx) {
    const data = desktopQueries[idx];
    if (!data) return;

    userMsgEl.textContent = data.userQuery;
    miraBubbleEl.innerHTML = '<p style="color: var(--text-tertiary); font-style: italic;">Retrieving local context from vector memory & generating grounded answer...</p>';
    sourcesGridEl.innerHTML = '';

    setTimeout(() => {
      miraBubbleEl.innerHTML = `<p>${data.miraResponse}</p>`;
      sourcesGridEl.innerHTML = data.sources.map(src => `
        <div class="source-preview-card">
          <div class="source-card-top">
            <span class="source-name">${src.name}</span>
            <span class="match-badge">Verified</span>
          </div>
          <p class="source-snippet">${src.snippet}</p>
        </div>
      `).join('');

      // Attach click to citations inside the chat
      miraBubbleEl.querySelectorAll('.citation-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const citNum = chip.getAttribute('data-cit');
          showCitationModal(citNum);
        });
      });
    }, 450);
  }

  pills.forEach((pill, idx) => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      loadQuery(idx);
    });
  });

  loadQuery(0);
}

/* ===================================================
   INTERACTIVE CITATION INSPECTOR
   =================================================== */
const citationLibrary = {
  '1': {
    file: 'Global_Initiatives_2024_Final.pdf',
    type: 'PDF Document',
    page: 'Page 42, Paragraph 2',
    matchScore: '98.4% Vector Cosine Similarity',
    exactExcerpt: '“Under Article 4 of the 2024 Global Initiatives framework, prioritized capital deployment shall target sustainable regional infrastructure, resilience programs, and decentralized scientific collaboration across participating territories.”',
    hash: 'SHA256: 8a4f91c0e39b... (Verified Local File)'
  },
  '2': {
    file: 'Executive_Board_Minutes_Jan24.docx',
    type: 'DOCX Document',
    page: 'Section 4, Page 3',
    matchScore: '96.2% Vector Cosine Similarity',
    exactExcerpt: '“The executive steering group unanimously ratified the funding schedule designating $45,000,000 for sovereign education and humanitarian technology research.”',
    hash: 'SHA256: 3c12bb9448ea... (Verified Local File)'
  },
  '3': {
    file: 'Slack_Strategy_Funding_Jul14.png',
    type: 'Screenshot (OCR)',
    page: 'Bounding Box [x:120, y:340, w:640, h:180]',
    matchScore: '95.1% Multimodal Embedding Match',
    exactExcerpt: '“@channel Confirming the initial grant release of $240,000 for Q3 compute servers and offline indexing nodes.”',
    hash: 'SHA256: e8d43a7719f2... (Verified Local File)'
  }
};

function initCitationInspector() {
  const triggers = document.querySelectorAll('.citation-inspector-trigger');
  const popover = document.getElementById('citationPopoverCard');
  if (!triggers.length || !popover) return;

  function updateInspector(citId) {
    const item = citationLibrary[citId] || citationLibrary['1'];
    popover.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
        <div>
          <span class="clay-badge clay-badge-lilac" style="margin-bottom: 8px;">Citation [${citId}] Trace</span>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-top: 4px;">${item.file}</h4>
          <p style="font-size: 0.82rem; color: var(--text-tertiary);">${item.page} • ${item.type}</p>
        </div>
        <span class="match-badge">${item.matchScore}</span>
      </div>
      <div class="clay-sunken" style="padding: 16px 20px; border-radius: 16px; margin-bottom: 20px;">
        <p style="font-size: 0.94rem; line-height: 1.55; color: var(--text-primary); font-style: italic;">
          ${item.exactExcerpt}
        </p>
      </div>
      <div style="font-size: 0.76rem; font-family: monospace; color: var(--text-muted); margin-bottom: 16px;">
        ${item.hash}
      </div>
      <div class="inspector-actions">
        <button class="inspector-btn" onclick="alert('Simulated Action: Verifying chunk hash against local index file.')">Verify Integrity</button>
        <button class="inspector-btn" onclick="alert('Simulated Action: Locating surrounding context paragraphs.')">Trace Context</button>
        <button class="inspector-btn" onclick="alert('Simulated Action: Inspecting OpenCLIP/FAISS vector metadata.')">Inspect Embeddings</button>
      </div>
    `;
  }

  triggers.forEach(trig => {
    trig.addEventListener('click', () => {
      triggers.forEach(t => t.classList.remove('active'));
      trig.classList.add('active');
      const cit = trig.getAttribute('data-cit');
      updateInspector(cit);
    });
  });

  updateInspector('1');
}

function showCitationModal(citNum) {
  const inspectorSection = document.getElementById('citations');
  if (inspectorSection) {
    inspectorSection.scrollIntoView({ behavior: 'smooth' });
    const trigger = document.querySelector(`.citation-inspector-trigger[data-cit="${citNum}"]`);
    if (trigger) {
      trigger.click();
    }
  }
}

/* ===================================================
   TACTILE 3D CARD TILT ON MOUSEMOVE
   =================================================== */
function initCard3DTilt() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const tiltCards = document.querySelectorAll('[data-clay-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotateX = deltaY * -6;
      const rotateY = deltaX * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* ===================================================
   SMOOTH PAGE TRANSITIONS TO COMING SOON
   =================================================== */
function initPageTransitions() {
  const downloadBtns = document.querySelectorAll('a[href="/coming-soon"], a[href="coming-soon.html"], .btn-download-transition');
  const overlay = document.querySelector('.page-transition-overlay');

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Tactile button compression feedback
      btn.style.transform = 'scale(0.92)';
      
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => {
          window.location.href = 'coming-soon.html';
        }, 300);
      } else {
        window.location.href = 'coming-soon.html';
      }
    });
  });
}
