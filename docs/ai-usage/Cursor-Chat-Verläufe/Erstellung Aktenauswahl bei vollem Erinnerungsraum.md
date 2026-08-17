# Erinnerungsraum Anpassung
_Exported on 17.8.2026 at 14:48:22 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte den Ablauf beim vollen Erinnerungsraum anpassen.

Wenn weniger als 6 Akten gespeichert sind, soll eine ausgewählte Akte direkt in den Erinnerungsraum aufgenommen werden.

Wenn bereits 6 Akten gespeichert sind und ich eine neue Akte auswähle, soll mir auf der normalen Archivseite zuerst der gemeinsame Erinnerungsraum mit allen 6 gespeicherten Akten angezeigt werden.

Dort soll ich eine der bestehenden Akten auswählen können, die entfernt wird. Danach wird die neu ausgewählte Akte an dieser Stelle aufgenommen.

projection.html soll immer denselben Erinnerungsraum anzeigen und die Änderung direkt übernehmen.

Es soll weiterhin nur einen gemeinsamen Erinnerungsraum geben. 

---

**Cursor**

Ich schaue mir zuerst an, wie Erinnerungsraum und Akten-Auswahl aktuell im Code umgesetzt sind.


Als Nächstes prüfe ich die Styles und die Projektionsseite, damit die Archivansicht den Erinnerungsraum inline statt im Modal zeigen kann.


Ich ersetze den Modal-Dialog durch eine inline Erinnerungsraum-Ansicht auf der Archivseite und passe HTML, JavaScript und Styles entsprechend an.


Ich korrigiere die Reihenfolge beim Verdrängen: Die Ansicht muss vor dem Speichern zurückwechseln, damit der State-Update nicht wieder den Verdrängungsmodus öffnet.


Der Ablauf ist angepasst. Kurz die Änderungen:

### Neuer Ablauf

**Weniger als 6 Akten gespeichert**
- Auswahl einer Akte wird wie bisher direkt in den gemeinsamen Erinnerungsraum aufgenommen.

**Bereits 6 Akten gespeichert**
- Nach Auswahl einer neuen Akte wechselt die Archivseite zur **Erinnerungsraum-Ansicht** (kein Modal mehr).
- Dort siehst du alle 6 gespeicherten Akten im gleichen 3×2-Raster wie in `projection.html`.
- Oben wird die neu ausgewählte Akte angezeigt.
- Klick auf eine bestehende Akte → sie wird ersetzt, die neue Akte nimmt ihren Platz ein.
- Mit „Abbrechen“ oder Escape kehrst du zum Angebots-Set zurück.

### Technisch

- `index.html`: Modal entfernt, neue Sektion `#displacement-section` mit Erinnerungsraum-Grid auf der Archivseite
- `app.js`: Verdrängungslogik inline statt im Dialog; gemeinsamer State über `localStorage` bleibt unverändert
- `projection.html` / `projection.js`: unverändert — zeigt weiterhin denselben Erinnerungsraum und aktualisiert sich live bei jeder Änderung

Es gibt weiterhin nur einen gemeinsamen Erinnerungsraum, den Archiv und Projektion teilen.

Zum Testen: `index.html` und `projection.html` parallel öffnen, den Erinnerungsraum mit 6 Akten füllen und dann eine siebte Akte auswählen.

---

**User**

kannst du mir noch einen button einfügen unten rechts indedx.htl. mit der ich die installation zurücksetzen kann?

---

**Cursor**

Ich füge einen Reset-Button unten rechts in `index.html` ein und verknüpfe ihn mit der bestehenden `resetState()`-Funktion.


Der Reset-Button ist eingebaut.

**Unten rechts** auf `index.html` gibt es jetzt den Button „Installation zurücksetzen“. Er ist fest positioniert und bleibt beim Scrollen sichtbar.

Beim Klick erscheint eine **Sicherheitsabfrage**. Nach Bestätigung wird über `resetState()` der gemeinsame Erinnerungsraum geleert und ein neues Angebots-Set erzeugt. Die Änderung wird auch in `projection.html` direkt übernommen.

Wenn du gerade in der Verdrängungsansicht bist, wird diese vor dem Reset automatisch geschlossen.

