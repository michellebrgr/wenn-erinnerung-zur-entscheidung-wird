# Merge conflict resolution
_Exported on 17.8.2026 at 14:51:06 MESZ from Cursor (3.16.17)_

---

**User**

Resolve this merge conflict @Branch 

---

**Cursor**

I'll inspect the conflicted files and resolve the merge markers.


Only `data.js` has a conflict: HEAD removed an outdated note because `generator.js` already uses `ARCHIV_AKTEN`. I'll resolve by keeping HEAD and staging the file.


The merge conflict in `data.js` is resolved.

**What conflicted:** A comment block in the file header. The incoming branch still had this note:

> *Hinweis: Generator und Darstellung nutzen diese Struktur noch nicht — sie werden in einem späteren Schritt angepasst.*

**Resolution:** That note was removed (kept your HEAD version). It’s outdated because `generator.js` already reads from `ARCHIV_AKTEN` and maps the new fields via `normalizeAkte()`.

The merge is ready to conclude. Run:

```bash
git commit
```

I didn’t create the commit — say if you want me to.

