# Aktenanzeige nach Verdrängung
_Exported on 17.8.2026 at 14:55:46 MESZ from Cursor (3.16.17)_

---

**User**

mir ist aufgfeallen, dass die akten, die nicht ausgewählt oder verdrängt werden nciht aus dem aktuellen durchlauf verschwinden. Kannst du dies bitte wieder umsetzten? Heißt sobald eine akte aus dem erinnerunsgraum verdrängt wurde oder eien akte nicht gewählt wurde soll sie bis zum reset nciht nochmal angezeigt werden

---

**Cursor**

Ich schaue mir zuerst an, wie Akten im aktuellen Durchlauf ausgewählt, verdrängt und wieder angezeigt werden.

Ich lese die relevanten Stellen in State, Generator und Auswahlfluss, damit der Plan zur bestehenden Logik passt.

Der Bestätigungstext verspricht schon, dass nicht gewählte Akten entfernt bleiben — im State fehlt dafür aber noch die Ausschlussliste. Ich lege den Plan dafür an.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze die Ausschlussliste im State um und markiere danach nicht gewählte sowie verdrängte Akten.

Ich aktualisiere `state.js` zuerst: Ausschlussliste speichern und bei Auswahl sowie Verdrängung befüllen.

Nicht gewählte und verdrängte Akten bleiben jetzt bis zum Reset aus dem Angebot.

Der State merkt sich in `usedBildIds`, welche Bilder in diesem Durchlauf schon vorgekommen sind. Beim nächsten Angebot werden sie zusammen mit den Bildern im Erinnerungsraum ausgeschlossen.

- **Nicht gewählt:** Die beiden anderen Akten aus dem Dreierangebot werden markiert, sobald eine Akte aufgenommen wird.
- **Verdrängt:** Die ersetzte Akte wird ebenfalls markiert und taucht nicht wieder auf.
- **Reset:** Shift+R leert die Liste, danach können alle Akten wieder erscheinen.

Bildlose Akten werden weiterhin neu erzeugt; ausgeschlossen werden nur Archivbilder.

---

**User**

Ist das auch für die bildlosen akten?

---

**Cursor**

Ich prüfe kurz, ob bildlose Akten in der Ausschlussliste landen — bisher waren nur Bildakten vorgesehen.

Bisher gilt das nur für Akten mit Bild. Bildlose werden neu erzeugt und können deshalb wieder auftauchen. Ich stelle das gleich, damit auch sie bis zum Reset draußen bleiben.

Bisher nicht — das gilt jetzt auch für bildlose Akten.

Nicht gewählte oder verdrängte bildlose Akten bleiben bis zum Reset draußen. Weil sie kein Archivbild haben, merkt sich der Durchlauf die Kategorie (`ohne-bild-arbeit`, `ohne-bild-migration` usw.). Eine bildlose Akte derselben Kategorie kommt also nicht noch einmal, bis du mit Shift+R zurücksetzt.

Andere Kategorien können weiterhin als neue bildlose Akten erscheinen, genau wie unbenutzte Fotos.

---

**User**

Also es soll nciht von der Kategorie abhängig sein, es soll nur die die selbbe zusammenstellung der Kataloge geben. Also die bildlosen akten sollen immer anderss generiert sein . Erst nahc reset können die gleichen Kombinationen nochmals genutzt werden

---

**Cursor**

Du willst also keine Kategorie-Sperre, sondern dass dieselbe Katalog-Kombination einer bildlosen Akte erst nach Reset wiederkommt. Ich schaue nach, welche Felder diese Kombination bilden.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich ersetze die Kategorie-Sperre durch Kombinationsschlüssel und passe danach den State an.

`motiv` gehört zur Kombination, steht aber noch nicht auf der Akte. Ich speichere es mit, damit der Schlüssel nach dem Speichern gleich bleibt.

Bildlose Akten werden nicht mehr nach Kategorie gesperrt. Derselbe Katalog-Mix erscheint erst nach Reset wieder.

Eine bildlose Akte darf dieselbe Kategorie erneut haben, solange die Bausteine anders zusammengesetzt sind (`objekttyp`, `motiv`, `herkunft`, `sammlung`, `aktenart` usw.). Nicht gewählte oder verdrängte Kombinationen bleiben bis Shift+R draußen. Bildakten werden weiterhin über ihre Bild-ID ausgeschlossen.

