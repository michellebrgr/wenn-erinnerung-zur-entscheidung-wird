# Image display issue
_Exported on 17.8.2026 at 14:33:08 MESZ from Cursor (3.16.17)_

---

**User**

ich bin noch nicht mit der darstellung der Bilder in der Akte und in der Projektion zufrieden. Ich hab eineige Bilder im Hochkantformat, welche aber durch die voreinstellung im Querformat abgeschnitten werden. 

---

**Cursor**

Ich schaue mir an, wie die Bilder in Akte und Projektion aktuell dargestellt werden — besonders die Querformat-Voreinstellung.

Ursache ist klar: In Akte und Projektion erzwingen CSS-Regeln ein Querformat-Fenster mit `object-fit: cover` — Hochkantbilder werden oben/unten abgeschnitten.

Bevor ich einen konkreten Plan mache, eine Entscheidung zur Darstellung:

Ursache: In Akte und Projektion erzwingen CSS-Regeln ein Querformat-Fenster mit `object-fit: cover` — Hochkantbilder werden oben/unten abgeschnitten.

Bevor ich den Plan festlege: **Wie sollen Hochkantbilder dargestellt werden?**

1. **Ganzes Bild sichtbar** (`object-fit: contain`) — ggf. leere Ränder im Querformat-Rahmen  
2. **Natürliches Format** — der Rahmen passt sich an Hochkant/Querformat an (kein Abschneiden)  
3. **Orientierungsabhängiger Rahmen** — Hochkant z. B. 3:4, Querformat bleibt 4:3; Bild füllt den Rahmen (`cover`, ggf. leichte Beschnitte)

Welche Variante soll es sein (Akte und Projektion gleich)?

---

**User**

ich denke ich würde 3 ab besten finden 

---

**Cursor**

Option 3 — ich lese die relevanten Stellen kurz nach und formuliere den Plan.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze die orientierungsabhängigen Bildrahmen um und schaue zuerst, wo die Render-Aufrufe sitzen.

Ich füge die Hilfsfunktion in beiden Dateien ein und rufe sie nach dem Render auf.

Umgesetzt. Kurz der Stand:

- **Akte & Projektion:** Nach dem Render wird die Bildorientierung erkannt; Hochkant bekommt `--portrait`.
- **CSS:** Querformat `4 / 3`, Hochkant `3 / 4`, jeweils mit `object-fit: cover`. Portrait-Bilder sind schmaler und zentriert (Akte) bzw. höhenbegrenzt (Projektion), damit das Layout stabil bleibt.

Zum Prüfen einfach eine Akte mit einem der Hochkantbilder öffnen (z. B. `arbeit_9`, `kultur_2`, `protest_3`) und parallel die Projektionsansicht ansehen.

---

**User**

jetzt werden keine bilder mehr angezeigt, wo könnt der fehler liegen?

---

**Cursor**

Ich prüfe CSS und JS — vermutlich kollidieren die neuen Bildregeln oder die Orientierungs-Logik mit dem Rendering.

Wahrscheinlich kollidieren `width: 100%`, `max-height: 160px` und `aspect-ratio` — der Bildkasten kollabiert auf Höhe 0. Ich korrigiere die CSS-Regeln.

Der Fehler lag in der **CSS-Kombination** bei den Aktenbildern:

`width: 100%` + `max-height: 160px` + `aspect-ratio: 4 / 3` — dabei kann die berechnete Höhe auf **0** kollabieren, sodass nichts sichtbar ist.

**Fix:** feste Höhe `height: 160px` statt `max-height`. Portrait nutzt dieselbe Höhe mit `aspect-ratio: 3 / 4`. In der Projektion hat Portrait `width: 56.25%` (gleiche Höhe wie 4:3, schmalerer Rahmen) statt `max-height: 100%` ohne Elternhöhe.

Bitte einmal hard-reloaden (Cmd+Shift+R) und prüfen, ob die Bilder wieder da sind.

---

**User**

so finde ich die hochkantbilder noch zu klein. Ich möchte, dass der Medienbereich bei allen Akten gleich bleibt, Hochkantbilder darin aber deutlich größer und mittig stehen. Bitte keinen extra sichtbaren Hochkant-Rahmen machen. die freie Fläche soll einfach Teil der Akte sein. Querformat kann die Fläche weiterhin stärker ausfüllen.

---

**Cursor**

Ich schaue mir den aktuellen Medienbereich in Akte und Projektion an und plane die Anpassung.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Umgesetzt in [`style.css`](style.css):

- **Akte:** fester Figure-Slot (160px), Querformat füllt mit `cover`, Hochkant volle Höhe mittig mit `contain`
- **Projektion:** Figure als 4:3-Slot, gleiche Logik

Kein eigener 3:4-Rahmen mehr — freie Fläche ist der Aktenhintergrund.

---

**User**

Kannst du die Akten ein bisschen breiter und höher machen, damit die Bilder mehr Platz bekommen? 

---

**Cursor**

Ich schaue mir an, wo Breite und Höhe der Akten sowie der Bildbereich festgelegt sind.

Aktenbreite kommt vom Shell/`offer-grid`, Bildhöhe vom Figure-Slot — ich plane eine moderate Vergrößerung.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Erledigt in [`style.css`](style.css):

- Shell `max-width`: 1600px  
- Karte `min-height`: 32rem  
- Bild-Slot / Archivfragment: 200px Höhe

---

**User**

im vollbildschirmmodus könnte die akte auch gerne etwas länger vllt um weiter 15px. Oder hast du eine andere idee?

---

**Cursor**

+15 px fällt kaum auf. Sinnvoller: der Bildbereich skaliert mit der Viewport-Höhe — im Vollbildschirm werden die Aktenbilder automatisch größer.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Umgesetzt:

- Bild-Slot: `clamp(200px, 22vh, 260px)` — wächst im Vollbildschirm
- Archivfragment füllt denselben Slot
- Karte: `min-height: 34rem`

---

**User**

der Medienberich verschiebt sich nach unten sobald der titel zu lange wird. Können wir für Titel und Jahr einen gleich hohen Bereich festlegen? Evtl 3 Titelzeilen

---

**Cursor**

Ich schaue mir an, wie Titel und Jahr aktuell layoutet sind.

Die Bild-Styles wirken zurückgesetzt — ich prüfe den aktuellen Stand und setze dann den festen Titel-/Jahr-Bereich.

Die vorherigen Bild-Änderungen scheinen lokal nicht mehr vorhanden zu sein — ich setze jetzt den festen Titel-/Jahr-Block um, damit der Medienbereich nicht mehr verrutscht.

Titel und Jahr liegen jetzt in einem festen Block (`.akte-card__heading`):

- Titel reserviert immer **3 Zeilen** und wird bei längeren Texten abgeschnitten (`line-clamp`)
- Jahr darunter mit fester Zeilenhöhe
- Der Medienbereich beginnt dadurch bei allen Akten auf derselben Höhe

---

**User**

kannst du den plan @/Users/michelle.berger/.cursor/plans/wider_taller_akten_672e41ba.plan.md nochmal bauen? und darin noch diefestgelegte zeilen für den titel damit sich der Meidnberich nicht evrschiebt? 

---

**Cursor**

Ich prüfe den aktuellen Stand und fasse den alten Vergrößerungs-Plan mit dem festen Titelblock zusammen.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Umgesetzt:

- Shell `1600px`, Karte `min-height: 32rem`, Medien-Slot `200px` (Bild und Archivfragment füllen ihn)
- Titelblock mit 3 Zeilen bleibt unverändert — Medienbereich verrutscht nicht mehr

