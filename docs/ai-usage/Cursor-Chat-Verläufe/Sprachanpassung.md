# Archive interface translation button
_Exported on 18.8.2026 at 15:03:58 MESZ from Cursor (3.16.17)_

---

**User**

Könnte man in der ecke vom archiv einen en un de button einbauen, dass sich die inhalte im archivinterface übersetzen? Also der erinnerungsraum soll immer deutsch sein, aber alles was im archivinterface abläuft kann auch auf englisch über diesen button übersetzt werden

---

**Cursor**

Ich schaue mir zuerst an, wie das Archivinterface aufgebaut ist und wo die Texte sitzen, damit der EN/DE-Button nur dort greift und der Erinnerungsraum deutsch bleibt.

Die HTML-Struktur ist klar — als Nächstes lese ich die JS-Dateien, um alle Archiv-Texte und die Trennung zum Erinnerungsraum zu erfassen.

Die Trennung ist klar: Archiv auf dem Laptop, Erinnerungsraum auf der Projektion. Als Nächstes prüfe ich, wie die Akten erzeugt werden und wie groß der zu übersetzende Textbestand ist.

**Umfang der Übersetzung**

> **Was genau soll der EN/DE-Button im Archiv übersetzen? Der Erinnerungsraum (Beamer) bleibt in beiden Fällen deutsch.**
> - Alles im Archiv: Oberfläche (Startbildschirm, Buttons, Pop-ups) UND die Akteninhalte (Titel, Beschreibungen, Metadaten, Bewertungen) ✔
> - Nur die Oberfläche: Starttext, Buttons, Überschriften, Feldnamen (Objekttyp, Herkunft …). Die Akten selbst bleiben deutsch.
> - Nur Buttons, Überschriften und Hinweistexte — Feldnamen und Akteninhalte bleiben deutsch.

Der Umfang ist klar: Oberfläche und Akteninhalte im Archiv, Erinnerungsraum bleibt deutsch. Ich skizziere jetzt die Architektur, damit Sprache und Projektion nicht ineinanderlaufen.

---

**User**

<timestamp>Monday, Aug 17, 2026, 4:56 PM (UTC+2)</timestamp>
<system_notification>
The following task has finished. If you were already aware, ignore this notification and do not restate prior responses.

<task>
kind: subagent
status: success
task_id: 3fda3e6e-75de-4f9c-92e9-76e0d3d786e6
title: Explore archive interface
tool_call_id: call-e54b370a-5281-4f5f-9bf3-cfa4b2c00d5f-0
fc_c6e1a51e-84b5-9c09-a8ec-995b44e23e15_0
agent_id: 3fda3e6e-75de-4f9c-92e9-76e0d3d786e6
detail: <user_visible_high_level_summary>
The archive lives in `index.html`/`app.js` (laptop); the Erinnerungsraum is a separate page `projection.html`/`projection.js` (beamer), synced via localStorage. There is no i18n yet—all German strings are hardcoded in HTML/JS. “In der Ecke” matches the former bottom-right reset spot (`position: fixed; right/bottom: 1.5rem`); that button is gone, Shift+R remains.
</user_visible_high_level_summary>
<response>
## Architecture overview

Two separate HTML pages share one `localStorage` state (`wez-installation-state`). No frameworks, no JSON content files, no i18n.

| Role | Page | Controller | Body class |
|------|------|------------|------------|
| **Archiv** (laptop) | `/Users/michelle.berger/Desktop/Master/Coding/wenn-erinnerung-zur-entscheidung-wird/index.html` | `app.js` | `archive-view` |
| **Erinnerungsraum** (beamer) | `/Users/michelle.berger/Desktop/Master/Coding/wenn-erinnerung-zur-entscheidung-wird/projection.html` | `projection.js` | `projection-view` |

Shared: `style.css`, `data.js`, `generator.js`, `archiv-darstellung.js`, `state.js`.

Docs: `README.md`, `assests/documentation/archive-taxonomy.md`.

---

## 1. Project structure (key files)

```
index.html → Archiv UI shell + start/confirmation/modal markup
projection.html → Erinnerungsraum shell (6 slots)
app.js → Archive views, selection, displacement
projection.js → Memory-room rendering + Shift+L light mode
state.js → localStorage, MAX_MEMORY_SLOTS=6, OFFER_COUNT=3
data.js → All German catalogs + curated image akten (~1670 lines)
generator.js → Builds akten from catalogs
archiv-darstellung.js → Image-less “fragment” UI
style.css → Both UIs
assests/images/… → Category image folders
assests/documentation/archive-taxonomy.md
```

---

## 2. Archive interface — where & what

**Entry:** `index.html` + `app.js`.

**View modes** (`app.js` `setViewMode`): `start` → `offer` → (`memory-full-modal`) → `displacement` → `confirmation` → back to `start`.

