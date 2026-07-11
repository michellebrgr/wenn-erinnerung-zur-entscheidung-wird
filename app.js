/**
 * app.js — Steuert das Archivinterface (Laptop)
 *
 * Zeigt 3 wählbare Akten und bei vollem Speicher den Erinnerungsraum zur Verdrängung.
 */

(function () {
  'use strict';

  const offerSection = document.getElementById('offer-section');
  const offerContainer = document.getElementById('offer-container');
  const displacementSection = document.getElementById('displacement-section');
  const pendingAktePreview = document.getElementById('pending-akte-preview');
  const archiveMemoryRoom = document.getElementById('archive-memory-room');
  const displacementCancel = document.getElementById('displacement-cancel');
  const resetInstallation = document.getElementById('reset-installation');

  /** Aktuell im Speicher gehaltener State (Referenz) */
  let currentState = null;

  /** Akte, die auf Verdrängung wartet (wenn Speicher voll) */
  let pendingAkte = null;

  /** 'offer' | 'displacement' */
  let viewMode = 'offer';

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
   * Bereich 2: Bild oder Platzhalter.
   * Bildpfad pro Akte in data.js im Feld `bild` eintragen.
   * @param {string|null} bild
   * @returns {string}
   */
  function renderAkteImage(bild) {
    if (bild) {
      return (
        '<figure class="akte-card__figure">' +
        '<img class="akte-card__image" src="' + escapeHtml(bild) + '" alt="">' +
        '</figure>'
      );
    }

    return (
      '<figure class="akte-card__figure">' +
      '<div class="akte-card__image-placeholder">Kein Bild vorhanden</div>' +
      '</figure>'
    );
  }

  /**
   * Bereich 5: Bewertungskriterien mit Kategorie und Text.
   * @param {Object} akte
   * @returns {string}
   */
  function renderCriteria(akte) {
    const kriterien = Array.isArray(akte.bewertungskriterien) ? akte.bewertungskriterien : [];

    if (kriterien.length === 0) {
      return '<li class="criterion"><span class="criterion__value">—</span></li>';
    }

    return kriterien.map(function (item) {
      if (typeof item === 'string') {
        return '<li class="criterion"><span class="criterion__value">' + escapeHtml(item) + '</span></li>';
      }

      return (
        '<li class="criterion">' +
        '<span class="criterion__label">' + escapeHtml(item.label) + '</span>' +
        '<span class="criterion__value">' + escapeHtml(item.text) + '</span>' +
        '</li>'
      );
    }).join('');
  }

  /**
   * Bereich 4: Objekttyp, Herkunft, Provenienz, Sammlung.
   * @param {Object} akte
   * @param {boolean} compact - Weniger Felder für kompakte Darstellung
   * @returns {string}
   */
  function renderMetaList(akte, compact) {
    const fields = compact
      ? [
          ['Objekttyp', akte.objekttyp],
          ['Herkunft', akte.herkunft],
        ]
      : [
          ['Objekttyp', akte.objekttyp],
          ['Herkunft', akte.herkunft],
          ['Provenienz', akte.provenienz],
          ['Sammlung', akte.sammlung],
        ];

    const items = fields.map(function (field) {
      return '<li><strong>' + escapeHtml(field[0]) + '</strong>: ' + escapeHtml(formatValue(field[1])) + '</li>';
    });

    return '<ul class="akte-card__meta" aria-label="Archivdaten">' + items.join('') + '</ul>';
  }

  /**
   * Rendert eine Archivkarte mit fünf Bereichen.
   * @param {Object} akte
   * @param {Object} options
   * @param {string} options.variant - 'selectable' oder 'pending'
   * @param {boolean} [options.compact=false]
   * @returns {string}
   */
  function renderAkteCard(akte, options) {
    const variant = options.variant;
    const compact = options.compact || false;
    const isSelectable = variant === 'selectable';
    const cardClass = isSelectable ? 'akte-card--selectable' : 'akte-card--pending';
    const dataAttr = isSelectable ? 'data-id="' + escapeHtml(akte.id) + '"' : '';
    const actionHint = isSelectable ? 'Klicken zum Aufnehmen' : '';

    return (
      '<article class="akte-card ' + cardClass + '" role="listitem" tabindex="0" ' + dataAttr + '>' +
      '<header class="akte-card__header">' +
      '<span class="akte-card__reference">' + escapeHtml(formatValue(akte.archivsignatur)) + '</span>' +
      '<span class="akte-card__category">' + escapeHtml(formatValue(akte.kategorie)) + '</span>' +
      '</header>' +
      '<h3 class="akte-card__title">' + escapeHtml(formatValue(akte.titel)) + '</h3>' +
      '<p class="akte-card__year">' + escapeHtml(formatValue(akte.jahr)) + '</p>' +
      renderAkteImage(akte.bild) +
      '<p class="akte-card__fragment">' + escapeHtml(formatValue(akte.kurzbeschreibung)) + '</p>' +
      renderMetaList(akte, compact) +
      '<ul class="akte-card__criteria" aria-label="Bewertungskriterien">' + renderCriteria(akte) + '</ul>' +
      (actionHint ? '<p class="akte-card__action-hint">' + actionHint + '</p>' : '') +
      '</article>'
    );
  }

  /**
   * Rendert eine wählbare Akten-Karte.
   * @param {Object} akte
   * @returns {string}
   */
  function renderOfferCard(akte) {
    return renderAkteCard(akte, { variant: 'selectable' });
  }

  /**
   * Rendert einen Speicherplatz im Archiv-Erinnerungsraum.
   * @param {Object} akte
   * @param {number} index
   * @returns {string}
   */
  function renderArchiveMemorySlot(akte, index) {
    const ariaLabel = 'Platz ' + (index + 1) + ': ' + formatValue(akte.archivsignatur);

    return (
      '<article class="archive-memory-slot archive-memory-slot--filled archive-memory-slot--displacement" ' +
      'role="listitem" tabindex="0" aria-label="' + escapeHtml(ariaLabel) + '" ' +
      'data-displace-id="' + escapeHtml(akte.id) + '">' +
      '<div class="archive-memory-slot__reference">' + escapeHtml(formatValue(akte.archivsignatur)) + '</div>' +
      '<div class="archive-memory-slot__category">' + escapeHtml(formatValue(akte.kategorie)) + '</div>' +
      '<div class="archive-memory-slot__title">' + escapeHtml(formatValue(akte.titel)) + '</div>' +
      '<div class="archive-memory-slot__meta">' +
      '<span><strong>Objekttyp</strong>: ' + escapeHtml(formatValue(akte.objekttyp)) + '</span>' +
      '<span><strong>Jahr</strong>: ' + escapeHtml(formatValue(akte.jahr)) + '</span>' +
      '<span><strong>Herkunft</strong>: ' + escapeHtml(formatValue(akte.herkunft)) + '</span>' +
      '</div>' +
      '<p class="archive-memory-slot__fragment">' + escapeHtml(truncateText(formatValue(akte.kurzbeschreibung), 180)) + '</p>' +
      '<p class="archive-memory-slot__action-hint">Zum Verdrängen wählen</p>' +
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
   * Wechselt zwischen Angebots- und Verdrängungsansicht.
   * @param {'offer'|'displacement'} mode
   */
  function setViewMode(mode) {
    viewMode = mode;
    const isDisplacement = mode === 'displacement';
    offerSection.hidden = isDisplacement;
    displacementSection.hidden = !isDisplacement;
  }

  /**
   * Zeigt den gemeinsamen Erinnerungsraum zur Verdrängung auf der Archivseite.
   * @param {Object} akte - Die neu gewählte Akte
   * @param {Array} memoryRoom - Aktuell belegte Plätze
   */
  function showDisplacementView(akte, memoryRoom) {
    pendingAkte = akte;
    setViewMode('displacement');

    pendingAktePreview.innerHTML =
      '<p class="pending-akte-preview__label">Neu ausgewählte Akte</p>' +
      renderAkteCard(akte, { variant: 'pending', compact: true });

    archiveMemoryRoom.innerHTML = memoryRoom.map(renderArchiveMemorySlot).join('');

    archiveMemoryRoom.querySelectorAll('.archive-memory-slot--displacement').forEach(function (slot) {
      slot.addEventListener('click', function () {
        handleDisplacement(slot.getAttribute('data-displace-id'));
      });
      slot.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleDisplacement(slot.getAttribute('data-displace-id'));
        }
      });
    });
  }

  /**
   * Beendet die Verdrängungsansicht und kehrt zum Angebots-Set zurück.
   */
  function exitDisplacementView() {
    pendingAkte = null;
    pendingAktePreview.innerHTML = '';
    archiveMemoryRoom.innerHTML = '';
    setViewMode('offer');

    if (currentState) {
      renderOfferSet(ensureOfferSet(currentState).currentOffer);
    }
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
      showDisplacementView(akte, currentState.memoryRoom);
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

    const newAkte = pendingAkte;
    exitDisplacementView();

    let state = loadState();
    state = replaceInMemoryRoom(state, newAkte, oldAkteId);
    state = refreshOfferSet(state);
    saveState(state);
  }

  /**
   * Aktualisiert die gesamte UI anhand des State.
   * @param {Object} state
   */
  function render(state) {
    currentState = state;
    state = ensureOfferSet(state);

    if (viewMode === 'displacement' && pendingAkte) {
      showDisplacementView(pendingAkte, state.memoryRoom);
      return;
    }

    renderOfferSet(state.currentOffer);
  }

  /**
   * Setzt die Installation zurück (Erinnerungsraum und Angebots-Set).
   */
  function handleResetInstallation() {
    const confirmed = window.confirm(
      'Installation wirklich zurücksetzen? Der Erinnerungsraum und alle bisherigen Entscheidungen werden gelöscht.'
    );

    if (!confirmed) {
      return;
    }

    if (viewMode === 'displacement') {
      exitDisplacementView();
    }

    resetState();
  }

  /**
   * Initialisierung.
   */
  function init() {
    displacementCancel.addEventListener('click', exitDisplacementView);
    resetInstallation.addEventListener('click', handleResetInstallation);

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && viewMode === 'displacement') {
        exitDisplacementView();
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
