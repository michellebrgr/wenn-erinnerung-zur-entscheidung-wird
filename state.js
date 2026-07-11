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
 * Sammelt Bild-IDs mit Pfad aus dem Erinnerungsraum für die Angebots-Auswahl.
 * Bildlose Akten werden nicht ausgeschlossen und dürfen mehrfach angeboten werden.
 * @param {Array} memoryRoom
 * @returns {Array<string>}
 */
function getExcludedBildIds(memoryRoom) {
  return (memoryRoom || [])
    .filter(function (akte) {
      return akte.bild;
    })
    .map(function (akte) {
      return akte.bildId;
    })
    .filter(function (id) {
      return Boolean(id);
    });
}

/**
 * Erzeugt den Default-State für einen frischen Start.
 * @returns {Object}
 */
function createDefaultState() {
  return {
    version: 1,
    memoryRoom: [],
    currentOffer: generateOfferSet(OFFER_COUNT, []),
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
    state.currentOffer = generateOfferSet(OFFER_COUNT, getExcludedBildIds(state.memoryRoom));
  }

  return state;
}

/**
 * Erzeugt ein neues Angebots-Set aus 3 Akten.
 * @param {Object} state
 * @returns {Object} Aktualisierter State
 */
function refreshOfferSet(state) {
  state.currentOffer = generateOfferSet(OFFER_COUNT, getExcludedBildIds(state.memoryRoom));
  return state;
}

/**
 * Fügt eine Akte dem Erinnerungsraum hinzu (nur wenn Platz vorhanden).
 * @param {Object} state
 * @param {Object} akte
 * @returns {Object} Aktualisierter State
 */
function addToMemoryRoom(state, akte) {
  if (state.memoryRoom.length >= MAX_MEMORY_SLOTS) {
    return state;
  }
  state.memoryRoom = state.memoryRoom.concat([akte]);
  return state;
}

/**
 * Ersetzt eine bestehende Akte im Erinnerungsraum (Verdrängung).
 * @param {Object} state
 * @param {Object} newAkte
 * @param {string} oldAkteId
 * @returns {Object} Aktualisierter State
 */
function replaceInMemoryRoom(state, newAkte, oldAkteId) {
  state.memoryRoom = state.memoryRoom.map(function (item) {
    return item.id === oldAkteId ? newAkte : item;
  });
  return state;
}

/**
 * Setzt den gesamten State zurück (für Installation/Reset).
 */
function resetState() {
  const fresh = createDefaultState();
  saveState(fresh);
  return fresh;
}
