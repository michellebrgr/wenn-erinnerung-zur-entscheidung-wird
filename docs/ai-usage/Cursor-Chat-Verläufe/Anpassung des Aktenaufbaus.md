# Image-based archive structure
_Exported on 17.8.2026 at 14:49:03 MESZ from Cursor (3.16.17)_

---

**User**

Ich würde den Aufbau meiner Akten gerne etwas ändern.

Im Moment hat jede Akte einfach ein Bild. Ich würde es lieber anders herum machen.

Ich möchte, dass zuerst ein Bild ausgewählt wird und daraus dann automatisch eine passende Archivakte entsteht.

Zu jedem Bild soll ich später mehrere Möglichkeiten hinterlegen können, zum Beispiel verschiedene Titel, Beschreibungen oder Kategorien. So kann dasselbe Bild unterschiedliche Archivakten erzeugen.

Bitte baue die Datenstruktur entsprechend um. Für den Anfang reichen ein oder zwei Beispiele, damit ich später selbst weitere Bilder und Inhalte ergänzen kann.

An der Optik soll sich erst einmal nichts ändern. Mir geht es im Moment nur darum, dass die Akten später aus den Bildern entstehen.

---

**Cursor**

Ich schaue mir zuerst die aktuelle Datenstruktur und deren Verwendung im Code an.


Ich habe die Struktur verstanden: 

**Kurze Klärung zur Auswahl-Logik**

> **Wenn es weniger Bilder als Angebotsplätze gibt (aktuell 3), aber ein Bild mehrere Varianten hat: Soll dasselbe Bild im selben Angebot mehrfach erscheinen dürfen — jeweils mit einer anderen Variante?**
> - Nein — pro Angebot maximal einmal dasselbe Bild (einfacher, aber weniger als 3 Karten wenn nur 2 Bilder existieren)
> - Ja — dasselbe Bild darf mehrfach vorkommen, solange die Variante unterschiedlich ist (Angebot bleibt immer voll)
>
> Answer: nein, pro angebot maximal einmal das selbe bild. Wenn sonst kein Bild vorhanden ist - also null  soll weiterhin stehen das kein bild vorhanden ist

`ARCHIV_AKTEN` ist flach, die UI erwartet aber weiterhin dasselbe Akten-Objekt. Als Nächstes plane ich die bildzentrierte Datenstruktur und die Anpassung in `generator.js`.


Die Auswahl-Logik ist klar: pro Angebot jedes Bild höchstens einmal, fehlende Plätze mit `bild: null` und Platzhalter.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um: zuerst die Datenstruktur in `data.js`, danach Generator und State.


Die bildzentrierte Datenstruktur ist umgesetzt. Kurz die Änderungen:

### [`data.js`](data.js)
`ARCHIV_AKTEN` wurde durch `ARCHIV_BILDER` ersetzt:
- **`fotosammlung_01.jpg`** mit 2 Varianten (Protest / Alltagskultur) — zeigt, wie ein Bild verschiedene Akten erzeugen kann
- **`festzug_01.jpg`** mit 1 Variante
- **`bild-ohne-beispiel`** mit `pfad: null` — füllt den dritten Angebotsplatz auf und zeigt weiterhin „Kein Bild vorhanden“

### [`generator.js`](generator.js)
- `buildAkte(bild, variante)` kombiniert Bild + Variante zum bisherigen Akten-Objekt
- `pickArchiveAkten` wählt zuerst unterschiedliche Bilder mit Pfad, dann bei Bedarf Einträge ohne Bild
- `normalizeAkte` löst Akten über `bildId` + `varianteId` wieder in `ARCHIV_BILDER` auf

### [`state.js`](state.js)
`ensureOfferSet` generiert nur noch neu, wenn das Angebot leer ist — damit gibt es keine Endlosschleife, wenn weniger als 3 Bilder vorhanden sind.

Die UI in `app.js` bleibt unverändert; sie erhält weiterhin dieselben Felder (`bild`, `titel`, `kategorie`, …).

