# Erinnerungsraum layout
_Exported on 17.8.2026 at 14:39:22 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte nun den Erinnerungsraum vom Layout an meine Designskizze anpassen.

Der Erinnerungsraum soll wie eine musealische, ruhige Ausstellung wirken. 

Jede Akte soll wie ein Ausstellungsstück wirken. Mit Bild, Kurzbeschriebung und ein Schild mit Titel und Jahr (siehe Anhang).

Weiterhin sollen nur 6 Akten zusehen sein, an der Logik soll sich nichts ändern nur das Layout. 

Auf meiner Designskizze ist der Hintergrund hell, ich überlege ihn dnkel zu machen, dmait er auch bei hellem Tag an die Wand projeziert werden kann. 

---

**Cursor**

Ich schaue mir zuerst die aktuelle Erinnerungsraum-Implementierung und das bestehende Layout an.


Zwei Punkte klären wir kurz, bevor ich den Plan festlege:


**Erinnerungsraum — Klärung**

> **Welche Ansicht soll ans Designskizze angepasst werden?**
> - Nur die Beamer-Projektion (projection.html) ✔
> - Beamer-Projektion und Verdrängungsansicht im Archiv (index.html)

> **Welches Farbschema soll umgesetzt werden?**
> - Dunkel (projektionsfreundlich bei hellem Raum) — empfohlen
> - Hell wie in der Skizze
> - Beide Varianten per CSS-Klasse umschaltbar ✔

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um und beginne mit der HTML-Shell in `projection.html`.


Ich teste die Implementierung mit Beispieldaten.


Das museale Ausstellungslayout für die Beamer-Projektion ist umgesetzt. Kurz die Änderungen:

### `projection.html`
- Neue Shell mit Topbar, zentriertem Titel „Erinnerungsraum“ und Footerbar (analog zum Archiv-Startbildschirm)
- Standard-Theme: `projection-view--dark`
- Untertitel entfernt für einen ruhigeren Raum

### `projection.js`
Jede Akte wird als Ausstellungsstück gerendert:
- **Bild** links (65 %), mit neutralem Platzhalter bei bildlosen Akten
- **Schild** rechts mit Titel und Jahr
- **Kurzbeschreibung** darunter, volle Breite
- Weiterhin 6 feste Plätze, Enter-Animation und Live-Sync — ohne Änderung an der Logik

### `style.css`
- Neues `.memory-exhibit`-Layout im 3×2-Raster
- Theme per CSS-Variablen umschaltbar:
  - **Dunkel** (Standard): `projection-view--dark` — projektionsfreundlich
  - **Hell** (wie Skizze): `projection-view--light` auf dem `body` setzen

**Theme wechseln:** In `projection.html` die Klasse auf `body` tauschen:
```html
<body class="projection-view projection-view--light">
```

Zum Testen `projection.html` im Browser öffnen und parallel im Archiv (`index.html`) Akten aufnehmen — die Projektion aktualisiert sich live.

