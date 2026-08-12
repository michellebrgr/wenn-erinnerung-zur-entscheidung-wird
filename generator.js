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
 * Wählt zufällig einen Eintrag aus einer Liste in KONTROLLIERTE_WERTE.
 * @param {string} listeKey - Schlüssel in KONTROLLIERTE_WERTE (z. B. „objekttypen“)
 * @returns {string|null}
 */
function pickFromListe(listeKey) {
  const listen = typeof KONTROLLIERTE_WERTE !== 'undefined' ? KONTROLLIERTE_WERTE : {};
  return pickRandomOne(listen[listeKey] || []);
}

/**
 * Wählt zufällig aus einer Zuordnungstabelle; Fallback über '*' oder globale Liste.
 * @param {Object|null} map - Zuordnungstabelle (z. B. sammlungNachKategorie)
 * @param {string} key - Suchschlüssel (z. B. Kategorie oder Herkunft)
 * @param {Array} fallbackListe - Globale Fallback-Liste
 * @returns {string|null}
 */
function pickFromMap(map, key, fallbackListe) {
  if (!map) {
    return pickRandomOne(fallbackListe || []);
  }

  const liste = map[key] || map['*'] || fallbackListe || [];
  return pickRandomOne(liste);
}

/**
 * Erzeugt kohärente Metadaten für eine Akte aus aktenProfile.
 * Sammlung folgt Kategorie, Provenienz folgt Herkunft.
 * @param {Object} variante - Variante mit kategorie
 * @param {Object} [options] - Bereits gespeicherte Feldwerte
 * @returns {{ objekttyp: string|null, herkunft: string|null, provenienz: string|null, sammlung: string|null }}
 */
function generateAktenMetadaten(variante, options) {
  options = options || {};
  variante = variante || {};

  const listen = typeof KONTROLLIERTE_WERTE !== 'undefined' ? KONTROLLIERTE_WERTE : {};
  const profile = pickRandomOne(listen.aktenProfile || []);

  if (!profile) {
    const herkunft = options.herkunft !== undefined ? options.herkunft : pickFromListe('herkunft');
    return {
      objekttyp: options.objekttyp !== undefined ? options.objekttyp : pickFromListe('objekttypen'),
      herkunft: herkunft,
      provenienz: options.provenienz !== undefined ? options.provenienz : pickFromListe('provenienz'),
      sammlung: options.sammlung !== undefined ? options.sammlung : pickFromListe('sammlung'),
    };
  }

  const kategorie = variante.kategorie || '*';
  const objekttyp = options.objekttyp !== undefined
    ? options.objekttyp
    : pickRandomOne(profile.objekttypen || listen.objekttypen || []);
  const herkunft = options.herkunft !== undefined
    ? options.herkunft
    : pickRandomOne(profile.herkunft || listen.herkunft || []);
  const sammlung = options.sammlung !== undefined
    ? options.sammlung
    : pickFromMap(profile.sammlungNachKategorie, kategorie, listen.sammlung || []);
  const provenienz = options.provenienz !== undefined
    ? options.provenienz
    : pickFromMap(profile.provenienzNachHerkunft, herkunft, listen.provenienz || []);

  return {
    objekttyp: objekttyp,
    herkunft: herkunft,
    provenienz: provenienz,
    sammlung: sammlung,
  };
}

/**
 * Erzeugt Bewertungskriterien — je Kategorie ein zufälliger Text mit Label.
 * @param {Object} [options]
 * @returns {Array<{ label: string, text: string }>}
 */
