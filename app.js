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
  const memoryReviewStage = document.getElementById('memory-review-stage');
  const memoryReviewPageLeft = document.getElementById('memory-review-page-left');
  const memoryReviewPageRight = document.getElementById('memory-review-page-right');
  const memoryReviewPrev = document.getElementById('memory-review-prev');
  const memoryReviewNext = document.getElementById('memory-review-next');
  const memoryReviewRemove = document.getElementById('memory-review-remove');
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

  /** Index der aktuellen Doppelseite im Erinnerungsraum (0–2 bei 6 Akten) */
  let memoryReviewSpreadIndex = 0;

  /** ID der für die Entfernung ausgewählten Akte */
  let memoryReviewSelectedAkteId = null;

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
   * @param {string} options.variant - 'selectable', 'pending' oder 'review'
   * @param {boolean} [options.compact=false]
   * @param {'left'|'right'} [options.spreadSide]
   * @returns {string}
   */
  function renderAkteCard(akte, options) {
    const variant = options.variant;
    const compact = options.compact || false;
    const spreadSide = options.spreadSide || '';
    const cardClass =
      variant === 'selectable'
        ? 'akte-card--selectable'
        : variant === 'pending'
          ? 'akte-card--pending'
          : variant === 'review'
            ? 'akte-card--review'
            : '';
    const spreadClass =
      spreadSide === 'left'
        ? ' akte-card--spread-left-page'
        : spreadSide === 'right'
          ? ' akte-card--spread-right-page'
          : '';
    const binderHoles =
      '<div class="akte-card__binder" aria-hidden="true">' +
      '<span class="akte-card__binder-hole"></span>' +
      '<span class="akte-card__binder-hole"></span>' +
      '<span class="akte-card__binder-hole"></span>' +
      '</div>';

    return (
      '<article class="akte-card ' + cardClass + spreadClass + '">' +
      binderHoles +
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
   * Berechnet die Anzahl der Doppelseiten.
   * @param {number} total
   * @returns {number}
   */
  function getMemoryReviewSpreadCount(total) {
    return Math.ceil(total / 2);
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
   * Markiert die ausgewählte Akte in der Doppelseite.
   * @param {string|null} akteId
   */
  function setMemoryReviewSelection(akteId) {
    memoryReviewSelectedAkteId = akteId;

    [memoryReviewPageLeft, memoryReviewPageRight].forEach(function (page) {
      page.querySelectorAll('.memory-review__page-select').forEach(function (button) {
        const isSelected = button.getAttribute('data-akte-id') === akteId;
        button.classList.toggle('memory-review__page-select--active', isSelected);
        button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      });
    });

    if (akteId) {
      memoryReviewRemove.disabled = false;
      memoryReviewRemove.setAttribute('data-id', akteId);
    } else {
      memoryReviewRemove.disabled = true;
      memoryReviewRemove.removeAttribute('data-id');
    }
  }

  /**
   * Rendert eine Seite der Doppelseite.
   * @param {Object|null} akte
   * @param {string} side - 'left' oder 'right'
   * @returns {string}
   */
  function renderMemoryReviewPageCard(akte, side) {
    if (!akte) {
      return '<div class="memory-review__page-empty" aria-hidden="true"></div>';
    }

    const label = 'Akte ' + escapeHtml(formatValue(akte.archivsignatur)) + ' auswählen';

    return (
      '<button type="button" class="memory-review__page-select memory-review__page-select--' + side + '" ' +
      'data-akte-id="' + escapeHtml(akte.id) + '" aria-label="' + label + '" aria-pressed="false">' +
      renderAkteCard(akte, { variant: 'review', spreadSide: side }) +
      '</button>'
    );
  }

  /**
   * Leert die Ringbuch-Verdrängungsansicht.
   */
  function clearMemoryReview() {
    memoryReviewPageLeft.innerHTML = '';
    memoryReviewPageRight.innerHTML = '';
    memoryReviewRemove.disabled = true;
    memoryReviewRemove.removeAttribute('data-id');
    setMemoryReviewNavState(memoryReviewPrev, false);
    setMemoryReviewNavState(memoryReviewNext, false);
    memoryReviewSpreadIndex = 0;
    memoryReviewSelectedAkteId = null;
  }

  /**
   * Zeigt eine Doppelseite im Ringbuch-Durchblättermodus.
   * @param {Array} memoryRoom
   * @param {number} spreadIndex
   */
  function renderMemoryReviewPage(memoryRoom, spreadIndex) {
    const room = memoryRoom || [];
    const total = room.length;

    if (total === 0) {
      clearMemoryReview();
      return;
    }

    const spreadCount = getMemoryReviewSpreadCount(total);
    const safeSpreadIndex = Math.max(0, Math.min(spreadIndex, spreadCount - 1));
    memoryReviewSpreadIndex = safeSpreadIndex;

    const leftIndex = safeSpreadIndex * 2;
    const rightIndex = leftIndex + 1;
    const leftAkte = room[leftIndex] || null;
    const rightAkte = room[rightIndex] || null;

    memoryReviewPageLeft.innerHTML = renderMemoryReviewPageCard(leftAkte, 'left');
    memoryReviewPageRight.innerHTML = renderMemoryReviewPageCard(rightAkte, 'right');

    setMemoryReviewNavState(memoryReviewPrev, safeSpreadIndex > 0);
    setMemoryReviewNavState(memoryReviewNext, safeSpreadIndex < spreadCount - 1);

    const defaultSelection = leftAkte || rightAkte;
    const keepSelection =
      memoryReviewSelectedAkteId &&
      room.some(function (akte) {
        return akte.id === memoryReviewSelectedAkteId;
      });

    if (keepSelection) {
      setMemoryReviewSelection(memoryReviewSelectedAkteId);
    } else if (defaultSelection) {
      setMemoryReviewSelection(defaultSelection.id);
    } else {
      setMemoryReviewSelection(null);
    }
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
   * Zeigt den Erinnerungsraum zur Verdrängung als durchblätterbare Ringbuch-Seite.
   * @param {Object} akte - Die neu gewählte Akte
   * @param {Array} memoryRoom - Aktuell belegte Plätze
   * @param {boolean} [preserveIndex=false] - Index beim Re-Render beibehalten
   */
  function showDisplacementView(akte, memoryRoom, preserveIndex) {
    pendingAkte = akte;
    setViewMode('displacement');

    if (!preserveIndex) {
      memoryReviewSpreadIndex = 0;
      memoryReviewSelectedAkteId = null;
    }

    renderMemoryReviewPage(memoryRoom, memoryReviewSpreadIndex);
  }

  /**
   * Blättert zur vorherigen Doppelseite im Erinnerungsraum.
   */
  function showPreviousMemoryReviewPage() {
    if (!currentState || memoryReviewSpreadIndex <= 0) {
      return;
    }

    renderMemoryReviewPage(currentState.memoryRoom, memoryReviewSpreadIndex - 1);
  }

  /**
   * Blättert zur nächsten Doppelseite im Erinnerungsraum.
   */
  function showNextMemoryReviewPage() {
    if (!currentState) {
      return;
    }

    const spreadCount = getMemoryReviewSpreadCount(currentState.memoryRoom.length);
    if (memoryReviewSpreadIndex >= spreadCount - 1) {
      return;
    }

    renderMemoryReviewPage(currentState.memoryRoom, memoryReviewSpreadIndex + 1);
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
    memoryReviewStage.addEventListener('click', function (event) {
      const selectButton = event.target.closest('.memory-review__page-select');
      if (!selectButton) {
        return;
      }

      const akteId = selectButton.getAttribute('data-akte-id');
      if (akteId) {
        setMemoryReviewSelection(akteId);
      }
    });
    memoryReviewRemove.addEventListener('click', function () {
      const akteId = memoryReviewRemove.getAttribute('data-id');
      if (akteId) {
        handleDisplacement(akteId);
      }
    });
    confirmationContinue.addEventListener('click', dismissConfirmation);
    memoryFullModalConfirm.addEventListener('click', confirmMemoryFullModal);
    resetInstallation.addEventListener('click', handleResetInstallation);

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
