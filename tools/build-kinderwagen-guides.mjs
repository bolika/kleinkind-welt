#!/usr/bin/env node

// Geruest-Generator fuer Kinderwagen-Ratgeber.
//
// WICHTIG, Stand 29.07.2026: Die fuenf bestehenden Ratgeber sind seit dem
// 28.07.2026 HANDGEPFLEGT. Sie wurden um Datentabellen mit je bis zu 20 Zeilen,
// je sechs FAQ-Eintraege und belegte Zahlen erweitert — Inhalte, die sich in
// dieser Datenquelle nicht sinnvoll abbilden lassen. Der Generator wuerde beim
// Ueberschreiben zusammen rund 4400 Woerter und 20 FAQ-Eintraege loeschen.
//
// Deshalb gilt:
//   * Ohne --force schreibt dieses Werkzeug abgewichene Dateien NICHT.
//   * --check meldet Abweichungen als Information und schlaegt nicht mehr fehl.
//     Was auf diesen Seiten wirklich garantiert sein muss — Title, Canonical,
//     genau eine H1, Skip-Link, Landmark, Alt-Texte, Tabellenbeschriftungen,
//     Affiliate-Kennzeichnung, Schema-Gueltigkeit — prueft tools/seo-smoke-test.mjs
//     mit 45 inhaltsunabhaengigen Zusicherungen, und die Navigation prueft
//     tools/sync-site-navigation.mjs. Das ist fuer redaktionelle Artikel das
//     passendere Netz als "gleicht der Vorlage".
//
// Der verbleibende Nutzen des Werkzeugs ist das Anlegen NEUER Ratgeber: Eintrag
// in die Datenquelle, dann `node tools/build-kinderwagen-guides.mjs --force`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data", "kinderwagen-guides.v0.1.json");
const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const checkOnly = process.argv.includes("--check");
const force = process.argv.includes("--force");

const wortzahl = (html) => {
  const main = /<main\b[\s\S]*?<\/main>/.exec(html);
  return (main ? main[0] : html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
};

const renderList = (items = []) => items.length
  ? `<ul>\n${items.map((item) => `        <li>${item}</li>`).join("\n")}\n      </ul>`
  : "";
const renderParagraphs = (items = []) => items.map((item) => `      <p>${item}</p>`).join("\n");
const renderSections = (sections) => sections.map((section) => `
    <h2 id="${section.id}">${section.heading}</h2>
${renderParagraphs(section.paragraphs)}
      ${renderList(section.bullets)}`.trimEnd()).join("\n\n");
const renderSources = (sources) => sources.map((source) =>
  `        <li><strong>${source.name}:</strong> <a href="${source.url}" target="_blank" rel="noopener">${source.label}</a>.</li>`
).join("\n");
const renderFaqHtml = (faq) => faq.map((item) =>
  `      <div class="faq-item"><h3>${item.question}</h3><p>${item.answer}</p></div>`
).join("\n");
const renderFaqSchema = (faq) => faq.map((item) => ({
  "@type": "Question",
  name: item.question,
  acceptedAnswer: { "@type": "Answer", text: item.answer }
}));

const nav = `      <ul id="nav-menu">
        <li><a href="/spielzeug-nach-alter">Spielzeug</a></li>
        <li><a href="/kinderwagen">Kinderwagen</a></li>
        <li><a href="/geschenke-kleinkind">Geschenke</a></li>
        <li><a href="/kaufhilfen">Kaufhilfen</a></li>
        <li><a href="/#ratgeber">Ratgeber</a></li>
        <li><a href="/ueber-uns">Über uns</a></li>
      </ul>`;

const footer = `  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand"><a href="/" class="logo logo-footer"><img src="/images/logo-mark.svg" alt="Kleinkind-Welt" class="logo-mark-img" width="40" height="40" loading="lazy"></a><p>Nachvollziehbare Kaufhilfen für Familien mit Babys und Kleinkindern.</p></div>
      <div><h4>Themen</h4><ul><li><a href="/spielzeug-nach-alter">Spielzeug</a></li><li><a href="/kinderwagen">Kinderwagen</a></li><li><a href="/geschenke-kleinkind">Geschenke</a></li><li><a href="/kaufhilfen">Kaufhilfen</a></li></ul></div>
      <div><h4>Transparenz</h4><ul><li><a href="/ueber-uns">Über uns</a></li><li><a href="/bewertungsmethode">Bewertungsmethode</a></li><li><a href="/impressum">Impressum</a></li><li><a href="/datenschutz">Datenschutz</a></li></ul></div>
    </div>
    <div class="footer-bottom"><span>© 2026 Kleinkind-Welt.de – Alle Angaben ohne Gewähr</span><span>Mit ♥ für Eltern &amp; Kleinkinder</span></div>
  </div>`;

const renderGuide = (guide) => {
  const route = `/artikel/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://kleinkind-welt.de${route}#article`,
        headline: guide.title,
        description: guide.description,
        author: {
          "@type": "Person",
          "@id": "https://kleinkind-welt.de/ueber-uns#boris",
          name: "Boris Nazarov",
          url: "https://kleinkind-welt.de/ueber-uns",
          jobTitle: "Gründer und Redakteur"
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://kleinkind-welt.de/#organization",
          name: "Kleinkind-Welt.de",
          url: "https://kleinkind-welt.de",
          logo: { "@type": "ImageObject", url: "https://kleinkind-welt.de/images/logo-mark-512.png" }
        },
        url: `https://kleinkind-welt.de${route}`,
        inLanguage: "de",
        mainEntityOfPage: { "@type": "WebPage", "@id": `https://kleinkind-welt.de${route}` },
        datePublished: "2026-07-23T00:00:00+02:00",
        dateModified: "2026-07-23T00:00:00+02:00",
        speakable: { "@type": "SpeakableSpecification", cssSelector: [".kurzantwort-box", ".faq-item"] }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Kleinkind-Welt.de", item: "https://kleinkind-welt.de/" },
          { "@type": "ListItem", position: 2, name: "Kinderwagen", item: "https://kleinkind-welt.de/kinderwagen" },
          { "@type": "ListItem", position: 3, name: guide.title, item: `https://kleinkind-welt.de${route}` }
        ]
      },
      { "@type": "FAQPage", mainEntity: renderFaqSchema(guide.faq) }
    ]
  };

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/images/logo-mark.svg" type="image/svg+xml">
  <link rel="icon" href="/images/favicon-32.png" type="image/png" sizes="32x32">
  <link rel="apple-touch-icon" href="/images/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <meta name="description" content="${guide.description}">
  <meta name="robots" content="index, follow">
  <title>${guide.title}</title>
  <link rel="stylesheet" href="/css/style.css?v=20260729-ux">
  <link rel="canonical" href="https://kleinkind-welt.de${route}">
  <link rel="alternate" hreflang="de" href="https://kleinkind-welt.de${route}">
  <link rel="alternate" hreflang="x-default" href="https://kleinkind-welt.de${route}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="de_DE">
  <meta property="og:url" content="https://kleinkind-welt.de${route}">
  <meta property="og:title" content="${guide.title}">
  <meta property="og:description" content="${guide.description}">
  <meta property="og:image" content="https://kleinkind-welt.de/images/og-kleinkind-welt.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${guide.title}">
  <meta name="twitter:description" content="${guide.description}">
  <meta name="twitter:image" content="https://kleinkind-welt.de/images/og-kleinkind-welt.png">
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>
  <script async src="https://plausible.io/js/pa-sdQfun3sDROuYngxixuyz.js"></script>
  <script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init({outboundLinks:true})</script>
