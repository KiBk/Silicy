#!/usr/bin/env python3
"""Create metadata-free web images after local visual review of a photo import."""
import argparse
from datetime import datetime
import hashlib
import json
from pathlib import Path
from zoneinfo import ZoneInfo

from PIL import Image
from build_data import PRIVATE, PUBLIC, ROOT, distance, rows


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--reviewed', action='store_true', required=True,
                        help='Confirm contact sheets were visually checked before import')
    parser.parse_args()
    photo_dir = PRIVATE / 'photos'
    metadata = json.loads((photo_dir / 'metadata.json').read_text())
    originals = sorted([m for m in metadata if m['filename'].endswith('.HEIC')],
                       key=lambda m: (m['DateTimeOriginal'], m['filename']))
    captions = rows((ROOT / 'content.md').read_text(), 'Photo journal')
    assert len(originals) == len(captions)
    features = json.loads((PRIVATE / 'derived/sicily-actual-rides.geojson').read_text())['features']
    endpoint = features[-1]['geometry']['coordinates'][-1][-1]
    assets, audit = [], []
    image_dir = PUBLIC / 'photos'
    image_dir.mkdir(exist_ok=True)
    for original, caption in zip(originals, captions):
        ident, stage_text, title, alt = caption
        stage = int(stage_text)
        assert ident == f'{len(assets)+1:02}' and 1 <= stage <= 8
        instant = datetime.strptime(original['DateTimeOriginal'] + original['OffsetTimeOriginal'],
                                    '%Y:%m:%d %H:%M:%S%z').astimezone(ZoneInfo('Europe/Rome'))
        assert instant.date().isoformat() == f'2026-10-{stage+4:02}'
        point = (original['GPSLongitude'], original['GPSLatitude'])
        # Extra photo safeguard: never expose an image/pin within 500 m of the private finish.
        end_distance = distance(point, endpoint)
        assert end_distance >= 500, f'Hold for privacy review: {original["filename"]}'
        near = min(distance(point, p) for line in features[stage-1]['geometry']['coordinates'] for p in line)
        assert near <= 500, f'Hold for location review: {original["filename"]}'
        clip = next(m for m in metadata if m['filename'] == original['filename'].replace('.HEIC', '.MP4'))
        assert original['ContentIdentifier'] == clip['ContentIdentifier']
        src = photo_dir / 'originals' / original['filename']
        assert hashlib.sha256(src.read_bytes()).hexdigest() == original['sha256']
        # The reviewed JPEG was decoded with libheif, orientation applied and metadata stripped.
        with Image.open(photo_dir / 'review' / (src.stem + '.jpg')) as reviewed:
            im = reviewed.convert('RGB')
            im.info.clear()
            assert max(high-low for low, high in im.getextrema()) > 20
            im.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            width, height = im.size
            full = image_dir / f'photo-{ident}.webp'
            thumb = image_dir / f'photo-{ident}-thumb.webp'
            im.save(full, 'WEBP', quality=86, method=6)
            im.thumbnail((480, 480), Image.Resampling.LANCZOS)
            im.save(thumb, 'WEBP', quality=80, method=6)
        assets.append({'id': ident, 'stage': stage, 'lat': round(point[1], 6),
                       'lon': round(point[0], 6), 'src': f'photos/{full.name}',
                       'thumb': f'photos/{thumb.name}', 'width': width, 'height': height,
                       'locationSource': 'photo GPS'})
        audit.append({'id': ident, 'original': original['filename'], 'original_sha256': original['sha256'],
                      'stage': stage, 'route_distance_m': round(near, 2),
                      'private_finish_distance_m': round(end_distance, 2), 'visually_reviewed': True,
                      'full_sha256': hashlib.sha256(full.read_bytes()).hexdigest(),
                      'thumb_sha256': hashlib.sha256(thumb.read_bytes()).hexdigest()})
    (ROOT / 'photo-assets.json').write_text(json.dumps({'photos': assets}, indent=2) + '\n')
    (photo_dir / 'import-audit.json').write_text(json.dumps({'photos': audit,
        'live_photo_clips_kept_private': len(assets), 'image_metadata_stripped': True}, indent=2) + '\n')
    total = sum(p.stat().st_size for p in image_dir.glob('*.webp'))
    print(f'{len(assets)} GPS-located photos imported; {len(assets)} Live Photo clips kept private; {total/1024/1024:.2f} MiB web images')


if __name__ == '__main__':
    main()
