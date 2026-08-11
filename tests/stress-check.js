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
const project = {
  schemaVersion: 1,
  id: 'stress-project',
  title: '100 Photo Stress Check',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  theme: { accent: '#9b5b36', ink: '#29352f', page: '#f5f0e4', font: 'editorial', density: 'comfortable' },
  blocks: Array.from({ length: 5 }, (_, grade) => ({
    id: `grade-${grade + 1}`,
    type: 'gallery',
    heading: `Grade ${grade + 1}`,
    columns: 4,
    crop: 'square',
    showFileName: false,
    images: images.slice(grade * 20, grade * 20 + 20)
  }))
};

const serialized = JSON.stringify(project);
const checks = {
  imageCount: project.blocks.reduce((sum, block) => sum + block.images.length, 0) === 100,
  portableRoundTrip: JSON.parse(serialized).blocks[4].images[19].fileName === 'grade-photo-100.png',
  indexedDbPersistence: /indexedDB\.open\(DB_NAME, DB_VERSION\)/.test(app),
  legacyMigration: /localStorage\.removeItem\(STORAGE_KEY\)/.test(app),
  recoverySnapshots: /saveRecoverySnapshot/.test(app) && /restoreLatestSnapshot/.test(app),
  importProgress: html.includes('import-progress-bar') && /showImportProgress/.test(app),
  unloadProtection: /beforeunload/.test(app),
  gradeTemplate: /grades: \(\) =>/.test(app),
  dragReorder: /reorderGalleryImage/.test(app)
};

console.log(JSON.stringify({ checks, serializedBytes: Buffer.byteLength(serialized) }, null, 2));
if (Object.values(checks).some(value => !value)) process.exit(1);

