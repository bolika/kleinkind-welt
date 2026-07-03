import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const freebiesDir = path.join(root, 'freebies');
const renderDir = path.join(freebiesDir, 'renders');
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const groups = [
  {
    slug: '0-6-monate',
    key: 'spielideen-0-6',
    label: '0 bis 6 Monate',
    accent: '#7f9f88',
    accentDark: '#496d55',
    accentSoft: '#edf4ed',
    title: 'Was spiele ich heute?',
    subtitle: '5 sanfte Spielideen für Babys von 0 bis 6 Monaten',
    coverText: 'Nähe, erste Sinneseindrücke und gemeinsames Entdecken - ganz ohne Vorbereitung.',
    introTitle: 'Spielen beginnt ganz leise',
    intro: [
      'Hallo, ich bin Boris, Papa eines Sohnes und Gründer von Kleinkind-Welt.',
      'Gerade in den ersten Monaten fragen sich viele Eltern: Kann ich überhaupt schon mit meinem Baby spielen?',
      'Ja, aber Spielen sieht in dieser Phase ganz anders aus als später. Für dein Baby sind deine Stimme, dein Gesicht und deine Nähe oft spannender als jedes Spielzeug.',
      'Diese Ideen sollen euch inspirieren, nicht unter Druck setzen. Schon wenige Minuten reichen völlig aus.',
    ],
    phaseNote: 'Nähe · erste Sinne · ruhige Wachphasen',
    nextHref: '/artikel/spielzeug-0-6-monate',
    nextLabel: 'Mehr für 0 bis 6 Monate ansehen',
    closing: [
      'In den ersten Monaten braucht dein Baby keine aufwendigen Spielsachen. Das Wertvollste bist du: deine Stimme, dein Gesicht, dein Lächeln und eure gemeinsame Zeit.',
      'Mach dir keinen Druck. Entwicklung passiert in kleinen Schritten. Jeder Blick, jedes Lächeln und jede Berührung zählt.',
    ],
    ideas: [
      {
        title: 'Gesichter entdecken',
        when: '2-5 Min · nach dem Wickeln · ruhiger Moment',
        material: 'Nur dein Gesicht',
        supports: 'Blickkontakt · Bindung · soziale Entwicklung',
        steps: 'Halte dein Gesicht ungefähr 20 bis 30 Zentimeter vor dein Baby. Lächle, zieh langsam Grimassen, heb die Augenbrauen oder streck einmal die Zunge heraus. Dann warte einen Moment. Viele Babys reagieren erst nach einigen Sekunden.',
        practice: 'Unser Sohn fand übertriebene Überraschungs-Gesichter besonders spannend. Am besten funktioniert es, wenn du dir Zeit lässt. Für Babys ist langsam oft spannender als hektisch.',
      },
      {
        title: 'Schwarz-Weiß entdecken',
        when: '1-3 Min · ruhige Wachphase',
        material: 'Kontrastkarte, schwarz-weißes Bild oder Stoffmuster',
        supports: 'Sehen · Aufmerksamkeit · Konzentration',
        steps: 'Halte ein kontrastreiches Bild etwa 25 Zentimeter vor dein Baby. Bewege es langsam nach links und rechts. Gib deinem Baby Zeit, mit den Augen zu folgen. Ein Bild reicht völlig aus.',
        practice: 'Weniger ist hier mehr. Viele Babys schauen lieber lange auf ein einziges klares Muster als auf ständig wechselnde Bilder.',
        buy: 'Wenn du etwas kaufen möchtest, reichen wenige klare Kontrastkarten. Mehr Motive sind nicht automatisch besser.',
      },
      {
        title: 'Füße entdecken',
        when: 'nach dem Baden · beim Wickeln',
        material: 'Keins',
        supports: 'Körpergefühl · Beweglichkeit · Selbstwahrnehmung',
        steps: 'Führe die Füße deines Babys langsam in sein Blickfeld. Berühre sanft die Zehen und benenne sie. Wenn dein Baby selbst nach den Füßen greift, lass ihm Zeit.',
        practice: 'Irgendwann landen die Füße wahrscheinlich im Mund. Das sieht lustig aus, ist aber ein ganz normaler Entwicklungsschritt.',
      },
      {
        title: 'Geräuschen folgen',
        when: '2-5 Min · wenn dein Baby aufmerksam ist',
        material: 'Deine Stimme, Rassel oder leises Glöckchen',
        supports: 'Hören · Orientierung · Aufmerksamkeit',
        steps: 'Erzeuge links oder rechts neben deinem Baby ein leises Geräusch. Beobachte, ob es Augen oder Kopf in diese Richtung bewegt. Danach wechselst du langsam die Seite.',
        practice: 'Deine Stimme ist oft spannender als jedes Spielzeug. Sprich ruhig und freundlich, statt viele Geräusche auf einmal zu machen.',
      },
      {
        title: 'Bauchlage mit Ziel',
        when: 'mehrmals täglich kurz · wenn dein Baby wach ist',
        material: 'Decke oder Handtuch',
        supports: 'Nackenmuskulatur · Rücken · erste Motorik',
        steps: 'Lege dein Baby für kurze Zeit auf den Bauch und geh selbst auf Augenhöhe. Rede mit ihm oder halte dein Gesicht in sein Blickfeld. So bekommt dein Baby einen guten Grund, den Kopf anzuheben.',
        practice: 'Lieber fünfmal eine Minute als einmal fünf Minuten. Kurze, gute Momente sind oft wertvoller als ein langes Durchhalten.',
      },
    ],
  },
  {
    slug: '6-12-monate',
    key: 'spielideen-6-12',
    label: '6 bis 12 Monate',
    accent: '#2f8578',
    accentDark: '#1f5f56',
    accentSoft: '#eaf5f2',
    title: 'Was spiele ich heute?',
    subtitle: '5 einfache Spielideen für Babys von 6 bis 12 Monaten',
    coverText: 'Greifen, krabbeln, ausprobieren - mit Dingen, die du oft schon zuhause hast.',
    introTitle: 'Jetzt wird alles interessant',
    intro: [
      'Ich bin Boris, Papa eines Sohnes und Gründer von Kleinkind-Welt.',
      'Zwischen 6 und 12 Monaten wird Spielen oft aktiver. Dein Baby greift gezielter, möchte Dinge fallen lassen, sucht Nähe und entfernt sich gleichzeitig ein kleines Stück.',
      'Du brauchst dafür kein volles Spielzimmer. Gute Spiele in dieser Phase sind kurz, wiederholbar und lassen dein Baby selbst etwas bewirken.',
      'Diese Ideen sind Angebote, kein Programm. Jedes Kind entwickelt sich in seinem eigenen Tempo.',
    ],
    phaseNote: 'Greifen · Krabbeln · Ursache und Wirkung',
    nextHref: '/artikel/spielzeug-6-12-monate',
    nextLabel: 'Mehr für 6 bis 12 Monate ansehen',
    closing: [
      'In dieser Phase entsteht oft das Gefühl, dass ständig neues Spielzeug her muss. Meist stimmt das nicht. Dein Baby lernt durch Wiederholung, nicht durch Abwechslung um jeden Preis.',
      'Wenn eine Idee heute nicht klappt, ist sie nicht gescheitert. Versuch sie in zwei Wochen nochmal.',
    ],
    ideas: [
      {
        title: 'Rein, raus, wieder rein',
        when: '5-10 Min · am Boden · ruhige Wachphase',
        material: 'Schüssel und große Tücher oder weiche Bälle',
        supports: 'Greifen · Loslassen · Ursache-Wirkung',
        steps: 'Lege wenige große Gegenstände in eine Schüssel. Zeig einmal langsam, wie du etwas herausnimmst und wieder hineinlegst. Dann gib deinem Baby Zeit. Das Spiel darf sehr schlicht bleiben.',
        practice: 'Bei uns wurde das Ausräumen viel früher verstanden als das Einräumen. Das ist völlig normal. Erst kommt das Entdecken, dann die Ordnung.',
      },
      {
        title: 'Krabbel-Ziel setzen',
        when: '3-8 Min · wenn dein Baby Bewegungsdrang hat',
        material: 'Lieblingsspielzeug oder ein spannender Alltagsgegenstand',
        supports: 'Grobmotorik · Motivation · Raumgefühl',
        steps: 'Lege einen interessanten Gegenstand ein kleines Stück außerhalb der direkten Reichweite. Geh selbst auf Augenhöhe und ermutige dein Baby ruhig. Vergrößere den Abstand nur, wenn es entspannt bleibt.',
        practice: 'Ein Ziel direkt vor die Nase zu legen, war bei uns oft besser als zu weit weg. Kleine Erfolgserlebnisse motivieren mehr als große Herausforderungen.',
      },
      {
        title: 'Tuch-Versteck',
        when: '2-5 Min · Wickeltisch oder Boden',
        material: 'Leichtes Tuch und ein bekanntes Spielzeug',
        supports: 'Objektpermanenz · Aufmerksamkeit · Freude am Suchen',
        steps: 'Verstecke ein Spielzeug halb unter einem Tuch. Frag ruhig: „Wo ist es?“ Zieh das Tuch erst ein Stück weg, dann lass dein Baby selbst entdecken. Später kannst du das Spielzeug ganz verdecken.',
        practice: 'Mach es am Anfang wirklich leicht. Das Erfolgserlebnis ist der Spaß, nicht die perfekte Suche.',
      },
      {
        title: 'Klatschen und Pause',
        when: '1-3 Min · zwischendurch',
        material: 'Nur deine Hände und Stimme',
        supports: 'Rhythmus · Nachahmung · soziale Verbindung',
        steps: 'Klatsche langsam zweimal und mach dann eine Pause. Warte, ob dein Baby reagiert. Wiederhole ein einfaches Muster. Wenn dein Baby nur lächelt oder strampelt, ist das schon Mitmachen.',
        practice: 'Ich musste lernen, Pausen auszuhalten. Babys brauchen oft länger, um zu antworten. Genau diese Pause macht das Spiel spannend.',
      },
      {
        title: 'Becher wandern lassen',
        when: '5 Min · Hochstuhl oder Boden',
        material: 'Zwei leichte Becher',
        supports: 'Handwechsel · Koordination · erstes Problemlösen',
        steps: 'Gib deinem Baby einen Becher in die Hand und biete den zweiten an. Beobachte, ob es den ersten loslässt, wechselt oder beide halten will. Danach kannst du etwas Kleines darunter verstecken.',
        practice: 'Nicht zu viel erklären. Einfach anbieten und schauen. In diesem Alter ist der Weg wichtiger als das Ergebnis.',
        buy: 'Stapelbecher sind für diese Phase oft sinnvoller als komplexes Aktivitätsspielzeug, weil sie länger nutzbar bleiben.',
      },
    ],
  },
  {
    slug: '12-18-monate',
    key: 'spielideen-12-18',
    label: '12 bis 18 Monate',
    accent: '#ca493a',
    accentDark: '#8f342b',
    accentSoft: '#faebe7',
    title: 'Was spiele ich heute?',
    subtitle: '5 schnelle Spielideen für Kinder von 12 bis 18 Monaten',
    coverText: 'Laufen, stapeln, nachahmen - alltagstaugliche Ideen ohne große Vorbereitung.',
    introTitle: 'Jetzt wird Wiederholung Gold wert',
    intro: [
      'Ich bin Boris, Papa eines Sohnes und Gründer von Kleinkind-Welt.',
      'Mit 12 bis 18 Monaten wirkt vieles chaotisch: Dinge werden ausgeräumt, umgeworfen, wiederholt und sofort nochmal gemacht.',
      'Genau darin steckt viel Lernen. Dein Kind übt Ursache und Wirkung, Sprache, Gleichgewicht und erste kleine Entscheidungen.',
      'Diese Ideen sind Angebote, kein Programm. Jedes Kind entwickelt sich in seinem eigenen Tempo.',
    ],
    phaseNote: 'erste Schritte · erste Wörter · alles erkunden',
    nextHref: '/artikel/spielzeug-12-18-monate',
    nextLabel: 'Mehr für 12 bis 18 Monate ansehen',
    closing: [
      'Wenn dein Kind Dinge zum zehnten Mal umwirft, ist das nicht gegen dich gerichtet. Es prüft, ob die Welt noch genauso funktioniert wie eben.',
      'Gute Spiele in dieser Phase dürfen einfach sein. Wiederholung ist kein Mangel, sondern das eigentliche Training.',
    ],
    ideas: [
      {
        title: 'Becher-Türme stapeln und umwerfen',
        when: '10-15 Min · drinnen · bei Bewegungsdrang',
        material: '3 bis 5 stapelbare Becher oder leere Joghurtbecher',
        supports: 'Auge-Hand-Koordination · Ursache-Wirkung · Frustrationstoleranz',
        steps: 'Stapelt gemeinsam einen Turm und lass dein Kind ihn umwerfen. Jubelt beim Umfallen. Wiederholt es ruhig oft, denn die Wiederholung ist für dein Kind das eigentliche Spiel, nicht der fertige Turm.',
        practice: 'Wenn dein Kind schon laufen kann, lass es auch mal selbst dagegen laufen. Das hat bei uns für sehr viel Gelächter gesorgt.',
        buy: 'Ein schlichtes Stapelbecher-Set reicht völlig. Es muss nicht blinken, sprechen oder besonders groß sein.',
      },
      {
        title: 'Der Wäscheklammer-Schatz',
        when: '5 Min · während du kochst',
        material: 'Große Holz-Wäscheklammern und ein Behälter',
        supports: 'Feinmotorik · Pinzettengriff · Konzentration',
        steps: 'Gib deinem Kind Klammern und eine Schüssel. Reinwerfen, rausnehmen, wieder rein. Zeig einmal, wie man eine Klammer an den Rand steckt. Danach darf dein Kind ausprobieren.',
        practice: 'Dieses Spiel klappt oft erst beim zweiten oder dritten Mal richtig. Am Anfang ist schon das Anschauen der Klammer spannend.',
        note: 'Bitte nur unter Aufsicht und mit stabilen, großen Klammern spielen lassen.',
      },
      {
        title: 'Kissen-Parcours',
        when: '10 Min · Regentag · bei Bewegungsdrang',
        material: 'Sofakissen, Decken und ein Kuscheltier',
        supports: 'Grobmotorik · Gleichgewicht · Körpergefühl',
        steps: 'Leg Kissen als kleinen Weg auf den Boden. Zeig, wie dein Kind darübersteigen oder krabbeln kann. Ein Kuscheltier am Ende als Ziel motiviert zusätzlich.',
        practice: 'Mein Lieblingsspiel für volle Wohnzimmer-Tage. Es wirkt wild, ist aber oft genau die Bewegung, die ein Kind gerade braucht.',
        note: 'Achte auf rutschfesten Untergrund und genug Platz.',
      },
      {
        title: 'Benennen am Fenster',
        when: '5 Min · ruhiger Moment',
        material: 'Nur ein Fenster',
        supports: 'Sprache · Wortschatz · gemeinsame Aufmerksamkeit',
        steps: 'Schau mit deinem Kind aus dem Fenster und benenne ruhig, was ihr seht: „Auto. Rotes Auto. Hund. Der Hund läuft.“ Kurze Wörter und kleine Pausen reichen völlig.',
        practice: 'Mach dich nicht an der Aussprache fest. Wenn dein Kind etwas Ähnliches sagt, greif es freundlich auf und wiederhole das Wort klar.',
      },
      {
        title: 'Sortieren mit Alltagsschätzen',
        when: '10 Min · konzentrierte Phase',
        material: '2 Schüsseln und große, ungefährliche Gegenstände',
        supports: 'Kategorien bilden · Feinmotorik · erstes logisches Denken',
        steps: 'Misch zwei Sorten Gegenstände und zeig, wie man sie in zwei Schüsseln sortiert. Am Anfang hilfst du, später findet dein Kind eigene Regeln.',
        practice: 'Bei uns funktionierte es mit Obst besonders gut. Achtung, kleine Sauerei-Gefahr. Aber genau das machte es interessant.',
      },
    ],
  },
  {
    slug: '18-24-monate',
    key: 'spielideen-18-24',
    label: '18 bis 24 Monate',
    accent: '#d5a642',
    accentDark: '#8a661e',
    accentSoft: '#fbf1d9',
    title: 'Was spiele ich heute?',
    subtitle: '5 Spielideen für Kinder von 18 bis 24 Monaten',
    coverText: 'Nachahmen, sortieren, bewegen - kleine Spiele für eine sehr aktive Phase.',
    introTitle: 'Dein Kind will mitmachen',
    intro: [
      'Ich bin Boris, Papa eines Sohnes und Gründer von Kleinkind-Welt.',
      'Zwischen 18 und 24 Monaten wollen viele Kinder nicht nur zuschauen. Sie wollen helfen, nachmachen, tragen, rühren, sortieren und Dinge selbst entscheiden.',
      'Gute Spiele nutzen genau das: Alltag wird zum Spiel, ohne dass du viel vorbereiten musst.',
      'Diese Ideen sind Angebote, kein Programm. Jedes Kind entwickelt sich in seinem eigenen Tempo.',
    ],
    phaseNote: 'Nachahmung · Sprache · erste kleine Aufgaben',
    nextHref: '/artikel/spielzeug-18-24-monate',
    nextLabel: 'Mehr für 18 bis 24 Monate ansehen',
    closing: [
      'In dieser Phase ist dein Kind oft größer im Kopf als in der Koordination. Es will viel, kann aber noch nicht alles. Das kann frustrieren.',
      'Hilfreich sind kleine Aufgaben, die wirklich gelingen können. Nicht perfekt, aber selbst gemacht.',
    ],
    ideas: [
      {
        title: 'Kochlöffel-Küche',
        when: '10 Min · während du kochst',
        material: 'Topf, Kochlöffel und große ungefährliche Gegenstände',
        supports: 'Rollenspiel · Nachahmung · Sprache',
        steps: 'Gib deinem Kind einen leeren Topf und einen Löffel. Es darf rühren, probieren, anbieten und dich nachahmen. Benenne ruhig: „Du rührst. Das ist heiß gespielt. Ich koste.“',
        practice: 'Wenn ich wirklich gekocht habe, wollte unser Sohn oft auch kochen. Ein eigener leerer Topf hat erstaunlich oft gereicht.',
      },
      {
        title: 'Farben sammeln',
        when: '5-10 Min · ruhiger Moment',
        material: 'Zwei farbige Schalen und passende sichere Gegenstände',
        supports: 'Sortieren · Aufmerksamkeit · erste Farbwörter',
        steps: 'Lege wenige Gegenstände bereit und sammelt gemeinsam alles Rote in eine Schale, alles Blaue in die andere. Wenn Farben noch nicht sitzen, ist das egal. Das Sortieren zählt.',
        practice: 'Ich würde in diesem Alter nicht abfragen. Lieber beiläufig benennen: „Das ist rot. Ich lege es hierhin.“',
      },
      {
        title: 'Baustein-Brücke',
        when: '10 Min · drinnen',
        material: 'Klötze, Bücher oder Duplo-Steine',
        supports: 'Bauen · Problemlösen · räumliches Denken',
        steps: 'Baut eine kleine Brücke für ein Auto oder Tier. Wenn sie einstürzt, baut ihr sie wieder. Zeig langsam, dass zwei Stützen und ein Teil oben eine Brücke ergeben.',
        practice: 'Das Umfallen war bei uns mindestens so spannend wie die fertige Brücke. Das ist kein Scheitern, sondern Teil des Spiels.',
        buy: 'Wenn du etwas kaufen möchtest, sind einfache große Bausteine oder Duplo oft vielseitiger als Spezialsets.',
      },
      {
        title: 'Suchauftrag im Zimmer',
        when: '3-5 Min · vor dem Aufräumen',
        material: 'Alltagsgegenstände im Raum',
        supports: 'Verstehen · Sprache · Arbeitsgedächtnis',
        steps: 'Gib einen sehr einfachen Auftrag: „Bring mir den Ball.“ Später werden daraus zwei Schritte: „Hol den Ball und leg ihn in die Kiste.“ Lob den Versuch, nicht nur das perfekte Ergebnis.',
        practice: 'Wenn es nicht klappt, war der Auftrag oft zu lang. Ein Schritt weniger hilft mehr als nochmal lauter zu erklären.',
      },
      {
        title: 'Klebeband-Malstraße',
        when: '10 Min · kreative Phase',
        material: 'Papier, Malstifte und leicht lösbares Klebeband',
        supports: 'Kreativität · Handführung · erstes Planen',
        steps: 'Klebe Papier auf dem Tisch fest und male eine einfache Straße. Dein Kind kann Linien, Punkte oder Kreise dazu malen. Danach fährt ein Auto darüber.',
        practice: 'Papier festzukleben klingt banal, verhindert aber viel Frust. Das Blatt rutscht nicht weg und dein Kind kann kräftiger malen.',
      },
    ],
  },
  {
    slug: '2-jahre',
    key: 'spielideen-2-jahre',
    label: '2 Jahre',
    accent: '#8a7ab8',
    accentDark: '#5c4f87',
    accentSoft: '#f0edf8',
    title: 'Was spiele ich heute?',
    subtitle: '5 Spielideen für Kinder rund um 2 Jahre',
    coverText: 'Mehr Sprache, mehr Fantasie, mehr „selber machen“ - ohne komplizierte Vorbereitung.',
    introTitle: 'Zwei Jahre sind kein kleiner Erwachsener',
    intro: [
      'Ich bin Boris, Papa eines Sohnes und Gründer von Kleinkind-Welt.',
      'Mit rund 2 Jahren wirkt vieles schon ziemlich groß. Gleichzeitig kippt die Stimmung manchmal innerhalb von Sekunden.',
      'Gute Spiele geben deinem Kind eine klare kleine Aufgabe und trotzdem genug Freiheit, selbst zu entscheiden.',
      'Diese Ideen sind Angebote, kein Programm. Jedes Kind entwickelt sich in seinem eigenen Tempo.',
    ],
    phaseNote: 'Sprache · Fantasie · selber machen',
    nextHref: '/artikel/spielzeug-2-jahre',
    nextLabel: 'Mehr für 2-Jährige ansehen',
    closing: [
      'Mit 2 Jahren darf Spielen ruhig nach Alltag aussehen. Einkaufen, kochen, bauen, transportieren und erzählen sind keine Nebensachen. Genau darüber versteht dein Kind die Welt.',
      'Wenn dein Kind eine Idee komplett anders spielt, ist das oft ein gutes Zeichen. Dann ist es wirklich im Spiel angekommen.',
    ],
    ideas: [
      {
        title: 'Mini-Einkaufsladen',
        when: '10-15 Min · drinnen',
        material: 'Tasche, leere Verpackungen, Obst oder Bauklötze',
        supports: 'Rollenspiel · Sprache · Sortieren',
        steps: 'Leg ein paar Dinge als kleinen Laden aus. Dein Kind darf einkaufen, bezahlen, einpacken und wieder ausräumen. Nutze kurze Sätze: „Ich nehme eine Banane. Danke.“',
        practice: 'Bei uns war das Bezahlen manchmal wichtiger als der Einkauf. Ein Holzklotz als „Karte“ hat völlig gereicht.',
      },
      {
        title: 'Tierwege durchs Zimmer',
        when: '5-10 Min · bei Bewegungsdrang',
        material: 'Keins oder kleine Tierfiguren',
        supports: 'Grobmotorik · Nachahmung · Fantasie',
        steps: 'Ihr bewegt euch wie verschiedene Tiere: langsam wie Schildkröten, groß wie Bären, leise wie Katzen. Danach darf dein Kind ein Tier aussuchen.',
        practice: 'Ich würde die Tiere nicht zu perfekt vormachen. Wenn es albern wird, wird es oft erst richtig gut.',
      },
      {
        title: 'Wasser umfüllen',
        when: '10 Min · Küche, Bad oder Balkon',
        material: 'Schüssel, Becher, Löffel und wenig Wasser',
        supports: 'Feinmotorik · Konzentration · Mengenverständnis',
        steps: 'Fülle wenig Wasser in eine Schüssel. Dein Kind darf mit Bechern, Löffeln oder kleinen Kellen umfüllen. Begleite mit Worten: voll, leer, mehr, weniger.',
        practice: 'Ein Handtuch vorher hinzulegen entspannt alle. Dann ist ein bisschen Kleckern kein Problem, sondern Teil des Spiels.',
        note: 'Bitte Wasser immer begleiten und kleine Kinder nie unbeaufsichtigt lassen.',
      },
      {
        title: 'Bildergeschichte mit drei Dingen',
        when: '5 Min · vor dem Schlafen',
        material: 'Drei kleine Gegenstände oder Figuren',
        supports: 'Sprache · Reihenfolge · Fantasie',
        steps: 'Leg drei Dinge hin und erzähl eine Mini-Geschichte: „Der Bär fährt Auto. Dann isst er Apfel. Dann schläft er.“ Danach darf dein Kind die Reihenfolge ändern.',
        practice: 'Drei Dinge reichen. Wenn ich zu viel Material hinlege, wird aus Erzählen schnell nur noch Ausräumen.',
      },
      {
        title: 'Baustelle mit Kissen',
        when: '10-15 Min · drinnen',
        material: 'Kissen, Decken, Bausteine oder Fahrzeuge',
        supports: 'Planen · Bewegung · freies Spiel',
        steps: 'Baut gemeinsam eine kleine Baustelle: Kissen als Hügel, Decke als Straße, Klötze als Ladung. Dein Kind darf transportieren, kippen und neu aufbauen.',
        practice: 'Der Trick ist, nicht zu früh zu übernehmen. Lieber eine einfache Szene starten und dann schauen, wohin dein Kind sie führt.',
      },
    ],
  },
  {
    slug: '3-jahre',
    key: 'spielideen-3-jahre',
    label: '3 Jahre',
    accent: '#d56d5e',
    accentDark: '#99483d',
    accentSoft: '#faece9',
    title: 'Was spiele ich heute?',
    subtitle: '5 Spielideen für Kinder rund um 3 Jahre',
    coverText: 'Mehr Fantasie, mehr Fragen, mehr eigene Regeln - mit Spielen, die im Alltag funktionieren.',
    introTitle: 'Jetzt entstehen eigene Welten',
    intro: [
      'Ich bin Boris, Papa eines Sohnes und Gründer von Kleinkind-Welt.',
      'Mit rund 3 Jahren wird Spielen oft erzählerischer. Kinder erfinden Rollen, Regeln, Probleme und Lösungen.',
      'Gute Ideen geben nur einen Startpunkt. Den Rest darf dein Kind mitgestalten.',
      'Diese Ideen sind Angebote, kein Programm. Jedes Kind entwickelt sich in seinem eigenen Tempo.',
    ],
    phaseNote: 'Fantasie · Sprache · erste Regeln',
    nextHref: '/artikel/spielzeug-3-jahre',
    nextLabel: 'Mehr für 3-Jährige ansehen',
    closing: [
      'Mit 3 Jahren muss Spielen nicht mehr immer ruhig oder ordentlich sein. Oft entsteht Lernen gerade dann, wenn Kinder eigene Regeln erfinden.',
      'Du musst nicht dauernd Entertainer sein. Ein guter Impuls und echtes Interesse reichen oft.',
    ],
    ideas: [
      {
        title: 'Schatzkarte malen',
        when: '10-15 Min · ruhiger Nachmittag',
        material: 'Papier, Stift und ein kleiner Schatz',
        supports: 'Planung · Raumverständnis · Fantasie',
        steps: 'Male einen einfachen Grundriss: Sofa, Tisch, Tür. Verstecke einen kleinen Schatz und markiere ihn auf der Karte. Danach darf dein Kind selbst eine Karte für dich malen.',
        practice: 'Die Karte muss nicht stimmen. Entscheidend ist, dass dein Kind eine Idee von Weg, Ort und Ziel entwickelt.',
      },
      {
        title: 'Warum-Kette',
        when: '5 Min · unterwegs oder zuhause',
        material: 'Keins',
        supports: 'Sprache · Denken · Zusammenhänge',
        steps: 'Starte mit einer einfachen Beobachtung: „Die Straße ist nass.“ Dann fragt ihr gemeinsam warum. Regen, Wolken, Wetter. Bleib kurz und greif die Ideen deines Kindes auf.',
        practice: 'Ich versuche nicht, jede Frage perfekt zu beantworten. Manchmal ist „Was glaubst du?“ der bessere Start.',
      },
      {
        title: 'Arztpraxis für Kuscheltiere',
        when: '15 Min · Rollenspielphase',
        material: 'Kuscheltier, Tuch, Löffel als Thermometer',
        supports: 'Empathie · Sprache · Rollenspiel',
        steps: 'Ein Kuscheltier ist krank. Dein Kind darf fragen, untersuchen, trösten und einen Verband anlegen. Du spielst Patient oder Assistent.',
        practice: 'Rollenspiele sind bei uns oft ein Fenster in echte Themen. Man merkt schnell, was ein Kind beschäftigt.',
      },
      {
        title: 'Muster legen',
        when: '10 Min · konzentrierter Moment',
        material: 'Knöpfe, Bausteine oder große Naturmaterialien',
        supports: 'Logik · Feinmotorik · Muster erkennen',
        steps: 'Lege ein einfaches Muster: rot, blau, rot, blau. Dein Kind darf weitermachen oder ein eigenes Muster erfinden. Am Anfang reichen zwei Kategorien.',
        practice: 'Wenn das Muster nicht fortgesetzt wird, nicht korrigieren wie in der Schule. Frag lieber: „Wie geht deine Reihe weiter?“',
      },
      {
        title: 'Bewegungs-Würfel ohne Würfel',
        when: '5-10 Min · wenn Energie raus muss',
        material: 'Zettel mit Bewegungen oder nur Zurufe',
        supports: 'Körpergefühl · Regeln verstehen · Impulskontrolle',
        steps: 'Ruft abwechselnd Bewegungen: hüpfen, schleichen, drehen, einfrieren. Nach jedem Auftrag kommt ein klares Stopp. Danach darf dein Kind der Spielleiter sein.',
        practice: 'Das „Einfrieren“ ist Gold wert. Es macht Spaß und übt gleichzeitig, eine Bewegung kurz zu stoppen.',
      },
    ],
  },
  {
    slug: 'geschenke-geburtstage',
    key: 'spielideen-geschenke-geburtstage',
    label: 'Geschenke & Geburtstage',
    accent: '#c9a35b',
    accentDark: '#876b35',
    accentSoft: '#f6ecd9',
    title: 'Was schenke ich wirklich?',
    subtitle: '5 ehrliche Geschenkideen für Kleinkinder und Familien',
    coverText: 'Weniger Fehlkäufe, mehr Alltagstauglichkeit - für Geburtstage, Besuch und kleine Mitbringsel.',
    introTitle: 'Gute Geschenke müssen nicht laut sein',
    intro: [
      'Ich bin Boris, Papa eines Sohnes und Gründer von Kleinkind-Welt.',
      'Bei Geschenken für Kleinkinder ist die Versuchung groß: möglichst bunt, möglichst groß, möglichst besonders.',
      'In der Praxis gewinnen oft die Dinge, die Eltern im Alltag wirklich nutzen oder die ein Kind immer wieder neu spielen kann.',
      'Diese Ideen sind Angebote, kein Programm. Jedes Kind und jede Familie ist anders.',
    ],
    phaseNote: 'Geschenkidee · Alltag · weniger Fehlkäufe',
    nextHref: '/geschenke-kleinkind',
    nextLabel: 'Mehr Geschenkideen ansehen',
    closing: [
      'Ein gutes Geschenk muss nicht beweisen, wie viel Mühe du dir gemacht hast. Es darf schlicht sein, wenn es wirklich passt.',
      'Wenn du unsicher bist, frag lieber nach. Das ist weniger überraschend, aber oft deutlich hilfreicher.',
    ],
    ideas: [
      {
        title: 'Das Nachkauf-Geschenk',
        when: 'wenn du die Familie gut kennst',
        material: 'Etwas, das ohnehin ständig gebraucht wird',
        supports: 'Alltag entlasten · Fehlkäufe vermeiden · Eltern wirklich helfen',
        steps: 'Frag nach, was gerade oft nachgekauft wird: gute Stifte, Badeknete, Puzzleteile, Bücher einer Reihe oder Verbrauchsmaterial. Verpacke es schön, statt zwanghaft etwas Neues zu suchen.',
        practice: 'Ich unterschätze solche Geschenke selbst schnell. Aber Eltern freuen sich oft mehr über brauchbare Dinge als über den nächsten großen Plastik-Karton.',
      },
      {
        title: 'Das Draußen-Set',
        when: 'Frühling, Sommer oder Gartenbesuch',
        material: 'Eimer, Schaufel, Ball, Straßenkreide oder Seifenblasen',
        supports: 'Bewegung · gemeinsames Spielen · robuste Nutzung',
        steps: 'Stell ein kleines Set zusammen, das sofort draußen funktioniert. Lieber drei robuste Dinge als ein großes Set mit vielen Kleinteilen.',
        practice: 'Draußen-Spielzeug darf Gebrauchsspuren bekommen. Genau das ist oft ein Zeichen, dass es wirklich genutzt wird.',
      },
      {
        title: 'Buch plus gemeinsame Zeit',
        when: 'Geburtstag, Besuch oder ruhiges Mitbringsel',
        material: 'Pappbilderbuch und eine kleine Vorlese-Karte',
        supports: 'Sprache · Bindung · Ritual',
        steps: 'Schenk ein altersgerechtes Buch und schreib dazu: „Ich lese dir das beim nächsten Besuch vor.“ Damit wird aus einem Gegenstand ein gemeinsamer Moment.',
        practice: 'Bei uns bleiben Bücher eher hängen, wenn sie mit Personen verbunden sind. Das macht ein kleines Geschenk persönlicher.',
      },
      {
        title: 'Gutschein für echte Entlastung',
        when: 'zur Geburt oder für erschöpfte Eltern',
        material: 'Karte, Essen, Babysitting-Zeit oder Erledigung',
        supports: 'Eltern entlasten · Beziehung stärken · praktisch helfen',
        steps: 'Formuliere den Gutschein konkret: „Ich bringe euch am Dienstag Abendessen“ ist besser als „Melde dich, wenn du etwas brauchst“. Je konkreter, desto eher wird Hilfe angenommen.',
        practice: 'Das klingt weniger spektakulär als Spielzeug, ist aber manchmal das wertvollste Geschenk überhaupt.',
      },
      {
        title: 'Ein Spiel, das mitwächst',
        when: 'wenn es doch Spielzeug sein soll',
        material: 'Bausteine, Stapelbecher, Figuren, Tücher oder einfache Fahrzeuge',
        supports: 'freies Spiel · lange Nutzungsdauer · Fantasie',
        steps: 'Wähle Spielzeug, das nicht nur eine Funktion hat. Ein Stapelbecher kann Becher, Turm, Badspielzeug, Sandform und Versteck sein. Genau diese Offenheit macht es langlebig.',
        practice: 'Ich würde fast immer offenes Spielzeug einem lauten Einzweck-Spielzeug vorziehen. Es sieht unspektakulärer aus, wird aber oft länger genutzt.',
      },
    ],
  },
];

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const cleanHtml = (value) => value.replace(/[ \t]+$/gm, '');

