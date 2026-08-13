/**
 * generator.js — Wählt Archivakten aus dem Datenbestand
 *
 * Rein funktionale Logik ohne DOM oder localStorage.
 * Nutzt ARCHIV_BILDER aus data.js.
 */

/** Untergrenze für zufällige Jahresangaben */
const DATIERUNG_JAHR_MIN = 1845;

/** Obergrenze für zufällige Jahresangaben */
const DATIERUNG_JAHR_MAX = 2020;

/**
 * Erzeugt eine dreistellige Zufallszahl für die Archivsignatur.
 * @returns {string}
 */
function randomArchivSuffix() {
  return String(Math.floor(Math.random() * 1000)).padStart(3, '0');
}

/**
 * Leitet den Jahres- bzw. Datierungsanteil der Archivsignatur aus `jahr` ab.
 * @param {number|string|null} jahr
 * @returns {string}
 */
function jahrToSignaturSegment(jahr) {
  if (jahr === null || jahr === undefined || jahr === '') {
    return 'UND';
  }

  if (typeof jahr === 'number' && !isNaN(jahr)) {
    return String(jahr);
  }

  const s = String(jahr).trim();

  const decadeMatch = s.match(/^(\d{3})X$/i) || s.match(/^(\d{3})\d*er(\s+Jahre)?$/i);
  if (decadeMatch) {
    return decadeMatch[1] + 'X';
  }

  const caMatch = s.match(/^CA(\d{4})$/i) || s.match(/^ca\.?\s*(\d{4})$/i) || s.match(/^circa\s*(\d{4})$/i);
  if (caMatch) {
    return 'CA' + caMatch[1];
  }

  if (/^\d{4}$/.test(s)) {
    return s;
  }

  if (/^(undatiert|nicht\s+datiert|n\.?\s*d\.?)$/i.test(s)) {
    return 'UND';
  }

  return 'UND';
}

/**
 * Erzeugt eine Archivsignatur aus Jahr/Datierung und Zufallsnummer.
 * Beispiele: WEZ-1974-018, WEZ-CA1974-018, WEZ-197X-018, WEZ-UND-018
 * @param {number|string|null} jahr
 * @returns {string}
 */
function generateArchivsignatur(jahr) {
  const prefix = typeof ARCHIV_PREFIX !== 'undefined' ? ARCHIV_PREFIX : 'AK';
  return prefix + '-' + jahrToSignaturSegment(jahr) + '-' + randomArchivSuffix();
}

/**
 * Zieht ein zufälliges Jahr im konfigurierten Bereich.
 * @returns {number}
 */
function randomJahrZahl() {
  return DATIERUNG_JAHR_MIN + Math.floor(Math.random() * (DATIERUNG_JAHR_MAX - DATIERUNG_JAHR_MIN + 1));
}

/**
 * Zieht ein zufälliges Jahrzehnt (z. B. 1970 für „1970er Jahre“).
 * @returns {number}
 */
function randomJahrzehnt() {
  const minDecade = Math.floor(DATIERUNG_JAHR_MIN / 10) * 10;
  const maxDecade = Math.floor(DATIERUNG_JAHR_MAX / 10) * 10;
  const decadeCount = (maxDecade - minDecade) / 10 + 1;
  return minDecade + Math.floor(Math.random() * decadeCount) * 10;
}

/**
 * Erzeugt eine zufällige Datierungsangabe für eine Akte.
 * Mögliche Formen: genaues Jahr, „ca. …“, Jahrzehnt oder „nicht datiert“.
 * @returns {number|string}
 */
function generateJahr() {
  const roll = Math.random();

  if (roll < 0.25) {
    return 'nicht datiert';
  }

  if (roll < 0.5) {
    return randomJahrZahl();
  }

  if (roll < 0.75) {
    return 'ca. ' + randomJahrZahl();
  }

  return randomJahrzehnt() + 'er Jahre';
}

