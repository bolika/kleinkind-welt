(function () {
  document.querySelectorAll('.budget-table, .vergleich-tabelle, .kaufhilfe-table').forEach(function (tbl) {
    var ths = tbl.querySelectorAll('thead th');
    var colCount = ths.length;
    var headers = [].map.call(ths, function (th) { return th.textContent.trim(); });

    tbl.classList.add(colCount <= 2 ? 'table--two-col' : 'table--multi-col');

    tbl.querySelectorAll('tbody tr').forEach(function (row) {
      [].forEach.call(row.querySelectorAll('td'), function (td, i) {
        if (headers[i]) td.dataset.label = headers[i];
      });
    });
  });
}());