### UI elements (no user-facing filters)

| Element | Location | Notes |
|---------|----------|--------|
| Start screen | `#start-screen` | Welcome + „Archiv öffnen“ |
| Offer grid | `#offer-section` / `#offer-container` | 3 akten + select buttons |
| Confirmation | `#confirmation-section` | After successful pick |
| Full-room modal | `#memory-full-modal` | Overlay when room full |
| Displacement | `#displacement-section` | Same 3-col card layout; „verdrängen“ |
| Nav ‹ › | `#memory-review-prev/next` | Displacement pages of 3 |
| Reset | **removed from DOM** | Shift+R only; `.btn-reset` CSS leftover |

**Not present:** search, taxonomy filters, language toggle, visible reset button, permanent Erinnerungsraum preview on the laptop (removed earlier).

Flow snippet:

```381:392:/Users/michelle.berger/Desktop/Master/Coding/wenn-erinnerung-zur-entscheidung-wird/app.js
 function setViewMode(mode) {
 viewMode = mode;
 const isStart = mode === 'start';
 const isDisplacement = mode === 'displacement';
 const isConfirmation = mode === 'confirmation';

 startScreen.hidden = !isStart;
 archiveInterface.hidden = isStart;
 offerSection.hidden = isStart || isDisplacement || isConfirmation;
 displacementSection.hidden = !isDisplacement;
 confirmationSection.hidden = !isConfirmation;
 }
```

---

## 3. Erinnerungsraum — separation from archive

**Structurally separate page**, not a panel inside the archive:

```9:18:/Users/michelle.berger/Desktop/Master/Coding/wenn-erinnerung-zur-entscheidung-wird/projection.html
<body class="projection-view projection-view--dark">
 <div class="projection-shell">
 <div class="projection-shell__topbar" aria-hidden="true"></div>
 <div class="projection-shell__content">
 <h1 class="projection-shell__title">Erinnerungsraum</h1>
 <main class="projection-main">
 <div id="memory-room" class="memory-room" role="list" aria-label="Öffentlicher Erinnerungsraum"></div>
```

| | Archiv | Erinnerungsraum |
|--|--------|-----------------|
| Device | Laptop | Beamer |
| Title | „Archiv“ | „Erinnerungsraum“ |
| Content | 3 selectable ring-binder cards + meta/criteria | 6 exhibit tiles (image + title/year + short text) |
| Interaction | Buttons, modal, displacement | Display-only (+ Shift+L theme) |
| Sync | Writes `memoryRoom` | Reads `memoryRoom` live |

Displacement reuses archive card chrome on `index.html` temporarily; the **public** Erinnerungsraum is only `projection.html`.

---

## 4. Translatable strings — archive UI chrome

### A. Fixed chrome (`index.html`)

- Document title: `Wenn Erinnerung zur Entscheidung wird — Archiv`
- `Archiv` (h1 ×2)
- `Willkommen im Archiv.`
- `Im Folgenden erhalten Sie Zugriff auf einen begrenzten Archivbestand.`
- Body: choose one Akte for Erinnerungsraum…
- Disclaimer: fictional events…
- `Archiv öffnen`
- sr-only: `Aktuelle Archivakten`
- Confirmation primary/secondary + `Archiv verlassen`
- Modal: room full / must displace + `Verdrängung Starten`
- aria: `Akten im Erinnerungsraum`, `Vorherige Akten`, `Nächste Akten`

### B. JS-injected chrome (`app.js`)

- Button: `In den Erinnerungsraum aufnehmen`
- Button: `Diese Akte verdrängen`
- Empty value: `—`
- Meta field labels: `Objekttyp`, `Aktenart`, `Herkunft`, `Provenienz`, `Sammlung`, `Dokumentationsgrad`, `Erhaltungszustand`, `Materialhinweis`, `Fehlende Informationen`
- Criteria fallback labels: `Institutionelle Relevanz`, `Aufnahmeempfehlung`
- aria: `Archivdaten`, `Institutionelle Bewertung`
- `confirm()`: `Installation wirklich zurücksetzen? Der Erinnerungsraum und alle bisherigen Entscheidungen werden gelöscht.`

### C. Generated labels shown on archive cards (`generator.js` / `data.js`)

- Relevanz values: `hoch` / `mittel` / `gering`
- Empfehlungen: `Aufnahme empfohlen` / `Aufnahme prüfenswert` / `Aufnahme nicht priorisiert`
- Aktenarten: `Archivvermerk`, `Bestandsnotiz`, `Dokumentationsfragment`, `digitaler Datensatz`, `Überlieferungslücke` (+ vermerke)
- Categories: Alltagskultur, Arbeit, Migration, Öffentlicher Raum, Protest, Kultur und Rituale
- Fallback: `nicht angegeben`
- Fragment aria (`archiv-darstellung.js`): `Archivfragment ohne Bild`

