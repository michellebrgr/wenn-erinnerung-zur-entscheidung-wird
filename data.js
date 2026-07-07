/**
 * data.js — Statische Inhalte für die Installation
 *
 * Diese Datei enthält ausschließlich Daten, keine Logik.
 * Neue Kategorien: Eintrag in CATEGORIES ergänzen (String).
 * Neue Bewertungskriterien: Eintrag in CRITERIA_DEFINITIONS ergänzen.
 */

/** Präfix für generierte Aktenzeichen, z. B. WEZ-2026-047 */
const REFERENCE_PREFIX = 'WEZ';

/**
 * Kategorien für Archivakten.
 * Gesellschaftliche Themenfelder des kulturellen Gedächtnisses (keine Bewertung, keine Objektarten).
 */
const CATEGORIES = [
  'Alltagskultur',
  'Protest',
  'Migration / Arbeit',
  'Öffentlicher Raum',
  'Digitale Spuren',
];

/**
 * ObjectType beschreibt die Form des Archivfragments (nicht Kategorie, nicht Bewertung).
 */
const OBJECT_TYPES = [
  'Gegenstandsfragment',
  'Raumfragment',
  'Tonspur',
  'Gesprächsfragment',
  'Plakatrest',
  'Notizzettel',
  'digitaler Scan',
  'Fotokopie',
  'Markierung',
  'Abdruck',
  'Protokollfragment',
  'beschädigte Datei',
  'Wandspur',
  'Alltagsobjekt',
  'Fundstück',
];

/**
 * Material/Technik — offene Materialbegriffe.
 */
const MATERIALS = [
  'Papier',
  'Fotokopie',
  'Stoff',
  'Holz',
  'Glas',
  'Tonband',
  'digitaler Scan',
  'Wandspur',
  'handschriftliche Notiz',
  'beschädigte Datei',
  'unbekanntes Material',
  'Screenshot',
  'Ausdruck',
  'Klebestreifen',
  'Karton',
  'Audiofragment',
];

/**
 * Zustand — feste Werte.
 */
const CONDITIONS = [
  'intakt',
  'fragil',
  'beschädigt',
  'fragmentarisch',
];

/**
 * Sichtbarkeit — feste Werte.
 */
const VISIBILITIES = [
  'gering',
  'mittel',
  'hoch',
];

/**
 * Herkunft/Provenienz — feste Werte.
 */
const ORIGINS = [
  'kommunale Sammlung',
  'private Überlieferung',
  'institutionelles Archiv',
  'unbekannte Provenienz',
  'mündliche Überlieferung',
  'digitaler Bestand',
];

/**
 * Titel-Schablonen für künstlerische, nicht-historisierende Akten.
 * Unterstützte Platzhalter: {objectType}, {material}, {category}, {year}
 */
const TITLE_TEMPLATES = [
  'Rest von {objectType} ({year})',
  'Aufzeichnung: {category}',
  '{objectType} — {material}',
  'Notiz zu {category}',
  'Spur in {material}',
  'Fragment: {objectType}',
  'Vermerk ({year})',
  'Nachtrag: {category}',
  'Ausschnitt aus {objectType}',
  '{objectType} / {category}',
];

/**
 * Kurze Beschreibungstexte (1–2 Sätze) im Ton generierter Erinnerungsfragmente.
 * Der Generator kann 1–2 Bausteine kombinieren und leicht variieren.
 */
const SHORTTEXT_POOL = [
  'Nur ein Teil ist lesbar geblieben; der Rest wirkt wie nachträglich überdeckt.',
  'Die Ränder tragen Spuren von Berührung, als wäre etwas mehrfach umgeschichtet worden.',
  'Es gibt ein Detail, das sich widersetzt: nicht ganz Beweis, nicht ganz Erfindung.',
  'Der Inhalt taucht in Gesprächen auf, ohne dass sich eine Quelle nennen lässt.',
  'Was sichtbar ist, wirkt zufällig — als hätte jemand genau hier aufgehört.',
  'Der Eintrag passt in keine Ordnung, aber er bleibt wiedererkennbar.',
  'Mehrere Schichten liegen übereinander; keine erklärt die andere vollständig.',
  'Ein kurzer Ton, eine Pause, dann Stille — als hätte die Datei sich selbst gelöscht.',
  'Die Oberfläche ist markiert, doch die Bedeutung bleibt unentschieden.',
  'Ein Rest von Öffentlichkeit: zu eindeutig, um privat zu sein; zu vage, um offiziell zu wirken.',
  'Die Notiz nennt keinen Ort, aber der Raum ist darin spürbar.',
  'Das Fragment trägt einen Hinweis auf Arbeit, aber keine Tätigkeit lässt sich rekonstruieren.',
  'Die Aufnahme klingt, als wäre sie in Bewegung entstanden.',
  'Eine Geste ist festgehalten, ohne dass klar wird, wem sie galt.',
  'Der Scan wirkt zu sauber, um echt zu sein — und zu beschädigt, um nur Kopie zu bleiben.',
  'Eine Spur von Protest, die nicht sagt, wogegen; nur, dass etwas nicht mehr still blieb.',
  'Das Material scheint vertraut, aber die Verwendung bleibt offen.',
  'Die Datei endet mitten im Satz. Danach: nur noch Metadaten.',
  'Etwas wurde entfernt, aber die Leerstelle ist das eigentlich Gespeicherte.',
  'Ein Abdruck, als wäre ein Gegenstand kurz dagewesen und dann wieder verschwunden.',
  'Der Text wirkt wie eine Erinnerung, die man sich ausgeliehen hat.',
  'Die Markierung zeigt auf etwas, das nicht mehr vorhanden ist.',
  'Ein Protokollfragment ohne Protokoll: Zeitpunkt und Ton, aber keine Entscheidung.',
  'Die Herkunft ist unklar, doch die Wiederholung macht es glaubwürdig.',
];

/**
 * Bewertungskriterien für Archivakten.
 * key: interner Bezeichner | label: Anzeigename | description: Kurzerklärung
 */
const CRITERIA_DEFINITIONS = [
  {
    key: 'authenticity',
    label: 'Authentizität',
    description: 'Wie unmittelbar und glaubwürdig wirkt die Erinnerung?',
  },
  {
    key: 'emotionalWeight',
    label: 'Emotionalität',
    description: 'Wie stark ist die emotionale Ladung des Fragments?',
  },
  {
    key: 'clarity',
    label: 'Klarheit',
    description: 'Wie deutlich und fassbar ist die Erinnerung beschrieben?',
  },
  {
    key: 'connection',
    label: 'Verbindung',
    description: 'Wie stark verbindet das Fragment Vergangenheit und Gegenwart?',
  },
];
