# KI-Verzeichnis — Dokumentation der KI-Nutzung

Dieser Ordner dokumentiert die Verwendung von KI-Tools im Rahmen der Masterarbeit **„Wenn Erinnerung zur Entscheidung wird“** (International Media Cultural Work, Michelle Berger).

## Zweck

Im Rahmen der Thesis ist ein KI-Verzeichnis gefordert, das nachvollziehbar macht, wo und wie KI eingesetzt wurde. Dieser Ordner sammelt Chat-Verläufe, Prompts und Ergebnisse.

## Einträge

### 2026-07-03 — Planung und Implementierung der Browser-Installation

| Feld | Inhalt |
|------|--------|
| **Tool** | Cursor (Claude Agent) |
| **Aufgabe** | Konzeption und vollständige Implementierung der lokalen Browser-Installation |
| **Prompt (Kurzfassung)** | Aufbau eines rein clientseitigen Zwei-Fenster-Programms (Archiv-Laptop + Beamer-Projektion) mit localStorage-Sync, modularer Dateistruktur (data.js, generator.js, state.js, app.js, projection.js), Verdrängungslogik bei 6 Speicherplätzen |
| **Ergebnis** | Vollständige Projektstruktur mit index.html, projection.html, style.css, JS-Modulen und README-Dokumentation |
| **Dateien** | Alle Dateien im Projektroot und `docs/ai-usage/` |

---

## Vorlage für künftige Einträge

```markdown
### JJJJ-MM-TT — Kurztitel der Aufgabe

| Feld | Inhalt |
|------|--------|
| **Tool** | z. B. Cursor, ChatGPT, Claude |
| **Aufgabe** | Was sollte erreicht werden? |
| **Prompt (Kurzfassung)** | Wesentliche Anweisungen |
| **Ergebnis** | Was wurde umgesetzt oder entschieden? |
| **Dateien** | Betroffene Dateien/Pfade |
| **Anpassungen** | Was wurde manuell geändert oder verworfen? |
```

## Hinweise

- Prompts und Antworten sollten so dokumentiert werden, dass die Rolle der KI in der Arbeit nachvollziehbar bleibt
- Manuelle Überarbeitungen nach KI-generiertem Code sollten vermerkt werden
- Bei substantieller KI-Nutzung an Texten oder Konzepten ebenfalls einen Eintrag anlegen
