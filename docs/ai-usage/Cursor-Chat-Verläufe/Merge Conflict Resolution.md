# Merge conflicts resolution
_Exported on 17.8.2026 at 14:33:58 MESZ from Cursor (3.16.17)_

---

**User**

Resolve these 7 merge conflicts across 2 files @Branch 

---

**Cursor**

I'll inspect the conflicted files and resolve the merge markers by keeping the correct combined logic.

Reading the conflicted sections to merge both sides correctly.

Checking which helper functions exist and how the rest of the generator is structured:

Comparing both sides of the conflicted functions to pick a coherent merge.

Resolving conflicts by keeping upstream's `aktenProfile` model and integrating the stashed `aktenart` / archiv-fragment features that already exist in the tree.

All **7 merge conflicts** in `data.js` and `generator.js` are resolved and staged.

**Resolution approach:** Keep the current `aktenProfile` / `pfad: null` data model, and keep the new `aktenart` + Archivfragment features from the stash.

| File | What was kept |
|------|----------------|
| `data.js` | Upstream docs, plus a note about `ARCHIV_AKTENARTEN` |
| `generateAktenMetadaten` | Upstream profile-based metadata (stash helpers like `kategorienKataloge` aren’t in this branch) |
| `buildAkte` / `normalizeAkte` | Stash `aktenart` + Zusatzfelder, with variante texts instead of missing `generateAktenTexte` |
| `pickArchiveAkten` | Stash 0–2 bildlose Akten; also fixed a missing `ohneBild` argument |

No conflict markers left; both files are staged with the rest of the Archivfragment changes.

