# Document selection interface
_Exported on 17.8.2026 at 14:39:59 MESZ from Cursor (3.16.17)_

---

**User**

Nach dem Pop-up soll eine neue Ansicht erscheinen, auf der die sechs Akten aus dem Erinnerungsraum gezeigt werden.

Diese Ansicht soll wie eine weitere Seite im bestehenden Ringbuch wirken und nicht wie ein eigener technischer Bildschirm.

Die gespeicherten Akten sollen nacheinander durchgeblättert werden können.

Bei jeder Akte soll es einen Button geben:

„Diese Akte entfernen“

Wenn eine Akte entfernt wird, soll die vorher ausgewählte neue Akte ihren Platz im Erinnerungsraum einnehmen.

Danach soll wieder Seite mit der Meldung zur Akten Auswahl erscheinen



---

**Cursor**

Ich schaue mir zuerst den bestehenden Ablauf an — Pop-up, Erinnerungsraum und Ringbuch-UI — damit der Plan zur neuen Akten-Ansicht passt.


Ich prüfe als Nächstes die Ringbuch-Styles und die aktuelle Verdrängungsansicht, damit die neue Seite optisch dazu passt.


Ich habe den Ablauf verstanden: Nach dem Pop-up soll die Verdrängungsansicht durch eine durchblätterbare Ringbuch-Ansicht ersetzt werden.


> **Soll die neu ausgewählte Akte während des Durchblätterns sichtbar sein (z. B. als kurzer Hinweis oben), oder nur im Hintergrund gespeichert bleiben, bis eine bestehende Akte entfernt wird?**
> - Nur kurzer Hinweistext (z. B. „Neue Auswahl wartet auf Aufnahme“) ✔
> - Vorschau der neuen Akte wie bisher zusätzlich anzeigen
> - Gar nicht anzeigen — nur die sechs bestehenden Akten

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um: zuerst HTML, dann JavaScript und CSS für die Ringbuch-Verdrängungsansicht.


Als Nächstes passe ich `app.js` an: durchblätterbare Review-Logik und die Verdrängungsansicht.


Ich prüfe die Syntax und teste die State-Logik für den Verdrängungsablauf.


Die Ringbuch-Verdrängungsansicht ist umgesetzt. Kurzüberblick:

### Ablauf
1. Pop-up bei vollem Erinnerungsraum → „Löschung Starten“
2. **Neue Ringbuch-Ansicht** mit den 6 Akten aus dem Erinnerungsraum
3. Durchblättern mit ‹ ›, Zähler „Akte X von 6“
4. **„Diese Akte entfernen“** → neue Auswahl ersetzt genau diese Akte
5. **Bestätigungsseite** erscheint wie bisher

### Änderungen

**[`index.html`](index.html)** — Das 6er-Raster wurde durch einen Ringbuch-Container ersetzt: Stage, Navigation, Zähler, Entfernen-Button und der Hinweis „Ihre neue Auswahl wartet auf Aufnahme.“

**[`app.js`](app.js)** — Neue Funktionen `renderMemoryReviewPage`, `showPreviousMemoryReviewPage`, `showNextMemoryReviewPage` und `clearMemoryReview`. Akten werden als vollständige `akte-card` mit Variante `review` gezeigt. Die alte Raster-Logik (`renderArchiveMemorySlot`) ist entfernt.

**[`style.css`](style.css)** — Neue Styles für `.memory-review`, Navigation und `.btn-memory-remove` im Ringbuch-Look. Die alten `.archive-memory-room`-Grid-Styles sind entfernt.

**Abbrechen** und **Escape** führen weiter zum Angebots-Set zurück.

Zum Testen: Erinnerungsraum mit 6 Akten füllen, eine neue Akte wählen, Pop-up bestätigen, durchblättern und eine Akte entfernen.

---

**User**

Die Aktensieten sollen die selbe größe haben wie bei der AKtenauswahl. Kann man s so gestalten, das man durch hovern die seiten umblättert

---

**Cursor**

Ich prüfe die aktuellen Größen der Aktenkarten und die Ringbuch-Ansicht, um einen Plan für einheitliche Größe und Umblättern per Hover zu erstellen.


