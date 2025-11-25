#!/usr/bin/env python3
"""
Convert PlantUML (.puml/.plantuml) simple diagrams to CSV rows.

This script extracts node declarations (actor/class/participant/etc.) and
binary relations (A --> B : label) into a CSV with columns:

  file, element_type, source, target, relation, label, raw

Usage:
  ./scripts/puml_to_csv.py path/to/file.puml -o out.csv
  ./scripts/puml_to_csv.py path/to/folder -o all_edges.csv

It's deliberately conservative (works for most simple PlantUML arrow syntaxes
and node declarations). It doesn't attempt to fully parse PlantUML but it is
useful to extract edges/nodes for simple benchmarks or import into spreadsheets.
"""
import argparse
import csv
import os
import re
from pathlib import Path


NODE_RE = re.compile(r'^(?:\s*)(?P<kind>actor|participant|class|interface|database|node|folder|artifact)\s+(?P<name>"?[\w\-./: ]+"?)', re.IGNORECASE)

# Relation pattern: left <arrow> right [: label]
REL_RE = re.compile(r'^(?:\s*)(?P<left>"?[\w\-./: ]+"?)\s*(?P<rel>(?:<<?[-.]+[>|]?|[<|]?[.-]+>+|<-+|>+|-+))\s*(?P<right>"?[\w\-./: ]+"?)\s*(?:[:]\s*(?P<label>.*))?$', re.IGNORECASE)


def iter_puml_files(path: Path):
    if path.is_file() and path.suffix in ('.puml', '.plantuml', '.txt'):
        yield path
        return
    if path.is_file():
        # also accept .uml
        if path.suffix in ('.uml',):
            yield path
            return
    if path.is_dir():
        for p in sorted(path.rglob('*.puml')):
            yield p
        for p in sorted(path.rglob('*.plantuml')):
            yield p


def normalize_name(n: str) -> str:
    if not n:
        return ''
    return n.strip().strip('"')


def parse_puml_file(p: Path):
    rows = []
    with p.open(encoding='utf-8', errors='ignore') as fh:
        for lineno, line in enumerate(fh, start=1):
            s = line.strip()
            if not s or s.startswith("'") or s.startswith("//"):
                continue

            mnode = NODE_RE.match(line)
            if mnode:
                kind = mnode.group('kind')
                name = normalize_name(mnode.group('name'))
                rows.append({
                    'file': str(p),
                    'element_type': 'node',
                    'source': name,
                    'target': '',
                    'relation': kind.lower(),
                    'label': '',
                    'raw': line.rstrip('\n'),
                    'lineno': lineno,
                })
                continue

            m = REL_RE.match(line)
            if m:
                left = normalize_name(m.group('left'))
                right = normalize_name(m.group('right'))
                rel = m.group('rel') or ''
                label = (m.group('label') or '').strip()
                rows.append({
                    'file': str(p),
                    'element_type': 'edge',
                    'source': left,
                    'target': right,
                    'relation': rel,
                    'label': label,
                    'raw': line.rstrip('\n'),
                    'lineno': lineno,
                })
                continue

            # not matched; you can optionally capture other statements
    return rows


def main():
    ap = argparse.ArgumentParser(description='Extract nodes/edges from PlantUML files into CSV')
    ap.add_argument('path', help='File or directory to scan for .puml/.plantuml files')
    ap.add_argument('-o', '--output', default='puml_edges.csv', help='CSV output file')
    ap.add_argument('--include-raw', action='store_true', help='Include raw line in CSV')
    args = ap.parse_args()

    p = Path(args.path)
    files = list(iter_puml_files(p))
    if not files:
        print('No .puml/.plantuml files found at', p)
        return 1

    allrows = []
    for f in files:
        allrows.extend(parse_puml_file(f))

    # write CSV
    fieldnames = ['file', 'lineno', 'element_type', 'source', 'target', 'relation', 'label']
    if args.include_raw:
        fieldnames.append('raw')

    out = Path(args.output)
    with out.open('w', encoding='utf-8', newline='') as fh:
        w = csv.DictWriter(fh, fieldnames=fieldnames)
        w.writeheader()
        for r in allrows:
            outrow = {k: r.get(k, '') for k in fieldnames}
            w.writerow(outrow)

    print(f'Wrote {len(allrows)} rows from {len(files)} files to {out}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