const pageScript = `
<script>
  (function() {
    document.addEventListener('DOMContentLoaded', function() {
      var params = new URLSearchParams(location.search);
      var page = params.get('renderPage');
      if (!page) return;
      document.documentElement.classList.add('render-single-page');
      document.querySelectorAll('[data-page]').forEach(function(section) {
        section.hidden = section.getAttribute('data-page') !== page;
      });
    });
  })();
</script>`;

function brandBlock() {
  return '<div class="brand">Kleinkind-Welt</div><div class="tagline">Ehrliche Empfehlungen für Eltern</div>';
}

function desktopIdeaPage(group, idea, index) {
  const number = String(index + 1).padStart(2, '0');
  return `
  <section class="page idea-page" data-page="${index + 3}">
    <div class="page-top">${brandBlock()}<span>${escapeHtml(group.label)}</span></div>
    <article class="idea-card">
      <div class="idea-head">
        <span class="number">${number}</span>
        <div>
          <div class="kicker">Spielidee ${number}</div>
          <h2>${escapeHtml(idea.title)}</h2>
          <p class="meta-line">${escapeHtml(idea.when)}</p>
        </div>
      </div>
      <div class="meta-grid">
        <div><strong>Material</strong><span>${escapeHtml(idea.material)}</span></div>
        <div><strong>Fördert</strong><span>${escapeHtml(idea.supports)}</span></div>
      </div>
      <div class="text-box steps"><strong>So geht's</strong><p>${escapeHtml(idea.steps)}</p></div>
      ${idea.note ? `<div class="text-box note"><strong>Hinweis</strong><p>${escapeHtml(idea.note)}</p></div>` : ''}
      <div class="text-box practice"><strong>Boris' Praxistipp</strong><p>${escapeHtml(idea.practice)}</p></div>
      ${idea.buy ? `<div class="text-box buy"><strong>Tipp zum Kaufen</strong><p>${escapeHtml(idea.buy)}</p></div>` : ''}
    </article>
    <footer>kleinkind-welt.de</footer>
  </section>`;
}