/**
 * Liefert die Kontrollwerte oder ein leeres Objekt.
 * @returns {Object}
 */
function getKontrollierteWerte() {
  return typeof KONTROLLIERTE_WERTE !== 'undefined' ? KONTROLLIERTE_WERTE : {};
}

/**
 * Wählt zufällig einen Eintrag aus einer Liste in KONTROLLIERTE_WERTE.
 * @param {string} listeKey - Schlüssel in KONTROLLIERTE_WERTE (z. B. „provenienz“)
 * @returns {string|null}
 */
function pickFromListe(listeKey) {
  const listen = getKontrollierteWerte();
  return pickRandomOne(listen[listeKey] || []);
}

/**
 * Wählt eine gültige Kategorie — aus der Variante oder zufällig aus dem Katalog.
 * @param {Object} [variante]
 * @returns {string|null}
 */
function resolveKategorie(variante) {
  variante = variante || {};
  const listen = getKontrollierteWerte();
  const kataloge = listen.kategorienKataloge || {};

  if (variante.kategorie && kataloge[variante.kategorie]) {
    return variante.kategorie;
  }

  return pickRandomOne(listen.kategorien || Object.keys(kataloge));
}

/**
 * Liefert den Kategoriekatalog für eine Kategorie.
 * @param {string} kategorie
 * @returns {Object}
 */
function getKategorieKatalog(kategorie) {
  const listen = getKontrollierteWerte();
  const kataloge = listen.kategorienKataloge || {};
  return kataloge[kategorie] || {};
}

/**
 * Ersetzt Platzhalter in einer Vorlage durch Bausteinwerte.
 * @param {string} template
 * @param {Object} bausteine
 * @returns {string}
 */
function fillTemplate(template, bausteine) {
  return String(template || '')
    .replace(/\{objekttyp\}/g, bausteine.objekttyp || '')
    .replace(/\{motiv\}/g, bausteine.motiv || '')
    .replace(/\{ort\}/g, bausteine.ort || '');
}

/**
 * Großschreibung des ersten Zeichens.
 * @param {string} text
 * @returns {string}
 */
