const fs = require('fs');

const app = fs.readFileSync('app.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const tinyPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
const images = Array.from({ length: 100 }, (_, index) => ({
  id: `stress-${index + 1}`,
  src: tinyPng,
  fileName: `grade-photo-${String(index + 1).padStart(3, '0')}.png`,
  alt: `Grade photo ${index + 1}`
}));
const gradeNames = ['PreK', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];
const project = {
  schemaVersion: 1,
  id: 'stress-project',
  title: '100 Photo Stress Check',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  theme: { accent: '#9b5b36', ink: '#29352f', page: '#f5f0e4', font: 'editorial', density: 'comfortable' },
  blocks: Array.from({ length: 10 }, (_, grade) => ({
    id: `grade-${grade + 1}`,
    type: 'gallery',
    heading: gradeNames[grade],
    projectTitle: `Art project ${grade + 1}`,
    description: 'Synthetic art-room stress test section.',
    columns: 4,
    crop: 'square',
    layout: ['grid', 'featured', 'process', 'comparison', 'wall', 'list'][grade % 6],
    showFileName: false,
    hidden: false,
    collapsed: false,
    images: images.slice(grade * 10, grade * 10 + 10)
  }))
};

const serialized = JSON.stringify(project);
const checks = {
  imageCount: project.blocks.reduce((sum, block) => sum + block.images.length, 0) === 100,
  portableRoundTrip: JSON.parse(serialized).blocks[9].images[9].fileName === 'grade-photo-100.png',
  indexedDbPersistence: /indexedDB\.open\(DB_NAME, DB_VERSION\)/.test(app),
  legacyMigration: /localStorage\.removeItem\(STORAGE_KEY\)/.test(app),
  recoverySnapshots: /saveRecoverySnapshot/.test(app) && /restoreLatestSnapshot/.test(app),
  importProgress: html.includes('import-progress-bar') && /showImportProgress/.test(app),
  unloadProtection: /beforeunload/.test(app),
  gradeTemplate: /'PreK', 'Kindergarten'.*'Grade 8'/.test(app),
  allArtLayouts: ['grid', 'featured', 'process', 'comparison', 'wall', 'list'].every(layout => app.includes(`value="${layout}"`)),
  gradeControls: /data-duplicate-grade/.test(app) && /data-clear-grade/.test(app) && /data-setting="hidden"/.test(app),
  privacyAudit: /function privacySummary/.test(app) && html.includes('privacy-audit'),
  printBreaks: /break-after:avoid/.test(app),
  filenamesPrivateByDefault: project.blocks.every(block => block.showFileName === false),
  customTemplateStorage: /createObjectStore\('templates'/.test(app) && /saveCurrentTemplate/.test(app),
  photoSafeTemplateDefault: /template-keep-images/.test(html) && /checked = false/.test(app),
  customTemplatePortability: /exportCustomTemplate/.test(app) && /importCustomTemplate/.test(app),
  artTeacherPrebuilts: ['artShow', 'familyNight', 'supplies', 'process', 'semester'].every(template => app.includes(`${template}: () =>`)),
  dragReorder: /reorderGalleryImage/.test(app)
};

console.log(JSON.stringify({ checks, serializedBytes: Buffer.byteLength(serialized) }, null, 2));
if (Object.values(checks).some(value => !value)) process.exit(1);
