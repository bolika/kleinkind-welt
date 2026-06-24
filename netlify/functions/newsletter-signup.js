const BREVO_DOI_ENDPOINT = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation';
const BREVO_ATTRIBUTES_ENDPOINT = 'https://api.brevo.com/v3/contacts/attributes';

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

const normalizeSiteUrl = (value) => String(value || 'https://kleinkind-welt.de').replace(/\/+$/, '');

const ageInterestLabels = {
  '0-6': '0-6 Monate',
  '6-12': '6-12 Monate',
  '12-18': '12-18 Monate',
  '18-24': '18-24 Monate',
  '2-jahre': '2 Jahre',
  '3-jahre': '3 Jahre',
  'geschenke-geburtstage': 'Geschenke & Geburtstage',
};

const getDoiRedirectUrl = (ageInterest, fallbackUrl) => {
  const siteUrl = normalizeSiteUrl(process.env.SITE_URL);
  const freebieRedirects = {
    '12-18': `${siteUrl}/newsletter-bestaetigt?freebie=spielideen-12-18#download`,
  };

  if (freebieRedirects[ageInterest]) return freebieRedirects[ageInterest];

  try {
    const url = new URL(fallbackUrl);
    url.searchParams.set('alter', ageInterest);
    url.hash = 'download';
    return url.toString();
  } catch (error) {
    return `${siteUrl}/newsletter-bestaetigt?alter=${encodeURIComponent(ageInterest)}#download`;
  }
};

const getCategoryOptionValue = (option) => {
  if (Object.prototype.hasOwnProperty.call(option, 'value')) return option.value;
  if (Object.prototype.hasOwnProperty.call(option, 'valueStr')) return option.valueStr;
  return option.label;
};

const getInterestAttributeValue = async (apiKey, attributeName, ageInterest, attributeType) => {
  if (attributeType !== 'category') return ageInterest;

  const expectedLabel = ageInterestLabels[ageInterest];
  if (!expectedLabel) return ageInterest;

  const response = await fetch(BREVO_ATTRIBUTES_ENDPOINT, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'api-key': apiKey,
    },
  });

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch (error) {
      detail = '';
    }
    console.error('Brevo attributes lookup failed', response.status, detail);
    throw new Error('Brevo attribute lookup failed');
  }

  const data = await response.json();
  const attribute = (data.attributes || []).find((item) => item.name === attributeName);
  const option = attribute && (attribute.enumeration || []).find((item) => item.label === expectedLabel);

  if (!option) {
    console.error('Brevo category option missing', attributeName, expectedLabel);
    throw new Error('Brevo category option missing');
  }

  return getCategoryOptionValue(option);
};

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
  const fallbackRedirectionUrl = process.env.BREVO_DOI_REDIRECT_URL
    || `${normalizeSiteUrl(process.env.SITE_URL)}/newsletter-bestaetigt`;
  const birthMonthAttribute = process.env.BREVO_BIRTHMONTH_ATTRIBUTE || 'GEBURTSMONAT';
  const interestAttribute = process.env.BREVO_INTEREST_ATTRIBUTE || 'EINSTIEGSSTUFE';
  const interestAttributeType = process.env.BREVO_INTEREST_ATTRIBUTE_TYPE || 'category';
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

  const redirectionUrl = getDoiRedirectUrl(ageInterest, fallbackRedirectionUrl);
  let interestAttributeValue;

  try {
    interestAttributeValue = await getInterestAttributeValue(
      apiKey,
      interestAttribute,
      ageInterest,
      interestAttributeType,
    );
  } catch (error) {
    return json(502, {
      ok: false,
      message: 'Die Anmeldung konnte gerade nicht gestartet werden. Bitte versuche es später erneut.',
    });
  }

  const attributes = {
    [interestAttribute]: interestAttributeValue,
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
