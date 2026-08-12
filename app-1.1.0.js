(() => {
  'use strict';

  const STORAGE_KEY = 'letterdrop-project-v1';
  const DB_NAME = 'letterdrop';
  const DB_VERSION = 2;
  const MAX_HISTORY = 50;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

  const blockDefaults = {
    heading: () => ({ id: uid(), type: 'heading', text: 'A heading worth pausing for', level: 2, align: 'left' }),
    paragraph: () => ({ id: uid(), type: 'paragraph', text: 'Share an update, a small story, or something your readers should know. Click this text to make it your own.' }),
    image: () => ({ id: uid(), type: 'image', src: '', alt: '', fileName: '', showFileName: false, caption: 'Add a thoughtful caption here.' }),
    gallery: () => ({ id: uid(), type: 'gallery', heading: 'Grade 3', projectTitle: 'Our latest art project', description: 'Add a short note about the materials, process, or artistic idea explored by this class.', columns: 3, crop: 'square', layout: 'grid', showFileName: false, hidden: false, collapsed: false, images: [] }),
    imageText: () => ({ id: uid(), type: 'imageText', src: '', alt: '', fileName: '', showFileName: false, heading: 'A story in two parts', text: 'Bring an image and a short statement together. This layout stacks neatly on smaller screens.', imageSide: 'left' }),
    quote: () => ({ id: uid(), type: 'quote', text: 'The best newsletters feel less like an announcement and more like a letter.', cite: 'A thoughtful editor' }),
    button: () => ({ id: uid(), type: 'button', label: 'Discover more', url: 'https://example.com' }),
    divider: () => ({ id: uid(), type: 'divider' })
  };

  const templateData = {
    editorial: () => ({
      title: 'The Sunday Edit',
      theme: { accent: '#d7653b', ink: '#25312b', page: '#f3eee5', font: 'editorial', density: 'comfortable' },
      blocks: [
        { id: uid(), type: 'heading', text: 'Slow mornings, good stories.', level: 1, align: 'left', hero: true, kicker: 'A WEEKLY NOTE - ISSUE 01', date: 'SUNDAY, AUGUST 11' },
        { id: uid(), type: 'image', src: '', alt: '', caption: 'A quiet place for your lead photograph.' },
        { id: uid(), type: 'paragraph', text: "Welcome to this week's edit - a collection of small observations, useful ideas, and moments worth carrying into the days ahead." },
        { id: uid(), type: 'quote', text: 'There is always something beautiful waiting to be noticed.', cite: "This week's reminder" },
        { id: uid(), type: 'button', label: 'Read the full story', url: 'https://example.com' }
      ]
    }),
    classroom: () => ({
      title: 'Classroom Notes',
      theme: { accent: '#16756a', ink: '#183d3a', page: '#eaf5f1', font: 'modern', density: 'comfortable' },
      blocks: [
        { id: uid(), type: 'heading', text: 'Look what we learned!', level: 1, align: 'center', hero: true, kicker: 'ROOM 12 - FAMILY UPDATE', date: 'AUGUST NEWSLETTER' },
        { id: uid(), type: 'imageText', src: '', alt: '', heading: 'Curious minds at work', text: 'Use this space for a classroom highlight, student project, or a peek at what comes next.', imageSide: 'left' },
        { id: uid(), type: 'heading', text: 'Dates to remember', level: 2, align: 'left' },
        { id: uid(), type: 'paragraph', text: 'Add field trips, special events, classroom celebrations, and friendly reminders for families.' },
        { id: uid(), type: 'button', label: 'View the class calendar', url: 'https://example.com' }
      ]
    }),
    business: () => ({
      title: 'Studio Dispatch',
      theme: { accent: '#d6a645', ink: '#152631', page: '#f4f1e9', font: 'modern', density: 'airy' },
      blocks: [
        { id: uid(), type: 'heading', text: 'Ideas made visible.', level: 1, align: 'left', hero: true, kicker: 'STUDIO DISPATCH - NO. 04', date: 'SUMMER EDITION' },
        { id: uid(), type: 'paragraph', text: 'A considered update from our studio: recent work, lessons from the process, and what we are creating next.' },
        { id: uid(), type: 'divider' },
        { id: uid(), type: 'imageText', src: '', alt: '', heading: 'Behind the work', text: 'Give readers the story behind a project, product, or important milestone.', imageSide: 'right' },
        { id: uid(), type: 'button', label: 'Explore our work', url: 'https://example.com' }
      ]
    }),
    grades: () => ({
      title: 'The Art Room Gallery',
      theme: { accent: '#9b5b36', ink: '#29352f', page: '#f5f0e4', font: 'editorial', density: 'comfortable' },
      blocks: [
        { id: uid(), type: 'heading', text: 'Made with curious hands.', level: 1, align: 'left', hero: true, kicker: 'FROM THE ART ROOM - STUDENT GALLERY', date: 'OUR LATEST CREATIONS' },
        { id: uid(), type: 'paragraph', text: 'Welcome to our art-room gallery - a look at the ideas, materials, and creative discoveries happening from PreK through Grade 8.' },
        ...['PreK', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'].map((heading, index) => ({ id: uid(), type: 'gallery', heading, projectTitle: 'Project title', description: 'Describe what students explored, which materials they used, or what inspired this work.', columns: 3, crop: 'square', layout: index === 0 ? 'wall' : 'grid', showFileName: false, hidden: false, collapsed: false, images: [] })),
        { id: uid(), type: 'heading', text: 'Coming up in the art room', level: 2, align: 'left' },
        { id: uid(), type: 'paragraph', text: 'Add upcoming exhibitions, supply reminders, volunteer opportunities, or a short note for families.' }
      ]
    }),
    artShow: () => ({
      title: "You're Invited: Student Art Show",
      theme: { accent: '#7c315f', ink: '#2e2430', page: '#f8efe9', font: 'editorial', density: 'airy' },
      blocks: [
        { id: uid(), type: 'heading', text: 'Come see what we made.', level: 1, align: 'center', hero: true, kicker: 'PREK-8 STUDENT ART SHOW', date: 'DATE - TIME - LOCATION' },
        { id: uid(), type: 'paragraph', text: 'Families and friends are warmly invited to celebrate a year of imagination, experimentation, and student creativity.' },
        { id: uid(), type: 'image', src: '', alt: '', fileName: '', showFileName: false, caption: 'Add a featured artwork or event poster.' },
        { id: uid(), type: 'quote', text: 'Every child is an artist.', cite: 'A celebration of student voice' },
        { id: uid(), type: 'button', label: 'View event details', url: 'https://example.com' }
      ]
    }),
    familyNight: () => ({
      title: 'Family Art Night',
      theme: { accent: '#b84c5b', ink: '#3a2930', page: '#fff1e8', font: 'modern', density: 'comfortable' },
      blocks: [
        { id: uid(), type: 'heading', text: 'Create together.', level: 1, align: 'center', hero: true, kicker: 'FAMILY ART NIGHT', date: 'SAVE THE DATE' },
        { id: uid(), type: 'paragraph', text: 'Join us for an evening of hands-on art making. No experience is needed - just bring your curiosity.' },
        { id: uid(), type: 'gallery', heading: "What we'll make", projectTitle: 'Creative stations for every age', description: 'Add examples of the projects families can try.', columns: 3, crop: 'square', layout: 'wall', showFileName: false, hidden: false, collapsed: false, images: [] },
        { id: uid(), type: 'heading', text: 'What to know', level: 2, align: 'left' },
        { id: uid(), type: 'paragraph', text: 'Add the time, location, parking information, clothing recommendations, and any materials families should bring.' }
      ]
    }),
    supplies: () => ({
      title: 'Art Room Supply Request',
      theme: { accent: '#b28316', ink: '#3b3524', page: '#fff8dc', font: 'modern', density: 'comfortable' },
      blocks: [
        { id: uid(), type: 'heading', text: 'Help stock our creativity.', level: 1, align: 'left', hero: true, kicker: 'ART ROOM WISH LIST', date: 'THANK YOU, FAMILIES' },
        { id: uid(), type: 'paragraph', text: 'Our artists use a wonderful variety of everyday and specialty materials. Donations are always optional and deeply appreciated.' },
        { id: uid(), type: 'quote', text: 'Most needed: clean recyclables, drawing paper, glue sticks, and washable markers.', cite: 'Current classroom needs' },
        { id: uid(), type: 'heading', text: 'How to contribute', level: 2, align: 'left' },
        { id: uid(), type: 'paragraph', text: 'Add drop-off instructions, requested quantities, links, and any items the art room cannot accept.' },
        { id: uid(), type: 'button', label: 'View the complete wish list', url: 'https://example.com' }
      ]
    }),
    process: () => ({
      title: 'From Idea to Artwork',
      theme: { accent: '#3f6f9f', ink: '#263746', page: '#edf4f8', font: 'editorial', density: 'comfortable' },
      blocks: [
        { id: uid(), type: 'heading', text: 'The creative process.', level: 1, align: 'left', hero: true, kicker: 'INSIDE THE ART ROOM', date: 'SKETCH - EXPLORE - REFLECT' },
        { id: uid(), type: 'paragraph', text: 'Art is more than a finished product. Use this newsletter to show the questions, experiments, revisions, and discoveries along the way.' },
        { id: uid(), type: 'gallery', heading: 'Project journey', projectTitle: 'From first sketch to final reflection', description: 'Add photos in order to tell the story of how this artwork developed.', columns: 4, crop: 'square', layout: 'process', showFileName: false, hidden: false, collapsed: false, images: [] },
        { id: uid(), type: 'quote', text: 'What surprised you while making this?', cite: 'Student reflection prompt' }
      ]
    }),
    semester: () => ({
      title: 'Semester in the Art Room',
      theme: { accent: '#52755a', ink: '#29382c', page: '#eef4e9', font: 'editorial', density: 'comfortable' },
      blocks: [
        { id: uid(), type: 'heading', text: 'A semester of making.', level: 1, align: 'left', hero: true, kicker: 'THE ART ROOM RECAP', date: 'FALL - WINTER - SPRING' },
        { id: uid(), type: 'paragraph', text: 'A visual reflection on the skills, materials, artists, and big ideas we explored together this semester.' },
        ...['Early Artists - PreK-2', 'Growing Artists - Grades 3-5', 'Studio Artists - Grades 6-8'].map((heading, index) => ({ id: uid(), type: 'gallery', heading, projectTitle: 'Semester highlights', description: 'Add favorite projects, discoveries, and moments from this grade band.', columns: 3, crop: 'square', layout: index === 2 ? 'featured' : 'grid', showFileName: false, hidden: false, collapsed: false, images: [] })),
        { id: uid(), type: 'heading', text: 'What comes next', level: 2, align: 'left' },
        { id: uid(), type: 'paragraph', text: "Preview next semester's materials, themes, exhibitions, or creative challenges." }
      ]
    })
  };

  let state = createProject('editorial');
  let selectedId = null;
  let history = [];
  let future = [];
  let draggedId = null;
  let saveTimer = null;
  let toastTimer = null;
  let dbPromise = null;
  let activeImports = 0;
  let saveCount = 0;
  let draggedGalleryImage = null;

  const canvas = $('#newsletter-canvas');

  function createProject(template) {
    const data = templateData[template]();
    return { schemaVersion: 1, id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...data };
  }

  function openDatabase() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects');
        if (!db.objectStoreNames.contains('snapshots')) db.createObjectStore('snapshots', { keyPath: 'savedAt' });
        if (!db.objectStoreNames.contains('templates')) db.createObjectStore('templates', { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }

  async function dbRequest(storeName, mode, action) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = action(transaction.objectStore(storeName));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function loadProject() {
    try {
      const saved = await dbRequest('projects', 'readonly', store => store.get('current'));
      if (saved?.schemaVersion === 1 && Array.isArray(saved.blocks)) return saved;
      const legacy = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (legacy?.schemaVersion === 1 && Array.isArray(legacy.blocks)) {
        await dbRequest('projects', 'readwrite', store => store.put(legacy, 'current'));
        localStorage.removeItem(STORAGE_KEY);
        showToast('Your existing project was upgraded to reliable storage.');
        return legacy;
      }
    } catch (error) { console.warn('Could not load saved project', error); }
    return null;
  }

  async function persistProject(project) {
    await dbRequest('projects', 'readwrite', store => store.put(structuredClone(project), 'current'));
    saveCount++;
    if (saveCount % 10 === 0) await saveRecoverySnapshot(project);
    updateStorageStatus();
  }

  async function saveRecoverySnapshot(project) {
    const snapshot = { savedAt: Date.now(), project: structuredClone(project) };
    await dbRequest('snapshots', 'readwrite', store => store.put(snapshot));
    const snapshots = await dbRequest('snapshots', 'readonly', store => store.getAllKeys());
    for (const key of snapshots.sort((a, b) => b - a).slice(5)) await dbRequest('snapshots', 'readwrite', store => store.delete(key));
  }

  async function restoreLatestSnapshot() {
    const snapshots = await dbRequest('snapshots', 'readonly', store => store.getAll());
    const latest = snapshots.sort((a, b) => b.savedAt - a.savedAt)[0];
    if (!latest) return showToast('No recovery backup is available yet.');
    const savedTime = new Date(latest.savedAt).toLocaleString();
    if (!confirm(`Restore the recovery backup from ${savedTime}? Your current version will remain available through Undo.`)) return;
    recordHistory();
    state = latest.project;
    selectedId = null;
    render();
    scheduleSave();
    showToast('Recovery backup restored');
  }

  async function updateStorageStatus() {
    if (!navigator.storage?.estimate) return;
    const { usage = 0, quota = 0 } = await navigator.storage.estimate();
    const used = usage / 1024 / 1024;
    $('#storage-status').textContent = `${used < 1 ? used.toFixed(1) : Math.round(used)} MB used${quota ? ` of ${Math.round(quota / 1024 / 1024)} MB` : ''}`;
  }

  function projectForTemplate(keepImages) {
    const project = structuredClone(state);
    project.id = uid();
    project.createdAt = new Date().toISOString();
    project.updatedAt = project.createdAt;
    if (!keepImages) project.blocks.forEach(block => {
      if (block.type === 'image' || block.type === 'imageText') { block.src = ''; block.fileName = ''; block.alt = ''; }
      if (block.type === 'gallery') block.images = [];
    });
    return project;
  }

  function freshProjectFromTemplate(project, title) {
    const copy = structuredClone(project);
    copy.id = uid(); copy.title = title || copy.title; copy.createdAt = new Date().toISOString(); copy.updatedAt = copy.createdAt;
    copy.blocks.forEach(block => {
      block.id = uid();
      if (block.images) block.images.forEach(image => { image.id = uid(); });
    });
    return copy;
  }

  async function getCustomTemplates() { return dbRequest('templates', 'readonly', store => store.getAll()); }

  async function renderCustomTemplates() {
    const templates = (await getCustomTemplates()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const list = $('#custom-template-list');
    if (!templates.length) { list.innerHTML = '<p class="template-empty">No custom templates yet.</p>'; return; }
    list.innerHTML = templates.map(template => `<div class="custom-template-card" data-custom-template="${template.id}"><button data-use-custom><strong>${escapeHtml(template.name)}</strong><small>${template.project.blocks.length} blocks - ${template.includesImages ? 'includes photos' : 'photos removed'}</small></button><div class="custom-template-actions"><button data-export-custom title="Export template" aria-label="Export ${escapeHtml(template.name)}">EXP</button><button data-rename-custom title="Rename template" aria-label="Rename ${escapeHtml(template.name)}">EDIT</button><button data-delete-custom title="Delete template" aria-label="Delete ${escapeHtml(template.name)}">x</button></div></div>`).join('');
    $$('[data-custom-template]', list).forEach(card => {
      const template = templates.find(item => item.id === card.dataset.customTemplate);
      $('[data-use-custom]', card).addEventListener('click', () => applyCustomTemplate(template));
      $('[data-export-custom]', card).addEventListener('click', () => exportCustomTemplate(template));
      $('[data-rename-custom]', card).addEventListener('click', () => renameCustomTemplate(template));
      $('[data-delete-custom]', card).addEventListener('click', () => deleteCustomTemplate(template));
    });
  }

  async function saveCurrentTemplate() {
    const name = $('#template-name').value.trim();
    if (!name) return showToast('Give this template a name.');
    const includesImages = $('#template-keep-images').checked;
    const template = { kind: 'letterdrop-template', version: 1, id: uid(), name, includesImages, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), project: projectForTemplate(includesImages) };
    await dbRequest('templates', 'readwrite', store => store.put(template));
    closeModals(); await renderCustomTemplates(); showToast(`${name} saved to My Templates`);
  }

  function applyCustomTemplate(template) {
    if (state.blocks.length && !confirm(`Replace the current newsletter with "${template.name}"? You can undo this change.`)) return;
    recordHistory(); state = freshProjectFromTemplate(template.project, template.name); selectedId = null; future = []; render(); scheduleSave(); showToast(`${template.name} applied`);
  }

  function exportCustomTemplate(template) {
    downloadBlob(JSON.stringify(template, null, 2), `${slug(template.name)}.letterdrop-template.json`, 'application/json');
    showToast('Template file downloaded');
  }

  async function renameCustomTemplate(template) {
    const name = prompt('Rename this template:', template.name)?.trim();
    if (!name || name === template.name) return;
    template.name = name; template.updatedAt = new Date().toISOString();
    await dbRequest('templates', 'readwrite', store => store.put(template));
    await renderCustomTemplates();
  }

  async function deleteCustomTemplate(template) {
    if (!confirm(`Delete "${template.name}" from My Templates?`)) return;
    await dbRequest('templates', 'readwrite', store => store.delete(template.id));
    await renderCustomTemplates(); showToast('Template deleted');
  }

  function importCustomTemplate(file) {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const template = JSON.parse(reader.result);
        if (template.kind !== 'letterdrop-template' || !template.project?.blocks || !template.name) throw new Error();
        template.id = uid(); template.createdAt = new Date().toISOString(); template.updatedAt = template.createdAt;
        await dbRequest('templates', 'readwrite', store => store.put(template));
        await renderCustomTemplates(); showToast(`${template.name} imported`);
      } catch { showToast('That file is not a valid Letterdrop template.'); }
    };
    reader.readAsText(file);
  }

  function snapshot() { return JSON.stringify(state); }
  function restore(serialized) { state = JSON.parse(serialized); selectedId = null; render(); scheduleSave(); }
  function recordHistory() {
    history.push(snapshot());
    if (history.length > MAX_HISTORY) history.shift();
    future = [];
    updateHistoryButtons();
  }
  function undo() {
    if (!history.length) return;
    future.push(snapshot());
    restore(history.pop());
    updateHistoryButtons();
  }
  function redo() {
    if (!future.length) return;
    history.push(snapshot());
    restore(future.pop());
    updateHistoryButtons();
  }
  function updateHistoryButtons() {
    $('#undo-btn').disabled = !history.length;
    $('#redo-btn').disabled = !future.length;
  }

  function scheduleSave() {
    $('#save-status').textContent = 'Saving...';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(async () => {
      try {
        state.updatedAt = new Date().toISOString();
        await persistProject(state);
        $('#save-status').textContent = 'Saved locally';
      } catch {
        $('#save-status').textContent = 'Save failed - export a backup';
        showToast('The project could not be saved. Download a project backup.');
      }
    }, 350);
  }

  function mutate(action, rerender = true) {
    recordHistory();
    action();
    if (rerender) render();
    scheduleSave();
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
  }

  function safeUrl(value = '') {
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? value : '#';
    } catch { return '#'; }
  }

  function render() {
    $('#project-title').value = state.title;
    $('#accent-color').value = state.theme.accent;
    $('#text-color').value = state.theme.ink;
    $('#page-color').value = state.theme.page;
    $('#font-select').value = state.theme.font;
    $$('#density-control button').forEach(btn => btn.classList.toggle('active', btn.dataset.density === state.theme.density));
    applyTheme(canvas);
    canvas.innerHTML = state.blocks.map(renderBlock).join('');
    wireCanvas();
    $('#block-count').textContent = `${state.blocks.length} block${state.blocks.length === 1 ? '' : 's'}`;
    renderSettings();
  }

  function applyTheme(target) {
    target.style.setProperty('--newsletter-accent', state.theme.accent);
    target.style.setProperty('--newsletter-ink', state.theme.ink);
    target.style.setProperty('--newsletter-page', state.theme.page);
    target.style.setProperty('--block-space', ({ compact: '19px', comfortable: '28px', airy: '39px' })[state.theme.density]);
    target.classList.remove('font-editorial', 'font-modern', 'font-classic');
    target.classList.add(`font-${state.theme.font}`);
  }

  function tools(block) {
    return `<div class="block-tools" aria-label="Block actions">
      <button class="drag-handle" draggable="true" title="Drag to move" aria-label="Drag to move">MOVE</button>
      <button data-action="up" title="Move up" aria-label="Move block up">UP</button>
      <button data-action="down" title="Move down" aria-label="Move block down">DN</button>
      <button data-action="duplicate" title="Duplicate" aria-label="Duplicate block">COPY</button>
      <button data-action="delete" title="Delete" aria-label="Delete block">x</button>
    </div>`;
  }

  function boundedNumber(value, fallback, min, max) {
    const number = Number(value);
    return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
  }
  function fontStack(value) {
    return ({ inherit: 'inherit', editorial: 'Georgia,serif', modern: 'Inter,Arial,sans-serif', classic: 'Palatino,Georgia,serif', friendly: 'Trebuchet MS,Arial,sans-serif', typewriter: 'Courier New,monospace' })[value] || 'inherit';
  }
  function textStyle(block, defaults) {
    const color = /^#[0-9a-f]{6}$/i.test(block.textColor || '') ? block.textColor : 'inherit';
    return `font-family:${fontStack(block.fontFamily)};font-size:${boundedNumber(block.fontSize, defaults.size, 8, 120)}px;font-weight:${boundedNumber(block.fontWeight, defaults.weight, 300, 900)};line-height:${boundedNumber(block.customLineHeight, defaults.lineHeight, .8, 3)};letter-spacing:${boundedNumber(block.letterSpacing, defaults.letterSpacing, -5, 20)}px;color:${color}`;
  }

  function renderBlock(block) {
    const selected = selectedId === block.id ? ' selected' : '';
    const blockSpacing = ({ compact: '14px', balanced: '28px', airy: '44px' })[block.spacing] || '';
    const common = `class="newsletter-block${block.hero ? ' hero-block' : ''}${block.hidden ? ' grade-hidden' : ''}${block.collapsed ? ' grade-collapsed' : ''}${selected}" data-id="${block.id}" data-type="${block.type}"${blockSpacing ? ` style="padding-top:${blockSpacing};padding-bottom:${blockSpacing}"` : ''}`;
    let content = '';
    if (block.type === 'heading') {
      content = `${block.kicker ? `<p class="hero-kicker editable" contenteditable="true" data-field="kicker" style="text-align:${block.kickerAlign || block.align || 'left'};font-family:${fontStack(block.smallFontFamily || 'modern')};font-size:${boundedNumber(block.kickerSize, 10, 8, 36)}px;color:${block.kickerColor || 'var(--newsletter-accent)'}">${escapeHtml(block.kicker)}</p>` : ''}
        <h${block.level || 2} class="newsletter-heading editable" contenteditable="true" data-field="text" style="text-align:${block.align || 'left'};${textStyle(block, { size: block.hero ? 48 : 40, weight: 500, lineHeight: 1.05, letterSpacing: -1.8 })}">${escapeHtml(block.text)}</h${block.level || 2}>
        ${block.date ? `<p class="hero-date editable" contenteditable="true" data-field="date" style="text-align:${block.kickerAlign || block.align || 'left'};font-family:${fontStack(block.smallFontFamily || 'modern')};font-size:${boundedNumber(block.dateSize, 11, 8, 36)}px;color:${block.kickerColor || '#77766f'}">${escapeHtml(block.date)}</p>` : ''}`;
    } else if (block.type === 'paragraph') {
      content = `<p class="newsletter-paragraph editable" contenteditable="true" data-field="text" style="text-align:${block.align || 'left'};${textStyle(block, { size: 17, weight: 400, lineHeight: 1.75, letterSpacing: 0 })}">${escapeHtml(block.text)}</p>`;
    } else if (block.type === 'image') {
      content = `${imageFrame(block)}${renderFileName(block)}<p class="image-caption editable" contenteditable="true" data-field="caption" style="${textStyle(block, { size: 12, weight: 400, lineHeight: 1.4, letterSpacing: 0 })};font-style:italic">${escapeHtml(block.caption || '')}</p>`;
    } else if (block.type === 'gallery') {
      content = renderGallery(block);
    } else if (block.type === 'imageText') {
      const image = imageFrame(block);
      const copy = `<div class="image-text-copy" style="text-align:${block.textAlign || 'left'};color:${block.textColor || 'inherit'}"><h2 class="editable" contenteditable="true" data-field="heading" style="font-family:${fontStack(block.fontFamily)}">${escapeHtml(block.heading)}</h2><p class="editable" contenteditable="true" data-field="text" style="${textStyle(block, { size: 16, weight: 400, lineHeight: 1.65, letterSpacing: 0 })}">${escapeHtml(block.text)}</p></div>`;
      content = `<div class="image-text-layout">${block.imageSide === 'right' ? copy + image : image + copy}</div>${renderFileName(block)}`;
    } else if (block.type === 'quote') {
      content = `<div class="quote-block" style="text-align:${block.align || 'left'}"><p class="quote-text editable" contenteditable="true" data-field="text" style="${textStyle(block, { size: 31, weight: 400, lineHeight: 1.25, letterSpacing: 0 })}">${escapeHtml(block.text)}</p><span class="quote-cite editable" contenteditable="true" data-field="cite">${escapeHtml(block.cite)}</span></div>`;
    } else if (block.type === 'button') {
      content = `<div class="button-wrap" style="text-align:${block.align || 'center'}"><a class="newsletter-button editable" style="${textStyle(block, { size: 12, weight: 800, lineHeight: 1.2, letterSpacing: .5 })};${block.buttonStyle === 'outline' ? 'color:var(--newsletter-accent);background:transparent;box-shadow:inset 0 0 0 2px var(--newsletter-accent)' : ''}" href="${escapeHtml(safeUrl(block.url))}" contenteditable="true" data-field="label">${escapeHtml(block.label)}</a></div>`;
    } else if (block.type === 'divider') {
      content = `<div class="divider-line" role="separator" style="height:${block.thickness || 1}px;width:${block.width || 100}%;margin:auto;background:${block.lineColor || 'rgba(37,49,43,.25)'}"></div>`;
    }
    return `<section ${common}>${tools(block)}${content}</section>`;
  }

  function imageFrame(block) {
    const body = block.src
      ? `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" style="object-fit:${block.fit || 'cover'}">`
      : `<div class="image-placeholder"><div><span class="placeholder-image-icon" aria-hidden="true"></span><small>Click to add a photo</small></div></div>`;
    return `<div class="image-frame" data-image-upload title="Choose an image">${body}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden></div>`;
  }

  function renderFileName(block) {
    return block.showFileName && block.fileName ? `<p class="image-file-name photo-name-edit" contenteditable="true" data-photo-name>${escapeHtml(block.displayName || displayFileName(block.fileName))}</p>` : '';
  }

  function displayFileName(fileName = '') { return String(fileName).replace(/\.[^.]+$/, ''); }

  function renderGallery(block) {
    const items = block.images.length ? block.images.map((image, index) => `<figure class="gallery-item" data-image-id="${image.id}" draggable="true">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || '')}">
      ${block.showFileName ? `<figcaption class="photo-name-edit" contenteditable="true" data-photo-name data-image-id="${image.id}">${escapeHtml(image.displayName || displayFileName(image.fileName))}</figcaption>` : ''}
      <div class="gallery-item-tools" aria-label="Photo actions">
        <button data-gallery-action="left" data-index="${index}" aria-label="Move photo left">LEFT</button>
        <button data-gallery-action="right" data-index="${index}" aria-label="Move photo right">RIGHT</button>
        <button data-gallery-action="remove" data-index="${index}" aria-label="Remove photo">x</button>
      </div>
    </figure>`).join('') : `<div class="gallery-empty"><span class="placeholder-gallery-icon" aria-hidden="true"></span><strong>Add a group of photos</strong><small>Choose several images at once; they will be sorted by filename.</small></div>`;
    return `<div class="gallery-heading-row"><h2 class="gallery-heading editable" contenteditable="true" data-field="heading">${escapeHtml(block.heading || 'Photo group')}</h2><div class="grade-header-actions"><button data-gallery-collapse aria-label="${block.collapsed ? 'Expand' : 'Collapse'} ${escapeHtml(block.heading)}">${block.collapsed ? '+' : '-'}</button><button class="gallery-add-btn" data-gallery-upload>+ Add photos</button></div><input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden></div><div class="gallery-body"><h3 class="gallery-project-title editable" contenteditable="true" data-field="projectTitle">${escapeHtml(block.projectTitle || 'Project title')}</h3><p class="gallery-description editable" contenteditable="true" data-field="description">${escapeHtml(block.description || '')}</p><div class="photo-gallery layout-${block.layout || 'grid'} crop-${block.crop || 'square'}" style="--gallery-columns:${block.columns || 3}">${items}</div></div>`;
  }

  function wireCanvas() {
    $$('.newsletter-block', canvas).forEach(element => {
      element.addEventListener('click', event => {
        if (event.target.closest('.block-tools')) return;
        selectBlock(element.dataset.id);
      });
      element.addEventListener('dragover', event => { event.preventDefault(); element.classList.add('drop-before'); });
      element.addEventListener('dragleave', () => element.classList.remove('drop-before'));
      element.addEventListener('drop', event => {
        event.preventDefault();
        element.classList.remove('drop-before');
        const addType = event.dataTransfer.getData('application/x-letterdrop-block');
        if (addType) return addBlock(addType, state.blocks.findIndex(b => b.id === element.dataset.id));
        if (draggedId && draggedId !== element.dataset.id) moveBlockTo(draggedId, element.dataset.id);
      });
    });
    $$('.drag-handle', canvas).forEach(handle => {
      handle.addEventListener('dragstart', event => {
        draggedId = handle.closest('.newsletter-block').dataset.id;
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => handle.closest('.newsletter-block').classList.add('dragging'));
      });
      handle.addEventListener('dragend', () => { draggedId = null; render(); });
    });
    $$('[data-action]', canvas).forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      const id = button.closest('.newsletter-block').dataset.id;
      const action = button.dataset.action;
      if (action === 'delete') deleteBlock(id);
      if (action === 'duplicate') duplicateBlock(id);
      if (action === 'up') moveBy(id, -1);
      if (action === 'down') moveBy(id, 1);
    }));
    $$('.editable', canvas).forEach(editable => {
      editable.addEventListener('focus', () => {
        recordHistory();
        selectBlock(editable.closest('.newsletter-block').dataset.id, false);
      }, { once: true });
      editable.addEventListener('input', () => {
        const block = state.blocks.find(b => b.id === editable.closest('.newsletter-block').dataset.id);
        block[editable.dataset.field] = editable.textContent.trim();
        scheduleSave();
      });
      if (editable.tagName === 'A') editable.addEventListener('click', event => event.preventDefault());
    });
    $$('.photo-name-edit', canvas).forEach(editable => {
      editable.addEventListener('focus', () => recordHistory(), { once: true });
      editable.addEventListener('click', event => event.stopPropagation());
      editable.addEventListener('input', () => {
        const block = state.blocks.find(item => item.id === editable.closest('.newsletter-block').dataset.id);
        if (editable.dataset.imageId) {
          const image = block.images.find(item => item.id === editable.dataset.imageId);
          if (image) image.displayName = editable.textContent.trim();
        } else block.displayName = editable.textContent.trim();
        scheduleSave();
      });
    });
    $$('[data-image-upload]', canvas).forEach(frame => {
      frame.addEventListener('click', event => {
        if (event.target.tagName === 'INPUT') return;
        frame.querySelector('input').click();
      });
      frame.querySelector('input').addEventListener('change', event => handleImage(event, frame.closest('.newsletter-block').dataset.id));
    });
    $$('[data-gallery-upload]', canvas).forEach(button => {
      const blockElement = button.closest('.newsletter-block');
      const input = blockElement.querySelector('input[type="file"]');
      button.addEventListener('click', event => { event.stopPropagation(); input.click(); });
      input.addEventListener('change', event => { if (event.target.files.length) addFilesToGallery(blockElement.dataset.id, event.target.files); });
    });
    $$('[data-gallery-collapse]', canvas).forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      const blockId = button.closest('.newsletter-block').dataset.id;
      mutate(() => { const block = state.blocks.find(item => item.id === blockId); block.collapsed = !block.collapsed; });
    }));
    $$('.gallery-empty', canvas).forEach(empty => empty.addEventListener('click', () => empty.closest('.newsletter-block').querySelector('[data-gallery-upload]').click()));
    $$('[data-gallery-action]', canvas).forEach(button => button.addEventListener('click', event => {
      event.stopPropagation();
      updateGalleryImage(button.closest('.newsletter-block').dataset.id, Number(button.dataset.index), button.dataset.galleryAction);
    }));
    $$('.gallery-item', canvas).forEach(item => {
      item.addEventListener('dragstart', event => {
        event.stopPropagation();
        draggedGalleryImage = { blockId: item.closest('.newsletter-block').dataset.id, imageId: item.dataset.imageId };
        event.dataTransfer.effectAllowed = 'move';
        setTimeout(() => item.classList.add('gallery-dragging'));
      });
      item.addEventListener('dragover', event => { event.preventDefault(); event.stopPropagation(); item.classList.add('gallery-drop-target'); });
      item.addEventListener('dragleave', event => { event.stopPropagation(); item.classList.remove('gallery-drop-target'); });
      item.addEventListener('drop', event => {
        event.preventDefault(); event.stopPropagation(); item.classList.remove('gallery-drop-target');
        if (draggedGalleryImage?.blockId === item.closest('.newsletter-block').dataset.id) reorderGalleryImage(draggedGalleryImage.blockId, draggedGalleryImage.imageId, item.dataset.imageId);
      });
      item.addEventListener('dragend', event => { event.stopPropagation(); draggedGalleryImage = null; render(); });
    });
  }

  function selectBlock(id, rerender = true) {
    const alreadySelected = selectedId === id;
    selectedId = id;
    if (rerender && !alreadySelected) render();
    else renderSettings();
  }
  function deselectBlock() {
    if (!selectedId) return renderSettings();
    selectedId = null;
    $('.newsletter-block.selected', canvas)?.classList.remove('selected');
    renderSettings();
  }
  function addBlock(type, index = state.blocks.length) {
    if (!blockDefaults[type]) return;
    const block = blockDefaults[type]();
    mutate(() => state.blocks.splice(index, 0, block));
    selectedId = block.id;
    render();
    showToast(`${type === 'imageText' ? 'Image + text' : type} block added`);
  }
  function deleteBlock(id) { mutate(() => { state.blocks = state.blocks.filter(b => b.id !== id); selectedId = null; }); }
  function duplicateBlock(id) {
    mutate(() => {
      const index = state.blocks.findIndex(b => b.id === id);
      const copy = { ...JSON.parse(JSON.stringify(state.blocks[index])), id: uid() };
      state.blocks.splice(index + 1, 0, copy); selectedId = copy.id;
    });
  }
  function moveBy(id, delta) {
    const oldIndex = state.blocks.findIndex(b => b.id === id);
    const newIndex = Math.max(0, Math.min(state.blocks.length - 1, oldIndex + delta));
    if (oldIndex === newIndex) return;
    mutate(() => state.blocks.splice(newIndex, 0, state.blocks.splice(oldIndex, 1)[0]));
  }
  function moveBlockTo(sourceId, targetId) {
    mutate(() => {
      const from = state.blocks.findIndex(b => b.id === sourceId);
      let to = state.blocks.findIndex(b => b.id === targetId);
      const [block] = state.blocks.splice(from, 1);
      if (from < to) to--;
      state.blocks.splice(to, 0, block);
    });
  }

  function typographyControls(block, defaults, includeAlignment = true) {
    return `${includeAlignment ? `<label class="field-label">Alignment<select data-setting="align"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>` : ''}
      <label class="field-label">Font<select data-setting="fontFamily"><option value="inherit">Newsletter font</option><option value="editorial">Editorial serif</option><option value="modern">Modern sans</option><option value="classic">Classic book</option><option value="friendly">Friendly rounded</option><option value="typewriter">Typewriter</option></select></label>
      <div class="setting-pair"><label class="field-label">Size (px)<input type="number" data-setting="fontSize" min="8" max="120" value="${boundedNumber(block.fontSize, defaults.size, 8, 120)}"></label><label class="field-label">Weight<select data-setting="fontWeight"><option value="400">Regular</option><option value="500">Medium</option><option value="600">Semibold</option><option value="700">Bold</option><option value="800">Heavy</option></select></label></div>
      <div class="setting-pair"><label class="field-label">Line height<input type="number" data-setting="customLineHeight" min="0.8" max="3" step="0.05" value="${boundedNumber(block.customLineHeight, defaults.lineHeight, .8, 3)}"></label><label class="field-label">Letter spacing<input type="number" data-setting="letterSpacing" min="-5" max="20" step="0.1" value="${boundedNumber(block.letterSpacing, defaults.letterSpacing, -5, 20)}"></label></div>
      <label class="field-label">Text color<input type="color" data-setting="textColor" value="${/^#[0-9a-f]{6}$/i.test(block.textColor || '') ? block.textColor : state.theme.ink}"></label>`;
  }

  function renderSettings() {
    const block = state.blocks.find(b => b.id === selectedId);
    $('#global-settings').hidden = Boolean(block);
    $('#block-settings').hidden = !block;
    $('#settings-title').textContent = block ? `${labelType(block.type)} block` : 'Newsletter style';
    $('#settings-subtitle').textContent = block ? 'Fine-tune this piece of your story.' : 'Set the look and feel for your whole story.';
    if (!block) return;
    let fields = `<label class="field-label">Block spacing<select data-setting="spacing"><option value="balanced">Balanced</option><option value="compact">Compact</option><option value="airy">Airy</option></select></label>`;
    if (block.type === 'heading') fields += `<label class="field-label">Main heading<textarea data-setting="text">${escapeHtml(block.text || '')}</textarea></label>${typographyControls(block, { size: block.hero ? 48 : 40, lineHeight: 1.05, letterSpacing: -1.8 })}<div class="settings-subgroup"><h4>Small heading and date</h4><label class="field-label">Small heading above<input data-setting="kicker" value="${escapeHtml(block.kicker || '')}" placeholder="Optional eyebrow or section label"></label><label class="field-label">Date or note below<input data-setting="date" value="${escapeHtml(block.date || '')}" placeholder="Optional date or supporting line"></label><label class="field-label">Small-text font<select data-setting="smallFontFamily"><option value="modern">Modern sans</option><option value="editorial">Editorial serif</option><option value="classic">Classic book</option><option value="friendly">Friendly rounded</option><option value="typewriter">Typewriter</option></select></label><label class="field-label">Small-text alignment<select data-setting="kickerAlign"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label><div class="setting-pair"><label class="field-label">Header size<input type="number" data-setting="kickerSize" min="8" max="36" value="${boundedNumber(block.kickerSize, 10, 8, 36)}"></label><label class="field-label">Date size<input type="number" data-setting="dateSize" min="8" max="36" value="${boundedNumber(block.dateSize, 11, 8, 36)}"></label></div><label class="field-label">Small-text color<input type="color" data-setting="kickerColor" value="${/^#[0-9a-f]{6}$/i.test(block.kickerColor || '') ? block.kickerColor : state.theme.accent}"></label></div>`;
    if (block.type === 'paragraph') fields += `<label class="field-label">Paragraph text<textarea data-setting="text">${escapeHtml(block.text || '')}</textarea></label>${typographyControls(block, { size: 17, lineHeight: 1.75, letterSpacing: 0 })}`;
    if (block.type === 'image' || block.type === 'imageText') fields += `<label class="field-label">Alternative text<input data-setting="alt" value="${escapeHtml(block.alt || '')}" placeholder="Describe the image"></label><label class="field-label">Displayed photo name<input data-setting="displayName" value="${escapeHtml(block.displayName || displayFileName(block.fileName || ''))}" placeholder="Add a visible photo name"></label><label class="field-label">Image fit<select data-setting="fit"><option value="cover">Fill the frame</option><option value="contain">Show the whole image</option></select></label><label class="check-label"><input type="checkbox" data-setting="showFileName" ${block.showFileName ? 'checked' : ''}> Display image file name</label>`;
    if (block.type === 'image') fields += `<label class="field-label">Caption<textarea data-setting="caption">${escapeHtml(block.caption || '')}</textarea></label>${typographyControls(block, { size: 12, lineHeight: 1.4, letterSpacing: 0 })}`;
    if (block.type === 'gallery') fields += `<label class="field-label">Grade or group heading<input data-setting="heading" value="${escapeHtml(block.heading || '')}"></label><label class="field-label">Project title<input data-setting="projectTitle" value="${escapeHtml(block.projectTitle || '')}"></label><label class="field-label">Description<textarea data-setting="description">${escapeHtml(block.description || '')}</textarea></label><label class="field-label">Art arrangement<select data-setting="layout"><option value="grid">Equal artwork grid</option><option value="featured">Featured artwork</option><option value="process">Process sequence</option><option value="comparison">Side-by-side comparison</option><option value="wall">Gallery wall</option><option value="list">Artwork with descriptions</option></select></label><label class="field-label">Photos per row<select data-setting="columns"><option value="1">1 large photo</option><option value="2">2 photos</option><option value="3">3 photos</option><option value="4">4 photos</option></select></label><label class="field-label">Photo shape<select data-setting="crop"><option value="square">Square</option><option value="landscape">Landscape</option><option value="natural">Natural proportions</option></select></label><label class="check-label"><input type="checkbox" data-setting="showFileName" ${block.showFileName ? 'checked' : ''}> Display image file names</label>${block.images.length ? `<div class="settings-subgroup photo-name-settings"><h4>Displayed photo names</h4>${block.images.map(image => `<label class="field-label"><span title="${escapeHtml(image.fileName)}">${escapeHtml(displayFileName(image.fileName))}</span><input data-gallery-name-id="${image.id}" value="${escapeHtml(image.displayName || displayFileName(image.fileName))}"></label>`).join('')}</div>` : ''}<label class="check-label"><input type="checkbox" data-setting="hidden" ${block.hidden ? 'checked' : ''}> Hide this grade when exporting</label><button class="settings-add-photos" data-settings-gallery-upload>+ Add more photos</button><button class="settings-add-photos" data-duplicate-grade>Duplicate this grade</button><button class="settings-add-photos" data-clear-grade>Clear this grade's photos</button>`;
    if (block.type === 'imageText') fields += `<label class="field-label">Feature heading<input data-setting="heading" value="${escapeHtml(block.heading || '')}"></label><label class="field-label">Feature text<textarea data-setting="text">${escapeHtml(block.text || '')}</textarea></label><label class="field-label">Image position<select data-setting="imageSide"><option value="left">Left</option><option value="right">Right</option></select></label><label class="field-label">Text alignment<select data-setting="textAlign"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>${typographyControls(block, { size: 16, lineHeight: 1.65, letterSpacing: 0 }, false)}`;
    if (block.type === 'quote') fields += `<label class="field-label">Callout text<textarea data-setting="text">${escapeHtml(block.text || '')}</textarea></label><label class="field-label">Attribution<input data-setting="cite" value="${escapeHtml(block.cite || '')}"></label>${typographyControls(block, { size: 31, lineHeight: 1.25, letterSpacing: 0 })}`;
    if (block.type === 'button') fields += `<label class="field-label">Button label<input data-setting="label" value="${escapeHtml(block.label || '')}"></label><label class="field-label">Destination URL<input data-setting="url" value="${escapeHtml(block.url || '')}" placeholder="https://..."></label><label class="field-label">Button style<select data-setting="buttonStyle"><option value="filled">Filled</option><option value="outline">Outline</option></select></label>${typographyControls(block, { size: 12, lineHeight: 1.2, letterSpacing: .5 })}`;
    if (block.type === 'divider') fields += `<label class="field-label">Line thickness<select data-setting="thickness"><option value="1">Thin</option><option value="2">Medium</option><option value="4">Bold</option></select></label><label class="field-label">Line width<select data-setting="width"><option value="100">Full width</option><option value="75">Three-quarter width</option><option value="50">Half width</option></select></label><label class="field-label">Line color<input type="color" data-setting="lineColor" value="${/^#[0-9a-f]{6}$/i.test(block.lineColor || '') ? block.lineColor : state.theme.ink}"></label>`;
    $('#block-settings').innerHTML = `<section class="setting-section"><h3>Block settings</h3><div style="display:grid;gap:15px">${fields || '<p style="margin:0;color:var(--muted);font-size:11px">Edit this block directly on the canvas.</p>'}</div></section><section class="setting-section"><button class="danger-btn" data-delete-selected>Delete this block</button></section>`;
    $$('[data-setting]', $('#block-settings')).forEach(input => {
      if (input.type !== 'checkbox') input.value = block[input.dataset.setting] || input.value;
      let settingTimer = null;
      const commitSetting = () => {
        const value = input.type === 'checkbox' ? input.checked : input.value;
        if (String(block[input.dataset.setting] ?? '') === String(value)) return;
        mutate(() => block[input.dataset.setting] = value);
      };
      input.addEventListener('change', commitSetting);
      if (input.type === 'number' || input.type === 'color') input.addEventListener('input', () => {
        clearTimeout(settingTimer);
        settingTimer = setTimeout(commitSetting, 180);
      });
    });
    $$('[data-gallery-name-id]', $('#block-settings')).forEach(input => input.addEventListener('change', () => {
      const image = block.images.find(item => item.id === input.dataset.galleryNameId);
      if (image && image.displayName !== input.value.trim()) mutate(() => { image.displayName = input.value.trim(); });
    }));
    $('[data-delete-selected]', $('#block-settings')).addEventListener('click', () => deleteBlock(block.id));
    const addGalleryButton = $('[data-settings-gallery-upload]', $('#block-settings'));
    if (addGalleryButton) addGalleryButton.addEventListener('click', () => $(`.newsletter-block[data-id="${block.id}"] [data-gallery-upload]`, canvas).click());
    const duplicateGradeButton = $('[data-duplicate-grade]', $('#block-settings'));
    if (duplicateGradeButton) duplicateGradeButton.addEventListener('click', () => duplicateBlock(block.id));
    const clearGradeButton = $('[data-clear-grade]', $('#block-settings'));
    if (clearGradeButton) clearGradeButton.addEventListener('click', () => {
      if (block.images.length && !confirm(`Remove all ${block.images.length} photos from ${block.heading}?`)) return;
      mutate(() => { block.images = []; });
    });
  }

  function labelType(type) { return ({ imageText: 'Image + text', quote: 'Callout' })[type] || type[0].toUpperCase() + type.slice(1); }

  function handleImage(event, id) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 12 * 1024 * 1024) return showToast('Please choose an image smaller than 12 MB.');
    processImageFile(file).then(data => mutate(() => {
      const block = state.blocks.find(b => b.id === id);
      block.src = data;
      block.fileName = file.name;
      if (!block.alt) block.alt = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    })).catch(() => showToast(`Could not read ${file.name}.`));
  }

  function processImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resizeImage(reader.result, file.type, resolve);
      reader.readAsDataURL(file);
    });
  }

  function showImportProgress(label, current, total) {
    $('#import-progress').hidden = false;
    $('#import-progress-label').textContent = label;
    $('#import-progress-count').textContent = `${current} / ${total}`;
    $('#import-progress-bar').max = Math.max(total, 1);
    $('#import-progress-bar').value = current;
  }

  function hideImportProgress() { $('#import-progress').hidden = true; }

  async function prepareImageFiles(fileList) {
    const allowed = /^image\/(jpeg|png|webp|gif)$/;
    const files = [...fileList].filter(file => allowed.test(file.type) && file.size <= 12 * 1024 * 1024)
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
    const prepared = [];
    activeImports++;
    try {
      showImportProgress('Optimizing photos...', 0, files.length);
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        try {
          prepared.push({ id: uid(), src: await processImageFile(file), fileName: file.name, alt: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') });
        } catch { /* Skip unreadable images. */ }
        showImportProgress(`Optimizing ${file.name}`, index + 1, files.length);
      }
    } finally {
      activeImports--;
      hideImportProgress();
    }
    return prepared;
  }

  async function addFilesToGallery(blockId, fileList) {
    showToast('Preparing photo group...');
    const prepared = await prepareImageFiles(fileList);
    if (!prepared.length) return showToast('No supported images were found.');
    mutate(() => state.blocks.find(block => block.id === blockId).images.push(...prepared));
    showToast(`${prepared.length} photo${prepared.length === 1 ? '' : 's'} added in filename order`);
  }

  function updateGalleryImage(blockId, index, action) {
    mutate(() => {
      const images = state.blocks.find(block => block.id === blockId).images;
      if (action === 'remove') images.splice(index, 1);
      if (action === 'left' && index > 0) [images[index - 1], images[index]] = [images[index], images[index - 1]];
      if (action === 'right' && index < images.length - 1) [images[index + 1], images[index]] = [images[index], images[index + 1]];
    });
  }

  function reorderGalleryImage(blockId, sourceId, targetId) {
    if (sourceId === targetId) return;
    mutate(() => {
      const images = state.blocks.find(block => block.id === blockId).images;
      const from = images.findIndex(image => image.id === sourceId);
      let to = images.findIndex(image => image.id === targetId);
      const [image] = images.splice(from, 1);
      if (from < to) to--;
      images.splice(to, 0, image);
    });
  }

  async function addImageBatch(fileList, insertAt = state.blocks.length) {
    const images = await prepareImageFiles(fileList);
    const prepared = images.map(image => ({ ...blockDefaults.image(), ...image, caption: '' }));
    if (!prepared.length) return showToast('The selected images could not be read.');
    mutate(() => state.blocks.splice(insertAt, 0, ...prepared));
    selectedId = prepared[0].id;
    render();
    showToast(`${prepared.length} image${prepared.length === 1 ? '' : 's'} added in filename order`);
  }

  function resizeImage(src, type, done) {
    if (type === 'image/gif') return done(src);
    const img = new Image();
    img.onload = () => {
      const max = 1600;
      const ratio = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * ratio); c.height = Math.round(img.height * ratio);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      done(c.toDataURL(type === 'image/png' ? 'image/png' : 'image/jpeg', .86));
    };
    img.src = src;
  }

  function switchTemplate(name) {
    if (state.blocks.length && !confirm('Replace the current newsletter with this template? Your current version can still be restored with Undo.')) return;
    recordHistory();
    const next = createProject(name);
    state = next; selectedId = null; future = []; render(); scheduleSave(); showToast('Template applied');
  }

  function cloneForOutput() {
    const clone = canvas.cloneNode(true);
    clone.removeAttribute('id');
    clone.classList.remove('mobile');
    $$('.grade-hidden', clone).forEach(el => el.remove());
    $$('.block-tools,.gallery-item-tools,.grade-header-actions,.gallery-add-btn,input,button', clone).forEach(el => el.remove());
    $$('.newsletter-block', clone).forEach(el => {
      const type = el.dataset.type;
      if (type === 'image' && el.querySelector('.image-placeholder')) return el.remove();
      if (type === 'gallery' && el.querySelector('.gallery-empty')) return el.remove();
      if (type === 'imageText' && el.querySelector('.image-placeholder')) {
        el.querySelector('.image-frame')?.remove();
        el.querySelector('.image-text-layout')?.classList.add('output-text-only');
      }
      el.classList.add(`output-type-${type}`);
      el.classList.remove('selected', 'dragging', 'drop-before'); el.removeAttribute('data-id'); el.removeAttribute('data-type');
    });
    $$('.editable,.photo-name-edit', clone).forEach(el => { el.removeAttribute('contenteditable'); el.classList.remove('editable', 'photo-name-edit'); el.removeAttribute('data-photo-name'); el.removeAttribute('data-image-id'); });
    $$('[data-image-upload]', clone).forEach(el => { el.removeAttribute('data-image-upload'); el.removeAttribute('title'); });
    return clone;
  }

  function privacySummary() {
    const imageBlocks = state.blocks.filter(block => block.type === 'image' || block.type === 'imageText');
    const galleries = state.blocks.filter(block => block.type === 'gallery' && !block.hidden);
    const allNames = [
      ...imageBlocks.filter(block => block.showFileName && block.fileName).map(block => block.fileName),
      ...galleries.flatMap(block => block.showFileName ? block.images.map(image => image.fileName) : [])
    ];
    const genericWords = /^(art|grade|photo|image|img|scan|dsc|project|untitled|student|work)([-_ ]|$)/i;
    const possiblyPersonal = allNames.filter(name => {
      const stem = name.replace(/\.[^.]+$/, '');
      return !genericWords.test(stem) && /^[a-z]{2,}[-_ ][a-z]{2,}/i.test(stem);
    });
    const missingAlt = imageBlocks.filter(block => block.src && !block.alt).length + galleries.reduce((count, block) => count + block.images.filter(image => !image.alt).length, 0);
    return { visibleNames: allNames.length, possiblyPersonal: possiblyPersonal.length, missingAlt, hiddenGrades: state.blocks.filter(block => block.type === 'gallery' && block.hidden).length };
  }

  function updatePrivacyAudit() {
    const audit = privacySummary();
    const safe = audit.visibleNames === 0 && audit.missingAlt === 0;
    $('#privacy-audit').innerHTML = `<div><span class="privacy-status ${safe ? 'safe' : ''}">${safe ? 'OK' : '!'}</span><p><strong>${safe ? 'Privacy check looks good' : 'Review before sharing'}</strong><br>${audit.visibleNames} visible filename${audit.visibleNames === 1 ? '' : 's'} - ${audit.possiblyPersonal} possibly personal - ${audit.missingAlt} missing image description${audit.missingAlt === 1 ? '' : 's'}${audit.hiddenGrades ? ` - ${audit.hiddenGrades} hidden grade${audit.hiddenGrades === 1 ? '' : 's'}` : ''}</p></div>${audit.visibleNames ? '<button id="privacy-hide-names">Hide all filenames</button>' : ''}`;
    const hideButton = $('#privacy-hide-names');
    if (hideButton) hideButton.addEventListener('click', () => {
      mutate(() => state.blocks.filter(block => ['image', 'imageText', 'gallery'].includes(block.type)).forEach(block => { block.showFileName = false; }));
      updatePrivacyAudit();
    });
  }

  function outputStyles() {
    return `*{box-sizing:border-box}body{margin:0;background:#dedbd4;padding:40px 16px;color:${state.theme.ink}}.newsletter-canvas{--newsletter-accent:${state.theme.accent};--newsletter-ink:${state.theme.ink};--newsletter-page:${state.theme.page};--block-space:${({compact:'19px',comfortable:'28px',airy:'39px'})[state.theme.density]};width:min(100%,720px);margin:auto;background:var(--newsletter-page);color:var(--newsletter-ink);overflow:hidden}.newsletter-block{padding:var(--block-space) 54px}.hero-block{padding:72px 54px 52px}.hero-kicker{margin:0 0 18px;color:var(--newsletter-accent);font:800 10px Arial,sans-serif;letter-spacing:2px;text-transform:uppercase}.hero-date{margin:20px 0 0;font:11px Arial,sans-serif;color:#77766f}.newsletter-heading{margin:0;font:500 48px/1.05 Georgia,serif;letter-spacing:-1.8px}.newsletter-paragraph{margin:0;font:17px/1.75 Georgia,serif}.image-frame{min-height:280px;overflow:hidden;background:#ded8cd}.image-frame img{display:block;width:100%;min-height:280px;max-height:480px;object-fit:cover}.image-placeholder{min-height:280px;display:grid;place-items:center;text-align:center;color:#827e75;background:#ddd7cb}.image-caption{margin:9px 0 0;font:italic 12px Georgia,serif;color:#6e706b}.image-file-name{margin:9px 0 0;font:700 10px Arial,sans-serif;color:#626762;letter-spacing:.3px;overflow-wrap:anywhere}.image-text-layout{display:grid;grid-template-columns:1fr 1fr;align-items:stretch}.image-text-layout .image-frame,.image-text-layout img{min-height:340px}.image-text-copy{display:flex;flex-direction:column;justify-content:center;padding:44px;background:white}.image-text-copy h2{margin:0 0 14px;font:34px/1.1 Georgia,serif}.image-text-copy p{margin:0;font:16px/1.65 Georgia,serif}.gallery-heading{margin:0 0 10px;font:32px/1.1 Georgia,serif}.gallery-project-title{margin:0 0 5px;font:700 16px Arial,sans-serif;color:var(--newsletter-accent)}.gallery-description{margin:0 0 18px;font:14px/1.55 Georgia,serif;color:#5d625d}.photo-gallery{display:grid;grid-template-columns:repeat(var(--gallery-columns),minmax(0,1fr));gap:12px}.gallery-item{position:relative;margin:0;min-width:0}.gallery-item img{display:block;width:100%;aspect-ratio:1;object-fit:cover}.photo-gallery.crop-landscape img{aspect-ratio:4/3}.photo-gallery.crop-natural img{aspect-ratio:auto;object-fit:contain}.gallery-item figcaption{margin-top:6px;font:700 9px Arial,sans-serif;color:#626762;overflow-wrap:anywhere}.layout-featured .gallery-item:first-child{grid-column:span 2;grid-row:span 2}.layout-featured .gallery-item:first-child img{height:100%}.layout-process{counter-reset:step}.layout-process .gallery-item:before{counter-increment:step;content:counter(step);position:absolute;left:7px;top:7px;z-index:2;display:grid;place-items:center;width:25px;height:25px;border-radius:50%;background:var(--newsletter-accent);color:white;font:800 10px Arial,sans-serif}.layout-comparison{grid-template-columns:repeat(2,minmax(0,1fr))!important}.layout-wall{gap:17px}.layout-wall .gallery-item{padding:7px 7px 20px;background:#fff;box-shadow:0 5px 13px rgba(0,0,0,.13);transform:rotate(-1.2deg)}.layout-wall .gallery-item:nth-child(even){transform:rotate(1.4deg)}.layout-list{grid-template-columns:1fr!important}.layout-list .gallery-item{display:grid;grid-template-columns:minmax(150px,45%) 1fr;gap:16px;align-items:center}.quote-block{border-left:4px solid var(--newsletter-accent);padding-left:28px}.quote-text{margin:0;font:italic 31px/1.25 Georgia,serif}.quote-cite{display:block;margin-top:14px;font:700 10px Arial,sans-serif;letter-spacing:1.2px;text-transform:uppercase}.button-wrap{text-align:center}.newsletter-button{display:inline-block;background:var(--newsletter-accent);color:white;padding:13px 22px;border-radius:4px;text-decoration:none;font:800 12px Arial,sans-serif}.divider-line{height:1px;background:rgba(37,49,43,.25)}.font-modern .newsletter-heading{font-family:Arial,sans-serif;font-weight:800}.font-modern .newsletter-paragraph{font-family:Arial,sans-serif}.font-classic .newsletter-heading,.font-classic .newsletter-paragraph{font-family:Palatino,serif}@media(max-width:600px){body{padding:0}.newsletter-block{padding-left:28px;padding-right:28px}.newsletter-heading{font-size:36px}.image-text-layout{grid-template-columns:1fr}.image-text-copy{padding:30px}.photo-gallery{grid-template-columns:repeat(min(var(--gallery-columns),2),minmax(0,1fr))}}@media print{body{padding:0;background:white}.newsletter-canvas{width:100%}.newsletter-block{break-inside:avoid}.newsletter-block[data-type="gallery"]{break-inside:auto}.gallery-heading-row,.gallery-project-title{break-after:avoid}.gallery-item{break-inside:avoid}}`;
  }

  function downloadHtml() {
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(state.title)}</title><style>${outputStyles()}</style></head><body>${cloneForOutput().outerHTML}</body></html>`;
    downloadBlob(html, `${slug(state.title)}.html`, 'text/html');
    showToast('Web page downloaded');
  }
  function compressImageForEmail(src, maxDimension, quality) {
    return new Promise(resolve => {
      if (!src?.startsWith('data:image/')) return resolve(src);
      const image = new Image();
      image.onload = () => {
        const ratio = Math.min(1, maxDimension / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * ratio)); canvas.height = Math.max(1, Math.round(image.height * ratio));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.onerror = () => resolve(src);
      image.src = src;
    });
  }
  async function buildEmailContent() {
    const stage = document.createElement('div');
    stage.style.cssText = 'position:fixed;left:-10000px;top:0;width:720px;background:white;z-index:-1';
    const clone = cloneForOutput();
    stage.append(clone);
    document.body.append(stage);
    const images = $$('img', clone);
    const profile = images.length > 24 ? { max: 320, quality: .5 } : images.length > 12 ? { max: 440, quality: .58 } : { max: 640, quality: .68 };
    await Promise.all(images.map(async image => { image.src = await compressImageForEmail(image.src, profile.max, profile.quality); }));
    const properties = ['display','width','max-width','margin','padding','box-sizing','background-color','color','font-family','font-size','font-weight','font-style','line-height','letter-spacing','text-align','text-decoration','border','border-left','border-radius','grid-template-columns','gap','object-fit','aspect-ratio'];
    [clone, ...clone.querySelectorAll('*')].forEach(element => {
      const computed = getComputedStyle(element);
      element.style.cssText = properties.map(property => `${property}:${computed.getPropertyValue(property)}`).join(';');
    });
    const html = `<div style="margin:0;padding:24px 8px;background:#ffffff">${clone.outerHTML}</div>`;
    const text = clone.innerText;
    stage.remove();
    return { html, text, bytes: new Blob([html]).size, imageCount: images.length };
  }
  async function copyForEmail() {
    showToast('Preparing a lightweight email copy...');
    const content = await buildEmailContent();
    if (content.bytes > 5 * 1024 * 1024) return showToast('This newsletter is still too large for safe email pasting. Try fewer photos or use PDF.');
    try {
      if (navigator.clipboard?.write && window.ClipboardItem) {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([content.html], { type: 'text/html' }),
          'text/plain': new Blob([content.text], { type: 'text/plain' })
        })]);
      } else {
        const holder = document.createElement('div');
        holder.contentEditable = 'true';
        holder.style.cssText = 'position:fixed;left:-10000px;top:0';
        holder.innerHTML = content.html;
        document.body.append(holder);
        const range = document.createRange(); range.selectNodeContents(holder);
        const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range);
        document.execCommand('copy'); selection.removeAllRanges(); holder.remove();
      }
      showToast('Newsletter copied - paste it into a new email');
    } catch { showToast('Copy was blocked. Try again or download the web page.'); }
  }
  function downloadProject() { downloadBlob(JSON.stringify(state, null, 2), `${slug(state.title)}.newsletter.json`, 'application/json'); showToast('Project backup downloaded'); }
  function downloadBlob(content, name, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  function slug(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'newsletter'; }
  function printNewsletter() {
    const root = document.createElement('div'); root.id = 'print-root'; root.hidden = true; root.append(cloneForOutput()); document.body.append(root);
    const previousTitle = document.title;
    document.title = '';
    setTimeout(() => { window.print(); document.title = previousTitle; root.remove(); }, 50);
  }

  function importProject(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.schemaVersion !== 1 || !Array.isArray(data.blocks) || !data.theme || typeof data.title !== 'string') throw new Error();
        recordHistory(); state = data; selectedId = null; render(); scheduleSave(); showToast('Project imported');
      } catch { showToast('That file is not a valid Letterdrop project.'); }
    };
    reader.readAsText(file);
  }

  function showToast(message) { const toast = $('#toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400); }
  function openModal(id) { $(id).hidden = false; document.body.style.overflow = 'hidden'; }
  function closeModals() { $$('.modal').forEach(modal => modal.hidden = true); document.body.style.overflow = ''; }

  function bindUI() {
    $$('.library-block').forEach(button => {
      button.addEventListener('click', () => addBlock(button.dataset.add));
      button.addEventListener('dragstart', event => { event.dataTransfer.setData('application/x-letterdrop-block', button.dataset.add); event.dataTransfer.effectAllowed = 'copy'; });
    });
    canvas.addEventListener('dragover', event => {
      event.preventDefault();
      if ([...event.dataTransfer.types].includes('Files')) canvas.classList.add('receiving-images');
    });
    canvas.addEventListener('dragleave', event => { if (!canvas.contains(event.relatedTarget)) canvas.classList.remove('receiving-images'); });
    canvas.addEventListener('drop', event => {
      event.preventDefault();
      canvas.classList.remove('receiving-images');
      if (event.dataTransfer.files.length) {
        const targetBlock = event.target.closest('.newsletter-block');
        const gallery = targetBlock && state.blocks.find(block => block.id === targetBlock.dataset.id && block.type === 'gallery');
        if (gallery) {
          addFilesToGallery(gallery.id, event.dataTransfer.files);
          return;
        }
        const insertAt = targetBlock ? state.blocks.findIndex(block => block.id === targetBlock.dataset.id) : state.blocks.length;
        addImageBatch(event.dataTransfer.files, insertAt);
        return;
      }
      if (event.target === canvas) {
        const type = event.dataTransfer.getData('application/x-letterdrop-block');
        if (type) addBlock(type);
      }
    });
    $('#canvas-wrap').addEventListener('click', event => {
      if (!event.target.closest('.newsletter-block')) deselectBlock();
    });
    $$('.panel-tab').forEach(tab => tab.addEventListener('click', () => {
      $$('.panel-tab').forEach(x => x.classList.toggle('active', x === tab));
      $$('.tab-content').forEach(x => x.classList.toggle('active', x.id === `${tab.dataset.tab}-tab`));
      if (tab.dataset.tab === 'templates') renderCustomTemplates();
    }));
    $$('.template-card').forEach(card => card.addEventListener('click', () => switchTemplate(card.dataset.template)));
    $('#save-template-btn').addEventListener('click', () => {
      $('#template-name').value = `${state.title} template`;
      $('#template-keep-images').checked = false;
      openModal('#template-modal');
      setTimeout(() => $('#template-name').select());
    });
    $('#confirm-save-template').addEventListener('click', saveCurrentTemplate);
    $$('[data-close-template]').forEach(element => element.addEventListener('click', closeModals));
    $('#import-template-btn').addEventListener('click', () => $('#import-template-file').click());
    $('#import-template-file').addEventListener('change', event => { if (event.target.files[0]) importCustomTemplate(event.target.files[0]); event.target.value = ''; });
    $('#project-title').addEventListener('change', event => mutate(() => state.title = event.target.value.trim() || 'Untitled newsletter'));
    $('#accent-color').addEventListener('input', event => { state.theme.accent = event.target.value; applyTheme(canvas); scheduleSave(); });
    $('#text-color').addEventListener('input', event => { state.theme.ink = event.target.value; applyTheme(canvas); scheduleSave(); });
    $('#page-color').addEventListener('input', event => { state.theme.page = event.target.value; applyTheme(canvas); scheduleSave(); });
    $('#font-select').addEventListener('change', event => mutate(() => state.theme.font = event.target.value));
    $$('#density-control button').forEach(btn => btn.addEventListener('click', () => mutate(() => state.theme.density = btn.dataset.density)));
    $$('#image-name-control button').forEach(btn => btn.addEventListener('click', () => mutate(() => {
      const show = btn.dataset.imageNames === 'show';
      state.blocks.filter(block => block.type === 'image' || block.type === 'imageText' || block.type === 'gallery').forEach(block => { block.showFileName = show; });
    })));
    $('#undo-btn').addEventListener('click', undo); $('#redo-btn').addEventListener('click', redo);
    $$('.device-btn').forEach(btn => btn.addEventListener('click', () => { $$('.device-btn').forEach(x => x.classList.toggle('active', x === btn)); canvas.classList.toggle('mobile', btn.dataset.device === 'mobile'); }));
    const quickAdd = $('#quick-add');
    const quickAddMenu = $('#quick-add-menu');
    const closeQuickAdd = () => { quickAddMenu.hidden = true; quickAdd.setAttribute('aria-expanded', 'false'); };
    quickAdd.addEventListener('click', event => {
      event.stopPropagation();
      quickAddMenu.hidden = !quickAddMenu.hidden;
      quickAdd.setAttribute('aria-expanded', String(!quickAddMenu.hidden));
      if (!quickAddMenu.hidden) $('[data-quick-add]', quickAddMenu)?.focus();
    });
    $$('[data-quick-add]', quickAddMenu).forEach(button => button.addEventListener('click', () => {
      addBlock(button.dataset.quickAdd);
      closeQuickAdd();
    }));
    document.addEventListener('click', event => { if (!quickAddMenu.hidden && !event.target.closest('#quick-add-menu')) closeQuickAdd(); });
    $('#preview-btn').addEventListener('click', () => { const clone = cloneForOutput(); $('#preview-content').replaceChildren(clone); openModal('#preview-modal'); });
    $('#export-btn').addEventListener('click', () => { updatePrivacyAudit(); openModal('#export-modal'); });
    $$('[data-close-modal],[data-close-export]').forEach(el => el.addEventListener('click', closeModals));
    $('#copy-email').addEventListener('click', copyForEmail); $('#download-html').addEventListener('click', downloadHtml); $('#download-project').addEventListener('click', downloadProject); $('#print-pdf').addEventListener('click', printNewsletter);
    $('#import-btn').addEventListener('click', () => $('#import-file').click());
    $('#restore-btn').addEventListener('click', restoreLatestSnapshot);
    $('#import-file').addEventListener('change', event => { if (event.target.files[0]) importProject(event.target.files[0]); event.target.value = ''; });
    $('#new-btn').addEventListener('click', () => { if (confirm('Start a new newsletter? Download a project backup first if you want to keep this version.')) { recordHistory(); state = createProject('editorial'); selectedId = null; render(); scheduleSave(); } });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') { closeModals(); closeQuickAdd(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); redo(); }
    });
    window.addEventListener('beforeunload', event => { if (activeImports > 0) { event.preventDefault(); event.returnValue = ''; } });
  }

  async function init() {
    state = await loadProject() || state;
    bindUI();
    render();
    renderCustomTemplates();
    scheduleSave();
    updateStorageStatus();
  }

  init();
})();
