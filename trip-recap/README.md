# Recorded-trip recap workspace

This folder prepares **actual recorded rides**, separate from the planned courses used by the existing travel website. All eight rides from 5–12 October 2026 have been exported and validated: 615.26 km, 11,321 m ascent and 33:17:05 Garmin timer time. The [interactive recap](../website/recap/README.md) uses separate privacy-trimmed copies and includes 26 GPS-located photos from the user's ZIP.

## Local-only inputs and output

`private/` is Git-ignored. It contains the eight downloaded activity GPX files, a checked activity list, provenance manifest, summary and derived map assets. These files are not approved for public publication: recordings may contain health/sensor data, timestamps and private endpoints.

`private/photos/` contains 26 original HEIC images, their 26 paired Live Photo clips, raw metadata, visual review sheets and import provenance. `inspect_photos.py` prepares this private review; the recap importer produces separate metadata-stripped web images. Only the reviewed copies under `website/recap/public/` are approved for the [GitHub Pages recap](https://kibk.net/Silicy/); see its [release record](../website/recap/RELEASE.md). The existing planning site remains unchanged.

Rebuild and validate the local assets:

```sh
python3 trip-recap/prepare_routes.py
```

The script performs no network calls, preserves original exports, retains all GPS points and segment boundaries, and removes health/sensor extensions from the combined GPX and GeoJSON. It checks dates, chronology, coordinate bounds and fidelity, and reports large time/distance gaps. Separate days are never joined by invented lines.

Before publication, review endpoints and the intended photo selection; make a separate publication copy with only approved route geometry, aggregate statistics and photos. Retain GPS timestamps locally for photo alignment. Do not replace the current planning site or publish raw files as part of extraction.
