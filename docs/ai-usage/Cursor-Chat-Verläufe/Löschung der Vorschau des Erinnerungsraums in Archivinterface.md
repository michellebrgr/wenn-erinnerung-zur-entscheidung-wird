# Index.html memory space removal
_Exported on 17.8.2026 at 14:49:27 MESZ from Cursor (3.16.17)_

---

**User**

Bitte entferne den Erinnerungsraum der index.html. Damit wirkt das Interface aufgeräumter

---

**Cursor**

Ich schaue mir zuerst `index.html` und die zugehörigen Dateien an, um den Erinnerungsraum gezielt zu entfernen.


Ich entferne den Erinnerungsraum aus `index.html` und räume die zugehörigen Referenzen in `app.js` und `style.css` auf.


Der Erinnerungsraum ist aus dem Laptop-Interface entfernt. Das Archiv zeigt jetzt nur noch die drei wählbaren Akten.

**Änderungen:**

1. **`index.html`** – Die Vorschau-Sektion „Erinnerungsraum“ (6 Plätze) ist weg. Der Intro-Text verweist jetzt auf die Projektionsansicht statt auf die lokale Vorschau.

2. **`app.js`** – Die Vorschau-Logik (`renderMemoryPreview` und zugehörige DOM-Referenzen) ist entfernt. Auswahl und Verdrängungsdialog funktionieren weiter wie zuvor.

3. **`style.css`** – Ungenutzte Styles für die Vorschau (`.memory-preview`, `.preview-slot`, `.room-count`) sind entfernt.

Der Erinnerungsraum bleibt in **`projection.html`** für die Beamer-Projektion sichtbar. Der Verdrängungsdialog erscheint weiterhin, wenn alle 6 Plätze belegt sind.

