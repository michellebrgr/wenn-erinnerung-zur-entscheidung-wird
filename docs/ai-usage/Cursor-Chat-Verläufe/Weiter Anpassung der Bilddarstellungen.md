# Hochkantformate size discussion
_Exported on 17.8.2026 at 14:55:22 MESZ from Cursor (3.16.17)_

---

**User**

plan with me: Ihc finde die hochkantformate immer noch etwas klein.

---

**Cursor**

Ich schaue zuerst, wo die Hochkantformate aktuell skaliert werden, damit wir konkret planen können, wie sie größer werden.

Die Portrait-Klassen sitzen in CSS und JS — ich lese die Größenregeln und die letzte Anpassung dazu.

**Hochkantformate größer machen**

> **Wo wirken die Hochkantformate zu klein? (Beides ist möglich.)**
> - Akten-Karten (Laptop / Auswahl) ✔
> - Projektion / Erinnerungsraum (Beamer)

> **Wie sollen Hochkantbilder größer werden?**
> - Bildslot insgesamt etwas höher — Hochkant füllt dann mehr Höhe (Querformat bleibt cover) ✔
> - Hochkant darf breiter werden (weniger leere Ränder links/rechts), Slot-Höhe bleibt
> - Eigener Hochkant-Rahmen (z.B. 3:4) statt im Querformat-Slot zu stehen
> - Unsicher — du schlägst vor, was visuell am stimmigsten ist

Du willst also nur auf den Akten-Karten den Bildslot höher machen. Ich prüfe noch, wie viel Höhe dort wirklich frei ist.

Der Hebel ist klar: der Bildslot auf den Karten ist aktuell `clamp(160px, 18vh, 220px)` — Hochkant skaliert mit dieser Höhe. Ich lege den konkreten Plan fest.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Der Bildslot auf den Akten-Karten ist jetzt höher: `clamp(200px, 24vh, 280px)` statt `160px / 18vh / 220px`.

Hochkant füllt die volle Slot-Höhe mittig, Querformat bleibt `cover`. Die Projektion ist unverändert.

---

**User**

Plan with me: Lass uns generell über die Aktenansicht sprechen, ich finde es gibt hier unstimmigkeiten beim format

---

**Cursor**

Ich schaue mir die Aktenansicht genauer an — Bildslots, Hochkant/Querformat und Fragmente —, damit wir die Format-Unstimmigkeiten konkret benennen können.

**Aktenansicht: Format-Unstimmigkeiten**

> **Was wirkt in der Aktenansicht vor allem unstimmig?**
> - Hochkant wirkt neben Querformat unruhig (unterschiedliche Bildgröße/Leerflächen)
> - Archivfragmente (bildlose Akten) passen nicht zum Bildformat
> - Die Karten selbst sind unstimmig (Höhe, Textmenge, Abstände, drei Spalten) ✔
> - Bilder werden falsch beschnitten oder wirken gestaucht
> - Etwas anderes / mehrere Dinge — ich beschreibe es gleich

**Kartenlayout: woran genau?**

> **Was an der Karten-Gestaltung stört am meisten?**
> - Die drei Karten sind unterschiedlich hoch / der Inhalt rutscht uneinheitlich
> - Zu viel Text auf der Karte — wirkt gedrängt oder unruhig
> - Abstände und Ränder stimmen nicht (zu eng, zu weit, ungleich)
> - Die drei Spalten wirken zu schmal oder ungleichmäßig
> - Bildbereich und Textblock stehen in keinem klaren Verhältnis
>
> Answer: a und c

**Textmenge auf den Akten-Karten**

> **Die drei Karten werden vor allem durch unterschiedlich langen Text unruhig. Wie sollen wir das lösen?**
> - Voller Text bleibt — nur Layout angleichen (gleiche Kartenhöhe, Bänder, Abstände) ✔
> - Weniger Metafelder auf der Karte (compact-Modus, der schon existiert, aber ungenutzt ist)
> - Voller Inhalt, aber kürzen per Zeilenlimit (Titel, Beschreibung, Kriterien)

Voller Text bleibt — wir gleichen nur das Kartenraster an: gleiche Höhe, ausgerichtete Bänder, einheitliche Abstände.

---

**User**

