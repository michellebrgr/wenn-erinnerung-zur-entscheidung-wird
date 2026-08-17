# Archivsignatur automation
_Exported on 17.8.2026 at 14:50:03 MESZ from Cursor (3.16.17)_

---

**User**

Kannst du die Archivsignatur automatisch erstellen lassen?

Sie soll aus dem Jahr und einer zufälligen Nummer bestehen.

Beispiele:

AK-1974-018
AK-CA1974-018 bei ungefährer Datierung
AK-197X-018 bei „1970er Jahre“
AK-UND-018 bei „nicht datiert“

Bitte ändere sonst noch nichts am Projekt.

---

**Cursor**

Ich schaue mir zuerst an, wie Archivsignaturen im Projekt aktuell gespeichert und erzeugt werden.


Ich implementiere die automatische Erzeugung in `generator.js` und entferne die manuellen Signaturen aus `data.js`.


Ich teste kurz die Signatur-Logik.


Die Archivsignatur wird jetzt automatisch erzeugt — in `generator.js` beim Normalisieren einer Akte, sofern noch keine Signatur vorhanden ist.

**Format:** `{ARCHIV_PREFIX}-{Jahresanteil}-{3-stellige Zufallszahl}`

| `jahr` in data.js | Ergebnis (Beispiel) |
|---|---|
| `1974` | `WEZ-1974-018` |
| `"ca. 1974"` | `WEZ-CA1974-018` |
| `"1970er Jahre"` | `WEZ-197X-018` |
| `null` / `"nicht datiert"` | `WEZ-UND-018` |

Das Präfix kommt weiterhin aus `ARCHIV_PREFIX` in `data.js` (aktuell `WEZ`). In deinen Beispielen steht `AK` — das Format ist gleich, nur das Präfix unterscheidet sich.

Die manuellen `archivsignatur`-Einträge in den Beispielakten habe ich entfernt; die Signatur entsteht beim ersten Laden aus dem jeweiligen `jahr`-Wert. Einmal erzeugte Signaturen bleiben im `localStorage` erhalten und ändern sich nicht bei jedem Reload.

**Hinweis:** Falls noch alte Daten im Browser liegen, einmal im Entwicklertools-Konsolen ausführen:

```javascript
localStorage.removeItem('wez-installation-state');
location.reload();
```

Dann werden die neuen Signaturen sichtbar.

