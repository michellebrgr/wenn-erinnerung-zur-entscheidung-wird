/**
 * data.js — Archivdaten für die Installation
 *
 * Diese Datei enthält ausschließlich Daten, keine Logik.
 *
 * So ergänzt du später eigene Inhalte:
 * 1. Neues Bild: Datei in den Ordner assests/ legen und neuen Eintrag in ARCHIV_BILDER anlegen.
 * 2. Weitere Archivlesart zum selben Bild: weiteres Objekt in `varianten` desselben Bild-Eintrags.
 * 3. Akte ohne Bild: wird zur Laufzeit aus kategorienKataloge und Textvorlagen erzeugt.
 * 4. Vokabulare: kategorienKataloge und Vorlagen in KONTROLLIERTE_WERTE erweitern —
 *    daraus werden Objekttyp, Sammlung, Provenienz, Texte und Bewertungskriterien erzeugt.
 */

/** Präfix für Archivsignaturen, z. B. AK-1989-014 */
const ARCHIV_PREFIX = 'AK';


/**
 * Kontrollierte Werte — Kataloge und Textbausteine für die automatische Aktengenerierung.
 *
 * Allgemeine Kataloge (provenienz, dokumentationsgrad) gelten kategorieübergreifend.
 * kategorienKataloge bündeln Sammlungen, Relevanz und Textbausteine pro Kategorie.
 * Titel-, Kontext- und Kurzbeschreibungsvorlagen erzeugen Texte für bildlose Akten.
 */
