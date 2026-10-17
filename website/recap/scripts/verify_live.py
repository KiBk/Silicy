#!/usr/bin/env python3
"""Verify public health and byte-for-byte Markdown fidelity."""

from __future__ import annotations

import argparse
import hashlib
import urllib.request
from pathlib import Path


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "turn-into-website/1.0"})
    with urllib.request.urlopen(request, timeout=20) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}: {url}")
        return response.read()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--url", required=True)
    args = parser.parse_args()
    base = args.url.rstrip("/")
    source = (args.root.resolve() / "content.md").read_bytes()
    digest = hashlib.sha256(source).hexdigest()

    health = fetch(f"{base}/healthz").decode("utf-8").strip()
    page = fetch(f"{base}/").decode("utf-8")
    public_source = fetch(f"{base}/source.md")

    assert health == "ok", f"unexpected health response: {health!r}"
    assert public_source == source, "public source.md differs from local content.md"
    assert f'data-source-sha256="{digest}"' in page, "public page checksum mismatch"
    print(f"ok: {base}/healthz")
    print(f"ok: public source fidelity sha256:{digest}")


if __name__ == "__main__":
    main()