function capitalizeFirst(text) {
  if (!text) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Zieht kohärente Bausteine aus dem Katalog einer Kategorie.
 * @param {string} kategorie
 * @param {Object} [options] - Bereits gesetzte Feldwerte
 * @returns {Object}
 */
function pickKategorieBausteine(kategorie, options) {
  options = options || {};
  const katalog = getKategorieKatalog(kategorie);

  return {
    kategorie: kategorie,
    objekttyp: options.objekttyp !== undefined
      ? options.objekttyp
      : pickRandomOne(katalog.objekttypen || []),
    motiv: options.motiv !== undefined
      ? options.motiv
      : pickRandomOne(katalog.motive || []),
    ort: options.ort !== undefined
      ? options.ort
      : pickRandomOne(katalog.orte || []),
    erhaltungszustand: options.erhaltungszustand !== undefined
      ? options.erhaltungszustand
      : pickRandomOne(katalog.erhaltungszustaende || []),
    fehlendeInformation: options.fehlendeInformation !== undefined
      ? options.fehlendeInformation
      : pickRandomOne(katalog.fehlendeInformationen || []),
    materialhinweis: options.materialhinweis !== undefined
      ? options.materialhinweis
      : pickRandomOne(katalog.materialhinweise || []),
    sammlung: options.sammlung !== undefined
      ? options.sammlung
      : pickRandomOne(katalog.sammlungen || []),
    institutionelleRelevanz: options.institutionelleRelevanz !== undefined
      ? options.institutionelleRelevanz
      : pickRandomOne(katalog.institutionelleRelevanz || []),
  };
}

/**
 * Erzeugt einen Aktentitel aus Titelstrukturen und Bausteinen.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateAktenTitel(bausteine) {
  const listen = getKontrollierteWerte();
  const struktur = pickRandomOne(listen.titelstrukturen || []);
  if (!struktur || !bausteine.objekttyp) {
    return null;
  }
  return capitalizeFirst(fillTemplate(struktur, bausteine));
}

/**
 * Erzeugt eine Kontextbeschreibung aus Satzanfängen, Verbindungen und Bausteinen.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateKontextbeschreibung(bausteine) {
  const listen = getKontrollierteWerte();
  const anfang = pickRandomOne(listen.kontextSatzanfaenge || []);
  const verbindung = pickRandomOne(listen.kontextVerbindungen || []);
  const motiv = bausteine.motiv;
  const ort = bausteine.ort;

  if (!anfang || !motiv) {
    return null;
  }

  const needsContinuation = [
    'und gibt Einblick in',
    'und dokumentiert zugleich',
    'und lässt Rückschlüsse auf',
    'und verweist auf',
  ].indexOf(verbindung) !== -1;

  let text;
  if (needsContinuation && ort) {
    text = anfang + ' ' + motiv + ' ' + verbindung + ' ' + ort + '.';
  } else if (needsContinuation) {
    text = anfang + ' ' + motiv + '.';
  } else if (verbindung) {
    text = anfang + ' ' + motiv + ' und ' + verbindung + '.';
  } else {
    text = anfang + ' ' + motiv + '.';
  }

  if (bausteine.fehlendeInformation && Math.random() < 0.7) {
    text += ' ' + capitalizeFirst(bausteine.fehlendeInformation) + '.';
  }

  return text;
}

/**
 * Erzeugt eine Kurzbeschreibung für den Erinnerungsraum.
 * @param {Object} bausteine
 * @returns {string|null}
 */
function generateKurzbeschreibung(bausteine) {
  const listen = getKontrollierteWerte();
  const struktur = pickRandomOne(listen.kurzbeschreibungStrukturen || []);
  if (!struktur || !bausteine.motiv) {
    return null;
  }
  return fillTemplate(struktur, bausteine);
}

/**
 * Erzeugt Titel, Kontext- und Kurzbeschreibung für bildlose Akten.
 * @param {Object} bausteine
 * @returns {{ titel: string|null, kontextbeschreibung: string|null, kurzbeschreibung: string|null }}
 */
function generateAktenTexte(bausteine) {
  return {
    titel: generateAktenTitel(bausteine),
    kontextbeschreibung: generateKontextbeschreibung(bausteine),
    kurzbeschreibung: generateKurzbeschreibung(bausteine),
  };
}

/**
 * Erzeugt kohärente Metadaten für eine Akte aus dem Kategoriekatalog.
 * @param {Object} variante - Variante mit kategorie
 * @param {Object} [options] - Bereits gespeicherte Feldwerte
 * @returns {{ kategorie: string|null, objekttyp: string|null, provenienz: string|null, sammlung: string|null, erhaltungszustand: string|null, motiv: string|null, ort: string|null, fehlendeInformation: string|null, materialhinweis: string|null, institutionelleRelevanz: string|null }}
 */
function generateAktenMetadaten(variante, options) {
  options = options || {};
  variante = variante || {};

  const kategorie = options.kategorie !== undefined
    ? options.kategorie
    : resolveKategorie(variante);
  const bausteine = pickKategorieBausteine(kategorie, options);
  const provenienz = options.provenienz !== undefined
    ? options.provenienz
    : pickFromListe('provenienz');

  return {
    kategorie: kategorie,
    objekttyp: bausteine.objekttyp,
    provenienz: provenienz,
    sammlung: bausteine.sammlung,
    erhaltungszustand: bausteine.erhaltungszustand,
    motiv: bausteine.motiv,
    ort: bausteine.ort,
    fehlendeInformation: bausteine.fehlendeInformation,
    materialhinweis: bausteine.materialhinweis,
    institutionelleRelevanz: bausteine.institutionelleRelevanz,
  };
}

/**
 * Erzeugt Bewertungskriterien — Relevanz und Erhaltungszustand aus der Kategorie,
 * Dokumentationsgrad aus dem allgemeinen Katalog.
 * @param {Object} [options]
 * @param {string} [options.kategorie]
 * @param {string} [options.erhaltungszustand]
 * @param {string} [options.institutionelleRelevanz]
 * @returns {Array<{ label: string, text: string }>}
 */
function generateBewertungskriterien(options) {
  options = options || {};

  if (options.bewertungskriterien !== undefined) {
    return options.bewertungskriterien;
  }

  const listen = getKontrollierteWerte();
  const kategorie = options.kategorie || resolveKategorie({});
  const katalog = getKategorieKatalog(kategorie);

  const relevanz = options.institutionelleRelevanz !== undefined
    ? options.institutionelleRelevanz
    : pickRandomOne(katalog.institutionelleRelevanz || []);
  const dokumentationsgrad = options.dokumentationsgrad !== undefined
    ? options.dokumentationsgrad
    : pickRandomOne(listen.dokumentationsgrad || []);
  const erhaltungszustand = options.erhaltungszustand !== undefined
    ? options.erhaltungszustand
    : pickRandomOne(katalog.erhaltungszustaende || []);

  return [
    relevanz ? { label: 'Institutionelle Relevanz', text: relevanz } : null,
    dokumentationsgrad ? { label: 'Dokumentationsgrad', text: dokumentationsgrad } : null,
    erhaltungszustand ? { label: 'Erhaltungszustand', text: erhaltungszustand } : null,
  ].filter(Boolean);
}

/**
 * Wählt zufällig count Elemente aus einem Array (ohne Duplikate).
 * @param {Array} arr - Quell-Array
 * @param {number} count - Anzahl der Elemente
 * @returns {Array} Zufällige Auswahl
 */
function pickRandom(arr, count) {
  const copy = [...arr];
  const result = [];

  const limit = Math.min(count, copy.length);
  for (let i = 0; i < limit; i++) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }

  return result;
}

