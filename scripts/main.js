/**
 * MIRA — Multimodal Intelligent Retrieval & Autonomous Assistant
 * Pure Static Frontend Engine: Kinetic Motion, Simulated RAG & Tactile Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initChaosToggle();
  initFormatsVisualizer();
  initPipelineTabs();
  initCrossModalExplorer();
  initAskYourDataSimulation();
  initCitationDrawer();
  initArchitectureInspector();
  initSmoothScroll();
});

/* ==========================================================================
   1. NAVBAR SCROLL & MOBILE MENU
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.textContent = isOpen ? 'CLOSE ✕' : 'MENU ☰';
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.textContent = 'MENU ☰';
    });
  });
}

/* ==========================================================================
   2. INFORMATION CHAOS TO STRUCTURE TOGGLE
   ========================================================================== */
function initChaosToggle() {
  const canvas = document.getElementById('chaosCanvas');
  const toggleBtn = document.getElementById('chaosToggleBtn');
  const statusLabel = document.getElementById('chaosStatusLabel');
  if (!canvas || !toggleBtn || !statusLabel) return;

  let isStructured = false;

  toggleBtn.addEventListener('click', () => {
    isStructured = !isStructured;
    if (isStructured) {
      canvas.classList.remove('state-chaotic');
      canvas.classList.add('state-structured');
      toggleBtn.textContent = 'RESTORE CHAOS ↺';
      statusLabel.innerHTML = '<span class="status-dot"></span> ALL 6 ASSETS INDEXED & EMBEDDED IN UNIFIED VECTOR SPACE';
      statusLabel.style.color = 'var(--accent-green)';
    } else {
      canvas.classList.remove('state-structured');
      canvas.classList.add('state-chaotic');
      toggleBtn.textContent = 'ORGANIZE INTO KNOWLEDGE ⚡';
      statusLabel.innerHTML = '⚠ 6 UNSTRUCTURED / DISPERSED ASSETS DETECTED';
      statusLabel.style.color = 'var(--accent-yellow)';
    }
  });
}

/* ==========================================================================
   3. ONE KNOWLEDGE BASE FORMAT CARDS
   ========================================================================== */
function initFormatsVisualizer() {
  const cards = document.querySelectorAll('.format-card');
  const infoDisplay = document.getElementById('formatMetaInfo');
  if (!cards.length || !infoDisplay) return;

  const formatData = {
    'PDF': 'Extracted via PyPDF/PDFMiner, chunked semantically, vectorized into FAISS index.',
    'DOCX': 'Document structure parsed, headings preserved as semantic boundaries for chunking.',
    'IMAGE': 'OCR for embedded text + BLIP captioning + OpenCLIP dense vector embeddings.',
    'AUDIO': 'Transcribed locally with FasterWhisper, timestamped into searchable semantic chunks.',
    'VIDEO': 'Keyframes extracted via OpenCV + audio track transcribed via FasterWhisper.',
    'TEXT': 'Direct semantic tokenization and chunking into ChromaDB / FAISS storage.'
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const format = card.getAttribute('data-format');
      if (format && formatData[format]) {
        infoDisplay.innerHTML = `<strong>${format} PIPELINE:</strong> ${formatData[format]}`;
      }
    });
  });
}

/* ==========================================================================
   4. MULTIMODAL PROCESSING PIPELINE TABS
   ========================================================================== */
