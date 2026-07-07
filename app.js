/**
 * app.js — Steuert das Archivinterface (Laptop)
 *
 * Zeigt 3 wählbare Akten, Vorschau des Erinnerungsraums
 * und den Verdrängungsdialog bei vollem Speicher.
 */

(function () {
  'use strict';

  const offerContainer = document.getElementById('offer-container');
  const memoryPreview = document.getElementById('memory-preview');
  const roomCountEl = document.getElementById('room-count');
  const modal = document.getElementById('displacement-modal');
  const displacementOptions = document.getElementById('displacement-options');
  const modalCancel = document.getElementById('modal-cancel');

  /** Aktuell im Speicher gehaltener State (Referenz) */
  let currentState = null;

  /** Akte, die auf Verdrängung wartet (wenn Speicher voll) */
  let pendingAkte = null;

  /**
   * Escaped HTML-Sonderzeichen.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Rendert eine wählbare Akten-Karte.
   * @param {Object} akte
   * @returns {string}
   */
  function renderOfferCard(akte) {
    return (
      '<article class="akte-card akte-card--selectable" role="listitem" tabindex="0" data-id="' + escapeHtml(akte.id) + '">' +
      '<header class="akte-card__header">' +
      '<span class="akte-card__reference">' + escapeHtml(akte.inventoryNumber) + '</span>' +
      '<span class="akte-card__category">' + escapeHtml(akte.category) + '</span>' +
      '</header>' +
      '<h3 class="akte-card__title">' + escapeHtml(akte.title) + '</h3>' +
      '<ul class="akte-card__meta" aria-label="Archivdaten">' +
      '<li><strong>Objekttyp</strong>: ' + escapeHtml(akte.objectType) + '</li>' +
      '<li><strong>Jahr</strong>: ' + escapeHtml(String(akte.year)) + '</li>' +
      '<li><strong>Material</strong>: ' + escapeHtml(akte.material) + '</li>' +
      '<li><strong>Herkunft</strong>: ' + escapeHtml(akte.origin) + '</li>' +
      '<li><strong>Zustand</strong>: ' + escapeHtml(akte.condition) + '</li>' +
      '<li><strong>Sichtbarkeit</strong>: ' + escapeHtml(akte.visibility) + '</li>' +
      '</ul>' +
      '<p class="akte-card__fragment">' + escapeHtml(akte.shortText) + '</p>' +
      '<p class="akte-card__action-hint">Klicken zum Aufnehmen</p>' +
      '</article>'
    );
  }

  /**
   * Rendert eine Akte im Verdrängungsdialog (kompakter).
   * @param {Object} akte
   * @returns {string}
   */
  function renderDisplacementCard(akte) {
    return (
      '<article class="akte-card akte-card--displacement" role="listitem" tabindex="0" data-displace-id="' + escapeHtml(akte.id) + '">' +
      '<header class="akte-card__header">' +
      '<span class="akte-card__reference">' + escapeHtml(akte.inventoryNumber) + '</span>' +
      '<span class="akte-card__category">' + escapeHtml(akte.category) + '</span>' +
      '</header>' +
      '<h3 class="akte-card__title">' + escapeHtml(akte.title) + '</h3>' +
      '<ul class="akte-card__meta" aria-label="Archivdaten">' +
      '<li><strong>Objekttyp</strong>: ' + escapeHtml(akte.objectType) + '</li>' +
      '<li><strong>Jahr</strong>: ' + escapeHtml(String(akte.year)) + '</li>' +
      '<li><strong>Zustand</strong>: ' + escapeHtml(akte.condition) + '</li>' +
      '<li><strong>Sichtbarkeit</strong>: ' + escapeHtml(akte.visibility) + '</li>' +
      '</ul>' +
      '<p class="akte-card__fragment">' + escapeHtml(akte.shortText) + '</p>' +
      '<p class="akte-card__action-hint">Zum Verdrängen wählen</p>' +
      '</article>'
    );
  }

  /**
   * Rendert die 3 aktuellen Angebots-Akten.
   * @param {Array} offer
   */
  function renderOfferSet(offer) {
    offerContainer.innerHTML = offer.map(renderOfferCard).join('');

    offerContainer.querySelectorAll('.akte-card--selectable').forEach(function (card) {
      card.addEventListener('click', function () {
        handleSelect(card.getAttribute('data-id'));
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleSelect(card.getAttribute('data-id'));
        }
      });
    });
  }

  /**
   * Rendert die Vorschau des Erinnerungsraums (6 Plätze).
   * @param {Array} memoryRoom
   */
  function renderMemoryPreview(memoryRoom) {
    const slots = [];

    for (let i = 0; i < MAX_MEMORY_SLOTS; i++) {
      const akte = memoryRoom[i];

      if (akte) {
        slots.push(
          '<div class="preview-slot preview-slot--filled" role="listitem">' +
          '<div class="preview-slot__ref">' + escapeHtml(akte.inventoryNumber) + '</div>' +
          '<p class="preview-slot__text">' + escapeHtml(akte.shortText) + '</p>' +
          '</div>'
        );
      } else {
        slots.push(
          '<div class="preview-slot preview-slot--empty" role="listitem">' +
          '<span>frei</span>' +
          '</div>'
        );
      }
    }

    memoryPreview.innerHTML = slots.join('');
    roomCountEl.textContent = '(' + memoryRoom.length + ' / ' + MAX_MEMORY_SLOTS + ')';
  }

  /**
   * Öffnet den Verdrängungsdialog.
   * @param {Object} akte - Die neu gewählte Akte
   * @param {Array} memoryRoom - Aktuell belegte Plätze
   */
  function openDisplacementModal(akte, memoryRoom) {
    pendingAkte = akte;
    displacementOptions.innerHTML = memoryRoom.map(renderDisplacementCard).join('');

    displacementOptions.querySelectorAll('.akte-card--displacement').forEach(function (card) {
      card.addEventListener('click', function () {
        handleDisplacement(card.getAttribute('data-displace-id'));
      });
      card.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleDisplacement(card.getAttribute('data-displace-id'));
        }
      });
    });

    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
  }

  /**
   * Schließt den Verdrängungsdialog.
   */
  function closeDisplacementModal() {
    pendingAkte = null;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    displacementOptions.innerHTML = '';
  }

  /**
   * Verarbeitet die Auswahl einer Akte aus dem Angebots-Set.
   * @param {string} akteId
   */
  function handleSelect(akteId) {
    const akte = currentState.currentOffer.find(function (a) {
      return a.id === akteId;
    });

    if (!akte) {
      return;
    }

    if (needsDisplacement(currentState)) {
      openDisplacementModal(akte, currentState.memoryRoom);
      return;
    }

    let state = loadState();
    state = addToMemoryRoom(state, akte);
    state = refreshOfferSet(state);
    saveState(state);
  }

  /**
   * Verarbeitet die Verdrängung einer bestehenden Akte.
   * @param {string} oldAkteId
   */
  function handleDisplacement(oldAkteId) {
    if (!pendingAkte) {
      return;
    }

    let state = loadState();
    state = replaceInMemoryRoom(state, pendingAkte, oldAkteId);
    state = refreshOfferSet(state);
    saveState(state);
    closeDisplacementModal();
  }

  /**
   * Aktualisiert die gesamte UI anhand des State.
   * @param {Object} state
   */
  function render(state) {
    currentState = state;
    state = ensureOfferSet(state);
    renderOfferSet(state.currentOffer);
    renderMemoryPreview(state.memoryRoom);
  }

  /**
   * Initialisierung.
   */
  function init() {
    modalCancel.addEventListener('click', closeDisplacementModal);

    modal.querySelector('.modal-backdrop').addEventListener('click', closeDisplacementModal);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !modal.hidden) {
        closeDisplacementModal();
      }
    });

    subscribe(function (state) {
      render(state);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