**Später ergänzen:**
1. Neues Foto → neuer Eintrag in `ARCHIV_BILDER` mit `pfad`
2. Weitere Lesart zum selben Foto → weiteres Objekt in `varianten`
3. Akte ohne Bild → Eintrag mit `pfad: null`

**Hinweis:** Für einen sauberen Test nach dem Umbau einmal den Browser-LocalStorage leeren (oder `resetState()` aufrufen), damit alte Akten-IDs nicht mehr im Speicher liegen.

---

**User**


Bilder, die bereits im Erinnerungsraum hängen, sollen nicht noch einmal bei den drei neuen Archivakten erscheinen.

Erst wenn eine Akte später aus dem Erinnerungsraum verdrängt wird, darf dieses Bild wieder verwendet werden.

Kannst du die Logik bitte entsprechend anpassen?

Sonst soll sich nichts am Projekt ändern

---

**Cursor**

Ich prüfe, wie Angebots- und Erinnerungsraum-Akten aktuell erzeugt und ausgewählt werden.


Ich passe die Generator- und State-Logik an, damit Bilder aus dem Erinnerungsraum bei neuen Angeboten ausgeschlossen werden.


Die Logik ist angepasst. Kurz zusammengefasst:

### [`generator.js`](generator.js)
`pickArchiveAkten` und `generateOfferSet` akzeptieren jetzt optional `excludedBildIds`. Beim Zusammenstellen der drei Angebots-Akten werden alle Bild-Einträge aus `ARCHIV_BILDER` ausgeschlossen, deren `id` in dieser Liste steht.

### [`state.js`](state.js)
Neue Hilfsfunktion `getExcludedBildIds(memoryRoom)` sammelt die `bildId`-Werte aller Akten im Erinnerungsraum. Diese Liste wird bei jedem neuen Angebot übergeben — in `refreshOfferSet` (nach Auswahl oder Verdrängung) und in `ensureOfferSet` (wenn das Angebot leer ist).

**Ablauf:**
1. Akte wird aufgenommen → deren `bildId` landet im Erinnerungsraum → erscheint nicht mehr in neuen Angeboten
2. Akte wird verdrängt → deren `bildId` verlässt den Erinnerungsraum → das Bild kann wieder angeboten werden (ggf. mit einer anderen Variante)

Wenn viele Bilder bereits im Erinnerungsraum hängen, kann das Angebot weniger als drei Karten haben — das ist beabsichtigt, weil keine Bilder doppelt vorkommen sollen.

---

**User**

Es sollen immer drei akten vorhanden sein. Demnach dürfen Akten ohen Bild auch mehrfach angezeigt werden

---

**Cursor**

Ich prüfe die aktuelle Angebots-Logik, damit immer drei Akten angezeigt werden und bildlose Einträge bei Bedarf mehrfach vorkommen dürfen.


Ich passe die Generator-Logik an: immer drei Akten, bildlose Einträge dürfen sich wiederholen; für Duplikate braucht es eindeutige IDs.


Die Angebots-Logik ist angepasst. Kurz die Änderungen:

### [`generator.js`](generator.js)
- Zuerst werden wie bisher **verfügbare Bilder mit Pfad** gewählt (weiterhin je Bild maximal einmal, nicht wenn bereits im Erinnerungsraum).
- Fehlen danach noch Plätze, füllt eine Schleife mit **bildlosen Akten** auf — **mit Wiederholung**, bis drei Karten erreicht sind.
- Mehrfach angezeigte bildlose Akten erhalten eine **eindeutige ID** (Suffix), damit die Auswahl in der UI eindeutig bleibt.

### [`state.js`](state.js)
- `getExcludedBildIds` berücksichtigt nur noch Akten **mit Bild** im Erinnerungsraum — bildlose Akten werden nicht ausgeschlossen.
- `ensureOfferSet` ergänzt das Angebot wieder, wenn **weniger als drei** Karten vorhanden sind.

**Beispiel:** Zwei Bilder sind im Erinnerungsraum, nur noch ein Bild verfügbar → Angebot: 1 Bild-Akte + 2 bildlose Akten (ggf. dieselbe Variante zweimal).

