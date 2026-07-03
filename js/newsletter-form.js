(function() {
  var forms = document.querySelectorAll('[data-newsletter-form]');
  if (!forms.length) return;

  forms.forEach(function(form) {
    var feedback = form.querySelector('[data-newsletter-feedback]');
    var submit = form.querySelector('.newsletter-submit');
    var defaultButtonText = submit ? submit.textContent : '';
    var ageSelect = form.querySelector('[name="interessen_alter"]');
    var ageFreebieNote = form.querySelector('[data-age-freebie-note]');
    var ageLabels = {
      '0-6': '0-6 Monate',
      '6-12': '6-12 Monate',
      '12-18': '12-18 Monate',
      '18-24': '18-24 Monate',
      '2-jahre': '2 Jahre',
      '3-jahre': '3 Jahre',
      'geschenke-geburtstage': 'Geschenke & Geburtstage'
    };

    function updateAgeFreebieNote() {
      if (!ageSelect || !ageFreebieNote) return;
      if (!ageSelect.value) {
        ageFreebieNote.textContent = 'Wähle eine Phase aus. Nach der Bestätigung kannst du mobile Version, Mobile-PDF und Desktop-PDF nutzen.';
        return;
      }
      ageFreebieNote.textContent = 'Für ' + (ageLabels[ageSelect.value] || 'deine Auswahl') + ' bekommst du nach der Bestätigung mobile Version, Mobile-PDF und Desktop-PDF.';
    }

    if (ageSelect) {
      ageSelect.addEventListener('change', updateAgeFreebieNote);
      updateAgeFreebieNote();
    }

    var monthInput = form.querySelector('[name="geburtsmonat"]');
    if (monthInput) {
      var syncMonthPlaceholder = function() {
        monthInput.classList.toggle('is-empty', !monthInput.value);
      };
      monthInput.addEventListener('input', syncMonthPlaceholder);
      monthInput.addEventListener('change', syncMonthPlaceholder);
      syncMonthPlaceholder();
    }

    var confirmed = new URLSearchParams(window.location.search).get('newsletter') === 'confirmed';
    if (confirmed && feedback) {
      feedback.textContent = 'Danke, deine Anmeldung ist bestätigt.';
      feedback.hidden = false;
    }

    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (feedback) {
        feedback.hidden = true;
        feedback.classList.remove('is-error');
        feedback.textContent = '';
      }
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Wird gesendet...';
      }

      var payload = Object.fromEntries(new FormData(form).entries());
      try {
        var response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var result = await response.json().catch(function() {
          return { ok: false, message: 'Die Anmeldung konnte gerade nicht verarbeitet werden.' };
        });
        if (!response.ok || !result.ok) {
          throw new Error(result.message || 'Die Anmeldung konnte gerade nicht verarbeitet werden.');
        }
        if (feedback) {
          var successMessage = result.message || 'Fast geschafft: Bitte bestätige deine Anmeldung per E-Mail.';
          if (ageSelect && ageSelect.value) {
            successMessage += ' Danach landest du direkt beim passenden Spielideen-Kompass mit mobiler Version und PDFs.';
          }
          feedback.textContent = successMessage;
          feedback.hidden = false;
        }
        form.reset();
        if (ageSelect) updateAgeFreebieNote();
        if (monthInput) monthInput.classList.add('is-empty');
      } catch (error) {
        if (feedback) {
          feedback.textContent = error.message || 'Die Anmeldung konnte gerade nicht verarbeitet werden.';
          feedback.classList.add('is-error');
          feedback.hidden = false;
        }
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = defaultButtonText;
        }
      }

      if (window.plausible) {
        plausible('Newsletter-Formular', {
          props: {
            seite: location.pathname.split('/').filter(Boolean).join('/') || 'home',
            platzierung: form.getAttribute('data-placement') || payload.quelle || 'newsletter',
            status: feedback && feedback.classList.contains('is-error') ? 'fehler' : 'doi-gestartet'
          }
        });
      }
    });
  });
})();
