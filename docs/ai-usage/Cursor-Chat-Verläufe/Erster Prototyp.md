# Participatory media installation
_Exported on 17.8.2026 at 14:52:24 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte ein lokales browserbasiertes Programm für eine partizipative Medieninstallation bauen.

Projektidee:
Die Installation heißt „Wenn Erinnerung zur Entscheidung wird“. Besucher*innen interagieren mit einem digitalen Archivsystem. Es erscheinen jeweils drei automatisch generierte Erinnerungsfragmente in Form von Archivakten. Jede Akte hat Bewertungskriterien. Besucher*innen wählen eine Akte aus, die dann in einen sichtbaren Erinnerungsraum aufgenommen wird. Dieser Erinnerungsraum wird über eine Projektion dargestellt und hat maximal sechs Speicherplätze. Wenn der Speicher voll ist, muss eine bestehende Akte verdrängt werden.

Bitte baue das Programm mit reinem HTML, CSS und JavaScript, ohne Framework, ohne Backend und ohne Datenbank. Die Anwendung soll lokal im Browser laufen.

Es soll zwei Ansichten geben:

1. index.html = Archivinterface für den Laptop
2. projection.html = Projektionsansicht für den Beamer

Beide Ansichten sollen denselben Speicherstand über localStorage nutzen.

Bitte lege zuerst diese  Projektstruktur an:

- index.html: Archivinterface, zeigt 3 Akten an, ermöglich Auswahl und Verdrängungsdialog
- projection.html: Projektionsansicht, zeigt öffentlichen Erinnerungsraum mit max. 6 Plätzen
- style.css: gemeinsame Gestaltung für archivansicht und Projektionsansicht
- data.js: statsische Inahlte, wie Textfargemente, Kategorien, Bewertungskriterien
- generator.js: erzeigt einzelne Akten udn Sets aus den statischen Inahlten
- state.js: verwaltet locale storage und ermöglicht cross-tab-syncronisation
- app.js: steuert User Interface für index.html
- projection.js: steuert User Interface für projection.html
- README: dokumentiert Setup, Nutzung, Datenstruktur, ausführung. 
- docs/ai-usage/README.md: dokumentiert die Chats für ein KI-Verzeichnis

Wichtig:

- Bitte verwende verständlich kommentierten Code.
- Bitte trenne Daten, Generierung, Speicherlogik und Interface-Logik sauber voneinander.
- Bitte vermeide externe Libraries.


---

**Cursor**

Ich schaue mir zuerst den aktuellen Projektstand an und leite daraus einen konkreten Umsetzungsplan ab.


Grünes Projekt — ich erstelle einen detaillierten Umsetzungsplan mit Architektur, Datenmodell und Dateistruktur.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan um und beginne mit der Projektstruktur.


Ich initialisiere den State beim ersten Start persistent und schreibe die Dokumentation.


Die Installation ist vollständig umgesetzt. Alle geplanten Dateien liegen im Projekt.

## Projektstruktur

| Datei | Funktion |
|-------|----------|
| `index.html` | Archivinterface — 3 wählbare Akten, Vorschau, Verdrängungsdialog |
| `projection.html` | Beamer-Ansicht — Erinnerungsraum mit 6 Plätzen |
| `style.css` | Archivästhetik (Papier/Sepia) + dunkle Projektionsansicht |
| `data.js` | 40 Fragmente, 8 Kategorien, 4 Bewertungskriterien |
| `generator.js` | Akten- und Set-Generierung |
| `state.js` | `localStorage`, Cross-Tab-Sync, Verdrängungslogik |
| `app.js` | UI-Logik für das Archiv |
| `projection.js` | UI-Logik für die Projektion |
| `README.md` | Setup, Nutzung, Datenstruktur |
| `docs/ai-usage/README.md` | KI-Verzeichnis für die Thesis |

## Nutzung

1. `index.html` auf dem Laptop öffnen
2. `projection.html` im zweiten Tab/Fenster (Beamer, F11 für Vollbild)
3. Beide Tabs im **selben Browser** — State wird über `localStorage` geteilt

Optional mit lokalem Server:

```bash
python3 -m http.server 8080
```

## Ablauf

- Drei zufällige Archivakten mit Aktenzeichen, Kategorie, Fragment und Bewertungskriterien (1–5)
- Klick auf eine Akte → Aufnahme in den Erinnerungsraum → neues 3er-Set
- Bei 6 belegten Plätzen → Verdrängungsdialog: bestehende Akte wählen, die ersetzt wird
- Projektion aktualisiert sich live über das `storage`-Event

## Reset

In der Browser-Konsole:

```javascript
localStorage.removeItem('wez-installation-state');
location.reload();
```