function mobileIdeaPage(group, idea, index) {
  const number = String(index + 1).padStart(2, '0');
  return `
  <section class="page mobile-page idea-page" data-page="${index + 3}">
    <div class="page-top">${brandBlock()}<span>${escapeHtml(group.label)}</span></div>
    <article class="idea-card">
      <div class="idea-head">
        <span class="number">${number}</span>
        <div>
          <div class="kicker">Spielidee ${number}</div>
          <h2>${escapeHtml(idea.title)}</h2>
          <p class="meta-line">${escapeHtml(idea.when)}</p>
        </div>
      </div>
      <div class="meta-grid">
        <div><strong>Material</strong><span>${escapeHtml(idea.material)}</span></div>
        <div><strong>Fördert</strong><span>${escapeHtml(idea.supports)}</span></div>
      </div>
      <div class="text-box steps"><strong>So geht's</strong><p>${escapeHtml(idea.steps)}</p></div>
      ${idea.note ? `<div class="text-box note"><strong>Hinweis</strong><p>${escapeHtml(idea.note)}</p></div>` : ''}
      <div class="text-box practice"><strong>Boris' Praxistipp</strong><p>${escapeHtml(idea.practice)}</p></div>
      ${idea.buy ? `<div class="text-box buy"><strong>Tipp zum Kaufen</strong><p>${escapeHtml(idea.buy)}</p></div>` : ''}
    </article>
    <footer>kleinkind-welt.de</footer>
  </section>`;
}

