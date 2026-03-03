// ============================================
// Vibe Requirements - Interactive Workshop App
// Rewritten to align with HTML structure
// ============================================

(() => {
  'use strict';

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
      if (key === 'className') node.className = val;
      else if (key === 'textContent') node.textContent = val;
      else if (key.startsWith('data')) node.setAttribute(key.replace(/([A-Z])/g, '-$1').toLowerCase(), val);
      else node.setAttribute(key, val);
    }
    for (const child of children) {
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    }
    return node;
  }

  // ============================================
  // 1. NAVIGATION MODULE
  // ============================================

  function initNavigation() {
    // Smooth scroll on nav-link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          // Close mobile menu
          const navMenu = document.getElementById('nav-menu');
          if (navMenu) navMenu.classList.remove('open');
        }
      });
    });

    // Intersection Observer to highlight active nav item on scroll
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            document.querySelectorAll('.nav-link').forEach(link => {
              link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
          }
        });
      }, { rootMargin: '-20% 0px -60% 0px' });
      sections.forEach(section => observer.observe(section));
    }

    // Mobile hamburger toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) navMenu.classList.toggle('open');
        hamburger.classList.toggle('active');
      });
    }

    // Sticky header shadow on scroll
    const nav = document.getElementById('main-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
    }
  }

  // ============================================
  // 2. WORKSHOP TABS MODULE
  // ============================================

  function initWorkshopTabs() {
    const tabs = document.querySelectorAll('.stage-tab');
    const panels = document.querySelectorAll('.stage-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const stage = tab.dataset.stage;
        if (!stage) return;
        tabs.forEach(t => t.classList.toggle('active', t.dataset.stage === stage));
        panels.forEach(p => {
          const isActive = p.dataset.stage === stage;
          p.classList.toggle('active', isActive);
          p.hidden = !isActive;
        });
      });
    });

    // Initially hide non-active panels
    panels.forEach(p => {
      if (!p.classList.contains('active')) p.hidden = true;
    });
  }

  // ============================================
  // 3. STAGE 1 - CARNET MODULE
  // ============================================
  // HTML has pre-built fields in #carnet-quick-fields and #carnet-standard-fields
  // Toggle visibility based on radio selection

  function initStage1() {
    const quickFields = document.getElementById('carnet-quick-fields');
    const standardFields = document.getElementById('carnet-standard-fields');
    const modeRadios = document.querySelectorAll('input[name="carnet-mode"]');

    if (!quickFields || !standardFields || modeRadios.length === 0) return;

    function switchMode(mode) {
      quickFields.style.display = mode === 'quick' ? '' : 'none';
      standardFields.style.display = mode === 'standard' ? '' : 'none';
    }

    modeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        switchMode(radio.value);
        debouncedSave();
      });
    });

    // Set initial state
    const checkedRadio = document.querySelector('input[name="carnet-mode"]:checked');
    if (checkedRadio) switchMode(checkedRadio.value);
  }

  // ============================================
  // 4. STAGE 2 - COMPLEXITY CALCULATOR
  // ============================================
  // HTML has pre-built quiz questions with names complexity-q1 through complexity-q5

  const COMPLEXITY_QUESTIONS = [
    { name: 'complexity-q1', yesLevel: 1 },
    { name: 'complexity-q2', yesLevel: 2 },
    { name: 'complexity-q3', yesLevel: 3 },
    { name: 'complexity-q4', yesLevel: 4 },
    { name: 'complexity-q5', yesLevel: 5 }
  ];

  const COMPLEXITY_LEVELS = {
    0: { name: '尚未評估',         metaphor: '',             description: '' },
    1: { name: 'Lv1：個人工作室',  metaphor: '自家書桌',     description: '只有你自己使用的工具，資料存在本機端。' },
    2: { name: 'Lv2：私人辦公室',  metaphor: '公司辦公室',   description: '同一組織的人使用，需要登入和權限分級。' },
    3: { name: 'Lv3：服務門市',    metaphor: '便利商店',     description: '有前台和後台之分，內外角色不同。' },
    4: { name: 'Lv4：大眾運動場',  metaphor: '開放運動中心', description: '大量用戶互動，需處理併發和用戶資產。' },
    5: { name: 'Lv5：數位百貨商場', metaphor: '百貨商場',     description: '多租戶系統，三層角色，資料完全隔離。' }
  };

  function initStage2() {
    const quizGroup = document.querySelector('.quiz-group');
    if (!quizGroup) return;

    quizGroup.addEventListener('change', () => {
      calculateComplexity();
      debouncedSave();
    });
  }

  function calculateComplexity() {
    let resultLevel = 0;
    const answers = [];

    for (let i = 0; i < COMPLEXITY_QUESTIONS.length; i++) {
      const q = COMPLEXITY_QUESTIONS[i];
      const checked = document.querySelector(`input[name="${q.name}"]:checked`);
      if (!checked) { answers.push(null); break; }

      const val = checked.value === 'yes';
      answers.push(val);

      if (val) {
        resultLevel = q.yesLevel;
        // Disable subsequent questions
        for (let j = i + 1; j < COMPLEXITY_QUESTIONS.length; j++) {
          document.querySelectorAll(`input[name="${COMPLEXITY_QUESTIONS[j].name}"]`).forEach(r => {
            r.checked = false;
            r.disabled = true;
            r.closest('.quiz-question')?.classList.add('disabled');
          });
        }
        break;
      } else {
        // Enable next question
        if (i + 1 < COMPLEXITY_QUESTIONS.length) {
          document.querySelectorAll(`input[name="${COMPLEXITY_QUESTIONS[i + 1].name}"]`).forEach(r => {
            r.disabled = false;
            r.closest('.quiz-question')?.classList.remove('disabled');
          });
        }
        // If all answered "no", level is 5
        if (i === COMPLEXITY_QUESTIONS.length - 1) resultLevel = 5;
      }
    }

    // Update result display
    const resultDiv = document.getElementById('complexity-result');
    const resultText = document.getElementById('complexity-result-text');
    if (resultDiv && resultText) {
      if (resultLevel > 0) {
        const level = COMPLEXITY_LEVELS[resultLevel];
        resultText.textContent = `${level.name}（${level.metaphor}）— ${level.description}`;
        resultDiv.style.display = '';
      } else {
        resultDiv.style.display = 'none';
      }
    }

    return { level: resultLevel, answers };
  }

  // ============================================
  // 5. STAGE 4 - USER STORIES + MOSCOW
  // ============================================

  function initStage4() {
    const addBtn = document.getElementById('btn-add-story');
    const listContainer = document.getElementById('userstory-list');
    if (!addBtn || !listContainer) return;

    addBtn.addEventListener('click', () => addStoryFromTemplate(listContainer));

    listContainer.addEventListener('click', e => {
      const removeBtn = e.target.closest('.btn-remove-story');
      if (removeBtn) {
        removeBtn.closest('.userstory-item')?.remove();
        debouncedSave();
      }
    });

    listContainer.addEventListener('input', debounce(() => saveFromForm(), 1000));
    listContainer.addEventListener('change', debounce(() => saveFromForm(), 500));
  }

  function addStoryFromTemplate(container, data = {}) {
    const template = document.getElementById('userstory-template');
    if (!template) return;

    const clone = template.content.cloneNode(true);
    const item = clone.querySelector('.userstory-item');
    if (!item) return;

    // Set number
    const numEl = item.querySelector('.userstory-number');
    if (numEl) numEl.textContent = `Story #${container.children.length + 1}`;

    // Fill data if restoring
    if (data.role) {
      const roleInput = item.querySelector('.story-role');
      if (roleInput) roleInput.value = data.role;
    }
    if (data.feature) {
      const featureInput = item.querySelector('.story-feature');
      if (featureInput) featureInput.value = data.feature;
    }
    if (data.value) {
      const valueInput = item.querySelector('.story-value');
      if (valueInput) valueInput.value = data.value;
    }
    if (data.criteria) {
      const criteriaInput = item.querySelector('.story-criteria');
      if (criteriaInput) criteriaInput.value = data.criteria;
    }
    if (data.moscow) {
      const moscowSelect = item.querySelector('.moscow-select');
      if (moscowSelect) moscowSelect.value = data.moscow;
    }

    container.appendChild(clone);
  }

  function collectStories() {
    const stories = [];
    document.querySelectorAll('#userstory-list .userstory-item').forEach(item => {
      stories.push({
        role:     item.querySelector('.story-role')?.value     || '',
        feature:  item.querySelector('.story-feature')?.value  || '',
        value:    item.querySelector('.story-value')?.value    || '',
        criteria: item.querySelector('.story-criteria')?.value || '',
        moscow:   item.querySelector('.moscow-select')?.value  || ''
      });
    });
    return stories;
  }

  // ============================================
  // 6. STAGE 5 - EARS REQUIREMENTS
  // ============================================

  const EARS_TYPES = {
    ubiquitous: { label: '隨時作用型', template: '系統應該要 ___' },
    event:      { label: '事件驅動型', template: '當 ___ 時，系統應該要 ___' },
    unwanted:   { label: '異常處理型', template: '如果 ___，那麼系統應該要 ___' },
    state:      { label: '狀態驅動型', template: '當處於 ___ 時，系統應該要 ___' },
    optional:   { label: '選配功能型', template: '如果系統包含 ___，系統應該要 ___' }
  };

  function initStage5() {
    const addBtn = document.getElementById('btn-add-ears');
    const listContainer = document.getElementById('ears-list');
    if (!addBtn || !listContainer) return;

    addBtn.addEventListener('click', () => addEarsFromTemplate(listContainer));

    listContainer.addEventListener('click', e => {
      const removeBtn = e.target.closest('.btn-remove-ears');
      if (removeBtn) {
        removeBtn.closest('.ears-item')?.remove();
        debouncedSave();
      }
    });

    // Update placeholder when type changes
    listContainer.addEventListener('change', e => {
      const select = e.target.closest('.ears-type-select');
      if (select) {
        const item = select.closest('.ears-item');
        const textarea = item?.querySelector('.ears-content');
        const hint = item?.querySelector('.ears-hint');
        const typeInfo = EARS_TYPES[select.value];
        if (textarea && typeInfo && !textarea.value.trim()) {
          textarea.placeholder = typeInfo.template;
        }
        if (hint && typeInfo) {
          hint.textContent = `句型：${typeInfo.template}`;
        }
      }
      debounce(() => saveFromForm(), 500)();
    });

    listContainer.addEventListener('input', debounce(() => saveFromForm(), 1000));
  }

  function addEarsFromTemplate(container, data = {}) {
    const template = document.getElementById('ears-template');
    if (!template) return;

    const clone = template.content.cloneNode(true);
    const item = clone.querySelector('.ears-item');
    if (!item) return;

    // Fill data if restoring
    if (data.type) {
      const typeSelect = item.querySelector('.ears-type-select');
      if (typeSelect) typeSelect.value = data.type;
    }
    if (data.sentence) {
      const textarea = item.querySelector('.ears-content');
      if (textarea) textarea.value = data.sentence;
    }
    // Set hint
    const hint = item.querySelector('.ears-hint');
    const typeInfo = EARS_TYPES[data.type || 'ubiquitous'];
    if (hint && typeInfo) {
      hint.textContent = `句型：${typeInfo.template}`;
    }

    container.appendChild(clone);
  }

  function collectRequirements() {
    const reqs = [];
    document.querySelectorAll('#ears-list .ears-item').forEach(item => {
      reqs.push({
        type:     item.querySelector('.ears-type-select')?.value || 'ubiquitous',
        sentence: item.querySelector('.ears-content')?.value     || ''
      });
    });
    return reqs;
  }

  // ============================================
  // 7. LOCALSTORAGE MODULE
  // ============================================

  const STORAGE_KEY = 'vibe-req-sessions';
  const SESSION_KEY = 'vibe-req-current-session';

  function createNewSession() {
    return {
      id: crypto.randomUUID(),
      name: '未命名專案',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stages: {
        1: { mode: 'quick' },
        2: { level: 0, answers: [] },
        3: {},
        4: { stories: [] },
        5: { requirements: [] }
      }
    };
  }

  function getAllSessions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function getSession(id) {
    return getAllSessions().find(s => s.id === id) || null;
  }

  function saveSession(session) {
    session.updatedAt = new Date().toISOString();
    const sessions = getAllSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) sessions[idx] = session;
    else sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  function deleteSession(id) {
    const sessions = getAllSessions().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    if (getCurrentSessionId() === id) sessionStorage.removeItem(SESSION_KEY);
  }

  function getCurrentSessionId() {
    return sessionStorage.getItem(SESSION_KEY);
  }

  function setCurrentSessionId(id) {
    sessionStorage.setItem(SESSION_KEY, id);
  }

  function getCurrentSession() {
    const id = getCurrentSessionId();
    return id ? getSession(id) : null;
  }

  // Collect all form data into session object
  function collectFormData() {
    const session = getCurrentSession() || createNewSession();

    // Stage 1 - CARNET
    const modeRadio = document.querySelector('input[name="carnet-mode"]:checked');
    session.stages[1] = session.stages[1] || {};
    session.stages[1].mode = modeRadio?.value || 'quick';
    document.querySelectorAll('[data-stage="1"][data-field]').forEach(input => {
      if (input.name === 'carnet-mode') return; // skip mode radios
      session.stages[1][input.dataset.field] = input.value;
    });

    // Stage 2 - Complexity
    const complexityResult = calculateComplexity();
    session.stages[2] = { level: complexityResult.level, answers: complexityResult.answers };

    // Stage 3 - Product Layers
    session.stages[3] = session.stages[3] || {};
    document.querySelectorAll('[data-stage="3"][data-field]').forEach(input => {
      session.stages[3][input.dataset.field] = input.value;
    });

    // Stage 4 - User Stories
    session.stages[4] = { stories: collectStories() };

    // Stage 5 - EARS Requirements
    session.stages[5] = { requirements: collectRequirements() };

    // Session name
    const nameInput = document.getElementById('session-name');
    if (nameInput && nameInput.value.trim()) session.name = nameInput.value.trim();

    return session;
  }

  function saveFromForm() {
    const session = collectFormData();
    saveSession(session);
  }

  const debouncedSave = debounce(() => saveFromForm(), 1000);

  function loadSessionToForm(session) {
    if (!session) return;
    setCurrentSessionId(session.id);

    // Session name
    const nameInput = document.getElementById('session-name');
    if (nameInput) nameInput.value = session.name || '未命名專案';

    // Stage 1 - CARNET
    const s1 = session.stages?.[1] || {};
    const mode = s1.mode || 'quick';
    const modeRadio = document.querySelector(`input[name="carnet-mode"][value="${mode}"]`);
    if (modeRadio) {
      modeRadio.checked = true;
      modeRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    // Fill field values
    setTimeout(() => {
      document.querySelectorAll('[data-stage="1"][data-field]').forEach(input => {
        if (input.name === 'carnet-mode') return;
        if (s1[input.dataset.field] !== undefined) input.value = s1[input.dataset.field];
      });
    }, 0);

    // Stage 2 - Complexity
    const s2 = session.stages?.[2] || {};
    // Reset all quiz radios first
    COMPLEXITY_QUESTIONS.forEach(q => {
      document.querySelectorAll(`input[name="${q.name}"]`).forEach(r => {
        r.disabled = false;
        r.checked = false;
        r.closest('.quiz-question')?.classList.remove('disabled');
      });
    });
    // Restore answers
    if (s2.answers && s2.answers.length > 0) {
      s2.answers.forEach((answer, i) => {
        if (answer !== null && i < COMPLEXITY_QUESTIONS.length) {
          const val = answer ? 'yes' : 'no';
          const radio = document.querySelector(`input[name="${COMPLEXITY_QUESTIONS[i].name}"][value="${val}"]`);
          if (radio) radio.checked = true;
        }
      });
      calculateComplexity();
    }

    // Stage 3 - Product Layers
    const s3 = session.stages?.[3] || {};
    document.querySelectorAll('[data-stage="3"][data-field]').forEach(input => {
      input.value = s3[input.dataset.field] || '';
    });

    // Stage 4 - User Stories
    const listContainer = document.getElementById('userstory-list');
    if (listContainer) {
      listContainer.textContent = '';
      (session.stages?.[4]?.stories || []).forEach(story => addStoryFromTemplate(listContainer, story));
    }

    // Stage 5 - EARS Requirements
    const earsList = document.getElementById('ears-list');
    if (earsList) {
      earsList.textContent = '';
      (session.stages?.[5]?.requirements || []).forEach(req => addEarsFromTemplate(earsList, req));
    }
  }

  function initLocalStorage() {
    let session = getCurrentSession();
    if (!session) {
      const sessions = getAllSessions();
      if (sessions.length > 0) {
        sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        session = sessions[0];
      } else {
        session = createNewSession();
        saveSession(session);
      }
      setCurrentSessionId(session.id);
    }
    loadSessionToForm(session);

    // Auto-save on input change (debounced)
    const workshopSection = document.getElementById('section-workshop');
    if (workshopSection) {
      workshopSection.addEventListener('input', debouncedSave);
      workshopSection.addEventListener('change', debouncedSave);
    }
  }

  // ============================================
  // 8. EXPORT MODULE
  // ============================================

  function generateMarkdown(session) {
    const s1 = session.stages?.[1] || {};
    const s2 = session.stages?.[2] || {};
    const s3 = session.stages?.[3] || {};
    const s4 = session.stages?.[4] || {};
    const s5 = session.stages?.[5] || {};
    const level = s2.level || 0;
    const levelInfo = COMPLEXITY_LEVELS[level] || COMPLEXITY_LEVELS[0];

    let md = `# 需求文件：${session.name}\n\n`;

    // 1. Product Overview (CARNET)
    md += `## 1. 產品概述\n\n`;
    if (s1.summary)    md += `**核心想法**：${s1.summary}\n\n`;
    if (s1.need)       md += `**需求來源（N）**：${s1.need}\n\n`;
    if (s1.aspiration) md += `**期待成果（A）**：${s1.aspiration}\n\n`;
    if (s1.constraint) md += `**限制條件（C）**：${s1.constraint}\n\n`;
    if (s1.role)       md += `**目標用戶（R）**：${s1.role}\n\n`;
    if (s1.experience) md += `**過往經驗（E）**：${s1.experience}\n\n`;
    if (s1.trust)      md += `**核心信念（T）**：${s1.trust}\n\n`;

    // 2. Complexity Assessment
    md += `## 2. 複雜度評估\n\n`;
    if (level > 0) {
      md += `**${levelInfo.name}**\n\n`;
      md += `${levelInfo.description}\n\n`;
      md += generateComplexityDetails(level);
    } else {
      md += `尚未評估。\n\n`;
    }

    // 3. Product Layers
    md += `## 3. 產品分層思考\n\n`;
    const layerNames = { strategy: '戰略層', scope: '範圍層', structure: '結構層', skeleton: '框架層', surface: '表現層' };
    let hasLayers = false;
    for (const [key, label] of Object.entries(layerNames)) {
      if (s3[key]) {
        md += `**${label}**：${s3[key]}\n\n`;
        hasLayers = true;
      }
    }
    if (!hasLayers) md += `尚未填寫。\n\n`;

    // 4. Core User Stories (ordered by MoSCoW)
    md += `## 4. 核心 User Stories\n\n`;
    const stories = s4.stories || [];
    const priorityOrder = ['must', 'should', 'could', 'wont', ''];
    const sorted = [...stories].sort((a, b) =>
      priorityOrder.indexOf(a.moscow || '') - priorityOrder.indexOf(b.moscow || '')
    );
    if (sorted.length === 0) {
      md += `尚未填寫。\n\n`;
    } else {
      sorted.forEach((story, i) => {
        const label = story.moscow ? story.moscow.toUpperCase() : '未分級';
        md += `### Story ${i + 1}（${label}）\n\n`;
        md += '```\n';
        md += `作為${story.role || '___'}，\n`;
        md += `我想要${story.feature || '___'}，\n`;
        md += `以便於${story.value || '___'}。\n`;
        if (story.criteria) md += `\n驗收標準：\n${story.criteria}\n`;
        md += '```\n\n';
      });
    }

    // 5. Architecture Suggestion
    md += `## 5. 系統架構建議\n\n`;
    md += generateArchitectureSuggestion(level);

    // 6. Edge Cases
    md += `## 6. Edge Cases 清單\n\n`;
    const edgeCases = extractEdgeCases(stories);
    edgeCases.forEach(ec => { md += `- ${ec}\n`; });
    md += '\n';

    // 7. EARS Requirements (grouped by type)
    md += `## 7. EARS 格式需求\n\n`;
    const reqs = s5.requirements || [];
    if (reqs.length === 0) {
      md += `尚未填寫。\n\n`;
    } else {
      const grouped = {};
      reqs.forEach(r => {
        const key = r.type || 'ubiquitous';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(r);
      });
      Object.entries(EARS_TYPES).forEach(([key, info]) => {
        if (grouped[key]?.length > 0) {
          md += `**${info.label}：**\n`;
          grouped[key].forEach(r => { if (r.sentence.trim()) md += `- ${r.sentence}\n`; });
          md += '\n';
        }
      });
    }

    // 8. Non-functional Requirements
    md += `## 8. 非功能性需求\n\n`;
    md += generateNonFunctionalRequirements(level);

    // 9. Technology Suggestion
    md += `## 9. 建議技術選型\n\n`;
    md += generateTechSuggestion(level);

    md += `---\n\n*此文件由 Vibe Requirements 互動工作坊產出，可直接作為 AI 開發的起點。*\n`;
    return md;
  }

  function generateComplexityDetails(level) {
    const map = {
      1: '這是最簡單的「自用工具」——不需要登入、不需要伺服器，資料存在本機就好。\n\n',
      2: '這是一個「內部系統」——同一組織的人共用，需要身分驗證和權限分級。\n\n',
      3: '這是一個典型的「內外有別」系統——有服務提供方和接受方，需要前台和後台。\n\n',
      4: '這是一個「開放平台」——大量用戶同時操作、互相互動，需要處理併發和用戶資產。\n\n',
      5: '這是最複雜的「多租戶系統」——有平台方、入駐商家、終端用戶三層角色。\n\n'
    };
    return map[level] || '';
  }

  function generateArchitectureSuggestion(level) {
    if (level <= 0) return '請先完成複雜度評估。\n\n';
    const map = {
      1: '作為 Lv1 系統，保持簡單即可：\n\n- 純前端即可完成，不需要後端伺服器\n- 資料存在 localStorage 或 IndexedDB\n- 專注於功能實現和介面易用性\n\n',
      2: '作為 Lv2 系統，重點放在**權限管理**：\n\n- 需要簡單的後端和資料庫\n- 設計清楚的角色與權限矩陣\n- 資料存在伺服器端，多人共用\n\n',
      3: '作為 Lv3 系統，重點放在**前後台的關注點分離**和**統一的資料介面**：\n\n- **關注點分離**：前台重體驗與動線引導，後台重效率與防呆\n- **統一介面**：前後台共用同一組 API，依角色回傳不同資料\n- **封裝**：各功能模組獨立，互不影響\n\n',
      4: '作為 Lv4 系統，重點放在**解耦**和**可擴展性**：\n\n- 用戶資產管理需要獨立的服務\n- 需要處理高併發和資源競爭\n- 內容審核和通知系統需獨立模組\n\n',
      5: '作為 Lv5 系統，五大設計原則都很重要：\n\n- **資料隔離**：每個租戶的資料完全隔離\n- **分層架構**：平台層、租戶層、終端用戶層各自獨立\n- **可客製化**：每個租戶可以調整自己的設定\n- **計費系統**：訂閱管理和用量計費\n\n'
    };
    return map[level] || '';
  }

  function extractEdgeCases(stories) {
    const cases = [];
    stories.forEach(story => {
      if (!story.criteria) return;
      story.criteria.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed.match(/如果|若|超時|失敗|錯誤|異常|斷|沒有|不存在|取消|過期|重複/)) {
          cases.push(trimmed.replace(/^\d+\.\s*/, ''));
        }
      });
    });
    if (cases.length === 0) {
      cases.push('使用者操作過程中網路中斷，該如何處理？');
      cases.push('同時有多人操作同一筆資料，是否需要防止衝突？');
      cases.push('使用者輸入的資料格式不正確時，如何提示？');
    }
    return cases;
  }

  function generateNonFunctionalRequirements(level) {
    if (level <= 0) return '請先完成複雜度評估。\n\n';
    let md = '- **可維護性**：程式碼需有基本註解和模組化結構\n';
    if (level >= 2) {
      md += '- **安全性**：涉及使用者帳號，需 HTTPS 加密、密碼雜湊儲存\n';
      md += '- **資料備份**：定期備份資料庫\n';
    }
    if (level >= 3) {
      md += '- **效能**：API 回應時間應在 3 秒以內\n';
      md += '- **可用性**：服務需有基本的錯誤恢復機制\n';
    }
    if (level >= 4) {
      md += '- **可擴展性**：需考慮水平擴展能力\n';
      md += '- **監控**：需要基本的系統監控和告警\n';
    }
    if (level >= 5) {
      md += '- **多租戶隔離**：不同租戶的資料必須完全隔離\n';
      md += '- **計費準確性**：用量計算和扣費必須正確無誤\n';
    }
    return md + '\n';
  }

  function generateTechSuggestion(level) {
    if (level <= 0) return '請先完成複雜度評估。\n\n';
    const stacks = {
      1: [['前端','純 HTML/CSS/JS 或 React','簡單快速，不需要伺服器'],['儲存','localStorage / IndexedDB','資料存在本機端即可'],['部署','Vercel / GitHub Pages','靜態網站部署']],
      2: [['前端','React / Vue','組件化開發，方便維護'],['後端','Supabase / Firebase','快速建立帳號系統和資料庫'],['資料庫','PostgreSQL（Supabase 內建）','關聯式資料庫，適合權限管理'],['部署','Vercel + Supabase','整合度高，適合小團隊']],
      3: [['前端','React + Next.js','前後台可用不同 layout'],['後端','Node.js + Express','靈活的 API 設計'],['資料庫','PostgreSQL','穩定的關聯式資料庫'],['部署','Vercel（前端）+ Railway（後端）','適合小團隊快速上線']],
      4: [['前端','React + Next.js','支援 SSR 和靜態生成'],['後端','Node.js + Express','支援 WebSocket 即時通訊'],['資料庫','PostgreSQL + Redis','主資料庫 + 快取'],['即時通訊','Socket.io','用戶間即時互動'],['部署','雲端平台 + CDN','應對高流量']],
      5: [['前端','React + Next.js','支援多租戶路由'],['後端','Node.js 微服務','各功能獨立部署'],['資料庫','PostgreSQL + 租戶隔離策略','每租戶獨立 schema 或 row-level'],['快取','Redis','分散式快取和 session 管理'],['計費','串接 Stripe / 自建','訂閱和用量計費'],['部署','Kubernetes / Docker','容器化部署，方便擴展']]
    };
    const stack = stacks[level] || stacks[1];
    let md = `作為 Lv${level} 系統，建議方向：\n\n| 層面 | 建議 | 理由 |\n|------|------|------|\n`;
    stack.forEach(([a, b, c]) => { md += `| ${a} | ${b} | ${c} |\n`; });
    return md + '\n';
  }

  function copyToClipboard(text) {
    return navigator.clipboard.writeText(text).then(() => {
      showToast('已複製到剪貼簿！', 'success');
    }).catch(() => {
      showToast('複製失敗，請手動複製。', 'error');
    });
  }

  function downloadMarkdown(filename, content) {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'requirements.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('已下載需求文件！', 'success');
  }

  function initExport() {
    // Wire up HTML buttons: #btn-save-session, #btn-export-md
    const btnSave = document.getElementById('btn-save-session');
    const btnExport = document.getElementById('btn-export-md');

    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const session = collectFormData();
        saveSession(session);
        renderRecordsList();
        showToast('已儲存紀錄！', 'success');
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const session = collectFormData();
        saveSession(session);
        const md = generateMarkdown(session);
        const safeName = (session.name || '需求文件').replace(/[^\w\u4e00-\u9fff-]/g, '_');
        downloadMarkdown(`${safeName}.md`, md);
      });
    }
  }

  // ============================================
  // 9. RECORDS UI MODULE
  // ============================================

  function initRecords() {
    const recordsList = document.getElementById('records-list');
    const btnNew = document.getElementById('btn-new-session');

    if (btnNew) {
      btnNew.addEventListener('click', () => {
        const session = createNewSession();
        saveSession(session);
        setCurrentSessionId(session.id);
        loadSessionToForm(session);
        renderRecordsList();
        showToast('已建立新專案！', 'success');
        switchToWorkshop();
      });
    }

    if (recordsList) {
      renderRecordsList();

      recordsList.addEventListener('click', e => {
        const loadBtn = e.target.closest('.btn-load-session');
        const deleteBtn = e.target.closest('.btn-delete-session');

        if (loadBtn) {
          const session = getSession(loadBtn.dataset.sessionId);
          if (session) {
            loadSessionToForm(session);
            renderRecordsList();
            showToast(`已載入「${session.name}」`, 'success');
            switchToWorkshop();
          }
        }

        if (deleteBtn) {
          const id = deleteBtn.dataset.sessionId;
          const session = getSession(id);
          if (session && confirm(`確定要刪除「${session.name}」嗎？此操作無法復原。`)) {
            deleteSession(id);
            renderRecordsList();
            if (getCurrentSessionId() === id || !getCurrentSessionId()) {
              const ns = createNewSession();
              saveSession(ns);
              setCurrentSessionId(ns.id);
              loadSessionToForm(ns);
            }
            showToast('已刪除紀錄。', 'info');
          }
        }
      });

      recordsList.addEventListener('input', e => {
        const nameInput = e.target.closest('.record-name-input');
        if (!nameInput) return;
        const id = nameInput.dataset.sessionId;
        const session = getSession(id);
        if (session) {
          session.name = nameInput.value.trim() || '未命名專案';
          saveSession(session);
          if (id === getCurrentSessionId()) {
            const mainInput = document.getElementById('session-name');
            if (mainInput) mainInput.value = session.name;
          }
        }
      });
    }
  }

  function renderRecordsList() {
    const recordsList = document.getElementById('records-list');
    if (!recordsList) return;

    const sessions = getAllSessions();
    sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    recordsList.textContent = '';

    if (sessions.length === 0) {
      recordsList.appendChild(el('p', { className: 'records-empty', textContent: '目前沒有儲存的紀錄。開始你的第一次需求探索吧！' }));
      return;
    }

    sessions.forEach(session => {
      const level = session.stages?.[2]?.level || 0;
      const levelInfo = COMPLEXITY_LEVELS[level];
      const date = new Date(session.updatedAt).toLocaleDateString('zh-TW', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      const isCurrent = session.id === getCurrentSessionId();

      const card = el('div', { className: `record-card${isCurrent ? ' current' : ''}` });

      // Info section
      const info = el('div', { className: 'record-info' });
      const nameInput = el('input', { type: 'text', className: 'record-name-input', value: session.name, 'data-session-id': session.id, 'aria-label': '專案名稱' });
      info.appendChild(nameInput);
      info.appendChild(el('span', { className: 'record-date', textContent: date }));
      if (level > 0) {
        info.appendChild(el('span', { className: `record-badge level-${level}`, textContent: levelInfo.name }));
      }
      if (isCurrent) {
        info.appendChild(el('span', { className: 'record-current-badge', textContent: '目前' }));
      }
      card.appendChild(info);

      // Actions
      const actions = el('div', { className: 'record-actions' });
      actions.appendChild(el('button', { className: 'btn btn-sm btn-secondary btn-load-session', 'data-session-id': session.id, textContent: '載入' }));
      actions.appendChild(el('button', { className: 'btn btn-sm btn-danger btn-delete-session', 'data-session-id': session.id, textContent: '刪除' }));
      card.appendChild(actions);

      recordsList.appendChild(card);
    });
  }

  function switchToWorkshop() {
    const link = document.querySelector('.nav-link[href="#section-workshop"]');
    if (link) { link.click(); return; }
    const ws = document.getElementById('section-workshop');
    if (ws) ws.scrollIntoView({ behavior: 'smooth' });
  }

  // ============================================
  // 10. TOAST MODULE
  // ============================================

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = el('div', { id: 'toast-container' });
      document.body.appendChild(container);
    }

    const toast = el('div', { className: `toast toast-${type}`, role: 'alert', textContent: message });
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  // ============================================
  // 11. INIT
  // ============================================

  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initWorkshopTabs();
    initStage1();
    initStage2();
    initStage4();
    initStage5();
    initLocalStorage();
    initRecords();
    initExport();
  });

})();
