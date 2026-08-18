# Archive taxonomy comparison
_Exported on 18.8.2026 at 15:03:14 MESZ from Cursor (3.16.17)_

---

**User**

Plan with me: ich hab meine @assests/documentation/archive-taxonomy.md angepasst. Kannst du das bitte mit dem aktuellen technischen Stand vergleichen. Und wir gehen dann durch wie, was angepasst werden muss

---

**Cursor**

Ich vergleiche zuerst die angepasste Taxonomie mit dem aktuellen Code, damit wir danach konkret durchgehen können, was angepasst werden muss.

Ich gleiche jetzt die Kataloge und die Generierungslogik im Code direkt mit der Taxonomie ab.

Die Kataloge passen schon weitgehend. Zwei konzeptionelle Änderungen in der Taxonomie würden den Umbau stark steuern — die kläre ich zuerst.

**Abgleich Taxonomie ↔ Code**

> **Die Taxonomie beschreibt institutionelle Relevanz neu als Bewertung hoch/mittel/gering plus Aufnahmehinweis (empfohlen / prüfenswert / nicht priorisiert), abgeleitet aus Passung, Dokumentationsgrad und Erhaltungsbedarf. Im Code stehen noch feste Phrasen pro Kategorie (z. B. »von lokaler Bedeutung«), ohne Scoring. Wie sollen wir das behandeln?**
> - Neues Modell umsetzen: Scoring intern, sichtbar nur Stufe + Aufnahmehinweis ✔
> - Aktuelle Phrasen vorerst behalten; Taxonomie später an den Code anpassen
> - Hybrid: Scoring + Aufnahmehinweis, Phrasen nur noch intern/für kuratierte Begründung

> **Wo sollen wir als Nächstes konkret ansetzen? Der Rest bleibt im Plan als spätere Pakete.**
> - Generierungslogik (Widersprüche, Titel/Kontext, Fragment-Pools, Herkunft)
> - Archivinterface (fehlende Felder, Kontext statt Kurztext, Aufnahmehinweis)
> - Beides, aber nur die Kernlücken — nicht die Feinjustierung der Kataloge
> - Erst den vollständigen Abgleich durchgehen, noch nichts priorisieren ✔

Scoring-Modell ist gesetzt. Ich lege den vollständigen Abgleich als Plan an, ohne schon eine Umsetzungsreihenfolge festzuziehen.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Abgleich um und beginne mit dem Scoring für die institutionelle Relevanz. Zuerst lese ich die relevanten Dateien.

Ich beginne mit den Katalogen in `data.js` und setze danach Scoring, UI und Generierung darauf auf.

Als Nächstes kommt die Generierungslogik: Scoring, Plausibilität und die neuen Textstrukturen.

Die Taxonomie und der Code sind jetzt aneinander angeglichen. Das Wichtigste:

**Institutionelle Relevanz** entsteht intern aus Passung, Dokumentationsgrad und Bewahrungsbedarf (je 0–2, Summe 0–6). Sichtbar sind nur Stufe (`hoch` / `mittel` / `gering`) und Aufnahmehinweis. Die alten Phrasen wie „von lokaler Bedeutung“ bleiben bei Bildakten als hinterlegte Begründung, werden aber nicht mehr angezeigt.

**Archivkarte** zeigt die Kontextbeschreibung statt der Kurzbeschreibung, plus die fehlenden Metadaten (Dokumentationsgrad, Erhaltungszustand, Material, fehlende Informationen, Aktenart). Die Kurzbeschreibung bleibt dem Erinnerungsraum vorbehalten.

**Generierung:** Titel- und Kontextstrukturen folgen der Taxonomie. Bildlose Akten bekommen Herkunft aus dem Ort. Dokumentationsfragmente kommen aus eigenen Kategorie-Pools, Aktenarten aus Vermerk-Pools. Offensichtliche Widersprüche zwischen Objekttyp, Material, Provenienz und Zustand werden gefiltert.

**Bildakten** nutzen dasselbe Katalogvokabular (Dokumentationsgrad, Erhaltung, Sammlungsnamen). In der Taxonomie sind Provenienz und Dokumentationsgrad nachgetragen.

---

**User**

führe es nochmal aus

---

**Cursor**

Ich prüfe zuerst den aktuellen Stand der Dateien — es sieht so aus, als wäre die vorherige Umsetzung nicht mehr im Code.

Die Änderungen sind zurückgesetzt. Ich setze den Plan erneut um und lese zuerst den aktuellen Stand.

Die Umsetzung ist zurückgesetzt. Ich spiele die Plan-Änderungen jetzt erneut ein, beginnend mit den Katalogen.

Als Nächstes kommt die Generierungslogik in `generator.js`.

Der Plan ist erneut vollständig umgesetzt. Die vorherigen Änderungen waren im Arbeitsstand nicht mehr vorhanden; sie sind jetzt wieder im Code.

**Scoring:** Institutionelle Relevanz entsteht intern aus Passung, Dokumentationsgrad und Bewahrungsbedarf. Sichtbar sind nur Stufe (`hoch` / `mittel` / `gering`) und Aufnahmehinweis.

**Archivkarte:** Kontextbeschreibung statt Kurztext, plus die fehlenden Metadaten. Die Kurzbeschreibung bleibt im Erinnerungsraum.

**Generierung:** neue Titel- und Kontextstrukturen, Herkunft aus dem Ort, Dokumentationsfragment-Pools, Vermerk-Pools, Filter gegen offensichtliche Widersprüche.

**Bildakten** nutzen dasselbe Katalogvokabular. In der Taxonomie sind Provenienz, Dokumentationsgrad und die Bewertungslogik nachgetragen.

