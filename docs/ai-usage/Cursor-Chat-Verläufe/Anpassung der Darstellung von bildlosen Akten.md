# Archivische Darstellung für Akten
_Exported on 17.8.2026 at 14:25:48 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte bei Akten ohne Bild nicht mehr Kein Bild vorhanden haben. Ich würde dort gerne eine automatisch generierte archivische Darstellung haben, zum Beispiel einen Archivvermerk, ein Metadatenblatt oder etwas Ähnliches.

Die Darstellung soll zu den bestehenden Akten passen und sich aus den Informationen der jeweiligen Akte ergeben.

Bevor du etwas umsetzt, schau dir bitte mein  Projekt an und stelle mir alle Fragen, die du für die Planung und Umsetzung noch brauchst.


---

**Cursor**

Ich schaue mir zuerst an, wie Aktenbilder und der „Kein Bild vorhanden“-Fall im Projekt aufgebaut sind — danach stelle ich gezielte Fragen.

Ich habe mir das Projekt angesehen. Kurz der Stand:

- „Kein Bild vorhanden“ kommt nur in [`app.js`](app.js) (`renderAkteImage`) vor, wenn `akte.bild` fehlt.
- Bildlose Akten entstehen zur Laufzeit in [`generator.js`](generator.js) und haben trotzdem Titel, Jahr, Signatur, Kategorie, Objekttyp, Herkunft usw.
- Die Karte zeigt Signatur, Kategorie, Titel, Jahr und Meta ohnehin schon — der Bildbereich ist nur der Ersatz für die fehlende Fotografie.
- In der Projektionsansicht ([`projection.js`](projection.js)) ist der Platzhalter aktuell leer (ohne Text).

Damit die Darstellung passt, brauche ich noch diese Entscheidungen:

### 1. Form der Darstellung
Was soll im Bildbereich stehen?

- **Archivvermerk** — Stempel-/Vermerk-Ästhetik: z. B. „Bilddokumentation nicht überliefert“, Signatur, Kategorie, Jahr  
- **Metadatenblatt** — kleines Formular/Indexkarte mit mehreren Feldern (Objekttyp, Herkunft, Provenienz …)  
- **Fehlblatt / Lückenvermerk** — bewusster Hinweis auf fehlendes Bildmaterial im Bestand  
- Etwas anderes (bitte kurz beschreiben)

### 2. Welche Informationen?
Welche Felder sollen **im Bildersatz** erscheinen — und dürfen sie mit dem Rest der Karte (Titel, Meta darunter) **teilweise doppeln**, oder soll der Bildbereich bewusst **andere** Infos zeigen (z. B. nur Signatur + Vermerktext + Jahr)?

### 3. Variation
Soll jede bildlose Akte **dieselbe Vorlage** bekommen (nur mit ihren Daten befüllt), oder soll die Darstellung **nach Kategorie** (oder zufällig) leicht variieren?

### 4. Projektionsansicht
Soll dieselbe archivische Darstellung auch in der **Projektion** ([`projection.html`](projection.html) / leerer Platzhalter) erscheinen, oder nur auf den **Aktenkarten** im Angebot/Erinnerungsraum?

### 5. Ton / Sprache
Eher **institutionell-trocken** („Bildvorlage fehlt. Objekt nur über Metadaten erschlossen.“) oder eher **kuratorisch-erzählend**, passend zu den generierten Kurzbeschreibungen?

Wenn du zu diesen Punkten antwortest, kann ich daraus einen konkreten Umsetzungsplan machen.

---

**User**

Form: mehrere Varianten -> Archivvermerk, Metadatenblatt, Lückenvermerk
Infos: eher zusätzliche Angaben -> z. B. Signatur, Material, Zustand, Herkunft
Variation: leicht variieren, aber pro Akte immer gleich
Projektion: ja, dort ebenfalls anzeigen
Ton: institutionell, trocken, sachlich

---

**Cursor**