</head>
<body class="page-kinderwagen-guide">
<a class="skip-link" href="#main-content">Zum Inhalt springen</a>
<header>
  <div class="nav-inner">
    <a href="/" class="logo"><img src="/images/logo-horizontal.svg" alt="Kleinkind-Welt – Ehrliche Empfehlungen für Eltern" class="logo-img" width="288" height="64"></a>
    <nav aria-label="Hauptmenü">
      <button class="nav-toggle" aria-label="Menü öffnen" aria-expanded="false">☰</button>
${nav}
    </nav>
  </div>
</header>
<main id="main-content">
  <nav class="breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/">Kleinkind-Welt.de</a></li><li><a href="/kinderwagen">Kinderwagen</a></li><li aria-current="page">${guide.category}</li></ol></nav>
  <div class="article-hero kinderwagen-guide-hero">
    <div class="article-hero-inner">
      <div class="article-meta"><span>Geprüft 23. Juli 2026</span><span>${guide.readTime} Lesezeit</span><span>${guide.category}</span></div>
      <h1>${guide.title}</h1>
      <p class="lead">${guide.lead}</p>
    </div>
  </div>
  <div class="article-body">
    <div class="artikel-autor-line">
      <div class="autor-avatar"><picture><source type="image/webp" srcset="/images/autor-boris-160.webp"><img src="/images/autor-boris.jpg" alt="Boris Nazarov" width="40" height="40"></picture></div>
      <div class="autor-info"><span class="autor-name">Boris, Kleinkind-Welt</span><span class="autor-desc">Recherchebasierte Kaufhilfe · kein eigener Produkttest · <a href="/bewertungsmethode">So arbeiten wir</a></span></div>
    </div>
    <div class="kurzantwort-box"><span class="kurzantwort-label">Kurzantwort</span><p>${guide.shortAnswer}</p></div>
    <div class="methodenbox">
      <h2>Wofür dieser Ratgeber gedacht ist</h2>
      <p class="methodenbox-proof"><strong>Orientierung statt Prüfurteil:</strong> Wir übersetzen dokumentierte Kriterien in alltagstaugliche Fragen. Konkrete Freigaben, Maße und Lieferumfänge müssen am jeweiligen Modell geprüft werden.</p>
    </div>
