/**
 * data.js — Archivdaten für die Installation
 *
 * Diese Datei enthält ausschließlich Daten, keine Logik.
 *
 * So ergänzt du später eigene Inhalte:
 * 1. Neues Bild: Datei in den Ordner assests/ legen und neuen Eintrag in ARCHIV_BILDER anlegen.
 * 2. Weitere Archivlesart zum selben Bild: weiteres Objekt in `varianten` desselben Bild-Eintrags.
 * 3. Akte ohne Bild: Eintrag mit `pfad: null` und passender Variante; Darstellung über ARCHIV_AKTENARTEN.
 * 4. Vokabulare: Listen und Profile in KONTROLLIERTE_WERTE erweitern — daraus werden
 *    Objekttyp, Herkunft, Provenienz, Sammlung und Bewertungskriterien erzeugt.
 */

/** Präfix für Archivsignaturen, z. B. AK-1989-014 */
const ARCHIV_PREFIX = 'AK';

/**
 * Aktenarten für bildlose Akten (keine hinterlegte Bilddatei).
 * Gewichte steuern die Zufallsauswahl; Überlieferungslücke ist selten.
 * vermerk + felder definieren die späteren Inhaltsprofile (ohne UI in diesem Schritt).
 */
const ARCHIV_AKTENARTEN = [
  {
    key: 'archivvermerk',
    label: 'Archivvermerk',
    gewicht: 235,
    vermerk: 'Bilddokumentation nicht überliefert.',
    felder: ['archivsignatur', 'materialhinweis'],
  },
  {
    key: 'bestandsnotiz',
    label: 'Bestandsnotiz',
    gewicht: 235,
    vermerk: 'Erfasst ohne visuelle Vorlage.',
    felder: ['jahr', 'erhaltungszustand'],
  },
  {
    key: 'dokumentfragment',
    label: 'Dokumentfragment',
    gewicht: 235,
    vermerk: 'Nur fragmentarisch überliefert.',
    felder: ['textauszug'],
  },
  {
    key: 'digitaler-datensatz',
    label: 'digitaler Datensatz',
    gewicht: 235,
    vermerk: 'Digital erschlossen; kein Analogbild.',
    felder: ['archivsignatur', 'dokumentationsgrad'],
  },
  {
    key: 'ueberlieferungsluecke',
    label: 'Überlieferungslücke',
    gewicht: 60,
    vermerk: 'Lücke im Bestand.',
    felder: ['dokumentationsgrad', 'fehlendeInformation'],
  },
];


