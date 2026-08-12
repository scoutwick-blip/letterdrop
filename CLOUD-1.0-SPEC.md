# Letterdrop Cloud 1.0 specification

## Outcome

Letterdrop remains fully usable without an account. Signing in adds multiple newsletters, cross-device synchronization, and private cloud image storage. IndexedDB remains the offline working copy and recovery layer.

## Architecture

- GitHub Pages continues serving the static application.
- Supabase Auth supplies passwordless email sign-in first; Google can be added later.
- Postgres stores newsletter metadata and project JSON.
- Private Supabase Storage stores image files.
- IndexedDB keeps the active project, project index, pending operations, and recovery snapshots.
- Only the Supabase URL and publishable key are exposed to the browser. Secret/service-role keys are prohibited.

## User experience

1. A new **Cloud** button offers â€œContinue locallyâ€ or passwordless email sign-in.
2. Signing in never uploads automatically the first time. The user chooses **Save this newsletter to cloud**.
3. **My newsletters** lists local and cloud projects with title, modified date, sync state, duplicate, and delete.
4. The editor status becomes one of: Local only, Saving locally, Cloud synced, Sync pending, Offline, or Needs review.
5. Signing out leaves the local working copy available but removes access to private cloud images after the session expires.

## Data model

`newsletters` stores one row per project:

- `id`: cloud UUID
- `owner_id`: authenticated user
- `client_id`: permanent local project ID
- `title`
- `project`: JSON without large data-URL image payloads after migration
- `revision`: monotonic conflict counter
- `device_id`: last writer
- `created_at`, `updated_at`, `deleted_at`

Storage paths use `user-id/newsletter-id/image-id.ext`. Original and displayed filenames remain in project JSON. The stored file name is an opaque image ID.

## Synchronization rules

- Local writes always complete first.
- Cloud writes are debounced for two seconds and queued while offline.
- Each write sends the last known `revision`.
- If the server revision still matches, update the row and increment revision.
- If it differs, do not silently overwrite. Create a local conflict copy named â€œTitle - conflict copy,â€ keep both versions, and show **Review versions**.
- Image upload completes before project JSON points to its storage path.
- Deletion is soft for 30 days through `deleted_at`; image cleanup runs after the undo window.
- A local project becomes cloud-backed only through an explicit user action.

## Image migration

1. Find every data-URL image in single, image-and-text, and gallery blocks.
2. Convert the data URL to a Blob.
3. Upload with an opaque ID under the owner/newsletter folder.
4. Replace `src` with `storagePath` plus a temporary signed URL cache.
5. Keep the IndexedDB project untouched until every upload succeeds.
6. Commit the cloud row atomically after uploads finish.
7. On failure, retain the complete local project and mark sync pending.

## Security

- Row Level Security is mandatory on every application table.
- Every newsletter policy requires `auth.uid() = owner_id`.
- Storage policies restrict the first path segment to the authenticated user ID.
- The image bucket is private.
- Published newsletters will use a separate public snapshot system in Publish 1.0; private project rows are never made public.
- No student names, photos, or artwork are sent to AI as part of Cloud 1.0.

## Local database upgrade

IndexedDB version 3 adds:

- `projectIndex` keyed by project ID
- `syncQueue` keyed by operation ID
- `cloudMeta` keyed by project ID

The existing `projects/current` record is preserved and added to the project index on first launch. Existing data URLs remain valid until the user explicitly enables cloud storage for that project.

## Limits and cost guardrails

- Warn at 750 MB of cloud storage and stop new uploads at 900 MB on the free plan.
- Resize uploads to Letterdrop's existing 1600 px ceiling before cloud upload.
- Display per-project and account storage estimates.
- Avoid Supabase image transformations on the free plan; Letterdrop performs resizing locally.
- Provide project export before destructive cloud actions.

## Delivery sequence

1. Run `supabase/schema.sql` in a new Supabase project.
2. Configure the GitHub Pages URL and localhost as Auth redirect URLs.
3. Add `cloud-config.js` with the project URL and publishable key.
4. Add the Supabase browser client, auth modal, and session state.
5. Upgrade IndexedDB and build the multi-project dashboard.
6. Implement image migration and private signed-URL loading.
7. Implement the sync queue and conflict copies.
8. Test local-only, offline, sign-out, two-device conflicts, failed uploads, deletion recovery, and storage limits.

## Definition of done

- Local-only usage remains functional with no network or account.
- A signed-in user can create, rename, duplicate, open, and delete multiple newsletters.
- The same newsletter and its images open on a second device.
- Offline changes synchronize after reconnecting.
- Concurrent changes never silently destroy either version.
- One user cannot query or download another user's newsletters or images.
- Existing Letterdrop projects migrate without losing content.

