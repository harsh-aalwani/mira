/* ==========================================================================
   MIRA TRANSIT MAP CONTROLLER & SVG ANIMATION
   Multimodal Processing Schematic with Animated Packets & Station Inspection
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const mapSvg = document.getElementById('transit-map-svg');
  if (!mapSvg) return;

  // Station metadata for click/hover inspection
  const stationDetails = {
    'st-doc-in': { name: 'Documents Terminal', line: 'Document Line', tech: 'PDF / DOCX Ingestion', desc: 'Raw document input streams arriving from local filesystems.' },
    'st-doc-text': { name: 'Text Extraction', line: 'Document Line', tech: 'Native Text Parsing', desc: 'Extracts structured text, headers, and tables from formatted files.' },
    'st-doc-chunk': { name: 'Semantic Chunking', line: 'Document Line', tech: 'Context-Aware Sliding Window', desc: 'Splits text into coherent semantic passages with overlap to retain context.' },
    'st-doc-emb': { name: 'Text Embeddings', line: 'Document Line', tech: 'Dense Vector Model', desc: 'Generates high-dimensional vector representations capturing semantic meaning.' },
    
    'st-img-in': { name: 'Vision Terminal', line: 'Vision Line', tech: 'Image Files / Screenshots', desc: 'Supports photos, charts, system screenshots, and scanned documents.' },
    'st-img-ocr': { name: 'Optical Character Recognition', line: 'Vision Line', tech: 'OCR Engine', desc: 'Detects and extracts textual symbols embedded within images.' },
    'st-img-blip': { name: 'BLIP Captioning', line: 'Vision Line', tech: 'BLIP Vision-Language', desc: 'Generates natural language descriptions and dense semantic captions of visual scenes.' },
    'st-img-clip': { name: 'OpenCLIP Embeddings', line: 'Vision Line', tech: 'OpenCLIP Multimodal Space', desc: 'Projects visual features into the shared multimodal embedding space.' },

    'st-aud-in': { name: 'Audio Terminal', line: 'Audio Line', tech: 'Recordings / Voice Notes', desc: 'Accepts meeting recordings, voice memos, and spoken audio.' },
    'st-aud-whisper': { name: 'FasterWhisper Ingestion', line: 'Audio Line', tech: 'FasterWhisper Engine', desc: 'Performs rapid, accurate local speech-to-text transcription with timestamps.' },
    'st-aud-chunk': { name: 'Transcript Chunking', line: 'Audio Line', tech: 'Timestamped Chunking', desc: 'Segments transcribed dialogue into timestamped conversational turns.' },
    
    'st-vid-in': { name: 'Video Terminal', line: 'Video Line', tech: 'Video Files / Recordings', desc: 'Ingests MP4/MKV video files for dual-stream decomposition.' },
    'st-vid-frames': { name: 'Frame Extraction', line: 'Video Line', tech: 'Keyframe Sampling', desc: 'Selects representative keyframes for sequential visual processing.' },
    'st-vid-speech': { name: 'Speech Processing', line: 'Video Line', tech: 'FasterWhisper Audio Stream', desc: 'Extracts audio track and streams into the FasterWhisper pipeline.' },

    'st-vector-core': { name: 'Vector Index Terminal', line: 'Central Knowledge Hub', tech: 'FAISS & ChromaDB', desc: 'Unified vector storage uniting document, image, audio, and video representations for sub-millisecond retrieval.' }
  };

  const inspectorName = document.getElementById('station-detail-name');
  const inspectorLine = document.getElementById('station-detail-line');
  const inspectorTech = document.getElementById('station-detail-tech');
  const inspectorDesc = document.getElementById('station-detail-desc');

  // Filter line buttons
  const lineFilterBtns = document.querySelectorAll('.legend-btn');
  lineFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lineFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetLine = btn.getAttribute('data-line');
      filterTransitLines(targetLine);
    });
  });

  function filterTransitLines(line) {
    const allLines = mapSvg.querySelectorAll('.map-route-line, .route-path-group');
    if (line === 'all') {
      allLines.forEach(el => {
        el.style.opacity = '1';
        el.style.filter = 'none';
      });
    } else {
      allLines.forEach(el => {
        if (el.classList.contains(line) || el.classList.contains('core')) {
          el.style.opacity = '1';
          el.style.filter = 'none';
        } else {
          el.style.opacity = '0.18';
          el.style.filter = 'grayscale(80%)';
        }
      });
    }
  }

  // Station node interaction
  const stationNodes = mapSvg.querySelectorAll('.transit-station-node');
  stationNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const id = node.getAttribute('id');
      const info = stationDetails[id];
      if (info && inspectorName) {
        inspectorName.textContent = info.name;
        inspectorLine.textContent = info.line;
        inspectorTech.textContent = info.tech;
        inspectorDesc.textContent = info.desc;
      }
    });

    node.addEventListener('click', () => {
      const id = node.getAttribute('id');
      const info = stationDetails[id];
      if (info && inspectorName) {
        inspectorName.textContent = info.name;
        inspectorLine.textContent = info.line;
        inspectorTech.textContent = info.tech;
        inspectorDesc.textContent = info.desc;
      }
      // Pulsing indicator feedback
      const circle = node.querySelector('circle');
      if (circle) {
        circle.style.transform = 'scale(1.5)';
        setTimeout(() => { circle.style.transform = 'scale(1)'; }, 300);
      }
    });
  });

  // Animated SVG data packets along the 4 routes
  animateDataPackets();

  function animateDataPackets() {
    const packets = [
      { id: 'pkt-doc', pathId: 'path-doc-main', color: '#D34B32', duration: 4200, delay: 0 },
      { id: 'pkt-doc-2', pathId: 'path-doc-main', color: '#D34B32', duration: 4200, delay: 2100 },
      { id: 'pkt-img', pathId: 'path-img-main', color: '#2563EB', duration: 4800, delay: 600 },
      { id: 'pkt-aud', pathId: 'path-aud-main', color: '#D97706', duration: 4000, delay: 1200 },
      { id: 'pkt-vid-v', pathId: 'path-vid-visual', color: '#0D8267', duration: 5200, delay: 800 },
      { id: 'pkt-vid-s', pathId: 'path-vid-speech', color: '#0D8267', duration: 5000, delay: 2400 }
    ];

    packets.forEach(p => {
      const path = document.getElementById(p.pathId);
      if (!path) return;
      
      const packetCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      packetCircle.setAttribute('r', '5');
      packetCircle.setAttribute('fill', p.color);
      packetCircle.setAttribute('filter', 'drop-shadow(0px 0px 4px ' + p.color + ')');
      mapSvg.appendChild(packetCircle);

      const pathLength = path.getTotalLength();
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp + p.delay;
        const progress = ((timestamp - startTime) % p.duration) / p.duration;
        if (progress >= 0) {
          const point = path.getPointAtLength(progress * pathLength);
          packetCircle.setAttribute('cx', point.x);
          packetCircle.setAttribute('cy', point.y);
        }
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
});
