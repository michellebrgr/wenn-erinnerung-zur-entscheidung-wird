/**
 * generator.js — Wählt Archivakten aus dem Datenbestand
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt ARCHIV_BILDER und ARCHIV_AKTENARTEN aus data.js.
 */

/** Untergrenze für zufällige Jahresangaben */
const DATIERUNG_JAHR_MIN = 1845;

/** Obergrenze für zufällige Jahresangaben */
const DATIERUNG_JAHR_MAX = 2020;

/**
 * Erzeugt eine dreistellige Zufallszahl für die Archivsignatur.
 * @returns {string}
 */
function randomArchivSuffix() {
  return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

/**
 * Leitet den Jahres- bzw. Datierungsanteil der Archivsignatur aus `jahr` ab.
 * @param {number|string|null} jahr
 * @returns {string}
 */
function jahrToSignaturSegment(jahr) {
  if (jahr === null || jahr === undefined || jahr === '') {
    return 'UND';
  }

  if (typeof jahr === 'number' && !isNaN(jahr)) {
    return String(jahr);
  }

  const s = String(jahr).trim();

  const decadeMatch = s.match(/^(\d{3})X$/i) || s.match(/^(\d{3})\d*er(\s+Jahre)?$/i);
  if (decadeMatch) {
    return decadeMatch[1] + 'X';
  }

  const caMatch = s.match(/^CA(\d{4})$/i) || s.match(/^ca\.?\s*(\d{4})$/i) || s.match(/^circa\s*(\d{4})$/i);
  if (caMatch) {
    return 'CA' + caMatch[1];
  }

  if (/^\d{4}$/.test(s)) {
    return s;
  }

  if (/^(undatiert|nicht\s+datiert|n\.?\s*d\.?|undated)$/i.test(s)) {
    return 'UND';
  }

  return 'UND';
}

/**
 * Erzeugt eine Archivsignatur aus Jahr/Datierung und Zufallsnummer.
 * Beispiele: WEZ-1974-018, WEZ-CA1974-018, WEZ-197X-018, WEZ-UND-018
 * @param {number|string|null} jahr
 * @returns {string}
 */
function generateArchivsignatur(jahr) {
  const prefix = typeof ARCHIV_PREFIX !== 'undefined' ? ARCHIV_PREFIX : 'AK';
  return prefix + '-' + jahrToSignaturSegment(jahr) + '-' + randomArchivSuffix();
}

/**
 * Zieht ein zufälliges Jahr im konfigurierten Bereich.
 * @returns {number}
 */
function randomJahrZahl() {
  return DATIERUNG_JAHR_MIN + Math.floor(Math.random() * (DATIERUNG_JAHR_MAX - DATIERUNG_JAHR_MIN + 1));
}

/**
 * Zieht ein zufälliges Jahrzehnt (z. B. 1970 für „1970er Jahre“).
 * @returns {number}
 */
function randomJahrzehnt() {
  const minDecade = Math.floor(DATIERUNG_JAHR_MIN / 10) * 10;
  const maxDecade = Math.floor(DATIERUNG_JAHR_MAX / 10) * 10;
  const decadeCount = (maxDecade - minDecade) / 10 + 1;
  return minDecade + Math.floor(Math.random() * decadeCount) * 10;
}

/**
 * Erzeugt eine zufällige Datierungsangabe für eine Akte.
 * Mögliche Formen: genaues Jahr, „ca. …“, Jahrzehnt oder „nicht datiert“.
 * @returns {number|string}
 */
function generateJahr() {
  const roll = Math.random();

  if (roll < 0.25) {
    return 'nicht datiert';
  }

  if (roll < 0.5) {
    return randomJahrZahl();
  }

  if (roll < 0.75) {
    return 'ca. ' + randomJahrZahl();
  }

  return randomJahrzehnt() + 'er Jahre';
}

/**
 * Liefert die Kontrollwerte oder ein leeres Objekt.
 * @returns {Object}
 */
function getKontrollierteWerte() {
  return typeof KONTROLLIERTE_WERTE !== 'undefined' ? KONTROLLIERTE_WERTE : {};
}

function splitLoc(item) {
  if (item == null || item === '') {
    return { de: item == null ? null : item, en: item == null ? null : item };
  }
  if (typeof isLocalizedEntry === 'function' && isLocalizedEntry(item)) {
    return { de: item.de, en: item.en || item.de };
  }
  return { de: item, en: lookupEn(item) };
}

function localizeFromValue(list, value) {
  if (value == null || value === '') {
    return splitLoc(value);
  }
  if (typeof isLocalizedEntry === 'function' && isLocalizedEntry(value)) {
    return { de: value.de, en: value.en || value.de };
  }
  const str = String(value);
  const entries = list || [];
  for (let i = 0; i < entries.length; i++) {
    if (textDe(entries[i]) === str) {
      return splitLoc(entries[i]);
    }
  }
  return { de: str, en: lookupEn(str) };
}

var EN_LOOKUP_CACHE = null;

function addLookupEntry(map, item) {
  if (typeof isLocalizedEntry === 'function' && isLocalizedEntry(item) && item.de) {
    map[item.de] = item.en || item.de;
  }
}

function walkLookupList(map, list) {
  (list || []).forEach(function (item) {
    addLookupEntry(map, item);
  });
}

function getEnLookup() {
  if (EN_LOOKUP_CACHE) {
    return EN_LOOKUP_CACHE;
  }

  const map = {
    'nicht angegeben': 'not specified',
    'Unbekannt': 'Unknown',
    'unbekannt': 'unknown',
    'undatiert': 'undated',
    'nicht datiert': 'undated',
    'nicht überliefert': 'not transmitted',
    'Nicht eindeutig überliefert': 'Not clearly transmitted',
    'hoch': 'high',
    'mittel': 'medium',
    'gering': 'low',
    'Aufnahme empfohlen': 'Admission recommended',
    'Aufnahme prüfenswert': 'Admission worth considering',
    'Aufnahme nicht priorisiert': 'Admission not prioritised',
    'gut erhalten': 'well preserved',
    'Fotografie': 'Photograph',
    'von regionaler Bedeutung': 'of regional significance',
    'von lokaler Bedeutung': 'of local significance',
    'von wissenschaftlicher Bedeutung': 'of scholarly significance',
    'von gesellschaftlicher Bedeutung': 'of societal significance',
    'von überregionaler Bedeutung': 'of supra-regional significance',
    'von medienhistorischer Bedeutung': 'of media-historical significance',
    'von sammlungsgeschichtlicher Bedeutung': 'of collection-historical significance',
  };

  const listen = getKontrollierteWerte();
  walkLookupList(map, listen.kategorien);
  walkLookupList(map, listen.provenienz);
  walkLookupList(map, listen.dokumentationsgrad);
  walkLookupList(map, listen.titelstrukturen);
  walkLookupList(map, listen.kontextSatzanfaenge);
  walkLookupList(map, listen.kurzbeschreibungStrukturen);

  const kataloge = listen.kategorienKataloge || {};
  Object.keys(kataloge).forEach(function (key) {
    const kat = kataloge[key] || {};
    walkLookupList(map, kat.sammlungen);
    walkLookupList(map, kat.objekttypen);
    walkLookupList(map, kat.motive);
    walkLookupList(map, kat.orte);
    walkLookupList(map, kat.erhaltungszustaende);
    walkLookupList(map, kat.fehlendeInformationen);
    walkLookupList(map, kat.materialhinweise);
    walkLookupList(map, kat.dokumentationsfragmente);
  });

  getArchivAktenarten().forEach(function (art) {
    addLookupEntry(map, art.label);
    walkLookupList(map, art.vermerke);
  });

  EN_LOOKUP_CACHE = map;
  return map;
}

function lookupEn(value) {
  if (value == null || value === '') {
    return value;
  }
  if (typeof isLocalizedEntry === 'function' && isLocalizedEntry(value)) {
    return value.en || value.de;
  }
  const str = String(value);
  const mapped = getEnLookup()[str];
  if (mapped != null) {
    return mapped;
  }
  return str;
}

function translateJahr(jahr) {
  if (jahr == null || jahr === '') {
    return jahr;
  }
  if (typeof jahr === 'number' && !isNaN(jahr)) {
    return jahr;
  }
  const s = String(jahr).trim();
  const mapped = getEnLookup()[s];
  if (mapped != null) {
    return mapped;
  }
  if (/^(undatiert|nicht\s+datiert)$/i.test(s)) {
    return 'undated';
  }
  const ca = s.match(/^ca\.\s*(.+)$/i);
  if (ca) {
    return 'c. ' + ca[1];
  }
  const decade = s.match(/^(\d{3,4})er Jahre$/i);
  if (decade) {
    return decade[1] + 's';
  }
  const undatedNote = s.match(/^undatiert,\s*(.+)$/i);
  if (undatedNote) {
    return 'undated, ' + undatedNote[1];
  }
  const undatedSemi = s.match(/^undatiert;\s*(.+)$/i);
  if (undatedSemi) {
    return 'undated; ' + undatedSemi[1];
  }
  return lookupEn(s);
}

function englishBewertung(bewertung) {
  bewertung = bewertung || {};
  const stufeEn = lookupEn(bewertung.stufe);
  const hinweisEn = lookupEn(bewertung.aufnahmeempfehlung);
  return {
    stufe: stufeEn,
    aufnahmeempfehlung: hinweisEn,
    bewertungskriterien: [
      { label: 'Institutional relevance', text: stufeEn },
      { label: 'Admission recommendation', text: hinweisEn },
    ],
  };
}

function buildTranslationsEn(akte, extras) {
  extras = extras || {};
  const curated = extras.curatedEn || {};
  const generated = extras.generatedEn || {};
  const bewertungEn = englishBewertung({
    stufe: akte.institutionelleRelevanz,
    aufnahmeempfehlung: akte.aufnahmeempfehlung,
  });

  function pick(key) {
    if (curated[key] != null) {
      return curated[key];
    }
    if (generated[key] != null) {
      return generated[key];
    }
    if (key === 'jahr') {
      return translateJahr(akte.jahr);
    }
    if (akte[key] == null || akte[key] === '') {
      return akte[key];
    }
    return lookupEn(akte[key]);
  }

  return {
    kategorie: pick('kategorie'),
    titel: pick('titel'),
    jahr: pick('jahr'),
    kurzbeschreibung: pick('kurzbeschreibung'),
    kontextbeschreibung: pick('kontextbeschreibung'),
    objekttyp: pick('objekttyp'),
    motiv: pick('motiv'),
    herkunft: pick('herkunft'),
    provenienz: pick('provenienz'),
    sammlung: pick('sammlung'),
    materialhinweis: pick('materialhinweis'),
    erhaltungszustand: pick('erhaltungszustand'),
    dokumentationsgrad: pick('dokumentationsgrad'),
    fehlendeInformation: pick('fehlendeInformation'),
    aktenartLabel: pick('aktenartLabel'),
    aktenvermerk: pick('aktenvermerk'),
    fragmentText: pick('fragmentText'),
    relevanzBegruendung: pick('relevanzBegruendung'),
    institutionelleRelevanz: bewertungEn.stufe,
    aufnahmeempfehlung: bewertungEn.aufnahmeempfehlung,
    bewertungskriterien: bewertungEn.bewertungskriterien,
  };
}

/**
 * Wählt zufällig einen Eintrag aus einer Liste in KONTROLLIERTE_WERTE.
 * @param {string} listeKey - Schlüssel in KONTROLLIERTE_WERTE (z. B. „provenienz“)
 * @returns {string|null}
 */
function pickFromListe(listeKey) {
  const listen = getKontrollierteWerte();
  return textDe(pickRandomOne(listen[listeKey] || []));
}

/**
 * Wählt eine gültige Kategorie — aus der Variante oder zufällig aus dem Katalog.
 * @param {Object} [variante]
 * @returns {string|null}
 */
function resolveKategorie(variante) {
  variante = variante || {};
  const listen = getKontrollierteWerte();
  const kataloge = listen.kategorienKataloge || {};

  if (variante.kategorie && kataloge[variante.kategorie]) {
    return variante.kategorie;
  }

  return textDe(pickRandomOne(listen.kategorien || Object.keys(kataloge)));
}

/**
 * Liefert den Kategoriekatalog für eine Kategorie.
 * @param {string} kategorie
 * @returns {Object}
 */
function getKategorieKatalog(kategorie) {
  const listen = getKontrollierteWerte();
  const kataloge = listen.kategorienKataloge || {};
  return kataloge[kategorie] || {};
}

/**
 * Ersetzt Platzhalter in einer Vorlage durch Bausteinwerte.
 * @param {string} template
 * @param {Object} bausteine
 * @returns {string}
 */
function fillTemplate(template, bausteine) {
  return String(template || '')
    .replace(/\{objekttyp\}/g, bausteine.objekttyp || '')
    .replace(/\{motiv\}/g, bausteine.motiv || '')
    .replace(/\{ort\}/g, bausteine.ort || '');
}

/**
 * Großschreibung des ersten Zeichens.
 * @param {string} text
 * @returns {string}
 */
function capitalizeFirst(text) {
  if (!text) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function normalizeDokumentationsgrad(value) {
  if (value == null || value === '') {
    return value == null ? null : value;
  }
  const raw = String(value).trim().toLowerCase();
  if (raw === 'teilweise' || raw === 'teilweise dokumentiert') {
    return 'teilweise dokumentiert';
  }
  if (raw === 'fragmentarisch' || raw === 'spärlich' || raw === 'spärlich dokumentiert') {
    return 'spärlich dokumentiert';
  }
  if (raw === 'weitgehend' || raw === 'gut' || raw === 'gut dokumentiert') {
    return 'gut dokumentiert';
  }
  if (raw === 'undokumentiert') {
    return 'undokumentiert';
  }
  return String(value);
}

function normalizeErhaltungszustand(value) {
  if (value == null || value === '') {
    return value == null ? null : value;
  }
  const raw = String(value).trim().toLowerCase();
  if (raw === 'gut' || raw === 'gut erhalten') {
    return 'gut erhalten';
  }
  if (
    raw === 'altersbedingt' ||
    raw === 'gut bis altersbedingt' ||
    raw === 'altersbedingt, gut' ||
    raw.indexOf('reproduktion') !== -1
  ) {
    return 'mit leichten Gebrauchsspuren';
  }
  if (raw === 'beschädigt' || raw === 'teilweise beschädigt') {
    return 'teilweise beschädigt';
  }
  if (raw.indexOf('stark beschädigt') !== -1) {
    return 'an mehreren Stellen beschädigt';
  }
  if (raw.indexOf('lesbarkeit') !== -1) {
    return 'gut erhalten';
  }
  return String(value);
}

function normalizeSammlung(value) {
  if (value == null || value === '') {
    return value == null ? null : value;
  }
  if (value === 'Familie und private Fotografie') {
    return 'Familien und private Fotografien';
  }
  if (value === 'Materielle und schriftliche Überlieferung') {
    return 'Materielle und schriftliche Überlieferungen';
  }
  return value;
}

function looksDigital(text) {
  return /digital|scan|datei|datensatz|bildschirm|elektron|pixel|online|pdf|diskette|speicher/i.test(String(textDe(text) || ''));
}

function looksPhoto(text) {
  return /fotografie|fotopapier|fotoabzug|farbdia|glasdia|\bdias?\b|album|negativ|cyanotyp|bilddokumentation/i.test(String(textDe(text) || ''));
}

function looksAnalogOnlyProvenienz(text) {
  const t = String(text || '').toLowerCase();
  if (looksDigital(t)) {
    return false;
  }
  return /private nachlässe|familienkreis|mündliche erzählung|fund im rahmen/.test(t);
}

function filterOrAll(list, predicate) {
  if (!list || list.length === 0) {
    return [];
  }
  const filtered = list.filter(predicate);
  return filtered.length > 0 ? filtered : list;
}

function filterMaterialhinweise(list, objekttyp) {
  if (looksPhoto(objekttyp)) {
    return filterOrAll(list, function (item) {
      const value = textDe(item);
      return looksPhoto(value) || looksDigital(value) || /papier|karton|abzug/i.test(value);
    });
  }
  if (looksDigital(objekttyp)) {
    return filterOrAll(list, function (item) {
      return looksDigital(textDe(item));
    });
  }
  if (/transparent/i.test(textDe(objekttyp) || '')) {
    return filterOrAll(list, function (item) {
      return /stoff|textil|karton|papier/i.test(textDe(item));
    });
  }
  if (/hinweisschild/i.test(textDe(objekttyp) || '')) {
    return filterOrAll(list, function (item) {
      return /schild|kunststoff|karton|papier/i.test(textDe(item));
    });
  }
  return list || [];
}

function filterErhaltungszustaende(list, objekttyp, materialhinweis) {
  const digital = looksDigital(objekttyp) || looksDigital(materialhinweis);
  const photo = looksPhoto(objekttyp) || looksPhoto(materialhinweis);

  return filterOrAll(list, function (item) {
    const state = String(textDe(item) || '').toLowerCase();
    if (digital) {
      return /digital|kopie|rekonstruiert|archiviert|konserviert|digitalisiert/.test(state);
    }
    if (photo && /verwittert|kunststoff|holz|metall|stoff/.test(state)) {
      return false;
    }
    if (!digital && /digital rekonstruiert|digitalisiert|digital archiviert|digital konserviert/.test(state)) {
      return looksDigital(materialhinweis);
    }
    return true;
  });
}

function filterFehlendeInformationen(list, objekttyp) {
  const photo = looksPhoto(objekttyp);
  return filterOrAll(list, function (item) {
    const info = String(textDe(item) || '').toLowerCase();
    const photoOnly = /abgebildet|aufnahmeort|aufnahmezeitpunkt|urheber\*in der aufnahme/.test(info);
    if (photoOnly && !photo) {
      return false;
    }
    return true;
  });
}

function filterProvenienz(list, objekttyp, materialhinweis) {
  const digital = looksDigital(objekttyp) || looksDigital(materialhinweis);
  if (!digital) {
    return list || [];
  }
  return filterOrAll(list, function (item) {
    return !looksAnalogOnlyProvenienz(textDe(item));
  });
}

/**
 * Zieht kohärente Bausteine aus dem Katalog einer Kategorie.
 * Offensichtliche Widersprüche zwischen Objekttyp, Material und Zustand werden gefiltert.
 * @param {string} kategorie
 * @param {Object} [options] - Bereits gesetzte Feldwerte
 * @returns {Object}
 */
function pickKategorieBausteine(kategorie, options) {
  options = options || {};
  const katalog = getKategorieKatalog(kategorie);
  const objekttypLoc = options.objekttyp !== undefined
    ? localizeFromValue(katalog.objekttypen, options.objekttyp)
    : splitLoc(pickRandomOne(katalog.objekttypen || []));
  const materialLoc = options.materialhinweis !== undefined
    ? localizeFromValue(katalog.materialhinweise, options.materialhinweis)
    : splitLoc(pickRandomOne(filterMaterialhinweise(katalog.materialhinweise || [], objekttypLoc.de)));
  const motivLoc = options.motiv !== undefined
    ? localizeFromValue(katalog.motive, options.motiv)
    : splitLoc(pickRandomOne(katalog.motive || []));
  const ortLoc = options.ort !== undefined
    ? localizeFromValue(katalog.orte, options.ort)
    : splitLoc(pickRandomOne(katalog.orte || []));
  const zustandLoc = options.erhaltungszustand !== undefined
    ? localizeFromValue(katalog.erhaltungszustaende, normalizeErhaltungszustand(options.erhaltungszustand))
    : splitLoc(pickRandomOne(filterErhaltungszustaende(katalog.erhaltungszustaende || [], objekttypLoc.de, materialLoc.de)));
  const fehlendLoc = options.fehlendeInformation !== undefined
    ? localizeFromValue(katalog.fehlendeInformationen, options.fehlendeInformation)
    : splitLoc(pickRandomOne(filterFehlendeInformationen(katalog.fehlendeInformationen || [], objekttypLoc.de)));
  const sammlungLoc = options.sammlung !== undefined
    ? localizeFromValue(katalog.sammlungen, normalizeSammlung(options.sammlung))
    : splitLoc(pickRandomOne(katalog.sammlungen || []));

  return {
    kategorie: kategorie,
    objekttyp: objekttypLoc.de,
    motiv: motivLoc.de,
    ort: ortLoc.de,
    erhaltungszustand: zustandLoc.de,
    fehlendeInformation: fehlendLoc.de,
    materialhinweis: materialLoc.de,
    sammlung: sammlungLoc.de,
    en: {
      kategorie: lookupEn(kategorie),
      objekttyp: objekttypLoc.en,
      motiv: motivLoc.en,
      ort: ortLoc.en,
      erhaltungszustand: zustandLoc.en,
      fehlendeInformation: fehlendLoc.en,
      materialhinweis: materialLoc.en,
      sammlung: sammlungLoc.en,
    },
  };
}

/**
 * Erzeugt einen Aktentitel aus Titelstrukturen und Bausteinen.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateAktenTitel(bausteine, bausteineEn) {
  const listen = getKontrollierteWerte();
  const struktur = pickRandomOne(listen.titelstrukturen || []);
  if (!struktur || !bausteine.objekttyp) {
    return { de: null, en: null };
  }
  return {
    de: capitalizeFirst(fillTemplate(textDe(struktur), bausteine)),
    en: capitalizeFirst(fillTemplate(textEn(struktur), bausteineEn || {})),
  };
}

/**
 * Erzeugt eine Kontextbeschreibung aus Satzanfang, Motiv und optional fehlender Information.
 * Höchstens zwei kurze Sätze.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateKontextbeschreibung(bausteine, bausteineEn) {
  const listen = getKontrollierteWerte();
  const anfang = pickRandomOne(listen.kontextSatzanfaenge || []);
  const motiv = bausteine.motiv;
  const en = bausteineEn || {};

  if (!anfang || !motiv) {
    return { de: null, en: null };
  }

  let deText = textDe(anfang) + ' ' + motiv + '.';
  let enText = textEn(anfang) + ' ' + (en.motiv || lookupEn(motiv)) + '.';

  if (bausteine.fehlendeInformation && Math.random() < 0.7) {
    deText += ' ' + capitalizeFirst(bausteine.fehlendeInformation) + '.';
    enText += ' ' + capitalizeFirst(en.fehlendeInformation || lookupEn(bausteine.fehlendeInformation)) + '.';
  }

  return { de: deText, en: enText };
}

/**
 * Erzeugt eine Kurzbeschreibung für den Erinnerungsraum.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateKurzbeschreibung(bausteine, bausteineEn) {
  const listen = getKontrollierteWerte();
  const struktur = pickRandomOne(listen.kurzbeschreibungStrukturen || []);
  if (!struktur || !bausteine.motiv) {
    return { de: null, en: null };
  }
  return {
    de: fillTemplate(textDe(struktur), bausteine),
    en: fillTemplate(textEn(struktur), bausteineEn || {}),
  };
}

/**
 * Erzeugt Titel, Kontext- und Kurzbeschreibung für bildlose Akten.
 * @param {Object} bausteine
 * @returns {{ titel: string|null, kontextbeschreibung: string|null, kurzbeschreibung: string|null }}
 */
function generateAktenTexte(bausteine) {
  const en = bausteine.en || {};
  const titel = generateAktenTitel(bausteine, en);
  const kontext = generateKontextbeschreibung(bausteine, en);
  const kurz = generateKurzbeschreibung(bausteine, en);
  return {
    titel: titel.de,
    kontextbeschreibung: kontext.de,
    kurzbeschreibung: kurz.de,
    en: {
      titel: titel.en,
      kontextbeschreibung: kontext.en,
      kurzbeschreibung: kurz.en,
    },
  };
}

/**
 * Nimmt options-Wert, sonst Varianten-Wert, sonst Fallback.
 * @param {Object} options
 * @param {Object} variante
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function pickCuratedOrFallback(options, variante, key, fallback) {
  if (options && options[key] !== undefined) {
    return options[key];
  }
  if (variante && variante[key] !== undefined) {
    return variante[key];
  }
  return typeof fallback === 'function' ? fallback() : fallback;
}

/**
 * Erzeugt kohärente Metadaten für eine Akte aus dem Kategoriekatalog.
 * Kuratierte Variantenfelder (Bildakten) haben Vorrang vor Zufallsauswahl.
 * @param {Object} variante - Variante mit kategorie und optionalen Metadaten
 * @param {Object} [options] - Bereits gespeicherte Feldwerte
 * @returns {{ kategorie: string|null, objekttyp: string|null, herkunft: string|null, provenienz: string|null, sammlung: string|null, erhaltungszustand: string|null, dokumentationsgrad: string|null, motiv: string|null, ort: string|null, fehlendeInformation: string|null, materialhinweis: string|null, institutionelleRelevanz: string|null }}
 */
function generateAktenMetadaten(variante, options) {
  options = options || {};
  variante = variante || {};

  const kategorie = options.kategorie !== undefined
    ? options.kategorie
    : resolveKategorie(variante);

  const curatedSammlung = pickCuratedOrFallback(options, variante, 'sammlung', undefined);
  const curatedZustand = pickCuratedOrFallback(options, variante, 'erhaltungszustand', undefined);
  const curatedOverrides = {
    objekttyp: pickCuratedOrFallback(options, variante, 'objekttyp', undefined),
    sammlung: curatedSammlung !== undefined ? normalizeSammlung(curatedSammlung) : undefined,
    erhaltungszustand: curatedZustand !== undefined ? normalizeErhaltungszustand(curatedZustand) : undefined,
    materialhinweis: pickCuratedOrFallback(options, variante, 'materialhinweis', undefined),
    fehlendeInformation: pickCuratedOrFallback(options, variante, 'fehlendeInformation', undefined),
  };

  const bausteine = pickKategorieBausteine(kategorie, {
    objekttyp: curatedOverrides.objekttyp,
    sammlung: curatedOverrides.sammlung,
    erhaltungszustand: curatedOverrides.erhaltungszustand,
    materialhinweis: curatedOverrides.materialhinweis,
    fehlendeInformation: curatedOverrides.fehlendeInformation,
  });

  const provenienzListen = getKontrollierteWerte().provenienz || [];
  const provenienzLoc = (function () {
    const curated = pickCuratedOrFallback(options, variante, 'provenienz', undefined);
    if (curated !== undefined) {
      return localizeFromValue(provenienzListen, curated);
    }
    return splitLoc(pickRandomOne(filterProvenienz(provenienzListen, bausteine.objekttyp, bausteine.materialhinweis)));
  })();
  const herkunftLoc = (function () {
    const curated = pickCuratedOrFallback(options, variante, 'herkunft', undefined);
    if (curated !== undefined) {
      return { de: curated, en: lookupEn(curated) };
    }
    return bausteine.ort
      ? { de: capitalizeFirst(bausteine.ort), en: capitalizeFirst(bausteine.en && bausteine.en.ort ? bausteine.en.ort : lookupEn(bausteine.ort)) }
      : { de: null, en: null };
  })();
  const dokumentationsgradLoc = (function () {
    const curated = pickCuratedOrFallback(options, variante, 'dokumentationsgrad', undefined);
    if (curated !== undefined) {
      return localizeFromValue(getKontrollierteWerte().dokumentationsgrad, normalizeDokumentationsgrad(curated));
    }
    return localizeFromValue(getKontrollierteWerte().dokumentationsgrad, pickFromListe('dokumentationsgrad'));
  })();
  const relevanzBegruendungRaw = pickCuratedOrFallback(options, variante, 'relevanzBegruendung', undefined);
  const legacyRelevanz = pickCuratedOrFallback(options, variante, 'institutionelleRelevanz', undefined);
  const relevanzBegruendung = relevanzBegruendungRaw
    || (legacyRelevanz && !/^(hoch|mittel|gering)$/i.test(String(legacyRelevanz)) ? legacyRelevanz : null);

  const bausteineEn = bausteine.en || {};

  return {
    kategorie: kategorie,
    objekttyp: bausteine.objekttyp,
    herkunft: herkunftLoc.de,
    provenienz: provenienzLoc.de,
    sammlung: bausteine.sammlung,
    erhaltungszustand: bausteine.erhaltungszustand,
    dokumentationsgrad: dokumentationsgradLoc.de,
    motiv: bausteine.motiv,
    ort: bausteine.ort,
    fehlendeInformation: bausteine.fehlendeInformation,
    materialhinweis: bausteine.materialhinweis,
    relevanzBegruendung: relevanzBegruendung || null,
    en: Object.assign({}, bausteineEn, {
      herkunft: herkunftLoc.en,
      provenienz: provenienzLoc.en,
      dokumentationsgrad: dokumentationsgradLoc.en,
      relevanzBegruendung: relevanzBegruendung ? lookupEn(relevanzBegruendung) : null,
    }),
  };
}

function scorePassung(source) {
  source = source || {};
  const haystack = [
    source.provenienz,
    source.sammlung,
    source.objekttyp,
    source.herkunft,
  ].filter(Boolean).join(' ').toLowerCase();

  let score = 1;
  if (/institutionell|kommunal|staatlich|archivbestand|behörd|museal|registratur|verwaltung|wetterdienst|gesundheitseinrichtung/.test(haystack)) {
    score = 2;
  } else if (/unsortiert|ungeordnet|fund im rahmen|mündliche erzählung|nicht dokumentiert|unbekannt/.test(haystack)) {
    score = 0;
  } else if (/nachlass|familienkreis|schenkung|privat/.test(haystack)) {
    score = 0;
  }

  if (/verwaltung und infrastruktur|institutionelle erfassung|wissensarbeit|öffentliche einrichtungen/.test(haystack)) {
    score = Math.min(2, score + 1);
  } else if (/familien und private|wohnen, freizeit|medien und alltagsobjekte/.test(haystack)) {
    score = Math.max(0, score - 1);
  }

  return score;
}

function scoreDokumentation(dokumentationsgrad) {
  const value = normalizeDokumentationsgrad(dokumentationsgrad) || '';
  if (value === 'gut dokumentiert') {
    return 2;
  }
  if (value === 'teilweise dokumentiert') {
    return 1;
  }
  return 0;
}

function scoreBewahrungsbedarf(erhaltungszustand) {
  const state = String(erhaltungszustand || '').toLowerCase();
  if (/fragmentarisch|beschädigt|verwittert|eingerissen|unleserlich|unvollständig|ausschnittsweise|übermalt|stark vergilbt/.test(state)) {
    return 2;
  }
  if (/gebrauchsspuren|knick|verblasst|gefaltet|altersbedingt|rändern|klebe|vergilbt|kopie/.test(state)) {
    return 1;
  }
  return 0;
}

function generateInstitutionelleBewertung(source) {
  source = source || {};
  const total = scorePassung(source) + scoreDokumentation(source.dokumentationsgrad) + scoreBewahrungsbedarf(source.erhaltungszustand);
  let stufe = 'mittel';
  if (total <= 2) {
    stufe = 'gering';
  } else if (total >= 5) {
    stufe = 'hoch';
  }

  const hinweise = {
    hoch: 'Aufnahme empfohlen',
    mittel: 'Aufnahme prüfenswert',
    gering: 'Aufnahme nicht priorisiert',
  };

  return {
    stufe: stufe,
    aufnahmeempfehlung: hinweise[stufe],
  };
}

function generateBewertungskriterien(options) {
  options = options || {};
  const bewertung = generateInstitutionelleBewertung(options);
  return [
    { label: 'Institutionelle Relevanz', text: bewertung.stufe },
    { label: 'Aufnahmeempfehlung', text: bewertung.aufnahmeempfehlung },
  ];
}

/**
 * Wählt zufällig count Elemente aus einem Array (ohne Duplikate).
 * @param {Array} arr - Quell-Array
 * @param {number} count - Anzahl der Elemente
 * @returns {Array} Zufällige Auswahl
 */
function pickRandom(arr, count) {
  const copy = [...arr];
  const result = [];

  const limit = Math.min(count, copy.length);
  for (let i = 0; i < limit; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

/**
 * Findet Bild und Variante in ARCHIV_BILDER anhand gespeicherter Referenzen.
 * @param {string} bildId
 * @param {string} varianteId
 * @returns {{ bild: Object|null, variante: Object|null }}
 */
function findBildAndVariante(bildId, varianteId) {
  if (!Array.isArray(ARCHIV_BILDER) || !bildId || !varianteId) {
    return { bild: null, variante: null };
  }

  const bild = ARCHIV_BILDER.find(function (b) {
    return b.id === bildId;
  });

  if (!bild || !Array.isArray(bild.varianten)) {
    return { bild: null, variante: null };
  }

  const variante = bild.varianten.find(function (v) {
    return v.id === varianteId;
  });

  return { bild: bild, variante: variante || null };
}

/**
 * Liefert den Katalog der Aktenarten für bildlose Akten.
 * @returns {Array<{key: string, label: string, gewicht: number}>}
 */
function getArchivAktenarten() {
  return Array.isArray(ARCHIV_AKTENARTEN) ? ARCHIV_AKTENARTEN : [];
}

/**
 * Prüft, ob ein digitaler Datensatz zur Akte inhaltlich passt.
 * @param {Object} [source] - Meta- oder Akte-Objekt
 * @returns {boolean}
 */
function isPlausibleDigitalerDatensatz(source) {
  source = source || {};
  const haystack = [
    source.objekttyp,
    source.materialhinweis,
    source.sammlung,
    source.titel,
    source.kurzbeschreibung,
    source.kontextbeschreibung,
  ].filter(Boolean).join(' ');

  return looksDigital(haystack);
}

/**
 * Aktenarten, die für die gegebene Akte wählbar sind.
 * @param {Object} [source]
 * @returns {Array}
 */
function getEligibleAktenarten(source) {
  return getArchivAktenarten().filter(function (art) {
    if (art.key === 'digitaler-datensatz') {
      return isPlausibleDigitalerDatensatz(source);
    }
    return true;
  });
}

/**
 * Prüft, ob ein Schlüssel eine bekannte Aktenart ist.
 * @param {string|null|undefined} key
 * @returns {boolean}
 */
function canonicalAktenartKey(key) {
  if (key === 'dokumentationsfragment') {
    return 'dokumentfragment';
  }
  return key || null;
}

function isValidAktenart(key) {
  const canonical = canonicalAktenartKey(key);
  if (!canonical) {
    return false;
  }
  return getArchivAktenarten().some(function (art) {
    return art.key === canonical;
  });
}

function getAktenartVermerke(art) {
  if (!art) {
    return [];
  }
  if (Array.isArray(art.vermerke) && art.vermerke.length > 0) {
    return art.vermerke;
  }
  if (art.vermerk) {
    return [art.vermerk];
  }
  return [];
}

function pickAktenvermerk(aktenart, akteId, stored) {
  if (stored) {
    return textDe(stored);
  }
  const canonical = canonicalAktenartKey(aktenart);
  const art = getArchivAktenarten().find(function (entry) {
    return entry.key === canonical;
  });
  const vermerke = getAktenartVermerke(art);
  if (vermerke.length === 0) {
    return null;
  }
  const item = akteId
    ? vermerke[hashString(akteId + ':vermerk') % vermerke.length]
    : pickRandomOne(vermerke);
  return textDe(item);
}

function pickAktenvermerkEn(aktenart, akteId, storedDe) {
  const canonical = canonicalAktenartKey(aktenart);
  const art = getArchivAktenarten().find(function (entry) {
    return entry.key === canonical;
  });
  const vermerke = getAktenartVermerke(art);
  if (storedDe) {
    for (let i = 0; i < vermerke.length; i++) {
      if (textDe(vermerke[i]) === storedDe) {
        return textEn(vermerke[i]);
      }
    }
    return lookupEn(storedDe);
  }
  if (vermerke.length === 0) {
    return null;
  }
  const item = akteId
    ? vermerke[hashString(akteId + ':vermerk') % vermerke.length]
    : pickRandomOne(vermerke);
  return textEn(item);
}

function pickDokumentationsfragment(kategorie, akteId, stored) {
  if (stored) {
    return textDe(stored);
  }
  const katalog = getKategorieKatalog(kategorie);
  const pool = katalog.dokumentationsfragmente || [];
  if (pool.length === 0) {
    return null;
  }
  const item = akteId
    ? pool[hashString(akteId + ':fragment') % pool.length]
    : pickRandomOne(pool);
  return textDe(item);
}

function pickDokumentationsfragmentEn(kategorie, akteId, storedDe) {
  const katalog = getKategorieKatalog(kategorie);
  const pool = katalog.dokumentationsfragmente || [];
  if (storedDe) {
    for (let i = 0; i < pool.length; i++) {
      if (textDe(pool[i]) === storedDe) {
        return textEn(pool[i]);
      }
    }
    return lookupEn(storedDe);
  }
  if (pool.length === 0) {
    return null;
  }
  const item = akteId
    ? pool[hashString(akteId + ':fragment') % pool.length]
    : pickRandomOne(pool);
  return textEn(item);
}

/**
 * Stabile Hash-Zahl aus einem String.
 * @param {string} str
 * @returns {number}
 */
function hashString(str) {
  var hash = 0;
  var text = String(str || '');
  for (var i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Wählt gewichtet aus einer Aktenarten-Liste.
 * @param {Array} arten
 * @param {number} ticket
 * @returns {string|null}
 */
function pickAktenartFromList(arten, ticket) {
  if (!arten || arten.length === 0) {
    return null;
  }

  var total = 0;
  for (var i = 0; i < arten.length; i++) {
    total += arten[i].gewicht > 0 ? arten[i].gewicht : 0;
  }
  if (total <= 0) {
    return arten[0].key;
  }

  var cursor = 0;
  var t = ((ticket % total) + total) % total;
  for (var j = 0; j < arten.length; j++) {
    cursor += arten[j].gewicht > 0 ? arten[j].gewicht : 0;
    if (t < cursor) {
      return arten[j].key;
    }
  }

  return arten[arten.length - 1].key;
}

/**
 * Wählt eine Aktenart gewichtet zufällig (digital nur wenn plausibel).
 * @param {Object} [source]
 * @returns {string|null}
 */
function pickWeightedAktenart(source) {
  var arten = getEligibleAktenarten(source);
  if (arten.length === 0) {
    return null;
  }

  var total = 0;
  for (var i = 0; i < arten.length; i++) {
    total += arten[i].gewicht > 0 ? arten[i].gewicht : 0;
  }
  if (total <= 0) {
    return arten[0].key;
  }

  return pickAktenartFromList(arten, Math.floor(Math.random() * total));
}

/**
 * Wählt eine Aktenart deterministisch anhand einer Akten-ID (für Altdaten ohne Feld).
 * @param {string} akteId
 * @param {Object} [source]
 * @returns {string|null}
 */
function pickAktenartByHash(akteId, source) {
  var arten = getEligibleAktenarten(source);
  if (arten.length === 0) {
    return null;
  }

  return pickAktenartFromList(arten, hashString(akteId));
}

/**
 * Bestimmt die Aktenart: null bei Bildakte, sonst Option / gewichtete Wahl.
 * @param {boolean} ohneBild
 * @param {Object} options
 * @param {Object} [source] - Meta für Plausibilität (digitaler Datensatz)
 * @returns {string|null}
 */
function resolveAktenart(ohneBild, options, source) {
  options = options || {};
  if (!ohneBild) {
    return null;
  }
  const requested = canonicalAktenartKey(options.aktenart);
  if (requested && isValidAktenart(requested)) {
    if (requested !== 'digitaler-datensatz' || isPlausibleDigitalerDatensatz(source)) {
      return requested;
    }
  }
  return pickWeightedAktenart(source);
}

/**
 * Erzeugt ein Akten-Objekt aus Bild und Variante.
 * Bildakten behalten kuratierte Felder aus der Variante; fehlende Metadaten kommen aus dem Katalog.
 * Bildlose Akten erzeugen Titel, Kontext und Kurzbeschreibung aus Textbausteinen.
 * @param {Object} bild - Eintrag aus ARCHIV_BILDER
 * @param {Object} variante - Variante des Bildes
 * @param {Object} [options]
 * @param {boolean} [options.unique=false] - Eindeutige ID für mehrfach angezeigte bildlose Akten
 * @param {string|null} [options.aktenart] - Feste Aktenart für bildlose Akten
 * @returns {Object}
 */
function buildAkte(bild, variante, options) {
  options = options || {};
  variante = variante || {};
  const jahr = options.jahr !== undefined
    ? options.jahr
    : (variante.jahr !== undefined ? variante.jahr : generateJahr());
  const archivsignatur = options.archivsignatur || variante.archivsignatur || generateArchivsignatur(jahr);
  const meta = generateAktenMetadaten(variante, options);
  const ohneBild = !bild || bild.pfad == null;
  if (!ohneBild) {
    meta.materialhinweis = pickCuratedOrFallback(options, variante, 'materialhinweis', null);
    meta.fehlendeInformation = pickCuratedOrFallback(options, variante, 'fehlendeInformation', null);
    if (meta.en) {
      meta.en.materialhinweis = meta.materialhinweis ? lookupEn(meta.materialhinweis) : null;
      meta.en.fehlendeInformation = meta.fehlendeInformation ? lookupEn(meta.fehlendeInformation) : null;
    }
  }
  const texte = ohneBild
    ? generateAktenTexte(meta)
    : {
      titel: null,
      kontextbeschreibung: options.kontextbeschreibung !== undefined
        ? options.kontextbeschreibung
        : (variante.kontextbeschreibung || null),
      kurzbeschreibung: null,
    };
  const titel = options.titel !== undefined
    ? options.titel
    : (ohneBild ? texte.titel : (variante.titel || null));
  const kurzbeschreibung = options.kurzbeschreibung !== undefined
    ? options.kurzbeschreibung
    : (ohneBild ? texte.kurzbeschreibung : (variante.kurzbeschreibung || null));
  const kontextbeschreibung = options.kontextbeschreibung !== undefined
    ? options.kontextbeschreibung
    : (ohneBild ? texte.kontextbeschreibung : (variante.kontextbeschreibung || null));
  const aktenartSource = {
    objekttyp: meta.objekttyp,
    materialhinweis: meta.materialhinweis,
    sammlung: meta.sammlung,
    titel: titel,
    kurzbeschreibung: kurzbeschreibung,
    kontextbeschreibung: kontextbeschreibung,
  };
  const aktenart = resolveAktenart(ohneBild, options, aktenartSource);
  const baseId = (bild && bild.id ? bild.id : 'ohne-bild') + '--' + (variante.id || meta.kategorie || 'generiert');
  const id = options.unique ? baseId + '--' + randomArchivSuffix() : baseId;
  const bewertung = generateInstitutionelleBewertung({
    provenienz: meta.provenienz,
    sammlung: meta.sammlung,
    objekttyp: meta.objekttyp,
    herkunft: meta.herkunft,
    dokumentationsgrad: meta.dokumentationsgrad,
    erhaltungszustand: meta.erhaltungszustand,
  });
  const fragmentText = aktenart === 'dokumentfragment'
    ? pickDokumentationsfragment(meta.kategorie, id, options.fragmentText)
    : null;
  const aktenvermerk = ohneBild && aktenart !== 'dokumentfragment'
    ? pickAktenvermerk(aktenart, id, options.aktenvermerk)
    : null;

  const akte = {
    id: id,
    bildId: bild && bild.id ? bild.id : null,
    varianteId: variante.id || null,
    archivsignatur: archivsignatur,
    kategorie: meta.kategorie || variante.kategorie || null,
    titel: titel,
    jahr: jahr,
    bild: bild && bild.pfad != null ? bild.pfad : null,
    aktenart: aktenart,
    aktenvermerk: aktenvermerk,
    fragmentText: fragmentText,
    kurzbeschreibung: kurzbeschreibung,
    kontextbeschreibung: kontextbeschreibung,
    objekttyp: meta.objekttyp,
    motiv: meta.motiv,
    herkunft: meta.herkunft,
    provenienz: meta.provenienz,
    sammlung: meta.sammlung,
    materialhinweis: meta.materialhinweis,
    erhaltungszustand: meta.erhaltungszustand,
    dokumentationsgrad: meta.dokumentationsgrad,
    fehlendeInformation: meta.fehlendeInformation,
    institutionelleRelevanz: bewertung.stufe,
    aufnahmeempfehlung: bewertung.aufnahmeempfehlung,
    relevanzBegruendung: meta.relevanzBegruendung,
    bewertungskriterien: generateBewertungskriterien({
      provenienz: meta.provenienz,
      sammlung: meta.sammlung,
      objekttyp: meta.objekttyp,
      herkunft: meta.herkunft,
      dokumentationsgrad: meta.dokumentationsgrad,
      erhaltungszustand: meta.erhaltungszustand,
    }),
  };

  const art = aktenart
    ? getArchivAktenarten().find(function (entry) {
      return entry.key === aktenart;
    })
    : null;
  const generatedEn = Object.assign({}, meta.en || {}, texte.en || {});
  generatedEn.aktenartLabel = art ? textEn(art.label) : null;
  generatedEn.aktenvermerk = aktenvermerk
    ? pickAktenvermerkEn(aktenart, id, aktenvermerk)
    : null;
  generatedEn.fragmentText = fragmentText
    ? pickDokumentationsfragmentEn(meta.kategorie, id, fragmentText)
    : null;
  generatedEn.jahr = translateJahr(jahr);

  akte.translations = {
    en: buildTranslationsEn(akte, {
      curatedEn: variante.en || {},
      generatedEn: generatedEn,
    }),
  };

  return akte;
}

/**
 * Liest den Text eines Bewertungskriteriums anhand des Labels.
 * @param {Array} kriterien
 * @param {string} label
 * @returns {string|null}
 */
function getKriteriumText(kriterien, label) {
  if (!Array.isArray(kriterien) || !label) {
    return null;
  }

  for (var i = 0; i < kriterien.length; i++) {
    var item = kriterien[i];
    if (item && typeof item === 'object' && item.label === label && item.text) {
      return item.text;
    }
  }

  return null;
}

/**
 * Löst Zusatzfelder für Aktenart-Inhalte auf.
 * Gespeicherte Werte haben Vorrang; sonst Kriterien bzw. „nicht angegeben“.
 * @param {Object} akte
 * @param {Object} src
 * @returns {{ materialhinweis: string, erhaltungszustand: string, dokumentationsgrad: string, fehlendeInformation: string }}
 */
function resolveArchivZusatzfelder(akte, src) {
  var kriterien = 'bewertungskriterien' in akte
    ? akte.bewertungskriterien
    : (src && src.bewertungskriterien);

  return {
    materialhinweis: (akte && akte.materialhinweis)
      || (src && src.materialhinweis)
      || 'nicht angegeben',
    erhaltungszustand: (akte && akte.erhaltungszustand)
      || (src && src.erhaltungszustand)
      || getKriteriumText(kriterien, 'Erhaltungszustand')
      || 'nicht angegeben',
    dokumentationsgrad: (akte && akte.dokumentationsgrad)
      || (src && src.dokumentationsgrad)
      || getKriteriumText(kriterien, 'Dokumentationsgrad')
      || 'nicht angegeben',
    fehlendeInformation: (akte && akte.fehlendeInformation)
      || (src && src.fehlendeInformation)
      || 'nicht angegeben',
  };
}

/**
 * Bereitet eine Akte für State und Darstellung vor.
 * Liest aktuelle Daten aus ARCHIV_BILDER (per bildId/varianteId) und mappt ggf. alte Feldnamen.
 * @param {Object} akte - Erzeugte Akte oder Eintrag aus localStorage
 * @returns {Object}
 */
function normalizeAkte(akte) {
  const lookup = findBildAndVariante(akte.bildId, akte.varianteId);
  const fromData = lookup.bild && lookup.variante
    ? buildAkte(lookup.bild, lookup.variante, {
      jahr: 'jahr' in akte ? akte.jahr : undefined,
      archivsignatur: akte.archivsignatur || akte.inventoryNumber || akte.reference || undefined,
      objekttyp: 'objekttyp' in akte ? akte.objekttyp : undefined,
      herkunft: 'herkunft' in akte ? akte.herkunft : undefined,
      provenienz: 'provenienz' in akte ? akte.provenienz : undefined,
      sammlung: 'sammlung' in akte ? akte.sammlung : undefined,
      materialhinweis: 'materialhinweis' in akte ? akte.materialhinweis : undefined,
      erhaltungszustand: 'erhaltungszustand' in akte ? akte.erhaltungszustand : undefined,
      dokumentationsgrad: 'dokumentationsgrad' in akte ? akte.dokumentationsgrad : undefined,
      fehlendeInformation: 'fehlendeInformation' in akte ? akte.fehlendeInformation : undefined,
      aktenart: 'aktenart' in akte ? akte.aktenart : undefined,
      aktenvermerk: 'aktenvermerk' in akte ? akte.aktenvermerk : undefined,
      fragmentText: 'fragmentText' in akte ? akte.fragmentText : undefined,
      relevanzBegruendung: 'relevanzBegruendung' in akte ? akte.relevanzBegruendung : undefined,
    })
    : null;
  const src = fromData || akte;
  const jahr = 'jahr' in akte
    ? akte.jahr
    : (src.jahr != null ? src.jahr : (akte.year != null ? akte.year : generateJahr()));
  const fallbackMeta = generateAktenMetadaten(lookup.variante || { kategorie: akte.kategorie }, {});
  const bild = src.bild !== undefined ? src.bild : (akte.bild !== undefined ? akte.bild : null);
  const ohneBild = bild == null || bild === '';
  const zusatz = resolveArchivZusatzfelder(akte, src);
  const titel = src.titel || akte.titel || akte.title || null;
  const kurzbeschreibung = src.kurzbeschreibung || akte.kurzbeschreibung || akte.shortText || akte.fragment || null;
  const kontextbeschreibung = src.kontextbeschreibung || akte.kontextbeschreibung || null;
  const objekttyp = 'objekttyp' in akte ? akte.objekttyp : (src.objekttyp || akte.objectType || fallbackMeta.objekttyp);
  const sammlung = normalizeSammlung('sammlung' in akte ? akte.sammlung : (src.sammlung || fallbackMeta.sammlung));
  const dokumentationsgrad = normalizeDokumentationsgrad(zusatz.dokumentationsgrad);
  const erhaltungszustand = normalizeErhaltungszustand(zusatz.erhaltungszustand);
  const provenienz = 'provenienz' in akte ? akte.provenienz : (src.provenienz || fallbackMeta.provenienz);
  const herkunft = 'herkunft' in akte ? akte.herkunft : (src.herkunft != null ? src.herkunft : (akte.origin || fallbackMeta.herkunft));
  const aktenartSource = {
    objekttyp: objekttyp,
    materialhinweis: zusatz.materialhinweis,
    sammlung: sammlung,
    titel: titel,
    kurzbeschreibung: kurzbeschreibung,
    kontextbeschreibung: kontextbeschreibung,
  };
  let aktenart = null;
  if (ohneBild) {
    const rawCandidate = isValidAktenart(akte.aktenart)
      ? akte.aktenart
      : (isValidAktenart(src.aktenart) ? src.aktenart : null);
    const candidate = canonicalAktenartKey(rawCandidate);
    if (candidate && (candidate !== 'digitaler-datensatz' || isPlausibleDigitalerDatensatz(aktenartSource))) {
      aktenart = candidate;
    } else {
      aktenart = pickAktenartByHash(src.id || akte.id || '', aktenartSource);
    }
  }

  const akteId = src.id || akte.id;
  const fragmentText = aktenart === 'dokumentfragment'
    ? pickDokumentationsfragment(
      src.kategorie || akte.kategorie,
      akteId,
      akte.fragmentText || src.fragmentText
    )
    : null;
  const aktenvermerk = ohneBild && aktenart !== 'dokumentfragment'
    ? pickAktenvermerk(aktenart, akteId, akte.aktenvermerk || src.aktenvermerk)
    : null;
  const bewertungSource = {
    provenienz: provenienz,
    sammlung: sammlung,
    objekttyp: objekttyp,
    herkunft: herkunft,
    dokumentationsgrad: dokumentationsgrad,
    erhaltungszustand: erhaltungszustand,
  };
  const bewertung = generateInstitutionelleBewertung(bewertungSource);
  const relevanzBegruendung = akte.relevanzBegruendung
    || src.relevanzBegruendung
    || (typeof akte.institutionelleRelevanz === 'string' && /von /.test(akte.institutionelleRelevanz)
      ? akte.institutionelleRelevanz
      : null)
    || fallbackMeta.relevanzBegruendung
    || null;

  const normalized = {
    id: akteId,
    bildId: src.bildId || akte.bildId || null,
    varianteId: src.varianteId || akte.varianteId || null,
    archivsignatur: akte.archivsignatur || akte.inventoryNumber || akte.reference || src.archivsignatur || generateArchivsignatur(jahr),
    kategorie: src.kategorie || akte.kategorie || akte.category || null,
    titel: titel,
    jahr: jahr,
    bild: src.bild !== undefined ? src.bild : (akte.bild !== undefined ? akte.bild : null),
    aktenart: aktenart,
    aktenvermerk: aktenvermerk,
    fragmentText: fragmentText,
    kurzbeschreibung: kurzbeschreibung,
    kontextbeschreibung: kontextbeschreibung,
    objekttyp: objekttyp,
    motiv: 'motiv' in akte ? akte.motiv : (src.motiv || fallbackMeta.motiv || null),
    herkunft: herkunft,
    provenienz: provenienz,
    sammlung: sammlung,
    materialhinweis: zusatz.materialhinweis,
    erhaltungszustand: erhaltungszustand,
    dokumentationsgrad: dokumentationsgrad,
    fehlendeInformation: zusatz.fehlendeInformation,
    institutionelleRelevanz: bewertung.stufe,
    aufnahmeempfehlung: bewertung.aufnahmeempfehlung,
    relevanzBegruendung: relevanzBegruendung,
    bewertungskriterien: generateBewertungskriterien(bewertungSource),
  };

  const art = aktenart
    ? getArchivAktenarten().find(function (entry) {
      return entry.key === aktenart;
    })
    : null;
  const curatedEn = (lookup.variante && lookup.variante.en) || {};
  const existingEn = (akte.translations && akte.translations.en)
    || (src.translations && src.translations.en)
    || {};
  const generatedEn = Object.assign({}, fallbackMeta.en || {}, existingEn);
  generatedEn.aktenartLabel = art ? textEn(art.label) : (existingEn.aktenartLabel || null);
  generatedEn.aktenvermerk = aktenvermerk
    ? pickAktenvermerkEn(aktenart, akteId, aktenvermerk)
    : null;
  generatedEn.fragmentText = fragmentText
    ? pickDokumentationsfragmentEn(normalized.kategorie, akteId, fragmentText)
    : null;
  generatedEn.jahr = existingEn.jahr != null ? existingEn.jahr : translateJahr(jahr);

  normalized.translations = {
    en: buildTranslationsEn(normalized, {
      curatedEn: curatedEn,
      generatedEn: generatedEn,
    }),
  };

  return normalized;
}

/**
 * Wählt zufällig Bilder aus ARCHIV_BILDER (ohne Duplikate).
 * @param {Array} bilder - Quell-Array
 * @param {number} count - Anzahl der Bilder
 * @returns {Array}
 */
function pickArchiveBilder(bilder, count) {
  return pickRandom(bilder, count);
}

/**
 * Wählt zufällig ein Element aus einem Array (mit Wiederholung).
 * @param {Array} arr
 * @returns {*}
 */
function pickRandomOne(arr) {
  if (!arr || arr.length === 0) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Bild-ID für eine bildlose Akte einer Kategorie (interne Referenz, kein Ausschluss).
 * @param {string} kategorie
 * @returns {string}
 */
function ohneBildIdForKategorie(kategorie) {
  return 'ohne-bild-' + String(kategorie || '').toLowerCase().replace(/\s+/g, '-');
}

const OHNE_BILD_KOMBINATION_FELDER = [
  'kategorie',
  'objekttyp',
  'motiv',
  'herkunft',
  'sammlung',
  'materialhinweis',
  'erhaltungszustand',
  'fehlendeInformation',
  'provenienz',
  'dokumentationsgrad',
  'aktenart',
];

const OHNE_BILD_RETRY_LIMIT = 40;

/**
 * Stabiler Schlüssel der Katalog-Kombination einer bildlosen Akte.
 * @param {Object} akte
 * @returns {string|null}
 */
function ohneBildKombinationKey(akte) {
  if (!akte || akte.bild) {
    return null;
  }

  return OHNE_BILD_KOMBINATION_FELDER.map(function (field) {
    const value = akte[field];
    return value == null ? '' : String(value);
  }).join('\u001f');
}

/**
 * Erzeugt eine bildlose Akte vollständig aus Kategoriekatalogen und Textbausteinen.
 * @returns {Object|null}
 */
function buildRandomOhneBildAkte() {
  const kategorie = resolveKategorie({});
  if (!kategorie) {
    return null;
  }

  const variante = {
    id: 'generiert',
    kategorie: kategorie,
  };
  const bild = {
    id: ohneBildIdForKategorie(kategorie),
    pfad: null,
  };

  return buildAkte(bild, variante, { unique: true });
}

/**
 * Erzeugt eine bildlose Akte mit einer noch nicht verwendeten Katalog-Kombination.
 * @param {Array<string>|Set<string>} [excludedKeys]
 * @returns {Object|null}
 */
function pickRandomOhneBildAkte(excludedKeys) {
  const excluded = excludedKeys instanceof Set
    ? excludedKeys
    : new Set(excludedKeys || []);

  for (let i = 0; i < OHNE_BILD_RETRY_LIMIT; i++) {
    const akte = buildRandomOhneBildAkte();
    if (!akte) {
      return null;
    }

    const normalized = normalizeAkte(akte);
    const key = ohneBildKombinationKey(normalized);
    if (!key || !excluded.has(key)) {
      return normalized;
    }
  }

  return null;
}

/**
 * Wählt zufällig mehrere Archivakten aus ARCHIV_BILDER.
 * Pro Angebot zufällig 0–2 bildlose Akten, Rest mit Bild; Reihenfolge gemischt.
 * Bereits verwendete Bild-IDs und bildlose Katalog-Kombinationen werden ausgeschlossen.
 * @param {number} count - Anzahl der Akten
 * @param {Array<string>} [excludedBildIds] - Bild-IDs, die in diesem Durchlauf nicht mehr angeboten werden dürfen
 * @param {Array<string>} [excludedKombinationen] - Katalog-Kombinationen bildloser Akten in diesem Durchlauf
 * @returns {Array} Array von vorbereiteten Akten-Objekten
 */
function pickArchiveAkten(count, excludedBildIds, excludedKombinationen) {
  if (!Array.isArray(ARCHIV_BILDER)) {
    console.warn('ARCHIV_BILDER ist nicht definiert.');
    return [];
  }

  count = count || 0;
  if (count <= 0) {
    return [];
  }

  const excluded = new Set(excludedBildIds || []);
  const excludedKeys = new Set(excludedKombinationen || []);
  const mitBild = ARCHIV_BILDER.filter(function (b) {
    return b.pfad && !excluded.has(b.id);
  });

  const maxOhneBild = Math.min(2, count);
  let ohneBildCount = Math.floor(Math.random() * (maxOhneBild + 1));
  let mitBildCount = count - ohneBildCount;

  if (mitBildCount > mitBild.length) {
    ohneBildCount += mitBildCount - mitBild.length;
    mitBildCount = mitBild.length;
  }

  const pickedBilder = pickArchiveBilder(mitBild, mitBildCount);
  pickedBilder.forEach(function (bild) {
    if (bild && bild.id) {
      excluded.add(bild.id);
    }
  });

  const akten = pickedBilder.map(function (bild) {
    const variante = pickRandom(bild.varianten, 1)[0];
    return buildAkte(bild, variante);
  });

  function tryAddOhneBildAkte() {
    const akte = pickRandomOhneBildAkte(excludedKeys);
    if (!akte) {
      return false;
    }
    const key = ohneBildKombinationKey(akte);
    if (key) {
      excludedKeys.add(key);
    }
    akten.push(akte);
    return true;
  }

  function tryAddBildAkte() {
    const remaining = ARCHIV_BILDER.filter(function (b) {
      return b.pfad && !excluded.has(b.id);
    });
    const bild = pickArchiveBilder(remaining, 1)[0];
    if (!bild) {
      return false;
    }
    excluded.add(bild.id);
    const variante = pickRandom(bild.varianten, 1)[0];
    akten.push(buildAkte(bild, variante));
    return true;
  }

  for (let i = 0; i < ohneBildCount; i++) {
    if (!tryAddOhneBildAkte()) {
      break;
    }
  }

  while (akten.length < count) {
    if (tryAddOhneBildAkte() || tryAddBildAkte()) {
      continue;
    }
    break;
  }

  for (let i = akten.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = akten[i];
    akten[i] = akten[j];
    akten[j] = tmp;
  }

  return akten.map(normalizeAkte);
}

/**
 * Erzeugt ein Set aus mehreren unterschiedlichen Akten.
 * Öffentliche API — wird von state.js aufgerufen.
 * @param {number} count - Anzahl der Akten (Standard: 3)
 * @param {Array<string>} [excludedBildIds] - Bild-IDs, die in diesem Durchlauf nicht mehr angeboten werden dürfen
 * @param {Array<string>} [excludedKombinationen] - Katalog-Kombinationen bildloser Akten in diesem Durchlauf
 * @returns {Array} Array von Akten-Objekten
 */
function generateOfferSet(count, excludedBildIds, excludedKombinationen) {
  count = count || 3;
  return pickArchiveAkten(count, excludedBildIds, excludedKombinationen);
}
