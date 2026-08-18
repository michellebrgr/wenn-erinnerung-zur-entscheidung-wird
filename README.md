# wenn-erinnerung-zur-entscheidung-wird

Repository für die Masterarbeit des Studiengangs International Media Cultural Work durch Michelle Berger.

## Projektbeschreibung

*„Wenn Erinnerung zur Entscheidung wird“* ist eine partizipative Medieninstallation. Besucher*innen interagieren über einen Laptop mit einem digitalen Archivinterface. Ihnen werden jeweils drei Archivakten angeboten, die anhand verschiedener Metadaten und Bewertungskriterien beschrieben werden.

Aus diesen drei Akten wählen Besucher*innen eine Akte aus, die in einen öffentlich sichtbaren Erinnerungsraum aufgenommen wird. Dieser wird über eine Beamer-Projektion dargestellt und verfügt über maximal sechs Speicherplätze.

Solange noch Speicherplätze frei sind, wird die ausgewählte Akte dem Erinnerungsraum hinzugefügt. Ist der Speicher vollständig belegt, kann eine neue Akte nur aufgenommen werden, wenn dafür eine bereits gespeicherte Akte verdrängt wird.

Die Anwendung läuft vollständig lokal im Browser und benötigt kein Framework, kein Backend und keine Datenbank. Sie wurde für die Darstellung in Google Chrome entwickelt und getestet. Bei der Nutzung anderer Browser kann es zu Darstellungsabweichungen kommen.

## Setup und Ausführung

### Direkt im Browser öffnen

1. `index.html` im Google Chrome öffnen. Diese Ansicht bildet das Archivinterface.
2. `projection.html` in einem zweiten Tab oder Fenster öffnen. Diese Ansicht bildet den projezierten Erinnerungsraum.
3. Beide Ansichten müssen im selben Browser und Browserprofil geöffnet sein, damit der gemeinsame Zustand über `localStorage` synchronisiert werden kann.
4. Das Fenster mit `projection.html` auf den Beamer beziehungsweise den zweiten Bildschirm verschieben.
5. Beide Ansichten für die Nutzung während der Installation in den Vollbildmodus versetzen. Dies kann man mit der Tastenkombination von Google Chrome auf dem MacBook (Shift+Command+F) und auf Windows (F11) oder (fn+F11). Da die Installation für den Volllbildmodus konzipiert wurde.

*Hinweis:* Die Installation wurde für den Browser Google Chrome und den Vollbildmodus konzipiert. Abweichungen davon können die Darstellung beeinflussen. Zudem wurde das Archivinterface für eine Bildschirm mit der Mindestauflösung von  1680x1050. Die Installation passt sich zwar auf kleinere Bildschirme an, dies kann aber zu Verzerrungen kommen.

## Ablauf der Installation

Nach dem Start des Archivinterfaces erscheint zunächst eine kurze Einführung in die Funktionsweise der Installation.

Anschließend werden Besucher*innen drei Archivakten angeboten. Jede Akte enthält einen Titel, eine Kontextbeschreibung sowie verschiedene Metadaten und institutionelle Bewertungen.

### Solange Speicherplätze frei sind
1. Besucher*innen betrachten die drei angebotenen Akten.
2. Eine der drei Akten wird für die Überlieferung ausgewählt.
3. Die Auswahl wird bestätigt.
4. Die ausgewählte Akte erscheint im projizierten Erinnerungsraum.
5. Die beiden nicht ausgewählten Akten werden für den weiteren Verlauf dieses Durchgangs nicht erneut angeboten.
6. Anschließend erscheint ein neues Set aus drei Akten.

Dieser Ablauf wiederholt sich, bis alle sechs Speicherplätze des Erinnerungsraums belegt sind.

### Bei vollständig belegtem Erinnerungsraum

Ist der Erinnerungsraum bereits mit sechs Akten belegt, verändert sich der Auswahlprozess.

1. Besucher*innen wählen zunächst erneut eine der drei angebotenen Akten aus.
2. Das System weist darauf hin, dass kein freier Speicherplatz mehr vorhanden ist.
3. Um die neue Akte aufzunehmen, muss eine der bereits gespeicherten Akten ausgewählt und verdrängt werden.
4. Die verdrängte Akte blendet im Erinnerungsraum aus.
5. Die neu ausgewählte Akte nimmt anschließend ihren Speicherplatz ein.
6. Die Verdrängung ist innerhalb des laufenden Durchgangs nicht rückgängig zu machen.
7. Danach beginnt der Auswahlprozess erneut mit drei neuen Akten.

## Bedienung während der Installation

Für die Präsentation werden zwei Ansichten gleichzeitig verwendet:

- index.html – Archivinterface für die Interaktion der Besucher*innen
- projection.html – projizierter Erinnerungsraum

Der Erinnerungsraum kann über Shift + L zwischen der hellen und dunklen Darstellung wechseln.

Über Shift + R kann die Installation vollständig zurückgesetzt werden. Dabei beginnt ein neuer Durchlauf und der bisherige Zustand des Erinnerungsraums wird gelöscht.

Das Archivinterface kann über die integrierte Sprachumschaltung zusätzlich auf Englisch angezeigt werden. Der projizierte Erinnerungsraum bleibt bewusst in einer Sprache, um die visuelle Darstellung möglichst ruhig zu halten.

## Projektdokumentation

Neben dem ausführbaren Projekt enthält das Repository ergänzende Dokumentationen, die zentrale gestalterische und technische Entscheidungen nachvollziehbar machen.

- Bildauswahl: Die Kriterien für die Auswahl der im Praxisprojekt verwendeten Bilder sind in *'wenn-erinnerung-zur-entscheidung-wird/assets/documentation/image-selection.md'* dokumentiert. Die zugehörigen Bilddateien befinden sich in *'wenn-erinnerung-zur-entscheidung-wird/assets/images'* des Projekts.
- Akten, Kategorien und Textbausteine: Die Struktur der Akten sowie die verwendeten Kategorien, Metadaten und Textbausteine sind in *'wenn-erinnerung-zur-entscheidung-wird/assets/documentation/archive-taxonomy.md'* dokumentiert. Die Datengrundlage des laufenden Systems befindet sich unter *'wenn-erinnerung-zur-entscheidung-wird/data.js'*.
- Generierung der Akten: Die Logik zur Erstellung der textbasierten Akten befindet sich unter *'wenn-erinnerung-zur-entscheidung-wird/generator.js'*. Die dazu verwendeten Kataloge und Textbausteine sind zusätzlich in der Projektdokumentation festgehalten.
- Bild- und Aktendokumentation: Informationen zu den verwendeten Bildern und den daraus entwickelten kuratierten Akten befinden sich unter *'wenn-erinnerung-zur-entscheidung-wird/assets/documentation/image-documentation.md.'*
- KI-Nutzung: Die KI-gestützten Arbeitsschritte bei der Entwicklung von Textinhalten und Programmierung sind unter *'wenn-erinnerung-zur-entscheidung-wird/docs/ai-usage'*. KI-gestützt entwickelte Inhalte wurden anschließend eigenständig geprüft und angepasst.
- Technische Umsetzung: Die zentralen JavaScript-Dateien befinden sich im Ordner *'wenn-erinnerung-zur-entscheidung-wird'* Die Gestaltung des Archivinterfaces und des Erinnerungsraums befindet sich unter *'wenn-erinnerung-zur-entscheidung-wird'*.

Die ergänzenden Dateien dienen dazu, die Entstehung des Praxisprojekts sowie die Auswahl und Entwicklung seiner Inhalte nachvollziehbar zu dokumentieren.