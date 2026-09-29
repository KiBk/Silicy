#!/usr/bin/env python3
"""Build exact map geometry from reviewed GPX assets, never route via town pins."""
import hashlib
import json
import math
import zipfile
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NS = {'g': 'http://www.topografix.com/GPX/1/1'}
IDS = [513237884, 510243655, 510243994, 510246704, 510246958, 510247190, 510247386, 510248637]
# Current Garmin export distances. Stage 2 differs from Fausto's earlier table;
# retain that distinction in the itinerary instead of accepting any GPX length.
KM = [77, 65.76, 59.59, 68.24, 69.63, 63.27, 60.19, 112.98]

def distance(a, b):
    p, q = math.radians(a[0]), math.radians(b[0])
    h = math.sin((q-p)/2)**2 + math.cos(p)*math.cos(q)*math.sin(math.radians(b[1]-a[1])/2)**2
    return 6371.0088 * 2 * math.atan2(math.sqrt(h), math.sqrt(1-h))

def main():
    routes = []
    out = ROOT / 'public' / 'routes'
    out.mkdir(parents=True, exist_ok=True)
    for stage, course in enumerate(IDS, 1):
        path = ROOT / 'routes' / f'stage-{stage}.gpx'
        if not path.exists():
            routes.append({'stage': stage, 'course': course, 'status': 'missing', 'segments': []})
            continue
        raw = path.read_bytes()
        root = ET.fromstring(raw)
        name = root.findtext('g:metadata/g:name', namespaces=NS) or root.findtext('g:trk/g:name', namespaces=NS)
        segments = []
        for segment in root.findall('.//g:trkseg', NS):
            points = [[float(p.attrib['lat']), float(p.attrib['lon'])] for p in segment.findall('g:trkpt', NS)]
            assert all(35 < lat < 39 and 11 < lon < 17 for lat, lon in points), f'Unexpected coordinates: {path}'
            if points:
                segments.append(points)
        assert segments and sum(map(len, segments)) > 100, f'No usable track: {path}'
        km = sum(distance(a, b) for s in segments for a, b in zip(s, s[1:]))
        assert abs(km-KM[stage-1]) < max(1, KM[stage-1]*.025), f'Wrong course distance: {path}: {km}'
        # Only reviewed course exports belong in routes/. Do not ingest activities,
        # private home endpoints, account exports, or arbitrary Downloads files.
        (out / path.name).write_bytes(raw)
        routes.append({'stage': stage, 'course': course, 'status': 'exact', 'name': name,
                       'segments': segments, 'gpx': f'routes/{path.name}', 'measuredKm': round(km, 3),
                       'sha256': hashlib.sha256(raw).hexdigest(), 'pointCount': sum(map(len, segments))})
        print(f'Stage {stage}: {name}, {km:.3f} km, {sum(map(len, segments))} points')
    (ROOT / 'public' / 'routes.json').write_text(json.dumps({'routes': routes}, separators=(',', ':'))+'\n')
    available = [r for r in routes if r['status'] == 'exact']
    missing = ', '.join(str(r['stage']) for r in routes if r['status'] == 'missing')
    manifest = f"Fausto's Sicily courses, downloaded from Garmin 30 September 2026.\nAvailable stages: {', '.join(str(r['stage']) for r in available)}.\nMissing stages: {missing or 'none'}.\nStage 2 currently shows 65.76 km / 1,334 m on Garmin, versus 71.36 km / 1,430 m in the earlier plan; confirm with Fausto.\nGPX files retain all exported points unchanged. Use offline navigation and check road conditions.\n"
    with zipfile.ZipFile(ROOT / 'public' / 'sicily-gpx-available.zip', 'w', compression=zipfile.ZIP_DEFLATED) as bundle:
        for filename, raw in [('README.txt', manifest.encode())] + [(Path(r['gpx']).name, (ROOT/'public'/r['gpx']).read_bytes()) for r in available]:
            item = zipfile.ZipInfo(filename, (2026, 9, 30, 0, 0, 0))
            item.compress_type = zipfile.ZIP_DEFLATED
            bundle.writestr(item, raw)

if __name__ == '__main__':
    main()