function initPipelineTabs() {
  const tabBtns = document.querySelectorAll('.pipeline-tab-btn');
  const stagesContainer = document.getElementById('pipelineStages');
  if (!tabBtns.length || !stagesContainer) return;

  const pipelines = {
    'docs': [
      { num: '01', title: 'PDF / DOCX SOURCE', tech: 'FILE INGESTION', desc: 'Raw binary stream ingested from local machine directory' },
      { num: '02', title: 'TEXT EXTRACTION', tech: 'PARSER / OCR', desc: 'Preserves tables, headings, and document semantic hierarchy' },
      { num: '03', title: 'CHUNKING ENGINE', tech: 'SLIDING WINDOW', desc: 'Token-bounded overlap chunks with metadata attribution' },
      { num: '04', title: 'EMBEDDING GENERATION', tech: 'SENTENCE-TRANSFORMERS', desc: 'High-dimensional semantic vector synthesis' },
      { num: '05', title: 'VECTOR STORAGE', tech: 'FAISS / CHROMADB', desc: 'Persistent local index with sub-millisecond nearest neighbor search' }
    ],
    'images': [
      { num: '01', title: 'IMAGE SOURCE', tech: 'PNG / JPG / WEBP', desc: 'Screenshots, architectural diagrams, handwritten notes' },
      { num: '02', title: 'OCR EXTRACTION', tech: 'TESSERACT / EASYOCR', desc: 'Dense optical character recognition of visual text strings' },
      { num: '03', title: 'VISUAL REASONING', tech: 'BLIP MODEL', desc: 'Contextual natural language caption synthesis' },
      { num: '04', title: 'MULTIMODAL EMBEDDING', tech: 'OPENCLIP ViT', desc: 'Unified joint image-text vector representation' },
      { num: '05', title: 'KNOWLEDGE BASE', tech: 'VECTOR INDEX', desc: 'Directly searchable with both textual queries and reference images' }
    ],
    'audio': [
      { num: '01', title: 'AUDIO RECORDING', tech: 'MP3 / WAV / M4A', desc: 'Meeting recordings, client voice notes, research interviews' },
      { num: '02', title: 'SPEECH-TO-TEXT', tech: 'FASTERWHISPER', desc: 'High-accuracy local transcription with speaker awareness' },
      { num: '03', title: 'TEMPORAL CHUNKING', tech: 'TIMESTAMP ALIGNER', desc: 'Associates each chunk with exact minute/second offsets' },
      { num: '04', title: 'SEMANTIC INDEXING', tech: 'EMBEDDINGS', desc: 'Encodes spoken dialogue into the knowledge vector space' },
      { num: '05', title: 'TRACEABLE INDEX', tech: 'TIME-MAPPED FAISS', desc: 'Answers link directly to exact playback timestamps' }
    ],
    'video': [
      { num: '01', title: 'VIDEO FILE', tech: 'MP4 / MKV / MOV', desc: 'Screen shares, product walkthroughs, conference talks' },
      { num: '02', title: 'KEYFRAME EXTRACTION', tech: 'OPENCV ENGINE', desc: 'Selects visual scene shifts, slides, and graphical transitions' },
      { num: '03', title: 'AUDIO SEPARATION', tech: 'FFMPEG DEMUX', desc: 'Strips audio track directly to FasterWhisper engine' },
      { num: '04', title: 'CROSS-MODAL SYNTHESIS', tech: 'BLIP + CLIP + WHISPER', desc: 'Correlates spoken dialogue with visual slides on screen' },
      { num: '05', title: 'UNIFIED MULTIMODAL INDEX', tech: 'CHROMA / FAISS', desc: 'Searchable across visual frames, text slides, and speech' }
    ]
  };

  function renderPipeline(key) {
    const steps = pipelines[key] || pipelines['docs'];
    stagesContainer.innerHTML = steps.map((step, idx) => `
      <div class="pipeline-step-node">
        <span class="step-num">STAGE ${step.num}</span>
        <h4 class="step-title">${step.title}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${step.desc}</p>
        <span class="step-tech">${step.tech}</span>
      </div>
      ${idx < steps.length - 1 ? '<div class="pipeline-connector-arrow">→</div>' : ''}
    `).join('');
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-pipeline');
      renderPipeline(key);
    });
  });

  renderPipeline('docs');
}

/* ==========================================================================
   5. CROSS-MODAL RETRIEVAL EXPLORER
   ========================================================================== */
