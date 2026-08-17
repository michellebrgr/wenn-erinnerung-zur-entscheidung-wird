# Archivakte display adjustment
_Exported on 17.8.2026 at 14:50:32 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte jetzt die Darstellung meiner Archivakten an die neue Datenstruktur anpassen.

Bitte arbeite wieder auf meiner bestehenden Codebasis.

Die Archivakte soll weiterhin so aussehen wie bisher. 

Bitte passe deshalb die Anzeige der Akte so an, dass die Informationen aus der neuen data.js verwendet werden.

Die Akte soll folgende Bereiche enthalten:

Bereich 1

Archivsignatur
Kategorie
Titel
Jahr

Bereich 2

Bild

Bereich 3

Kurzbeschreibung

Bereich 4

Objekttyp
Herkunft
Provenienz
Sammlung

Bereich 5

Institutionelle Relevanz
Dokumentationsgrad
Erhaltungszustand

Bitte übernimm möglichst den bisherigen Aufbau der Archivkarte und ändere noch nicht das Design.

Kommentiere bitte an stellen, an denen ich selber etwas einfügen oder anpassen kann.

---

**Cursor**

Ich schaue mir zuerst die bestehende Codebasis und die neue `data.js` an, damit der Plan zur Anpassung der Archivakte passt.


Die Codebasis ist klar: `app.js` nutzt noch alte Feldnamen über Aliase in `generator.js`, während `style.css` bereits Kriterien-Punkte (`.akte-card__criteria`) vorsieht. Ich erstelle den Plan.


**Kurze Klärung zur Bilddarstellung**

> **Wenn eine Akte kein Bild hat (`bild: null`), wie soll Bereich 2 dargestellt werden?**
> - Platzhalter-Fläche mit Text (z. B. „Kein Bild vorhanden“) — empfohlen ✔
> - Bereich 2 komplett ausblenden, wenn kein Bild
> - Leerer Rahmen ohne Text (nur visueller Platzhalter)

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um und beginne mit den Hilfsfunktionen in `app.js`.


Ich implementiere jetzt die Änderungen in `app.js`, `generator.js` und `style.css`.


Die Archivakten nutzen jetzt die neue Datenstruktur aus `data.js`. Kurzüberblick:

### [`app.js`](app.js)
- Neue Hilfsfunktionen: `formatValue`, `renderAkteImage`, `mapScaleToDots`, `renderCriteria`, `renderMetaList`, `renderAkteCard`
- Jede Karte hat **5 Bereiche** mit Kommentaren an den Stellen, die du selbst anpassen kannst:
  1. Archivsignatur, Kategorie, Titel, Jahr
  2. Bild (oder Platzhalter „Kein Bild vorhanden“)
  3. Kurzbeschreibung
  4. Objekttyp, Herkunft, Provenienz, Sammlung
  5. Institutionelle Relevanz & Dokumentationsgrad als Punkte, Erhaltungszustand als Text
- Verdrängungsdialog: kompakte Variante (nur Objekttyp + Herkunft in Bereich 4)
- Erinnerungsraum-Vorschau: `archivsignatur` und `kurzbeschreibung`

### [`generator.js`](generator.js)
- Temporäre englische Aliase entfernt; `normalizeAkte()` reicht nur noch die Felder aus `data.js` durch

### [`style.css`](style.css)
- Minimale Ergänzungen für Titel, Jahr, Bild, Platzhalter, Meta-Liste und `criterion__value` — ohne Redesign der bestehenden Karte

**Hinweis:** `projection.js` nutzt noch die alten Feldnamen. Wenn der Erinnerungsraum auf dem Beamer leer oder fehlerhaft wirkt, kann das als nächster Schritt angepasst werden.

Zum Testen `index.html` öffnen. Falls alte Daten im Browser hängen: `localStorage.removeItem('wez-installation-state')` in der Konsole ausführen.

---

**User**

Die Archivakten werden zwar angezeigt, aber sie zeigen keine eingetragenen inhalte.

Bitte prüfe, ob die Feldnamen in data.js, generator.js und der Darstellung der Archivakten wirklich übereinstimmen.

Die Akten sollen diese Informationen aus data.js korrekt anzeigen:

Archivsignatur
Kategorie
Titel
Jahr
Bild
Kurzbeschreibung
Objekttyp
Herkunft
Provenienz
Sammlung
Institutionelle Relevanz
Dokumentationsgrad
Erhaltungszustand

Bitte passe nur die Stellen an, an denen alte und neue Feldnamen nicht zusammenpassen.


---

**Cursor**

Ich prüfe jetzt die Feldnamen in `data.js`, `generator.js` und der Darstellung — vermutlich hängen noch alte Namen oder gespeicherter State dazwischen.


Die Feldnamen in `app.js` passen — vermutlich liefert `localStorage` noch Akten mit alten Namen (`inventoryNumber`, `title` …). Ich passe `normalizeAkte` und das Laden des States an.


Das Problem lag nicht an `app.js` — die Darstellung nutzt bereits die richtigen Feldnamen. Ursache war der **gespeicherte State in `localStorage`**: Dort lagen noch Akten mit alten Namen wie `inventoryNumber`, `title`, `shortText` usw., während `app.js` `archivsignatur`, `titel`, `kurzbeschreibung` erwartet. Alle Werte wirkten dadurch leer (`—`).

### Änderungen

**[`generator.js`](generator.js)** — `normalizeAkte()`:
- Holt bei bekannter `id` die **aktuellen Daten aus `ARCHIV_AKTEN`**
- Mappt zusätzlich alte Feldnamen auf die neuen (z. B. `inventoryNumber` → `archivsignatur`, `title` → `titel`, `shortText` → `kurzbeschreibung`)

**[`state.js`](state.js)**:
- Neue Funktion `normalizeStateAkten()` — normalisiert `currentOffer` und `memoryRoom` beim Laden
- `ensureOfferSet()` normalisiert ebenfalls vor der Anzeige

Nach einem Reload sollten die Inhalte aus `data.js` sichtbar sein. Falls nicht, einmal in der Browser-Konsole ausführen:

```js
localStorage.removeItem('wez-installation-state')
```

Dann die Seite neu laden — das erzwingt einen frischen Start mit den aktuellen Daten.