Die Antworten reichen für einen konkreten Plan. Ich prüfe kurz noch, welche Metadaten bildlose Akten wirklich mitbringen und wie die Projektion rendert.

Die Metadaten für Material und Zustand werden schon erzeugt, aber noch nicht auf der Akte gespeichert — das fließt in den Plan ein.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um und beginne mit dem Persistieren der Metadatenfelder in `generator.js`.

`materialhinweis` aus den Options muss in `generateAktenMetadaten` durchgereicht werden.

Für ältere localStorage-Akten vermeide ich zufällige Neuwerte und nutze nur gespeicherte Felder, Kriterien oder „nicht angegeben“.

Umgesetzt. Bildlose Akten zeigen jetzt eine archivische Darstellung statt „Kein Bild vorhanden“.

**Daten:** `materialhinweis`, `erhaltungszustand` und `dokumentationsgrad` werden in `buildAkte` / `normalizeAkte` mitgespeichert; ältere Akten nutzen Bewertungskriterien bzw. „nicht angegeben“.

**Darstellung:** Neue [`archiv-darstellung.js`](archiv-darstellung.js) wählt pro `akte.id` stabil eine von drei Varianten (Archivvermerk, Metadatenblatt, Lückenvermerk) und füllt Signatur, Material, Zustand, Herkunft bzw. Dokumentationsgrad.

**UI:** Eingebunden in Karten ([`app.js`](app.js)) und Projektion ([`projection.js`](projection.js)), gestylt in [`style.css`](style.css).

---

**User**

Ich frage mich, ob nicht die ganze Akte etwas stärker wie ein Archivfragment wirken sollte, statt nur der obere Bereich. Wichtig ist mir aber, dass sie trotzdem gut lesbar und klar strukturiert bleibt. Schau bitte mal, wie man den gesamten Kartenstil etwas archivischer machen könnte, ohne die Übersichtlichkeit zu verlieren.

---

**Cursor**

Ich schaue mir den aktuellen Kartenstil an und prüfe, wo wir die Akte insgesamt archivischer machen können, ohne die Lesbarkeit zu opfern.

Die Karte ist schon als Ringbuchseite angelegt (Lochrand, Signatur in Stempelrot, gestapelte Unterseite). Darunter wirken Kurztext, Meta und Kriterien eher wie eine normale UI-Liste — deshalb wirkt vor allem der Bild-/Vermerkbereich „archivisch“, der Rest eher neutral.

Bevor ich einen konkreten Umsetzungsplan schreibe: **Wie stark soll die ganze Akte archivischer werden?**

1. **Dezent** — Papiertextur, leichte Alterung, klarere Typografie; Layout bleibt praktisch gleich  
2. **Mittel** — zusätzlich Stempel-/Vermerk-Akzente, gestrichelte Trennlinien, Indexkarten-Feeling bei Meta und Kriterien  
3. **Deutlich** — starkes Dossier-/Fragment-Feeling (Patina, Stempel, Randnotizen-Anmutung), aber weiterhin gut lesbar  

Schreib mir einfach `1`, `2` oder `3` — dann plane ich darauf zugeschnitten.

---

**User**

2

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den mittleren Archiv-Kartenstil um und beginne mit Papierfläche und Binder.

Ich aktualisiere den Kartenstil in CSS und passe die Meta-Markup-Struktur leicht an.

Der mittlere Archiv-Kartenstil ist umgesetzt.

**Papier & Binder:** wärmerer Ton, feine Textur, eckigere Blätter, älter wirkender Stapel und Lochrand.

**Typografie:** Signatur als Aktenzeichen, Kategorie als Stempelrahmen, Serif-Titel, Jahr als Nebenangabe, Fragment als Notiz mit linker Kante.

**Meta & Bewertung:** Abschnittsköpfe, gestrichelte Trenner, Label/Wert-Raster; Kriterienlabels in Stempelrot.

**Bild/Vermerk:** gleiche Rand- und Papierlogik wie die Karte (eingeheftet).

