// ============================================
// Vibe Requirements - Interactive Workshop App
// Vanilla JS, no external dependencies
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

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /** Create an element with attributes and children using safe DOM APIs */
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
          document.querySelector('.nav-mobile')?.classList.remove('active');
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
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.addEventListener('click', () => {
        const nav = document.querySelector('.nav-mobile');
        if (nav) nav.classList.toggle('active');
        hamburger.classList.toggle('active');
      });
    }

    // Sticky header shadow on scroll
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
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
          p.classList.toggle('active', p.dataset.stage === stage);
          p.hidden = p.dataset.stage !== stage;
        });
      });
    });
  }

  // ============================================
  // 3. STAGE 1 - CARNET MODULE
  // ============================================

  const CARNET_FIELDS = {
    quick: ['need', 'aspiration', 'constraint'],
    standard: ['constraint', 'aspiration', 'role', 'need', 'experience', 'trust']
  };

  const CARNET_LABELS = {
    constraint:  { letter: 'C', label: 'Constraint（限制）',  placeholder: '專案的預算、時間、技術限制是什麼？' },
    aspiration:  { letter: 'A', label: 'Aspiration（期待）',  placeholder: '做完之後理想的結果是什麼？' },
    role:        { letter: 'R', label: 'Role（身份）',        placeholder: '你是為誰做這個？目標用戶是誰？' },
    need:        { letter: 'N', label: 'Need（需求來源）',    placeholder: '這個需求是怎麼來的？為什麼現在要做？' },
    experience:  { letter: 'E', label: 'Experience（經驗）',  placeholder: '之前有做過類似的嗎？學到什麼教訓？' },
    trust:       { letter: 'T', label: 'Trust（信念）',       placeholder: '你相信什麼樣的做法是對的？' }
  };

  function initStage1() {
    const container = document.querySelector('.stage-panel[data-stage="1"]');
    if (!container) return;

    const modeContainer = container.querySelector('.carnet-mode-toggle');
    const fieldsContainer = container.querySelector('.carnet-fields');
    if (!modeContainer || !fieldsContainer) return;

    modeContainer.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        modeContainer.querySelectorAll('[data-mode]').forEach(b =>
          b.classList.toggle('active', b.dataset.mode === mode)
        );
        renderCarnetFields(fieldsContainer, mode);
        restoreStage1Fields();
      });
    });

    const initialMode = modeContainer.querySelector('[data-mode].active')?.dataset.mode || 'quick';
    renderCarnetFields(fieldsContainer, initialMode);
  }

  function renderCarnetFields(container, mode) {
    const fields = CARNET_FIELDS[mode] || CARNET_FIELDS.quick;
    // Clear and rebuild using safe DOM methods
    container.textContent = '';
    container.dataset.currentMode = mode;

    fields.forEach(field => {
      const info = CARNET_LABELS[field];
      const wrapper = el('div', { className: 'carnet-field' });

      const label = el('label', { className: 'carnet-label' }, [
        el('span', { className: 'carnet-letter', textContent: info.letter }),
        ` ${info.label}`
      ]);

      const textarea = el('textarea', {
        className: 'form-textarea',
        'data-stage': '1',
        'data-field': field,
        placeholder: info.placeholder,
        rows: '3'
      });

      wrapper.appendChild(label);
      wrapper.appendChild(textarea);
      container.appendChild(wrapper);
    });
  }

  function restoreStage1Fields() {
    const session = getCurrentSession();
    if (!session) return;
    const stageData = session.stages[1] || {};
    document.querySelectorAll('[data-stage="1"][data-field]').forEach(input => {
      const val = stageData[input.dataset.field];
      if (val !== undefined) input.value = val;
    });
  }

  // ============================================
  // 4. STAGE 2 - COMPLEXITY CALCULATOR
  // ============================================

  const COMPLEXITY_QUESTIONS = [
    { id: 'q1', text: '只有你自己用嗎？',                                     yesLevel: 1 },
    { id: 'q2', text: '使用者都是同一個組織內部的人嗎？',                       yesLevel: 2 },
    { id: 'q3', text: '有「服務提供方」和「服務接受方」的區別嗎？',             yesLevel: 3 },
    { id: 'q4', text: '所有用戶都是平等的，可以互相互動嗎？',                   yesLevel: 4 },
    { id: 'q5', text: '會有「第三方入駐」，每個入駐方有自己的客戶嗎？',         yesLevel: 5 }
  ];

  const COMPLEXITY_LEVELS = {
    0: { name: '尚未評估',         metaphor: '',           description: '' },
    1: { name: 'Lv1：個人工作室',  metaphor: '自家書桌',   description: '只有你自己使用的工具，資料存在本機端。' },
    2: { name: 'Lv2：私人辦公室',  metaphor: '公司辦公室', description: '同一組織的人使用，需要登入和權限分級。' },
    3: { name: 'Lv3：服務門市',    metaphor: '便利商店',   description: '有前台和後台之分，內外角色不同。' },
    4: { name: 'Lv4：大眾運動場',  metaphor: '開放運動中心', description: '大量用戶互動，需處理併發和用戶資產。' },
    5: { name: 'Lv5：數位百貨商場', metaphor: '百貨商場',   description: '多租戶系統，三層角色，資料完全隔離。' }
  };

  function initStage2() {
    const container = document.querySelector('.stage-panel[data-stage="2"]');
    if (!container) return;

    const questionsContainer = container.querySelector('.complexity-questions');
    if (!questionsContainer) return;

    // Build questions using safe DOM methods
    questionsContainer.textContent = '';
    COMPLEXITY_QUESTIONS.forEach((q, i) => {
      const qDiv = el('div', { className: 'complexity-question', 'data-question': String(i) });
      qDiv.appendChild(el('p', { className: 'question-text', textContent: `${i + 1}. ${q.text}` }));

      const options = el('div', { className: 'question-options' });
      ['yes', 'no'].forEach(val => {
        const lbl = el('label', { className: 'radio-label' });
        const radio = el('input', { type: 'radio', name: `complexity-q${i}`, value: val, 'data-stage': '2', 'data-question': String(i) });
        lbl.appendChild(radio);
        lbl.appendChild(el('span', { className: 'radio-mark' }));
        lbl.appendChild(document.createTextNode(val === 'yes' ? ' 是' : ' 否'));
        options.appendChild(lbl);
      });
      qDiv.appendChild(options);
      questionsContainer.appendChild(qDiv);
    });

    questionsContainer.addEventListener('change', () => calculateComplexity(container));
  }

  function calculateComplexity(container) {
    const answers = [];
    let resultLevel = 0;

    for (let i = 0; i < COMPLEXITY_QUESTIONS.length; i++) {
      const checked = container.querySelector(`input[name="complexity-q${i}"]:checked`);
      if (!checked) { answers.push(null); break; }

      const val = checked.value === 'yes';
      answers.push(val);

      if (val) {
        resultLevel = COMPLEXITY_QUESTIONS[i].yesLevel;
        disableQuestionsAfter(container, i);
        break;
      }
      enableQuestion(container, i + 1);

      if (i === COMPLEXITY_QUESTIONS.length - 1 && !val) resultLevel = 5;
    }

    // Update result display
    const resultContainer = container.querySelector('.complexity-result');
    if (resultContainer) {
      resultContainer.textContent = '';
      if (resultLevel > 0) {
        const level = COMPLEXITY_LEVELS[resultLevel];
        const badge = el('div', { className: `result-badge level-${resultLevel}` }, [
          el('span', { className: 'result-level', textContent: level.name }),
          el('span', { className: 'result-metaphor', textContent: `像是「${level.metaphor}」` })
        ]);
        resultContainer.appendChild(badge);
        resultContainer.appendChild(el('p', { className: 'result-description', textContent: level.description }));
        resultContainer.hidden = false;
      } else {
        resultContainer.hidden = true;
      }
    }

    // Store result
    const hiddenField = container.querySelector('[data-stage="2"][data-field="level"]');
    if (hiddenField) hiddenField.value = resultLevel;

    const session = getCurrentSession();
    if (session) {
      session.stages[2] = { level: resultLevel, answers };
      saveSession(session);
    }
  }

  function disableQuestionsAfter(container, index) {
    for (let i = index + 1; i < COMPLEXITY_QUESTIONS.length; i++) {
      const q = container.querySelector(`.complexity-question[data-question="${i}"]`);
      if (q) {
        q.classList.add('disabled');
        q.querySelectorAll('input[type="radio"]').forEach(r => { r.checked = false; r.disabled = true; });
      }
    }
  }

  function enableQuestion(container, index) {
    const q = container.querySelector(`.complexity-question[data-question="${index}"]`);
    if (q) {
      q.classList.remove('disabled');
      q.querySelectorAll('input[type="radio"]').forEach(r => { r.disabled = false; });
    }
  }

  // ============================================
  // 5. STAGE 3 - PRODUCT LAYERS
  // ============================================
  // Plain textareas with data-stage="3" data-field="strategy|scope|structure|skeleton|surface"
  // No special init needed; auto-save is handled by localStorage module.

  // ============================================
  // 6. STAGE 4 - USER STORIES + MOSCOW
  // ============================================

  let storyCounter = 0;

  function initStage4() {
    const container = document.querySelector('.stage-panel[data-stage="4"]');
    if (!container) return;

    const addBtn = container.querySelector('.btn-add-story');
    const listContainer = container.querySelector('.stories-list');
    if (!addBtn || !listContainer) return;

    addBtn.addEventListener('click', () => addStoryCard(listContainer));

    listContainer.addEventListener('click', e => {
      const removeBtn = e.target.closest('.btn-remove-story');
      if (removeBtn) {
        removeBtn.closest('.story-card')?.remove();
        saveFromForm();
      }
    });

    listContainer.addEventListener('input', debounce(() => saveFromForm(), 1000));
    listContainer.addEventListener('change', debounce(() => saveFromForm(), 500));
  }

  function addStoryCard(container, data = {}) {
    storyCounter++;
    const card = el('div', { className: 'story-card', 'data-story-id': String(data.id || storyCounter) });

    // Header
    const header = el('div', { className: 'story-header' });
    header.appendChild(el('span', { className: 'story-number', textContent: `Story #${container.children.length + 1}` }));
    const removeBtn = el('button', { type: 'button', className: 'btn-remove-story', 'aria-label': '移除此 Story', textContent: '\u00d7' });
    header.appendChild(removeBtn);
    card.appendChild(header);

    // Fields
    const fields = el('div', { className: 'story-fields' });

    const fieldDefs = [
      { key: 'role',       label: '作為（角色）',   tag: 'input',    placeholder: '例：一名飼主' },
      { key: 'want',       label: '我想要（功能）', tag: 'input',    placeholder: '例：搜尋附近的散步員' },
      { key: 'value',      label: '以便於（價值）', tag: 'input',    placeholder: '例：在我無法出門時，毛孩也能運動' },
      { key: 'acceptance', label: '驗收標準',       tag: 'textarea', placeholder: '1. ...\n2. ...\n3. ...' },
    ];

    fieldDefs.forEach(fd => {
      const row = el('div', { className: 'story-row' });
      row.appendChild(el('label', { className: 'form-label', textContent: fd.label }));
      const attrs = {
        className: fd.tag === 'textarea' ? 'form-textarea' : 'form-input',
        'data-story-field': fd.key,
        placeholder: fd.placeholder
      };
      if (fd.tag === 'textarea') attrs.rows = '3';
      const input = el(fd.tag, attrs);
      input.value = data[fd.key] || '';
      row.appendChild(input);
      fields.appendChild(row);
    });

    // Priority select
    const priorityRow = el('div', { className: 'story-row' });
    priorityRow.appendChild(el('label', { className: 'form-label', textContent: '優先級（MoSCoW）' }));
    const select = el('select', { className: 'form-select', 'data-story-field': 'priority' });
    [
      ['Must',   'Must（必須有）'],
      ['Should', 'Should（應該有）'],
      ['Could',  'Could（可以有）'],
      ["Won't",  "Won't（先不做）"]
    ].forEach(([val, text]) => {
      const opt = el('option', { value: val, textContent: text });
      if (data.priority === val) opt.selected = true;
      select.appendChild(opt);
    });
    priorityRow.appendChild(select);
    fields.appendChild(priorityRow);

    card.appendChild(fields);
    container.appendChild(card);
  }

  function collectStories() {
    const stories = [];
    document.querySelectorAll('.story-card').forEach(card => {
      stories.push({
        role:       card.querySelector('[data-story-field="role"]')?.value       || '',
        want:       card.querySelector('[data-story-field="want"]')?.value       || '',
        value:      card.querySelector('[data-story-field="value"]')?.value      || '',
        acceptance: card.querySelector('[data-story-field="acceptance"]')?.value || '',
        priority:   card.querySelector('[data-story-field="priority"]')?.value   || 'Must'
      });
    });
    return stories;
  }

  // ============================================
  // 7. STAGE 5 - EARS REQUIREMENTS
  // ============================================

  const EARS_TYPES = {
    ubiquitous: { label: '隨時作用型', template: '系統應該要 ___' },
    event:      { label: '事件驅動型', template: '當 ___ 時，系統應該要 ___' },
    unwanted:   { label: '異常處理型', template: '如果 ___，那麼系統應該要 ___' },
    state:      { label: '狀態驅動型', template: '當處於 ___ 時，系統應該要 ___' },
    optional:   { label: '選配功能型', template: '如果系統包含 ___，系統應該要 ___' }
  };

  let reqCounter = 0;

  function initStage5() {
    const container = document.querySelector('.stage-panel[data-stage="5"]');
    if (!container) return;

    const addBtn = container.querySelector('.btn-add-requirement');
    const listContainer = container.querySelector('.requirements-list');
    if (!addBtn || !listContainer) return;

    addBtn.addEventListener('click', () => addRequirementCard(listContainer));

    listContainer.addEventListener('click', e => {
      const removeBtn = e.target.closest('.btn-remove-requirement');
      if (removeBtn) {
        removeBtn.closest('.requirement-card')?.remove();
        saveFromForm();
      }
    });

    listContainer.addEventListener('change', e => {
      const select = e.target.closest('[data-req-field="type"]');
      if (select) {
        const card = select.closest('.requirement-card');
        const textarea = card?.querySelector('[data-req-field="sentence"]');
        if (textarea && !textarea.value.trim()) {
          const typeInfo = EARS_TYPES[select.value];
          if (typeInfo) textarea.placeholder = typeInfo.template;
        }
      }
      debounce(() => saveFromForm(), 500)();
    });

    listContainer.addEventListener('input', debounce(() => saveFromForm(), 1000));
  }

  function addRequirementCard(container, data = {}) {
    reqCounter++;
    const card = el('div', { className: 'requirement-card', 'data-req-id': String(reqCounter) });

    // Header
    const header = el('div', { className: 'requirement-header' });
    header.appendChild(el('span', { className: 'requirement-number', textContent: `需求 #${container.children.length + 1}` }));
    const removeBtn = el('button', { type: 'button', className: 'btn-remove-requirement', 'aria-label': '移除此需求', textContent: '\u00d7' });
    header.appendChild(removeBtn);
    card.appendChild(header);

    // Fields
    const fields = el('div', { className: 'requirement-fields' });

    // Type select
    const typeRow = el('div', { className: 'requirement-row' });
    typeRow.appendChild(el('label', { className: 'form-label', textContent: '類型' }));
    const typeSelect = el('select', { className: 'form-select', 'data-req-field': 'type' });
    Object.entries(EARS_TYPES).forEach(([key, info]) => {
      const opt = el('option', { value: key, textContent: info.label });
      if (data.type === key) opt.selected = true;
      typeSelect.appendChild(opt);
    });
    typeRow.appendChild(typeSelect);
    fields.appendChild(typeRow);

    // Sentence textarea
    const sentenceRow = el('div', { className: 'requirement-row' });
    sentenceRow.appendChild(el('label', { className: 'form-label', textContent: '需求描述' }));
    const selectedType = data.type || 'ubiquitous';
    const textarea = el('textarea', {
      className: 'form-textarea',
      'data-req-field': 'sentence',
      placeholder: EARS_TYPES[selectedType]?.template || '',
      rows: '2'
    });
    textarea.value = data.sentence || '';
    sentenceRow.appendChild(textarea);
    fields.appendChild(sentenceRow);

    card.appendChild(fields);
    container.appendChild(card);
  }

  function collectRequirements() {
    const reqs = [];
    document.querySelectorAll('.requirement-card').forEach(card => {
      reqs.push({
        type:     card.querySelector('[data-req-field="type"]')?.value     || 'ubiquitous',
        sentence: card.querySelector('[data-req-field="sentence"]')?.value || ''
      });
    });
    return reqs;
  }

  // ============================================
  // 8. LOCALSTORAGE MODULE
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
        1: { mode: 'quick', need: '', aspiration: '', constraint: '', role: '', experience: '', trust: '' },
        2: { level: 0, answers: [null, null, null, null, null] },
        3: { strategy: '', scope: '', structure: '', skeleton: '', surface: '' },
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
    const modeContainer = document.querySelector('.carnet-fields');
    session.stages[1].mode = modeContainer?.dataset.currentMode || 'quick';
    document.querySelectorAll('[data-stage="1"][data-field]').forEach(input => {
      session.stages[1][input.dataset.field] = input.value;
    });

    // Stage 2 - Complexity
    const levelField = document.querySelector('[data-stage="2"][data-field="level"]');
    if (levelField) session.stages[2].level = parseInt(levelField.value, 10) || 0;

    // Stage 3 - Product Layers
    document.querySelectorAll('[data-stage="3"][data-field]').forEach(input => {
      session.stages[3][input.dataset.field] = input.value;
    });

    // Stage 4 - User Stories
    session.stages[4].stories = collectStories();

    // Stage 5 - EARS Requirements
    session.stages[5].requirements = collectRequirements();

    // Session name
    const nameInput = document.querySelector('#session-name');
    if (nameInput && nameInput.value.trim()) session.name = nameInput.value.trim();

    return session;
  }

  function saveFromForm() {
    const session = collectFormData();
    saveSession(session);
  }

  function loadSessionToForm(session) {
    if (!session) return;
    setCurrentSessionId(session.id);

    // Session name
    const nameInput = document.querySelector('#session-name');
    if (nameInput) nameInput.value = session.name || '未命名專案';

    // Stage 1 - CARNET
    const s1 = session.stages[1] || {};
    const mode = s1.mode || 'quick';
    const modeContainer = document.querySelector('.carnet-mode-toggle');
    const fieldsContainer = document.querySelector('.carnet-fields');
    if (modeContainer && fieldsContainer) {
      modeContainer.querySelectorAll('[data-mode]').forEach(btn =>
        btn.classList.toggle('active', btn.dataset.mode === mode)
      );
      renderCarnetFields(fieldsContainer, mode);
    }
    // Fill values after DOM update
    setTimeout(() => {
      document.querySelectorAll('[data-stage="1"][data-field]').forEach(input => {
        if (s1[input.dataset.field] !== undefined) input.value = s1[input.dataset.field];
      });
    }, 0);

    // Stage 2 - Complexity
    const s2 = session.stages[2] || {};
    if (s2.answers) {
      const panel = document.querySelector('.stage-panel[data-stage="2"]');
      if (panel) {
        panel.querySelectorAll('.complexity-question').forEach(q => {
          q.classList.remove('disabled');
          q.querySelectorAll('input[type="radio"]').forEach(r => { r.disabled = false; r.checked = false; });
        });
        s2.answers.forEach((answer, i) => {
          if (answer !== null) {
            const val = answer ? 'yes' : 'no';
            const radio = panel.querySelector(`input[name="complexity-q${i}"][value="${val}"]`);
            if (radio) radio.checked = true;
          }
        });
        calculateComplexity(panel);
      }
    }

    // Stage 3 - Product Layers
    const s3 = session.stages[3] || {};
    document.querySelectorAll('[data-stage="3"][data-field]').forEach(input => {
      input.value = s3[input.dataset.field] || '';
    });

    // Stage 4 - User Stories
    const storiesList = document.querySelector('.stories-list');
    if (storiesList) {
      storiesList.textContent = '';
      (session.stages[4]?.stories || []).forEach(story => addStoryCard(storiesList, story));
    }

    // Stage 5 - EARS Requirements
    const reqsList = document.querySelector('.requirements-list');
    if (reqsList) {
      reqsList.textContent = '';
      (session.stages[5]?.requirements || []).forEach(req => addRequirementCard(reqsList, req));
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
    const workshopContainer = document.querySelector('.workshop') || document.body;
    const debouncedSave = debounce(() => saveFromForm(), 1000);
    workshopContainer.addEventListener('input', debouncedSave);
    workshopContainer.addEventListener('change', debouncedSave);
  }

  // ============================================
  // 9. EXPORT MODULE
  // ============================================

  function generateMarkdown(session) {
    const s1 = session.stages[1] || {};
    const s2 = session.stages[2] || {};
    const s4 = session.stages[4] || {};
    const s5 = session.stages[5] || {};
    const level = s2.level || 0;
    const levelInfo = COMPLEXITY_LEVELS[level] || COMPLEXITY_LEVELS[0];

    let md = `# 需求文件：${session.name}\n\n`;

    // 1. Product Overview (CARNET)
    md += `## 1. 產品概述\n\n`;
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

    // 3. Core User Stories (ordered by MoSCoW)
    md += `## 3. 核心 User Stories\n\n`;
    const stories = s4.stories || [];
    const priorityOrder = ['Must', 'Should', 'Could', "Won't"];
    const sorted = [...stories].sort((a, b) =>
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    );
    if (sorted.length === 0) {
      md += `尚未填寫。\n\n`;
    } else {
      sorted.forEach((story, i) => {
        md += `### Story ${i + 1}（${story.priority}）\n\n`;
        md += '```\n';
        md += `作為${story.role}，\n`;
        md += `我想要${story.want}，\n`;
        md += `以便於${story.value}。\n`;
        if (story.acceptance) md += `\n驗收標準：\n${story.acceptance}\n`;
        md += '```\n\n';
      });
    }

    // 4. Architecture Suggestion
    md += `## 4. 系統架構建議\n\n`;
    md += generateArchitectureSuggestion(level);

    // 5. Edge Cases
    md += `## 5. Edge Cases 清單\n\n`;
    const edgeCases = extractEdgeCases(stories);
    edgeCases.forEach(ec => { md += `- ${ec}\n`; });
    md += '\n';

    // 6. EARS Requirements (grouped by type)
    md += `## 6. EARS 格式需求\n\n`;
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

    // 7. Non-functional Requirements
    md += `## 7. 非功能性需求\n\n`;
    md += generateNonFunctionalRequirements(level);

    // 8. Technology Suggestion
    md += `## 8. 建議技術選型\n\n`;
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
      if (!story.acceptance) return;
      story.acceptance.split('\n').forEach(line => {
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
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); showToast('已複製到剪貼簿！', 'success'); }
      catch { showToast('複製失敗，請手動複製。', 'error'); }
      document.body.removeChild(ta);
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
    const btnCopy = document.querySelector('#btn-copy-md');
    const btnDownload = document.querySelector('#btn-download-md');
    const previewContainer = document.querySelector('#markdown-preview');

    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        const session = collectFormData();
        saveSession(session);
        copyToClipboard(generateMarkdown(session));
      });
    }

    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        const session = collectFormData();
        saveSession(session);
        const md = generateMarkdown(session);
        const safeName = (session.name || '需求文件').replace(/[^\w\u4e00-\u9fff-]/g, '_');
        downloadMarkdown(`${safeName}.md`, md);
      });
    }

    const btnPreview = document.querySelector('#btn-preview-md');
    if (btnPreview && previewContainer) {
      btnPreview.addEventListener('click', () => {
        const session = collectFormData();
        previewContainer.textContent = generateMarkdown(session);
        previewContainer.hidden = false;
      });
    }
  }

  // ============================================
  // 10. RECORDS UI MODULE
  // ============================================

  function initRecords() {
    const recordsList = document.querySelector('#records-list');
    const btnNew = document.querySelector('#btn-new-session');

    if (btnNew) {
      btnNew.addEventListener('click', () => {
        const session = createNewSession();
        saveSession(session);
        setCurrentSessionId(session.id);
        loadSessionToForm(session);
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
            const mainInput = document.querySelector('#session-name');
            if (mainInput) mainInput.value = session.name;
          }
        }
      });
    }
  }

  function renderRecordsList() {
    const recordsList = document.querySelector('#records-list');
    if (!recordsList) return;

    const sessions = getAllSessions();
    sessions.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    recordsList.textContent = '';

    if (sessions.length === 0) {
      recordsList.appendChild(el('p', { className: 'records-empty', textContent: '尚無紀錄，點擊「新增專案」開始吧！' }));
      return;
    }

    sessions.forEach(session => {
      const level = session.stages?.[2]?.level || 0;
      const levelInfo = COMPLEXITY_LEVELS[level];
      const date = new Date(session.updatedAt).toLocaleDateString('zh-TW', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      const isCurrent = session.id === getCurrentSessionId();

      const card = el('div', { className: `record-card${isCurrent ? ' current' : ''}`, 'data-session-id': session.id });

      // Info section
      const info = el('div', { className: 'record-info' });
      const nameInput = el('input', { type: 'text', className: 'record-name-input', value: session.name, 'data-session-id': session.id, 'aria-label': '專案名稱' });
      info.appendChild(nameInput);
      info.appendChild(el('span', { className: 'record-date', textContent: date }));
      if (level > 0) {
        info.appendChild(el('span', { className: `record-badge level-${level}`, textContent: levelInfo.name }));
      }
      card.appendChild(info);

      // Actions
      const actions = el('div', { className: 'record-actions' });
      actions.appendChild(el('button', { className: 'btn-load-session', 'data-session-id': session.id, textContent: '載入' }));
      actions.appendChild(el('button', { className: 'btn-delete-session', 'data-session-id': session.id, textContent: '刪除' }));
      card.appendChild(actions);

      recordsList.appendChild(card);
    });
  }

  function switchToWorkshop() {
    const link = document.querySelector('.nav-link[href="#workshop"]');
    if (link) { link.click(); return; }
    const ws = document.getElementById('workshop');
    if (ws) ws.scrollIntoView({ behavior: 'smooth' });
  }

  // ============================================
  // 11. TOAST MODULE
  // ============================================

  function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = el('div', { id: 'toast-container' });
      document.body.appendChild(container);
    }

    const toast = el('div', { className: `toast toast-${type}`, role: 'alert', textContent: message });
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-visible'));

    setTimeout(() => {
      toast.classList.remove('toast-visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }

  // ============================================
  // 12. INIT
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
