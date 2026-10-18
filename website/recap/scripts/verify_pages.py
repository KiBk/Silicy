#!/usr/bin/env python3
"""Compare each deployed website file with the checked local copy."""

import argparse
import hashlib
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.request import Request, urlopen


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default='https://kibk.net/sicily')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    public = root / 'public'
    base = args.url.rstrip('/')
    assert base.startswith('https://') or base.startswith('http://127.0.0.1:')

    def verify(path):
        relative = path.relative_to(public).as_posix()
        url = base + '/' + ('' if relative == 'index.html' else relative)
        request = Request(url, headers={'User-Agent': 'SicilyDivide-release-check/1.0'})
        with urlopen(request, timeout=45) as response:
            assert response.status == 200, f'HTTP {response.status}: {relative}'
            payload = response.read()
        assert payload == path.read_bytes(), f'Live bytes differ: {relative}'
        return relative

    paths = [p for p in public.rglob('*') if p.is_file() and not p.name.startswith('.')]
    with ThreadPoolExecutor(max_workers=6) as executor:
        checked = list(executor.map(verify, paths))
    source = (root / 'content.md').read_bytes()
    assert (public / 'source.md').read_bytes() == source
    digest = hashlib.sha256(source).hexdigest()
    assert f'data-source-sha256="{digest}"' in (public / 'index.html').read_text()
    print(f'ok: {len(checked)} live files match, including healthz, HTML, source, all GPX/ZIP and photo assets')
    print(f'ok: source fidelity sha256:{digest}')


if __name__ == '__main__':
    main()
