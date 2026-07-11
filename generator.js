/**
 * generator.js — Wählt Archivakten aus dem Datenbestand
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt ARCHIV_AKTEN aus data.js.
 */

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
 * Bereitet eine Akte aus ARCHIV_AKTEN für State und Darstellung vor.
 * Liest aktuelle Daten aus ARCHIV_AKTEN (per id) und mappt ggf. alte Feldnamen.
 * @param {Object} akte - Eintrag aus ARCHIV_AKTEN oder aus localStorage
 * @returns {Object}
 */
function normalizeAkte(akte) {
  const fromData = Array.isArray(ARCHIV_AKTEN)
    ? ARCHIV_AKTEN.find(function (a) {
        return a.id === akte.id;
      })
    : null;
  const src = fromData || akte;
  const jahr = src.jahr != null ? src.jahr : (akte.jahr != null ? akte.jahr : (akte.year != null ? akte.year : null));

  return {
    id: src.id || akte.id,
    archivsignatur: src.archivsignatur || akte.archivsignatur || akte.inventoryNumber || akte.reference || generateArchivsignatur(jahr),
    kategorie: src.kategorie || akte.kategorie || akte.category || null,
    titel: src.titel || akte.titel || akte.title || null,
    jahr: jahr,
    bild: src.bild !== undefined ? src.bild : (akte.bild !== undefined ? akte.bild : null),
    kurzbeschreibung: src.kurzbeschreibung || akte.kurzbeschreibung || akte.shortText || akte.fragment || null,
    objekttyp: src.objekttyp || akte.objekttyp || akte.objectType || null,
    herkunft: src.herkunft || akte.herkunft || akte.origin || null,
    provenienz: src.provenienz || akte.provenienz || null,
    sammlung: src.sammlung || akte.sammlung || null,
    institutionelleRelevanz: src.institutionelleRelevanz || akte.institutionelleRelevanz || null,
    dokumentationsgrad: src.dokumentationsgrad || akte.dokumentationsgrad || akte.visibility || null,
    erhaltungszustand: src.erhaltungszustand || akte.erhaltungszustand || akte.condition || null,
  };
}

/**
 * Wählt zufällig mehrere unterschiedliche Akten aus ARCHIV_AKTEN.
 * @param {number} count - Anzahl der Akten
 * @returns {Array} Array von vorbereiteten Akten-Objekten
 */
function pickArchiveAkten(count) {
  if (!Array.isArray(ARCHIV_AKTEN) || ARCHIV_AKTEN.length === 0) {
    console.warn('ARCHIV_AKTEN ist leer oder nicht definiert.');
    return [];
  }

  return pickRandom(ARCHIV_AKTEN, count).map(normalizeAkte);
}

/**
 * Erzeugt ein Set aus mehreren unterschiedlichen Akten.
 * Öffentliche API — wird von state.js aufgerufen.
 * @param {number} count - Anzahl der Akten (Standard: 3)
 * @returns {Array} Array von Akten-Objekten
 */
function generateOfferSet(count) {
  count = count || 3;
  return pickArchiveAkten(count);
}
