/**
 * archiv-darstellung.js — Archivfragmente für bildlose Akten
 *
 * Klare Papierformate im Bildbereich: Zettel, Ausschnitt, Blatt,
 * digitaler Ausdruck, Lücke. Sehr wenig Text: Stempel + Vermerk oder Textfetzen.
 */

(function (global) {
  'use strict';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function getArten() {
    if (typeof getArchivAktenarten === 'function') {
      return getArchivAktenarten();
    }
    return Array.isArray(global.ARCHIV_AKTENARTEN) ? global.ARCHIV_AKTENARTEN : [];
  }

  function canonicalKey(key) {
    if (typeof canonicalAktenartKey === 'function') {
      return canonicalAktenartKey(key);
    }
    return key === 'dokumentationsfragment' ? 'dokumentfragment' : key;
  }

  function vermerkeOf(art) {
    if (typeof getAktenartVermerke === 'function') {
      return getAktenartVermerke(art);
    }
    if (!art) {
      return [];
    }
    if (Array.isArray(art.vermerke) && art.vermerke.length) {
      return art.vermerke;
    }
    return art.vermerk ? [art.vermerk] : [];
  }

  function resolveAktenartEntry(akte) {
    var arten = getArten();
    var key = canonicalKey(akte && akte.aktenart);

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

  function resolveFragmentBody(akte, entry) {
    if (entry.key === 'dokumentfragment') {
      if (akte && akte.fragmentText) {
        return akte.fragmentText;
      }
      if (typeof pickDokumentationsfragment === 'function') {
        return pickDokumentationsfragment(akte && akte.kategorie, akte && akte.id) || '…';
      }
      return '…';
    }

    if (akte && akte.aktenvermerk) {
      return akte.aktenvermerk;
    }

    var vermerke = vermerkeOf(entry);
    if (vermerke.length === 0) {
      return '';
    }
    if (typeof pickAktenvermerk === 'function') {
      return pickAktenvermerk(entry.key, akte && akte.id) || vermerke[0];
    }
    return vermerke[0];
  }

  function renderArchivDarstellung(akte, context) {
    var ctx = context === 'projection' ? 'projection' : 'card';
    var entry = resolveAktenartEntry(akte);

    if (!entry) {
      return (
        '<div class="archiv-fragment archiv-fragment--' + ctx +
        '" role="img" aria-label="Archivfragment ohne Bild"></div>'
      );
    }

    var bodyText = resolveFragmentBody(akte, entry);
    var isDokumentfragment = entry.key === 'dokumentfragment';
    var usesSheet = entry.key !== 'ueberlieferungsluecke';
    var bodyHtml = '';

    if (bodyText) {
      bodyHtml = '<p class="archiv-fragment__body' +
        (isDokumentfragment ? ' archiv-fragment__excerpt' : '') + '">' +
        escapeHtml(bodyText) + '</p>';
    }

    var inner =
      '<span class="archiv-fragment__art">' + escapeHtml(entry.label || '') + '</span>' +
      '<div class="archiv-fragment__content">' + bodyHtml + '</div>';

    if (usesSheet) {
      inner = '<div class="archiv-fragment__sheet">' + inner + '</div>';
    }

    var aria = (entry.label || 'Archivfragment') +
      (bodyText ? ': ' + bodyText : '');

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