/**
 * Findet Bild und Variante in ARCHIV_BILDER anhand gespeicherter Referenzen.
 * @param {string} bildId
 * @param {string} varianteId
 * @returns {{ bild: Object|null, variante: Object|null }}
 */
function findBildAndVariante(bildId, varianteId) {
  if (!Array.isArray(ARCHIV_BILDER) || !bildId || !varianteId) {
    return { bild: null, variante: null };
  }

  const bild = ARCHIV_BILDER.find(function (b) {
    return b.id === bildId;
  });

  if (!bild || !Array.isArray(bild.varianten)) {
    return { bild: null, variante: null };
  }

  const variante = bild.varianten.find(function (v) {
    return v.id === varianteId;
  });

  return { bild: bild, variante: variante || null };
}

/**
 * Erzeugt ein Akten-Objekt aus Bild und Variante.
 * Bildakten behalten manuelle Titel/Kurzbeschreibung; Metadaten kommen aus dem Kategoriekatalog.
 * Bildlose Akten erzeugen Titel, Kontext und Kurzbeschreibung aus Textbausteinen.
 * @param {Object} bild - Eintrag aus ARCHIV_BILDER
 * @param {Object} variante - Variante des Bildes
 * @param {Object} [options]
 * @param {boolean} [options.unique=false] - Eindeutige ID für mehrfach angezeigte bildlose Akten
 * @returns {Object}
 */
