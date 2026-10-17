#!/usr/bin/env python3
"""Inspect a user-supplied photo ZIP locally, without changing the website."""
import hashlib
import json
from pathlib import Path
import re
import stat
import subprocess
import sys
import zipfile

from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent
PHOTO = ROOT / 'private/photos'


def main():
    archive = Path(sys.argv[1]).resolve()
    originals = PHOTO / 'originals'
    previews = PHOTO / 'review'
    originals.mkdir(parents=True, exist_ok=True)
    previews.mkdir(exist_ok=True)
    with zipfile.ZipFile(archive) as bundle:
        entries = [e for e in bundle.infolist() if not e.is_dir()]
        assert len(entries) <= 500 and sum(e.file_size for e in entries) < 2_000_000_000
        assert len({e.filename for e in entries}) == len(entries)
        for entry in entries:
            assert re.fullmatch(r'[A-Za-z0-9_-]+\.(?:HEIC|JPG|JPEG|PNG|MP4|MOV)', entry.filename, re.I)
            assert not stat.S_ISLNK(entry.external_attr >> 16)
            payload = bundle.read(entry)
            target = originals / entry.filename
            if target.exists():
                assert target.read_bytes() == payload, f'Original changed: {entry.filename}'
            else:
                target.write_bytes(payload)
    files = sorted(originals.iterdir())
    tags = ['DateTimeOriginal', 'OffsetTimeOriginal', 'CreateDate', 'GPSLatitude',
            'GPSLongitude', 'GPSDateTime', 'ImageWidth', 'ImageHeight', 'Orientation',
            'ContentIdentifier', 'Duration', 'FileType']
    output = subprocess.check_output(['exiftool', '-json', '-n'] + ['-' + t for t in tags] + [str(f) for f in files])
    metadata = json.loads(output)
    for item in metadata:
        path = Path(item.pop('SourceFile'))
        item['filename'] = path.name
        item['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
    (PHOTO / 'metadata.json').write_text(json.dumps(metadata, indent=2) + '\n')
    (PHOTO / 'archive.json').write_text(json.dumps({'filename': archive.name,
        'sha256': hashlib.sha256(archive.read_bytes()).hexdigest(), 'files': len(entries)}, indent=2) + '\n')
    stills = sorted([m for m in metadata if m['filename'].lower().endswith(('.heic', '.jpg', '.jpeg', '.png'))],
                    key=lambda m: (m.get('DateTimeOriginal', ''), m['filename']))
    cells = []
    for i, item in enumerate(stills, 1):
        src = originals / item['filename']
        jpeg = previews / (src.stem + '.jpg')
        subprocess.run(['heif-convert', '--quiet', '-q', '94', str(src), str(jpeg)],
                       check=True, stdout=subprocess.DEVNULL)
        # Review derivatives are private, but also strip metadata from them.
        with Image.open(jpeg) as im:
            clean = ImageOps.exif_transpose(im).convert('RGB')
            assert max(high-low for low, high in clean.getextrema()) > 20, f'Decode failed: {src.name}'
            clean.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            clean.info.clear()
            clean.save(jpeg, quality=90)
            cell = Image.new('RGB', (320, 270), '#f6f3eb')
            thumb = ImageOps.contain(clean, (310, 230))
            cell.paste(thumb, ((320-thumb.width)//2, 0))
            text = f"{i:02} · {src.stem} · {item.get('DateTimeOriginal', 'NO DATE')}"
            ImageDraw.Draw(cell).text((8, 235), text, fill='#253b32')
            cells.append(cell)
        print(f"{i:02} {src.name} | {item.get('DateTimeOriginal','NO DATE')} "
              f"{item.get('OffsetTimeOriginal','no offset')} | GPS={'yes' if 'GPSLatitude' in item else 'no'}")
    for page in range((len(cells)+11)//12):
        sheet = Image.new('RGB', (1280, 810), '#f6f3eb')
        for j, cell in enumerate(cells[page*12:(page+1)*12]):
            sheet.paste(cell, ((j%4)*320, (j//4)*270))
        sheet.save(PHOTO / f'contact-{page+1}.jpg', quality=90)
    clips = [m for m in metadata if m['filename'].lower().endswith(('.mp4', '.mov'))]
    pairs = sum(any(Path(c['filename']).stem == Path(p['filename']).stem for c in clips) for p in stills)
    print(f'{len(stills)} still photos; {len(clips)} video companions; {pairs} filename pairs; private contact sheets ready')


if __name__ == '__main__':
    main()
