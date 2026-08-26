(function () {
  "use strict";

  const core = window.KpiCore;
  const datasets = {};
  const inputElements = Array.from(document.querySelectorAll("[data-source-input]"));
  const kpiGrid = document.getElementById("kpi-grid");
  const tableBody = document.getElementById("week-table-body");
  const weeklyTrend = document.getElementById("weekly-trend");
  const weekEmpty = document.getElementById("week-empty");
  const weekCount = document.getElementById("week-count");
  const sourceCount = document.getElementById("source-count");
  const resetButton = document.getElementById("reset-button");
  const notice = document.getElementById("notice");
  const numberFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });
  const decimalFormat = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const currencyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
  const percentFormat = new Intl.NumberFormat("de-DE", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const dateFormat = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "UTC" });

  inputElements.forEach(function (input) {
    input.addEventListener("change", function () {
      const files = Array.from(input.files || []);
      if (!files.length) return;
      importFiles(input.dataset.sourceInput, files, input);
    });
  });

  document.querySelectorAll(".file-button[for]").forEach(function (label) {
    label.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      document.getElementById(label.htmlFor).click();
    });
  });

  resetButton.addEventListener("click", function () {
    Object.keys(datasets).forEach(function (source) { delete datasets[source]; });
    inputElements.forEach(function (input) { input.value = ""; });
    document.querySelectorAll("[data-source-card]").forEach(resetSourceCard);
    hideNotice();
    render();
  });

  async function importFiles(source, files, input) {
    const card = document.querySelector('[data-source-card="' + source + '"]');
    setCardBusy(card);
    hideNotice();
    try {
      const imports = await Promise.all(files.map(async function (file) {
        return core.importCSV(source, await file.text(), file.name);
      }));
      const dataset = core.mergeDatasets(source, imports);
      datasets[source] = dataset;
      renderSourceCard(card, dataset);
      render();
    } catch (error) {
      delete datasets[source];
      renderSourceError(card, error.message);
      showNotice(core.SOURCE_CONFIG[source].label + ": " + error.message);
      render();
    } finally {
      input.value = "";
    }
  }

  function setCardBusy(card) {
    card.classList.remove("has-data", "has-error");
    const status = card.querySelector("[data-status]");
    status.className = "status-badge status-missing";
    status.textContent = "Liest...";
    card.querySelector("[data-source-detail]").textContent = "Datei wird lokal verarbeitet.";
  }

  function resetSourceCard(card) {
    card.classList.remove("has-data", "has-error");
    const status = card.querySelector("[data-status]");
    status.className = "status-badge status-missing";
    status.textContent = "Fehlt";
    card.querySelector("[data-source-detail]").textContent = "Noch keine Datei importiert.";
  }

  function renderSourceCard(card, dataset) {
    card.classList.add("has-data");
    card.classList.remove("has-error");
    const status = card.querySelector("[data-status]");
    status.className = "status-badge status-imported";
    status.textContent = "Importiert";
    const detail = card.querySelector("[data-source-detail]");
    detail.replaceChildren();

    const fileName = document.createElement("strong");
    fileName.textContent = dataset.fileName;
    detail.appendChild(fileName);
    const fileInfo = dataset.fileCount ? dataset.fileCount + " Dateien, " : "";
    detail.appendChild(document.createTextNode(fileInfo + dataset.rowCount + " Zeilen, " + dataset.recognized.length + " Kennzahlen erkannt"));
    detail.appendChild(document.createElement("br"));
    detail.appendChild(document.createTextNode(dataset.dateRange ? formatDateRange(dataset.dateRange) : "Kein Zeitraum erkannt"));

    dataset.warnings.forEach(function (warning) {
      const warningElement = document.createElement("span");
      warningElement.className = "source-warning";
      warningElement.textContent = warning;
      detail.appendChild(warningElement);
    });
  }

  function renderSourceError(card, message) {
    card.classList.add("has-error");
    card.classList.remove("has-data");
    const status = card.querySelector("[data-status]");
    status.className = "status-badge status-error";
    status.textContent = "Fehler";
    card.querySelector("[data-source-detail]").textContent = message;
  }

  function render() {
    const dashboard = core.buildDashboard(datasets);
    sourceCount.textContent = dashboard.importedSources + " von 4 Quellen importiert";
    resetButton.disabled = dashboard.importedSources === 0;
    renderKpis(dashboard.kpis);
    renderWeeks(dashboard.weeks);
  }

  function renderKpis(kpis) {
    kpiGrid.replaceChildren();
    kpis.forEach(function (item) {
      const card = document.createElement("article");
      card.className = "kpi-card" + (item.status === "missing" ? " is-missing" : "");

      const label = document.createElement("p");
      label.className = "kpi-label";
      label.textContent = item.label;
      const value = document.createElement("p");
      value.className = "kpi-value";
      value.textContent = item.status === "missing" ? "Fehlt" : formatValue(item.value, item.type);
      const source = document.createElement("p");
      source.className = "kpi-source";
      source.textContent = item.source;

      card.append(label, value, source);
      kpiGrid.appendChild(card);
    });
  }

  function renderWeeks(weeks) {
    tableBody.replaceChildren();
    weeklyTrend.replaceChildren();
    if (!weeks.length) {
      weekEmpty.hidden = false;
      document.querySelector(".table-wrap").hidden = true;
      weeklyTrend.hidden = true;
      weekCount.textContent = "Keine datierten Zeilen";
      return;
    }
    weekEmpty.hidden = true;
    document.querySelector(".table-wrap").hidden = false;
    weeklyTrend.hidden = false;
    weekCount.textContent = weeks.length + (weeks.length === 1 ? " Kalenderwoche" : " Kalenderwochen");
    weeks.forEach(renderWeekRow);
    renderTrend(weeks);
  }

  function renderWeekRow(week) {
    const row = document.createElement("tr");
    const weekCell = document.createElement("td");
    const weekLabel = document.createElement("strong");
    weekLabel.textContent = week.label;
    const period = document.createElement("span");
    period.className = "week-period";
    period.textContent = dateFormat.format(new Date(week.start + "T00:00:00Z")) + " - " + dateFormat.format(new Date(week.end + "T00:00:00Z"));
    weekCell.append(weekLabel, period);
    row.appendChild(weekCell);
    appendCell(row, week.visitors, "number");
    appendCell(row, week.visits, "number");
    appendCell(row, week.affiliateClicks, "number");
    appendCell(row, week.partnerClicks, "number");
    appendCell(row, week.orders, "number");
    appendCell(row, week.commission, "currency");
    appendCell(row, week.subscriptions, "number");
    tableBody.appendChild(row);
  }

  function appendCell(row, value, type) {
    const cell = document.createElement("td");
    if (value === null) {
      cell.className = "cell-missing";
      cell.textContent = "Fehlt";
    } else cell.textContent = formatValue(value, type);
    row.appendChild(cell);
  }

  function renderTrend(weeks) {
    const maxVisits = Math.max.apply(null, weeks.map(function (week) { return week.visits || week.visitors || 0; }).concat([1]));
    const maxCommission = Math.max.apply(null, weeks.map(function (week) { return week.commission || 0; }).concat([1]));
    const chart = document.createElement("div");
    chart.className = "weekly-trend";
    chart.style.setProperty("--week-columns", weeks.length);

    weeks.forEach(function (week) {
      const item = document.createElement("div");
      item.className = "trend-week";
      const bars = document.createElement("div");
      bars.className = "trend-bars";
      bars.appendChild(makeBar(week.visits === null ? week.visitors : week.visits, maxVisits, "Sitzungen"));
      bars.appendChild(makeBar(week.commission, maxCommission, "Provision", "commission"));
      const label = document.createElement("span");
      label.className = "trend-label";
      label.textContent = week.label.replace("/" + week.label.slice(-4), "");
      item.append(bars, label);
      chart.appendChild(item);
    });

    const legend = document.createElement("div");
    legend.className = "trend-legend";
    const trafficKey = document.createElement("span");
    trafficKey.className = "legend-key";
    trafficKey.textContent = "Sitzungen";
    const commissionKey = document.createElement("span");
    commissionKey.className = "legend-key commission";
    commissionKey.textContent = "Provision";
    legend.append(trafficKey, commissionKey);
    weeklyTrend.append(chart, legend);
  }

  function makeBar(value, max, label, extraClass) {
    const bar = document.createElement("span");
    bar.className = "trend-bar" + (extraClass ? " " + extraClass : "");
    const height = value === null ? 0 : Math.max(2, value / max * 100);
    bar.style.height = height + "%";
    bar.title = label + ": " + (value === null ? "Fehlt" : decimalFormat.format(value));
    return bar;
  }

  function formatValue(value, type) {
    if (type === "currency") return currencyFormat.format(value);
    if (type === "percent") return percentFormat.format(value);
    return numberFormat.format(value);
  }

  function formatDateRange(range) {
    return dateFormat.format(range.from) + " bis " + dateFormat.format(range.to);
  }

  function showNotice(message) {
    notice.textContent = message;
    notice.hidden = false;
  }

  function hideNotice() {
    notice.hidden = true;
    notice.textContent = "";
  }

  render();
}());
