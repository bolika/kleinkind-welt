#!/usr/bin/env python3
import importlib.util
import io
import unittest
import zipfile
from pathlib import Path

spec = importlib.util.spec_from_file_location('weekly', Path(__file__).with_name('growth-weekly-report.py'))
weekly = importlib.util.module_from_spec(spec)
spec.loader.exec_module(weekly)


class ReportTest(unittest.TestCase):
    def archive(self, extra=None):
        stream = io.BytesIO()
        with zipfile.ZipFile(stream, 'w') as archive:
            archive.writestr('visitors.csv', 'date,visitors,visits,pageviews\n2026-09-01,1,1,2\n2026-09-02,1,2,3\n')
            for name, content in (extra or {}).items():
                archive.writestr(name, content)
        stream.seek(0)
        return stream

    def test_counts_and_missing_goals(self):
        result = weekly.summarize(self.archive())
        self.assertIn('Besuche: 3; Seitenaufrufe: 5', result)
        self.assertIn('nicht im Export', result)
        self.assertIn('nicht zu eindeutigen Periodenbesuchern addiert', result)

    def test_overlapping_events_stay_separate(self):
        result = weekly.summarize(self.archive({
            'conversions.csv': 'name,unique_conversions,total_conversions\nAffiliate-Klick,4,7\nOutbound Link: Click,5,8\n',
            'custom_props.csv': 'property,value,visitors,events\nurl,https://www.awin1.com/pclick.php?clickref=u20_test,2,2\nurl,https://www.awin1.com/pclick.php?clickref=u20_test,1,1\nurl,https://example.com/?clickref=ignore,1,99\n'
        }))
        self.assertIn('| Affiliate-Klick | 4 | 7 |', result)
        self.assertIn('| Outbound Link: Click | 5 | 8 |', result)
        self.assertIn('| u20_test | 3 |', result)
        self.assertNotIn('| ignore |', result)

    def test_duplicate_csv_rejected(self):
        with self.assertRaises(ValueError):
            weekly.summarize(self.archive({'nested/visitors.csv': 'date,visits,pageviews\n'}))


if __name__ == '__main__':
    unittest.main()
