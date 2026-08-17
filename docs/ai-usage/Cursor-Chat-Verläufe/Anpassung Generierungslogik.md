# Random year generation
_Exported on 17.8.2026 at 14:47:25 MESZ from Cursor (3.16.17)_

---

**User**

Das Jahr ist  noch fest vergeben.

Ich möchte das Jahr lieber automatisch erzeugen lassen.

Es soll zufällig unterschiedliche Angaben geben, zum Beispiel:

ein genaues Jahr
ca. + Jahr
ein Jahrzehnt (z. B. 1970er Jahre)
oder nicht datiert

---

**Cursor**

Ich schaue mir an, wie das Jahr aktuell im Projekt festgelegt ist und wo es generiert wird.


Ich implementiere die zufällige Jahresgenerierung in `generator.js` und entferne die festen Jahre aus `data.js`.


Das Jahr wird jetzt bei jeder neu erzeugten Akte zufällig vergeben — nicht mehr fest in den Daten.

### Was sich geändert hat

**`generator.js`** — neue Funktion `generateJahr()` mit vier gleich wahrscheinlichen Formen:
- genaues Jahr (z. B. `1987`)
- ungefähre Angabe (z. B. `ca. 1974`)
- Jahrzehnt (z. B. `1970er Jahre`)
- `nicht datiert`

Der Jahresbereich lässt sich oben in der Datei anpassen:
```8:12:generator.js
/** Untergrenze für zufällige Jahresangaben */
const DATIERUNG_JAHR_MIN = 1920;

/** Obergrenze für zufällige Jahresangaben */
const DATIERUNG_JAHR_MAX = 2020;
```

Die Archivsignatur passt sich automatisch an (z. B. `AK-1987-042`, `AK-CA1974-018`, `AK-197X-091`, `AK-UND-056`).

**`data.js`** — alle festen `jahr`-Einträge in den Varianten wurden entfernt. Die Datierung entsteht nur noch zur Laufzeit.

### Verhalten

- Jedes Mal, wenn neue Akten ins Angebot kommen, bekommen sie eine neue zufällige Datierung.
- Bereits gespeicherte Akten im Erinnerungsraum behalten ihre Datierung (localStorage).
- Beim Neuladen der Seite mit bestehendem Speicherstand bleiben die alten Jahre erhalten. Für komplett neue Zufallswerte: localStorage leeren oder eine neue Akte ins Angebot holen.

Wenn du den Jahresbereich oder die Wahrscheinlichkeiten (z. B. öfter „nicht datiert“) anpassen willst, sag Bescheid.

---

**User**

Auch die restlichen Informationen sollen automatisch generiert werden.

Dazu gehören:

Objekttyp
Herkunft
Provenienz
Sammlung

Die Angaben sollen aus einer Liste zufällig gewählt werden.

Ich möchte die Listen später selbst erweitern können.

---

**Cursor**

Ich schaue mir an, wie die Felder aktuell in den Daten und im Generator hinterlegt sind.


Ich erweitere die Listen in `data.js` und passe den Generator an, damit Objekttyp, Herkunft, Provenienz und Sammlung zufällig aus diesen Listen gewählt werden.


Die vier Felder werden jetzt wie das Jahr automatisch aus erweiterbaren Listen in `data.js` gezogen.

### Was sich geändert hat

**`data.js` — `KONTROLLIERTE_WERTE`**
Dort liegen die Listen, aus denen zufällig gewählt wird:
- `objekttypen` (inkl. „Fotografie“)
- `herkunft`
- `provenienz` (neu, 8 Einträge)
- `sammlung` (neu, 10 Einträge)

Die festen Angaben in den Varianten wurden entfernt — du pflegst die Listen nur noch zentral.

**`generator.js`**
Neue Funktion `pickFromListe()` wählt bei jeder neuen Akte zufällig aus den Listen. Gespeicherte Akten im Erinnerungsraum behalten ihre Werte.