> **Wie sollen die bestehenden ‹ › Pfeil-Buttons zur Hover-Navigation zusammenpassen?**
> - Hover-Zonen als Hauptsteuerung; Pfeil-Buttons nur auf Touch/kleinen Screens behalten
> - Hover-Zonen zusätzlich zu den sichtbaren Pfeil-Buttons (beides parallel)
> - Pfeil-Buttons komplett entfernen, nur Hover (plus Tastatur für Barrierefreiheit) ✔

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um: zuerst HTML, dann JavaScript und CSS für einheitliche Aktengröße und Hover-Umblättern.


Die Anpassungen sind umgesetzt. Kurzüberblick:

### Einheitliche Größe
Die Verdrängungs-Akte nutzen jetzt dieselbe Breite wie eine Spalte im Angebots-Grid: `calc((100% - 5rem) / 3)`. Ab 1024px Breite volle Breite wie in der Aktenauswahl. Zusätzlich ist `.archive-offer-column` für konsistentes Padding gesetzt.

### Hover-Umblättern
Die sichtbaren ‹ › Buttons sind entfernt. Stattdessen gibt es unsichtbare Hover-Zonen links und rechts an der Karte (je 22 %, auf Mobile 30 %):
- **Hover** am linken Rand → vorherige Akte
- **Hover** am rechten Rand → nächste Akte
- Dezenter Schimmer und ein kleines ‹ › beim Hover
- An erster/letzter Akte ist die jeweilige Zone deaktiviert

### Barrierefreiheit & Touch
- **Pfeiltasten** (← →) blättern in der Verdrängungsansicht
- **Escape** bricht weiterhin ab
- **Tap** auf die Zonen funktioniert auf Touch-Geräten

Zum Testen: Verdrängungsansicht öffnen und die Kartenbreite mit der Aktenauswahl vergleichen, dann an den Rändern hovern oder die Pfeiltasten nutzen.

---

**User**

Ich möchte gerne das die aktenblätter etwas breiter sind, wie bei der anderen AKtenansicht. Zudem sollen es immer zwei seiten angezeigt werden als würde man durrch ein bcuh blättern

---

**Cursor**

Ich schaue mir die aktuelle Verdrängungsansicht und die Aktenauswahl an, um Breite und Zwei-Seiten-Darstellung wie beim Durchblättern anzupassen.


Ich baue die Verdrängungsansicht auf eine breitere Doppelseiten-Ansicht um — zwei Seiten nebeneinander wie beim Durchblättern.


Jetzt passe ich das CSS für die breite Doppelseiten-Ansicht an.


Die Verdrängungsansicht zeigt jetzt eine breite Buch-Doppelseite. Änderungen im Überblick:

### Breitere Doppelseite
Die Ansicht ist so breit wie **zwei Akten-Spalten** aus der Auswahl (`2 × Spaltenbreite + Zwischenraum`). Jede Seite hat dieselbe Breite wie eine Akte im Angebots-Grid.

### Zwei Seiten wie in einem Buch
- Immer **zwei Akten nebeneinander** (Akten 1–2, 3–4, 5–6)
- In der Mitte ein dezenter **Buchrücken** (`.memory-review__spine`)
- Rechte Seite mit **Lochrand rechts** für den Buch-Effekt

### Navigation & Auswahl
- **Hover** am linken/rechten Rand blättert zur vorherigen/nächsten Doppelseite
- **Pfeiltasten** (← →) funktionieren weiterhin
- **Klick** auf eine Seite wählt sie für „Diese Akte entfernen“ aus (rote Markierung)
- Zähler zeigt z. B. „Akten 1–2 von 6“

Auf schmalen Screens (<1024px) werden die beiden Seiten untereinander gestapelt.

---

**User**

Doch mit Pfeilen arbeiten und nicht hoffern. Den Text oberhalb der akten entfernen außer überschirft. Die sieten so lagen das beide ringbuch seiten in der mitte auf einander treffen 

---

**Cursor**

Ich stelle auf Pfeil-Navigation um, entferne die Texte oberhalb der Akten (außer der Überschrift) und richte die Ringbuch-Seiten in der Mitte aufeinander aus.


Die Verdrängungsansicht ist angepasst:

### Pfeile statt Hover
Die unsichtbaren Hover-Zonen sind durch sichtbare **‹ › Pfeil-Buttons** links und rechts neben dem Buch ersetzt. Tastatur (← →) funktioniert weiterhin.

### Text entfernt
Oberhalb der Akten bleibt nur die **Überschrift „Erinnerungsraum“**. Hinweistext, Pending-Hinweis und Seitenzähler sind entfernt.

