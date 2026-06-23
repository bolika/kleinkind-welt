const BREVO_DOI_ENDPOINT = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';

const allowedAgeInterests = new Set([
  '0-6',
  '6-12',
  '12-18',
  '18-24',
  '2-jahre',
  '3-jahre',
  'geschenke-geburtstage',
]);

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

  if (contentType.includes('application/json')) {
    return JSON.parse(event.body);
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return Object.fromEntries(new URLSearchParams(event.body));
  }

  return JSON.parse(event.body);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidBirthMonth = (value) => !value || /^\d{4}-(0[1-9]|1[0-2])$/.test(value);

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        Allow: 'POST, OPTIONS',
        'Cache-Control': 'no-store',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, message: 'Diese Anfrage wird nicht unterstützt.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_NEWSLETTER_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const redirectionUrl = process.env.BREVO_DOI_REDIRECT_URL
    || 'https://kleinkind-welt.de/kaufhilfen?newsletter=confirmed#eltern-newsletter';
  const birthMonthAttribute = process.env.BREVO_BIRTHMONTH_ATTRIBUTE || 'GEBURTSMONAT';
  const interestAttribute = process.env.BREVO_INTEREST_ATTRIBUTE || 'EINSTIEGSSTUFE';
  const firstNameAttribute = process.env.BREVO_FIRSTNAME_ATTRIBUTE || 'VORNAME';

  if (!apiKey || !Number.isInteger(listId) || !Number.isInteger(templateId)) {
    return json(500, {
      ok: false,
      message: 'Der Newsletter ist technisch noch nicht fertig eingerichtet.',
    });
  }

  let body;
  try {
    body = parseBody(event);
  } catch (error) {
    return json(400, { ok: false, message: 'Die Anmeldung konnte nicht gelesen werden.' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const firstName = String(body.vorname || '').trim().slice(0, 80);
  const ageInterest = String(body.interessen_alter || '').trim();
  const birthMonth = String(body.geburtsmonat || '').trim();
  const consent = body.consent === true || body.consent === 'on' || body.consent === 'true';
  const honeypot = String(body.website || '').trim();

  if (honeypot) {
    return json(200, { ok: true, message: 'Bitte prüfe dein E-Mail-Postfach.' });
  }

  if (!isValidEmail(email)) {
    return json(400, { ok: false, message: 'Bitte gib eine gültige E-Mail-Adresse ein.' });
  }

  if (!allowedAgeInterests.has(ageInterest)) {
    return json(400, { ok: false, message: 'Bitte wähle einen Altersbereich aus.' });
  }

  if (!isValidBirthMonth(birthMonth)) {
    return json(400, { ok: false, message: 'Bitte wähle einen gültigen Geburtsmonat aus.' });
  }

  if (!consent) {
    return json(400, { ok: false, message: 'Bitte bestätige die Newsletter-Einwilligung.' });
  }

  const attributes = {
    [interestAttribute]: ageInterest,
  };

  if (firstName) {
    attributes[firstNameAttribute] = firstName;
  }

  if (birthMonth) {
    attributes[birthMonthAttribute] = `${birthMonth}-01`;
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
        attributes,
      }),
    });

    if (!response.ok) {
      let detail = '';
      try {
        detail = await response.text();
      } catch (error) {
        detail = '';
      }
      console.error('Brevo DOI signup failed', response.status, detail);
      return json(502, {
        ok: false,
        message: 'Die Anmeldung konnte gerade nicht gestartet werden. Bitte versuche es später erneut.',
        _debug: { brevoStatus: response.status, brevoDetail: detail },
      });
    }

    return json(200, {
      ok: true,
      message: 'Fast geschafft: Bitte bestätige deine Anmeldung in der E-Mail von uns.',
    });
  } catch (error) {
    console.error('Newsletter signup error', error);
    return json(502, {
      ok: false,
      message: 'Die Anmeldung konnte gerade nicht gestartet werden. Bitte versuche es später erneut.',
    });
  }
};