function initCrossModalExplorer() {
  const buttons = document.querySelectorAll('.modality-select-btn');
  const queryDisplay = document.getElementById('crossModalQuery');
  const resultDisplay = document.getElementById('crossModalResult');
  if (!buttons.length || !queryDisplay || !resultDisplay) return;

  const scenarios = {
    'text-to-image': {
      queryTitle: 'INPUT: NATURAL LANGUAGE TEXT',
      queryContent: '“Find screenshots related to the project funding discussion.”',
      resultTitle: 'RETRIEVED: IMAGE ASSET VIA OPENCLIP',
      resultFilename: 'Screen_Capture_2025_02_18_Funding_Sync.png',
      resultDesc: 'Matched slide table: “Seed Budget Breakdown — Stage II Approved at $2.4M”. Visual vector distance: 0.18 (High confidence).',
      tag: 'IMAGE MATCH'
    },
    'text-to-doc': {
      queryTitle: 'INPUT: NATURAL LANGUAGE TEXT',
      queryContent: '“Which report discusses international development policies?”',
      resultTitle: 'RETRIEVED: DOCUMENT PASSAGE VIA FAISS',
      resultFilename: 'UN_Global_Framework_v3.pdf — Page 42, §4.1',
      resultDesc: '“...multilateral agreements establish regional funding priorities with localized oversight governance...”',
      tag: 'DOCUMENT MATCH'
    },
    'image-to-text': {
      queryTitle: 'INPUT: IMAGE ASSET',
      queryContent: '[Uploaded System Diagram: Distributed Vector Architecture]',
      resultTitle: 'RETRIEVED: TEXTUAL RESEARCH NOTES',
      resultFilename: 'Engineering_Specs_RFC409.docx — Section 2',
      resultDesc: '“The dual vector store implements memory paging over local NVMe drives using SQLite indexing for metadata persistence.”',
      tag: 'TEXT MATCH'
    },
    'audio-to-doc': {
      queryTitle: 'INPUT: AUDIO STREAM QUERY',
      queryContent: '“What deliverables were promised for Friday in the standup recording?”',
      resultTitle: 'RETRIEVED: MEETING TRANSCRIPT + DOC CONTEXT',
      resultFilename: 'Sync_Standup_Audio_Mar08.mp3 [04:18 - 05:02]',
      resultDesc: 'Speaker 2: “I will deliver the local embedding benchmark scripts and the updated FastAPI contract by Friday noon.”',
      tag: 'AUDIO TIMESTAMP'
    },
    'video-to-text': {
      queryTitle: 'INPUT: VIDEO QUERY',
      queryContent: '“Show where the architecture slide was presented in the sprint review video.”',
      resultTitle: 'RETRIEVED: VIDEO FRAME + SLIDE TEXT',
      resultFilename: 'Sprint_Review_Recording.mp4 [Timestamp 18:45]',
      resultDesc: 'Extracted keyframe matches architectural schematic: “FastAPI backend to Electron IPC bridge configuration”.',
      tag: 'KEYFRAME & AUDIO'
    }
  };

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key = btn.getAttribute('data-modality');
      const item = scenarios[key];
      if (!item) return;

      queryDisplay.innerHTML = `
        <span class="mono" style="font-size: 0.75rem; color: var(--accent-orange); font-weight: 700; display: block; margin-bottom: 6px;">${item.queryTitle}</span>
        <div style="font-size: 1.2rem; font-weight: 700;">${item.queryContent}</div>
      `;

      resultDisplay.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <span class="mono" style="font-size: 0.75rem; color: var(--accent-blue); font-weight: 700;">${item.resultTitle}</span>
          <span class="brutal-badge brutal-badge-green">${item.tag}</span>
        </div>
        <div style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">${item.resultFilename}</div>
        <p style="font-size: 0.95rem; line-height: 1.5; color: var(--text-muted);">${item.desc}</p>
      `;
    });
  });
}

/* ==========================================================================
   6. ASK YOUR DATA (SIMULATED NEO-BRUTALIST INTERFACE)
   ========================================================================== */
function initAskYourDataSimulation() {
  const chipButtons = document.querySelectorAll('.query-chip-btn');
  const inputField = document.getElementById('terminalInput');
  const execBtn = document.getElementById('terminalSubmitBtn');
  const stepCards = document.querySelectorAll('.retrieval-step-card');
  const answerBody = document.getElementById('simulatedAnswerText');
  const sourcesContainer = document.getElementById('simulatedSourcesContainer');

  if (!inputField || !execBtn || !answerBody || !sourcesContainer) return;

  const demoAnswers = {
    'budget': {
      text: 'During the last board meeting, an operational budget of <strong>$1.85 Million</strong> was unanimously approved for Q3 infrastructure development. An additional contingent reserve of $300,000 was authorized specifically for on-premise hardware testing.',
      sources: [
        { id: 'SRC-01', title: 'MEETING_RECORDING.MP4', offset: '14:32 - 16:10', type: 'Audio / Video', confidence: '99.1%' },
        { id: 'SRC-02', title: 'PROJECT_BUDGET_Q3.PDF', offset: 'Page 4, Table 2.1', type: 'PDF Document', confidence: '98.4%' },
        { id: 'SRC-03', title: 'EXECUTIVE_NOTES.DOCX', offset: 'Section 4.3 Resolution', type: 'DOCX Document', confidence: '96.8%' }
      ]
    },
    'audit': {
      text: 'The Q3 Security and Storage Audit concluded that <strong>100% of analyzed file chunks</strong> remain isolated within the host workspace sandbox. No unauthorized outbound sockets were initiated, and vector embeddings residing in local FAISS indices conform to storage encryption policies.',
      sources: [
        { id: 'SRC-01', title: 'Q3_COMPLIANCE_AUDIT.PDF', offset: 'Pages 12-18', type: 'PDF Document', confidence: '98.9%' },
        { id: 'SRC-02', title: 'FASTAPI_AUDIT_LOGS.TXT', offset: 'Lines 1040-1120', type: 'System Log', confidence: '97.2%' }
      ]
    },
    'federated': {
      text: 'The speaker notes indicate that federated storage uses a <strong>dual-engine approach</strong>: fast in-memory similarity lookup via FAISS for real-time turn latency, backed by persistent SQLite metadata tables and ChromaDB collections for cold historical recall.',
      sources: [
        { id: 'SRC-01', title: 'STORAGE_ARCHITECTURE_SLIDES.PDF', offset: 'Slide 16', type: 'Presentation', confidence: '98.7%' },
        { id: 'SRC-02', title: 'SPEAKER_NOTES_SYNC.MP3', offset: '22:15 - 23:40', type: 'Audio Recording', confidence: '95.9%' },
        { id: 'SRC-03', title: 'ENGINEERING_RFC.DOCX', offset: 'Appendix B', type: 'DOCX Document', confidence: '94.3%' }
      ]
    }
  };

  function executeQuery(queryText, scenarioKey = 'budget') {
    inputField.value = queryText;

    // Reset step tracker
    stepCards.forEach(c => {
      c.classList.remove('active', 'completed');
    });

    answerBody.innerHTML = '<span class="mono" style="color: var(--accent-orange);">RETRIEVING CONTEXT FROM LOCAL VECTOR INDEX...</span>';
    sourcesContainer.innerHTML = '';

    // Step 1: QUERY RECEIVED
    stepCards[0]?.classList.add('active');

    setTimeout(() => {
      stepCards[0]?.classList.remove('active');
      stepCards[0]?.classList.add('completed');
      stepCards[1]?.classList.add('active');
    }, 300);

    // Step 2: SEARCHING SEMANTIC INDEX
    setTimeout(() => {
      stepCards[1]?.classList.remove('active');
      stepCards[1]?.classList.add('completed');
      stepCards[2]?.classList.add('active');
    }, 700);

    // Step 3: RELEVANT CONTEXT FOUND
    setTimeout(() => {
      stepCards[2]?.classList.remove('active');
      stepCards[2]?.classList.add('completed');
      stepCards[3]?.classList.add('active');
    }, 1100);

    // Step 4: GENERATING GROUNDED RESPONSE
    setTimeout(() => {
      stepCards[3]?.classList.remove('active');
      stepCards[3]?.classList.add('completed');

      const data = demoAnswers[scenarioKey] || demoAnswers['budget'];
      answerBody.innerHTML = data.text;

      // Render attached clickable source chips
      sourcesContainer.innerHTML = data.sources.map(s => `
        <button class="source-chip" data-source-id="${s.id}" data-filename="${s.title}" data-offset="${s.offset}" data-type="${s.type}" data-conf="${s.confidence}">
          <span style="color: var(--accent-orange);">[${s.id}]</span>
          <span>${s.title}</span>
          <span class="mono" style="font-size: 0.7rem; color: #555;">(${s.offset})</span>
        </button>
      `).join('');

      bindSourceChipEvents();
    }, 1500);
  }

  chipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      chipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const query = btn.getAttribute('data-query');
      const key = btn.getAttribute('data-key') || 'budget';
      executeQuery(query, key);
    });
  });

  execBtn.addEventListener('click', () => {
    const val = inputField.value.trim();
    if (val) {
      executeQuery(val, 'budget');
    }
  });

  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = inputField.value.trim();
      if (val) executeQuery(val, 'budget');
    }
  });

  // Initial execution state
  bindSourceChipEvents();
}

/* ==========================================================================
   7. INTERACTIVE CITATION DRAWER / INSPECTOR MODAL
   ========================================================================== */
function initCitationDrawer() {
  const overlay = document.getElementById('citationModalOverlay');
  const closeBtn = document.getElementById('citationCloseBtn');
  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      overlay.classList.remove('active');
    }
  });
}

function bindSourceChipEvents() {
  const chips = document.querySelectorAll('.source-chip');
  const overlay = document.getElementById('citationModalOverlay');
  const modalFilename = document.getElementById('modalSourceFilename');
  const modalOffset = document.getElementById('modalSourceOffset');
  const modalQuote = document.getElementById('modalSourceQuote');
  const modalConfidence = document.getElementById('modalConfidenceScore');
  const modalFormat = document.getElementById('modalSourceFormat');
  const modalHash = document.getElementById('modalSourceHash');

  if (!chips.length || !overlay) return;

  const mockSnippets = {
    'MEETING_RECORDING.MP4': '“...motion to accept the proposed third quarter allocation of one point eight five million dollars for infrastructure and local model benchmarking is carried without objection...”',
    'PROJECT_BUDGET_Q3.PDF': 'Section 2.1 Summary Table: “Item A-401 Approved Infrastructure CapEx: $1,850,000. Authorized Signatory: Finance Committee Chair.”',
    'EXECUTIVE_NOTES.DOCX': '“Action Items: Implement local-first deployment plan for engineering teams. Disburse initial budget tranche under approved Q3 operational bounds.”',
    'Q3_COMPLIANCE_AUDIT.PDF': '“The memory-isolated architecture verified zero exfiltration vectors when operating with locally provisioned LLM checkpoints.”',
    'FASTAPI_AUDIT_LOGS.TXT': '“[INFO] 2025-08-14 11:22:01 - POST /query latency=412ms tokens=148 citations=3 vector_hits=12 local_socket=127.0.0.1:8000”',
    'STORAGE_ARCHITECTURE_SLIDES.PDF': '“Architecture Diagram 4: SQLite cataloging layer coordinates multi-modal vector embeddings across FAISS flat and IVFPQ indexes.”',
    'SPEAKER_NOTES_SYNC.MP3': '“...ensure the desktop client maintains cached vector partitions on disk so users do not recompute embeddings across sessions...”',
    'ENGINEERING_RFC.DOCX': '“Specification for local state synchronization: MemoryAgentV2 coordinates IPC calls between Electron UI and FastAPI daemon.”'
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filename = chip.getAttribute('data-filename') || 'DOCUMENT_SOURCE.PDF';
      const offset = chip.getAttribute('data-offset') || 'Page 1';
      const format = chip.getAttribute('data-type') || 'Document';
      const conf = chip.getAttribute('data-conf') || '98.5%';

      if (modalFilename) modalFilename.textContent = filename;
      if (modalOffset) modalOffset.textContent = offset;
      if (modalFormat) modalFormat.textContent = format;
      if (modalConfidence) modalConfidence.textContent = conf;
      if (modalHash) modalHash.textContent = 'sha256:7f83b165...e92f4';

      const snippet = mockSnippets[filename] || '“Extracted verified passage matching semantic vector coordinates for the submitted query.”';
      if (modalQuote) modalQuote.textContent = snippet;

      overlay.classList.add('active');
    });
  });
}

/* ==========================================================================
   8. SYSTEM ARCHITECTURE INSPECTOR
   ========================================================================== */
function initArchitectureInspector() {
  const nodes = document.querySelectorAll('.arch-node');
  const descPanel = document.getElementById('archDescPanel');
  if (!nodes.length || !descPanel) return;

  const archDetails = {
    'electron': '<strong>ELECTRON DESKTOP LAYER:</strong> Provides the cross-platform native desktop application shell, window management, local file system dialogs, and low-latency IPC communication with the backend process.',
    'fastapi': '<strong>FASTAPI ENGINE:</strong> High-performance Python backend server handling REST/WebSocket endpoints, asynchronous job scheduling, document ingestion pipelines, and retrieval orchestration.',
    'memoryagent': '<strong>MEMORYAGENTV2:</strong> The central orchestrator coordinating retrieval-augmented generation. Manages multi-turn conversation context, query rewriting, reranking, and source attribution verification.',
    'multimodal': '<strong>MULTIMODAL INGESTION LAYER:</strong> Specialized document and media processors: Tesseract/EasyOCR for scanned images, BLIP for vision-language captioning, OpenCLIP for visual embeddings, and FasterWhisper for fast local speech-to-text.',
    'vectorstorage': '<strong>VECTOR STORAGE (FAISS & CHROMADB):</strong> Dual indexing architecture. FAISS delivers ultra-fast similarity searches over dense multimodal embeddings, while ChromaDB manages persistent document collections and rich metadata.',
    'llm': '<strong>CONFIGURABLE LANGUAGE MODEL LAYER:</strong> Pluggable architecture supporting local runners (Ollama / Llama) for strict offline setups, or external API providers (Gemini, Cohere, etc.) based on deployment requirements.',
    'grounded': '<strong>GROUNDED RESPONSE & TRACEABILITY ENGINE:</strong> Synthesizes answers strictly bound to retrieved context chunks, annotating every factual assertion with verifiable source filenames and byte/page/timestamp coordinates.'
  };

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('selected'));
      node.classList.add('selected');
      const key = node.getAttribute('data-arch');
      if (key && archDetails[key]) {
        descPanel.innerHTML = archDetails[key];
      }
    });
  });
}

/* ==========================================================================
   9. SMOOTH ANCHOR SCROLLING
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}