---

**User**

Probieren wir es anders: Wenn bei einer Akte keine Datei von mir hinterlegt ist, soll das System stattdessen automatisch eine archivische Darstellung erzeugen. Dafür möchte ich feste Varianten wie Archivvermerk, Bestandsnotiz, Dokumentfragment und digitalen Datensatz nutzen. Eine Überlieferungslücke kann selten vorkommen. Bitte erstmal nur diese Aktenarten einplanen, noch nichts am Design ändern.

---

**Cursor**

Ich prüfe den aktuellen Stand der bildlosen Akten und plane nur die neuen Aktenarten — ohne Designänderungen.

Der Stand ist wieder ohne die frühere Bildersatz-UI — bildlose Akten werden nur erzeugt. Bevor ich plane, eine Klärung:

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze das Datenmodell für die Aktenarten um und starte mit dem Katalog in `data.js`.

Umgesetzt — nur Datenmodell, kein Design.

**[`data.js`](data.js):** Katalog `ARCHIV_AKTENARTEN` mit den fünf Arten; Überlieferungslücke mit Gewicht 60 (~6 %), die anderen je 235 (~23,5 %).

**[`generator.js`](generator.js):** Bildlose Akten bekommen gewichtet eine `aktenart`; Bildakten `null`. `normalizeAkte` behält den Wert bzw. leitet ihn bei Altdaten stabil aus der ID ab.

---

**User**

Jetzt sollen die fünf Aktenarten jeweils passende Inhalte bekommen. Bitte plane pro Aktenart, welche wenigen Informationen dort sinnvoll erscheinen können. SIe sollen sich aber nicht doppeln und plausibel zur Akte sein.

---

**Cursor**

Ich schaue kurz, welche Felder die Akte und die Karte schon zeigen — danach plane ich pro Aktenart die passenden, nicht doppelnden Inhalte.

Auf der Karte stehen schon Signatur, Kategorie, Titel, Jahr, Kurztext sowie Objekttyp, Herkunft, Provenienz, Sammlung und Bewertungskriterien. Die Aktenart-Inhalte sollten also **andere** Angaben nutzen und sich **unter den fünf Arten** unterscheiden.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze die Inhaltsprofile und die Persistenz der Metadaten um.

Umgesetzt — weiterhin ohne UI.

**[`data.js`](data.js):** Jede Aktenart hat jetzt `vermerk` und `felder` (z. B. Archivvermerk → Signatur + Material; Überlieferungslücke → Dokumentationsgrad + fehlende Information).

**[`generator.js`](generator.js):** `materialhinweis`, `erhaltungszustand`, `dokumentationsgrad` und `fehlendeInformation` werden auf der Akte gespeichert und in `normalizeAkte` stabil aufgelöst (inkl. Fallback aus Bewertungskriterien bzw. „nicht angegeben“).

---

**User**

plan  die fünf Aktenarten und setze sie im Bildbereich um. Wichtig ist nur, dass sie nicht wie kleine Infoboxen aussehen, sondern eher wie echte Archivfragmente. Bitte wenig doppeln und eher reduziert und dokumentarisch halten.

---

**Cursor**

Ich prüfe den aktuellen Stand von Datenmodell und Bildbereich, dann plane ich die fünf Archivfragmente.

---

**User**

Passt so. Nur beim Dokumentfragment bitte keine Material-/Zustandsangaben, sondern wirklich einen kurzen fragmentarischen Textausschnitt mit 2–3 Zeilen. 

---

**Cursor**

Ich passe den Plan an: Beim Dokumentfragment statt Material/Zustand ein kurzer fragmentarischer Textausschnitt.

Passt — Plan ist angepasst.

**Dokumentfragment** zeigt im Bildbereich keinen Material-/Zustandseintrag mehr, sondern einen **kurzen Textausschnitt (2–3 Zeilen)** aus der `kontextbeschreibung` (fragmentarisch gekürzt). Die anderen vier Arten bleiben wie geplant.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze die Archivfragmente im Bildbereich um und beginne mit dem Katalog-Update für Dokumentfragment.