${renderSections(guide.sections)}
    <div class="navigator-guide-cta">
      <span>Jetzt auf euren Alltag anwenden</span>
      <h2>Kombi-Kinderwagen-Match in fünf Fragen</h2>
      <p>Die kostenlose Beta vergleicht dokumentierte Produktdaten mit euren Prioritäten und zeigt Kompromisse offen an.</p>
      <a href="/kinderwagen-navigator" class="btn" data-navigator-link data-placement="guide-${guide.slug}">Navigator starten</a>
    </div>
    <div class="quellenbox" id="quellen">
      <h2>Quellen und redaktioneller Stand</h2>
      <ul>
${renderSources(guide.sources)}
      </ul>
      <p class="quellenbox-meta">Quellen geprüft: ${data.reviewedAt.split("-").reverse().join(".")} · Nächste turnusmäßige Prüfung: ${data.reviewDueAt.split("-").reverse().join(".")}.</p>
    </div>
    <div class="faq-section" id="faq">
      <h2>Häufige Fragen</h2>
${renderFaqHtml(guide.faq)}
    </div>
    <div class="kaufempfehlung-box">
      <h3>Mehr Orientierung rund um Kinderwagen</h3>
      <p>Im Kinderwagen-Hub findest du alle Grundlagen, den Navigator und die übrigen Entscheidungshilfen.</p>
      <div class="kaufempfehlung-links"><a href="/kinderwagen" class="btn">Zum Kinderwagen-Hub</a><a href="/bewertungsmethode#kinderwagen" class="btn" style="background:var(--accent)">Matching-Methode ansehen</a></div>
    </div>
  </div>
</main>
<div style="height:4px;background:linear-gradient(to right,var(--primary),var(--accent));"></div>
<footer>
${footer}
</footer>
<script src="/js/navigator-link-tracking.js?v=20260723-2" defer></script>
<script src="/js/faq-accordion.js?v=20260713" defer></script>
<script src="/js/mobile-tables.js" defer></script>
<script>
  document.addEventListener('DOMContentLoaded',function(){var toggle=document.querySelector('.nav-toggle');var menu=document.getElementById('nav-menu');if(toggle&&menu)toggle.addEventListener('click',function(){var open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open?'true':'false');toggle.textContent=open?'✕':'☰';});});
</script>
</body>
</html>
`;
};

const abgewichen = [];
const geschrieben = [];
const fehler = [];

for (const guide of data.guides) {
  const outputPath = path.join(root, "artikel", `${guide.slug}.html`);
  let rendered;
  try {
    rendered = renderGuide(guide);
  } catch (error) {
    fehler.push(`${guide.slug}: Vorlage nicht renderbar — ${error.message}`);
    continue;
  }
  // Die Datenquelle darf nicht verrotten: Das Ergebnis muss gueltiges JSON-LD
  // enthalten, auch wenn es nie geschrieben wird.
  const ldMatch = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(rendered);
  if (!ldMatch) fehler.push(`${guide.slug}: gerendertes JSON-LD fehlt`);
  else {
    try { JSON.parse(ldMatch[1]); }
    catch (error) { fehler.push(`${guide.slug}: gerendertes JSON-LD ungültig — ${error.message}`); }
  }

  const vorhanden = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : null;
  const weichtAb = vorhanden !== null && vorhanden !== rendered;

  if (checkOnly) {
    if (weichtAb) abgewichen.push({ slug: guide.slug, ist: wortzahl(vorhanden), vorlage: wortzahl(rendered) });
    continue;
  }
  if (weichtAb && !force) {
    abgewichen.push({ slug: guide.slug, ist: wortzahl(vorhanden), vorlage: wortzahl(rendered) });
    continue;
  }
  fs.writeFileSync(outputPath, rendered);
  geschrieben.push(guide.slug);
}

if (fehler.length) {
  fehler.forEach((f) => console.error(`ERROR ${f}`));
  process.exit(1);
}

if (abgewichen.length) {
  const verlust = abgewichen.reduce((summe, a) => summe + Math.max(0, a.ist - a.vorlage), 0);
  console.log(`${abgewichen.length} Ratgeber sind handgepflegt und weichen von der Vorlage ab:`);
  for (const a of abgewichen) {
    console.log(`  artikel/${a.slug}.html — ${a.ist} Wörter im Bestand, ${a.vorlage} in der Vorlage`);
  }
  if (!checkOnly && !force) {
    console.error(`\nNICHT geschrieben. Ein Überschreiben würde ${verlust} Wörter löschen.`);
    console.error(`Wenn das gewollt ist: erneut mit --force aufrufen.`);
    process.exit(1);
  }
  console.log(`Zusammen ${verlust} Wörter, die die Vorlage nicht abbilden kann — deshalb kein Fehler.`);
}

if (geschrieben.length) console.log(`Erstellt: ${geschrieben.join(", ")}.`);
console.log(`${checkOnly ? "Geprüft" : "Verarbeitet"}: ${data.guides.length} Kinderwagen-Ratgeber, Datenquelle renderbar.`);