### Listen später erweitern

In `data.js` einfach neue Einträge ergänzen, z. B.:

```javascript
provenienz: [
  'Überlieferung durch private Nachlässe; ...',
  'Dein neuer Provenienztext hier.',
],
sammlung: [
  'Bestand Stadtgeschichte',
  'Deine neue Sammlung hier.',
],
```

Gleiches gilt für `objekttypen` und `herkunft`.

### Verhalten

- **Neue Akten** im Angebot: Jahr, Objekttyp, Herkunft, Provenienz und Sammlung werden jeweils neu zufällig vergeben.
- **Bereits gespeicherte Akten**: behalten ihre Werte (localStorage).
- **Neues Angebot holen**: neue Zufallswerte für die angebotenen Akten.

Wenn du willst, können wir als Nächstes auch `institutionelleRelevanz`, `dokumentationsgrad` und `erhaltungszustand` auf die gleiche Weise automatisieren.

---

**User**

Es sollte schon ein sinn haben. Wenn der Objekttyp Fotografie ist, dann sollte Sammlung bezüglich des Themas sinn machen, 

---

**Cursor**

Ich prüfe, wie die Felder aktuell unabhängig voneinander generiert werden und wo thematische Zusammenhänge sinnvoll eingebaut werden können.


Kategorie ist pro Variante fest — das 

**Kohärente Metadaten-Generierung**

> **Welche Felder sollen thematisch zusammenpassen?**
> - Nur Sammlung passend zu Objekttyp + Kategorie (wie in deinem Beispiel)
> - Vollständige Kette: Objekttyp → Sammlung (nach Kategorie) und Herkunft → Provenienz (empfohlen) ✔
> - Alle vier Felder plus Bild-Einfluss (mit Bild eher Fotografie, ohne Bild eher Notizzettel/Fragmente)

eignet sich als thematischer Anker. Ich kläre noch eine wichtige Designentscheidung.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich lege zuerst die Profile in `data.js` an und passe danach den Generator an.


Die kohärente Metadaten-Generierung ist umgesetzt.

### Was geändert wurde

**[`data.js`](data.js)** — neuer Block `aktenProfile` mit drei Profilen:
- `bildliche-ueberlieferung` (Fotografie, Fotokopie, digitaler Scan)
- `schriftliche-fragmente` (Notizzettel, Plakatrest, …)
- `raum-und-fundstuecke` (Raumfragment, Fundstück, …)

Jedes Profil enthält `sammlungNachKategorie` und `provenienzNachHerkunft`. Die globalen Listen bleiben als Fallback erhalten.

**[`generator.js`](generator.js)** — neue Funktionen:
- `pickFromMap()` — wählt aus Zuordnungstabellen mit `'*'`-Fallback
- `generateAktenMetadaten()` — erzeugt zusammenpassende Metadaten:
  1. Zufälliges Profil
  2. Objekttyp aus dem Profil
  3. Sammlung passend zur **Kategorie** der Variante
  4. Herkunft aus dem Profil
  5. Provenienz passend zur **Herkunft**

### Beispiel

Variante mit `kategorie: 'Arbeit'` und Profil `bildliche-ueberlieferung`:
- Objekttyp: `Fotografie`
- Sammlung: `Sammlung Arbeit und Migration` oder `Bestand Stadtgeschichte`
- Herkunft: `private Überlieferung`
- Provenienz: ein passender Text aus der Gruppe „private Überlieferung“

### Listen erweitern

In `data.js` unter `KONTROLLIERTE_WERTE.aktenProfile`:
- neue Einträge in `sammlungNachKategorie` oder `provenienzNachHerkunft`
- oder ein ganz neues Profil anlegen
- `'*'` als Fallback für unbekannte Kategorien (z. B. `Migration / Arbeit`)

---

**User**

Die Bewertungskriterien sollen auch angepasst werden. 

Die Punkte sollen verschwinden.

