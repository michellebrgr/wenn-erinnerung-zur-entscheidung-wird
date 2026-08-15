/**
 * state.js — Verwaltet localStorage und Cross-Tab-Synchronisation
 *
 * Zentraler State für Archiv- und Projektionsansicht.
 * Beide Tabs teilen sich denselben Speicherstand über localStorage.
 */

const STORAGE_KEY = 'wez-installation-state';
const MAX_MEMORY_SLOTS = 6;
const OFFER_COUNT = 3;

/** @type {Array<Function>} Listener, die bei State-Änderungen aufgerufen werden */
const subscribers = [];

/** Zuletzt bekannter Zeitstempel — für Polling-Fallback zwischen Tabs */
let lastKnownUpdatedAt = 0;

/** Cross-Tab-Sync per BroadcastChannel (ergänzt storage-Events) */
let syncChannel = null;

try {
  syncChannel = new BroadcastChannel('wez-installation-sync');
  syncChannel.onmessage = function () {
    notifySubscribers(loadState());
  };
} catch (err) {
  syncChannel = null;
}

/**
 * Sammelt Bild-IDs mit Pfad aus einer Aktenliste.
 * Bildlose Akten werden ignoriert.
 * @param {Array} akten
 * @returns {Array<string>}
 */
function collectBildIds(akten) {
  return (akten || [])
    .filter(function (akte) {
      return akte && akte.bild && akte.bildId;
    })
    .map(function (akte) {
      return akte.bildId;
    });
}

/**
 * Sammelt Katalog-Kombinationen bildloser Akten.
 * @param {Array} akten
 * @returns {Array<string>}
 */
function collectOhneBildKeys(akten) {
  return (akten || [])
    .map(ohneBildKombinationKey)
    .filter(function (key) {
      return Boolean(key);
    });
}

/**
 * Entfernt Duplikate aus einer Liste von Strings.
 * @param {Array<string>} values
 * @returns {Array<string>}
 */
function uniqueStrings(values) {
  const unique = {};
  (values || []).forEach(function (value) {
    if (value) {
      unique[value] = true;
    }
  });
  return Object.keys(unique);
}

/**
 * Sammelt Bild-IDs, die in diesem Durchlauf nicht mehr angeboten werden dürfen:
 * Bilder im Erinnerungsraum sowie nicht gewählte und verdrängte Bildakten.
 * @param {Object} state
 * @returns {Array<string>}
 */
function getExcludedBildIds(state) {
  state = state || {};
  const fromRoom = collectBildIds(state.memoryRoom);
  const used = Array.isArray(state.usedBildIds) ? state.usedBildIds : [];
  return uniqueStrings(fromRoom.concat(used));
}

/**
 * Sammelt Katalog-Kombinationen bildloser Akten, die in diesem Durchlauf nicht mehr angeboten werden dürfen.
 * @param {Object} state
 * @returns {Array<string>}
 */
function getExcludedOhneBildKeys(state) {
  state = state || {};
  const fromRoom = collectOhneBildKeys(state.memoryRoom);
  const used = Array.isArray(state.usedOhneBildKeys) ? state.usedOhneBildKeys : [];
  return uniqueStrings(fromRoom.concat(used));
}

/**
 * Hängt verwendete Bild-IDs und bildlose Katalog-Kombinationen an den State an.
 * @param {Object} state
 * @param {Array} akten
 * @returns {Object} Aktualisierter State
 */
function markAktenAsUsed(state, akten) {
  state.usedBildIds = uniqueStrings(
    (Array.isArray(state.usedBildIds) ? state.usedBildIds : []).concat(collectBildIds(akten))
  );
  state.usedOhneBildKeys = uniqueStrings(
    (Array.isArray(state.usedOhneBildKeys) ? state.usedOhneBildKeys : []).concat(collectOhneBildKeys(akten))
  );
  return state;
}

/**
 * Markiert alle Angebotsakten außer der gewählten als verwendet.
 * @param {Object} state
 * @param {string} keptAkteId
 * @returns {Object} Aktualisierter State
 */
function markUnchosenOfferAkten(state, keptAkteId) {
  const discarded = (state.currentOffer || []).filter(function (akte) {
    return akte && akte.id !== keptAkteId;
  });
  return markAktenAsUsed(state, discarded);
}

/**
 * Erzeugt den Default-State für einen frischen Start.
 * @returns {Object}
 */
function createDefaultState() {
  return {
    version: 1,
    memoryRoom: [],
    currentOffer: generateOfferSet(OFFER_COUNT, [], []),
    usedBildIds: [],
    usedOhneBildKeys: [],
    updatedAt: Date.now(),
  };
}

/**
 * Normalisiert alle Akten im State (neue Feldnamen, aktuelle data.js-Inhalte).
 * @param {Object} state
 * @returns {Object}
 */
function normalizeStateAkten(state) {
  state.currentOffer = (state.currentOffer || []).map(normalizeAkte);
  state.memoryRoom = (state.memoryRoom || []).slice(0, MAX_MEMORY_SLOTS).map(normalizeAkte);
  state.usedBildIds = Array.isArray(state.usedBildIds)
    ? state.usedBildIds.filter(function (id) {
      return Boolean(id) && String(id).indexOf('ohne-bild-') !== 0;
    })
    : [];
  state.usedOhneBildKeys = Array.isArray(state.usedOhneBildKeys)
    ? state.usedOhneBildKeys.filter(function (key) {
      return Boolean(key);
    })
    : [];
  return state;
}

