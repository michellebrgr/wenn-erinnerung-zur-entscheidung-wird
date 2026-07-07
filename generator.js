/**
 * generator.js — Erzeugt Archivakten aus statischen Inhalten
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt Daten aus data.js (CATEGORIES, OBJECT_TYPES, MATERIALS, ORIGINS, CONDITIONS, VISIBILITIES,
 * TITLE_TEMPLATES, SHORTTEXT_POOL, CRITERIA_DEFINITIONS, REFERENCE_PREFIX).
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
 * Ersetzt Platzhalter in einer Template-String.
 * Unterstützt: {objectType}, {material}, {category}, {year}
 * @param {string} template
 * @param {Object} vars
 * @returns {string}
 */
function fillTemplate(template, vars) {
  return String(template)
    .replaceAll('{objectType}', vars.objectType)
    .replaceAll('{material}', vars.material)
    .replaceAll('{category}', vars.category)
    .replaceAll('{year}', String(vars.year));
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
 * Erzeugt eine Inventarnummer im Format WEZ-JAHR-NUMMER.
 * @returns {string}
 */
function generateInventoryNumber() {
  const year = new Date().getFullYear();
  const number = String(Math.floor(Math.random() * 900) + 100);
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
 * Erzeugt ein plausibles Jahr, leicht auf jüngere Jahre gewichtet.
 * @returns {number}
 */
function generateYear() {
  const current = new Date().getFullYear();
  const min = 1970;
  const span = Math.max(0, current - min);
  const r = Math.random();
  const offset = Math.floor((r * r) * (span + 1));
  return current - offset;
}

/**
 * Setzt 1–2 Bausteine zu einem kurzen Beschreibungstext zusammen.
 * @returns {string}
 */
function composeShortText() {
  const count = Math.random() > 0.45 ? 2 : 1;
  const parts = pickRandom(SHORTTEXT_POOL, count);
  return parts.join(' ');
}

/**
 * Erzeugt einen Titel aus Template + gewählten Variablen.
 * @param {{objectType: string, material: string, category: string, year: number}} vars
 * @returns {string}
 */
function generateTitle(vars) {
  const template = pickRandom(TITLE_TEMPLATES, 1)[0];
  return fillTemplate(template, vars);
}

/**
 * Erzeugt eine vollständige Archivakte.
 * @returns {Object} ArchiveFile-Objekt
 */
function generateArchiveFile() {
  const category = pickRandom(CATEGORIES, 1)[0];
  const objectType = pickRandom(OBJECT_TYPES, 1)[0];
  const material = pickRandom(MATERIALS, 1)[0];
  const origin = pickRandom(ORIGINS, 1)[0];
  const condition = pickRandom(CONDITIONS, 1)[0];
  const visibility = pickRandom(VISIBILITIES, 1)[0];
  const year = generateYear();

  const title = generateTitle({ objectType: objectType, material: material, category: category, year: year });
  const shortText = composeShortText();

  return {
    id: generateId(),
    inventoryNumber: generateInventoryNumber(),
    title: title,
    category: category,
    objectType: objectType,
    year: year,
    material: material,
    origin: origin,
    condition: condition,
    visibility: visibility,
    shortText: shortText,

    // intern: bleibt erhalten, wird aber nicht mehr gerendert
    criteria: generateCriteria(),
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
