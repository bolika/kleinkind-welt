(function () {
  document.querySelectorAll('.faq-section').forEach(function (section, sectionIndex) {
    section.classList.add('accordion-enabled');

    section.querySelectorAll('.faq-item').forEach(function (item, itemIndex) {
      var heading = item.querySelector('h3');
      if (!heading || heading.querySelector('.faq-toggle')) return;

      var answer = document.createElement('div');
      var answerId = 'faq-answer-' + sectionIndex + '-' + itemIndex;
      answer.className = 'faq-answer';
      answer.id = answerId;
      answer.hidden = true;

      while (heading.nextSibling) answer.appendChild(heading.nextSibling);

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'faq-toggle';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', answerId);
      button.innerHTML = heading.innerHTML;

      heading.textContent = '';
      heading.appendChild(button);
      item.appendChild(answer);

      button.addEventListener('click', function () {
        var willOpen = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(willOpen));
        answer.hidden = !willOpen;
        item.classList.toggle('open', willOpen);
      });
    });
  });
})();