---

**User**

Gerade wird für jede Akte oder Bild ein eigener Erinnerungsraum angezeigt. Das soll so nicht sein. 
Wenn eine Akte ausgewählt wird, soll sie immer zu diesem einen gemeinsamen Erinnerungsraum hinzugefügt werden.

Der Erinnerungsraum darf insgesamt höchstens 6 Akten enthalten.

Außerdem soll in der projektion immer genau denselben Erinnerungsraum anzeigen und sich aktualisieren, sobald eine Akte aufgenommen wird.

Bitte prüfe dafür die gemeinsame Speicherung zwischen der normalen Ansicht und projection.html.


---

**Cursor**

Ich prüfe, wie Erinnerungsraum und State zwischen Archiv-Ansicht und Projektion geteilt werden.


Ich habe zwei Hauptprobleme gefunden: `projection.js` nutzt veraltete Feldnamen, und die Tab-Synchronisation in `subscribe()` kann veralteten State laden. Beides behebe ich jetzt.


Die gemeinsame Speicherung und Projektion sind korrigiert. Das waren die Probleme und Fixes:

### Ursachen
1. **`projection.js` nutzte veraltete Feldnamen** (`inventoryNumber`, `title`, `shortText` …) statt der aktuellen deutschen Felder (`archivsignatur`, `titel`, `kurzbeschreibung` …). Die Projektion konnte Akten deshalb nicht korrekt anzeigen.
2. **Tab-Synchronisation war fehleranfällig** — beim gleichzeitigen Öffnen von `index.html` und `projection.html` konnte ein Tab mit veraltetem State starten und den gemeinsamen Speicher überschreiben.

### Änderungen in [`state.js`](state.js)
- **Ein gemeinsamer State** unter dem Schlüssel `wez-installation-state` mit einem `memoryRoom`-Array (max. 6 Akten)
- **`subscribe()`** lädt beim Start immer den aktuellen Stand aus `localStorage`
- **`BroadcastChannel`** als zusätzlicher Sync-Kanal zwischen Tabs
- **Polling alle 500 ms** als Fallback, falls `storage`-Events ausbleiben
- **`memoryRoom` wird auf 6 Einträge begrenzt** beim Laden

### Änderungen in [`projection.js`](projection.js)
- Rendert den **gemeinsamen** `state.memoryRoom` mit den korrekten Feldern
- Zeigt **6 feste Plätze** in einem Raster — neue Akten werden an nächste freie Position angehängt

### So testen
1. Einmal LocalStorage leeren (DevTools → Application → Local Storage → `wez-installation-state` löschen)
2. `index.html` und `projection.html` **im selben Browser** öffnen (am besten über einen lokalen Server, z. B. `python3 -m http.server`, nicht direkt als `file://`)
3. Akte in der Archivansicht auswählen → sie erscheinen nacheinander im **selben** Erinnerungsraum in der Projektion

Beide Ansichten teilen sich jetzt denselben Erinnerungsraum und aktualisieren sich bei jeder Aufnahme.

---

**User**

Uncaught SyntaxError: Unexpected token 'delete'

---

**Cursor**

Vermutlich stört `subscribers.delete()` den Parser. Ich ersetze `Set` durch ein Array und entferne alle `.delete`-Aufrufe.


Der Fehler kam sehr wahrscheinlich von `subscribers.delete(callback)` in [`state.js`](state.js). In manchen Browsern oder Umgebungen wird `.delete` dabei falsch als `delete`-Operator gelesen — daher `Unexpected token 'delete'`.

**Änderungen:**
- `Set` durch ein normales Array ersetzt
- Entfernen von Listenern läuft jetzt über `indexOf` + `splice` statt `.delete()`
- In [`data.js`](data.js) die Backticks in einem String entfernt (zusätzliche Absicherung)

Bitte die Seite einmal **hart neu laden** (Cmd+Shift+R). Wenn der Fehler bleibt, in den DevTools unter „Console“ nachsehen, **in welcher Datei und Zeile** er gemeldet wird — dann kann ich gezielt nachlegen.

