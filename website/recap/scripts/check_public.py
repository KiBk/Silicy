#!/usr/bin/env python3
"""Validate the reviewed public export without accessing private source data."""

import hashlib
import json
import re
import struct
import subprocess
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
NS = {'g': 'http://www.topografix.com/GPX/1/1'}


def tracks(payload):
    doc = ET.fromstring(payload)
    assert set(doc.attrib) == {'version', 'creator'}
    allowed = {'gpx', 'trk', 'name', 'type', 'trkseg', 'trkpt', 'ele'}
    assert {e.tag.split('}')[-1] for e in doc.iter()} <= allowed
    for element in doc.iter():
        if element.tag.endswith('}trkpt'):
            assert set(element.attrib) == {'lat', 'lon'}
        elif element is not doc:
            assert not element.attrib
    return [
        [[(float(p.attrib['lon']), float(p.attrib['lat']), float(p.find('g:ele', NS).text))
          for p in segment.findall('g:trkpt', NS)]
         for segment in track.findall('g:trkseg', NS)]
        for track in doc.findall('g:trk', NS)
    ]


def main():
    manifest = json.loads((ROOT / 'reviewed-assets.json').read_text())
    assert manifest['final_trimmed_metres'] == 500.1
    reviewed = manifest['sha256']
    expected_assets = {'journey.json', 'sicily-recorded-gpx.zip', 'routes/sicily-complete.gpx'}
    expected_assets |= {f'routes/day-{i:02}.gpx' for i in range(1, 9)}
    expected_assets |= {f'photos/photo-{i:02}{suffix}.webp' for i in range(1, 27) for suffix in ('', '-thumb')}
    assert set(reviewed) == expected_assets
    for name, digest in reviewed.items():
        assert hashlib.sha256((PUBLIC / name).read_bytes()).hexdigest() == digest, f'Unreviewed asset change: {name}'
    public_files = expected_assets | {
        'index.html', 'source.md', 'styles.css', 'app.js', 'map-gestures.js',
        'leaflet.js', 'leaflet.css', 'LICENSE.leaflet.txt', 'placeholder.svg', 'healthz', '.nojekyll',
    }
    assert {str(p.relative_to(PUBLIC)) for p in PUBLIC.rglob('*') if p.is_file()} == public_files
    recap_files = {f'public/{name}' for name in public_files} | {
        'README.md', '.gitignore', '.turn-into-website', 'Dockerfile', 'nginx.conf',
        'Makefile', 'site.json', 'content.md', 'reviewed-assets.json', 'RELEASE.md',
        'hotel-pins.json', 'photo-assets.json',
        'scripts/render_recap.mjs', 'scripts/check_site.py', 'scripts/check_public.py',
        'scripts/check_gestures.mjs', 'scripts/check_privacy.py', 'scripts/build_data.py',
        'scripts/import_photos.py', 'scripts/render.mjs', 'scripts/build-and-push-crane.sh',
        'scripts/verify_live.py', 'scripts/verify_pages.py', 'scripts/vendor/marked.esm.js',
        'scripts/vendor/LICENSE.marked.txt',
    }
    tracked = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT.parents[1]).decode().split('\0')
    for name in filter(None, tracked):
        assert not re.search(r'(^|/)(private|originals)/|\.(?:heic|mp4|pyc)$', name, re.I), f'Private file tracked: {name}'
    for path in ROOT.rglob('*'):
        relative = path.relative_to(ROOT)
        if '__pycache__' in relative.parts:
            continue
        assert not path.is_symlink(), f'Symlink not allowed: {relative}'
        if path.is_file():
            assert relative.as_posix() in recap_files, f'Unexpected recap file: {relative}'
            if path.suffix in {'.md', '.html', '.json', '.gpx', '.yml', '.js', '.mjs', '.py'}:
                value = path.read_text()
                assert not re.search(r'gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----', value), f'Credential pattern: {relative}'
                assert not re.search(r'https?://[^\s]*[?&](?:sid|token|access_token|auth)=', value), f'Private link: {relative}'

    data = json.loads((PUBLIC / 'journey.json').read_text())
    assert set(data) == {'stages', 'hotels', 'photos', 'privacy'}
    assert len(data['stages']) == 8 and len(data['hotels']) == 7 and len(data['photos']) == 26
    combined = tracks((PUBLIC / 'routes/sicily-complete.gpx').read_bytes())
    assert len(combined) == 8
    for day, stage in enumerate(data['stages'], 1):
        lines = tracks((PUBLIC / f'routes/day-{day:02}.gpx').read_bytes())
        assert len(lines) == 1 and lines[0] == combined[day-1]
        assert stage['stage'] == day
        assert stage['segments'] == [[[p[1], p[0]] for p in line] for line in lines[0]]
        assert stage['points'] == sum(map(len, lines[0]))
    with zipfile.ZipFile(PUBLIC / 'sicily-recorded-gpx.zip') as bundle:
        names = {f'day-{i:02}.gpx' for i in range(1, 9)} | {'sicily-complete.gpx'}
        assert set(bundle.namelist()) == names | {'README.txt'}
        assert bundle.testzip() is None
        for name in names:
            assert bundle.read(name) == (PUBLIC / 'routes' / name).read_bytes()
    for photo in data['photos']:
        for key in ('src', 'thumb'):
            payload = (PUBLIC / photo[key]).read_bytes()
            assert payload[:4] == b'RIFF' and payload[8:12] == b'WEBP'
            pos = 12
            while pos < len(payload):
                assert payload[pos:pos+4] not in {b'EXIF', b'XMP ', b'ICCP'}, 'Embedded photo metadata'
                size = struct.unpack_from('<I', payload, pos+4)[0]
                pos += 8 + size + size % 2
            assert pos == len(payload)
    for url in re.findall(r'(?:src|href)="([^"<>]+)"', (PUBLIC / 'index.html').read_text()):
        parts = urlsplit(url)
        if parts.scheme or not parts.path:
            continue
        assert not parts.path.startswith('/') and '..' not in Path(parts.path).parts, f'Not subpath-safe: {url}'
        assert (PUBLIC / parts.path).is_file(), f'Missing asset: {url}'
    assert not (PUBLIC / 'CNAME').exists(), 'Inherit the account custom domain; do not override it'
    print('ok: reviewed public export, repository allowlist, 8 GPX/map/ZIP tracks, 26 metadata-free photos, subpath-safe assets')


if __name__ == '__main__':
    main()
