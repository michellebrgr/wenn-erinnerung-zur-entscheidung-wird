/**
 * data.js — Statische Inhalte für die Installation
 *
 * Diese Datei enthält ausschließlich Daten, keine Logik.
 * Neue Fragmente: Eintrag in FRAGMENT_POOL ergänzen (String).
 * Neue Kategorien: Eintrag in CATEGORIES ergänzen (String).
 * Neue Bewertungskriterien: Eintrag in CRITERIA_DEFINITIONS ergänzen.
 */

/** Präfix für generierte Aktenzeichen, z. B. WEZ-2026-047 */
const REFERENCE_PREFIX = 'WEZ';

/**
 * Kategorien für Archivakten.
 * Werden zufällig einer Akte zugewiesen.
 */
const CATEGORIES = [
  'Familie',
  'Ort',
  'Klang',
  'Alltag',
  'Verlust',
  'Kindheit',
  'Reise',
  'Gemeinschaft',
];

/**
 * Pool von Erinnerungsfragmenten.
 * Der Generator wählt 1–2 Fragmente und fügt sie zu einem Akten-Text zusammen.
 */
const FRAGMENT_POOL = [
  'Ich erinnere mich an das Geräusch der Schritte auf dem alten Holzboden, wenn niemand zusah.',
  'Es war ein Nachmittag im Spätsommer. Die Luft roch nach Regen und frisch gemähtem Gras.',
  'Meine Großmutter legte immer die Hände auf den Tisch, bevor sie zu sprechen begann.',
  'Wir standen am Fenster und warteten, ob der Brief noch kommen würde.',
  'Das Foto war verblasst, aber die Umrisse der Gesichter blieben erkennbar.',
  'In der Küche hing der Geruch von Kaffee und etwas Süßem, das ich nicht benennen kann.',
  'Ich weiß nicht mehr genau, was gesagt wurde — nur, dass danach alles anders war.',
  'Der Gang war lang und die Türen standen alle offen, als wäre jemand gerade gegangen.',
  'Es gab ein Lied, das immer gespielt wurde, wenn wir uns versöhnen wollten.',
  'Die Stadt war fremd und doch vertraut, als hätte ich sie schon einmal geträumt.',
  'Ich bewahre noch immer den Zettel auf, auf dem eine Adresse in unleserlicher Schrift stand.',
  'Das Lachen war laut, aber irgendwo darin lag eine leise Angst.',
  'Wir haben nie darüber gesprochen, was in dieser Nacht passiert ist.',
  'Der Geruch von Staub und alten Büchern begleitet mich bis heute.',
  'Sie sagte: „Das vergisst man nicht." Ich glaube ihr erst jetzt.',
  'Der Platz war leer, aber ich spürte noch die Wärme der vielen Stimmen.',
  'Ich erinnere mich an das Licht, das durch die Vorhänge fiel — schräg und golden.',
  'Es war das letzte Mal, dass wir alle am selben Tisch saßen.',
  'Manchmal höre ich noch das Klappern der Schreibmaschine im Nebenzimmer.',
  'Die Straße war nass, und die Laternen spiegelten sich wie kleine Inseln.',
  'Ich wusste nicht, dass dies der Moment war, an den ich zurückkehren würde.',
  'Ein Name wurde genannt, und plötzlich war die Vergangenheit wieder gegenwärtig.',
  'Wir pflückten Kirschen, obwohl es eigentlich zu früh im Jahr war.',
  'Die Stille nach dem Auflegen des Telefons war schwerer als die Worte davor.',
  'Ich trage diesen Satz seit Jahren mit mir, ohne ihn je auszusprechen.',
  'Der Blick aus dem Zugfenster — Felder, Häuser, ein kurzes Aufblitzen von Rot.',
  'Es roch nach Benzin und nassem Asphalt, als wir losfuhren.',
  'Sie hat mir die Haare gestrichen und dabei leise gesungen.',
  'Ich finde noch immer Dinge in Schubladen, die ich nicht mehr zuordnen kann.',
  'Der Winter war kalt, aber in der Küche war es immer warm genug.',
  'Wir haben gelacht, obwohl wir beide wussten, dass es nicht lange so bleiben würde.',
  'Die Uhr an der Wand schlug anders als alle anderen Uhren, die ich kenne.',
  'Ich erinnere mich an den Geschmack von Brot, das noch zu heiß war zum Schneiden.',
  'Es war einer dieser Tage, an denen die Zeit stehen zu bleiben schien.',
  'Die Nachbarn haben gewunken, und ich habe zu lange nicht zurückgewunken.',
  'Ich habe den Ort nie wieder betreten, aber ich träume manchmal davon.',
  'Das Geräusch der Gartentür, die knarrt — ich hörte es jahrelang, bevor ich wegzog.',
  'Ein Fotoalbum ohne Beschriftung. Die Reihenfolge der Bilder war die einzige Erzählung.',
  'Sie sagte meinen Namen auf eine Art, die ich seitdem von niemandem mehr gehört habe.',
  'Der Regen trommelte auf das Blechdach, und wir mussten nichts entscheiden.',
];

/**
 * Bewertungskriterien für Archivakten.
 * key: interner Bezeichner | label: Anzeigename | description: Kurzerklärung
 */
const CRITERIA_DEFINITIONS = [
  {
    key: 'authenticity',
    label: 'Authentizität',
    description: 'Wie unmittelbar und glaubwürdig wirkt die Erinnerung?',
  },
  {
    key: 'emotionalWeight',
    label: 'Emotionalität',
    description: 'Wie stark ist die emotionale Ladung des Fragments?',
  },
  {
    key: 'clarity',
    label: 'Klarheit',
    description: 'Wie deutlich und fassbar ist die Erinnerung beschrieben?',
  },
  {
    key: 'connection',
    label: 'Verbindung',
    description: 'Wie stark verbindet das Fragment Vergangenheit und Gegenwart?',
  },
];
