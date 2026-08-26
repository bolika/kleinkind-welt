#!/usr/bin/env node

"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("./kpi-core.js");

const root = __dirname;

function fixture(name) {
  return fs.readFileSync(path.join(root, "fixtures", name), "utf8");
}

function closeTo(actual, expected, precision) {
  assert.ok(Math.abs(actual - expected) <= precision, actual + " liegt nicht nahe " + expected);
}

const quoted = core.parseCSV('Date,Name,Revenue\n2026-08-10,"Set, gross",12.40\n');
assert.equal(quoted.delimiter, ",");
assert.equal(quoted.rows[0].Name, "Set, gross");

assert.equal(core.detectDelimiter("Datum;Klicks;Provision\n10.08.2026;12;1,20"), ";");
const excelCsv = core.parseCSV("sep=;\nDatum;Klicks\n10.08.2026;12\n");
assert.deepEqual(excelCsv.headers, ["Datum", "Klicks"]);
assert.equal(excelCsv.rows[0].Klicks, "12");
assert.equal(core.parseNumber("1.234,56 EUR", { decimalComma: true }), 1234.56);
assert.equal(core.parseNumber("EUR 1,234.56", { decimalComma: false }), 1234.56);
assert.equal(core.parseNumber("42,5%", { decimalComma: true }), 0.425);
assert.equal(core.parseDate("10.08.2026").toISOString().slice(0, 10), "2026-08-10");
assert.equal(core.parseDate("08/10/2026", { monthFirst: true }).toISOString().slice(0, 10), "2026-08-10");
assert.equal(core.startOfIsoWeek(new Date("2026-08-26T12:00:00Z")).toISOString().slice(0, 10), "2026-08-24");

const plausible = core.importCSV("plausible", fixture("plausible-de.csv"), "plausible-de.csv");
const amazon = core.importCSV("amazon", fixture("amazon-en.csv"), "amazon-en.csv");
const awin = core.importCSV("awin", fixture("awin-de.csv"), "awin-de.csv");
const brevo = core.importCSV("brevo", fixture("brevo-en.csv"), "brevo-en.csv");

assert.equal(plausible.status, "imported");
assert.equal(plausible.totals.visitors, 2380);
assert.equal(plausible.totals.visits, 3340);
assert.equal(plausible.totals.affiliateClicks, 143);
assert.equal(amazon.totals.clicks, 100);
assert.equal(amazon.totals.orders, 6);
assert.equal(amazon.totals.commission, 12);
assert.equal(awin.totals.clicks, 66);
assert.equal(awin.totals.orders, 5);
closeTo(awin.totals.commission, 9.75, 0.001);
assert.equal(brevo.totals.subscriptions, 43);
assert.equal(brevo.totals.doiConfirmed, 39);

const eventExport = core.importCSV(
  "plausible",
  "Date,Event Name,Events\n2026-08-24,Affiliate-Klick,17\n2026-08-25,Newsletter-Submit,4\n",
  "events.csv"
);
assert.equal(eventExport.totals.affiliateClicks, 17);
assert.ok(eventExport.warnings.some(function (warning) { return warning.includes("abgeleitet"); }));

const transactionExport = core.importCSV(
  "awin",
  "Transaction Date,Transaction ID,Status,Commission Amount\n2026-08-24,T-1,approved,2.50\n2026-08-25,T-2,declined,0.00\n",
  "transactions.csv"
);
assert.equal(transactionExport.totals.orders, 1);
assert.equal(transactionExport.totals.commission, 2.5);
assert.ok(transactionExport.warnings.some(function (warning) { return warning.includes("ausgeschlossen"); }));

const mergedPlausible = core.mergeDatasets("plausible", [plausible, eventExport]);
assert.equal(mergedPlausible.fileCount, 2);
assert.equal(mergedPlausible.totals.affiliateClicks, 160);

const dashboard = core.buildDashboard({ plausible: plausible, amazon: amazon, awin: awin, brevo: brevo });
assert.equal(dashboard.importedSources, 4);
assert.equal(dashboard.weeks.length, 3);
assert.equal(dashboard.weeks[2].label, "KW 35/2026");
assert.equal(dashboard.weeks[2].orders, 5);
assert.equal(dashboard.weeks[2].subscriptions, 17);
assert.equal(dashboard.kpis.find(function (item) { return item.id === "partnerClicks"; }).value, 166);
assert.equal(dashboard.kpis.find(function (item) { return item.id === "orders"; }).value, 11);
closeTo(dashboard.kpis.find(function (item) { return item.id === "commission"; }).value, 21.75, 0.001);
closeTo(dashboard.kpis.find(function (item) { return item.id === "outboundCtr"; }).value, 143 / 3340, 0.000001);

const partial = core.buildDashboard({ plausible: plausible });
assert.equal(partial.kpis.find(function (item) { return item.id === "orders"; }).status, "missing");
assert.throws(function () {
  core.importCSV("brevo", "Email;Vorname\nmail@example.test;Test", "contacts.csv");
}, /Keine bekannten Brevo-Kennzahlen/);

const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const dashboardFiles = ["index.html", "styles.css", "kpi-core.js", "app.js"];
assert.match(indexHtml, /connect-src 'none'/);
assert.match(indexHtml, /kpi-core\.js/);
assert.match(indexHtml, /app\.js/);
assert.match(indexHtml, /styles\.css/);
dashboardFiles.forEach(function (name) {
  const text = fs.readFileSync(path.join(root, name), "utf8");
  assert.doesNotMatch(text, /https?:\/\//i, name + " enthaelt eine externe URL");
  assert.doesNotMatch(text, /localStorage|sessionStorage|sendBeacon|XMLHttpRequest|\bfetch\s*\(/, name + " darf keine Daten speichern oder uebertragen");
});

console.log("KPI-Dashboard: 35 Parser-, Mapping-, Aggregations- und Datenschutzpruefungen bestanden.");
