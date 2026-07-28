const BREVO_DOI_ENDPOINT = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';

// Nur Segmente, die der Navigator laut routeFor() kennt und noch nicht vergleicht.
const allowedSegments = new Set([
  'travel_buggy',
  'buggy',
  'siblings_twins',
  'unsure',
]);

const segmentLabels = {
  travel_buggy: 'Reisebuggy',
  buggy: 'Buggy ohne Liegefunktion',
  siblings_twins: 'Geschwister- oder Zwillingswagen',
  unsure: 'Noch unsicher',
};

const json = (statusCode, payload) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
  body: JSON.stringify(payload),
});

const parseBody = (event) => {
  const headers = event.headers || {};
  const contentType = headers['content-type'] || headers['Content-Type'] || '';
  if (!event.body) return {};
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(event.body));
  }
  return JSON.parse(event.body);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeSiteUrl = (value) => String(value || 'https://kleinkind-welt.de').replace(/\/+$/, '');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: { Allow: 'POST, OPTIONS', 'Cache-Control': 'no-store' },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, message: 'Diese Anfrage wird nicht unterstützt.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_WAITLIST_LIST_ID);
  const templateId = Number(process.env.BREVO_WAITLIST_DOI_TEMPLATE_ID);
  const segmentAttribute = process.env.BREVO_SEGMENT_ATTRIBUTE || 'SEGMENTWUNSCH';
  const redirectionUrl = process.env.BREVO_WAITLIST_DOI_REDIRECT_URL
    || `${normalizeSiteUrl(process.env.SITE_URL)}/newsletter-bestaetigt?warteliste=1`;

  let body;
  try {
    body = parseBody(event);
  } catch (error) {
    return json(400, { ok: false, message: 'Die Anmeldung konnte nicht gelesen werden.' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const segment = String(body.segment || '').trim();
  const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';
  const honeypot = String(body.website || '').trim();

  // Bots bekommen dieselbe Antwort wie Menschen, damit sie nichts lernen.
  if (honeypot) {
    return json(200, { ok: true, message: 'Bitte prüfe dein E-Mail-Postfach.' });
  }

  if (!isValidEmail(email)) {
    return json(400, { ok: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
  }

  if (!allowedSegments.has(segment)) {
    return json(400, { ok: false, message: 'Unbekanntes Segment.' });
  }

  if (!consent) {
    return json(400, { ok: false, message: 'Bitte bestätige die Einwilligung.' });
  }

  // Bewusst nach der Validierung: Auch ohne fertige Brevo-Einrichtung bleibt die
  // Fehlermeldung ehrlich, statt eine Anmeldung vorzutäuschen.
  if (!apiKey || !Number.isInteger(listId) || !Number.isInteger(templateId)) {
    return json(503, {
      ok: false,
      message: 'Die Warteliste ist technisch noch nicht fertig eingerichtet. Bitte versuche es später erneut.',
    });
  }

  try {
    const response = await fetch(BREVO_DOI_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        includeListIds: [listId],
        templateId,
        redirectionUrl,
        attributes: {
          [segmentAttribute]: segmentLabels[segment] || segment,
        },
      }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        detail = await response.text();
      } catch (error) {
        detail = '';
      }
      console.error('Brevo waitlist signup failed', response.status, detail);
      return json(502, {
        ok: false,
        message: 'Die Anmeldung konnte gerade nicht gestartet werden. Bitte versuche es später erneut.',
      });
    }

    return json(200, {
      ok: true,
      message: 'Fast geschafft: Bitte bestätige die Anmeldung in der E-Mail von uns.',
    });
  } catch (error) {
    console.error('Waitlist signup error', error);
    return json(502, {
      ok: false,
      message: 'Die Anmeldung konnte gerade nicht gestartet werden. Bitte versuche es später erneut.',
    });
  }
};
