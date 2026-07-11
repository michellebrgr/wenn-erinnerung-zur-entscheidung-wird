/**
 * generator.js — Wählt Archivakten aus dem Datenbestand
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt ARCHIV_BILDER aus data.js.
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
 * Erzeugt ein Akten-Objekt aus Bild und Variante.
 * @param {Object} bild - Eintrag aus ARCHIV_BILDER
 * @param {Object} variante - Variante des Bildes
 * @returns {Object}
 */
function buildAkte(bild, variante) {
  const jahr = variante.jahr != null ? variante.jahr : null;

  return {
    id: bild.id + '--' + variante.id,
    bildId: bild.id,
    varianteId: variante.id,
    archivsignatur: variante.archivsignatur || generateArchivsignatur(jahr),
    kategorie: variante.kategorie || null,
    titel: variante.titel || null,
    jahr: jahr,
    bild: bild.pfad != null ? bild.pfad : null,
    kurzbeschreibung: variante.kurzbeschreibung || null,
    objekttyp: variante.objekttyp || null,
    herkunft: variante.herkunft || null,
    provenienz: variante.provenienz || null,
    sammlung: variante.sammlung || null,
    institutionelleRelevanz: variante.institutionelleRelevanz || null,
    dokumentationsgrad: variante.dokumentationsgrad || null,
    erhaltungszustand: variante.erhaltungszustand || null,
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
  const fromData = lookup.bild && lookup.variante ? buildAkte(lookup.bild, lookup.variante) : null;
  const src = fromData || akte;
  const jahr = src.jahr != null ? src.jahr : (akte.jahr != null ? akte.jahr : (akte.year != null ? akte.year : null));

  return {
    id: src.id || akte.id,
    bildId: src.bildId || akte.bildId || null,
    varianteId: src.varianteId || akte.varianteId || null,
    archivsignatur: akte.archivsignatur || src.archivsignatur || akte.inventoryNumber || akte.reference || generateArchivsignatur(jahr),
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
 * Wählt zufällig Bilder aus ARCHIV_BILDER (ohne Duplikate).
 * @param {Array} bilder - Quell-Array
 * @param {number} count - Anzahl der Bilder
 * @returns {Array}
 */
function pickArchiveBilder(bilder, count) {
  return pickRandom(bilder, count);
}

/**
 * Wählt zufällig mehrere Archivakten aus ARCHIV_BILDER.
 * Zuerst Bilder mit Pfad, dann bei Bedarf Einträge ohne Bild.
 * @param {number} count - Anzahl der Akten
 * @param {Array<string>} [excludedBildIds] - Bild-IDs, die bereits im Erinnerungsraum sind
 * @returns {Array} Array von vorbereiteten Akten-Objekten
 */
function pickArchiveAkten(count, excludedBildIds) {
  if (!Array.isArray(ARCHIV_BILDER) || ARCHIV_BILDER.length === 0) {
    console.warn('ARCHIV_BILDER ist leer oder nicht definiert.');
    return [];
  }

  const excluded = new Set(excludedBildIds || []);

  const mitBild = ARCHIV_BILDER.filter(function (b) {
    return b.pfad && !excluded.has(b.id);
  });
  const ohneBild = ARCHIV_BILDER.filter(function (b) {
    return !b.pfad && !excluded.has(b.id);
  });

  const pickedMitBild = pickArchiveBilder(mitBild, Math.min(count, mitBild.length));
  let akten = pickedMitBild.map(function (bild) {
    const variante = pickRandom(bild.varianten, 1)[0];
    return buildAkte(bild, variante);
  });

  const remaining = count - akten.length;
  if (remaining > 0 && ohneBild.length > 0) {
    const pickedOhneBild = pickArchiveBilder(ohneBild, Math.min(remaining, ohneBild.length));
    akten = akten.concat(pickedOhneBild.map(function (bild) {
      const variante = pickRandom(bild.varianten, 1)[0];
      return buildAkte(bild, variante);
    }));
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