/**
 * Kontrollierte Werte — Vokabulare und Profile für die automatische Aktengenerierung.
 *
 * Globale Listen (objekttypen, sammlung, …) dienen als Fallback.
 * aktenProfile steuern kohärente Kombinationen: Sammlung passt zur Kategorie,
 * Provenienz passt zur Herkunft. Erweitere Profile oder Einträge nach Bedarf.
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

  /** Form des Archivfragments (nicht identisch mit Kategorie) */
  objekttypen: [
    'Gegenstandsfragment',
    'Raumfragment',
    'Tonspur',
    'Gesprächsfragment',
    'Plakatrest',
    'Notizzettel',
    'digitaler Scan',
    'Fotokopie',
    'Fotografie',
    'Markierung',
    'Abdruck',
    'Protokollfragment',
    'beschädigte Datei',
    'Wandspur',
    'Alltagsobjekt',
    'Fundstück',
  ],

  /** Herkunft des Materials oder der Überlieferung */
  herkunft: [
    'kommunale Sammlung',
    'private Überlieferung',
    'institutionelles Archiv',
    'unbekannte Provenienz',
    'mündliche Überlieferung',
    'digitaler Bestand',
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

  /** Zugehörige Sammlung oder Bestand */
  sammlung: [
    'Bestand Stadtgeschichte',
    'Sammlung Alltagskultur',
    'Konvolut private Überlieferung',
    'Magazin offene Bestände',
    'Dokumentationsarchiv öffentlicher Raum',
    'Sammlung Arbeit und Migration',
    'Vorlassensammlung ohne Signaturenzuordnung',
    'Digitaler Bildbestand — unsortiert',
    'Sammlung Fest- und Vereinskultur',
    'Depot unzugeordneter Fundstücke',
  ],

  /**
   * Bewertungskriterien — je Kategorie ein zufälliger Anzeigetext pro Akte.
   * Schlüssel = Kategoriename in der Anzeige (z. B. „Institutionelle Relevanz:“).
   */
  bewertungskriterienListen: {
    'Institutionelle Relevanz': [
      'archivwürdig',
      'von regionaler Bedeutung',
      'von lokaler Bedeutung',
      'von überregionaler Bedeutung',
      'bedingt relevant',
      'nicht priorisiert',
    ],
    'Dokumentationsgrad': [
      'teilweise dokumentiert',
      'gut dokumentiert',
      'spärlich dokumentiert',
      'undokumentiert',
    ],
    'Erhaltungszustand': [
      'gut erhalten',
      'fragil erhalten',
      'beschädigt',
      'fragmentarisch erhalten',
    ],
  },

  /**
   * Akten-Profile — regelbasierte Metadaten-Generierung.
   * Schlüssel '*' in Zuordnungstabellen = Fallback für unbekannte Kategorien/Herkünfte.
   */
  aktenProfile: [
    {
      id: 'bildliche-ueberlieferung',
      objekttypen: ['Fotografie', 'Fotokopie', 'digitaler Scan'],
      herkunft: ['private Überlieferung', 'kommunale Sammlung', 'institutionelles Archiv'],
      sammlungNachKategorie: {
        'Arbeit': ['Sammlung Arbeit und Migration', 'Bestand Stadtgeschichte'],
        'Migration': ['Sammlung Arbeit und Migration', 'Bestand Stadtgeschichte'],
        'Öffentlicher Raum': ['Dokumentationsarchiv öffentlicher Raum', 'Bestand Stadtgeschichte'],
        'Protest': ['Magazin offene Bestände', 'Bestand Stadtgeschichte'],
        'Alltagskultur': ['Sammlung Alltagskultur', 'Digitaler Bildbestand — unsortiert', 'Konvolut private Überlieferung'],
        'Kultur und Rituale': ['Sammlung Fest- und Vereinskultur', 'Bestand Stadtgeschichte'],
        '*': ['Digitaler Bildbestand — unsortiert', 'Bestand Stadtgeschichte'],
      },
      provenienzNachHerkunft: {
        'private Überlieferung': [
          'Überlieferung durch private Nachlässe; Zeitpunkt der Archivaufnahme nicht dokumentiert.',
          'Weitergabe im Familienkreis; spätere Ablage im Archiv ohne Protokoll.',
          'Digitalisierung aus einem unsortierten Vorlass; analoge Vorlage nicht mehr vorhanden.',
        ],
        'kommunale Sammlung': [
          'Erhalt über kommunale Sammlung; vorheriger Besitz unbekannt.',
          'Zugang über Schenkung; genaue Übernahmebedingungen nicht überliefert.',
        ],
        'institutionelles Archiv': [
          'Übernahme aus institutionellem Archivbestand ohne vollständige Herkunftsangabe.',
          'Fund im Rahmen einer Bestandsaufnahme; ursprünglicher Erwerb nicht rekonstruierbar.',
        ],
      },
    },
    {
      id: 'schriftliche-fragmente',
      objekttypen: ['Notizzettel', 'Plakatrest', 'Protokollfragment', 'Gesprächsfragment', 'Abdruck', 'beschädigte Datei'],
      herkunft: ['mündliche Überlieferung', 'unbekannte Provenienz', 'private Überlieferung', 'digitaler Bestand'],
      sammlungNachKategorie: {
        'Arbeit': ['Sammlung Arbeit und Migration', 'Magazin offene Bestände'],
        'Migration': ['Sammlung Arbeit und Migration', 'Vorlassensammlung ohne Signaturenzuordnung'],
        'Migration / Arbeit': ['Sammlung Arbeit und Migration', 'Magazin offene Bestände'],
        'Protest': ['Magazin offene Bestände', 'Depot unzugeordneter Fundstücke'],
        'Alltagskultur': ['Konvolut private Überlieferung', 'Sammlung Alltagskultur', 'Vorlassensammlung ohne Signaturenzuordnung'],
        'Öffentlicher Raum': ['Dokumentationsarchiv öffentlicher Raum', 'Magazin offene Bestände'],
        '*': ['Magazin offene Bestände', 'Vorlassensammlung ohne Signaturenzuordnung'],
      },
      provenienzNachHerkunft: {
        'mündliche Überlieferung': [
          'Sekundärüberlieferung über mündliche Erzählung; schriftliche Belege fragmentarisch.',
        ],
        'unbekannte Provenienz': [
          'Fund im Rahmen einer Bestandsaufnahme; ursprünglicher Erwerb nicht rekonstruierbar.',
        ],
        'private Überlieferung': [
          'Überlieferung durch private Nachlässe; Zeitpunkt der Archivaufnahme nicht dokumentiert.',
          'Weitergabe im Familienkreis; spätere Ablage im Archiv ohne Protokoll.',
        ],
        'digitaler Bestand': [
          'Digitalisierung aus einem unsortierten Vorlass; analoge Vorlage nicht mehr vorhanden.',
        ],
      },
    },
    {
      id: 'raum-und-fundstuecke',
      objekttypen: ['Gegenstandsfragment', 'Raumfragment', 'Fundstück', 'Alltagsobjekt', 'Wandspur', 'Markierung', 'Tonspur'],
      herkunft: ['unbekannte Provenienz', 'kommunale Sammlung', 'institutionelles Archiv'],
      sammlungNachKategorie: {
        'Arbeit': ['Sammlung Arbeit und Migration', 'Depot unzugeordneter Fundstücke'],
        'Migration': ['Sammlung Arbeit und Migration', 'Depot unzugeordneter Fundstücke'],
        'Öffentlicher Raum': ['Dokumentationsarchiv öffentlicher Raum', 'Depot unzugeordneter Fundstücke'],
        'Protest': ['Magazin offene Bestände', 'Depot unzugeordneter Fundstücke'],
        'Kultur und Rituale': ['Sammlung Fest- und Vereinskultur', 'Bestand Stadtgeschichte'],
        'Alltagskultur': ['Sammlung Alltagskultur', 'Depot unzugeordneter Fundstücke'],
        '*': ['Depot unzugeordneter Fundstücke', 'Magazin offene Bestände'],
      },
      provenienzNachHerkunft: {
        'unbekannte Provenienz': [
          'Fund im Rahmen einer Bestandsaufnahme; ursprünglicher Erwerb nicht rekonstruierbar.',
        ],
        'kommunale Sammlung': [
          'Erhalt über kommunale Sammlung; vorheriger Besitz unbekannt.',
        ],
        'institutionelles Archiv': [
          'Übernahme aus institutionellem Archivbestand ohne vollständige Herkunftsangabe.',
        ],
      },
    },
  ],
};


