/**
 * MIRA Interactive Desktop App Simulation
 * Simulates a local-first multimodal retrieval query, audio/document matching,
 * grounded response synthesis, citation popovers, and multi-turn conversational follow-up.
 * Automatically triggers live sequence as soon as visitor scrolls into view.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const demoContainer = document.getElementById('demo-messages');
    const inputField = document.getElementById('demo-input');
    const sendBtn = document.getElementById('demo-send-btn');
    const scanGlow = document.getElementById('demo-scan-glow');
    const presetPills = document.querySelectorAll('.demo-preset-pill');
    const sourceItems = document.querySelectorAll('.source-item');
    const demoWindow = document.querySelector('.demo-app-window') || document.getElementById('demo');

    if (!demoContainer || !inputField || !sendBtn) return;

    let isProcessing = false;
    let hasAutoTriggered = false;
    let pendingTimeout = null;

    // Simulation Data Scenarios
    const scenarios = {
      funding: {
        query: 'Find the discussion about project funding.',
        activeSources: ['src-audio', 'src-pdf'],
        answer: 'The project expansion funding of $1.2M was reviewed across the Q3 strategy meeting [1] and formal review documentation [2]. The committee ratified the allocation targeting local compute hardware and edge retrieval pipelines.',
        citations: [
          { id: '1', name: 'Board_Strategy_Sync.mp3', time: '14:22', excerpt: '“Unanimous consent recorded for the $1.2M hardware and local inference allocation.”' },
          { id: '2', name: 'Q3_Financial_Review.pdf', page: 'p. 14', excerpt: '“Section 4.2 — Approved Capex Budget: $1,200,000 earmarked for on-premise infrastructure.”' }
        ]
      },
      approval: {
        query: 'When was it approved?',
        activeSources: ['src-pdf', 'src-img'],
        answer: 'Based on the previous discussion regarding the $1.2M funding, the authorization was finalized on October 14, 2024 by the Investment Review Committee [1], with the sign-off memo archived in the meeting record [2].',
        citations: [
          { id: '1', name: 'Q3_Financial_Review.pdf', page: 'p. 18', excerpt: '“Signed off and ratified on Oct 14, 2024 by Chief Financial Officer & Lead Reviewer.”' },
          { id: '2', name: 'Budget_Approval_Screenshot.png', time: 'Frame 1', excerpt: '“Digital stamp: APPROVED 2024-10-14 16:45 UTC.”' }
        ]
      },
      summary: {
        query: 'Summarize audio recording key points.',
        activeSources: ['src-audio'],
        answer: 'The recording covers three core points: 1) Transitioning indexing workloads from cloud dependencies to local hardware [1], 2) Reducing latency for multimodal vector queries, and 3) Preserving organizational data autonomy.',
        citations: [
          { id: '1', name: 'Board_Strategy_Sync.mp3', time: '06:45', excerpt: '“Our priority is local data residency. Nothing leaves the building unless explicitly configured.”' }
        ]
      }
    };

    function clearHighlights() {
      sourceItems.forEach(item => item.classList.remove('active-source'));
    }

    function highlightSources(sourceIds) {
      clearHighlights();
      sourceIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('active-source');
      });
    }

    function createMessage(type, content, citations = []) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'demo-msg';

      if (type === 'user') {
        msgDiv.innerHTML = `<div class="demo-user-query">${content}</div>`;
      } else if (type === 'mira') {
        let citationChipsHtml = '';
        let flyoutsHtml = '';

        citations.forEach(c => {
          citationChipsHtml += `
            <button class="source-pill-card" data-cite="${c.id}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              <span>[${c.id}] ${c.name}</span>
            </button>
          `;

          flyoutsHtml += `
            <div class="citation-flyout" id="flyout-${c.id}">
              <strong>Source [${c.id}] · ${c.name} (${c.page || c.time}):</strong><br/>
              <em>${c.excerpt}</em>
            </div>
          `;
        });

        msgDiv.innerHTML = `
          <div class="demo-mira-response">
            <div class="response-header">
              <div class="response-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <span>MIRA Grounded Response</span>
              </div>
              <span class="grounded-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Verified Local Retrieval
              </span>
            </div>
            <div class="response-body">${content}</div>
            <div class="response-sources-tray">
              <span style="font-size:0.75rem; font-weight:700; color:var(--text-muted);">Citations:</span>
              ${citationChipsHtml}
            </div>
            ${flyoutsHtml}
          </div>
        `;

        // Add citation chip click behavior
        setTimeout(() => {
          const chips = msgDiv.querySelectorAll('.source-pill-card');
          chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
              e.stopPropagation();
              const citeId = chip.getAttribute('data-cite');
              const flyout = msgDiv.querySelector(`#flyout-${citeId}`);
              if (flyout) {
                const isVis = flyout.classList.contains('visible');
                msgDiv.querySelectorAll('.citation-flyout').forEach(f => f.classList.remove('visible'));
                if (!isVis) {
                  flyout.classList.add('visible');
                  chip.classList.add('highlighted');
                } else {
                  chip.classList.remove('highlighted');
                }
              }
            });
          });
        }, 50);
      }

      demoContainer.appendChild(msgDiv);
      demoContainer.scrollTop = demoContainer.scrollHeight;
    }

    function runScenario(key, onComplete) {
      if (isProcessing) return;
      const data = scenarios[key];
      if (!data) return;

      isProcessing = true;

      // 1. Post user message and clear input
      createMessage('user', data.query);
      inputField.value = '';

      // 2. Trigger scan wave animation
      if (scanGlow) scanGlow.classList.add('scanning');

      // 3. Highlight relevant files in sidebar
      setTimeout(() => {
        highlightSources(data.activeSources);
      }, 350);

      // 4. Output grounded MIRA response
      setTimeout(() => {
        if (scanGlow) scanGlow.classList.remove('scanning');
        createMessage('mira', data.answer, data.citations);
        isProcessing = false;

        // Advance active pill indicator
        presetPills.forEach(p => p.classList.remove('active'));
        if (key === 'funding') {
          const nextPill = document.querySelector('[data-scenario="approval"]');
          if (nextPill) nextPill.classList.add('active');
        } else if (key === 'approval') {
          const nextPill = document.querySelector('[data-scenario="summary"]');
          if (nextPill) nextPill.classList.add('active');
        }

        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 850);
    }

    // Type text into the input field character-by-character
    function typeText(text, callback) {
      inputField.value = '';
      let index = 0;
      const interval = setInterval(() => {
        inputField.value += text.charAt(index);
        index++;
        if (index >= text.length) {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 24);
    }

    // Live Auto-Demo Trigger on Scroll
    function triggerInitialAutoDemo() {
      if (hasAutoTriggered) return;
      hasAutoTriggered = true;

      // Ensure pre-entered text is visible
      inputField.value = scenarios.funding.query;

      // Brief realistic delay so user sees pre-entered text
      pendingTimeout = setTimeout(() => {
        // Tactile send button press
        sendBtn.style.transform = 'scale(0.92)';
        setTimeout(() => {
          sendBtn.style.transform = '';
          runScenario('funding', () => {
            // After initial answer arrives, trigger conversational follow-up
            pendingTimeout = setTimeout(() => {
              if (!isProcessing) {
                typeText(scenarios.approval.query, () => {
                  setTimeout(() => {
                    sendBtn.style.transform = 'scale(0.92)';
                    setTimeout(() => {
                      sendBtn.style.transform = '';
                      runScenario('approval');
                    }, 180);
                  }, 300);
                });
              }
            }, 2400);
          });
        }, 180);
      }, 450);
    }

    // IntersectionObserver to detect when the demo scrolls into view
    if (demoWindow && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAutoTriggered) {
            triggerInitialAutoDemo();
            observer.disconnect();
          }
        });
      }, {
        threshold: 0.28
      });
      observer.observe(demoWindow);
    } else {
      // Fallback scroll listener
      function checkDemoVisibility() {
        if (hasAutoTriggered || !demoWindow) return;
        const rect = demoWindow.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75 && rect.bottom > 100) {
          triggerInitialAutoDemo();
          window.removeEventListener('scroll', checkDemoVisibility);
        }
      }
      window.addEventListener('scroll', checkDemoVisibility, { passive: true });
      checkDemoVisibility();
    }

    // Connect preset test pills
    presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (pendingTimeout) clearTimeout(pendingTimeout);
        const scenario = pill.getAttribute('data-scenario');
        if (scenario === 'reset') {
          demoContainer.innerHTML = '';
          clearHighlights();
          presetPills.forEach(p => p.classList.remove('active'));
          const first = document.querySelector('[data-scenario="funding"]');
          if (first) first.classList.add('active');
          hasAutoTriggered = false;
          triggerInitialAutoDemo();
        } else if (scenario) {
          presetPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          runScenario(scenario);
        }
      });
    });

    // Handle form submit / send button
    sendBtn.addEventListener('click', () => {
      if (pendingTimeout) clearTimeout(pendingTimeout);
      const text = inputField.value.trim();
      if (!text) return;
      if (text.toLowerCase().includes('approved') || text.toLowerCase().includes('when')) {
        runScenario('approval');
      } else if (text.toLowerCase().includes('summary') || text.toLowerCase().includes('audio')) {
        runScenario('summary');
      } else {
        runScenario('funding');
      }
    });

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        sendBtn.click();
      }
    });
  });
})();