Umgesetzt. Bildlose Akten zeigen im Bildbereich jetzt Archivfragmente statt „Kein Bild vorhanden“.

- **Katalog:** Dokumentfragment nutzt `textauszug` (kein Material/Zustand).
- **Renderer:** [`archiv-darstellung.js`](archiv-darstellung.js) — eingebunden in Karte und Projektion.
- **Darstellung:** fünf reduzierte Fragment-Typen; Dokumentfragment mit 2–3 Zeilen aus der Kontextbeschreibung.

---

**User**

bitte passe noch an, dass bei den akten immer eine gemischte auswahl angeziegt werden, also 0,1,2 akten sollen in der auswahl immer ohne bild sein und dies zufällig

---

**Cursor**

Ich prüfe die aktuelle Angebotsauswahl und stelle sie so um, dass zufällig 0–2 bildlose Akten dabei sind.

Ich passe `pickArchiveAkten` an: zufällig 0–2 bildlose Akten, Rest mit Bild, Reihenfolge gemischt.

Jedes Angebot (3 Akten) enthält jetzt zufällig **0, 1 oder 2** bildlose Akten; der Rest hat Bilder. Die Reihenfolge wird gemischt, damit die bildlosen nicht immer am Ende stehen.

---

**User**

Die frequentierung der akten gefällt mir. Aber mir gefällt die Darstellung noch nicht. Gerade wirkt es wieder wie ein Platzhalter mit einer Textbox. Ich möchte, dass die generierte Aktenart den ganzen Bildbereich einnimmt und eher wie ein tatsächliches Archivstück oder Dokumentfragment wirkt. Weniger Text, keine kleine Box im Bildbereich und auch in der Projektion deutlich präsenter und besser lesbar. Benutze dafür den Planmodus

---

**Cursor**

Ich schaue mir die aktuelle Fragment-Darstellung in Karte und Projektion an und plane dann eine vollflächige, dokumentarische Überarbeitung.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze die vollflächigen Fragmente um und beginne mit der schlankeren Anzeige-Logik.

Umgesetzt.

**Anzeige:** nur Stempel + Haupttext + optional eine Akzentzeile; Dokumentfragment = Textauszug (Vermerk nur als Fußzeile); keine Label/Wert-Zeilen mehr.

**Layout:** Fragment füllt den Bildbereich (`aspect-ratio 4/3`, wie ein Foto), Papierfläche statt Textbox.

**Projektion:** größere Schrift und stärkerer Kontrast im Dark-Mode.

---

**User**

Ich möchte, dass Akten ohne Bild oben eher wie ein echtes Archivfragment wirken ->  eingelegter Zettel, Dokumentausschnitt oder unvollständiges Blatt. Keine kleine Infobox, sondern das Fragment selbst ersetzt das Bild. Dezent, dokumentarisch.
Geh bitte erst in den Plan-Modus und stell mir die Fragen, die du dafür noch brauchst.

---

**Cursor**

Die Richtung ist klar (Fragment = Bildersatz, dezent, dokumentarisch). Bevor ich plane, brauche ich noch diese Entscheidungen:

### 1. Wie stark sollen sich die fünf Aktenarten unterscheiden?
- **A)** Nur leicht (gleiches „eingelegtes Blatt“, unterschiedliche Kanten/Texturen)  
- **B)** Klarer als Formate: z. B. Zettel / Dokumentausschnitt / unvollständiges Blatt / digitaler Ausdruck / leere Lücke  

### 2. Wie viel Text soll im Fragment stehen?
- **A)** Sehr wenig: nur Stempel/Art + ein kurzer Vermerk **oder** Textfetzen (keine Signatur-/Meta-Akzentzeile)  
- **B)** Wie jetzt: Stempel + Haupttext + optional eine Akzentzeile (Signatur/Jahr/…)  

