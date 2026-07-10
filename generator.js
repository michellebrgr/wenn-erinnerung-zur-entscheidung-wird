/**
 * generator.js — Wählt Archivakten aus dem Datenbestand
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt ARCHIV_AKTEN aus data.js.
 *
 * Hinweis: app.js und projection.js erwarten noch alte Feldnamen
 * (z. B. inventoryNumber, title). normalizeAkte() mappt die neuen
 * Felder vorübergehend — bis die Darstellung angepasst wird.
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
 * Kopiert alle neuen Felder und ergänzt vorübergehend alte Anzeigenamen.
 * @param {Object} akte - Eintrag aus ARCHIV_AKTEN
 * @returns {Object}
 */
function normalizeAkte(akte) {
  return {
    // Neue Felder aus data.js (unverändert übernehmen)
    id: akte.id,
    archivsignatur: akte.archivsignatur,
    kategorie: akte.kategorie,
    titel: akte.titel,
    jahr: akte.jahr,
    bild: akte.bild,
    kurzbeschreibung: akte.kurzbeschreibung,
    objekttyp: akte.objekttyp,
    herkunft: akte.herkunft,
    provenienz: akte.provenienz,
    sammlung: akte.sammlung,
    institutionelleRelevanz: akte.institutionelleRelevanz,
    dokumentationsgrad: akte.dokumentationsgrad,
    erhaltungszustand: akte.erhaltungszustand,

    // Vorübergehende Aliase für app.js / projection.js (noch nicht umgestellt)
    inventoryNumber: akte.archivsignatur,
    category: akte.kategorie,
    title: akte.titel,
    year: akte.jahr,
    shortText: akte.kurzbeschreibung,
    objectType: akte.objekttyp,
    origin: akte.herkunft,
    condition: akte.erhaltungszustand,
    visibility: akte.dokumentationsgrad,
    material: '—',
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