const KONTROLLIERTE_WERTE = {

  /** Gesellschaftliche Themenfelder des kulturellen Gedächtnisses */
  kategorien: [
    'Alltagskultur',
    'Arbeit',
    'Migration',
    'Öffentlicher Raum',
    'Protest',
    'Kultur und Rituale',
  ],

  /** Überlieferungsgeschichte — wird pro Akte zufällig vergeben */
  provenienz: [
    'Überlieferung durch private Nachlässe; Zeitpunkt der Archivaufnahme nicht dokumentiert.',
    'Erhalt über kommunale Sammlung; vorheriger Besitz unbekannt.',
    'Übernahme aus institutionellem Archivbestand ohne vollständige Herkunftsangabe.',
    'Fund im Rahmen einer Bestandsaufnahme; ursprünglicher Erwerb nicht rekonstruierbar.',
    'Weitergabe im Familienkreis; spätere Ablage im Archiv ohne Protokoll.',
    'Digitalisierung aus einem unsortierten Vorlass; analoge Vorlage nicht mehr vorhanden.',
    'Sekundärüberlieferung über mündliche Erzählung; schriftliche Belege fragmentarisch.',
    'Zugang über Schenkung; genaue Übernahmebedingungen nicht überliefert.',
  ],

  /** Dokumentationsgrad — allgemeiner Katalog */
  dokumentationsgrad: [
    'teilweise dokumentiert',
    'gut dokumentiert',
    'spärlich dokumentiert',
    'undokumentiert',
  ],

  /**
   * Kategoriespezifische Kataloge — Sammlungen, Relevanz und Textbausteine.
   * Bei der Generierung werden ausschließlich Bausteine derselben Kategorie kombiniert.
   */
  kategorienKataloge: {
    'Arbeit': {
      sammlungen: [
        'Handwerk und Produktion',
        'Verwaltung und Infrastruktur',
        'Wissensarbeit und technische Medien',
      ],
      institutionelleRelevanz: [
        'von lokaler Bedeutung',
      ],
      objekttypen: [
        'Arbeitsprotokoll',
        'Personalakte',
        'Schichtplan',
        'Lohnabrechnung',
        'Betriebsfotografie',
        'Ausbildungsnachweis',
        'technisches Handbuch',
        'interne Mitteilung',
        'handschriftliche Arbeitsnotiz',
        'Dokumentation eines Arbeitsplatzes',
      ],
      motive: [
        'Arbeitsabläufe innerhalb eines kleinen Betriebs',
        'Veränderungen eines handwerklichen Berufs',
        'alltägliche Tätigkeiten während einer Arbeitsschicht',
        'Zusammenarbeit mehrerer Beschäftigter',
        'technische Veränderungen am Arbeitsplatz',
        'Ausbildung und Weitergabe von Wissen',
        'Arbeitsbedingungen innerhalb eines Betriebs',
        'Übergang von manueller zu automatisierter Arbeit',
        'informelle Kommunikation unter Beschäftigten',
        'nicht dokumentierte Tätigkeiten im Arbeitsalltag',
      ],
      orte: [
        'Werkstatt',
        'Produktionshalle',
        'Verwaltungsgebäude',
        'Lagerraum',
        'Büroarbeitsplatz',
        'Betriebskantine',
        'Ausbildungsstätte',
        'Baustelle',
        'technischer Arbeitsraum',
        'nicht eindeutig bestimmbarer Arbeitsplatz',
      ],
      erhaltungszustaende: [
        'vollständig erhalten',
        'mit leichten Gebrauchsspuren',
        'teilweise beschädigt',
        'stark vergilbt',
        'nur fragmentarisch erhalten',
        'digital rekonstruiert',
      ],
      fehlendeInformationen: [
        'Name der beschäftigten Person nicht überliefert',
        'genauer Betrieb nicht bekannt',
        'Aufnahmezeitpunkt nicht eindeutig bestimmbar',
        'Funktion des Dokuments nicht vollständig geklärt',
        'Zusammenhang mit weiteren Unterlagen fehlt',
        'Urheber*in nicht dokumentiert',
      ],
      materialhinweise: [
        'Papier mit handschriftlichen Ergänzungen',
        'maschinenschriftliches Dokument',
        'Fotopapier',
        'dünner Karton',
        'digitales Textdokument',
        'gescanntes Original',
        'mehrseitige Papierakte',
        'thermisch bedrucktes Papier',
      ],
    },

    'Alltagskultur': {
      sammlungen: [
        'Familien und private Fotografien',
        'Wohnen, Freizeit und soziale Beziehungen',
        'Medien und Alltagsobjekte',
      ],
      institutionelleRelevanz: [
        'von regionaler Bedeutung',
      ],
      objekttypen: [
        'private Fotografie',
        'Einkaufszettel',
        'Tagebuchseite',
        'Postkarte',
        'Haushaltsnotiz',
        'Familienalbum',
        'Gebrauchsanweisung',
        'Eintrittskarte',
        'persönlicher Brief',
        'Verpackung eines Alltagsprodukts',
      ],
      motive: [
        'alltägliche Abläufe innerhalb eines Haushalts',
        'gemeinsames Essen',
        'private Freizeitgestaltung',
        'familiäre Beziehungen',
        'Nutzung eines Alltagsgegenstands',
        'Veränderungen des Wohnraums',
        'persönliche Gewohnheiten',
        'informelle Treffen im privaten Umfeld',
        'Weitergabe familiärer Erinnerungen',
        'Spuren eines nicht näher dokumentierten Alltags',
      ],
      orte: [
        'private Wohnung',
        'Küche',
        'Wohnzimmer',
        'Garten',
        'Freizeitgelände',
        'öffentlicher Park',
        'privater Veranstaltungsraum',
        'Urlaubsort',
        'familiäres Umfeld',
        'nicht eindeutig bestimmbarer Innenraum',
      ],
      erhaltungszustaende: [
        'gut erhalten',
        'mit leichten Knickspuren',
        'an den Rändern beschädigt',
        'teilweise verblasst',
        'unvollständig erhalten',
        'digitalisiert',
      ],
      fehlendeInformationen: [
        'abgebildete Personen nicht identifiziert',
        'genauer Ort nicht überliefert',
        'familiärer Zusammenhang nicht dokumentiert',
        'ursprüngliche Verwendung unbekannt',
        'Datierung nur ungefähr möglich',
        'Herkunft innerhalb des Bestands ungeklärt',
      ],
      materialhinweise: [
        'Fotopapier',
        'beschichtetes Papier',
        'handschriftlich beschriebenes Papier',
        'Karton',
        'digitales Bild',
        'Albumseite',
        'farbiger Papierabzug',
        'gescanntes Privatdokument',
      ],
    },

    'Migration': {
      sammlungen: [
        'Mobilität und biografische Übergänge',
        'Korrespondenz und transnationale Beziehungen',
        'Institutionelle Erfassung und Zugehörigkeit',
      ],
      institutionelleRelevanz: [
        'von überregionaler Relevanz',
      ],
      objekttypen: [
        'Reisedokument',
        'Meldebescheinigung',
        'persönlicher Brief',
        'Fahrkarte',
        'Antragsformular',
        'Aufenthaltsdokument',
        'private Fotografie',
        'Karte',
        'Gepäckanhänger',
        'behördliche Korrespondenz',
      ],
      motive: [
        'räumlicher und biografischer Übergang',
        'Ankunft an einem neuen Wohnort',
        'Kontakt zu zurückgelassenen Familienmitgliedern',
        'behördliche Erfassung einer Person',
        'Suche nach Arbeit und Unterkunft',
        'Veränderung persönlicher Zugehörigkeit',
        'Reise zwischen mehreren Orten',
        'transnationale Familienbeziehungen',
        'Weitergabe persönlicher Erinnerungen',
        'fragmentarisch dokumentierte Migrationsgeschichte',
      ],
      orte: [
        'Bahnhof',
        'Grenzübergang',
        'Meldebehörde',
        'Übergangsunterkunft',
        'privater Wohnraum',
        'Arbeitsplatz',
        'Verkehrsmittel',
        'Beratungsstelle',
        'Herkunftsort',
        'nicht eindeutig bestimmter Ankunftsort',
      ],
      erhaltungszustaende: [
        'vollständig erhalten',
        'mehrfach gefaltet',
        'mit handschriftlichen Ergänzungen',
        'teilweise unleserlich',
        'nur als Kopie erhalten',
        'digital rekonstruiert',
      ],
      fehlendeInformationen: [
        'Name der betroffenen Person anonymisiert',
        'genauer Reiseweg nicht dokumentiert',
        'Herkunftsort nicht eindeutig bestimmbar',
        'Aufenthaltsdauer unbekannt',
        'familiärer Zusammenhang nur teilweise überliefert',
        'weitere zugehörige Dokumente fehlen',
      ],
      materialhinweise: [
        'amtliches Papierdokument',
        'Fotopapier',
        'Durchschlagpapier',
        'handschriftlicher Brief',
        'gefaltete Landkarte',
        'digitales Dokument',
        'laminierter Ausweis',
        'maschinenschriftliches Formular',
      ],
    },

    'Protest': {
      sammlungen: [
        'Demonstrationen und politische Versammlungen',
        'Politische Kommunikation und Protestmedien',
        'Spuren, Kontrolle und Unsichtbarmachung',
      ],
      institutionelleRelevanz: [
        'von gesellschaftlicher Bedeutung',
      ],
      objekttypen: [
        'Flugblatt',
        'Protestplakat',
        'Demonstrationsfotografie',
        'Versammlungsaufruf',
        'Transparent',
        'Zeitungsausschnitt',
        'polizeiliche Dokumentation',
        'handschriftliche Notiz',
        'digitales Posting',
        'Informationsbroschüre',
      ],
      motive: [
        'öffentliche politische Forderung',
        'Teilnahme an einer Demonstration',
        'Organisation einer Protestaktion',
        'Reaktion auf eine gesellschaftliche Entscheidung',
        'Verbreitung politischer Botschaften',
        'Kontrolle und Beobachtung einer Versammlung',
        'Aneignung des öffentlichen Raums',
        'Entfernung oder Überdeckung politischer Zeichen',
        'gemeinschaftliche Form des Widerstands',
        'nicht eindeutig zuordenbare Protestspur',
      ],
      orte: [
        'öffentlicher Platz',
        'Straße',
        'Universitätsgelände',
        'Betriebsgelände',
        'Verwaltungsgebäude',
        'Veranstaltungsraum',
        'Bahnhofsvorplatz',
        'Innenstadt',
        'digitaler Kommunikationsraum',
        'nicht näher bestimmter Versammlungsort',
      ],
      erhaltungszustaende: [
        'gut erhalten',
        'mit Klebe- und Nutzungsspuren',
        'eingerissen',
        'teilweise übermalt',
        'nur fragmentarisch erhalten',
        'digital archiviert',
      ],
      fehlendeInformationen: [
        'Urheber*in nicht bekannt',
        'genaue Protestgruppe nicht dokumentiert',
        'Anlass der Aktion nicht vollständig überliefert',
        'Aufnahmeort nicht eindeutig bestimmbar',
        'beteiligte Personen nicht identifiziert',
        'ursprünglicher Veröffentlichungskontext fehlt',
      ],
      materialhinweise: [
        'bedrucktes Papier',
        'handbeschriebener Karton',
        'Stoff',
        'Fotopapier',
        'Zeitungspapier',
        'digitales Bild',
        'vervielfältigtes Flugblatt',
        'gesicherter Bildschirmausschnitt',
      ],
    },

    'Öffentlicher Raum': {
      sammlungen: [
        'Stadtraum und Nachbarschaft',
        'Öffentliche Einrichtungen und Versorgung',
        'Ereignisse, Kommunikation und urbane Spuren',
      ],
      institutionelleRelevanz: [
        'von wissenschaftlicher Bedeutung',
      ],
      objekttypen: [
        'Straßenfotografie',
        'Stadtplan',
        'Hinweisschild',
        'kommunales Dokument',
        'Bauplan',
        'Nutzungsgenehmigung',
        'Veranstaltungshinweis',
        'Fahrplan',
        'Postkarte',
        'fotografische Zustandsdokumentation',
      ],
      motive: [
        'alltägliche Nutzung eines öffentlichen Ortes',
        'Veränderung des Stadtbildes',
        'Begegnung verschiedener Personengruppen',
        'Nutzung öffentlicher Infrastruktur',
        'vorübergehende Veränderung eines Platzes',
        'Spuren öffentlicher Kommunikation',
        'Einschränkung oder Kontrolle eines Zugangs',
        'Gestaltung einer gemeinschaftlich genutzten Fläche',
        'Verschwinden eines vertrauten Ortes',
        'nicht dokumentierte Veränderung im Stadtraum',
      ],
      orte: [
        'Marktplatz',
        'Straße',
        'Haltestelle',
        'Bahnhof',
        'Parkanlage',
        'Fußgängerzone',
        'öffentlicher Verwaltungsbereich',
        'Spielplatz',
        'Wohnviertel',
        'nicht eindeutig bestimmbarer Stadtraum',
      ],
      erhaltungszustaende: [
        'vollständig erhalten',
        'mit sichtbaren Gebrauchsspuren',
        'teilweise beschädigt',
        'stark verwittert',
        'nur ausschnittsweise überliefert',
        'digital rekonstruiert',
      ],
      fehlendeInformationen: [
        'genauer Aufnahmeort nicht bekannt',
        'Funktion des Ortes nicht eindeutig dokumentiert',
        'Zeitpunkt der Veränderung unbekannt',
        'beteiligte Institution nicht überliefert',
        'Urheber*in der Aufnahme nicht identifiziert',
        'ursprünglicher Nutzungskontext fehlt',
      ],
      materialhinweise: [
        'Fotopapier',
        'beschichteter Karton',
        'amtliches Papierdokument',
        'gefalteter Stadtplan',
        'digitales Bild',
        'Kunststoffschild',
        'gescanntes Planmaterial',
        'bedrucktes Informationsblatt',
      ],
    },

    'Kultur und Rituale': {
      sammlungen: [
        'Religion und Glaubenspraxis',
        'Feste, Zeremonien und Gedenkkultur',
        'Materielle und schriftliche Überlieferungen',
      ],
      institutionelleRelevanz: [
        'von medienhistorischer Bedeutung',
        'von sammlungsgeschichtlicher Bedeutung',
      ],
      objekttypen: [
        'Veranstaltungsprogramm',
        'Einladung',
        'Ritualgegenstand',
        'private Fotografie',
        'Gedenkkarte',
        'Liedblatt',
        'Festschrift',
        'religiöses Dokument',
        'Plakat',
        'handschriftliche Überlieferung',
      ],
      motive: [
        'gemeinschaftlich ausgeübtes Ritual',
        'religiöse oder spirituelle Praxis',
        'Vorbereitung eines Festes',
        'öffentliche oder private Gedenkhandlung',
        'Weitergabe kultureller Traditionen',
        'wiederkehrende gemeinschaftliche Veranstaltung',
        'Veränderung eines überlieferten Brauchs',
        'Verbindung materieller Objekte mit Erinnerung',
        'symbolische Handlung innerhalb einer Gemeinschaft',
        'nicht vollständig dokumentierte kulturelle Praxis',
      ],
      orte: [
        'religiöser Versammlungsort',
        'privater Wohnraum',
        'öffentlicher Festplatz',
        'Gemeindehaus',
        'Friedhof',
        'Kulturzentrum',
        'Vereinsraum',
        'Veranstaltungsstätte',
        'Gedenkort',
        'nicht eindeutig bestimmbarer Ritualort',
      ],
      erhaltungszustaende: [
        'vollständig erhalten',
        'mit leichten Gebrauchsspuren',
        'teilweise verblasst',
        'an mehreren Stellen beschädigt',
        'nur fragmentarisch überliefert',
        'digital konserviert',
      ],
      fehlendeInformationen: [
        'beteiligte Personen nicht identifiziert',
        'genaue Bedeutung des Rituals nicht dokumentiert',
        'Herkunft des Objekts ungeklärt',
        'Datierung nicht eindeutig möglich',
        'institutioneller Zusammenhang nicht überliefert',
        'ursprüngliche Verwendung nur teilweise rekonstruierbar',
      ],
      materialhinweise: [
        'bedrucktes Papier',
        'Fotopapier',
        'Textil',
        'Holz',
        'Metall',
        'beschrifteter Karton',
        'digitales Dokument',
        'gescanntes Original',
      ],
    },
  },

  /** Strukturen für systemgenerierte Aktentitel */
  titelstrukturen: [
    '{objekttyp} zu {motiv}',
    '{objekttyp} aus {ort}',
    '{objekttyp} mit Bezug zu {motiv}',
    '{objekttyp} eines nicht dokumentierten Ereignisses',
    '{objekttyp} aus einem fragmentarisch überlieferten Bestand',
  ],

  /** Satzanfänge für Kontextbeschreibungen */
  kontextSatzanfaenge: [
    'Das überlieferte Objekt dokumentiert',
    'Das Dokument verweist auf',
    'Die Aufnahme zeigt',
    'Die erhaltene Unterlage beschreibt',
    'Das Fragment steht im Zusammenhang mit',
    'Das Objekt wurde einem Bestand zugeordnet, der',
    'Die genaue Funktion des Objekts ist nicht vollständig überliefert. Es verweist jedoch auf',
  ],

  /** Verbindungen innerhalb der Kontextbeschreibung */
  kontextVerbindungen: [
    'und gibt Einblick in',
    'und dokumentiert zugleich',
    'und lässt Rückschlüsse auf',
    'und verweist auf',
    'steht jedoch nur fragmentarisch zur Verfügung',
    'konnte bisher keinem eindeutigen Ereignis zugeordnet werden',
    'wurde aufgrund seines dokumentarischen Charakters in die Sammlung aufgenommen',
  ],

  /** Strukturen für Kurzbeschreibungen im Erinnerungsraum */
  kurzbeschreibungStrukturen: [
    'Dokumentiert {motiv}.',
    'Verweist auf {motiv}.',
    'Überliefert eine Spur von {motiv}.',
    'Bewahrt ein Fragment von {motiv}.',
    'Zeigt {motiv}.',
    'Erinnert an {motiv}.',
  ],
};


