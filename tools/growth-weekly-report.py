#!/usr/bin/env python3
"""Summarize a private Plausible ZIP and optionally append the existing GSC report.

Reads CSVs directly from the archive; never extracts or uploads visitor data.
"""
import argparse
import csv
import io
import subprocess
import sys
import zipfile
from collections import Counter
from pathlib import Path
from urllib.parse import parse_qs, urlsplit


def rows(archive, name, required=False):
    names = [n for n in archive.namelist() if Path(n).name == name]
    if not names and not required:
        return []
    if len(names) != 1:
        raise ValueError(f"Expected one {name}, found {len(names)}")
    with archive.open(names[0]) as stream:
        return list(csv.DictReader(io.TextIOWrapper(stream, encoding='utf-8-sig')))


def cell(value):
    return str(value).replace('|', '\\|').replace('\n', ' ')


def summarize(path):
    with zipfile.ZipFile(path) as archive:
        daily = rows(archive, 'visitors.csv', required=True)
        conversions = {r['name']: r for r in rows(archive, 'conversions.csv')}
        sources = rows(archive, 'sources.csv')
        entries = rows(archive, 'entry_pages.csv')
        properties = rows(archive, 'custom_props.csv')
    if not daily:
        raise ValueError('No daily rows')
    visits = sum(int(r['visits']) for r in daily)
    views = sum(int(r['pageviews']) for r in daily)
    dates = sorted(r['date'] for r in daily)
    lines = ['# Woechentlicher Wachstumscheck', '',
             f"Plausible-Export: {dates[0]} bis {dates[-1]}",
             f"Besuche: {visits}; Seitenaufrufe: {views}.",
             'Tagesbesucher werden nicht zu eindeutigen Periodenbesuchern addiert.', '',
             '## Ziele', '', '| Ereignis | Eindeutige Konvertierende | Ereignisse |', '|---|---:|---:|']
    for name in ['Affiliate-Klick', 'Outbound Link: Click', 'Newsletter-Formular', 'Newsletter bestätigt', 'Freebie Download']:
        r = conversions.get(name)
        lines.append(f"| {name} | {r['unique_conversions'] if r else 'nicht im Export'} | {r['total_conversions'] if r else 'nicht im Export'} |")
    lines.extend(['', 'Affiliate- und Outbound-Ereignisse koennen dieselben Klicks enthalten: nicht addieren.',
                  'Newsletter bestaetigt misst einen Seitenaufruf nach DOI, keinen unabhaengig verifizierten Brevo-Status. Fehlende Ereignisse belegen keinen technischen Defekt.',
                  '', '## Quellen', '', '| Quelle | Besucher |', '|---|---:|'])
    lines.extend(f"| {cell(r['name'])} | {r['visitors']} |" for r in sources)
    lines.extend(['', '## Einstiegsseiten', '', '| Seite | Einstiege |', '|---|---:|'])
    lines.extend(f"| {cell(r['name'])} | {r['total_entrances']} |" for r in entries)
    refs = Counter()
    for r in properties:
        if r.get('property') != 'url':
            continue
        url = urlsplit(r.get('value', ''))
        if url.hostname not in ('www.awin1.com', 'awin1.com'):
            continue
        ref = parse_qs(url.query).get('clickref', ['ohne clickref'])[0]
        refs[ref] += int(r.get('events') or 0)
    lines.extend(['', '## Awin-Klickzuordnung', '', '| clickref | Ereignisse |', '|---|---:|'])
    lines.extend(f"| {cell(ref)} | {count} |" for ref, count in refs.most_common())
    if not refs:
        lines.append('| Keine Zuordnung im Export | nicht gemessen |')
    lines.extend(['', '## Wirtschaftlichkeit', '',
                  'Bestaetigte Provisionen und laufende Kosten separat aus Awin/Amazon bzw. Rechnungen ergaenzen.',
                  'Quellen und Klickziele lassen sich aus diesen aggregierten Tabellen nicht zu einzelnen Nutzerreisen verbinden.',
                  'Bei kleinen Fallzahlen absolute Werte berichten; keine kausalen Designgewinne oder Conversion-Prognosen ableiten.'])
    return '\n'.join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('plausible_zip', type=Path)
    parser.add_argument('--gsc', action='store_true', help='Append authenticated 28-day GSC comparison')
    args = parser.parse_args()
    print(summarize(args.plausible_zip))
    if args.gsc:
        print('\n---\n', flush=True)
        subprocess.run([sys.executable, str(Path(__file__).with_name('gsc-growth-snapshot.py')), '--days', '28'], check=True)


if __name__ == '__main__':
    main()