function baseCss(group, mode) {
  const isMobile = mode === 'mobile';
  return `
    :root {
      --accent: ${group.accent};
      --accent-dark: ${group.accentDark};
      --accent-soft: ${group.accentSoft};
      --paper: #fbf6ee;
      --card: #fffdf9;
      --ink: #2f2b28;
      --muted: #6e625b;
      --line: #eadfd3;
      --warm: #f4eadf;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; color: var(--ink); background: #e8ded4; font-family: "Nunito Sans", "Inter", "DejaVu Sans", system-ui, sans-serif; line-height: 1.48; }
    h1, h2, h3, p { margin: 0; }
    h1, h2, h3 { line-height: 1.05; letter-spacing: 0; font-family: "Poppins", "Nunito Sans", "DejaVu Sans", system-ui, sans-serif; }
    a { color: inherit; text-decoration: none; }
    @page { size: ${isMobile ? '405pt 720pt' : 'A4'}; margin: 0; }
    .page {
      position: relative;
      width: ${isMobile ? '405pt' : '210mm'};
      height: ${isMobile ? '720pt' : '297mm'};
      overflow: hidden;
      page-break-after: always;
      background:
        radial-gradient(circle at 85% 10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 28%),
        var(--paper);
      padding: ${isMobile ? '30pt 28pt 24pt' : '22mm 20mm 18mm'};
    }
    .page:last-child { page-break-after: auto; }
    .brand { color: var(--accent-dark); font-size: ${isMobile ? '11pt' : '11pt'}; font-weight: 900; white-space: nowrap; }
    .tagline { margin-top: 1pt; color: var(--muted); font-size: ${isMobile ? '7.5pt' : '8pt'}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; }
    .page-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16pt; color: var(--muted); font-size: ${isMobile ? '9pt' : '9pt'}; font-weight: 800; }
    .cover { background: linear-gradient(150deg, var(--paper) 0%, #fffaf2 48%, var(--accent-soft) 100%); }
    .cover::before { content: ""; position: absolute; inset: auto 0 0; height: ${isMobile ? '96pt' : '34mm'}; background: var(--accent-dark); }
    .cover::after { content: ""; position: absolute; right: ${isMobile ? '-80pt' : '-35mm'}; top: ${isMobile ? '95pt' : '36mm'}; width: ${isMobile ? '220pt' : '92mm'}; height: ${isMobile ? '220pt' : '92mm'}; border-radius: 999px; background: color-mix(in srgb, var(--accent) 18%, transparent); }
    .cover-content { position: relative; z-index: 1; margin-top: ${isMobile ? '86pt' : '42mm'}; max-width: ${isMobile ? '320pt' : '136mm'}; }
    .eyebrow, .kicker, .section-label { color: var(--accent-dark); font-size: ${isMobile ? '9pt' : '9pt'}; font-weight: 900; letter-spacing: 0.14em; text-transform: uppercase; }
    .cover h1 { margin-top: ${isMobile ? '14pt' : '8mm'}; font-size: ${isMobile ? '40pt' : '44pt'}; max-width: ${isMobile ? '300pt' : '132mm'}; }
    .cover .subtitle { margin-top: ${isMobile ? '12pt' : '8mm'}; color: var(--ink); font-size: ${isMobile ? '16pt' : '16pt'}; font-weight: 800; max-width: ${isMobile ? '300pt' : '122mm'}; }
    .cover .lead { margin-top: ${isMobile ? '10pt' : '6mm'}; color: var(--muted); font-size: ${isMobile ? '13.5pt' : '12.5pt'}; max-width: ${isMobile ? '292pt' : '116mm'}; }
    .pill { display: inline-flex; margin-top: ${isMobile ? '20pt' : '12mm'}; padding: ${isMobile ? '8pt 15pt' : '4mm 8mm'}; border-radius: 999px; color: #fff; background: var(--accent); font-size: ${isMobile ? '11.5pt' : '11pt'}; font-weight: 900; }
    .cover-note { position: absolute; z-index: 1; left: ${isMobile ? '28pt' : '20mm'}; right: ${isMobile ? '28pt' : '20mm'}; bottom: ${isMobile ? '32pt' : '21mm'}; color: #fff; font-size: ${isMobile ? '10.5pt' : '9pt'}; font-weight: 750; }
    .intro h2, .closing h2 { margin-top: ${isMobile ? '58pt' : '28mm'}; font-size: ${isMobile ? '32pt' : '34pt'}; max-width: ${isMobile ? '320pt' : '140mm'}; }
    .intro p, .closing p { margin-top: ${isMobile ? '12pt' : '5mm'}; color: var(--ink); font-size: ${isMobile ? '13.8pt' : '12.2pt'}; max-width: ${isMobile ? '318pt' : '150mm'}; }
    .intro-list { display: grid; gap: ${isMobile ? '8pt' : '3mm'}; margin: ${isMobile ? '18pt 0 0' : '8mm 0 0'}; padding: 0; list-style: none; }
    .intro-list li, .safety-box, .text-box, .meta-grid > div { border: 1px solid var(--line); border-radius: ${isMobile ? '18pt' : '5mm'}; background: var(--card); }
    .intro-list li { padding: ${isMobile ? '10pt 12pt' : '4mm 5mm'}; color: var(--muted); font-size: ${isMobile ? '12.2pt' : '11pt'}; font-weight: 720; }
    .safety-box { margin-top: ${isMobile ? '15pt' : '7mm'}; padding: ${isMobile ? '12pt' : '5mm'}; border-left: ${isMobile ? '5pt' : '1.5mm'} solid var(--accent); color: var(--muted); font-size: ${isMobile ? '11.5pt' : '10.5pt'}; }
    .idea-page { padding-top: ${isMobile ? '24pt' : '18mm'}; }
    .idea-card { margin-top: ${isMobile ? '54pt' : '24mm'}; padding: ${isMobile ? '20pt' : '8mm'}; border-radius: ${isMobile ? '28pt' : '8mm'}; background: var(--card); border: 1px solid var(--line); box-shadow: 0 12pt 32pt rgba(47,43,40,0.08); }
    .idea-head { display: grid; grid-template-columns: ${isMobile ? '54pt 1fr' : '19mm 1fr'}; gap: ${isMobile ? '13pt' : '5mm'}; align-items: center; }
    .number { display: grid; place-items: center; width: ${isMobile ? '54pt' : '18mm'}; height: ${isMobile ? '54pt' : '18mm'}; border-radius: 999px; color: #fff; background: var(--accent); font-size: ${isMobile ? '15pt' : '15pt'}; font-weight: 950; }
    .idea h2 { margin-top: ${isMobile ? '4pt' : '1mm'}; font-size: ${isMobile ? '27pt' : '28pt'}; }
    .meta-line { margin-top: ${isMobile ? '8pt' : '2mm'}; color: var(--muted); font-size: ${isMobile ? '12.3pt' : '10.8pt'}; font-weight: 760; }
    .meta-grid { display: grid; grid-template-columns: ${isMobile ? '1fr' : '1fr 1fr'}; gap: ${isMobile ? '8pt' : '3mm'}; margin-top: ${isMobile ? '16pt' : '6mm'}; }
    .meta-grid > div { padding: ${isMobile ? '10pt 12pt' : '4mm'}; background: var(--accent-soft); }
    .meta-grid strong, .text-box strong { display: block; margin-bottom: ${isMobile ? '4pt' : '1mm'}; color: var(--accent-dark); font-size: ${isMobile ? '10pt' : '9pt'}; letter-spacing: 0.08em; text-transform: uppercase; }
    .meta-grid span { display: block; color: var(--ink); font-size: ${isMobile ? '12.3pt' : '10.8pt'}; font-weight: 760; }
    .text-box { margin-top: ${isMobile ? '10pt' : '4mm'}; padding: ${isMobile ? '12pt' : '5mm'}; }
    .text-box p { color: var(--ink); font-size: ${isMobile ? '13.2pt' : '11.7pt'}; }
    .steps { background: #fffaf2; }
    .practice { border-left: ${isMobile ? '5pt' : '1.5mm'} solid var(--accent); background: color-mix(in srgb, var(--accent-soft) 72%, #fff); }
    .note { background: #fff7e8; }
    .buy { background: #f7f1ea; }
    .closing .cta { margin-top: ${isMobile ? '24pt' : '10mm'}; padding: ${isMobile ? '18pt' : '8mm'}; border-radius: ${isMobile ? '26pt' : '8mm'}; color: #fff; background: var(--accent-dark); }
    .cta h3 { font-size: ${isMobile ? '25pt' : '27pt'}; }
    .cta p { color: rgba(255,255,255,0.88); font-size: ${isMobile ? '13pt' : '12pt'}; }
    .button { display: inline-flex; margin-top: ${isMobile ? '16pt' : '6mm'}; padding: ${isMobile ? '11pt 16pt' : '3.5mm 6mm'}; border-radius: 999px; color: var(--accent-dark); background: #fff; font-size: ${isMobile ? '12pt' : '11pt'}; font-weight: 900; }
    .footer-note { margin-top: ${isMobile ? '18pt' : '8mm'}; color: var(--muted); font-size: ${isMobile ? '10.6pt' : '9pt'}; }
    footer { position: absolute; left: ${isMobile ? '28pt' : '20mm'}; right: ${isMobile ? '28pt' : '20mm'}; bottom: ${isMobile ? '18pt' : '10mm'}; padding-top: ${isMobile ? '8pt' : '3mm'}; border-top: 1px solid var(--line); color: var(--muted); font-size: ${isMobile ? '9pt' : '8.5pt'}; }
    @media screen {
      body { padding: 14px; }
      .page { margin: 0 auto 14px; box-shadow: 0 12px 40px rgba(35,28,20,0.18); }
      html.render-single-page body { padding: 0; background: var(--paper); }
      html.render-single-page .page { margin: 0; box-shadow: none; }
    }
  `;
}

