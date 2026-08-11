# Letterdrop

A dependency-free, local-first drag-and-drop newsletter builder designed for GitHub Pages.

## Features

- Add and reorder headings, paragraphs, images, image-and-text features, callouts, buttons, and dividers
- Inline text editing and per-block settings
- Three starter templates and global theme controls
- Desktop and mobile preview modes
- Undo and redo
- IndexedDB autosave with automatic migration from the original localStorage format
- Rolling recovery snapshots and visible browser-storage usage
- Portable project import/export
- Self-contained HTML download and browser PDF printing
- Browser-side image resizing; images are never uploaded
- Batch image drag-and-drop with natural filename sorting (`photo2` before `photo10`)
- Optional per-image filename display
- Multi-photo gallery blocks with editable grade/class headings, 1–4 column layouts, crop styles, and per-photo reordering
- Drag-to-reorder gallery photos and a ready-made K–5 grade showcase template
- Progress feedback and unload protection during large image imports

## Run locally

No build step is required. Serve the directory with any static server:

```powershell
npx.cmd serve .
```

You can also open `index.html` directly, although a local server more closely matches GitHub Pages.

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Copy this project into it and push to the default branch.
3. Open **Settings → Pages** and choose **GitHub Actions** as the source.
4. The included workflow publishes the site automatically.

The site will be available at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

## Data and privacy

Projects are saved to IndexedDB in the current browser. Existing projects from the original localStorage release migrate automatically. Uploaded images are resized in the browser and stored inside the project. Export a `.newsletter.json` backup to move a project to another browser or device.

GitHub Pages is static hosting, so this release has no accounts, cloud sync, subscriber database, or direct email delivery.

