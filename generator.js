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

  if (/^(undatiert|nicht\s+datiert|n\.?\s*d\.?)$/i.test(s)) {
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

/**
 * Wählt zufällig einen Eintrag aus einer Liste in KONTROLLIERTE_WERTE.
 * @param {string} listeKey - Schlüssel in KONTROLLIERTE_WERTE (z. B. „provenienz“)
 * @returns {string|null}
 */
function pickFromListe(listeKey) {
  const listen = getKontrollierteWerte();
  return pickRandomOne(listen[listeKey] || []);
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

  return pickRandomOne(listen.kategorien || Object.keys(kataloge));
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

/**
 * Zieht kohärente Bausteine aus dem Katalog einer Kategorie.
 * @param {string} kategorie
 * @param {Object} [options] - Bereits gesetzte Feldwerte
 * @returns {Object}
 */
function pickKategorieBausteine(kategorie, options) {
  options = options || {};
  const katalog = getKategorieKatalog(kategorie);

  return {
    kategorie: kategorie,
    objekttyp: options.objekttyp !== undefined
      ? options.objekttyp
      : pickRandomOne(katalog.objekttypen || []),
    motiv: options.motiv !== undefined
      ? options.motiv
      : pickRandomOne(katalog.motive || []),
    ort: options.ort !== undefined
      ? options.ort
      : pickRandomOne(katalog.orte || []),
    erhaltungszustand: options.erhaltungszustand !== undefined
      ? options.erhaltungszustand
      : pickRandomOne(katalog.erhaltungszustaende || []),
    fehlendeInformation: options.fehlendeInformation !== undefined
      ? options.fehlendeInformation
      : pickRandomOne(katalog.fehlendeInformationen || []),
    materialhinweis: options.materialhinweis !== undefined
      ? options.materialhinweis
      : pickRandomOne(katalog.materialhinweise || []),
    sammlung: options.sammlung !== undefined
      ? options.sammlung
      : pickRandomOne(katalog.sammlungen || []),
    institutionelleRelevanz: options.institutionelleRelevanz !== undefined
      ? options.institutionelleRelevanz
      : pickRandomOne(katalog.institutionelleRelevanz || []),
  };
}

/**
 * Erzeugt einen Aktentitel aus Titelstrukturen und Bausteinen.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateAktenTitel(bausteine) {
  const listen = getKontrollierteWerte();
  const struktur = pickRandomOne(listen.titelstrukturen || []);
  if (!struktur || !bausteine.objekttyp) {
    return null;
  }
  return capitalizeFirst(fillTemplate(struktur, bausteine));
}

/**
 * Erzeugt eine Kontextbeschreibung aus Satzanfängen, Verbindungen und Bausteinen.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateKontextbeschreibung(bausteine) {
  const listen = getKontrollierteWerte();
  const anfang = pickRandomOne(listen.kontextSatzanfaenge || []);
  const verbindung = pickRandomOne(listen.kontextVerbindungen || []);
  const motiv = bausteine.motiv;
  const ort = bausteine.ort;

  if (!anfang || !motiv) {
    return null;
  }

  const needsContinuation = [
    'und gibt Einblick in',
    'und dokumentiert zugleich',
    'und lässt Rückschlüsse auf',
    'und verweist auf',
  ].indexOf(verbindung) !== -1;

  let text;
  if (needsContinuation && ort) {
    text = anfang + ' ' + motiv + ' ' + verbindung + ' ' + ort + '.';
  } else if (needsContinuation) {
    text = anfang + ' ' + motiv + '.';
  } else if (verbindung) {
    text = anfang + ' ' + motiv + ' und ' + verbindung + '.';
  } else {
    text = anfang + ' ' + motiv + '.';
  }

  if (bausteine.fehlendeInformation && Math.random() < 0.7) {
    text += ' ' + capitalizeFirst(bausteine.fehlendeInformation) + '.';
  }

  return text;
}

/**
 * Erzeugt eine Kurzbeschreibung für den Erinnerungsraum.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateKurzbeschreibung(bausteine) {
  const listen = getKontrollierteWerte();
  const struktur = pickRandomOne(listen.kurzbeschreibungStrukturen || []);
  if (!struktur || !bausteine.motiv) {
    return null;
  }
  return fillTemplate(struktur, bausteine);
}

/**
 * Erzeugt Titel, Kontext- und Kurzbeschreibung für bildlose Akten.
 * @param {Object} bausteine
 * @returns {{ titel: string|null, kontextbeschreibung: string|null, kurzbeschreibung: string|null }}
 */
function generateAktenTexte(bausteine) {
  return {
    titel: generateAktenTitel(bausteine),
    kontextbeschreibung: generateKontextbeschreibung(bausteine),
    kurzbeschreibung: generateKurzbeschreibung(bausteine),
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

  const curatedOverrides = {
    objekttyp: pickCuratedOrFallback(options, variante, 'objekttyp', undefined),
    sammlung: pickCuratedOrFallback(options, variante, 'sammlung', undefined),
    erhaltungszustand: pickCuratedOrFallback(options, variante, 'erhaltungszustand', undefined),
    institutionelleRelevanz: pickCuratedOrFallback(options, variante, 'institutionelleRelevanz', undefined),
    materialhinweis: pickCuratedOrFallback(options, variante, 'materialhinweis', undefined),
    fehlendeInformation: pickCuratedOrFallback(options, variante, 'fehlendeInformation', undefined),
  };

  const bausteine = pickKategorieBausteine(kategorie, {
    objekttyp: curatedOverrides.objekttyp,
    sammlung: curatedOverrides.sammlung,
    erhaltungszustand: curatedOverrides.erhaltungszustand,
    institutionelleRelevanz: curatedOverrides.institutionelleRelevanz,
    materialhinweis: curatedOverrides.materialhinweis,
    fehlendeInformation: curatedOverrides.fehlendeInformation,
  });

  const provenienz = pickCuratedOrFallback(options, variante, 'provenienz', function () {
    return pickFromListe('provenienz');
  });
  const herkunft = pickCuratedOrFallback(options, variante, 'herkunft', null);
  const dokumentationsgrad = pickCuratedOrFallback(options, variante, 'dokumentationsgrad', function () {
    return pickFromListe('dokumentationsgrad');
  });

  return {
    kategorie: kategorie,
    objekttyp: bausteine.objekttyp,
    herkunft: herkunft,
    provenienz: provenienz,
    sammlung: bausteine.sammlung,
    erhaltungszustand: bausteine.erhaltungszustand,
    dokumentationsgrad: dokumentationsgrad,
    motiv: bausteine.motiv,
    ort: bausteine.ort,
    fehlendeInformation: bausteine.fehlendeInformation,
    materialhinweis: bausteine.materialhinweis,
    institutionelleRelevanz: bausteine.institutionelleRelevanz,
  };
}

/**
 * Erzeugt Bewertungskriterien — Relevanz und Erhaltungszustand aus der Kategorie,
 * Dokumentationsgrad aus dem allgemeinen Katalog. Kuratierte Werte haben Vorrang.
 * @param {Object} [options]
 * @param {string} [options.kategorie]
 * @param {string} [options.erhaltungszustand]
 * @param {string} [options.institutionelleRelevanz]
 * @param {string} [options.dokumentationsgrad]
 * @returns {Array<{ label: string, text: string }>}
 */
function generateBewertungskriterien(options) {
  options = options || {};

  if (options.bewertungskriterien !== undefined) {
    return options.bewertungskriterien;
  }

  const listen = getKontrollierteWerte();
  const kategorie = options.kategorie || resolveKategorie({});
  const katalog = getKategorieKatalog(kategorie);

  const relevanz = options.institutionelleRelevanz !== undefined
    ? options.institutionelleRelevanz
    : pickRandomOne(katalog.institutionelleRelevanz || []);
  const dokumentationsgrad = options.dokumentationsgrad !== undefined
    ? options.dokumentationsgrad
    : pickRandomOne(listen.dokumentationsgrad || []);
  const erhaltungszustand = options.erhaltungszustand !== undefined
    ? options.erhaltungszustand
    : pickRandomOne(katalog.erhaltungszustaende || []);

  return [
    relevanz ? { label: 'Institutionelle Relevanz', text: relevanz } : null,
    dokumentationsgrad ? { label: 'Dokumentationsgrad', text: dokumentationsgrad } : null,
    erhaltungszustand ? { label: 'Erhaltungszustand', text: erhaltungszustand } : null,
  ].filter(Boolean);
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
  ].filter(Boolean).join(' ').toLowerCase();

  return /digital|scan|datei|datensatz|bildschirm|pixel|elektron|software|online|pdf|speicher|netz/.test(haystack);
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
function isValidAktenart(key) {
  if (!key) {
    return false;
  }
  return getArchivAktenarten().some(function (art) {
    return art.key === key;
  });
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
  if (options.aktenart !== undefined && isValidAktenart(options.aktenart)) {
    if (options.aktenart !== 'digitaler-datensatz' || isPlausibleDigitalerDatensatz(source)) {
      return options.aktenart;
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

  return {
    id: options.unique ? baseId + '--' + randomArchivSuffix() : baseId,
    bildId: bild && bild.id ? bild.id : null,
    varianteId: variante.id || null,
    archivsignatur: archivsignatur,
    kategorie: meta.kategorie || variante.kategorie || null,
    titel: titel,
    jahr: jahr,
    bild: bild && bild.pfad != null ? bild.pfad : null,
    aktenart: aktenart,
    kurzbeschreibung: kurzbeschreibung,
    kontextbeschreibung: kontextbeschreibung,
    objekttyp: meta.objekttyp,
    herkunft: meta.herkunft,
    provenienz: meta.provenienz,
    sammlung: meta.sammlung,
    materialhinweis: meta.materialhinweis,
    erhaltungszustand: meta.erhaltungszustand,
    dokumentationsgrad: meta.dokumentationsgrad,
    fehlendeInformation: meta.fehlendeInformation,
    bewertungskriterien: generateBewertungskriterien({
      kategorie: meta.kategorie,
      erhaltungszustand: meta.erhaltungszustand,
      institutionelleRelevanz: meta.institutionelleRelevanz,
      dokumentationsgrad: meta.dokumentationsgrad,
      bewertungskriterien: options.bewertungskriterien,
    }),
  };
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
      bewertungskriterien: 'bewertungskriterien' in akte ? akte.bewertungskriterien : undefined,
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
  const sammlung = 'sammlung' in akte ? akte.sammlung : (src.sammlung || fallbackMeta.sammlung);
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
    const candidate = isValidAktenart(akte.aktenart)
      ? akte.aktenart
      : (isValidAktenart(src.aktenart) ? src.aktenart : null);
    if (candidate && (candidate !== 'digitaler-datensatz' || isPlausibleDigitalerDatensatz(aktenartSource))) {
      aktenart = candidate;
    } else {
      aktenart = pickAktenartByHash(src.id || akte.id || '', aktenartSource);
    }
  }

  return {
    id: src.id || akte.id,
    bildId: src.bildId || akte.bildId || null,
    varianteId: src.varianteId || akte.varianteId || null,
    archivsignatur: akte.archivsignatur || akte.inventoryNumber || akte.reference || src.archivsignatur || generateArchivsignatur(jahr),
    kategorie: src.kategorie || akte.kategorie || akte.category || null,
    titel: titel,
    jahr: jahr,
    bild: src.bild !== undefined ? src.bild : (akte.bild !== undefined ? akte.bild : null),
    kurzbeschreibung: src.kurzbeschreibung || akte.kurzbeschreibung || akte.shortText || akte.fragment || null,
    kontextbeschreibung: src.kontextbeschreibung || akte.kontextbeschreibung || null,
    objekttyp: 'objekttyp' in akte ? akte.objekttyp : (src.objekttyp || akte.objectType || fallbackMeta.objekttyp),
    herkunft: 'herkunft' in akte ? akte.herkunft : (src.herkunft != null ? src.herkunft : (akte.origin || fallbackMeta.herkunft)),
    provenienz: 'provenienz' in akte ? akte.provenienz : (src.provenienz || fallbackMeta.provenienz),
    sammlung: sammlung,
    materialhinweis: zusatz.materialhinweis,
    erhaltungszustand: zusatz.erhaltungszustand,
    dokumentationsgrad: zusatz.dokumentationsgrad,
    fehlendeInformation: zusatz.fehlendeInformation,
    bewertungskriterien: 'bewertungskriterien' in akte
      ? akte.bewertungskriterien
      : (src.bewertungskriterien || generateBewertungskriterien({ kategorie: src.kategorie || akte.kategorie })),
  };
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
 * Erzeugt eine bildlose Akte vollständig aus Kategoriekatalogen und Textbausteinen.
 * @returns {Object|null}
 */
function pickRandomOhneBildAkte() {
  const kategorie = resolveKategorie({});
  if (!kategorie) {
    return null;
  }

  const variante = {
    id: 'generiert',
    kategorie: kategorie,
  };
  const bild = {
    id: 'ohne-bild-' + kategorie.toLowerCase().replace(/\s+/g, '-'),
    pfad: null,
  };

  return buildAkte(bild, variante, { unique: true });
}

/**
 * Wählt zufällig mehrere Archivakten aus ARCHIV_BILDER.
 * Pro Angebot zufällig 0–2 bildlose Akten, Rest mit Bild; Reihenfolge gemischt.
 * Bilder im Erinnerungsraum werden ausgeschlossen; bildlose Akten dürfen mehrfach vorkommen.
 * @param {number} count - Anzahl der Akten
 * @param {Array<string>} [excludedBildIds] - Bild-IDs mit Pfad, die bereits im Erinnerungsraum sind
 * @returns {Array} Array von vorbereiteten Akten-Objekten
 */
function pickArchiveAkten(count, excludedBildIds) {
  if (!Array.isArray(ARCHIV_BILDER)) {
    console.warn('ARCHIV_BILDER ist nicht definiert.');
    return [];
  }

  count = count || 0;
  if (count <= 0) {
    return [];
  }

  const excluded = new Set(excludedBildIds || []);
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

  const akten = pickArchiveBilder(mitBild, mitBildCount).map(function (bild) {
    const variante = pickRandom(bild.varianten, 1)[0];
    return buildAkte(bild, variante);
  });

  for (let i = 0; i < ohneBildCount; i++) {
    const akte = pickRandomOhneBildAkte();
    if (!akte) {
      break;
    }
    akten.push(akte);
  }

  while (akten.length < count) {
    const akte = pickRandomOhneBildAkte();
    if (!akte) {
      break;
    }
    akten.push(akte);
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
 * @param {Array<string>} [excludedBildIds] - Bild-IDs, die bereits im Erinnerungsraum sind
 * @returns {Array} Array von Akten-Objekten
 */
function generateOfferSet(count, excludedBildIds) {
  count = count || 3;
  return pickArchiveAkten(count, excludedBildIds);
}
