/**
 * projection.js — Steuert die Projektionsansicht (Beamer)
 *
 * Zeigt den öffentlichen Erinnerungsraum mit maximal 6 Plätzen.
 * Reagiert live auf State-Änderungen aus localStorage (Cross-Tab-Sync).
 */

(function () {
  'use strict';

  const memoryRoomEl = document.getElementById('memory-room');
  const SLOT_COUNT = 6;

  /** IDs der zuletzt gerenderten Akten — für Enter-Animation */
  let previousIds = [];

  /**
   * Kürzt einen Text auf maxLength Zeichen.
   * @param {string} text
   * @param {number} maxLength
   * @returns {string}
   */
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength).trim() + '…';
  }

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
   * Rendert einen einzelnen Speicherplatz.
   * @param {Object|null} akte - Akte oder null für leeren Platz
   * @param {number} index - Platznummer (0–5)
   * @param {boolean} isNew - Ob die Akte neu hinzugekommen ist
   * @returns {string}
   */
  function renderSlot(akte, index, isNew) {
    const slotClass = akte ? 'memory-slot--filled' : 'memory-slot--empty';
    const enterClass = isNew ? ' memory-slot--enter' : '';
    const ariaLabel = akte
      ? 'Platz ' + (index + 1) + ': ' + akte.inventoryNumber
      : 'Platz ' + (index + 1) + ': frei';

    if (!akte) {
      return (
        '<article class="memory-slot ' + slotClass + '" role="listitem" aria-label="' + ariaLabel + '">' +
        '<span class="memory-slot__placeholder">freier Speicherplatz</span>' +
        '</article>'
      );
    }

    return (
      '<article class="memory-slot ' + slotClass + enterClass + '" role="listitem" aria-label="' + ariaLabel + '" data-id="' + escapeHtml(akte.id) + '">' +
      '<div class="memory-slot__reference">' + escapeHtml(akte.inventoryNumber) + '</div>' +
      '<div class="memory-slot__category">' + escapeHtml(akte.category) + '</div>' +
      '<div class="memory-slot__title">' + escapeHtml(akte.title) + '</div>' +
      '<div class="memory-slot__meta">' +
      '<span><strong>Objekttyp</strong>: ' + escapeHtml(akte.objectType) + '</span>' +
      '<span><strong>Jahr</strong>: ' + escapeHtml(String(akte.year)) + '</span>' +
      '<span><strong>Material</strong>: ' + escapeHtml(akte.material) + '</span>' +
      '<span><strong>Herkunft</strong>: ' + escapeHtml(akte.origin) + '</span>' +
      '<span><strong>Zustand</strong>: ' + escapeHtml(akte.condition) + '</span>' +
      '<span><strong>Sichtbarkeit</strong>: ' + escapeHtml(akte.visibility) + '</span>' +
      '</div>' +
      '<p class="memory-slot__fragment">' + escapeHtml(truncateText(akte.shortText, 220)) + '</p>' +
      '</article>'
    );
  }

  /**
   * Rendert den gesamten Erinnerungsraum (6 feste Plätze).
   * @param {Array} memoryRoom - Array belegter Akten
   */
  function renderMemoryRoom(memoryRoom) {
    const currentIds = memoryRoom.map(function (a) { return a.id; });
    const slots = [];

    for (let i = 0; i < SLOT_COUNT; i++) {
      const akte = memoryRoom[i] || null;
      const isNew = akte && previousIds.indexOf(akte.id) === -1;
      slots.push(renderSlot(akte, i, isNew));
    }

    memoryRoomEl.innerHTML = slots.join('');
    previousIds = currentIds;
  }

  /**
   * Initialisierung: State abonnieren und bei Änderungen neu rendern.
   */
  function init() {
    subscribe(function (state) {
      renderMemoryRoom(state.memoryRoom);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