function buildAkte(bild, variante, options) {
  options = options || {};
  variante = variante || {};
  const jahr = options.jahr !== undefined ? options.jahr : generateJahr();
  const archivsignatur = options.archivsignatur || variante.archivsignatur || generateArchivsignatur(jahr);
  const meta = generateAktenMetadaten(variante, options);
  const ohneBild = !bild || bild.pfad == null;
  const texte = ohneBild
    ? generateAktenTexte(meta)
    : {
      titel: null,
      kontextbeschreibung: options.kontextbeschreibung !== undefined
        ? options.kontextbeschreibung
        : (variante.kontextbeschreibung || null),
      kurzbeschreibung: null,
    };
  const baseId = (bild && bild.id ? bild.id : 'ohne-bild') + '--' + (variante.id || meta.kategorie || 'generiert');

  return {
    id: options.unique ? baseId + '--' + randomArchivSuffix() : baseId,
    bildId: bild && bild.id ? bild.id : null,
    varianteId: variante.id || null,
    archivsignatur: archivsignatur,
    kategorie: meta.kategorie || variante.kategorie || null,
    titel: options.titel !== undefined
      ? options.titel
      : (ohneBild ? texte.titel : (variante.titel || null)),
    jahr: jahr,
    bild: bild && bild.pfad != null ? bild.pfad : null,
    kurzbeschreibung: options.kurzbeschreibung !== undefined
      ? options.kurzbeschreibung
      : (ohneBild ? texte.kurzbeschreibung : (variante.kurzbeschreibung || null)),
    kontextbeschreibung: options.kontextbeschreibung !== undefined
      ? options.kontextbeschreibung
      : (ohneBild ? texte.kontextbeschreibung : (variante.kontextbeschreibung || null)),
    objekttyp: meta.objekttyp,
    herkunft: null,
    provenienz: meta.provenienz,
    sammlung: meta.sammlung,
    bewertungskriterien: generateBewertungskriterien({
      kategorie: meta.kategorie,
      erhaltungszustand: meta.erhaltungszustand,
      institutionelleRelevanz: meta.institutionelleRelevanz,
      bewertungskriterien: options.bewertungskriterien,
    }),
  };
}

/**
 * Bereitet eine Akte für State und Darstellung vor.
 * Liest aktuelle Daten aus ARCHIV_BILDER (per bildId/varianteId) und mappt ggf. alte Feldnamen.
 * @param {Object} akte - Erzeugte Akte oder Eintrag aus localStorage
 * @returns {Object}
 */
function normalizeAkte(akte) {
  const lookup = findBildAndVariante(akte.bildId, akte.varianteId);
  const fromData = lookup.bild && lookup.variante
    ? buildAkte(lookup.bild, lookup.variante, {
      jahr: 'jahr' in akte ? akte.jahr : undefined,
      archivsignatur: akte.archivsignatur || akte.inventoryNumber || akte.reference || undefined,
      objekttyp: 'objekttyp' in akte ? akte.objekttyp : undefined,
      provenienz: 'provenienz' in akte ? akte.provenienz : undefined,
      sammlung: 'sammlung' in akte ? akte.sammlung : undefined,
      bewertungskriterien: 'bewertungskriterien' in akte ? akte.bewertungskriterien : undefined,
    })
    : null;
  const src = fromData || akte;
  const jahr = 'jahr' in akte
    ? akte.jahr
    : (src.jahr != null ? src.jahr : (akte.year != null ? akte.year : generateJahr()));
  const fallbackMeta = generateAktenMetadaten(lookup.variante || { kategorie: akte.kategorie }, {});

  return {
    id: src.id || akte.id,
    bildId: src.bildId || akte.bildId || null,
    varianteId: src.varianteId || akte.varianteId || null,
    archivsignatur: akte.archivsignatur || akte.inventoryNumber || akte.reference || src.archivsignatur || generateArchivsignatur(jahr),
    kategorie: src.kategorie || akte.kategorie || akte.category || null,
    titel: src.titel || akte.titel || akte.title || null,
    jahr: jahr,
    bild: src.bild !== undefined ? src.bild : (akte.bild !== undefined ? akte.bild : null),
    kurzbeschreibung: src.kurzbeschreibung || akte.kurzbeschreibung || akte.shortText || akte.fragment || null,
    kontextbeschreibung: src.kontextbeschreibung || akte.kontextbeschreibung || null,
    objekttyp: 'objekttyp' in akte ? akte.objekttyp : (src.objekttyp || akte.objectType || fallbackMeta.objekttyp),
    herkunft: 'herkunft' in akte ? akte.herkunft : (src.herkunft != null ? src.herkunft : null),
    provenienz: 'provenienz' in akte ? akte.provenienz : (src.provenienz || fallbackMeta.provenienz),
    sammlung: 'sammlung' in akte ? akte.sammlung : (src.sammlung || fallbackMeta.sammlung),
    bewertungskriterien: 'bewertungskriterien' in akte
      ? akte.bewertungskriterien
      : (src.bewertungskriterien || generateBewertungskriterien({ kategorie: src.kategorie || akte.kategorie })),
  };
}

