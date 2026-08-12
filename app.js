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
  const confirmationSection = document.getElementById('confirmation-section');
  const confirmationContinue = document.getElementById('confirmation-continue');
  const memoryReviewGrid = document.getElementById('memory-review-grid');
  const memoryReviewPrev = document.getElementById('memory-review-prev');
  const memoryReviewNext = document.getElementById('memory-review-next');
  const displacementCancel = document.getElementById('displacement-cancel');
  const resetInstallation = document.getElementById('reset-installation');
  const startScreen = document.getElementById('start-screen');
  const archiveInterface = document.getElementById('archive-interface');
  const openArchiveBtn = document.getElementById('open-archive-btn');
  const memoryFullModal = document.getElementById('memory-full-modal');
  const memoryFullModalConfirm = document.getElementById('memory-full-modal-confirm');

  /** Aktuell im Speicher gehaltener State (Referenz) */
  let currentState = null;

  /** Akte, die auf Verdrängung wartet (wenn Speicher voll) */
  let pendingAkte = null;

  const MEMORY_REVIEW_PAGE_SIZE = 3;

  /** Index der aktuellen Seite im Erinnerungsraum (0–1 bei 6 Akten) */
  let memoryReviewPageIndex = 0;

  /** 'start' | 'offer' | 'displacement' | 'confirmation' */
  let viewMode = 'start';

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
   * Bildpfad pro Akte in data.js im Feld `bild` eintragen.
   * Ohne Bild: Archivfragment aus aktenart.
   * @param {Object} akte
   * @returns {string}
   */
  function renderAkteImage(akte) {
    if (akte && akte.bild) {
      return (
        '<figure class="akte-card__figure">' +
        '<img class="akte-card__image" src="' + escapeHtml(akte.bild) + '" alt="">' +
        '</figure>'
      );
    }

    return (
      '<figure class="akte-card__figure">' +
      renderArchivDarstellung(akte, 'card') +
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
   * @param {string} options.variant - 'selectable', 'pending' oder 'review'
   * @param {boolean} [options.compact=false]
   * @returns {string}
   */
  function renderAkteCard(akte, options) {
    const variant = options.variant;
    const compact = options.compact || false;
    const cardClass =
      variant === 'selectable'
        ? 'akte-card--selectable'
        : variant === 'pending'
          ? 'akte-card--pending'
          : variant === 'review'
            ? 'akte-card--review'
            : '';
    const binderHoles =
      '<div class="akte-card__binder" aria-hidden="true">' +
      '<span class="akte-card__binder-hole"></span>' +
      '<span class="akte-card__binder-hole"></span>' +
      '<span class="akte-card__binder-hole"></span>' +
      '</div>';

    return (
      '<article class="akte-card ' + cardClass + '">' +
      binderHoles +
      '<header class="akte-card__header">' +
      '<span class="akte-card__reference">' + escapeHtml(formatValue(akte.archivsignatur)) + '</span>' +
      '<span class="akte-card__category">' + escapeHtml(formatValue(akte.kategorie)) + '</span>' +
      '</header>' +
      '<h3 class="akte-card__title">' + escapeHtml(formatValue(akte.titel)) + '</h3>' +
      '<p class="akte-card__year">' + escapeHtml(formatValue(akte.jahr)) + '</p>' +
      renderAkteImage(akte) +
      '<p class="akte-card__fragment">' + escapeHtml(formatValue(akte.kurzbeschreibung)) + '</p>' +
      renderMetaList(akte, compact) +
      '<ul class="akte-card__criteria" aria-label="Bewertungskriterien">' + renderCriteria(akte) + '</ul>' +
      '</article>'
    );
  }

  /**
   * Rendert eine Spalte mit Akten-Karte und Auswahl-Button.
   * @param {Object} akte
   * @returns {string}
   */
  function renderOfferColumn(akte) {
    return (
      '<div class="archive-offer-column" role="listitem">' +
      renderAkteCard(akte, { variant: 'selectable' }) +
      '<button type="button" class="btn-archive-select" data-id="' + escapeHtml(akte.id) + '">' +
      'In den Erinnerungsraum aufnehmen' +
      '</button>' +
      '</div>'
    );
  }

  /**
   * Berechnet die Anzahl der Seiten à drei Akten.
   * @param {number} total
   * @returns {number}
   */
  function getMemoryReviewPageCount(total) {
    return Math.ceil(total / MEMORY_REVIEW_PAGE_SIZE);
  }

  /**
   * Setzt den Aktivierungszustand der Blätter-Pfeile.
   * @param {HTMLButtonElement} button
   * @param {boolean} enabled
   */
  function setMemoryReviewNavState(button, enabled) {
    button.disabled = !enabled;
    button.setAttribute('aria-disabled', enabled ? 'false' : 'true');
  }

  /**
   * Rendert eine Spalte mit Akten-Karte und Löschen-Button.
   * @param {Object} akte
   * @returns {string}
   */
  function renderDisplacementColumn(akte) {
    return (
      '<div class="archive-offer-column" role="listitem">' +
      renderAkteCard(akte, { variant: 'selectable' }) +
      '<button type="button" class="btn-memory-delete" data-id="' + escapeHtml(akte.id) + '">' +
      'Diese Akte löschen' +
      '</button>' +
      '</div>'
    );
  }

  /**
   * Leert die Verdrängungsansicht.
   */
  function clearMemoryReview() {
    memoryReviewGrid.innerHTML = '';
    setMemoryReviewNavState(memoryReviewPrev, false);
    setMemoryReviewNavState(memoryReviewNext, false);
    memoryReviewPageIndex = 0;
  }

  /**
   * Zeigt eine Seite mit bis zu drei Akten im Erinnerungsraum.
   * @param {Array} memoryRoom
   * @param {number} pageIndex
   */
  function renderMemoryReviewPage(memoryRoom, pageIndex) {
    const room = memoryRoom || [];
    const total = room.length;

    if (total === 0) {
      clearMemoryReview();
      return;
    }

    const pageCount = getMemoryReviewPageCount(total);
    const safePageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));
    memoryReviewPageIndex = safePageIndex;

    const pageAkten = room.slice(
      safePageIndex * MEMORY_REVIEW_PAGE_SIZE,
      safePageIndex * MEMORY_REVIEW_PAGE_SIZE + MEMORY_REVIEW_PAGE_SIZE
    );

    memoryReviewGrid.innerHTML = pageAkten.map(renderDisplacementColumn).join('');

    memoryReviewGrid.querySelectorAll('.btn-memory-delete').forEach(function (button) {
      button.addEventListener('click', function () {
        handleDisplacement(button.getAttribute('data-id'));
      });
    });

    setMemoryReviewNavState(memoryReviewPrev, safePageIndex > 0);
    setMemoryReviewNavState(memoryReviewNext, safePageIndex < pageCount - 1);
  }

  /**
   * Rendert die 3 aktuellen Angebots-Akten.
   * @param {Array} offer
   */
  function renderOfferSet(offer) {
    offerContainer.innerHTML = offer.map(renderOfferColumn).join('');

    offerContainer.querySelectorAll('.btn-archive-select').forEach(function (button) {
      button.addEventListener('click', function () {
        handleSelect(button.getAttribute('data-id'));
      });
    });
  }

  /**
   * Wechselt zwischen Start-, Angebots-, Verdrängungs- und Bestätigungsansicht.
   * @param {'start'|'offer'|'displacement'|'confirmation'} mode
   */
  function setViewMode(mode) {
    viewMode = mode;
    const isStart = mode === 'start';
    const isDisplacement = mode === 'displacement';
    const isConfirmation = mode === 'confirmation';

    startScreen.hidden = !isStart;
    archiveInterface.hidden = isStart;
    offerSection.hidden = isStart || isDisplacement || isConfirmation;
    displacementSection.hidden = !isDisplacement;
    confirmationSection.hidden = !isConfirmation;
  }

  /**
   * Zeigt den Bestätigungsbildschirm nach erfolgreicher Auswahl.
   */
  function showConfirmation() {
    setViewMode('confirmation');
  }

  /**
   * Schließt den Bestätigungsbildschirm und kehrt zum Startbildschirm zurück.
   */
  function dismissConfirmation() {
    setViewMode('start');
  }

  /**
   * Blendet das Archiv-Interface ein und zeigt die aktuellen Angebots-Akten.
   */
  function openArchive() {
    setViewMode('offer');

    if (currentState) {
      renderOfferSet(ensureOfferSet(currentState).currentOffer);
    }
  }

  /**
   * Blendet das Pop-up bei vollem Erinnerungsraum ein.
   * @param {Object} akte - Die neu gewählte Akte
   */
  function showMemoryFullModal(akte) {
    pendingAkte = akte;
    memoryFullModal.hidden = false;
    memoryFullModalConfirm.focus();
  }

  /**
   * Blendet das Pop-up bei vollem Erinnerungsraum aus.
   */
  function hideMemoryFullModal() {
    memoryFullModal.hidden = true;
  }

  /**
   * Bestätigt das Pop-up und öffnet die Verdrängungsansicht.
   */
  function confirmMemoryFullModal() {
    if (!pendingAkte || !currentState) {
      return;
    }

    hideMemoryFullModal();
    showDisplacementView(pendingAkte, currentState.memoryRoom);
  }

  /**
   * Zeigt den Erinnerungsraum zur Verdrängung im 3-Spalten-Layout.
   * @param {Object} akte - Die neu gewählte Akte
   * @param {Array} memoryRoom - Aktuell belegte Plätze
   * @param {boolean} [preserveIndex=false] - Index beim Re-Render beibehalten
   */
  function showDisplacementView(akte, memoryRoom, preserveIndex) {
    pendingAkte = akte;
    setViewMode('displacement');

    if (!preserveIndex) {
      memoryReviewPageIndex = 0;
    }

    renderMemoryReviewPage(memoryRoom, memoryReviewPageIndex);
  }

  /**
   * Blättert zur vorherigen Seite im Erinnerungsraum.
   */
  function showPreviousMemoryReviewPage() {
    if (!currentState || memoryReviewPageIndex <= 0) {
      return;
    }

    renderMemoryReviewPage(currentState.memoryRoom, memoryReviewPageIndex - 1);
  }

  /**
   * Blättert zur nächsten Seite im Erinnerungsraum.
   */
  function showNextMemoryReviewPage() {
    if (!currentState) {
      return;
    }

    const pageCount = getMemoryReviewPageCount(currentState.memoryRoom.length);
    if (memoryReviewPageIndex >= pageCount - 1) {
      return;
    }

    renderMemoryReviewPage(currentState.memoryRoom, memoryReviewPageIndex + 1);
  }

  /**
   * Beendet die Verdrängungsansicht und kehrt zum Angebots-Set zurück.
   */
  function exitDisplacementView() {
    pendingAkte = null;
    clearMemoryReview();
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
      showMemoryFullModal(akte);
      return;
    }

    let state = loadState();
    state = addToMemoryRoom(state, akte);
    state = refreshOfferSet(state);
    saveState(state);
    showConfirmation();
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
    pendingAkte = null;
    clearMemoryReview();

    let state = loadState();
    state = replaceInMemoryRoom(state, newAkte, oldAkteId);
    state = refreshOfferSet(state);
    saveState(state);
    showConfirmation();
  }

  /**
   * Aktualisiert die gesamte UI anhand des State.
   * @param {Object} state
   */
  function render(state) {
    currentState = state;
    state = ensureOfferSet(state);

    if (viewMode === 'start' || viewMode === 'confirmation') {
      return;
    }

    if (viewMode === 'displacement' && pendingAkte) {
      showDisplacementView(pendingAkte, state.memoryRoom, true);
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

    hideMemoryFullModal();
    pendingAkte = null;
    clearMemoryReview();

    setViewMode('start');
    resetState();
  }

  /**
   * Initialisierung.
   */
  function init() {
    setViewMode('start');
    clearMemoryReview();
    openArchiveBtn.addEventListener('click', openArchive);
    displacementCancel.addEventListener('click', exitDisplacementView);
    memoryReviewPrev.addEventListener('click', showPreviousMemoryReviewPage);
    memoryReviewNext.addEventListener('click', showNextMemoryReviewPage);
    confirmationContinue.addEventListener('click', dismissConfirmation);
    memoryFullModalConfirm.addEventListener('click', confirmMemoryFullModal);
    if (resetInstallation) {
      resetInstallation.addEventListener('click', handleResetInstallation);
    }

    document.addEventListener('keydown', function (event) {
      if (viewMode !== 'displacement') {
        return;
      }

      if (event.key === 'Escape') {
        exitDisplacementView();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPreviousMemoryReviewPage();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNextMemoryReviewPage();
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
