/**
 * generator.js — Wählt Archivakten aus dem Datenbestand
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt ARCHIV_AKTEN aus data.js.
 */

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

  return {
    id: src.id || akte.id,
    archivsignatur: src.archivsignatur || akte.archivsignatur || akte.inventoryNumber || akte.reference || null,
    kategorie: src.kategorie || akte.kategorie || akte.category || null,
    titel: src.titel || akte.titel || akte.title || null,
    jahr: src.jahr != null ? src.jahr : (akte.jahr != null ? akte.jahr : (akte.year != null ? akte.year : null)),
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
