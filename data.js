/**
 * data.js — Archivdaten für die Installation
 *
 * Diese Datei enthält ausschließlich Daten, keine Logik.
 *
 * So ergänzt du später eigene Inhalte:
 * 1. Neues Bild: Datei in den Ordner assests/ legen und neuen Eintrag in ARCHIV_BILDER anlegen.
 * 2. Weitere Archivlesart zum selben Bild: weiteres Objekt in `varianten` desselben Bild-Eintrags.
 * 3. Akte ohne Bild: Eintrag mit `pfad: null` und passender Variante.
 * 4. Vokabulare: Listen in KONTROLLIERTE_WERTE bei Bedarf erweitern (optional, nur Orientierung).
 */

/** Präfix für Archivsignaturen, z. B. AK-1989-014 */
const ARCHIV_PREFIX = 'AK';


/**
 * Kontrollierte Werte — Orientierung beim Befüllen neuer Varianten.
 * Diese Listen sind Vorschläge; du kannst auch abweichende Werte in einzelnen Varianten eintragen.
 */
const KONTROLLIERTE_WERTE = {

  /** Gesellschaftliche Themenfelder des kulturellen Gedächtnisses */
  kategorien: [
    'Alltagskultur',
    'Protest',
    'Migration / Arbeit',
    'Öffentlicher Raum',
    'Digitale Spuren',
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

  /** Dokumentationsgrad — wie vollständig die Akte beschrieben ist */
  dokumentationsgrad: [
    'gering',
    'mittel',
    'hoch',
  ],

  /** Erhaltungszustand des Objekts oder Fragments */
  erhaltungszustand: [
    'intakt',
    'fragil',
    'beschädigt',
    'fragmentarisch',
  ],

  /** Institutionelle Relevanz — Bedeutung für Sammlung oder Archiv */
  institutionelleRelevanz: [
    'gering',
    'mittel',
    'hoch',
  ],
};


/**
 * Archivbilder — Hauptdatenbestand der Installation.
 *
 * Archivakten entstehen zur Laufzeit aus Bild + Variante.
 * Jedes Bild kann mehrere Varianten haben (unterschiedliche Titel, Beschreibungen, Kategorien).
 *
 * Felder pro Bild:
 *   id        — eindeutige interne Kennung
 *   pfad      — Pfad zum Bild, relativ zum Projektordner; null für Akten ohne Bild
 *   varianten — Array möglicher Archivlesarten für dieses Bild
 *
 * Felder pro Variante:
 *   id                    — eindeutige Kennung innerhalb des Bildes
 *   archivsignatur        — optional; wird sonst automatisch aus `jahr` erzeugt
 *   kategorie             — thematisches Feld (siehe KONTROLLIERTE_WERTE.kategorien)
 *   titel                 — Anzeigetitel der Akte
 *   jahr                  — Bezugsjahr: Zahl, null (nicht datiert), „ca. 1974“, „1970er Jahre“ usw.
 *   kurzbeschreibung      — 1–3 Sätze für Vorschau und Auswahl
 *   objekttyp             — Form des Fragments
 *   herkunft              — woher das Material stammt
 *   provenienz            — Überlieferungsgeschichte (freier Text)
 *   sammlung              — zugehörige Sammlung oder Bestand
 *   institutionelleRelevanz
 *   dokumentationsgrad
 *   erhaltungszustand
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
        jahr: 1989,
        kurzbeschreibung: '[Platzhalter] Kurzbeschreibung der ersten Lesart. Hier später 1–3 Sätze eintragen.',
        objekttyp: 'Plakatrest',
        herkunft: 'private Überlieferung',
        provenienz: '[Platzhalter] Überlieferungsgeschichte — wer, wann, wie ins Archiv gelangt.',
        sammlung: '[Platzhalter] Name der Sammlung oder des Bestands',
        institutionelleRelevanz: 'mittel',
        dokumentationsgrad: 'gering',
        erhaltungszustand: 'fragmentarisch',
      },
      {
        id: 'variant-b',
        kategorie: 'Alltagskultur',
        titel: '[Platzhalter] Fotosammlung — Alltagsdokumentation',
        jahr: '1970er Jahre',
        kurzbeschreibung: '[Platzhalter] Zweite Lesart desselben Bildes mit anderem Titel und anderer Kategorie.',
        objekttyp: 'Fotokopie',
        herkunft: 'kommunale Sammlung',
        provenienz: '[Platzhalter] Alternative Provenienzangabe für dieselbe Aufnahme.',
        sammlung: '[Platzhalter] Anderer Bestand',
        institutionelleRelevanz: 'gering',
        dokumentationsgrad: 'mittel',
        erhaltungszustand: 'fragil',
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
        jahr: 1962,
        kurzbeschreibung: '[Platzhalter] Kurzbeschreibung der Festzug-Akte. Hier später 1–3 Sätze eintragen.',
        objekttyp: 'Raumfragment',
        herkunft: 'institutionelles Archiv',
        provenienz: '[Platzhalter] Überlieferungsgeschichte des Festzug-Bildes.',
        sammlung: '[Platzhalter] Sammlungsname',
        institutionelleRelevanz: 'hoch',
        dokumentationsgrad: 'mittel',
        erhaltungszustand: 'intakt',
      },
    ],
  },

  {
    id: 'bild-ohne-beispiel',
    pfad: null,
    varianten: [
      {
        id: 'variant-a',
        kategorie: 'Migration / Arbeit',
        titel: '[Platzhalter] Notizzettel aus einem Gesprächsfragment',
        jahr: 2003,
        kurzbeschreibung: '[Platzhalter] Beispielakte ohne Bild — pfad kann null sein, bis ein Foto vorliegt.',
        objekttyp: 'Notizzettel',
        herkunft: 'mündliche Überlieferung',
        provenienz: '[Platzhalter] Provenienzangabe',
        sammlung: '[Platzhalter] Sammlungsname',
        institutionelleRelevanz: 'hoch',
        dokumentationsgrad: 'mittel',
        erhaltungszustand: 'fragil',
      },
    ],
  },

];
