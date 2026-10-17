#!/usr/bin/env python3
"""Independently round-trip every downloadable track against the local originals."""
import json
import hashlib
import re
import struct
import xml.etree.ElementTree as ET
import zipfile
from datetime import datetime

from build_data import PRIVATE, PUBLIC, ROOT, distance, rows

NS = {'g': 'http://www.topografix.com/GPX/1/1'}
ALLOWED = {'gpx', 'trk', 'name', 'type', 'trkseg', 'trkpt', 'ele'}


def tracks(payload):
    doc = ET.fromstring(payload)
    assert {e.tag.split('}')[-1] for e in doc.iter()} <= ALLOWED
    assert set(doc.attrib) == {'version', 'creator'}
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


data = json.loads((PUBLIC / 'journey.json').read_text())
assert set(data) == {'stages', 'hotels', 'photos', 'privacy'}
captions = rows((ROOT / 'content.md').read_text(), 'Photo journal')
assert len(data['stages']) == 8 and len(data['photos']) == len(captions)
combined = tracks((PUBLIC / 'routes/sicily-complete.gpx').read_bytes())
assert len(combined) == 8
originals = sorted((PRIVATE / 'originals').glob('*.gpx'))
assert len(originals) == 8
all_removed = set()
all_exposed = set()
trimmed_metres = None

for day, original in enumerate(originals, 1):
    # Read original geometry only; the original namespaces contain private sensors.
    original_root = ET.parse(original).getroot()
    full = [[(float(p.attrib['lon']), float(p.attrib['lat']), float(p.find('g:ele', NS).text))
             for p in segment.findall('g:trkpt', NS)]
            for segment in original_root.findall('.//g:trkseg', NS)]
    public = tracks((PUBLIC / f'routes/day-{day:02}.gpx').read_bytes())
    assert len(public) == 1 and public[0] == combined[day-1]
    segments = public[0]
    map_stage = data['stages'][day-1]
    assert set(map_stage) == {'stage', 'segments', 'gpx', 'points'}
    assert map_stage['stage'] == day and map_stage['gpx'] == f'routes/day-{day:02}.gpx'
    assert map_stage['segments'] == [[[p[1], p[0]] for p in line] for line in segments]
    assert map_stage['points'] == sum(map(len, segments))
    if day < 8:
        assert segments == full, f'Unintended change to stage {day}'
    else:
        assert len(segments) <= len(full)
        assert segments[:-1] == full[:len(segments)-1]
        assert segments[-1] == full[len(segments)-1][:len(segments[-1])]
        full_flat = [p for line in full for p in line]
        retained = [p for line in segments for p in line]
        removed = full_flat[len(retained):]
        assert removed and retained == full_flat[:len(retained)]
        # Never bridge segment gaps when measuring the privacy cut.
        trimmed_metres = 0.0
        for index, line in enumerate(full):
            start = len(segments[-1])-1 if index == len(segments)-1 else 0
            if index >= len(segments)-1:
                trimmed_metres += sum(distance(a, b) for a, b in zip(line[start:], line[start+1:]))
        assert 500 <= trimmed_metres < 550
        all_removed.update(p[:2] for p in removed)
    all_exposed.update(p[:2] for line in segments for p in line)

photo_audit = json.loads((PRIVATE / 'photos/import-audit.json').read_text())['photos']
photo_metadata = json.loads((PRIVATE / 'photos/metadata.json').read_text())
actual_assets = set()
assert len(photo_audit) == len(data['photos'])
capture_order=[]
for p, caption, audit in zip(data['photos'], captions, photo_audit):
    assert set(p) == {'id', 'stage', 'lat', 'lon', 'src', 'thumb', 'width', 'height', 'locationSource', 'title', 'alt'}
    assert [p['id'], str(p['stage']), p['title'], p['alt']] == caption
    assert p['locationSource'] == 'photo GPS'
    assert audit['id'] == p['id'] and audit['visually_reviewed']
    original = next(m for m in photo_metadata if m['filename'] == audit['original'])
    capture_order.append(datetime.strptime(original['DateTimeOriginal']+original['OffsetTimeOriginal'], '%Y:%m:%d %H:%M:%S%z'))
    assert hashlib.sha256((PRIVATE / 'photos/originals' / original['filename']).read_bytes()).hexdigest() == original['sha256']
    assert p['lat'] == round(original['GPSLatitude'], 6) and p['lon'] == round(original['GPSLongitude'], 6)
    assert p['stage'] == int(original['DateTimeOriginal'][8:10])-4
    assert distance((p['lon'], p['lat']), full_flat[-1]) >= 500
    assert min(distance((p['lon'], p['lat']), point) for line in combined[p['stage']-1] for point in line) <= 500
    for key, digest_key in [('src', 'full_sha256'), ('thumb', 'thumb_sha256')]:
        assert re.fullmatch(r'photos/photo-\d{2}(?:-thumb)?\.webp', p[key])
        path = PUBLIC / p[key]
        actual_assets.add(path.name)
        payload = path.read_bytes()
        assert hashlib.sha256(payload).hexdigest() == audit[digest_key]
        assert payload[:4] == b'RIFF' and payload[8:12] == b'WEBP'
        pos = 12
        while pos < len(payload):
            chunk = payload[pos:pos+4]
            size = struct.unpack_from('<I', payload, pos+4)[0]
            assert chunk not in {b'EXIF', b'XMP ', b'ICCP'}, f'Embedded metadata: {path.name}'
            pos += 8 + size + size % 2
        assert pos == len(payload)
    all_exposed.add((p['lon'], p['lat']))
assert capture_order == sorted(capture_order), 'Photo IDs must stay in actual capture-time order'
assert [p['id'] for p in data['photos']] == [f'{i:02}' for i in range(1,len(data['photos'])+1)]
assert {p.name for p in (PUBLIC / 'photos').iterdir()} == actual_assets
for h in data['hotels']:
    assert set(h) == {'stage', 'lat', 'lon'}
    all_exposed.add((h['lon'], h['lat']))
assert not all_removed & all_exposed

expected = {f'day-{n:02}.gpx' for n in range(1, 9)} | {'sicily-complete.gpx', 'README.txt'}
with zipfile.ZipFile(PUBLIC / 'sicily-recorded-gpx.zip') as bundle:
    assert set(bundle.namelist()) == expected
    assert bundle.testzip() is None
    for name in expected - {'README.txt'}:
        assert bundle.read(name) == (PUBLIC / 'routes' / name).read_bytes()

# Guard against accidentally copying activity originals or source data into public/.
for path in PUBLIC.rglob('*'):
    assert not path.is_symlink()
    assert 'private' not in path.parts and not path.name.startswith('activity_')
    if path.suffix in {'.html', '.json', '.gpx', '.md'}:
        text = path.read_text()
        assert not re.search(r'"(?:timestamps|heart_rate|activity_id|account_id)"\s*:', text)
        assert not re.search(r'<(?:\w+:)?(?:time|hr|cad|extensions)(?:\s|>)', text)

print(f'ok: all 8 GPX, map and ZIP agree; final {trimmed_metres:.1f} m absent; no sensor/timestamp fields')
print(f'ok: {len(data["photos"])} photo GPS pins match originals; all web images metadata-free and outside private finish area')