/**
 * Archivbilder — Hauptdatenbestand der Installation.
 *
 * Archivakten entstehen zur Laufzeit aus Bild + Variante.
 * Jedes Bild kann mehrere Varianten haben (unterschiedliche Titel, Beschreibungen, Kategorien).
 * Die Datierung (Jahr), Metadaten (Objekttyp, Sammlung, Provenienz, …) und Bewertungskriterien
 * werden beim Erzeugen einer Akte aus kategorienKataloge vergeben — siehe generator.js.
 *
 * Felder pro Bild:
 *   id        — eindeutige interne Kennung
 *   pfad      — Pfad zum Bild, relativ zum Projektordner; null für Akten ohne Bild
 *   varianten — Array möglicher Archivlesarten für dieses Bild
 *
 * Felder pro Variante:
 *   id                    — eindeutige Kennung innerhalb des Bildes
 *   archivsignatur        — optional; wird sonst automatisch aus der Datierung erzeugt
 *   kategorie             — thematisches Feld; steuert die Sammlungs-Zuordnung in kategorienKataloge
 *   titel                 — Anzeigetitel der Akte
 *   kurzbeschreibung      — 1–3 Sätze für Vorschau und Auswahl
 *   kontextbeschreibung   — optional; ausführliche Beschreibung nur im Akteninterface
 *
 * Metadaten-Erweiterung: In KONTROLLIERTE_WERTE.kategorienKataloge die passende Kategorie
 * um Sammlungen, Relevanz oder Textbausteine ergänzen. Allgemeine Kataloge und
 * Satzvorlagen liegen ebenfalls in KONTROLLIERTE_WERTE.
 */