Stattdessen sollen zufällig passende Texte angezeigt werden.

Zum Beispiel:

archivwürdig
von regionaler Bedeutung
teilweise dokumentiert
gut erhalten

Auch diese Listen möchte ich später selbst erweitern können.


---

**Cursor**

Ich schaue mir an, wie die Bewertungskriterien aktuell angezeigt und gespeichert werden.


Ich ersetze die Punkt-Skalen durch zufällige Bewertungstexte aus erweiterbaren Listen.


Die Bewertungskriterien zeigen jetzt zufällige Texte statt Punkt-Skalen.

### Was sich geändert hat

**Punkte entfernt** — die Dot-Balken für „Institutionelle Relevanz“ und „Dokumentationsgrad“ sind weg.

**Neue Textlisten** in [`data.js`](data.js) unter `bewertungskriterienListen`:
- `archivischeBewertung` — z. B. *archivwürdig*, *bedingt archivwürdig*
- `bedeutung` — z. B. *von regionaler Bedeutung*, *von lokaler Bedeutung*
- `dokumentation` — z. B. *teilweise dokumentiert*, *gut dokumentiert*
- `erhaltung` — z. B. *gut erhalten*, *fragil erhalten*

Pro Akte wird **je Kategorie ein zufälliger Text** gewählt — typischerweise vier Zeilen wie in deinem Beispiel.

**Generator** — `generateBewertungskriterien()` erzeugt die Liste bei neuen Akten; gespeicherte Akten behalten ihre Kriterien.

**Anzeige** — in den Archivkarten und auf der Projektion als einfache Textliste statt Punkte.

### Listen erweitern

In `data.js` unter `KONTROLLIERTE_WERTE.bewertungskriterienListen`:

```javascript
archivischeBewertung: [
  'archivwürdig',
  'dein neuer Text hier',
],
```

Neue Kategorien sind möglich — sie erscheinen dann als zusätzliche Zeile pro Akte.

**Hinweis:** Alte Akten im localStorage ohne `bewertungskriterien` bekommen beim nächsten Laden neue Texte. Für komplett frische Werte: Installation zurücksetzen oder neues Angebot holen.

---

**User**

Die Bewertungskriterien sollen in folgende Kategorie unterteilt werden

Instiutionelle Relevanz: 

Dokumenattaionsgrad: 

Erhaltungszustand: 

Und für die sollen jewaeils die Texte gerneriert werden.

z.B.: Institutionellle Relevanz: von regionaler Bedeutung 

---

**Cursor**

Ich passe die Bewertungskriterien an die drei Kategorien mit Beschriftung an.


Die Bewertungskriterien sind jetzt in drei Kategorien mit Beschriftung gegliedert.

### Anzeige

Jede Akte zeigt drei Zeilen in diesem Format:

- **Institutionelle Relevanz:** von regionaler Bedeutung
- **Dokumentationsgrad:** teilweise dokumentiert
- **Erhaltungszustand:** gut erhalten

### Listen in `data.js`

Unter `KONTROLLIERTE_WERTE.bewertungskriterienListen` — der Schlüssel ist der Kategoriename:

```javascript
'Institutionelle Relevanz': ['archivwürdig', 'von regionaler Bedeutung', ...],
'Dokumentationsgrad': ['teilweise dokumentiert', 'gut dokumentiert', ...],
'Erhaltungszustand': ['gut erhalten', 'fragil erhalten', ...],
```

Neue Texte fügst du einfach in die passende Liste ein.

### Verhalten

- Pro Kategorie wird **ein zufälliger Text** gewählt.
- Gespeicherte Akten behalten ihre Kriterien.
- **Neues Angebot** oder **Reset** erzeugt neue Kombinationen.

Zum Testen der neuen Darstellung am besten die Installation zurücksetzen oder ein neues Angebot laden — alte Einträge im localStorage können noch das frühere Format ohne Kategorienamen haben.