function generateBewertungskriterien(options) {
  options = options || {};

  if (options.bewertungskriterien !== undefined) {
    return options.bewertungskriterien;
  }

  const listen = typeof KONTROLLIERTE_WERTE !== 'undefined' ? KONTROLLIERTE_WERTE : {};
  const kategorien = listen.bewertungskriterienListen || {};

  return Object.keys(kategorien).map(function (label) {
    const text = pickRandomOne(kategorien[label] || []);
    if (!text) {
      return null;
    }
    return { label: label, text: text };
  }).filter(Boolean);
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
 * @param {Object} bild - Eintrag aus ARCHIV_BILDER
 * @param {Object} variante - Variante des Bildes
 * @param {Object} [options]
 * @param {boolean} [options.unique=false] - Eindeutige ID für mehrfach angezeigte bildlose Akten
 * @param {string|null} [options.aktenart] - Feste Aktenart für bildlose Akten
 * @returns {Object}
 */
function buildAkte(bild, variante, options) {
  options = options || {};
  const jahr = options.jahr !== undefined ? options.jahr : generateJahr();
  const archivsignatur = options.archivsignatur || variante.archivsignatur || generateArchivsignatur(jahr);
  const meta = generateAktenMetadaten(variante, options);
  const ohneBild = !bild || bild.pfad == null;
  const titel = options.titel !== undefined ? options.titel : (variante.titel || null);
  const kurzbeschreibung = options.kurzbeschreibung !== undefined
    ? options.kurzbeschreibung
    : (variante.kurzbeschreibung || null);
  const kontextbeschreibung = options.kontextbeschreibung !== undefined
    ? options.kontextbeschreibung
    : (variante.kontextbeschreibung || null);
  const aktenartSource = {
    objekttyp: meta.objekttyp,
    materialhinweis: options.materialhinweis,
    sammlung: meta.sammlung,
    titel: titel,
    kurzbeschreibung: kurzbeschreibung,
    kontextbeschreibung: kontextbeschreibung,
  };
  const aktenart = resolveAktenart(ohneBild, options, aktenartSource);
  const baseId = (bild && bild.id ? bild.id : 'ohne-bild') + '--' + (variante.id || 'generiert');

  return {
    id: options.unique ? baseId + '--' + randomArchivSuffix() : baseId,
    bildId: bild && bild.id ? bild.id : null,
    varianteId: variante && variante.id ? variante.id : null,
    archivsignatur: archivsignatur,
    kategorie: variante.kategorie || null,
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
    materialhinweis: options.materialhinweis,
    erhaltungszustand: options.erhaltungszustand,
    dokumentationsgrad: options.dokumentationsgrad,
    fehlendeInformation: options.fehlendeInformation,
    bewertungskriterien: generateBewertungskriterien(options),
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
    bild: bild,
    aktenart: aktenart,
    kurzbeschreibung: kurzbeschreibung,
    kontextbeschreibung: kontextbeschreibung,
    objekttyp: objekttyp,
    herkunft: 'herkunft' in akte ? akte.herkunft : (src.herkunft != null ? src.herkunft : (akte.origin || fallbackMeta.herkunft)),
    provenienz: 'provenienz' in akte ? akte.provenienz : (src.provenienz || fallbackMeta.provenienz),
    sammlung: sammlung,
    materialhinweis: zusatz.materialhinweis,
    erhaltungszustand: zusatz.erhaltungszustand,
    dokumentationsgrad: zusatz.dokumentationsgrad,
    fehlendeInformation: zusatz.fehlendeInformation,
    bewertungskriterien: 'bewertungskriterien' in akte
      ? akte.bewertungskriterien
      : (src.bewertungskriterien || generateBewertungskriterien({})),
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
 * Erzeugt eine bildlose Akte für Auffüllung des Angebots.
 * @param {Array} ohneBild - Bild-Einträge ohne Pfad
 * @returns {Object|null}
 */
function pickRandomOhneBildAkte(ohneBild) {
  const bild = pickRandomOne(ohneBild);
  if (!bild || !Array.isArray(bild.varianten) || bild.varianten.length === 0) {
    return null;
  }

  const variante = pickRandomOne(bild.varianten);
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
  if (!Array.isArray(ARCHIV_BILDER) || ARCHIV_BILDER.length === 0) {
    console.warn('ARCHIV_BILDER ist leer oder nicht definiert.');
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
  const ohneBild = ARCHIV_BILDER.filter(function (b) {
    return !b.pfad;
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
    const akte = pickRandomOhneBildAkte(ohneBild);
    if (!akte) {
      break;
    }
    akten.push(akte);
  }

  while (akten.length < count) {
    const akte = pickRandomOhneBildAkte(ohneBild);
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
