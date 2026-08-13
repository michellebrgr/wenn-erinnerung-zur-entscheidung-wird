/**
 * archiv-darstellung.js — Archivfragmente für bildlose Akten
 *
 * Klare Papierformate im Bildbereich: Zettel, Ausschnitt, Blatt,
 * digitaler Ausdruck, Lücke. Sehr wenig Text: Stempel + Vermerk oder Textfetzen.
 */

(function (global) {
  'use strict';

  /**
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  /**
   * @returns {Array}
   */
  function getArten() {
    if (typeof getArchivAktenarten === 'function') {
      return getArchivAktenarten();
    }
    return Array.isArray(global.ARCHIV_AKTENARTEN) ? global.ARCHIV_AKTENARTEN : [];
  }

  /**
   * @param {Object} akte
   * @returns {Object|null}
   */
  function resolveAktenartEntry(akte) {
    var arten = getArten();
    var key = akte && akte.aktenart;

    if (!key && typeof pickAktenartByHash === 'function') {
      key = pickAktenartByHash(akte && akte.id ? akte.id : '', akte);
    }

    for (var i = 0; i < arten.length; i++) {
      if (arten[i].key === key) {
        return arten[i];
      }
    }

    return arten.length > 0 ? arten[0] : null;
  }

  /**
   * Fragmentarischer Textauszug für Dokumentfragment.
   * @param {string} text
   * @returns {string}
   */
  function makeTextauszug(text) {
    var raw = String(text || '').replace(/\s+/g, ' ').trim();
    if (!raw) {
      return '…';
    }

    var max = 140;
    if (raw.length <= max) {
      return raw;
    }

    var slice = raw.slice(0, max);
    var breakAt = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf(', '), slice.lastIndexOf(' '));
    if (breakAt > 60) {
      slice = slice.slice(0, breakAt);
    }

    return slice.replace(/[.,;:\s]+$/, '') + ' …';
  }

  /**
   * Rendert das Archivfragment für eine bildlose Akte.
   * @param {Object} akte
   * @param {'card'|'projection'} [context='card']
   * @returns {string}
   */
  function renderArchivDarstellung(akte, context) {
    var ctx = context === 'projection' ? 'projection' : 'card';
    var entry = resolveAktenartEntry(akte);

    if (!entry) {
      return (
        '<div class="archiv-fragment archiv-fragment--' + ctx +
        '" role="img" aria-label="Archivfragment ohne Bild"></div>'
      );
    }

    var isDokumentfragment = entry.key === 'dokumentfragment';
    var usesSheet = entry.key !== 'ueberlieferungsluecke';
    var bodyHtml = '';

    if (isDokumentfragment) {
      var source = (akte && akte.kontextbeschreibung) || (akte && akte.kurzbeschreibung) || '';
      bodyHtml = '<p class="archiv-fragment__body archiv-fragment__excerpt">' +
        escapeHtml(makeTextauszug(source)) + '</p>';
    } else if (entry.vermerk) {
      bodyHtml = '<p class="archiv-fragment__body">' + escapeHtml(entry.vermerk) + '</p>';
    }

    var inner =
      '<span class="archiv-fragment__art">' + escapeHtml(entry.label || '') + '</span>' +
      '<div class="archiv-fragment__content">' + bodyHtml + '</div>';

    if (usesSheet) {
      inner = '<div class="archiv-fragment__sheet">' + inner + '</div>';
    }

    var aria = (entry.label || 'Archivfragment') +
      (entry.vermerk ? ': ' + entry.vermerk : '');

    return (
      '<div class="archiv-fragment archiv-fragment--' + escapeHtml(entry.key) +
      ' archiv-fragment--' + ctx +
      '" role="img" aria-label="' + escapeHtml(aria) + '">' +
      inner +
      '</div>'
    );
  }

  global.renderArchivDarstellung = renderArchivDarstellung;
})(typeof window !== 'undefined' ? window : this);