@/Users/michelle.berger/.cursor/plans/align_akten_card_layout_54238003.plan.md sieht gut aus, ich würde aber sicherstellen wollen, dass die getsrichelte linie über der institutionellen relevanz immer auf der sleben höhe ist

---

**Cursor**

Die gestrichelte Linie sitzt am Anfang des Kriterienblocks — wenn die Texte unterschiedlich lang sind, reicht `margin-top: auto` nicht. Ich schärfe den Plan so, dass die Linie über alle drei Karten fluchtet.

Die gestrichelte Linie ist der **obere Rand** des Kriterienblocks. Mit `margin-top: auto` würde sie bei längerem Relevanz-Text nach oben rutschen — genau das wollen wir vermeiden.

Der Plan nutzt deshalb **CSS Subgrid**: Die drei Spalten teilen dieselbe Kriterien-Zeile. Deren Oberkante liegt immer auf einer Höhe; kürzere Texte stehen einfach weiter oben in derselben Zeile.

Dafür kommt in `app.js` ein kleiner Wrapper um Kopf (Signatur, Titel, Jahr), damit auch der Bildslot über die drei Karten fluchtet.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich starte mit dem Kopf-Wrapper in `app.js` und gleiche danach das Subgrid in CSS an.

Als Nächstes setze ich das Subgrid und die Abstände in CSS.

Die drei Akten einer Reihe teilen jetzt ein gemeinsames Raster.

**Karten:** Signatur, Titel und Jahr sitzen in einem Kopfblock. Die drei Spalten nutzen CSS Subgrid — Bild, Beschreibung, Meta, Kriterienlinie und Button liegen jeweils auf derselben Höhe.

**Linie:** Die gestrichelte Kante über der institutionellen Relevanz ist die Oberkante einer gemeinsamen Zeile. Längere Relevanz-Texte machen nur diese Zeile höher, schieben die Linie aber nicht nach oben.

**Abstände:** Innen 0.75rem zwischen den Bändern, Kopf enger (0.25rem), Spalten 1.75rem. Voller Text bleibt, die Projektion ist unverändert.

---

**User**

kannst du jetzt aber den bildschirm anpassen? wenn ich im vollbildmodus bin kann ich runterscrollen, dass will ich nicht 

---

**Cursor**

Du willst die Aktenansicht im Vollbild ohne Scrollen. Ich schaue, welche Höhen und Abstände den Overflow verursachen.

**Vollbild ohne Scrollen**

> **Im Vollbild soll nichts mehr scrollen. Womit sollen wir Platz sparen?**
> - Karteninhalt etwas kompakter machen (Abstände, Schrift, Bildslot), damit alles ohne Scrollen passt
> - Vor allem den Bildbereich kleiner halten, Text so lassen
> - Egal wie — Hauptsache im Vollbild kein Scrollen
>
> Answer: die leiste am boden/unter rand vllt entfernen, also vom bildschirm hintergrund

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich entferne zuerst die untere Leiste und stelle danach Viewport und Bildslot so ein, dass im Vollbild nichts mehr scrollt.

Die Archivansicht ist im Vollbild fest auf den Bildschirm gesetzt und scrollt nicht mehr.

**Fußleiste** der Archivansicht ist weg (Startbildschirm und Projektion behalten ihre).

**Viewport:** `100vh`, kein Overflow. Titel und Innenabstände sind etwas knapper.

**Bilder:** Der Slot nimmt die Restfläche (`minmax(140px, 1fr)`). Ist Platz da, werden sie größer — auch Hochkant. Die gestrichelte Linie über der Relevanz bleibt ausgerichtet.

---

**User**

kannst du die größe des hintergrundes beibehalten. aber die akten größe auf das zuvor setzen?

---

**Cursor**

Du willst den Vollbild-Hintergrund behalten, die Akten aber wieder auf die frühere Größe. Ich schaue kurz, welche Maße sich durch das Strecken geändert haben.

**Akten-Größe zurücksetzen**

> **Welche Akten-Größe meinst du mit „zuvor“?**
> - Bildslot wieder fest (clamp 200–280px), Karten nicht mehr über die ganze Höhe strecken ✔
> - Noch kleiner, wie ganz am Anfang (clamp 160–220px)

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Der Vollbild-Hintergrund bleibt (kein Scrollen, keine Fußleiste). Die Akten strecken sich nicht mehr über die Höhe.

