/* ==========================================================================
   MIRA CHAT DEMONSTRATION SIMULATOR
   Interactive Simulated RAG Pipeline with Documented Queries & Citation Inspector
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const queryPresets = {
    'q-report': {
      query: 'Show me the report discussing international development in 2024.',
      modality: 'PDF Document',
      statusFlow: [
        'Searching FAISS vector index (top_k=5)...',
        'Retrieved 2 relevant document chunks with high cosine similarity (0.91)...',
        'Assembling grounded context window...',
        'Generating response with source grounding...'
      ],
      response: `The 2024 Global Initiatives Report outlines strategic priorities across three key domains <span class="citation-station-tag" data-citation="cit-rep-1">DOC-01 // P.14</span>: multilateral infrastructure funding, rural digital access programs, and bilateral renewable energy agreements. In Q2 2024, total capital committed reached \$420M across regional programs, with full accountability guidelines established under local jurisdiction <span class="citation-station-tag" data-citation="cit-rep-2">DOC-01 // P.22</span>.`,
      sources: [
        { id: 'cit-rep-1', file: '2024_Global_Initiatives_Report.pdf', page: 'Page 14, Section 3.2', score: '0.91 Cosine Match', snippet: 'Strategic infrastructure frameworks for 2024 international development emphasize multilateral capital mobilization, digital access in rural communities, and decentralized deployment...' },
        { id: 'cit-rep-2', file: '2024_Global_Initiatives_Report.pdf', page: 'Page 22, Table 4.1', score: '0.88 Cosine Match', snippet: 'Table 4.1: Capital disbursements totaling $420M confirmed across Q2 programs with complete auditing frameworks...' }
      ]
    },
    'q-screenshot': {
      query: 'Find the screenshot mentioning project funding.',
      modality: 'Image / OCR + BLIP',
      statusFlow: [
        'Querying multimodal vision index with OpenCLIP embeddings...',
        'OCR engine matched keyword "funding" and "allocation"...',
        'BLIP caption: "A system interface displaying quarterly budget graphs and seed allocation tables"...',
        'Synthesizing visual and textual evidence...'
      ],
      response: `Found in captured slide screenshot <span class="citation-station-tag" data-citation="cit-img-1">IMG-03 // OCR+BLIP</span> from the October review. The screen shows the "Phase 2 Grant Allocation" breakdown with an approved allocation of \$1.25M allocated directly to local data infrastructure and private compute nodes.`,
      sources: [
        { id: 'cit-img-1', file: 'board_review_slide_funding_v2.png', page: 'Image Coordinates [X:140, Y:320]', score: '0.94 Multimodal Match', snippet: 'OCR Text: "Phase 2 Grant Allocation: Total Approved $1,250,000 for Local Infrastructure and On-Premises Compute Clusters." BLIP Description: Interface showing green balance charts.' }
      ]
    },
    'q-budget': {
      query: 'What budget was approved during the last meeting?',
      modality: 'Audio / FasterWhisper',
      statusFlow: [
        'Transcribing and searching timestamped meeting logs...',
        'FasterWhisper segment matched: [00:24:15 - 00:24:48]...',
        'Cross-referencing with meeting minutes document...',
        'Synthesizing grounded conclusion...'
      ],
      response: `During the quarterly executive session on October 14, the board unanimously approved a revised project budget of \$850,000 for the upcoming fiscal quarter <span class="citation-station-tag" data-citation="cit-aud-1">AUD-02 // TC 00:24:18</span>. This includes \$500,000 designated for memory agent optimizations and \$350,000 for local vector database scaling <span class="citation-station-tag" data-citation="cit-doc-bud">DOC-04 // P.3</span>.`,
      sources: [
        { id: 'cit-aud-1', file: 'executive_board_sync_oct14.m4a', page: 'Timestamp 00:24:18 - 00:24:45', score: '0.96 Whisper Match', snippet: 'Speaker 1 (Chair): "...we can officially sign off on the 850k allocation for Q1, dividing 500k to agent memory and the remainder to our on-prem vector instances."' },
        { id: 'cit-doc-bud', file: 'Minutes_Meeting_Oct14_Signed.docx', page: 'Paragraph 18', score: '0.92 Text Match', snippet: 'Resolution 4B passed unanimously: Budget approved at $850,000 USD.' }
      ]
    },
    'q-architecture': {
      query: 'Which document contains the deployment architecture?',
      modality: 'DOCX Document',
      statusFlow: [
        'Searching technical specification corpus...',
        'Identified high relevance in engineering design documents...',
        'Extracting structural diagram annotations...',
        'Assembling deployment route...'
      ],
      response: `The complete deployment architecture is specified in <span class="citation-station-tag" data-citation="cit-arch-1">DOC-07 // SEC 4.1</span>. It documents the Electron frontend communicating via IPC to the FastAPI local backend, which invokes the MemoryAgentV2 pipeline, ChromaDB vector storage, and local Ollama model instances without external cloud reliance.`,
      sources: [
        { id: 'cit-arch-1', file: 'MIRA_Engineering_Architecture_v2.docx', page: 'Section 4.1: Component Layout', score: '0.95 Dense Match', snippet: 'Architecture Topology: Electron UI connects over localhost:8000 to FastAPI. MemoryAgentV2 orchestrates FAISS/ChromaDB vector operations alongside local Ollama LLM runtime.' }
      ]
    },
    'q-timeline': {
      query: 'What was discussed about the project timeline?',
      modality: 'Multi-Modal (Doc + Audio)',
      statusFlow: [
        'Joint multimodal search across notes and sprint recording...',
        'Synthesizing cross-modal timeline milestones...',
        'Verifying dates against roadmap specifications...',
        'Generating unified chronological breakdown...'
      ],
      response: `The sprint discussion confirmed that Phase 1 (multimodal indexing) is scheduled for code freeze by mid-November <span class="citation-station-tag" data-citation="cit-time-aud">AUD-01 // TC 00:11:05</span>. End-to-end integration and citation navigation improvements will follow in December ahead of the general release <span class="citation-station-tag" data-citation="cit-time-doc">DOC-02 // P.5</span>.`,
      sources: [
        { id: 'cit-time-aud', file: 'sprint_planning_w42.mp3', page: 'Timestamp 00:11:05', score: '0.89 Voice Match', snippet: 'Lead Engineer: "Let us ensure the multimodal pipeline code freezes around November 15, leaving December for citation polish."' },
        { id: 'cit-time-doc', file: 'project_mira_master_schedule.pdf', page: 'Page 5, Gantt Table', score: '0.93 Text Match', snippet: 'Milestone M3: Multimodal retrieval freeze Nov 15; Milestone M4: Production usability evaluation Dec 1-20.' }
      ]
    }
  };

  const viewport = document.getElementById('chat-viewport');
  const chatInput = document.getElementById('simulated-chat-input');
  const sendBtn = document.getElementById('simulated-send-btn');
  const presetBtns = document.querySelectorAll('.preset-query-btn');

  // Citation Modal Elements
  const modal = document.getElementById('citation-drawer');
  const modalClose = document.getElementById('citation-close-btn');
  const modalFile = document.getElementById('citation-modal-file');
  const modalLoc = document.getElementById('citation-modal-loc');
  const modalScore = document.getElementById('citation-modal-score');
  const modalSnippet = document.getElementById('citation-modal-snippet');

  let activeSourcesMap = {};

  // Store initial query sources into lookup
  Object.values(queryPresets).forEach(item => {
    item.sources.forEach(src => {
      activeSourcesMap[src.id] = src;
    });
  });

  // Attach click listener to preset buttons
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const qKey = btn.getAttribute('data-query-key');
      const data = queryPresets[qKey];
      if (data) {
        runSimulation(data);
      }
    });
  });

  if (sendBtn && chatInput) {
    sendBtn.addEventListener('click', () => {
      const userText = chatInput.value.trim();
      if (!userText) return;
      chatInput.value = '';
      runCustomSimulation(userText);
    });

    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const userText = chatInput.value.trim();
        if (!userText) return;
        chatInput.value = '';
        runCustomSimulation(userText);
      }
    });
  }

  function runSimulation(data) {
    if (!viewport) return;
    
    // 1. Add User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg-row user';
    userMsg.innerHTML = `
      <div class="msg-avatar-badge">YOU</div>
      <div class="msg-clay-bubble">
        <p>${escapeHtml(data.query)}</p>
      </div>
    `;
    viewport.appendChild(userMsg);
    viewport.scrollTop = viewport.scrollHeight;

    // 2. Add Pipeline Status Box
    const statusMsg = document.createElement('div');
    statusMsg.className = 'chat-msg-row mira status-loading';
    statusMsg.innerHTML = `
      <div class="msg-avatar-badge">M</div>
      <div class="msg-clay-bubble" style="background: var(--bg-primary);">
        <div class="pipeline-status-banner">
          <span class="metro-coord-dot"></span>
          <span id="pipeline-live-status">${data.statusFlow[0]}</span>
        </div>
      </div>
    `;
    viewport.appendChild(statusMsg);
    viewport.scrollTop = viewport.scrollHeight;

    const statusEl = statusMsg.querySelector('#pipeline-live-status');
    let stepIndex = 1;
    const interval = setInterval(() => {
      if (stepIndex < data.statusFlow.length) {
        if (statusEl) statusEl.textContent = data.statusFlow[stepIndex];
        stepIndex++;
      } else {
        clearInterval(interval);
        statusMsg.remove();
        renderMiraAnswer(data.response);
      }
    }, 450);
  }

  function runCustomSimulation(text) {
    const mockData = {
      query: text,
      statusFlow: [
        'Vector scanning indexed documents and media...',
        'Parsing semantic embedding matches...',
        'Constructing local contextual envelope...'
      ],
      response: `MIRA matched your inquiry against the local knowledge repository <span class="citation-station-tag" data-citation="cit-custom-1">LOCAL-KB // CHUNK-42</span>. The relevant context indicates all data points align with your criteria, processed entirely within your machine boundary.`,
      sources: [
        {
          id: 'cit-custom-1',
          file: 'user_active_knowledge_base.parquet',
          page: 'Chunk ID #42 (Similarity 0.93)',
          score: '0.93 Local Match',
          snippet: `Text matching query "${escapeHtml(text)}": Retrieved local memory chunk with verified semantic integrity.`
        }
      ]
    };
    mockData.sources.forEach(s => { activeSourcesMap[s.id] = s; });
    runSimulation(mockData);
  }

  function renderMiraAnswer(htmlContent) {
    const miraMsg = document.createElement('div');
    miraMsg.className = 'chat-msg-row mira';
    miraMsg.innerHTML = `
      <div class="msg-avatar-badge">M</div>
      <div class="msg-clay-bubble">
        <div style="font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-light); margin-bottom: 8px; text-transform: uppercase;">
          [GROUNDED RESPONSE // LOCAL RUNTIME]
        </div>
        <div>${htmlContent}</div>
      </div>
    `;
    viewport.appendChild(miraMsg);
    viewport.scrollTop = viewport.scrollHeight;

    // Attach event listeners to newly rendered citation tags
    miraMsg.querySelectorAll('.citation-station-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const citId = tag.getAttribute('data-citation');
        openCitationInspector(citId);
      });
    });
  }

  // Citation Inspector Drawer
  function openCitationInspector(citationId) {
    const source = activeSourcesMap[citationId];
    if (!source || !modal) return;

    if (modalFile) modalFile.textContent = source.file;
    if (modalLoc) modalLoc.textContent = source.page;
    if (modalScore) modalScore.textContent = source.score;
    if (modalSnippet) modalSnippet.textContent = source.snippet;

    modal.classList.add('open');
  }

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('open');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  }

  // Bind initial citations in static markup if any
  document.querySelectorAll('.citation-station-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      const citId = tag.getAttribute('data-citation');
      openCitationInspector(citId);
    });
  });

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
});