/**
 * Archivbilder — Hauptdatenbestand der Installation.
 *
 * Archivakten entstehen zur Laufzeit aus Bild + Variante.
 * Jedes Bild kann mehrere Varianten haben (unterschiedliche Titel, Beschreibungen, Kategorien).
 * Die Datierung (Jahr), Metadaten (Objekttyp, Herkunft, …) und Bewertungskriterien werden beim
 * Erzeugen einer Akte regelbasiert vergeben — siehe generator.js und KONTROLLIERTE_WERTE.
 *
 * Felder pro Bild:
 *   id        — eindeutige interne Kennung
 *   pfad      — Pfad zum Bild, relativ zum Projektordner; null für Akten ohne Bild
 *   varianten — Array möglicher Archivlesarten für dieses Bild
 *
 * Felder pro Variante:
 *   id                    — eindeutige Kennung innerhalb des Bildes
 *   archivsignatur        — optional; wird sonst automatisch aus der Datierung erzeugt
 *   kategorie             — thematisches Feld; steuert die Sammlungs-Zuordnung in aktenProfile
 *   titel                 — Anzeigetitel der Akte
 *   kurzbeschreibung      — 1–3 Sätze für Vorschau und Auswahl
 *
 * Metadaten-Erweiterung: In KONTROLLIERTE_WERTE.aktenProfile neue Profile anlegen oder
 * sammlungNachKategorie / provenienzNachHerkunft um Einträge ergänzen. Schlüssel '*' = Fallback.
 * Bewertungskriterien: bewertungskriterienListen in KONTROLLIERTE_WERTE erweitern
 * (Schlüssel = Kategoriename, z. B. „Institutionelle Relevanz“).
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
