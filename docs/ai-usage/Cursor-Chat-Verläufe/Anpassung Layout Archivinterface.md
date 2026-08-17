# Archivseite Layout Anpassung
_Exported on 17.8.2026 at 14:43:20 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte jetzt die Archivseite anpassen.

Als Orientierung aheb ich dir meien Design-Skizze angehangen.

Die Seite soll übersichtlich wirken und die drei Archivakten gleichmäßig nebeneinander anzeigen.

Die Karten sollen etwas mehr Platz bekommen und wie einzelne Seiten eines Archivordners wirken.

Bitte ändere in diesem Schritt nur den grundsätzlichen Aufbau der Seite. 


---

**Cursor**

Ich schaue mir zuerst die aktuelle Archivseite und die relevanten Dateien an, um einen Plan für den neuen Grundaufbau zu erstellen.


Ich habe die aktuelle Struktur mit der Design-Skizze abgeglichen und erstelle den Plan.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um und beginne mit dem HTML-Seitenrahmen.


Als Nächstes passe ich `style.css` und `app.js` an.


Der Grundaufbau der Archivseite ist umgesetzt. Zusammenfassung der Änderungen:

### [`index.html`](index.html)
- Neuer Seitenrahmen `.archive-shell` mit dunkler Topbar, zentriertem **ARCHIV**-Titel und heller Footerbar (analog zum Startbildschirm)
- Alter `.site-header` und `.site-footer` entfernt
- Überschrift „Aktuelle Archivakten“ als `.sr-only` für Barrierefreiheit beibehalten

### [`style.css`](style.css)
- **3-Spalten-Grid** mit `gap: 2rem` und `max-width: 1400px`
- Spalten-Wrapper `.archive-offer-column` (Karte + Button)
- Button `.btn-archive-select` im dunklen Stil wie „Archiv öffnen“
- Karten als **Ordner-Seiten**: `--color-paper-dark` Hintergrund, Lochrand links (drei Kreise), kein Tab oben
- Karten nicht mehr klickbar; Interaktion nur über den Button
- Responsive: unter 1024px stapeln sich die drei Spalten

### [`app.js`](app.js)
- Neue Funktion `renderOfferColumn()` — jede Akte in einer Spalte mit Button „In den Erinnerungsraum aufnehmen“
- Click-Handler von der Karte auf den Button verlegt
- Lochrand-Elemente in `renderAkteCard()` ergänzt

Zum Testen: `index.html` öffnen → „Archiv öffnen“ klicken. Die drei Akten sollten gleichmäßig nebeneinander erscheinen, jede mit Button darunter.

Als nächster Schritt wäre die inhaltliche Feinarbeit der Karten (Abschnittsüberschriften, Bewertungs-Punkte, Titel/Jahr in einer Zeile). Soll ich damit weitermachen?

---

**User**

Ich möchte das die Akten noch mehr aussehen, wie einzelne Seiten aus einem Ringbuch

---

**Cursor**

Ich schaue mir die aktuelle Karten-Gestaltung an und passe sie stärker an das Ringbuch-Seiten-Design an.


Ich verstärke den Ringbuch-Look per CSS: Lochrand, Papierstruktur und leichter Seitenstapel-Effekt.


Die Akten wirken jetzt stärker wie einzelne Ringbuch-Seiten. Konkret:

**Lochrand links**
- Eigene Rückenleiste in dunklerem Beige mit gestrichelter Trennlinie zum Seiteninhalt
- Drei Lochungen bei 14 % / 50 % / 86 % der Seitenhöhe (typische Ringbuch-Anordnung)
- Größere Löcher mit Verstärkungsring und innerem Schatten — als wäre das Papier durchgestanzt

**Papier & Stapel**
- Helleres Seitenpapier (`#faf8f3`) mit leichtem Lichtverlauf oben
- Leicht versetzte Hintergrundseite (`::after`) für einen Stapel-Effekt
- Mindesthöhe für ein eher hochkantes Seitenformat

**Abstände**
- Etwas mehr Luft zwischen den drei Spalten und zwischen Karte und Button

Zum Prüfen: `index.html` öffnen → „Archiv öffnen“. Wenn du magst, können wir als Nächstes z. B. die Lochgröße, den Stapel-Effekt oder die Abschnittsüberschriften in den Karten feinjustieren.

