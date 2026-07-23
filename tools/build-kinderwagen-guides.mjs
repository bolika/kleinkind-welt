#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(root, "data", "kinderwagen-guides.v0.1.json");
const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const checkOnly = process.argv.includes("--check");

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
      <div class="footer-brand"><a href="/" class="logo logo-footer"><img src="/images/logo-mark.svg" alt="Kleinkind-Welt" class="logo-mark-img" width="40" height="40"></a><p>Nachvollziehbare Kaufhilfen für Familien mit Babys und Kleinkindern.</p></div>
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
  <link rel="stylesheet" href="/css/style.css?v=20260723-positioning">
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
    <nav>
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
      <h4>Wofür dieser Ratgeber gedacht ist</h4>
      <p class="methodenbox-proof"><strong>Orientierung statt Prüfurteil:</strong> Wir übersetzen dokumentierte Kriterien in alltagstaugliche Fragen. Konkrete Freigaben, Maße und Lieferumfänge müssen am jeweiligen Modell geprüft werden.</p>
    </div>
${renderSections(guide.sections)}
    <div class="navigator-guide-cta">
      <span>Jetzt auf euren Alltag anwenden</span>
      <h2>Kinderwagen-Match in fünf Kernfragen</h2>
      <p>Der kostenlose Pilot vergleicht dokumentierte Produktdaten mit euren Prioritäten und zeigt Kompromisse offen an.</p>
      <a href="/kinderwagen-navigator" class="btn" data-navigator-link data-placement="guide-${guide.slug}">Navigator starten</a>
    </div>
    <div class="quellenbox" id="quellen">
      <h4>Quellen und redaktioneller Stand</h4>
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
<script>
  document.addEventListener('DOMContentLoaded',function(){var toggle=document.querySelector('.nav-toggle');var menu=document.getElementById('nav-menu');if(toggle&&menu)toggle.addEventListener('click',function(){var open=menu.classList.toggle('open');toggle.setAttribute('aria-expanded',open?'true':'false');toggle.textContent=open?'✕':'☰';});});
</script>
</body>
</html>
`;
};

const mismatches = [];
for (const guide of data.guides) {
  const outputPath = path.join(root, "artikel", `${guide.slug}.html`);
  const rendered = renderGuide(guide);
  if (checkOnly) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== rendered) {
      mismatches.push(path.relative(root, outputPath));
    }
  } else {
    fs.writeFileSync(outputPath, rendered);
  }
}

if (mismatches.length) {
  console.error(`Kinderwagen-Ratgeber sind nicht aktuell: ${mismatches.join(", ")}`);
  process.exit(1);
}

console.log(`${checkOnly ? "Geprüft" : "Erstellt"}: ${data.guides.length} Kinderwagen-Ratgeber.`);