Antworte einfach mit z. B. `1B, 2A` — danach mache ich den konkreten Plan.

---

**User**

1b
2a

---

**Cursor**

Mit 1B und 2A plane ich klar unterscheidbare Fragment-Formate und sehr wenig Text.

---

**User**

Passt für mich. Nur bei der Überlieferungslücke bitte keinen gestrichelten Placeholder-Rand. Und den digitalen Datensatz nur bei Akten verwenden, bei denen das inhaltlich auch plausibel ist. Dann kannst du es umsetzen.

---

**Cursor**

Ich setze den Plan um: Überlieferungslücke ohne gestrichelten Rand, und `digitaler-datensatz` nur bei inhaltlich plausiblen Akten.

Die Anpassungen sind notiert, aber ich stecke noch im **Plan-Modus** und darf deshalb keinen Code ändern (der Wechsel in den Agent-Modus wurde abgelehnt).

Bitte kurz **Agent-Modus** freigeben bzw. „umsetzen“ erneut bestätigen — dann setze ich sofort um:

1. **Fünf klare Formate** (Zettel / Ausschnitt / Blatt / Ausdruck / Lücke), Fragment = Bildersatz, wenig Text  
2. **Überlieferungslücke** ohne gestrichelten Placeholder-Rand  
3. **`digitaler-datensatz`** nur, wenn Objekttyp/Material/Text digital nahelegen

---

**User**

modus wurde gewechselt

---

**Cursor**

Ich setze die Fragment-Formate jetzt um — inkl. plausibler digitaler Datensatz und Lücke ohne gestrichelten Rand.

Umgesetzt.

**Formate:** Bestandsnotiz als eingelegter Zettel, Dokumentfragment als Ausschnitt mit Textfetzen, Archivvermerk als unvollständiges Blatt, digitaler Datensatz als Raster-Ausdruck, Überlieferungslücke als ruhige Leere **ohne** gestrichelten Rand.

**Text:** nur Stempel + Vermerk bzw. Textauszug — keine Meta-Akzentzeile.

**Digital:** `digitaler-datensatz` nur, wenn Objekttyp/Material/Text digital nahelegen.

---

**User**

führe die änderung nochmal aus bzw prüfe vorher was beim merge abhanden gekommen ist

---

**Cursor**

Ich prüfe, was nach dem Merge fehlt, und stelle die verlorenen Änderungen wieder her.

In `buildAkte` fehlt vermutlich `aktenart`, und in `pickArchiveAkten` steckt ein Merge-Fehler — ich prüfe das genauer.

Beim Merge ist in `buildAkte` die `aktenart` und die Zusatzfelder verloren gegangen; außerdem gibt es einen kaputten Aufruf `pickRandomOhneBildAkte(ohneBild)`. Ich stelle das wieder her.

Beim Merge war vor allem [`generator.js`](generator.js) beschädigt. Wiederhergestellt:

1. **`buildAkte`:** setzt wieder `aktenart` (inkl. Plausibilität für digitale Datensätze) sowie `materialhinweis`, `erhaltungszustand`, `dokumentationsgrad`, `fehlendeInformation`
2. **`pickArchiveAkten`:** kaputter Aufruf `pickRandomOhneBildAkte(ohneBild)` → wieder `pickRandomOhneBildAkte()` (hätte sonst mit `ReferenceError` abgebrochen)
3. **`generateAktenMetadaten`:** Options für Material/fehlende Information werden wieder durchgereicht

UI (`archiv-darstellung.js`, CSS-Formate, HTML-Einbindung, Angebot 0–2 ohne Bild) war noch da. Bitte einmal hart neu laden, dann sollten bildlose Akten wieder Fragmente zeigen.

---

**User**

lass uns weitere änderungen planen über den plan moduss

---

**Cursor**

Klar — im Plan-Modus können wir als Nächstes gezielt weiterarbeiten.

