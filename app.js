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
   * Mappt Skalenwerte (gering/mittel/hoch) auf Punktanzahl (1–5).
   * Skala hier anpassen, falls du andere Werte in data.js verwendest.
   * @param {string} wert
   * @returns {number}
   */
  function mapScaleToDots(wert) {
    const scale = {
      gering: 1,
      mittel: 3,
      hoch: 5,
    };
    return scale[wert] || 0;
  }

  /**
   * Rendert einen Punkt-Balken für ein Kriterium.
   * @param {string} label
   * @param {number} value - Anzahl gefüllter Punkte (1–5)
   * @returns {string}
   */
  function renderCriterionDots(label, value) {
    let dots = '';
    for (let i = 1; i <= 5; i++) {
      dots += '<span class="criterion__dot' + (i <= value ? ' criterion__dot--filled' : '') + '"></span>';
    }

    return (
      '<li class="criterion">' +
      '<span class="criterion__label">' + escapeHtml(label) + '</span>' +
      '<span class="criterion__bar" aria-label="' + value + ' von 5">' + dots + '</span>' +
      '</li>'
    );
  }

  /**
   * Bereich 5: Institutionelle Relevanz, Dokumentationsgrad, Erhaltungszustand.
   * @param {Object} akte
   * @returns {string}
   */
  function renderCriteria(akte) {
    const items = [
      renderCriterionDots('Institutionelle Relevanz', mapScaleToDots(akte.institutionelleRelevanz)),
      renderCriterionDots('Dokumentationsgrad', mapScaleToDots(akte.dokumentationsgrad)),
      (
        '<li class="criterion">' +
        '<span class="criterion__label">Erhaltungszustand</span>' +
        '<span class="criterion__value">' + escapeHtml(formatValue(akte.erhaltungszustand)) + '</span>' +
        '</li>'
      ),
    ];

    return items.join('');
  }

  /**
   * Bereich 4: Objekttyp, Herkunft, Provenienz, Sammlung.
   * @param {Object} akte
   * @param {boolean} compact - Weniger Felder für den Verdrängungsdialog
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
   * @param {string} options.variant - 'selectable' oder 'displacement'
   * @param {boolean} [options.compact=false]
   * @returns {string}
   */
  function renderAkteCard(akte, options) {
    const variant = options.variant;
    const compact = options.compact || false;
    const isSelectable = variant === 'selectable';
    const cardClass = isSelectable ? 'akte-card--selectable' : 'akte-card--displacement';
    const dataAttr = isSelectable
      ? 'data-id="' + escapeHtml(akte.id) + '"'
      : 'data-displace-id="' + escapeHtml(akte.id) + '"';
    const actionHint = isSelectable ? 'Klicken zum Aufnehmen' : 'Zum Verdrängen wählen';

    return (
      '<article class="akte-card ' + cardClass + '" role="listitem" tabindex="0" ' + dataAttr + '>' +
      // Bereich 1: Kopfdaten — Titel/Jahr in data.js pflegen
      '<header class="akte-card__header">' +
      '<span class="akte-card__reference">' + escapeHtml(formatValue(akte.archivsignatur)) + '</span>' +
      '<span class="akte-card__category">' + escapeHtml(formatValue(akte.kategorie)) + '</span>' +
      '</header>' +
      '<h3 class="akte-card__title">' + escapeHtml(formatValue(akte.titel)) + '</h3>' +
      '<p class="akte-card__year">' + escapeHtml(formatValue(akte.jahr)) + '</p>' +
      // Bereich 2: Bild — Pfad in data.js Feld `bild`
      renderAkteImage(akte.bild) +
      // Bereich 3: Kurzbeschreibung — Text in data.js Feld `kurzbeschreibung`
      '<p class="akte-card__fragment">' + escapeHtml(formatValue(akte.kurzbeschreibung)) + '</p>' +
      // Bereich 4: Objekttyp, Herkunft, Provenienz, Sammlung
      renderMetaList(akte, compact) +
      // Bereich 5: Bewertungskriterien — Werte in data.js anpassen
      '<ul class="akte-card__criteria" aria-label="Bewertungskriterien">' + renderCriteria(akte) + '</ul>' +
      '<p class="akte-card__action-hint">' + actionHint + '</p>' +
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
   * Rendert eine Akte im Verdrängungsdialog (kompakter).
   * @param {Object} akte
   * @returns {string}
   */
  function renderDisplacementCard(akte) {
    return renderAkteCard(akte, { variant: 'displacement', compact: true });
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
          '<div class="preview-slot__ref">' + escapeHtml(formatValue(akte.archivsignatur)) + '</div>' +
          '<p class="preview-slot__text">' + escapeHtml(formatValue(akte.kurzbeschreibung)) + '</p>' +
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
