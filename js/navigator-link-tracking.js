(function () {
  var countNodes = document.querySelectorAll('[data-navigator-catalog-count]');
  if (countNodes.length && window.fetch) {
    fetch('/data/kinderwagen-navigator/catalog.v0.1.json', { credentials: 'same-origin' })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (catalog) {
        if (!catalog || !Array.isArray(catalog.products)) return;
        countNodes.forEach(function (node) { node.textContent = String(catalog.products.length); });
      })
      .catch(function () {});
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    var link = target && target.closest ? target.closest('a[data-navigator-link]') : null;
    if (link && window.plausible) {
      window.plausible('Kinderwagen-Navigator', {
        props: {
          aktion: 'interner_einstieg',
          seite: window.location.pathname || '/',
          platzierung: link.getAttribute('data-placement') || 'interner_link',
          event_schema: '1'
        }
      });
      return;
    }

    var topicLink = target && target.closest ? target.closest('a[data-topic-link]') : null;
    if (topicLink && window.plausible) {
      window.plausible('Themenbereich-Klick', {
        props: {
          thema: topicLink.getAttribute('data-topic') || 'unbekannt',
          seite: window.location.pathname || '/',
          platzierung: topicLink.getAttribute('data-placement') || 'interner_link',
          event_schema: '1'
        }
      });
      return;
    }

    var guideLink = target && target.closest ? target.closest('a[data-guide-link]') : null;
    if (guideLink && window.plausible) {
      window.plausible('Kinderwagen-Kaufhilfe', {
        props: {
          ratgeber: guideLink.getAttribute('data-guide') || 'unbekannt',
          seite: window.location.pathname || '/',
          platzierung: guideLink.getAttribute('data-placement') || 'interner_link',
          event_schema: '1'
        }
      });
    }
  });
})();