### D. Archive **content** (also German, but data — not chrome)

Hardcoded in `data.js`:

- `ARCHIV_BILDER[].varianten[]`: `titel`, `kurzbeschreibung`, `kontextbeschreibung`, `herkunft`, `provenienz`, `sammlung`, `objekttyp`, …
- `KONTROLLIERTE_WERTE`: catalogs, title/context templates, dokumentationsfragmente, etc.

Cards show **kontextbeschreibung** (archive); projection shows **kurzbeschreibung**.

**No filters** in the UI. `filter*` in `generator.js` is internal generation logic only.

---

## 5. How content is stored

| Source | Format | Role |
|--------|--------|------|
| `data.js` | JS constants | All catalogs + curated akten (German) |
| `generator.js` | JS | Assembles akten at runtime |
| `index.html` / `app.js` | HTML/JS strings | UI chrome |
| `localStorage` | JSON via `state.js` | Live `memoryRoom` + `currentOffer` |
| Markdown under `assests/documentation/` | Docs only | Not loaded by the app |
| Images | `assests/images/…` | Referenced by path in `data.js` |

No separate `.json` / `.yml` locale files.

---

## 6. i18n infrastructure

**None.** Only `lang="de"` on both HTML docs. No translation maps, no locale switcher, no `i18n` library. `translate` in CSS is only `transform: translateY`.

Implication for EN/DE on archive only: you’d introduce strings + re-render for `index.html`/`app.js` (and optionally generated field labels), while leaving `projection.html`/`projection.js` + German content in state as-is (or translating chrome only, not projected titles/descriptions).

---

## 7. „In der Ecke vom Archiv“ — visual layout

Archive layout:

```
┌─────────────────────────────────────┐ ← dark topbar (14px)
│ ARCHIV │ ← centered title
│ │
│ [Akte] [Akte] [Akte] │ ← 3-col offer / displacement
│ [Button] [Button] [Button] │
│ │
│ ★ │ ← former reset corner
└─────────────────────────────────────┘
```

- Start screen also has a **beige footer bar** (`start-screen__footerbar`); the active archive shell has **topbar only** (no footer).
- Historical corner control: reset button **bottom-right**, fixed:

```804:808:/Users/michelle.berger/Desktop/Master/Coding/wenn-erinnerung-zur-entscheidung-wird/style.css
.btn-reset {
 position: fixed;
 right: 1.5rem;
 bottom: 1.5rem;
 z-index: 50;
```

User asked for that as „unten rechts“; later removed; reset is **Shift+R**. CSS for `.btn-reset` remains unused. That bottom-right corner is the natural spot for an **EN / DE** toggle (parent intent: translate archive interface only; Erinnerungsraum stays German).

Other corners: top = decorative ink bar; no other corner controls. Displacement arrows sit **outside** the grid (`left/right: -3.25rem`), not in page corners.

---

## Distinction summary (for translation scope)

| Layer | Examples | Page |
|-------|----------|------|
| **Archive UI chrome** | Willkommen…, Archiv öffnen, In den Erinnerungsraum aufnehmen, Verdrängung Starten, meta field labels | `index.html` / `app.js` |
| **Archive content** | Akte titles, kontextbeschreibung, provenienz text, categories, aktenart labels | `data.js` → rendered in archive cards |
| **Erinnerungsraum chrome** | Erinnerungsraum, freier Speicherplatz, Platz N | `projection.html` / `projection.js` |
| **Erinnerungsraum content** | titel, jahr, kurzbeschreibung, images/fragments | Same akte objects; keep DE if projection stays German |

---

## How the archive is shown (pipeline)

1. `openArchive()` → `offer` mode 
2. `ensureOfferSet` / `pickArchiveAkten` → 3 akten in state 
3. `renderOfferSet` → `renderOfferColumn` → `renderAkteCard` + select button 
4. Select → if room &lt; 6: `addToMemoryRoom` + confirmation; if full: modal → displacement → `replaceInMemoryRoom` 
5. Projection tab receives update via `storage` / `BroadcastChannel` and paints 6 slots 