### Ringbuch trifft sich in der Mitte
- **Linke Seite:** Lochrand rechts (zur Mitte hin)
- **Rechte Seite:** Lochrand links (zur Mitte hin)
- Beide Seiten **überlappen sich in der Mitte** — die Binder-Ränder treffen aufeinander wie bei einem aufgeschlagenen Ringbuch
- Der separate Mittelstreifen (Spine) ist entfernt

Zum Auswählen einer Akte zum Entfernen weiterhin auf die jeweilige Seite klicken.

---

**User**

Ich möchte die Auwahl der Aktenlöschung ncohmals anpassen. 

Ich möchte, das der Bildschirm aussieht wir bei der Aktenaushwal, also drei akten nebeneinander. 

Unter jeder Akte soll ein utton sien, bloß mit "Diese Akte löschen".

Außerdem soll es pfeile geben mithilfe man die akten weiter machen kann. 

---

**Cursor**

Ich schaue mir die aktuelle Verdrängungsansicht und die Aktenauswahl an, um den Plan für das neue Layout zu erstellen.


Die Verdrängungsansicht soll wie die Aktenauswahl 

> **Was soll passieren, wenn auf „Diese Akte löschen“ geklickt wird?**
> - Direkt löschen — Klick auf „Diese Akte löschen“ führt sofort zur Bestätigungsseite ✔
> - Mit Sicherheitsabfrage — vor dem Löschen noch einmal bestätigen (z. B. Browser-Dialog)

aussehen — drei Spalten mit Löschen-Button und Pfeil-Navigation. Ich erstelle den Plan.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze die Verdrängungsansicht wie die Aktenauswahl um — zuerst HTML, dann JavaScript und CSS.


Die Verdrängungsansicht entspricht jetzt der Aktenauswahl. Zusammenfassung:

### Layout wie Aktenauswahl
- **3 Akten nebeneinander** im gleichen `.offer-grid`-Layout
- Volle Breite wie die Auswahlansicht
- Nur die Überschrift „Erinnerungsraum“ bleibt oben

### Löschen-Buttons
- Unter jeder Akte: **„Diese Akte löschen“** (rot, wie zuvor der Entfernen-Button)
- Klick löst direkt die Verdrängung aus und führt zur Bestätigungsseite

### Pfeil-Navigation
- **‹ ›** links und rechts vom Grid
- Seite 1: Akten 1–3, Seite 2: Akten 4–6
- Tastatur: ← → zum Blättern, Escape zum Abbrechen

### Entfernt
- Ringbuch-Doppelseiten, Auswahl per Klick, globaler „Diese Akte entfernen“-Button
- Alle zugehörigen Book-/Spread-Styles

Zum Testen: Erinnerungsraum füllen, neue Akte wählen, Pop-up bestätigen — dann sollte das Grid wie die normale Auswahl aussehen.

---

**User**

Ich möchte dass die akten, die selben paramter haben wie bei der Aktenauswahl. Also größe. abstand und co. 

---

**Cursor**

Ich vergleiche die Verdrängungsansicht mit der Aktenauswahl, damit Größe und Abstände übereinstimmen.


Die Verdrängungsansicht wird an die Aktenauswahl angeglichen: volle Grid-Breite, gleiche Abstände; die Pfeile liegen außerhalb, damit die Karten nicht schmaler werden.


Die Verdrängungsansicht nutzt jetzt dieselben Layout-Parameter wie die Aktenauswahl:

### Gleiche Größe & Abstände
- Das Grid ist **100 % breit** wie `#offer-container` — die Pfeile liegen absolut daneben und verkleinern die Karten nicht mehr
- Gleiches **`.offer-grid`** mit `gap: 2.5rem` und `margin-bottom: 1rem`
- Gleiche **`.archive-offer-column`** mit `gap: 1.25rem` und Padding
- Aktenkarten nutzen dieselbe Variante **`selectable`** (identische Größe); Hover-Effekt ist in der Lösch-Ansicht deaktiviert

### Weitere Anpassungen
- `max-width: 1200px` und die Zentrierung der Verdrängungssektion entfernt — volle Breite wie die Auswahl
- Löschen-Button mit gleichen Maßen wie „In den Erinnerungsraum aufnehmen“ (nur andere Farbe)
- Überschrift mit gleichem Abstand (`margin-bottom: 1rem`) wie bei der Auswahl

Die Pfeile sitzen auf Desktop seitlich im Randbereich (`left/right: -3.25rem`), auf schmalen Screens innerhalb der Ansicht, ohne das Grid zu verengen.