function desktopHtml(group) {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Spielideen-Kompass ${escapeHtml(group.label)} | Kleinkind-Welt</title>
  <link rel="canonical" href="https://kleinkind-welt.de/freebies/spielideen-kompass-${group.slug}">
  <style>${baseCss(group, 'desktop')}</style>
  ${pageScript}
</head>
<body>
  <section class="page cover" data-page="1">
    ${brandBlock()}
    <div class="cover-content">
      <div class="eyebrow">Dein Spielideen-Kompass</div>
      <h1>${escapeHtml(group.title)}</h1>
      <p class="subtitle">${escapeHtml(group.subtitle)}</p>
      <p class="lead">${escapeHtml(group.coverText)}</p>
      <span class="pill">${escapeHtml(group.label)}</span>
    </div>
    <p class="cover-note">Aus dem Familienalltag gesammelt und verständlich aufbereitet · kleinkind-welt.de</p>
  </section>
  <section class="page intro" data-page="2">
    <div class="page-top">${brandBlock()}<span>${escapeHtml(group.label)}</span></div>
    <h2>${escapeHtml(group.introTitle)}</h2>
    ${group.intro.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}
    <ul class="intro-list">
      <li>Schau zuerst auf „Wann?“ und nimm, was gerade zu eurer Situation passt.</li>
      <li>Du brauchst meist wenig Material. Alltag schlägt oft Spielzeugflut.</li>
      <li>Wenn dein Kind nach wenigen Minuten aussteigt, ist das völlig okay.</li>
    </ul>
    <div class="safety-box"><strong>Kurzer Sicherheits-Hinweis:</strong> Bitte begleite die Spiele aufmerksam und passe Material und Umgebung an dein Kind an.</div>
    <footer>kleinkind-welt.de</footer>
  </section>
  ${group.ideas.map((idea, index) => desktopIdeaPage(group, idea, index)).join('')}
  <section class="page closing" data-page="8">
    <div class="page-top">${brandBlock()}<span>${escapeHtml(group.label)}</span></div>
    <h2>Zum Mitnehmen</h2>
    ${group.closing.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}
    <p class="footer-note">Dieser Kompass ersetzt keine ärztliche oder therapeutische Beratung. Bitte begleite die Spiele aufmerksam und passe Material und Umgebung an dein Kind an.</p>
    <div class="cta">
      <h3>Mehr Spielideen und ehrliche Empfehlungen</h3>
      <p>Weitere passende Ideen, Kaufhilfen und ehrliche Empfehlungen findest du auf Kleinkind-Welt.</p>
      <a class="button" href="https://kleinkind-welt.de${group.nextHref}">${escapeHtml(group.nextLabel)}</a>
    </div>
    <footer>© kleinkind-welt.de · Dieses Freebie ist für deinen persönlichen Gebrauch.</footer>
  </section>
</body>
</html>
`;
}

function mobileHtml(group) {
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Spielideen-Kompass ${escapeHtml(group.label)} - Mobile Version</title>
  <link rel="canonical" href="https://kleinkind-welt.de/freebies/spielideen-kompass-${group.slug}-mobile">
  <style>${baseCss(group, 'mobile')}</style>
  ${pageScript}
</head>
<body>
  <section class="page mobile-page cover" data-page="1">
    ${brandBlock()}
    <div class="cover-content">
      <div class="eyebrow">Mobile Leseversion</div>
      <h1>${escapeHtml(group.title)}</h1>
      <p class="subtitle">${escapeHtml(group.subtitle)}</p>
      <p class="lead">${escapeHtml(group.coverText)}</p>
      <span class="pill">${escapeHtml(group.label)}</span>
    </div>
    <p class="cover-note">kleinkind-welt.de</p>
  </section>
  <section class="page mobile-page intro" data-page="2">
    <div class="page-top">${brandBlock()}<span>${escapeHtml(group.label)}</span></div>
    <h2>${escapeHtml(group.introTitle)}</h2>
    ${group.intro.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}
    <div class="safety-box"><strong>Wichtig:</strong> Diese Ideen sind Angebote, kein Programm. Jedes Kind entwickelt sich in seinem eigenen Tempo.</div>
    <footer>kleinkind-welt.de</footer>
  </section>
  ${group.ideas.map((idea, index) => mobileIdeaPage(group, idea, index)).join('')}
  <section class="page mobile-page closing" data-page="8">
    <div class="page-top">${brandBlock()}<span>${escapeHtml(group.label)}</span></div>
    <h2>Zum Mitnehmen</h2>
    ${group.closing.map((item) => `<p>${escapeHtml(item)}</p>`).join('')}
    <p class="footer-note">Dieser Kompass ersetzt keine ärztliche oder therapeutische Beratung. Bitte begleite die Spiele aufmerksam und passe Material und Umgebung an dein Kind an.</p>
    <div class="cta">
      <h3>Mehr Ideen</h3>
      <p>Mehr Spielideen und ehrliche Empfehlungen findest du auf kleinkind-welt.de.</p>
      <a class="button" href="${group.nextHref}">${escapeHtml(group.nextLabel)}</a>
    </div>
    <footer>kleinkind-welt.de</footer>
  </section>
</body>
</html>
`;
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function waitForOutput(filePath, timeoutMs = 18000) {
  const started = Date.now();
  let lastSize = -1;
  let stableChecks = 0;

  while (Date.now() - started < timeoutMs) {
    if (fs.existsSync(filePath)) {
      const size = fs.statSync(filePath).size;
      if (size > 0 && size === lastSize) {
        stableChecks += 1;
        if (stableChecks >= 2) return true;
      } else {
        stableChecks = 0;
        lastSize = size;
      }
    }
    sleep(250);
  }

  return false;
}

function runChrome(args, outputPath) {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'kw-freebie-chrome-'));
  const child = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-component-update',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--metrics-recording-only',
    '--hide-scrollbars',
    `--user-data-dir=${profile}`,
    ...args,
  ], { stdio: 'ignore', detached: true });
  child.unref();

  try {
    if (!waitForOutput(outputPath)) {
      throw new Error(`Chrome did not create ${outputPath}`);
    }
  } finally {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch (error) {
      child.kill('SIGTERM');
    }
    sleep(250);
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch (error) {
      if (!child.killed) child.kill('SIGKILL');
    }
    fs.rmSync(profile, { recursive: true, force: true });
  }
}

