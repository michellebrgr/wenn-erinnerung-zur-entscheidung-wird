/**
 * projection.js — Steuert die Projektionsansicht (Beamer)
 *
 * Zeigt den gemeinsamen Erinnerungsraum mit maximal 6 Plätzen.
 * Reagiert live auf State-Änderungen aus localStorage (Cross-Tab-Sync).
 * Animation nur an der Kachel, die hinzukommt oder ersetzt wird.
 */

(function () {
  'use strict';

  const memoryRoomEl = document.getElementById('memory-room');
  const SLOT_COUNT = 6;
  const FADE_OUT_MS = 2000;

  /** IDs der zuletzt gerenderten Akten in State-Reihenfolge */
  let previousIds = [];
  let hasPainted = false;
  let fadeTimer = null;

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
   * Setzt die Portrait-Klasse anhand der natürlichen Bildmaße.
   * @param {HTMLImageElement} img
   * @param {string} portraitClass
   */
  function applyImageOrientation(img, portraitClass) {
    function set() {
      img.classList.toggle(portraitClass, img.naturalHeight > img.naturalWidth);
    }
    if (img.complete && img.naturalWidth) {
      set();
    } else {
      img.addEventListener('load', set);
    }
  }

  /**
   * Wendet Orientierungs-Klassen auf alle Bilder in einem Container an.
   * @param {Element} root
   * @param {string} selector
   * @param {string} portraitClass
   */
  function applyImageOrientationsIn(root, selector, portraitClass) {
    if (!root) {
      return;
    }
    root.querySelectorAll(selector).forEach(function (img) {
      applyImageOrientation(img, portraitClass);
    });
  }

  /**
   * @returns {boolean}
   */
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Prüft, ob zwei ID-Listen dieselbe Reihenfolge haben.
   * @param {string[]} a
   * @param {string[]} b
   * @returns {boolean}
   */
  function idsEqualList(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Bricht eine laufende Fade-Sequenz ab.
   */
  function clearFadeTimer() {
    if (fadeTimer) {
      clearTimeout(fadeTimer);
      fadeTimer = null;
    }
  }

  /**
   * Ermittelt, ob ein einzelner Slot hinzugefügt oder ersetzt wurde.
   * @param {string[]} prevIds
   * @param {string[]} nextIds
   * @returns {{type: 'add'|'replace'|'full', index: number}}
   */
  function diffSlots(prevIds, nextIds) {
    if (nextIds.length === prevIds.length + 1) {
      let isAppend = true;
      for (let i = 0; i < prevIds.length; i++) {
        if (prevIds[i] !== nextIds[i]) {
          isAppend = false;
          break;
        }
      }
      if (isAppend) {
        return { type: 'add', index: prevIds.length };
      }
    }

    if (nextIds.length === prevIds.length) {
      let changed = -1;
      let count = 0;
      for (let i = 0; i < nextIds.length; i++) {
        if (prevIds[i] !== nextIds[i]) {
          changed = i;
          count += 1;
        }
      }
      if (count === 1) {
        return { type: 'replace', index: changed };
      }
    }

    return { type: 'full', index: -1 };
  }

  /**
   * Rendert das Ausstellungsbild einer Akte.
   * Ohne Bild: Archivfragment aus aktenart.
   * @param {Object} akte
   * @returns {string}
   */
  function renderExhibitImage(akte) {
    if (akte && akte.bild) {
      return (
        '<figure class="memory-exhibit__figure">' +
        '<img class="memory-exhibit__image" src="' + escapeHtml(akte.bild) + '" alt="">' +
        '</figure>'
      );
    }

    return (
      '<figure class="memory-exhibit__figure">' +
      renderArchivDarstellung(akte, 'card') +
      '</figure>'
    );
  }

  /**
   * Rendert einen einzelnen Speicherplatz als Ausstellungsstück.
   * @param {Object|null} akte - Akte oder null für leeren Platz
   * @param {number} index - Platznummer (0–5)
   * @param {boolean} isEnter - Einblend-Animation
   * @returns {string}
   */
  function renderSlot(akte, index, isEnter) {
    const slotClass = akte ? 'memory-exhibit--filled' : 'memory-exhibit--empty';
    const enterClass = isEnter ? ' memory-exhibit--enter' : '';
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
      renderExhibitImage(akte) +
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
   * Tauscht nur einen Slot im DOM aus, ohne die übrigen Kacheln neu zu laden.
   * @param {number} index
   * @param {Object|null} akte
   * @param {boolean} isEnter
   * @returns {Element}
   */
  function mountSlot(index, akte, isEnter) {
    const wrap = document.createElement('div');
    wrap.innerHTML = renderSlot(akte, index, isEnter);
    const next = wrap.firstElementChild;
    const current = memoryRoomEl.children[index];
    if (current) {
      memoryRoomEl.replaceChild(next, current);
    } else {
      memoryRoomEl.appendChild(next);
    }
    applyImageOrientationsIn(next, '.memory-exhibit__image', 'memory-exhibit__image--portrait');
    return next;
  }

  /**
   * Zeichnet alle 6 Plätze neu (Erste Anzeige, Reload, Reset).
   * @param {Array} room
   */
  function paintAll(room) {
    const html = [];
    for (let i = 0; i < SLOT_COUNT; i++) {
      html.push(renderSlot(room[i] || null, i, false));
    }
    memoryRoomEl.innerHTML = html.join('');
    applyImageOrientationsIn(memoryRoomEl, '.memory-exhibit__image', 'memory-exhibit__image--portrait');
  }

  /**
   * Blendet eine neue Akte auf einem freien Platz ein.
   * @param {number} index
   * @param {Object} akte
   * @param {boolean} animate
   */
  function fadeInSlot(index, akte, animate) {
    mountSlot(index, akte, animate);
  }

  /**
   * Blendet die alte Akte aus und blendet die neue am selben Platz ein.
   * @param {number} index
   * @param {Object} akte
   * @param {boolean} animate
   */
  function fadeReplaceSlot(index, akte, animate) {
    if (!animate) {
      mountSlot(index, akte, false);
      return;
    }

    const current = memoryRoomEl.children[index];
    if (!current) {
      mountSlot(index, akte, true);
      return;
    }

    current.classList.add('memory-exhibit--exit');
    fadeTimer = setTimeout(function () {
      mountSlot(index, akte, true);
      fadeTimer = null;
    }, FADE_OUT_MS);
  }

  /**
   * Rendert den gesamten Erinnerungsraum (6 feste Plätze in State-Reihenfolge).
   * @param {Array} memoryRoom - Array belegter Akten
   */
  function renderMemoryRoom(memoryRoom) {
    const room = memoryRoom || [];
    const currentIds = room.map(function (a) { return a.id; });

    if (hasPainted && idsEqualList(currentIds, previousIds)) {
      return;
    }

    clearFadeTimer();

    if (!hasPainted) {
      paintAll(room);
      hasPainted = true;
      previousIds = currentIds;
      return;
    }

    const change = diffSlots(previousIds, currentIds);
    const animate = !prefersReducedMotion();

    if (change.type === 'add') {
      fadeInSlot(change.index, room[change.index], animate);
    } else if (change.type === 'replace') {
      fadeReplaceSlot(change.index, room[change.index], animate);
    } else {
      paintAll(room);
    }

    hasPainted = true;
    previousIds = currentIds;
  }

  /**
   * Wendet den Hell- oder Dunkelmodus auf die Projektion an.
   * @param {boolean} isLight
   */
  function applyLightMode(isLight) {
    document.body.classList.toggle('projection-view--light', isLight);
  }

  /**
   * Shift+L ohne Cmd/Ctrl/Alt, unabhängig von Caps Lock und Tastaturlayout.
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  function isShiftL(event) {
    return event.shiftKey &&
      !event.altKey &&
      !event.metaKey &&
      !event.ctrlKey &&
      (event.code === 'KeyL' || event.key === 'L' || event.key === 'l');
  }

  /**
   * Initialisierung: State abonnieren und bei Änderungen neu rendern.
   */
  function init() {
    applyLightMode(isProjectionLight());
    onProjectionLightChange(applyLightMode);

    document.addEventListener('keydown', function (e) {
      if (!isShiftL(e)) {
        return;
      }
      e.preventDefault();
      applyLightMode(toggleProjectionLight());
    });

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