const ARCHIV_BILDER = [

  {
    id: 'bild-fotosammlung-01',
    pfad: 'assests/fotosammlung_01.jpg',
    varianten: [
      {
        id: 'variant-a',
        kategorie: 'Protest',
        titel: '[Platzhalter] Fragment eines Plakatrests',
        kurzbeschreibung: '[Platzhalter] Kurzbeschreibung der ersten Lesart. Hier später 1–3 Sätze eintragen.',
      },
      {
        id: 'variant-b',
        kategorie: 'Alltagskultur',
        titel: '[Platzhalter] Fotosammlung — Alltagsdokumentation',
        kurzbeschreibung: '[Platzhalter] Zweite Lesart desselben Bildes mit anderem Titel und anderer Kategorie.',
      },
    ],
  },

  {
    id: 'bild-festzug-01',
    pfad: 'assests/festzug_01.jpg',
    varianten: [
      {
        id: 'variant-a',
        kategorie: 'Öffentlicher Raum',
        titel: '[Platzhalter] Festzug im öffentlichen Raum',
        kurzbeschreibung: '[Platzhalter] Kurzbeschreibung der Festzug-Akte. Hier später 1–3 Sätze eintragen.',
      },
      {
        id: 'variant-b',
        kategorie: 'Kultur und Rituale',
        titel: 'Traditionelle Prozession im Stadtraum',
        kurzbeschreibung: 'Dokumentation einer gemeinschaftlichen Festpraxis, bei der musikalische Darbietung, Kleidung und Öffentlichkeit zusammenwirken.',
      },
    ],
  },

  {
    id: 'bild-ohne-beispiel',
    pfad: null,
    varianten: [
      {
        id: 'variant-a',
        kategorie: 'Arbeit',
        titel: '[Platzhalter] Notizzettel aus einem Gesprächsfragment',
        kurzbeschreibung: '[Platzhalter] Beispielakte ohne Bild — pfad kann null sein, bis ein Foto vorliegt.',
      },
    ],
  },
  {
    id: 'Briefe und Handschrift',
    pfad: 'assests/Brief_01.jpg',
    varianten: [
      {
        id: 'variant-a',
        kategorie: 'Alltagskultur',
        titel: 'Private Erinnerungsdokumente',
        kurzbeschreibung: 'Konvolut aus Fotografien und handschriftlichen Aufzeichnungen, das auf einen privaten Erinnerungskontext verweist.',
      },
      {
        id: 'variant-b',
        kategorie: 'Alltagskultur',
        titel: 'Fragmente persönlicher Korrespondenz',
        kurzbeschreibung: '[Sammlung analoger Dokumente, die als Spuren alltäglicher Beziehungen und individueller Erinnerung überliefert wurden.',
      },
    ],
  },
  {
    id: 'Hafenbild 1',
    pfad: 'assests/Hafen_01.jpg',
    varianten: [
      {
        id: 'variant-a',
        kategorie: 'Arbeit',
        titel: 'Verladung im innerstädtischen Hafen',
        kurzbeschreibung: 'Dokumentation eines Hafenbereichs mit Schiffen, Ladeeinrichtungen und mechanischer Hebevorrichtung. Die Aufnahme verweist auf frühere Arbeitsabläufe, deren genauer betrieblicher Zusammenhang nicht überliefert ist.',
      },
      {
        id: 'variant-b',
        kategorie: 'Öffentlicher Raum',
        titel: 'Hafenbecken zwischen Nutzung und Wandel',
        kurzbeschrebung: 'Aufnahme eines städtischen Hafenraums, in dem Verkehrswege, technische Infrastruktur und maritime Nutzung zusammentreffen. Die ursprüngliche Funktion einzelner Bereiche konnte nicht vollständig rekonstruiert werden.',
      },
      {
        id: 'variant-c',
        kategorie: 'Migration',
        titel: 'Hafen als Ort von Ankunft und Abreise',
        kurzbeschrebung: 'Fotografische Dokumentation eines Hafenbereichs, der mit unterschiedlichen Formen von Mobilität und grenzüberschreitender Bewegung in Verbindung gebracht wird. Konkrete Angaben zu Personen und Reisewegen liegen nicht vor.',
      },
    ],
  },
];
