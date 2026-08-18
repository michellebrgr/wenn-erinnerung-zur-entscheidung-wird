/**
 * i18n.js — Sprache des Archivinterfaces (Laptop)
 *
 * Der Erinnerungsraum (projection.html) bleibt immer deutsch.
 * Die Wahl wird nur im Archiv-Tab gehalten (sessionStorage), nicht im gemeinsamen State.
 */

(function (global) {
  'use strict';

  var STORAGE_KEY = 'wez-archive-lang';
  var listeners = [];

  var STRINGS = {
    de: {
      documentTitle: 'Wenn Erinnerung zur Entscheidung wird — Archiv',
      archiveTitle: 'Archiv',
      startWelcome: 'Willkommen im Archiv.',
      startLead: 'Im Folgenden erhalten Sie Zugriff auf einen begrenzten Archivbestand.',
      startText: 'Schauen Sie sich die bereitgestellten Akten genau an und wählen Sie diejenige aus, die Ihrer Einschätzung nach in den Erinnerungsraum aufgenommen werden soll.',
      startDisclaimer: 'Bei den Akten handelt es sich um fiktive Ereignisse, Informationen und Dokumente, die nicht in der Realität stattgefunden haben.',
      openArchive: 'Archiv öffnen',
      offerHeading: 'Aktuelle Archivakten',
      confirmationPrimary: 'Die ausgewählte Akte wurde in den Erinnerungsraum aufgenommen.',
      confirmationSecondary: 'Die beiden nicht ausgewählten Akten wurden aus dem Archiv entfernt. Sie stehen zukünftigen Besucher*innen nicht mehr zur Verfügung.',
      leaveArchive: 'Archiv verlassen',
      memoryReviewLabel: 'Akten im Erinnerungsraum',
      prevAkten: 'Vorherige Akten',
      nextAkten: 'Nächste Akten',
      memoryFullPrimary: 'Der Erinnerungsraum ist vollständig belegt.',
      memoryFullSecondary: 'Um die ausgewählte Akte aufnehmen zu können, muss eine bestehende Akte aus dem Erinnerungsraum verdrängt werden.',
      startDisplacement: 'Verdrängung Starten',
      selectAkte: 'In den Erinnerungsraum aufnehmen',
      displaceAkte: 'Diese Akte verdrängen',
      metaAria: 'Archivdaten',
      criteriaAria: 'Institutionelle Bewertung',
      langSwitchAria: 'Sprache',
      machineTranslated: 'This content was machine-translated.',
      resetConfirm: 'Installation wirklich zurücksetzen? Der Erinnerungsraum und alle bisherigen Entscheidungen werden gelöscht.',
      fieldObjekttyp: 'Objekttyp',
      fieldAktenart: 'Aktenart',
      fieldHerkunft: 'Herkunft',
      fieldProvenienz: 'Provenienz',
      fieldSammlung: 'Sammlung',
      fieldDokumentationsgrad: 'Dokumentationsgrad',
      fieldErhaltungszustand: 'Erhaltungszustand',
      fieldMaterialhinweis: 'Materialhinweis',
      fieldFehlendeInformationen: 'Fehlende Informationen',
      criterionRelevanz: 'Institutionelle Relevanz',
      criterionAufnahme: 'Aufnahmeempfehlung',
      emptyValue: 'nicht angegeben',
    },
    en: {
      documentTitle: 'When Memory Becomes a Decision — Archive',
      archiveTitle: 'Archive',
      startWelcome: 'Welcome to the archive.',
      startLead: 'You are about to access a limited archival holding.',
      startText: 'Examine the files provided and select the one that, in your judgement, should be admitted to the memory space.',
      startDisclaimer: 'The files consist of fictional events, information and documents that did not take place in reality.',
      openArchive: 'Open archive',
      offerHeading: 'Current archival files',
      confirmationPrimary: 'The selected file has been admitted to the memory space.',
      confirmationSecondary: 'The two files that were not selected have been removed from the archive. They will no longer be available to future visitors.',
      leaveArchive: 'Leave archive',
      memoryReviewLabel: 'Files in the memory space',
      prevAkten: 'Previous files',
      nextAkten: 'Next files',
      memoryFullPrimary: 'The memory space is fully occupied.',
      memoryFullSecondary: 'To admit the selected file, an existing file must be displaced from the memory space.',
      startDisplacement: 'Start displacement',
      selectAkte: 'Admit to the memory space',
      displaceAkte: 'Displace this file',
      metaAria: 'Archival data',
      criteriaAria: 'Institutional assessment',
      langSwitchAria: 'Language',
      machineTranslated: 'This content was machine-translated.',
      resetConfirm: 'Really reset the installation? The memory space and all previous decisions will be deleted.',
      fieldObjekttyp: 'Object type',
      fieldAktenart: 'File type',
      fieldHerkunft: 'Origin',
      fieldProvenienz: 'Provenance',
      fieldSammlung: 'Collection',
      fieldDokumentationsgrad: 'Degree of documentation',
      fieldErhaltungszustand: 'Condition',
      fieldMaterialhinweis: 'Material note',
      fieldFehlendeInformationen: 'Missing information',
      criterionRelevanz: 'Institutional relevance',
      criterionAufnahme: 'Admission recommendation',
      emptyValue: 'not specified',
    },
  };

  function normalizeLang(lang) {
    return lang === 'en' ? 'en' : 'de';
  }

  function readStoredLang() {
    try {
      return normalizeLang(sessionStorage.getItem(STORAGE_KEY));
    } catch (err) {
      return 'de';
    }
  }

  function writeStoredLang(lang) {
    try {
      sessionStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* sessionStorage kann in manchen Browser-Modi fehlen */
    }
  }

  var currentLang = readStoredLang();

  function t(key) {
    var table = STRINGS[currentLang] || STRINGS.de;
    if (table[key] != null) {
      return table[key];
    }
    return STRINGS.de[key] != null ? STRINGS.de[key] : key;
  }

  function getArchiveLang() {
    return currentLang;
  }

  function applyArchiveI18n() {
    document.documentElement.lang = currentLang;
    document.title = t('documentTitle');

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = t(key);
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) {
        el.innerHTML = '<strong>' + t(key) + '</strong>';
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      if (key) {
        el.setAttribute('aria-label', t(key));
      }
    });

    var note = document.getElementById('machine-translation-note');
    if (note) {
      note.hidden = currentLang !== 'en';
    }

    document.querySelectorAll('.lang-switch__btn').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === currentLang;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function setArchiveLang(lang) {
    var next = normalizeLang(lang);
    if (next === currentLang) {
      applyArchiveI18n();
      return;
    }
    currentLang = next;
    writeStoredLang(currentLang);
    applyArchiveI18n();
    listeners.forEach(function (fn) {
      fn(currentLang);
    });
  }

  function onArchiveLangChange(fn) {
    if (typeof fn === 'function') {
      listeners.push(fn);
    }
  }

  function initArchiveI18n() {
    applyArchiveI18n();
    var switcher = document.getElementById('lang-switch');
    if (!switcher) {
      return;
    }
    switcher.addEventListener('click', function (event) {
      var btn = event.target.closest('[data-lang]');
      if (!btn) {
        return;
      }
      setArchiveLang(btn.getAttribute('data-lang'));
    });
  }

  global.ARCHIVE_I18N = STRINGS;
  global.t = t;
  global.getArchiveLang = getArchiveLang;
  global.setArchiveLang = setArchiveLang;
  global.applyArchiveI18n = applyArchiveI18n;
  global.onArchiveLangChange = onArchiveLangChange;
  global.initArchiveI18n = initArchiveI18n;
})(typeof window !== 'undefined' ? window : this);
