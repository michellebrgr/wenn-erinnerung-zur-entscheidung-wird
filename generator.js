/**
 * generator.js — Erzeugt Archivakten aus statischen Inhalten
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt Daten aus data.js (CATEGORIES, FRAGMENT_POOL, CRITERIA_DEFINITIONS, REFERENCE_PREFIX).
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
 * Erzeugt eine eindeutige ID für eine Akte.
 * @returns {string}
 */
function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return 'akte-' + crypto.randomUUID();
  }
  return 'akte-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
}

/**
 * Erzeugt ein Aktenzeichen im Format WEZ-JAHR-NUMMER.
 * @returns {string}
 */
function generateReference() {
  const year = new Date().getFullYear();
  const number = Math.floor(Math.random() * 900) + 100;
  return REFERENCE_PREFIX + '-' + year + '-' + number;
}

/**
 * Weist einer Akte 3–4 zufällige Bewertungskriterien mit Werten 1–5 zu.
 * @returns {Array<{key: string, label: string, value: number}>}
 */
function generateCriteria() {
  const count = Math.random() > 0.5 ? 4 : 3;
  const selected = pickRandom(CRITERIA_DEFINITIONS, count);

  return selected.map(function (def) {
    return {
      key: def.key,
      label: def.label,
      value: Math.floor(Math.random() * 5) + 1,
    };
  });
}

/**
 * Setzt 1–2 Fragmente aus dem Pool zu einem Erinnerungstext zusammen.
 * @returns {string}
 */
function composeFragment() {
  const count = Math.random() > 0.4 ? 2 : 1;
  const parts = pickRandom(FRAGMENT_POOL, count);
  return parts.join(' ');
}

/**
 * Erzeugt eine vollständige Archivakte.
 * @returns {Object} ArchiveFile-Objekt
 */
function generateArchiveFile() {
  return {
    id: generateId(),
    reference: generateReference(),
    category: pickRandom(CATEGORIES, 1)[0],
    fragment: composeFragment(),
    criteria: generateCriteria(),
    createdAt: Date.now(),
  };
}

/**
 * Erzeugt ein Set aus mehreren unterschiedlichen Akten.
 * @param {number} count - Anzahl der Akten (Standard: 3)
 * @returns {Array} Array von ArchiveFile-Objekten
 */
function generateOfferSet(count) {
  count = count || 3;
  const files = [];

  for (let i = 0; i < count; i++) {
    files.push(generateArchiveFile());
  }

  return files;
}
