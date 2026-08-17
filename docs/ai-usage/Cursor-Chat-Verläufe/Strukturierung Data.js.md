# Data.js structure update
_Exported on 17.8.2026 at 14:51:59 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte mein bestehendes Projekt Schritt für Schritt weiterentwickeln. Bitte arbeite auf meiner aktuellen Codebasis weiter und erstelle kein neues Projekt.

Als Erstes möchte ich die data.js überarbeiten, damit sie besser zu meinem Archivkonzept passt.

Im Moment möchte ich noch keine Inhalte eintragen, sondern zunächst nur eine saubere Struktur vorbereiten.

Jede Archivakte soll später folgende Informationen enthalten:

id
Archivsignatur
Kategorie
Titel
Jahr
Bild
Kurzbeschreibung
Objekttyp
Herkunft
Provenienz
Sammlung
Institutionelle Relevanz
Dokumentationsgrad
Erhaltungszustand

Außerdem möchte ich die Daten so aufbauen, dass ich später problemlos weitere Akten ergänzen kann, ohne etwas an der Logik ändern zu müssen.

Lege deshalb bitte eine übersichtliche Struktur in der data.js an und füge nur 2–3 Beispielakten mit Platzhalterinhalten ein, damit ich sehe, wie die Struktur aufgebaut ist.

Bitte ändere in diesem Schritt nur die data.js.

Die Darstellung, der Generator und alle anderen Dateien sollen im Moment noch unverändert bleiben.

Kommentiere den Code gerne kurz, damit ich später leicht verstehe, welche Bereiche ich selbst mit meinen Inhalten ergänzen kann.

---

**Cursor**

Ich schaue mir zuerst die aktuelle `data.js` und kurz den Generator an, damit die neue Struktur gut vorbereitet ist.


Ich erstelle eine klare Archivstruktur in `data.js` mit kontrollierten Vokabularen als Orientierung und 3 Beispielakten.


Die `data.js` ist auf dein Archivkonzept umgestellt. Kurz die Struktur:

## Aufbau der neuen `data.js`

**1. `ARCHIV_PREFIX`** — Präfix für Archivsignaturen (z. B. `WEZ-1989-014`)

**2. `KONTROLLIERTE_WERTE`** — optionale Orientierungslisten für:
- Kategorien, Objekttypen, Herkunft
- Dokumentationsgrad, Erhaltungszustand, institutionelle Relevanz

Diese Listen sind nur Hilfen beim Befüllen; in einzelnen Akten sind auch abweichende Werte möglich.

**3. `ARCHIV_AKTEN`** — Hauptdatenbestand mit allen 14 Feldern pro Akte:

| Feld | Beschreibung |
|---|---|
| `id` | Eindeutige interne Kennung |
| `archivsignatur` | Sichtbare Signatur |
| `kategorie`, `titel`, `jahr` | Kerndaten |
| `bild` | Bildpfad oder `null` |
| `kurzbeschreibung` | Kurztext für Vorschau |
| `objekttyp`, `herkunft`, `provenienz`, `sammlung` | Archivische Metadaten |
| `institutionelleRelevanz`, `dokumentationsgrad`, `erhaltungszustand` | Bewertungsfelder |

**3 Beispielakten** mit `[Platzhalter]`-Texten:
- Akte 001: mit Bild (`assests/fotosammlung_01.jpg`)
- Akte 002: ohne Bild (`bild: null`)
- Akte 003: digitaler Bestand

## So ergänzt du später Inhalte

Neue Akte einfach ans `ARCHIV_AKTEN`-Array anhängen — gleiches Schema, keine Logikänderung nötig:

```javascript
{
  id: 'akte-004',
  archivsignatur: 'WEZ-2024-001',
  kategorie: 'Alltagskultur',
  // … alle weiteren Felder
},
```

**Hinweis:** Generator und Darstellung nutzen diese Struktur noch nicht — sie erwarten noch die alten Konstanten (`CATEGORIES`, `SHORTTEXT_POOL` usw.). Die App wird erst wieder laufen, wenn wir im nächsten Schritt Generator und Anzeige anpassen. Das war so gewollt.

Sag Bescheid, wenn du als Nächstes den Generator oder die Darstellung an die neue Struktur anbinden möchtest.

---

**User**

Ich möchte den bestehenden Generator an die neue Struktur aus der data.js anpassen.

Bitte arbeite wieder auf meiner aktuellen Codebasis weiter und erstelle kein neues Projekt.

Der Generator soll weiterhin zufällig Archivakten auswählen. Er soll jetzt aber mit den neuen Feldern aus der data.js arbeiten.

Bitte ändere in diesem Schritt nur die Datei, in der die Akten aktuell erzeugt oder ausgewählt werden. Vermutlich ist das generator.js.

Wichtig:

Die bestehende Auswahl von drei Akten soll erhalten bleiben.
Die Akten sollen weiterhin aus den Einträgen der data.js kommen.
Noch keine Änderungen am Design oder an der Darstellung vornehmen.
Noch keine automatische Archivsignatur ergänzen.
Noch keine Logik gegen doppelte Bilder einbauen.
Andere Dateien bitte nur ändern, wenn es technisch unbedingt nötig ist. Falls das nötig ist, erkläre vorher kurz warum.

