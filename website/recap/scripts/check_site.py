#!/usr/bin/env python3
"""Verify that generated output faithfully corresponds to content.md."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
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
    assert meta['base_path'] == '/sicily/' and meta['url'] == 'https://kibk.net/sicily/', "canonical address must stay lowercase"
    assert "[TODO" not in source.decode("utf-8", errors="replace"), "unresolved [TODO] in content.md"
    assert "__SLUG__" not in (root / "Makefile").read_text(encoding="utf-8"), "unresolved Makefile slug"

    decoded_page = html.unescape(page)
    markdown = source.decode("utf-8")
    links = set(re.findall(r"!?\[[^\]]*\]\((https?://[^\s)]+)", markdown))
    links.update(re.findall(r"<(https?://[^>]+)>", markdown))
    missing = sorted(url for url in links if url not in decoded_page)
    assert not missing, f"links missing from rendered page: {missing}"

    # The compact map UI must keep the full source facts and all route choices.
    ui_match = re.search(r'<script type="application/json" id="site-meta">(.*?)</script>', page, re.DOTALL)
    assert ui_match, "map metadata missing"
    ui = json.loads(ui_match.group(1))
    assert len(ui["stages"]) == 8 and len(ui["hotels"]) == 7, "stage or stay missing"
    assert ui["photoCount"] == 26, "reviewed photo count changed"
    assert ui["totalStays"] == sum(h["cost"] for h in ui["hotels"]) == 573, "incorrect accommodation total"
    assert [h["perPerson"] for h in ui["hotels"]] == [34.5,35,50,42,35,25,65], "incorrect per-person prices"
    assert all(h["perPerson"]*2 == h["cost"] for h in ui["hotels"]), "per-person cost basis incorrect"
    assert [h["stage"] for h in ui["hotels"] if h["room"] == "Shared room"] == [1,2,5,6], "shared-room confirmations changed"
    assert set(ui["rideNotes"]) == set("012345678"), "personal ride note missing"
    assert ui["title"] == "Sicily Divide"
    for stage in ui["stages"]:
        assert f'data-stage="{stage["stage"]}"' in page, "stage control missing"
    for control in ("journey-map", "photo-dialog", "photo-preview", "notes-dialog", "all-stages", "ride-note-body", "trip-title"):
        assert f'id="{control}"' in page, f"map control missing: {control}"
    for removed in ("show-photos", "show-hotels", "browse-photos", "download-route", "stay-summary"):
        assert f'id="{removed}"' not in page, f"removed control returned: {removed}"
    assert not re.search(r'<a\b[^>]*\bdownload(?:\s|>)',page), "track download control returned"
    heading = page.split('<header class="trip-heading"',1)[1].split('</header>',1)[0]
    assert '€' not in heading, "price leaked into the trip heading"

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
    print("ok: 8 stages, 7 per-person stay prices, 26 photos, 9 ride notes; no filters/downloads or header prices")
    if map_match:
        print(f"ok: map asset preserved with {len(route_data['layers'])} route layers")


if __name__ == "__main__":
    main()
