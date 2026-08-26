(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.KpiCore = api;
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DATE_ALIASES = [
    "date", "datum", "day", "tag", "period", "zeitraum", "report date",
    "transaction date", "transaction date utc", "order date", "campaign date"
  ];

  const META_FIELDS = {
    eventName: ["event name", "event", "goal", "goal name", "event goal", "ereignis", "ziel"],
    eventCount: ["events", "event count", "total events", "conversions", "conversion count", "ereignisse"],
    transactionId: ["transaction id", "order id", "bestellnummer", "transaktions id", "sale id"],
    status: ["status", "transaction status", "order status", "approval status", "commission status"]
  };

  const SOURCE_CONFIG = {
    plausible: {
      label: "Plausible",
      hint: "Traffic- oder Event-Export",
      metrics: {
        visitors: metric("Besucher", "count", [
          "visitors", "unique visitors", "unique users", "users", "besucher",
          "eindeutige besucher", "einzelne besucher"
        ]),
        visits: metric("Sitzungen", "count", ["visits", "sessions", "besuche", "sitzungen"]),
        pageviews: metric("Seitenaufrufe", "count", [
          "pageviews", "page views", "views", "seitenaufrufe", "seitenansichten"
        ]),
        affiliateClicks: metric("Affiliate-Klicks", "count", [
          "affiliate clicks", "affiliate klicks", "affiliate-klicks", "outbound clicks",
          "external link clicks", "ausgehende klicks"
        ]),
        bounceRate: metric("Absprungrate", "percent", ["bounce rate", "absprungrate"]),
        visitDuration: metric("Besuchsdauer", "duration", [
          "visit duration", "average visit duration", "avg visit duration", "besuchsdauer"
        ])
      }
    },
    amazon: {
      label: "Amazon",
      hint: "PartnerNet-Bericht",
      metrics: {
        clicks: metric("Klicks", "count", ["clicks", "klicks", "link clicks"]),
        orders: metric("Bestellte Produkte", "count", [
          "ordered items", "items ordered", "ordered products", "bestellte produkte",
          "bestellte artikel", "orders", "bestellungen"
        ]),
        shippedItems: metric("Versandte Produkte", "count", [
          "shipped items", "items shipped", "versandte produkte", "versandte artikel"
        ]),
        revenue: metric("Bestellwert", "currency", [
          "ordered revenue", "ordered product sales", "revenue", "sales", "bestellwert",
          "gesamtumsatz", "umsatz"
        ]),
        commission: metric("Einnahmen", "currency", [
          "earnings", "advertising fees", "commission", "income", "einnahmen", "verguetung",
          "vergutung", "provision", "summe der einnahmen"
        ]),
        conversionRate: metric("Conversion", "percent", [
          "conversion", "conversion rate", "conversion-rate", "konversionsrate"
        ])
      }
    },
    awin: {
      label: "Awin",
      hint: "Performance- oder Transaktionsbericht",
      metrics: {
        impressions: metric("Impressionen", "count", ["impressions", "ad impressions", "impressionen", "einblendungen"]),
        clicks: metric("Klicks", "count", ["clicks", "klicks", "click throughs"]),
        orders: metric("Transaktionen", "count", [
          "transactions", "transaction count", "sales count", "orders", "bestellungen",
          "transaktionen", "anzahl transaktionen"
        ]),
        revenue: metric("Umsatz", "currency", [
          "sale amount", "sales amount", "order value", "transaction value", "revenue",
          "umsatz", "warenkorbwert", "verkaufswert"
        ]),
        commission: metric("Provision", "currency", [
          "commission", "commission amount", "publisher commission", "publisher earnings",
          "provision", "provisionsbetrag", "verguetung", "vergutung"
        ])
      }
    },
    brevo: {
      label: "Brevo",
      hint: "Kampagnen- oder Anmeldestatistik",
      metrics: {
        sent: metric("Gesendet", "count", ["sent", "sent emails", "emails sent", "gesendet", "versendet"]),
        delivered: metric("Zugestellt", "count", [
          "delivered", "delivered emails", "emails delivered", "zugestellt", "erfolgreich zugestellt"
        ]),
        opens: metric("Eindeutige Oeffnungen", "count", [
          "unique opens", "unique opened", "unique openers", "eindeutige oeffnungen",
          "eindeutige offnungen", "unique openings"
        ]),
        emailClicks: metric("Eindeutige Klicks", "count", [
          "unique clicks", "unique clickers", "clicked", "eindeutige klicks", "unique link clicks"
        ]),
        subscriptions: metric("Anmeldungen", "count", [
          "subscriptions", "subscribers", "new subscribers", "signups", "registrations",
          "anmeldungen", "neue kontakte", "new contacts"
        ]),
        doiConfirmed: metric("DOI-Bestaetigungen", "count", [
          "doi confirmed", "double opt in confirmed", "confirmed subscriptions",
          "bestaetigte anmeldungen", "bestatigte anmeldungen", "doi bestaetigungen"
        ]),
        unsubscribes: metric("Abmeldungen", "count", [
          "unsubscribes", "unsubscriptions", "unsubscribed", "abmeldungen", "abgemeldet"
        ])
      }
    }
  };

  function metric(label, type, aliases) {
    return { label: label, type: type, aliases: aliases };
  }

  function normalizeHeader(value) {
    return String(value || "")
      .replace(/^\ufeff/, "")
      .trim()
      .toLowerCase()
      .replace(/[äÄ]/g, "ae")
      .replace(/[öÖ]/g, "oe")
      .replace(/[üÜ]/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/%/g, " percent ")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .replace(/\s+/g, " ");
  }

  function countDelimiter(line, delimiter) {
    let count = 0;
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      if (char === '"') {
        if (quoted && line[index + 1] === '"') index += 1;
        else quoted = !quoted;
      } else if (!quoted && char === delimiter) count += 1;
    }
    return count;
  }

  function detectDelimiter(text) {
    const lines = String(text || "").replace(/^\ufeff/, "").split(/\r?\n/).filter(function (line) {
      return line.trim();
    }).slice(0, 8);
    const candidates = [";", ",", "\t", "|"];
    let best = { delimiter: ",", score: -1 };
    candidates.forEach(function (delimiter) {
      const counts = lines.map(function (line) { return countDelimiter(line, delimiter); }).filter(Boolean);
      if (!counts.length) return;
      const mode = counts.slice().sort(function (a, b) {
        return counts.filter(function (value) { return value === a; }).length -
          counts.filter(function (value) { return value === b; }).length;
      }).pop();
      const consistency = counts.filter(function (value) { return value === mode; }).length;
      const score = consistency * 100 + mode;
      if (score > best.score) best = { delimiter: delimiter, score: score };
    });
    return best.delimiter;
  }

  function parseCSV(text) {
    let input = String(text || "").replace(/^\ufeff/, "");
    const separatorDirective = input.match(/^sep=(.)\r?\n/i);
    const delimiter = separatorDirective ? separatorDirective[1] : detectDelimiter(input);
    if (separatorDirective) input = input.slice(separatorDirective[0].length);
    const records = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let index = 0; index < input.length; index += 1) {
      const char = input[index];
      if (quoted) {
        if (char === '"' && input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else if (char === '"') quoted = false;
        else cell += char;
      } else if (char === '"') quoted = true;
      else if (char === delimiter) {
        row.push(cell.trim());
        cell = "";
      } else if (char === "\n" || char === "\r") {
        if (char === "\r" && input[index + 1] === "\n") index += 1;
        row.push(cell.trim());
        if (row.some(function (value) { return value !== ""; })) records.push(row);
        row = [];
        cell = "";
      } else cell += char;
    }
    row.push(cell.trim());
    if (row.some(function (value) { return value !== ""; })) records.push(row);
    if (!records.length) return { delimiter: delimiter, headers: [], rows: [] };

    const headers = records[0].map(function (header, index) {
      return header || "Spalte " + (index + 1);
    });
    const rows = records.slice(1).map(function (record) {
      const result = {};
      headers.forEach(function (header, index) { result[header] = record[index] || ""; });
      return result;
    });
    return { delimiter: delimiter, headers: headers, rows: rows };
  }

  function parseNumber(value, options) {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;
    const raw = String(value).trim();
    if (!raw || /^(?:-|n\/?a|not available|null)$/i.test(raw)) return null;
    const negative = /^\(.*\)$/.test(raw) || /^-/.test(raw);
    const isPercent = /%/.test(raw);
    let clean = raw
      .replace(/[()]/g, "")
      .replace(/[€$£%]/g, "")
      .replace(/[A-Za-z]/g, "")
      .replace(/[\s'’]/g, "")
      .replace(/^-/, "");
    if (!clean) return null;

    const comma = clean.lastIndexOf(",");
    const dot = clean.lastIndexOf(".");
    if (comma !== -1 && dot !== -1) {
      const decimal = comma > dot ? "," : ".";
      const thousands = decimal === "," ? /\./g : /,/g;
      clean = clean.replace(thousands, "").replace(decimal, ".");
    } else if (comma !== -1) {
      const parts = clean.split(",");
      const germanDecimal = options && options.decimalComma;
      if (parts.length === 2 && (germanDecimal || parts[1].length !== 3 || isPercent)) clean = parts[0] + "." + parts[1];
      else clean = parts.join("");
    } else if (dot !== -1) {
      const parts = clean.split(".");
      const germanThousands = options && options.decimalComma && parts.length > 1 && parts[parts.length - 1].length === 3;
      if (germanThousands || parts.length > 2) clean = parts.join("");
    }
    const number = Number(clean);
    if (!Number.isFinite(number)) return null;
    return (negative ? -number : number) / (isPercent ? 100 : 1);
  }

  function parseDuration(value) {
    if (value === null || value === undefined || value === "") return null;
    const raw = String(value).trim();
    if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(raw)) {
      const parts = raw.split(":").map(Number);
      return parts.length === 3 ? parts[0] * 3600 + parts[1] * 60 + parts[2] : parts[0] * 60 + parts[1];
    }
    return parseNumber(raw, {});
  }

  function parseDate(value, options) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
    const raw = String(value || "").trim();
    if (!raw) return null;
    let match = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (match) return safeDate(Number(match[1]), Number(match[2]), Number(match[3]));
    match = raw.match(/^(\d{1,2})[.](\d{1,2})[.](\d{2,4})/);
    if (match) return safeDate(expandYear(match[3]), Number(match[2]), Number(match[1]));
    match = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})/);
    if (match) {
      const first = Number(match[1]);
      const second = Number(match[2]);
      const monthFirst = options && options.monthFirst;
      const day = first > 12 ? first : second > 12 ? second : monthFirst ? second : first;
      const month = first > 12 ? second : second > 12 ? first : monthFirst ? first : second;
      return safeDate(expandYear(match[3]), month, day);
    }
    return null;
  }

  function expandYear(value) {
    const year = Number(value);
    return year < 100 ? 2000 + year : year;
  }

  function safeDate(year, month, day) {
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return date;
  }

  function aliasScore(header, alias) {
    const left = normalizeHeader(header);
    const right = normalizeHeader(alias);
    if (!left || !right) return 0;
    if (left === right) return 1000 + right.length;
    if (left.replace(/ /g, "") === right.replace(/ /g, "")) return 900 + right.length;
    if (left.startsWith(right + " ") || left.endsWith(" " + right)) return 700 + right.length;
    if (right.length >= 8 && left.includes(right)) return 500 + right.length;
    return 0;
  }

  function mapColumns(headers, source) {
    const config = SOURCE_CONFIG[source];
    if (!config) throw new Error("Unbekannte Quelle: " + source);
    const fields = [{ key: "date", aliases: DATE_ALIASES }];
    Object.keys(config.metrics).forEach(function (key) {
      fields.push({ key: key, aliases: config.metrics[key].aliases });
    });
    Object.keys(META_FIELDS).forEach(function (key) {
      fields.push({ key: key, aliases: META_FIELDS[key] });
    });

    const candidates = [];
    fields.forEach(function (field) {
      headers.forEach(function (header) {
        const score = Math.max.apply(null, field.aliases.map(function (alias) { return aliasScore(header, alias); }));
        if (score > 0) candidates.push({ field: field.key, header: header, score: score });
      });
    });
    candidates.sort(function (a, b) { return b.score - a.score; });
    const usedFields = new Set();
    const usedHeaders = new Set();
    const mapping = {};
    candidates.forEach(function (candidate) {
      if (usedFields.has(candidate.field) || usedHeaders.has(candidate.header)) return;
      mapping[candidate.field] = candidate.header;
      usedFields.add(candidate.field);
      usedHeaders.add(candidate.header);
    });
    return mapping;
  }

  function importCSV(source, text, fileName) {
    const config = SOURCE_CONFIG[source];
    if (!config) throw new Error("Unbekannte Quelle: " + source);
    const parsed = parseCSV(text);
    if (!parsed.headers.length || !parsed.rows.length) throw new Error("Die CSV enthaelt keine Datenzeilen.");
    const mapping = mapColumns(parsed.headers, source);
    const metricKeys = Object.keys(config.metrics);
    const mappedMetricKeys = metricKeys.filter(function (key) { return Boolean(mapping[key]); });
    const decimalComma = parsed.delimiter === ";";
    const warnings = [];
    let derivedAffiliateClicks = false;
    let derivedAwinOrders = false;
    let rejectedAwinRows = 0;

    const rows = parsed.rows.map(function (rawRow) {
      const values = {};
      metricKeys.forEach(function (key) {
        const field = config.metrics[key];
        const rawValue = mapping[key] ? rawRow[mapping[key]] : null;
        values[key] = field.type === "duration" ? parseDuration(rawValue) : parseNumber(rawValue, { decimalComma: decimalComma });
      });
      const eventName = mapping.eventName ? String(rawRow[mapping.eventName] || "") : "";
      if (source === "plausible" && /affiliate[\s_-]*klick|affiliate[\s_-]*click|outbound/i.test(eventName) && values.affiliateClicks === null) {
        const eventCount = mapping.eventCount ? parseNumber(rawRow[mapping.eventCount], { decimalComma: decimalComma }) : values.visitors;
        if (eventCount !== null) {
          values.affiliateClicks = eventCount;
          if (!mapping.affiliateClicks && !mapping.eventCount) values.visitors = null;
          derivedAffiliateClicks = true;
        }
      }
      if (source === "awin") {
        const status = mapping.status ? String(rawRow[mapping.status] || "") : "";
        const rejected = /declined|rejected|cancel|abgelehnt|storniert/i.test(status);
        if (rejected) {
          values.orders = 0;
          values.revenue = values.revenue === null ? null : 0;
          values.commission = values.commission === null ? null : 0;
          rejectedAwinRows += 1;
        } else if (values.orders === null && mapping.transactionId && rawRow[mapping.transactionId]) {
          values.orders = 1;
          derivedAwinOrders = true;
        }
      }
      return {
        date: mapping.date ? parseDate(rawRow[mapping.date], { monthFirst: parsed.delimiter === "," }) : null,
        values: values
      };
    });

    const recognized = metricKeys.filter(function (key) {
      return rows.some(function (row) { return row.values[key] !== null; });
    });
    if (!recognized.length) {
      throw new Error("Keine bekannten " + config.label + "-Kennzahlen erkannt. Bitte einen Statistikexport statt einer Kontakt- oder Produktdatei verwenden.");
    }
    if (!mapping.date) warnings.push("Keine Datumsspalte erkannt: Gesamtwerte sind verfuegbar, die Wochenansicht fuer diese Quelle nicht.");
    else if (rows.every(function (row) { return row.date === null; })) warnings.push("Datumsspalte erkannt, aber kein Datum konnte gelesen werden.");
    else if (rows.some(function (row) { return row.date === null; })) warnings.push("Einige Zeilen haben kein lesbares Datum und erscheinen nur in den Gesamtwerten.");
    if (derivedAffiliateClicks) warnings.push("Affiliate-Klicks wurden aus passenden Plausible-Eventzeilen abgeleitet.");
    if (derivedAwinOrders) warnings.push("Awin-Transaktionen wurden anhand eindeutiger Transaktionszeilen gezaehlt.");
    if (rejectedAwinRows) warnings.push(rejectedAwinRows + " abgelehnte oder stornierte Awin-Zeilen wurden aus Bestellungen, Umsatz und Provision ausgeschlossen.");

    const totals = calculateTotals(config, rows);
    const dates = rows.map(function (row) { return row.date; }).filter(Boolean).sort(function (a, b) { return a - b; });

    return {
      source: source,
      fileName: fileName || "CSV-Datei",
      status: "imported",
      delimiter: parsed.delimiter,
      rowCount: rows.length,
      mapping: mapping,
      recognized: recognized,
      warnings: warnings,
      rows: rows,
      totals: totals,
      dateRange: dates.length ? { from: dates[0], to: dates[dates.length - 1] } : null
    };
  }

  function calculateTotals(config, rows) {
    const totals = {};
    Object.keys(config.metrics).forEach(function (key) {
      const values = rows.map(function (row) { return row.values[key]; }).filter(function (value) { return value !== null; });
      if (!values.length) totals[key] = null;
      else if (["percent", "duration"].includes(config.metrics[key].type)) totals[key] = values.reduce(sum, 0) / values.length;
      else totals[key] = values.reduce(sum, 0);
    });
    return totals;
  }

  function mergeDatasets(source, imports) {
    const config = SOURCE_CONFIG[source];
    if (!config) throw new Error("Unbekannte Quelle: " + source);
    const valid = (imports || []).filter(function (dataset) {
      return dataset && dataset.source === source && dataset.status === "imported";
    });
    if (!valid.length) throw new Error("Keine gueltigen Dateien zum Zusammenfuehren.");
    if (valid.length === 1) return valid[0];
    const rows = valid.flatMap(function (dataset) { return dataset.rows; });
    const dates = rows.map(function (row) { return row.date; }).filter(Boolean).sort(function (a, b) { return a - b; });
    return {
      source: source,
      fileName: valid.map(function (dataset) { return dataset.fileName; }).join(", "),
      status: "imported",
      delimiter: "mixed",
      rowCount: rows.length,
      mapping: {},
      recognized: Array.from(new Set(valid.flatMap(function (dataset) { return dataset.recognized; }))),
      warnings: Array.from(new Set(valid.flatMap(function (dataset) { return dataset.warnings; }))),
      rows: rows,
      totals: calculateTotals(config, rows),
      dateRange: dates.length ? { from: dates[0], to: dates[dates.length - 1] } : null,
      fileCount: valid.length
    };
  }

  function sum(total, value) { return total + value; }

  function startOfIsoWeek(date) {
    const result = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = result.getUTCDay() || 7;
    result.setUTCDate(result.getUTCDate() - day + 1);
    return result;
  }

  function isoWeek(date) {
    const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const day = target.getUTCDay() || 7;
    target.setUTCDate(target.getUTCDate() + 4 - day);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    return { year: target.getUTCFullYear(), week: Math.ceil((((target - yearStart) / 86400000) + 1) / 7) };
  }

  function weekKey(date) {
    return startOfIsoWeek(date).toISOString().slice(0, 10);
  }

  function buildDashboard(datasets) {
    const data = datasets || {};
    const get = function (source, metricKey) {
      return data[source] && data[source].status === "imported" ? data[source].totals[metricKey] : null;
    };
    const addKnown = function (values) {
      const known = values.filter(function (value) { return value !== null; });
      return known.length ? known.reduce(sum, 0) : null;
    };
    const visits = get("plausible", "visits");
    const visitors = get("plausible", "visitors");
    const affiliateClicks = get("plausible", "affiliateClicks");
    const partnerClicks = addKnown([get("amazon", "clicks"), get("awin", "clicks")]);
    const orders = addKnown([get("amazon", "orders"), get("awin", "orders")]);
    const commission = addKnown([get("amazon", "commission"), get("awin", "commission")]);
    const subscriptions = get("brevo", "subscriptions");
    const delivered = get("brevo", "delivered");
    const emailClicks = get("brevo", "emailClicks");
    const doiConfirmed = get("brevo", "doiConfirmed");

    const kpis = [
      kpi("visitors", "Besucher", visitors, "number", "Plausible"),
      kpi("visits", "Sitzungen", visits, "number", "Plausible"),
      kpi("affiliateClicks", "Affiliate-Klicks", affiliateClicks, "number", "Plausible"),
      kpi("partnerClicks", "Partner-Klicks", partnerClicks, "number", "Amazon + Awin"),
      kpi("orders", "Bestellungen", orders, "number", "Amazon + Awin"),
      kpi("commission", "Provision", commission, "currency", "Amazon + Awin"),
      kpi("subscriptions", "Anmeldungen", subscriptions, "number", "Brevo"),
      kpi("outboundCtr", "Affiliate-Outbound-CTR", ratio(affiliateClicks, visits), "percent", "Affiliate-Klicks / Sitzungen"),
      kpi("partnerConversion", "Partner-Conversion", ratio(orders, partnerClicks), "percent", "Bestellungen / Partner-Klicks"),
      kpi("rpm", "Provision pro 1.000 Sitzungen", visits && commission !== null ? commission / visits * 1000 : null, "currency", "Provision / Sitzungen"),
      kpi("doiRate", "DOI-Rate", ratio(doiConfirmed, subscriptions), "percent", "Bestaetigungen / Anmeldungen"),
      kpi("emailClickRate", "E-Mail-Klickrate", ratio(emailClicks, delivered), "percent", "Klicks / zugestellte E-Mails")
    ];

    const weeks = new Map();
    Object.keys(data).forEach(function (source) {
      const dataset = data[source];
      if (!dataset || dataset.status !== "imported") return;
      dataset.rows.forEach(function (row) {
        if (!row.date) return;
        const key = weekKey(row.date);
        if (!weeks.has(key)) weeks.set(key, emptyWeek(key));
        const week = weeks.get(key);
        addWeekMetric(week, source, row.values);
      });
    });

    return {
      kpis: kpis,
      weeks: Array.from(weeks.values()).sort(function (a, b) { return a.start.localeCompare(b.start); }),
      importedSources: Object.keys(data).filter(function (source) { return data[source] && data[source].status === "imported"; }).length
    };
  }

  function kpi(id, label, value, type, source) {
    return { id: id, label: label, value: value, type: type, source: source, status: value === null ? "missing" : "imported" };
  }

  function ratio(numerator, denominator) {
    if (numerator === null || denominator === null || denominator === 0) return null;
    return numerator / denominator;
  }

  function emptyWeek(start) {
    const date = parseDate(start);
    const iso = isoWeek(date);
    const end = new Date(date.getTime() + 6 * 86400000);
    return {
      start: start,
      end: end.toISOString().slice(0, 10),
      label: "KW " + String(iso.week).padStart(2, "0") + "/" + iso.year,
      visitors: null,
      visits: null,
      affiliateClicks: null,
      partnerClicks: null,
      orders: null,
      commission: null,
      subscriptions: null
    };
  }

  function addValue(target, key, value) {
    if (value === null || value === undefined) return;
    target[key] = (target[key] === null ? 0 : target[key]) + value;
  }

  function addWeekMetric(week, source, values) {
    if (source === "plausible") {
      addValue(week, "visitors", values.visitors);
      addValue(week, "visits", values.visits);
      addValue(week, "affiliateClicks", values.affiliateClicks);
    } else if (source === "amazon" || source === "awin") {
      addValue(week, "partnerClicks", values.clicks);
      addValue(week, "orders", values.orders);
      addValue(week, "commission", values.commission);
    } else if (source === "brevo") addValue(week, "subscriptions", values.subscriptions);
  }

  return {
    SOURCE_CONFIG: SOURCE_CONFIG,
    normalizeHeader: normalizeHeader,
    detectDelimiter: detectDelimiter,
    parseCSV: parseCSV,
    parseNumber: parseNumber,
    parseDate: parseDate,
    mapColumns: mapColumns,
    importCSV: importCSV,
    mergeDatasets: mergeDatasets,
    startOfIsoWeek: startOfIsoWeek,
    isoWeek: isoWeek,
    buildDashboard: buildDashboard
  };
}));