function makePdf(htmlPath, pdfPath) {
  fs.rmSync(pdfPath, { force: true });
  runChrome([
    '--no-pdf-header-footer',
    '--print-to-pdf-no-header',
    `--print-to-pdf=${pdfPath}`,
    pathToFileURL(htmlPath).href,
  ], pdfPath);
}

function makeRender(htmlPath, pngPath, page, mode) {
  fs.rmSync(pngPath, { force: true });
  const size = mode === 'mobile' ? '540,960' : '794,1123';
  const url = `${pathToFileURL(htmlPath).href}?renderPage=${page}`;
  runChrome([
    `--window-size=${size}`,
    `--screenshot=${pngPath}`,
    url,
  ], pngPath);
}

fs.mkdirSync(freebiesDir, { recursive: true });
fs.mkdirSync(renderDir, { recursive: true });

const output = [];

for (const group of groups) {
  const base = `spielideen-kompass-${group.slug}`;
  const desktopPath = path.join(freebiesDir, `${base}.html`);
  const mobilePath = path.join(freebiesDir, `${base}-mobile.html`);
  const desktopPdf = path.join(freebiesDir, `${base}.pdf`);
  const mobilePdf = path.join(freebiesDir, `${base}-mobile.pdf`);

  fs.writeFileSync(desktopPath, cleanHtml(desktopHtml(group)));
  fs.writeFileSync(mobilePath, cleanHtml(mobileHtml(group)));
  makePdf(desktopPath, desktopPdf);
  makePdf(mobilePath, mobilePdf);

  for (let page = 1; page <= 8; page += 1) {
    makeRender(desktopPath, path.join(renderDir, `${base}-desktop-page-${String(page).padStart(2, '0')}.png`), page, 'desktop');
    makeRender(mobilePath, path.join(renderDir, `${base}-mobile-page-${String(page).padStart(2, '0')}.png`), page, 'mobile');
  }

  output.push(desktopPath, desktopPdf, mobilePath, mobilePdf);
}

console.log('Generated freebie files:');
for (const item of output) {
  console.log(path.relative(root, item));
}
console.log(`Preview renders: ${path.relative(root, renderDir)}`);
