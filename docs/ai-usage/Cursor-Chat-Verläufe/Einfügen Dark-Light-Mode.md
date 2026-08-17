# Projection dark and light mode
_Exported on 17.8.2026 at 14:37:24 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte das die projection einen dunkel- und hellmodus hat, damit sie an verschiedene Lichtverhältnisse angepasst werden kann. Bitte baue solch einen Modus ein, er soll mit dem Shortcut Shift + L funktonieren

---

**Cursor**

Now let me check the CSS for existing dark mode styles:

Der Hellmodus ist im CSS bereits definiert. Ich muss nur den Shortcut-Handler in `projection.js` einbauen:

Fertig. Die Projektion startet im Dunkelmodus (Klasse `projection-view--dark` ist bereits im HTML gesetzt). Mit **Shift + L** wird die Klasse `projection-view--light` auf dem `<body>` umgeschaltet — der zugehörige CSS-Block war schon vorhanden und definiert helle Farben für Hintergrund, Text und alle Projektion-Elemente. Nochmaliges Drücken schaltet zurück in den Dunkelmodus.

