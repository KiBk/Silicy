#!/usr/bin/env python3
"""Verify that generated output faithfully corresponds to content.md."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    args = parser.parse_args()
    root = args.root.resolve()
    source = (root / "content.md").read_bytes()
    public_source = (root / "public" / "source.md").read_bytes()
    page = (root / "public" / "index.html").read_text(encoding="utf-8")
    meta = json.loads((root / "site.json").read_text(encoding="utf-8"))
    digest = hashlib.sha256(source).hexdigest()

    assert source == public_source, "public/source.md differs from content.md"
    assert f'data-source-sha256="{digest}"' in page, "source checksum missing from index.html"
    assert re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", meta["slug"]), "invalid site slug"
    assert "[TODO" not in source.decode("utf-8", errors="replace"), "unresolved [TODO] in content.md"
    assert "__SLUG__" not in (root / "Makefile").read_text(encoding="utf-8"), "unresolved Makefile slug"

    decoded_page = html.unescape(page)
    markdown = source.decode("utf-8")
    assert not re.search(r'^## .*sources', markdown, re.MULTILINE | re.IGNORECASE), 'keep the guide facts-first: no sources section'
    assert not re.search(r'href=[\"\'][^\"\']*source\.md', page), 'source download must not appear in the user interface'
    assert 'Source SHA-256<br>' not in page, 'checksum must stay in metadata, not the visible footer'
    couple_stay = markdown.split('### Together · 13–17 October\n', 1)[1].split('\n## ', 1)[0]
    assert '**Booked · Catania Centre Urban Art B&B' in couple_stay, 'couple stay must show the reported booking'
    assert 'Not booked' not in couple_stay and 'Duomo Shine' not in couple_stay, 'superseded shortlist must not appear as the active couple stay'
    assert 'not the confirmed booking total' in couple_stay, 'do not turn the earlier quote into a confirmed price'
    assert 'early departure is not yet agreed' in couple_stay, 'early checkout is not confirmed by booking alone'
    assert '### Cyclists · 11–12 October\n\nNot booked.' in markdown, 'couple booking must not mark the cycling finish night as booked'
    links = set(re.findall(r"!?\[[^\]]*\]\((https?://[^\s)]+)", markdown))
    links.update(re.findall(r"<(https?://[^>]+)>", markdown))
    missing = sorted(url for url in links if url not in decoded_page)
    assert not missing, f"links missing from rendered page: {missing}"

    assert len(re.findall(r'data-stage-panel="[1-8]"', page)) == 8, 'expected eight stage panels'
    route_data = json.loads((root / 'public/routes.json').read_text())
    assert len(route_data['routes']) == 8
    ns = {'g': 'http://www.topografix.com/GPX/1/1'}
    for route in route_data['routes']:
        assert f'/course/{route["course"]}' in markdown, 'Garmin course absent from source'
        if route['status'] == 'missing':
            assert not route['segments'], 'missing route must never have fabricated geometry'
            continue
        original = root / 'routes' / f'stage-{route["stage"]}.gpx'
        raw = original.read_bytes()
        assert raw == (root / 'public' / route['gpx']).read_bytes(), 'GPX download differs'
        assert hashlib.sha256(raw).hexdigest() == route['sha256']
        track = ET.fromstring(raw)
        coordinates = [[[float(p.attrib['lat']), float(p.attrib['lon'])] for p in seg.findall('g:trkpt',ns)] for seg in track.findall('.//g:trkseg',ns)]
        assert coordinates == route['segments'], 'GPX points/segments changed or simplified'
        assert sum(map(len,coordinates)) == route['pointCount']
        assert not track.findall('.//{*}hr') and not track.findall('.//{*}cad'), 'activity telemetry must not be published'
    assert '--private' in (root/'Makefile').read_text() and '--public' not in (root/'Makefile').read_text(), 'preserve access policy'
    assert '/api/dotwatcher' not in (root/'public/app.js').read_text(), 'tracking must stay disabled'
    print('ok: eight stage panels, exact GPX fidelity, no fabricated missing routes, private publish, no tracker')

    frontmatter = markdown.split("\n---\n", 1)[0] if markdown.startswith("---\n") else ""
    map_match = re.search(r"^map_data:\s*['\"]?([^'\"\s]+)", frontmatter, re.MULTILINE)
    if map_match:
        map_name = map_match.group(1)
        assert "/" not in map_name and ".." not in map_name, "map_data must be a local filename"
        source_map = root / map_name
        public_map = root / "public" / map_name
        assert source_map.read_bytes() == public_map.read_bytes(), "public map data differs from source asset"
        route_data = json.loads(source_map.read_text(encoding="utf-8"))
        assert route_data.get("layers"), "map_data requires at least one route layer"
        assert all(layer.get("coordinates") for layer in route_data["layers"]), "each route layer needs coordinates"

    print(f"ok: source fidelity sha256:{digest}")
    print(f"ok: {len(links)} Markdown links preserved")
    if map_match:
        print(f"ok: map asset preserved with {len(route_data['layers'])} route layers")


if __name__ == "__main__":
    main()