Shared state shape (`README` / `state.js`): `{ version, memoryRoom[], currentOffer[], usedBildIds, usedOhneBildKeys, updatedAt }`.
</response>
output_path: /Users/michelle.berger/.cursor/projects/Users-michelle-berger-Desktop-Master-Coding-wenn-erinnerung-zur-entscheidung-wird/agent-transcripts/abc78b88-3c07-408c-a1bc-6c07e6fbc607/subagents/3fda3e6e-75de-4f9c-92e9-76e0d3d786e6.jsonl
</task>
</system_notification>
<user_query>Perform any necessary follow-up actions in response to the subagent completion above. If no follow-up work is needed, no further action is required. If you mention an agent or subagent in your response, link it with the `[Name](id)` Don't use generic label such as `[agent]`, `[worker]`, or `[subagent]`. For cloud subagents, when the agent has edited code, link to `[Review](bc-id#changes)`, or, if you know the exact added and deleted line counts, `[Review +A −D](bc-id#changes)`, replacing A and D with those counts. Never write A or D literally. Use `[Try Live](bc-id#desktop)` only when the agent used computer use. Don't repeat the same confirmation every time.</user_query>

---

**Cursor**

Die Erkundung bestätigt den Plan. Ich passe nur die Button-Position an: unten rechts, dort wo früher der Reset-Button saß.

Die Codebasis bestätigt den Plan: Archiv und Erinnerungsraum sind getrennte Seiten, es gibt noch keine Übersetzung, alle Texte sitzen in HTML/`data.js`.

Eine Anpassung: Der DE/EN-Schalter kommt **unten rechts** — in die Ecke, in der früher der Reset-Button lag. Reset bleibt bei Shift+R.

Wenn du den Plan so freigibst, setze ich ihn um.

---

**User**

Kannst du auch die text übersetzen? und dann schreiben wir unten links hin, in klein kursiv, dass es maschinell üerbsetzt wurde

---

**Cursor**

Die Texte im Archiv sind schon Teil des Plans. Ich ergänze den Hinweis unten links, klein und kursiv, dass die englische Fassung maschinell übersetzt wurde.

Ja — übersetzt wird **alles im Archiv**: Oberfläche und die Aktentexte (Titel, Beschreibungen, Metadaten, Bewertungen, Vermerke). Der Erinnerungsraum bleibt deutsch.

Zusätzlich kommt bei Englisch **unten links** ein kleiner kursiver Hinweis:

*This content was machine-translated.*

Er erscheint nur, wenn EN aktiv ist; bei Deutsch bleibt die Ecke leer. Der Sprachschalter bleibt unten rechts.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um und beginne mit dem Sprachmodul, damit Oberfläche und Akteninhalte im Archiv umgeschaltet werden können.

Zuerst lege ich das Sprachmodul und die Schalter-UI an; danach folgen die zweisprachigen Daten und die Generator-Anbindung.

Die Kataloge sind zweisprachig. Als Nächstes hänge ich die englischen Texte an die 47 Bildakten und passe den Generator an.

Die Sprachumschaltung im Archiv ist eingebaut. Der Erinnerungsraum auf dem Beamer bleibt deutsch.

**Unten rechts:** Schalter `DE | EN`  
**Unten links (nur bei EN):** *This content was machine-translated.*

Übersetzt werden Startbildschirm, Buttons, Pop-ups, Feldnamen und die Aktentexte (Titel, Beschreibungen, Metadaten, Bewertungen, Vermerke). Die Wahl gilt nur für den Archiv-Tab und wird nicht an die Projektion weitergegeben.

Zum Testen `index.html` öffnen und unten rechts auf EN klicken. `projection.html` sollte unverändert auf Deutsch bleiben.

---

**User**

sieht gut aus, kannst du aber bitte es so machen, dass der button nicht mit der akte überlappt alos gerne noch etwas weiter runter und das die akten im englischen die slebe größe haben wir im deutsche?

---

**Cursor**

Ich schaue mir Layout und Kartengrößen an, damit der Sprachschalter nicht mehr über den Akten sitzt und die englischen Karten dieselbe Höhe behalten.

Ich rücke den Schalter an den unteren Rand und begrenze die Kartenhöhe, damit Englisch nicht mehr Zeilen braucht als Deutsch.

Zwei Anpassungen:

**Schalter:** Er sitzt jetzt direkt am unteren Rand. Die Akten haben darunter extra Abstand, damit sie ihn nicht mehr überdecken.

**Kartengröße:** Titel, Beschreibung und Metadaten sind begrenzt. Längere englische Texte werden abgeschnitten statt die Karte zu vergrößern — Deutsch und Englisch nutzen denselben Platz.

---

**User**

jetzt ist es aber nicht mehr auf den vollschirmmodus ausgerichetet. bitte aktengröße wieder so machen, wie sie vor dem englsih modus war

---

**Cursor**

Die Karten sollen wieder die alte Vollbild-Größe bekommen. Ich setze das Raster und die Abstände zurück und lasse den Sprachschalter unten, damit er nicht überlappt.

Die Akten sind wieder im **ursprünglichen Vollbild-Layout**: gleiche Größe und Abstände wie vor den English-Anpassungen. Der DE/EN-Schalter bleibt unten am Rand, außerhalb der Karten.

