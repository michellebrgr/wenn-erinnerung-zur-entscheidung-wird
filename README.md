# wenn-erinnerung-zur-entscheidung-wird

Repository für die Masterarbeit des Studiengangs International Media Cultural Work durch Michelle Berger.

## Projektbeschreibung

**„Wenn Erinnerung zur Entscheidung wird“** ist eine partizipative Medieninstallation. Besucher*innen interagieren mit einem digitalen Archivsystem auf einem Laptop. Es erscheinen jeweils drei automatisch generierte Erinnerungsfragmente in Form von Archivakten. Jede Akte enthält Bewertungskriterien. Besucher*innen wählen eine Akte aus, die in einen öffentlichen Erinnerungsraum aufgenommen wird. Dieser Erinnerungsraum wird über eine Beamer-Projektion dargestellt und hat maximal sechs Speicherplätze. Ist der Speicher voll, muss eine bestehende Akte verdrängt werden.

Die Anwendung läuft vollständig lokal im Browser — ohne Framework, ohne Backend und ohne Datenbank.

## Dateistruktur

| Datei | Beschreibung |
|-------|--------------|
| `index.html` | Archivinterface für den Laptop — zeigt 3 Akten, Auswahl und Verdrängungsdialog |
| `projection.html` | Projektionsansicht für den Beamer — zeigt den Erinnerungsraum (max. 6 Plätze) |
| `style.css` | Gemeinsame Gestaltung für Archiv- und Projektionsansicht |
| `data.js` | Statische Inhalte: Textfragmente, Kategorien, Bewertungskriterien |
| `generator.js` | Erzeugt einzelne Akten und Sets aus den statischen Inhalten |
| `state.js` | Verwaltet `localStorage` und Cross-Tab-Synchronisation |
| `app.js` | Steuert die Benutzeroberfläche von `index.html` |
| `projection.js` | Steuert die Benutzeroberfläche von `projection.html` |
| `docs/ai-usage/README.md` | Dokumentation der KI-Nutzung für das Thesis-KI-Verzeichnis |

## Setup und Ausführung

### Variante A: Direkt im Browser öffnen

1. `index.html` im Browser öffnen (Archivinterface auf dem Laptop)
2. `projection.html` in einem zweiten Tab oder Fenster öffnen (Beamer-Projektion)

### Variante B: Lokaler Static Server (empfohlen)

```bash
# Im Projektordner:
python3 -m http.server 8080
```

Dann im Browser aufrufen:

- Archiv: `http://localhost:8080/index.html`
- Projektion: `http://localhost:8080/projection.html`

Alternativ: VS Code Extension „Live Server“.

## Nutzung während der Installation

1. Laptop mit `index.html` für die Interaktion der Besucher*innen
2. Beamer mit `projection.html` im Vollbildmodus (F11)
3. Beide Ansichten müssen im **selben Browser und Profil** laufen, damit `localStorage` geteilt wird
4. Besucher*in wählt eine der drei Akten → sie erscheint im Erinnerungsraum auf dem Beamer
5. Nach jeder erfolgreichen Auswahl erscheint ein neues Set aus drei Akten
6. Bei vollem Erinnerungsraum (6 Akten): Verdrängungsdialog — eine bestehende Akte muss ersetzt werden

## Datenstruktur

### Archivakte (`ArchiveFile`)

```javascript
{
  id: "akte-abc123",
  reference: "WEZ-2026-047",
  category: "Familie",
  fragment: "Erinnerungstext …",
  criteria: [
    { key: "authenticity", label: "Authentizität", value: 4 }
  ],
  createdAt: 1719999999999
}
```

### Gesamter App-State (`localStorage`, Key: `wez-installation-state`)

```javascript
{
  version: 1,
  memoryRoom: [],      // max. 6 ArchiveFile-Objekte
  currentOffer: [],    // genau 3 ArchiveFile-Objekte
  updatedAt: 1719999999999
}
```

## State zurücksetzen

In den Browser-Entwicklertools (Konsole):

```javascript
localStorage.removeItem('wez-installation-state');
location.reload();
```

Oder in der Konsole: `resetState()` (falls `state.js` geladen ist).

## Anpassung der Inhalte

- **Neue Erinnerungsfragmente:** Einträge in `FRAGMENT_POOL` in `data.js` ergänzen
- **Neue Kategorien:** Einträge in `CATEGORIES` in `data.js` ergänzen
- **Neue Bewertungskriterien:** Einträge in `CRITERIA_DEFINITIONS` in `data.js` ergänzen

## Technische Hinweise

- Keine externen Libraries
- Cross-Tab-Sync über `localStorage` und das `storage`-Event
- `localStorage` ist pro Browser/Profil — nicht zwischen verschiedenen Browsern geteilt
