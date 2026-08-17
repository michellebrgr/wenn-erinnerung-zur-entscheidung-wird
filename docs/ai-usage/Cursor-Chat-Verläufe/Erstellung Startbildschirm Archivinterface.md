# Archive start screen
_Exported on 17.8.2026 at 14:46:39 MESZ from Cursor (3.16.17)_

---

**User**

Ich möchte meiner Installation einen Startbildschirm hinzufügen. Wenn die Seite geöffnet wird, sollen noch keine Archivakten zu sehen sein.

Stattdessen soll zuerst ein einfacher Startbildschirm erscheinen.

Dieser soll enthalten:

Überschrift "Archiv"

Kurzer Text:

"Willkommen im Archiv.

Im Folgenden erhalten Sie Zugriff auf einen begrenzten Archivbestand. Schauen Sie sich die bereitgestellten Akten genau an und wählen Sie diejenige aus, die Ihrer Einschätzung nach in das kulturelle Gedächtnis aufgenommen werden soll."

Button

Archiv öffnen

Erst wenn auf den Button geklickt wird, sollen die drei Archivakten angezeigt werden.

An der restlichen Funktion soll sich nichts ändern.

Ich füge dir einen Screenshot von meinem Design ein:

---

**Cursor**

Ich schaue mir zuerst die aktuelle Struktur der App an, um einen passenden Plan für den Startbildschirm zu erstellen.


Ich habe die Struktur 

**Startbildschirm — Verhalten klären**

> **Soll der Startbildschirm bei jedem Seitenaufruf erscheinen, oder nur einmal pro Browser-Sitzung (bis der Tab geschlossen wird)?**
> - Bei jedem Seitenaufruf / Reload
> - Nur einmal pro Sitzung (sessionStorage)
>
> Answer: Der Startbildschirm soll nach jeder Aktenauswahl erscheinen. Es kommen im späteren Verlauf weitere bildschirm dazu. ABer das erkläre ich dann.

verstanden. Als Nächstes erstelle ich einen konkreten Plan für den Startbildschirm.


Wichtige Klarstellung: Der Startbildschirm soll nach jeder Aktenauswahl wieder erscheinen. Ich passe den Plan entsprechend an.


---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Ich setze den Plan jetzt um und beginne mit der HTML-Struktur für den Startbildschirm.


Als Nächstes passe ich die View-Logik in `app.js` an.


Kurz prüfen, ob beim Speichern ein kurzes Aufblitzen der Akten vermieden werden kann.


Der Startbildschirm ist implementiert. Kurz die Änderungen:

### Was wurde umgesetzt

**[index.html](index.html)**
- Neuer Startbildschirm mit Überschrift „Archiv“, Willkommenstext und Button „Archiv öffnen“
- Bestehendes Interface (Header, Akten, Footer, Reset) in `#archive-interface` gepackt und initial ausgeblendet

**[style.css](style.css)**
- Layout nach deinem Mockup: schwarzer Top-Bar, beige Intro-Karte, schwarzer Button, beiger Footer-Balken
- Sichtbarkeit über `[hidden]` für Startbildschirm und Archiv-Interface

**[app.js](app.js)**
- Neuer View-Modus `'start'` neben `'offer'` und `'displacement'`
- Beim Laden: Startbildschirm sichtbar, keine Akten
- „Archiv öffnen“: Archiv-Interface mit drei Akten
- Nach erfolgreicher Aktenauswahl (direkt oder nach Verdrängung): zurück zum Startbildschirm
- Abbrechen bei Verdrängung: unverändert zurück zur Akten-Ansicht
- Reset: zurück zum Startbildschirm

### Ablauf

1. Seite öffnen → Startbildschirm  
2. „Archiv öffnen“ → drei Akten wählen  
3. Akte auswählen → Startbildschirm (neues Angebots-Set wird im Hintergrund vorbereitet)  
4. Erneut „Archiv öffnen“ → nächste Runde

Projektion und State-Logik sind unverändert. Du kannst es testen, indem du `index.html` im Browser öffnest.

