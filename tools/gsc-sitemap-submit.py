#!/usr/bin/env python3
"""
Reicht die Sitemap erneut bei der Google Search Console ein.

Hintergrund: Google liest eine eingereichte Sitemap nur in eigenem Rhythmus neu. Bei einer
jungen Domain mit geringer Autorität kann das Wochen dauern. Am 28.07.2026 stand Googles
Sitemap-Stand auf 30 URLs, während die Datei bereits 37 enthielt — die sieben neueren URLs
(Kinderwagen-Cluster) waren Google unbekannt.

Nach jeder Sitemap-Änderung ausführen:

    python3 tools/gsc-sitemap-submit.py
    python3 tools/gsc-sitemap-submit.py --status      # nur den aktuellen Stand zeigen

Nutzt die Zugangsdaten aus ~/.config/claude-seo/ (Service Account) und die offizielle
Sitemaps-API. Kein Umweg über die Indexing API — die ist laut Google nur für JobPosting
und Livestreams zugelassen.
"""

import argparse
import os
import re
import sys
import urllib.parse

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'claude-seo', 'scripts'))

try:
    from googleapiclient.discovery import build
except ImportError:
    sys.exit('Fehlt: google-api-python-client (pip install google-api-python-client)')

from google_auth import get_oauth_credentials  # noqa: E402

PROPERTY = 'sc-domain:kleinkind-welt.de'
SITEMAP_URL = 'https://kleinkind-welt.de/sitemap.xml'
WRITE_SCOPE = ['https://www.googleapis.com/auth/webmasters']


def local_url_count():
    path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sitemap.xml')
    try:
        with open(path, encoding='utf-8') as handle:
            return len(re.findall(r'<loc>', handle.read()))
    except OSError:
        return None


def show_status(service):
    feed = urllib.parse.quote(SITEMAP_URL, safe='')
    info = service.sitemaps().get(siteUrl=PROPERTY, feedpath=SITEMAP_URL).execute()
    submitted = next((c.get('submitted') for c in info.get('contents', [])), '?')
    print(f"  zuletzt eingereicht: {info.get('lastSubmitted', '?')}")
    print(f"  zuletzt gelesen:     {info.get('lastDownloaded', 'noch nie')}")
    print(f"  URLs laut Google:    {submitted}")
    print(f"  Fehler/Warnungen:    {info.get('errors', '0')}/{info.get('warnings', '0')}")
    return submitted


def main():
    parser = argparse.ArgumentParser(description='Sitemap bei der GSC erneut einreichen')
    parser.add_argument('--status', action='store_true', help='nur Status zeigen, nichts einreichen')
    args = parser.parse_args()

    local = local_url_count()
    print(f"Sitemap lokal: {local} URLs" if local else 'Sitemap lokal nicht lesbar')

    credentials = get_oauth_credentials(WRITE_SCOPE)
    service = build('searchconsole', 'v1', credentials=credentials, cache_discovery=False)

    print('\nStand vor der Einreichung:')
    before = show_status(service)

    if args.status:
        return

    print('\nReiche Sitemap erneut ein …')
    service.sitemaps().submit(siteUrl=PROPERTY, feedpath=SITEMAP_URL).execute()
    print('  eingereicht.')

    print('\nStand direkt danach:')
    after = show_status(service)

    print(
        '\nHinweis: Die URL-Zahl aktualisiert Google erst, wenn die Datei erneut gelesen wurde.'
        f' Vorher {before}, jetzt {after}.'
        ' Ein bis zwei Tage später erneut mit --status prüfen.'
    )


if __name__ == '__main__':
    main()
