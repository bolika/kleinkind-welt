(function () {
  document.querySelectorAll('.budget-table, .vergleich-tabelle, .kaufhilfe-table, .comparison-table').forEach(function (tbl) {
    var ths = tbl.querySelectorAll('thead th');
    var colCount = ths.length;
    var headers = [].map.call(ths, function (th) { return th.textContent.trim(); });

    tbl.classList.add(colCount <= 2 ? 'table--two-col' : 'table--multi-col');

    tbl.querySelectorAll('tbody tr').forEach(function (row) {
      var rowHeader = row.querySelector('th[scope="row"]');
      [].forEach.call(row.querySelectorAll('td'), function (td, i) {
        var headerIndex = rowHeader ? i + 1 : i;
        if (headers[headerIndex]) td.dataset.label = headers[headerIndex];
      });
      if (rowHeader) rowHeader.dataset.rowHeader = 'true';
    });
  });
}());
