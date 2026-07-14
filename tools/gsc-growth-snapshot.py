#!/usr/bin/env python3
"""Compare two equal GSC periods and report priority-page movement.

The script reads the public monitoring configuration from
data/seo-monitoring-config.json and the local GSC credentials through the
existing claude-seo helper. It prints Markdown by default and never writes or
uploads credentials.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, timedelta
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "data" / "seo-monitoring-config.json"
GSC_HELPERS = ROOT / "claude-seo" / "scripts"
sys.path.insert(0, str(GSC_HELPERS))

from gsc_query import query_search_analytics  # noqa: E402


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--days", type=int, choices=(14, 28), default=14)
    parser.add_argument("--end", help="Current period end date (YYYY-MM-DD)")
    parser.add_argument("--json", action="store_true", help="Print JSON instead of Markdown")
    return parser.parse_args()


def period_for(end: date, days: int) -> tuple[date, date, date, date]:
    current_start = end - timedelta(days=days - 1)
    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end - timedelta(days=days - 1)
    return previous_start, previous_end, current_start, end


def normalized_path(value: str) -> str:
    path = urlparse(value).path.rstrip("/")
    return path or "/"


def rows_by_path(result: dict) -> dict[str, dict]:
    return {normalized_path(row["page"]): row for row in result.get("rows", [])}


def numeric_delta(current: float, previous: float) -> float:
    return round(current - previous, 2)


def percent_delta(current: float, previous: float) -> float | None:
    if previous == 0:
        return None
    return round(((current - previous) / previous) * 100, 1)


def compare(config: dict, days: int, end: date) -> dict:
    previous_start, previous_end, current_start, current_end = period_for(end, days)
    property_name = config["property"]

    previous = query_search_analytics(
        property_name,
        previous_start.isoformat(),
        previous_end.isoformat(),
        dimensions=["page"],
        row_limit=25000,
    )
    current = query_search_analytics(
        property_name,
        current_start.isoformat(),
        current_end.isoformat(),
        dimensions=["page"],
        row_limit=25000,
    )
    for label, result in (("previous", previous), ("current", current)):
        if result.get("error"):
            raise RuntimeError(f"GSC {label} query failed: {result['error']}")

    old_pages = rows_by_path(previous)
    new_pages = rows_by_path(current)
    priority = []
    for path in config["priorityPages"]:
        old = old_pages.get(path, {})
        new = new_pages.get(path, {})
        priority.append(
            {
                "path": path,
                "previous": {
                    "clicks": old.get("clicks", 0),
                    "impressions": old.get("impressions", 0),
                    "ctr": old.get("ctr", 0),
                    "position": old.get("position", 0),
                },
                "current": {
                    "clicks": new.get("clicks", 0),
                    "impressions": new.get("impressions", 0),
                    "ctr": new.get("ctr", 0),
                    "position": new.get("position", 0),
                },
            }
        )

    old_totals = previous["totals"]
    new_totals = current["totals"]
    return {
        "generatedAt": date.today().isoformat(),
        "property": property_name,
        "periodDays": days,
        "previousPeriod": {
            "start": previous_start.isoformat(),
            "end": previous_end.isoformat(),
            "totals": old_totals,
        },
        "currentPeriod": {
            "start": current_start.isoformat(),
            "end": current_end.isoformat(),
            "totals": new_totals,
        },
        "delta": {
            metric: {
                "absolute": numeric_delta(new_totals.get(metric, 0), old_totals.get(metric, 0)),
                "percent": percent_delta(new_totals.get(metric, 0), old_totals.get(metric, 0)),
            }
            for metric in ("clicks", "impressions", "ctr", "position")
        },
        "priorityPages": priority,
        "interpretation": (
            "For position, a negative absolute delta is an improvement. "
            "Very small datasets and anonymized queries require cautious interpretation."
        ),
    }


def fmt_change(value: dict, inverse: bool = False) -> str:
    absolute = value["absolute"]
    percent = value["percent"]
    direction = "besser" if (absolute < 0 if inverse else absolute > 0) else "schlechter"
    if absolute == 0:
        direction = "gleich"
    pct = "n/a" if percent is None else f"{percent:+.1f}%"
    return f"{absolute:+g} ({pct}; {direction})"


def as_markdown(report: dict) -> str:
    previous = report["previousPeriod"]
    current = report["currentPeriod"]
    lines = [
        f"# GSC-{report['periodDays']}-Tage-Vergleich",
        "",
        f"Property: `{report['property']}`  ",
        f"Vorperiode: {previous['start']} bis {previous['end']}  ",
        f"Aktuelle Periode: {current['start']} bis {current['end']}",
        "",
        "| KPI | Vorher | Aktuell | Veränderung |",
        "|---|---:|---:|---:|",
    ]
    for metric, label, inverse in (
        ("clicks", "Klicks", False),
        ("impressions", "Impressionen", False),
        ("ctr", "CTR (%)", False),
        ("position", "Ø Position", True),
    ):
        lines.append(
            f"| {label} | {previous['totals'].get(metric, 0)} | "
            f"{current['totals'].get(metric, 0)} | {fmt_change(report['delta'][metric], inverse)} |"
        )

    lines.extend(
        [
            "",
            "## Prioritätsseiten",
            "",
            "| Seite | Impr. vorher | Impr. aktuell | Klicks vorher | Klicks aktuell | Position aktuell |",
            "|---|---:|---:|---:|---:|---:|",
        ]
    )
    for item in report["priorityPages"]:
        lines.append(
            f"| `{item['path']}` | {item['previous']['impressions']} | "
            f"{item['current']['impressions']} | {item['previous']['clicks']} | "
            f"{item['current']['clicks']} | {item['current']['position']} |"
        )
    lines.extend(
        [
            "",
            "> Position: kleiner ist besser. Bei sehr kleinen Datenmengen erst nach mehreren Perioden entscheiden.",
        ]
    )
    return "\n".join(lines)


def main() -> int:
    args = parse_args()
    config = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    if args.end:
        end = date.fromisoformat(args.end)
    else:
        end = date.today() - timedelta(days=config.get("gscDataLagDays", 3))
    report = compare(config, args.days, end)
    print(json.dumps(report, ensure_ascii=False, indent=2) if args.json else as_markdown(report))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, RuntimeError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        raise SystemExit(1)
