// Versendet das Navigator-Ergebnis als transaktionale Brevo-Mail (Template #5).
// Sicherheitsmodell: Der Client liefert nur productIds und kurze Texte.
// Name, Preis und Hersteller-Link kommen serverseitig aus dem Katalog,
// damit ueber diesen Endpunkt keine fremden Links verschickt werden koennen.
const catalog = require('../../data/kinderwagen-navigator/catalog.bundle.v0.1.json');

const BREVO_SMTP_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';
const DEFAULT_TEMPLATE_ID = 5;
const MAX_MATCHES = 3;

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
});

const parseBody = (event) => {
  if (!event.body) return {};
  return JSON.parse(event.body);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Kein HTML in Mail-Parametern: spitze Klammern und Anfuehrungszeichen raus,
// Laenge begrenzen. Umlaute bleiben unveraendert.
const cleanText = (value, maxLength) => String(value || '')
  .replace(/[<>"'`]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength);

const normalizeSiteUrl = (value) => String(value || 'https://kleinkind-welt.de').replace(/\/+$/, '');

const productById = new Map(
  (catalog.products || []).map((product) => [product.productId, product]),
);

const manufacturerUrl = (product) => {
  const sources = product.sources || [];
  const manufacturer = sources.find((source) => source.kind === 'manufacturer' && /^https:\/\//.test(source.url || ''));
  const fallback = sources.find((source) => /^https:\/\//.test(source.url || ''));
  return (manufacturer || fallback)?.url || null;
};

const priceText = (product) => {
  const price = product.facts?.requiredConfigurationPriceEur?.value;
  if (typeof price !== 'number') return 'Gesamtpreis noch offen';
  const formatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);
  return `Gesamtpreis ${formatted} inkl. Babywanne`;
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { Allow: 'POST, OPTIONS', 'Cache-Control': 'no-store' }, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, message: 'Diese Anfrage wird nicht unterstützt.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const templateId = Number(process.env.BREVO_NAVIGATOR_TEMPLATE_ID || DEFAULT_TEMPLATE_ID);
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL);

  if (!apiKey || !Number.isInteger(templateId)) {
    return json(500, { ok: false, message: 'Der E-Mail-Versand ist technisch noch nicht eingerichtet.' });
  }

  let body;
  try {
    body = parseBody(event);
  } catch (error) {
    return json(400, { ok: false, message: 'Die Anfrage konnte nicht gelesen werden.' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const honeypot = String(body.website || '').trim();
  const profil = cleanText(body.profil, 300);
  const rawMatches = Array.isArray(body.matches) ? body.matches.slice(0, MAX_MATCHES) : [];

  if (honeypot) {
    return json(200, { ok: true, message: 'Die Matches sind unterwegs.' });
  }

  if (!isValidEmail(email)) {
    return json(400, { ok: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
  }

  if (!rawMatches.length) {
    return json(400, { ok: false, message: 'Es liegen keine Matches zum Versenden vor.' });
  }

  const matches = [];
  for (const raw of rawMatches) {
    const product = productById.get(String(raw?.productId || ''));
    if (!product) {
      return json(400, { ok: false, message: 'Das Ergebnis konnte nicht zugeordnet werden. Bitte startet den Navigator neu.' });
    }
    const herstellerUrl = manufacturerUrl(product);
    if (!herstellerUrl) continue;
    matches.push({
      badge: cleanText(raw.badge, 60) || 'Weitere gute Passung',
      name: cleanText(`${product.identity?.brand || ''} ${product.identity?.model || ''}`, 90),
      score: cleanText(raw.score, 40) || 'Passung siehe Navigator',
      preis: priceText(product),
      kompromiss: cleanText(raw.kompromiss, 200),
      herstellerUrl,
      guideUrl: '',
      guideTitel: '',
    });
  }

  if (!matches.length) {
    return json(400, { ok: false, message: 'Es liegen keine versendbaren Matches vor.' });
  }

  const params = {
    profil: profil || 'Eure Angaben aus dem Navigator',
    datum: new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Berlin' }).format(new Date()),
    navigatorUrl: `${siteUrl}/kinderwagen-navigator?utm_source=email&utm_medium=transactional&utm_campaign=navigator-result`,
    matches,
  };

  try {
    const response = await fetch(BREVO_SMTP_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        to: [{ email }],
        templateId,
        params,
      }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        detail = await response.text();
      } catch (error) {
        detail = '';
      }
      console.error('Brevo navigator result send failed', response.status, detail);
      return json(502, { ok: false, message: 'Der Versand hat gerade nicht geklappt. Bitte versucht es später erneut.' });
    }

    return json(200, { ok: true, message: 'Die Matches sind unterwegs.' });
  } catch (error) {
    console.error('Navigator result send error', error);
    return json(502, { ok: false, message: 'Der Versand hat gerade nicht geklappt. Bitte versucht es später erneut.' });
  }
};
