/**
 * data.js — Archivdaten für die Installation
 *
 * Diese Datei enthält ausschließlich Daten, keine Logik.
 *
 * So ergänzt du später eigene Inhalte:
 * 1. Neue Akte: Ein weiteres Objekt in ARCHIV_AKTEN anlegen (gleiche Felder wie unten).
 * 2. Bilder: Datei in den Ordner assests/ legen und den Pfad im Feld `bild` eintragen.
 * 3. Vokabulare: Listen in KONTROLLIERTE_WERTE bei Bedarf erweitern (optional, nur Orientierung).
 *
 * Hinweis: Generator und Darstellung nutzen diese Struktur noch nicht —
 * sie werden in einem späteren Schritt angepasst.
 */

/** Präfix für Archivsignaturen, z. B. WEZ-2026-001 */
const ARCHIV_PREFIX = 'WEZ';


/**
 * Kontrollierte Werte — Orientierung beim Befüllen neuer Akten.
 * Diese Listen sind Vorschläge; du kannst auch abweichende Werte in einzelnen Akten eintragen.
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
 * Archivakten — Hauptdatenbestand der Installation.
 *
 * Jede Akte folgt dem gleichen Schema. Neue Akten einfach ans Array anhängen;
 * die Reihenfolge bestimmt später die Anzeige.
 *
 * Felder pro Akte:
 *   id                    — eindeutige interne Kennung
 *   archivsignatur        — sichtbare Signatur, z. B. WEZ-1989-014
 *   kategorie             — thematisches Feld (siehe KONTROLLIERTE_WERTE.kategorien)
 *   titel                 — Anzeigetitel der Akte
 *   jahr                  — Bezugsjahr (Zahl oder null)
 *   bild                  — Pfad zum Bild, relativ zum Projektordner
 *   kurzbeschreibung      — 1–3 Sätze für Vorschau und Auswahl
 *   objekttyp             — Form des Fragments
 *   herkunft              — woher das Material stammt
 *   provenienz            — Überlieferungsgeschichte (freier Text)
 *   sammlung              — zugehörige Sammlung oder Bestand
 *   institutionelleRelevanz
 *   dokumentationsgrad
 *   erhaltungszustand
 */
const ARCHIV_AKTEN = [

  {
    id: 'akte-beispiel-001',
    archivsignatur: 'WEZ-1989-014',
    kategorie: 'Protest',
    titel: '[Platzhalter] Fragment eines Plakatrests',
    jahr: 1989,
    bild: 'assests/fotosammlung_01.jpg',
    kurzbeschreibung: '[Platzhalter] Kurzbeschreibung der ersten Beispielakte. Hier später 1–3 Sätze eintragen.',
    objekttyp: 'Plakatrest',
    herkunft: 'private Überlieferung',
    provenienz: '[Platzhalter] Überlieferungsgeschichte — wer, wann, wie ins Archiv gelangt.',
    sammlung: '[Platzhalter] Name der Sammlung oder des Bestands',
    institutionelleRelevanz: 'mittel',
    dokumentationsgrad: 'gering',
    erhaltungszustand: 'fragmentarisch',
  },

  {
    id: 'akte-beispiel-002',
    archivsignatur: 'WEZ-2003-087',
    kategorie: 'Migration / Arbeit',
    titel: '[Platzhalter] Notizzettel aus einem Gesprächsfragment',
    jahr: 2003,
    bild: null,
    kurzbeschreibung: '[Platzhalter] Zweite Beispielakte ohne Bild — `bild` kann null sein, bis ein Foto vorliegt.',
    objekttyp: 'Notizzettel',
    herkunft: 'mündliche Überlieferung',
    provenienz: '[Platzhalter] Provenienzangabe',
    sammlung: '[Platzhalter] Sammlungsname',
    institutionelleRelevanz: 'hoch',
    dokumentationsgrad: 'mittel',
    erhaltungszustand: 'fragil',
  },

  {
    id: 'akte-beispiel-003',
    archivsignatur: 'WEZ-2018-203',
    kategorie: 'Digitale Spuren',
    titel: '[Platzhalter] Beschädigte Datei — Tonspur',
    jahr: 2018,
    bild: null,
    kurzbeschreibung: '[Platzhalter] Dritte Beispielakte. Zeigt, wie weitere Akten ergänzt werden können.',
    objekttyp: 'beschädigte Datei',
    herkunft: 'digitaler Bestand',
    provenienz: '[Platzhalter] Digitale Herkunft und Übernahme ins Archiv',
    sammlung: '[Platzhalter] Digitaler Bestand / Sammlung',
    institutionelleRelevanz: 'gering',
    dokumentationsgrad: 'hoch',
    erhaltungszustand: 'beschädigt',
  },

];
