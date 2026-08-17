# Chrome fullscreen layout issue
_Exported on 17.8.2026 at 14:36:34 MESZ from Cursor (3.16.17)_

---

**User**

Wenn ich über chrome in den Vollbildmodus gehe, dann schieben sich die akten nach oben, auch beim erinnerungsraum (projektion). Ich würde gerne das sie zentriert in der mitte bleiben. Entweder passt du es so an, das es beim vollbildmodus in chrome funktoniert, oder das wir einen vollbildmodus direkt integrieren.

---

**Cursor**

Das Problem ist klar. Die `.projection-shell` und `body` benutzen `min-height: 100vh`. Im Chrome-Vollbildmodus (F11) ist `100vh` leicht größer als das sichtbare Viewport, und außerdem verschiebt sich das Layout nach oben, weil kein echtes vertikales Zentrieren stattfindet — der Content-Bereich dehnt sich nur nach unten aus.

**Ursache:** `.projection-main` hat `align-items: stretch` statt `center`, und `.projection-shell__content` zentriert seinen Inhalt vertikal nicht. Die Akten landen dadurch oben statt mittig.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Alle vier Anpassungen sind in `style.css` umgesetzt:

- `body.projection-view` nutzt jetzt `height: 100dvh` + `overflow: hidden` — passt sich exakt an den Chrome-Vollbildmodus an
- `.projection-shell` hat `height: 100%` statt `min-height: 100vh`
- `.projection-shell__content` zentriert seinen Inhalt vertikal mit `justify-content: center`
- `.projection-main` hat `align-items: center` statt `stretch`

Die Akten bleiben damit sowohl im normalen Fenster als auch im Chrome-Vollbildmodus (F11) vertikal mittig auf dem Bildschirm.