/**
 * Wählt zufällig Bilder aus ARCHIV_BILDER (ohne Duplikate).
 * @param {Array} bilder - Quell-Array
 * @param {number} count - Anzahl der Bilder
 * @returns {Array}
 */
function pickArchiveBilder(bilder, count) {
  return pickRandom(bilder, count);
}

/**
 * Wählt zufällig ein Element aus einem Array (mit Wiederholung).
 * @param {Array} arr
 * @returns {*}
 */
function pickRandomOne(arr) {
  if (!arr || arr.length === 0) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Erzeugt eine bildlose Akte vollständig aus Kategoriekatalogen und Textbausteinen.
 * @returns {Object|null}
 */
function pickRandomOhneBildAkte() {
  const kategorie = resolveKategorie({});
  if (!kategorie) {
    return null;
  }

  const variante = {
    id: 'generiert',
    kategorie: kategorie,
  };
  const bild = {
    id: 'ohne-bild-' + kategorie.toLowerCase().replace(/\s+/g, '-'),
    pfad: null,
  };

  return buildAkte(bild, variante, { unique: true });
}

/**
 * Wählt zufällig mehrere Archivakten aus ARCHIV_BILDER.
 * Zuerst verfügbare Bilder mit Pfad, dann systemgenerierte bildlose Akten zur Auffüllung auf count.
 * Bilder im Erinnerungsraum werden ausgeschlossen; bildlose Akten dürfen mehrfach vorkommen.
 * @param {number} count - Anzahl der Akten
 * @param {Array<string>} [excludedBildIds] - Bild-IDs mit Pfad, die bereits im Erinnerungsraum sind
 * @returns {Array} Array von vorbereiteten Akten-Objekten
 */
function pickArchiveAkten(count, excludedBildIds) {
  if (!Array.isArray(ARCHIV_BILDER)) {
    console.warn('ARCHIV_BILDER ist nicht definiert.');
    return [];
  }

  const excluded = new Set(excludedBildIds || []);

  const mitBild = ARCHIV_BILDER.filter(function (b) {
    return b.pfad && !excluded.has(b.id);
  });

  const pickedMitBild = pickArchiveBilder(mitBild, Math.min(count, mitBild.length));
  const akten = pickedMitBild.map(function (bild) {
    const variante = pickRandom(bild.varianten, 1)[0];
    return buildAkte(bild, variante);
  });

  while (akten.length < count) {
    const akte = pickRandomOhneBildAkte();
    if (!akte) {
      break;
    }
    akten.push(akte);
  }

  return akten.map(normalizeAkte);
}

/**
 * Erzeugt ein Set aus mehreren unterschiedlichen Akten.
 * Öffentliche API — wird von state.js aufgerufen.
 * @param {number} count - Anzahl der Akten (Standard: 3)
 * @param {Array<string>} [excludedBildIds] - Bild-IDs, die bereits im Erinnerungsraum sind
 * @returns {Array} Array von Akten-Objekten
 */
function generateOfferSet(count, excludedBildIds) {
  count = count || 3;
  return pickArchiveAkten(count, excludedBildIds);
}
