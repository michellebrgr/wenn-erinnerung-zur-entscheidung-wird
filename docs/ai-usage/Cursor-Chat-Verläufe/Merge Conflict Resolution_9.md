# Merge conflicts resolution
_Exported on 17.8.2026 at 14:54:03 MESZ from Cursor (3.16.17)_

---

**User**

Resolve these 27 merge conflicts across 6 files @Branch 

---

**Cursor**

I'll find the merge conflicts and inspect each file so we can resolve them consistently.

There are six unmerged files. I'll inspect the merge state and every conflict so we can keep the right version of each change.

This is a stash apply, not a branch merge. I'll read the conflicted files and related code so we can keep the newer taxonomy work.

The stash holds the newer taxonomy work; HEAD still has the older generator. I'll compare both versions so we can keep the new system and the selection UI.

I'll pull the full stash versions of the remaining files so we can merge them cleanly with the current selection UI.

The stash has the taxonomy rewrite and curated files; HEAD still has the current archive UI. I'll keep both: stash data/generator/styles, and HEAD’s selection flow in `app.js`.

All **27 conflicts in 6 files** are resolved and staged on `Akten-Inhalte`.

The conflicts came from a stash apply. I kept the newer Akten-Inhalte work and fitted it to the current archive UI.

**Kept from the stash (new taxonomy)**
- `data.js` — category catalogs, Aktenarten, curated image files
- `generator.js` — catalog-based generation and institutional scoring
- `archiv-darstellung.js` and `archive-taxonomy.md` — new files for image-less files
- Card look in `style.css` — binder holes and archive fragments

**Kept from the current branch (working UI)**
- Click-to-select cards with `data-id` and “Klicken zum Aufnehmen”
- Displacement view, reset button, and existing `index.html` layout

`index.html` and `projection.html` now load `archiv-darstellung.js`, so image-less files can render their archive fragments.

Nothing is committed yet. Say if you want a commit.