/**
 * Liest den State aus localStorage oder initialisiert einen neuen.
 * @returns {Object}
 */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultState();
    }

    const parsed = JSON.parse(raw);

    if (!parsed.version || !Array.isArray(parsed.memoryRoom) || !Array.isArray(parsed.currentOffer)) {
      return createDefaultState();
    }

    return normalizeStateAkten(parsed);
  } catch (err) {
    console.warn('State konnte nicht geladen werden, Default wird verwendet:', err);
    return createDefaultState();
  }
}

/**
 * Speichert den State in localStorage und benachrichtigt Subscriber im gleichen Tab.
 * @param {Object} state
 */
function saveState(state) {
  state.updatedAt = Date.now();
  lastKnownUpdatedAt = state.updatedAt;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

  if (syncChannel) {
    syncChannel.postMessage({ updatedAt: state.updatedAt });
  }

  notifySubscribers(state);
}

/**
 * Benachrichtigt alle registrierten Listener.
 * @param {Object} state
 */
function notifySubscribers(state) {
  subscribers.forEach(function (callback) {
    callback(state);
  });
}

/**
 * Entfernt einen Callback aus der Subscriber-Liste.
 * @param {Function} callback
 */
function removeSubscriber(callback) {
  const index = subscribers.indexOf(callback);
  if (index !== -1) {
    subscribers.splice(index, 1);
  }
}

/**
 * Registriert einen Listener für State-Änderungen (eigener Tab + andere Tabs).
 * @param {Function} callback - Wird mit dem aktuellen State aufgerufen
 * @returns {Function} Unsubscribe-Funktion
 */
function subscribe(callback) {
  subscribers.push(callback);

  if (!localStorage.getItem(STORAGE_KEY)) {
    saveState(createDefaultState());
  } else {
    const state = loadState();
    lastKnownUpdatedAt = state.updatedAt || 0;
    callback(state);
  }

  return function unsubscribe() {
    removeSubscriber(callback);
  };
}

/**
 * Entfernt einen Listener.
 * @param {Function} callback
 */
function unsubscribe(callback) {
  removeSubscriber(callback);
}

/**
 * Cross-Tab-Sync: reagiert auf Änderungen aus anderen Browser-Tabs.
 */
window.addEventListener('storage', function (event) {
  if (event.key !== STORAGE_KEY) {
    return;
  }

  const state = loadState();
  lastKnownUpdatedAt = state.updatedAt || 0;
  notifySubscribers(state);
});

/**
 * Polling-Fallback: stellt sicher, dass alle Tabs denselben Erinnerungsraum sehen.
 */
setInterval(function () {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const parsed = JSON.parse(raw);
    const updatedAt = parsed.updatedAt || 0;

    if (updatedAt !== lastKnownUpdatedAt) {
      lastKnownUpdatedAt = updatedAt;
      notifySubscribers(normalizeStateAkten(parsed));
    }
  } catch (err) {
    // Ignorieren — loadState übernimmt bei Bedarf
  }
}, 500);

/**
 * Prüft, ob der Erinnerungsraum voll ist (6 Plätze belegt).
 * @param {Object} state
 * @returns {boolean}
 */
function needsDisplacement(state) {
  state = state || loadState();
  return state.memoryRoom.length >= MAX_MEMORY_SLOTS;
}

/**
 * Stellt sicher, dass currentOffer immer drei Angebots-Akten enthält.
 * @param {Object} state
 * @returns {Object} Aktualisierter State
 */
function ensureOfferSet(state) {
  state = normalizeStateAkten(state);

  if (!state.currentOffer || state.currentOffer.length < OFFER_COUNT) {
    state.currentOffer = generateOfferSet(
      OFFER_COUNT,
      getExcludedBildIds(state),
      getExcludedOhneBildKeys(state)
    );
  }

  return state;
}

/**
 * Erzeugt ein neues Angebots-Set aus 3 Akten.
 * @param {Object} state
 * @returns {Object} Aktualisierter State
 */
function refreshOfferSet(state) {
  state.currentOffer = generateOfferSet(
    OFFER_COUNT,
    getExcludedBildIds(state),
    getExcludedOhneBildKeys(state)
  );
  return state;
}

/**
 * Fügt eine Akte dem Erinnerungsraum hinzu (nur wenn Platz vorhanden).
 * Nicht gewählte Angebotsakten werden bis zum Reset nicht mehr angeboten.
 * @param {Object} state
 * @param {Object} akte
 * @returns {Object} Aktualisierter State
 */
function addToMemoryRoom(state, akte) {
  if (state.memoryRoom.length >= MAX_MEMORY_SLOTS) {
    return state;
  }
  state.memoryRoom = state.memoryRoom.concat([akte]);
  return markUnchosenOfferAkten(state, akte.id);
}

/**
 * Ersetzt eine bestehende Akte im Erinnerungsraum (Verdrängung).
 * Die verdrängte Akte und die nicht gewählten Angebotsakten werden bis zum Reset nicht mehr angeboten.
 * @param {Object} state
 * @param {Object} newAkte
 * @param {string} oldAkteId
 * @returns {Object} Aktualisierter State
 */
function replaceInMemoryRoom(state, newAkte, oldAkteId) {
  const displaced = (state.memoryRoom || []).find(function (item) {
    return item.id === oldAkteId;
  });

  state.memoryRoom = state.memoryRoom.map(function (item) {
    return item.id === oldAkteId ? newAkte : item;
  });

  if (displaced) {
    state = markAktenAsUsed(state, [displaced]);
  }

  return markUnchosenOfferAkten(state, newAkte.id);
}

/**
 * Setzt den gesamten State zurück (für Installation/Reset).
 */
function resetState() {
  const fresh = createDefaultState();
  saveState(fresh);
  return fresh;
}
