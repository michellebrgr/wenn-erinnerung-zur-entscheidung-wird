# Missing logic for document display
_Exported on 17.8.2026 at 14:31:22 MESZ from Cursor (3.16.17)_

---

**User**

aus irgendeinem grund ist die logik  verschwunden das 0,1,2 akten ohne bild angeziegt werden

---

**Cursor**

Ich schaue mir an, wo die Anzeige von Akten ohne Bild (0, 1, 2) gesteuert wird und warum diese Logik fehlt.

Die Anzeige-Logik sitzt vermutlich im Generator. Ich prüfe dort, wie Akten mit und ohne Bild zusammengestellt werden.

Die aktuelle Auswahl füllt zuerst alle Slots mit Bildakten. Ich schaue in der Git-Historie nach der ursprünglichen 0/1/2-Logik.

Die 0–2-Logik wurde kürzlich aus `generator.js` entfernt. Ich hole die vorherige Version und setze sie wieder ein.

Die Auswahl nimmt aktuell immer zuerst Bildakten. Ich stelle die Zufallslogik wieder her: pro Angebot 0, 1 oder 2 Akten ohne Bild.

Die Logik ist wieder da. Beim letzten Update von `generator.js` war sie verloren gegangen: Das Angebot hat dann **immer zuerst Bildakten** genommen, bildlose nur noch zum Auffüllen.

Pro Set aus drei Akten gilt wieder:

- zufällig **0, 1 oder 2** Akten **ohne Bild**
- der Rest mit Bild
- die Reihenfolge wird gemischt

Falls noch ein altes Angebots-Set im Browser liegt: Installation einmal zurücksetzen (Shift+R) oder neu laden, dann erscheint das nächste Set mit der korrigierten Mischung.