Der Bildslot ist wieder fest: `clamp(200px, 24vh, 280px)`. Darunter bleibt freie Papierfläche.

---

**User**

ist gut, kannst du jetzt aber den abstand zwischen überschrift archiv und den boden gleichgroß machen, also die akten zentrieren?

---

**Cursor**

Die Akten sollen vertikal zwischen Überschrift und unterem Rand zentriert werden. Ich schaue mir die aktuelle Flex-Struktur an.

Die Akten sitzen jetzt vertikal in der Mitte zwischen der Überschrift „Archiv“ und dem unteren Rand — der Abstand darüber und darunter ist gleich. Das gilt für die Auswahl und für die Verdrängungsansicht.

---

**User**

Ich würde gerne die schriftgröße anpassen für den Text bei den Aktne udn auch im Erinnerungsraum 

---

**Cursor**

Ich schaue mir die aktuellen Schriftgrößen auf den Akten und im Erinnerungsraum an, damit wir gezielt anpassen können.

**Schriftgröße anpassen**

> **Wie soll die Schrift geändert werden?**
> - Kleiner — der Text wirkt zu groß / gedrängt
> - Größer — der Text ist schwer lesbar ✔
> - Nur auf den Akten-Karten (Laptop)
> - Beides gleichsinnig (Karten und Erinnerungsraum)

**Wie viel größer?**

> **Wie stark soll die Schrift wachsen — auf den Akten und im Erinnerungsraum (Projektion)?**
> - Etwas größer (etwa eine Stufe, z.B. 0.85 → 0.95rem)
> - Deutlich größer (gut lesbar aus etwas Distanz)
>
> Answer: bei den Akten ist Titel, Datum, Aktenzeichen, Kategorie gut, alles anderen Infos gerne ein wenig größer 1-2pt.
Beim erinnerungraum gerne datum udn Kurzbeschriebung deutlich größer vllt 4pt

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Die Schrift ist angepasst.

**Akten:** Beschreibung, Metadaten und Kriterien sind um 2pt größer. Titel, Datum, Aktenzeichen und Kategorie bleiben wie sie waren.

**Erinnerungsraum:** Jahr und Kurzbeschreibung sind um 4pt größer. Der Exponat-Titel ist unverändert.

---

**User**

Kannst du die Bilddarstellung der Akten die keine Bilder haben, im Erinnerungsraum so darstellen wie bei der aktenansicht, also nur vom bild?

---

**Cursor**

Ich vergleiche, wie bildlose Akten in der Aktenansicht und im Erinnerungsraum dargestellt werden.

**Bildlose Akten im Erinnerungsraum**

> **Was soll im Erinnerungsraum wie in der Aktenansicht sein?**
> - Nur das Aussehen: Fragmente im Erinnerungsraum sollen wie der Bildslot auf der Akte aussehen (Karton, Papier, Stempel)
> - Aussehen und Größe: gleicher Bildausschnitt wie auf der Akte, nicht der ganze Kachel-Hintergrund ✔

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Bildlose Akten im Erinnerungsraum nutzen jetzt denselben Karton-/Papier-Slot wie auf der Akte.

Das Fragment sitzt nur im 4:3-Bildrahmen neben Titel und Beschreibung — hell, wie ein Dokumentfoto, ohne dunkle Umfärbung. Die Schrift skaliert leicht mit, damit Vermerke auf dem Beamer lesbar bleiben.

---

**User**

Die Überschirft archov soll auf jedem Bildschirm die selbe größe haben 

---

**Cursor**

Die Überschrift „Archiv“ hat jetzt eine feste Größe: **3rem**, unabhängig vom Bildschirm — auf dem Startbildschirm und in der Aktenansicht gleich.

---

**User**

Im startbildschirm ist sie noch auf einer anderen höhe, bitte die höhe von den anderen bildschirmen übernehmen.

---

**Cursor**

Die Überschrift sitzt auf dem Startbildschirm tiefer wegen anderem Padding und Margin. Ich gleiche das an die Aktenansicht an.

Die Überschrift „Archiv“ sitzt auf dem Startbildschirm jetzt an derselben Stelle wie in der Aktenansicht: gleicher Abstand zur oberen Leiste, kein extra Margin darunter. Die Willkommenskarte bleibt in der Restfläche zentriert.