Bitte achte darauf, dass die bisherige Funktionsweise des Projekts erhalten bleibt und kommentiere neue oder geänderte Stellen kurz, damit ich sie nachvollziehen kann.

---

**Cursor**

Ich prüfe zuerst Generator und die Stellen, an denen die Akten verwendet werden, damit die Anpassung an `data.js` die bestehende Auswahl von drei Akten nicht bricht.


Die Darstellung nutzt noch alte Feldnamen (`inventoryNumber`, `title` usw.) — ich baue im Generator eine Kompatibilitätsschicht ein, damit nur `generator.js` geändert werden muss.


Der Generator ist angepasst. Kurz die Änderungen:

## Was sich geändert hat

**Vorher:** Zufällig zusammengesetzte Akten aus Pools (`CATEGORIES`, `TITLE_TEMPLATES`, …)

**Jetzt:** Zufällige Auswahl aus `ARCHIV_AKTEN` in der `data.js` — ohne neue IDs oder Archivsignaturen.

### Neue Funktionen

- **`normalizeAkte()`** — übernimmt alle neuen Felder (`archivsignatur`, `kategorie`, `titel`, …) und mappt sie vorübergehend auf die alten Anzeigenamen, die `app.js` und `projection.js` noch erwarten (`inventoryNumber`, `title`, `shortText`, …).
- **`pickArchiveAkten()`** — wählt ohne Duplikate aus `ARCHIV_AKTEN`.
- **`generateOfferSet()`** — bleibt die öffentliche API für `state.js`; liefert weiterhin 3 Akten.

### Entfernt

Die alte Generierungslogik (Templates, Zufallstexte, Kriterien, Inventarnummern) — nicht mehr nötig, solange die Akten aus `data.js` kommen.

## Kompatibilitätsschicht (nur im Generator)

Damit Darstellung und State unverändert bleiben können:

| Neues Feld (`data.js`) | Alias für Darstellung |
|---|---|
| `archivsignatur` | `inventoryNumber` |
| `kategorie` | `category` |
| `titel` | `title` |
| `jahr` | `year` |
| `kurzbeschreibung` | `shortText` |
| `objekttyp` | `objectType` |
| `herkunft` | `origin` |
| `erhaltungszustand` | `condition` |
| `dokumentationsgrad` | `visibility` |
| — | `material` → `'—'` (kein Pendant in der neuen Struktur) |

## Wichtiger Hinweis zu `data.js`

Auf der Festplatte liegt noch die **alte** `data.js` (mit `CATEGORIES`, `SHORTTEXT_POOL` usw.) — **`ARCHIV_AKTEN` fehlt dort**. Der Generator sucht aber genau diese Konstante.

Bitte die neue Struktur aus Schritt 1 wiederherstellen oder speichern, damit die App läuft. Sobald `ARCHIV_AKTEN` mit deinen Beispielakten vorhanden ist, wählt der Generator daraus 3 zufällige Akten aus.

Soll ich als Nächstes die Darstellung (`app.js`) an die neuen Feldnamen anpassen, oder zuerst die `data.js` wieder auf den neuen Stand bringen?

---

**User**

ich hab jetzt mal gespeichert, ist data.js jetzt auf dem aktuellen stand?

---

**Cursor**

Nein — die `data.js` ist noch **nicht** auf dem neuen Stand.

Auf der Festplatte liegt weiterhin die **alte Version** mit:

- `CATEGORIES`, `OBJECT_TYPES`, `MATERIALS`, `SHORTTEXT_POOL`, …
- `CRITERIA_DEFINITIONS`
- **kein** `ARCHIV_AKTEN`

Der angepasste Generator erwartet dagegen `ARCHIV_AKTEN` mit den neuen Feldern (`archivsignatur`, `kategorie`, `titel`, `jahr`, `bild`, …).

Vermutlich hast du die alte Datei gespeichert, ohne die neue Struktur aus Schritt 1 eingetragen zu haben — oder die Änderungen aus unserem ersten Schritt waren nie in dieser Datei.

**Kurz:** Generator = neu, `data.js` = noch alt → die App kann aktuell keine Akten laden.

Soll ich die `data.js` jetzt auf den neuen Stand bringen (mit `ARCHIV_AKTEN` und 3 Beispielakten wie zuvor besprochen)?

---

**User**

ja bitte

---

**Cursor**

Die `data.js` ist jetzt auf dem neuen Stand.

**Enthalten:**
- `ARCHIV_PREFIX` — Präfix für Archivsignaturen
- `KONTROLLIERTE_WERTE` — Orientierungslisten (Kategorien, Objekttypen, …)
- `ARCHIV_AKTEN` — 3 Beispielakten mit Platzhalterinhalten

Damit passt die Datei zum angepassten Generator: Beim Laden der Seite werden 3 zufällige Akten aus `ARCHIV_AKTEN` ausgewählt.

**Tipp:** Falls du noch alte, zufällig generierte Akten im Browser siehst, einmal den lokalen Speicher leeren (DevTools → Application → Local Storage → Eintrag löschen) oder die Seite im privaten Fenster öffnen.

Zum Testen `index.html` im Browser öffnen — du solltest die drei Platzhalterakten sehen.

