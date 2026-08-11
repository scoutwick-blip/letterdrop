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
      } catch { showToast('That file is not a valid L…5232 tokens truncated…idden = false;
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
    $$('.block-tools,.gallery-item-tools,.grade-header-actions,.gallery-add-btn,input', clone).forEach(el => el.remove());
    $$('.newsletter-block', clone).forEach(el => { el.classList.remove('selected', 'dragging', 'drop-before'); el.removeAttribute('data-id'); el.removeAttribute('data-type'); });
    $$('.editable', clone).forEach(el => { el.removeAttribute('contenteditable'); el.classList.remove('editable'); });
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
  function downloadProject() { downloadBlob(JSON.stringify(state, null, 2), `${slug(state.title)}.newsletter.json`, 'application/json'); showToast('Project backup downloaded'); }
  function downloadBlob(content, name, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([content], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); }
  function slug(value) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'newsletter'; }
  function printNewsletter() {
    const root = document.createElement('div'); root.id = 'print-root'; root.hidden = true; root.append(cloneForOutput()); document.body.append(root);
    setTimeout(() => { window.print(); root.remove(); }, 50);
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
    $('#quick-add').addEventListener('click', () => addBlock('paragraph'));
    $('#preview-btn').addEventListener('click', () => { const clone = cloneForOutput(); $('#preview-content').replaceChildren(clone); openModal('#preview-modal'); });
    $('#export-btn').addEventListener('click', () => { updatePrivacyAudit(); openModal('#export-modal'); });
    $$('[data-close-modal],[data-close-export]').forEach(el => el.addEventListener('click', closeModals));
    $('#download-html').addEventListener('click', downloadHtml); $('#download-project').addEventListener('click', downloadProject); $('#print-pdf').addEventListener('click', printNewsletter);
    $('#import-btn').addEventListener('click', () => $('#import-file').click());
    $('#restore-btn').addEventListener('click', restoreLatestSnapshot);
    $('#import-file').addEventListener('change', event => { if (event.target.files[0]) importProject(event.target.files[0]); event.target.value = ''; });
    $('#new-btn').addEventListener('click', () => { if (confirm('Start a new newsletter? Download a project backup first if you want to keep this version.')) { recordHistory(); state = createProject('editorial'); selectedId = null; render(); scheduleSave(); } });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeModals();
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

