/**
 * projection.js — Steuert die Projektionsansicht (Beamer)
 *
 * Zeigt den gemeinsamen Erinnerungsraum mit maximal 6 Plätzen.
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
   * Gibt einen Anzeigewert zurück oder „—“ bei leeren Werten.
   * @param {*} value
   * @returns {string}
   */
  function formatValue(value) {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    return String(value);
  }

  /**
   * Rendert das Ausstellungsbild einer Akte.
   * @param {string|null} bild
   * @returns {string}
   */
  function renderExhibitImage(bild) {
    if (bild) {
      return (
        '<figure class="memory-exhibit__figure">' +
        '<img class="memory-exhibit__image" src="' + escapeHtml(bild) + '" alt="">' +
        '</figure>'
      );
    }

    return (
      '<figure class="memory-exhibit__figure">' +
      '<div class="memory-exhibit__image-placeholder" aria-hidden="true"></div>' +
      '</figure>'
    );
  }

  /**
   * Rendert einen einzelnen Speicherplatz als Ausstellungsstück.
   * @param {Object|null} akte - Akte oder null für leeren Platz
   * @param {number} index - Platznummer (0–5)
   * @param {boolean} isNew - Ob die Akte neu hinzugekommen ist
   * @returns {string}
   */
  function renderSlot(akte, index, isNew) {
    const slotClass = akte ? 'memory-exhibit--filled' : 'memory-exhibit--empty';
    const enterClass = isNew ? ' memory-exhibit--enter' : '';
    const ariaLabel = akte
      ? 'Platz ' + (index + 1) + ': ' + formatValue(akte.titel)
      : 'Platz ' + (index + 1) + ': frei';

    if (!akte) {
      return (
        '<article class="memory-exhibit ' + slotClass + '" role="listitem" aria-label="' + ariaLabel + '">' +
        '<span class="memory-exhibit__placeholder">freier Speicherplatz</span>' +
        '</article>'
      );
    }

    return (
      '<article class="memory-exhibit ' + slotClass + enterClass + '" role="listitem" aria-label="' + ariaLabel + '" data-id="' + escapeHtml(akte.id) + '">' +
      '<div class="memory-exhibit__visual">' +
      renderExhibitImage(akte.bild) +
      '<div class="memory-exhibit__sign">' +
      '<h2 class="memory-exhibit__title">' + escapeHtml(formatValue(akte.titel)) + '</h2>' +
      '<p class="memory-exhibit__year">' + escapeHtml(formatValue(akte.jahr)) + '</p>' +
      '</div>' +
      '</div>' +
      '<p class="memory-exhibit__description">' + escapeHtml(truncateText(formatValue(akte.kurzbeschreibung), 220)) + '</p>' +
      '</article>'
    );
  }

  /**
   * Rendert den gesamten Erinnerungsraum (6 feste Plätze).
   * @param {Array} memoryRoom - Array belegter Akten
   */
  function renderMemoryRoom(memoryRoom) {
    const room = memoryRoom || [];
    const currentIds = room.map(function (a) { return a.id; });
    const slots = [];

    for (let i = 0; i < SLOT_COUNT; i++) {
      const akte = room[i] || null;
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
