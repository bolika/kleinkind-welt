# Kinderwagen-Navigator: technischer QA-Stand

Stand: 23. Juli 2026

## Bestandene automatisierte Prüfungen

- 20 Pilotmodelle bestehen Schema-, Quellen-, Datenlücken- und Bundle-Prüfung.
- Sieben Hypothesen-Archetypen erhalten einen soliden Match; sechs davon einen guten Match.
- Die Alltagsfrage erlaubt höchstens drei relevante Angaben; die Entscheidungsfrage genau zwei Prioritäten.
- Ein strikter No-Match startet den Flow nach einem gewählten Kompromiss nicht neu.
- Bei 320 und 1440 Pixeln entsteht im getesteten Kernpfad kein horizontaler Überlauf.
- Tool, Fehlermeldungen und Skip-Link sind im Browser erreichbar; das Tool beginnt im ersten Viewport.
- Plausible-Vertrag, Awin-Importtest, Angebotsdaten und Medienrechte-Gate laufen im zentralen Beta-Gate.
- Drei explizit geprüfte Badge-Farbpaare erfüllen WCAG AA für normalen Text.

## Bewusste Grenzen

- Der statische A11y-Scanner meldet trotz vorhandenem Skip-Link `href="#main-content"` einen fehlenden Link, weil seine Regel ausschließlich `#main` erkennt. Der echte Browser-Test bestätigt Fokus und Sprungziel.
- Ein manueller Screenreader-Durchlauf steht noch aus.
- Produktbilder bleiben bei 0 von 20, bis Feedbedingungen oder schriftliche Nutzungsrechte vorliegen.
- Die offizielle Warnungs-/Safety-Gate-Suche ist für 0 von 20 Modellen dokumentiert. Kein Treffer darf später als Sicherheitsurteil formuliert werden.
- Preisbewusste Stadt-/Treppenprofile und kleine Autos haben jeweils nur eine veröffentlichungsfähige Alternative.
- Eltern-Tests und eine belastbare Beta-Stichprobe sind externe Freigabegates.

## Reproduzierbarkeit

Der zentrale Lauf ist:

```bash
node tools/kinderwagen-beta-gate.mjs
node tools/kinderwagen-index-readiness.mjs
```

Die Indexierungsprüfung muss bis zum Abschluss aller manuellen Gates `NICHT BEREIT` melden.
