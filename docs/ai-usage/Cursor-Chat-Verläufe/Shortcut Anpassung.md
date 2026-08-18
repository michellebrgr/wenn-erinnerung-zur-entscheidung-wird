# Shift+L shortcut issue
_Exported on 18.8.2026 at 16:15:30 MESZ from Cursor (3.16.17)_

---

**User**

mir ist eben aufgefallen, dass der shortcut Shift+L nicht mehr geht 

---

**Cursor**

Ich schaue mir an, wo `Shift+L` definiert ist und warum der Shortcut nicht mehr greift.

Der Shortcut sitzt in `projection.js`. Als Nächstes prüfe ich den Event-Handler und, ob ihn etwas anderes abfängt.

Der Shortcut hängt nur an der Projektionsseite — ich prüfe als Nächstes, ob der Fokus auf dem Archivfenster liegt und ob der Hell-/Dunkelmodus über den gemeinsamen State mitlaufen muss.

Der Shortcut hängt nur am Beamer-Fenster. Während der Installation liegt die Tastatur aber am Archiv — deshalb greift `Shift+L` nicht, im Gegensatz zu `Shift+R`. Ich hänge ihn an beide Fenster und gleiche den Hell-/Dunkelmodus über `localStorage` ab.

`Shift+L` hat nur im Beamer-Fenster (`projection.html`) reagiert. Die Tastatur liegt während der Installation aber am Archiv — genau wie bei `Shift+R`. Deshalb wirkte der Wechsel zwischen Hell und Dunkel, als wäre er kaputt.

Der Shortcut funktioniert jetzt in **beiden Fenstern**. Der Hellmodus wird über beide Tabs synchronisiert und bleibt auch nach einem Reload erhalten.

Zum Prüfen: Im Archivfenster `Shift+L` drücken — die Projektion sollte sofort umschalten.