**Woran sollen wir als Erstes weiterplanen?** Zum Beispiel:

1. **Darstellung** der Archivfragmente (Formate, Typo, Projektion)  
2. **Inhalte/Texte** der bildlosen Aktenarten  
3. **Angebotslogik** (Häufigkeit 0–2 ohne Bild, digitale Plausibilität)  
4. **Kartenstil** insgesamt  
5. **Etwas anderes** (kurz beschreiben)

Schreib einfach die Nummer oder dein Thema — dann stelle ich gezielte Rückfragen und mache daraus einen konkreten Plan.

---

**User**

1

---

**Cursor**

Gut — Fokus: **Darstellung der Archivfragmente**.

### 1. Was stört dich aktuell am meisten?
- **A)** Wirkt noch zu sehr wie UI/Kasten, zu wenig wie Papierstück  
- **B)** Zu wenig Unterschied zwischen den fünf Formaten  
- **C)** In der **Projektion** zu klein / schlecht lesbar  
- **D)** Mehrere Punkte (kurz nennen)

### 2. Wie weit sollen wir die Optik noch treiben?
- **A)** Feinschliff (Abstände, Typo, Kontrast, leichte Form-Unterschiede)  
- **B)** Deutlichere Papier-Dramaturgie (stärkerer Zettel/Abriss/Lücke), weiterhin dezent  

Antworte z. B. mit `1A, 2B` oder einer kurzen Mischung.

---

**User**

1a und mischung aus 2 a und b 

---

**Cursor**

Ich schaue kurz den aktuellen Fragment-CSS an und plane dann den Feinschliff mit etwas stärkerer Papier-Dramaturgie.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Papier-Feinschliff um: zuerst das Sheet-Markup, dann das CSS.

Umgesetzt.

**Struktur:** Äußerer Slot = matter Karton; Inhalt sitzt auf einem inneren Blatt (`__sheet`) — außer bei der Überlieferungslücke.

**Formate:** Zettel kleiner/schräger, Vermerk mit Stempelkante und Abriss, Dokumentausschnitt unregelmäßiger, Digital als Rasterblatt, Lücke als blasser Karton ohne Rahmen.

**Projektion:** helleres Blatt auf dunklem Karton, bessere Lesbarkeit.

---

**User**

kannst du den plan ncohmla umsetzen? Die änderungen sind weg

---

**Cursor**

Ich prüfe zuerst den aktuellen Stand der relevanten Dateien und setze den Plan danach wieder um.


In `generator.js` fehlen die Aktenart-Funktionen nach dem letzten Commit — ich stelle sie aus dem vorherigen Stand wieder her.


Der Plan ist wieder umgesetzt. Ursache war der Commit `ea1e17b` („Update generator.js“): Dabei waren **365 Zeilen** aus `generator.js` verschwunden — vor allem die gesamte Aktenart-Logik.

**Wiederhergestellt in `generator.js`:**
- Aktenart-Zuweisung (`resolveAktenart`, `pickAktenartByHash`, Plausibilitätsprüfung für digitalen Datensatz)
- Zusatzfelder auf der Akte (`materialhinweis`, `erhaltungszustand`, `dokumentationsgrad`, `fehlendeInformation`)
- Gemischte Auswahl: **0–2 bildlose Akten** pro Angebot, zufällig gemischt
- `buildAkte` und `normalizeAkte` mit vollständiger Persistenz

**Zusätzlich behoben:** `aktenart` fehlte im Rückgabeobjekt von `normalizeAkte` — das ist jetzt ergänzt.

**Bereits vorhanden** (unverändert):
- `archiv-darstellung.js` mit Papier-Sheet-Markup
- `style.css` mit Karton-Slot + fünf Papierformaten
- Einbindung in `app.js`, `projection.js`, `index.html`, `projection.html`

Seite neu laden — bildlose Akten sollten wieder die fünf Archivfragment-Typen mit Papier-Optik zeigen. Soll ich die Änderungen committen?

