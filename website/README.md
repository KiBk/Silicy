# Website

Static source for [sicily.apps.kibk.net](https://sicily.apps.kibk.net). The active generated guide is in **[guide/](guide/)**; factual source is **[guide/content.md](guide/content.md)**. It has eight selectable stages, a fixed map with animated GPX lines, hotel/stop navigation, logistics and accommodation research. Exact GPX files for **2, 3, 4, 6, 7 and 8** are imported, with individual and six-file ZIP downloads. **1 and 5** remain pending; Stage 2's current export differs from the planned figures and is flagged.

The pre-redesign root HTML/JS/CSS, Russian/Italian translations and old northbound GPX are retained as historical source, not deployed. The synchronized guide is currently in English. Current access controls are preserved and live tracking remains disabled.

## Local preview

From this directory:

```sh
make serve
```

Then open <http://127.0.0.1:8080>. `make` forwards to `guide/`, never the historical root page. Maps use local Leaflet and OpenStreetMap tiles; the page does not request a tracking feed. Direct stage links use `/#stage/4` and work after reload. Animation can be disabled and respects reduced-motion preferences.

## Checks

```sh
make check
```

## Container image

```sh
make build
```

Preferred daemonless release: `make push-crane`, `make publish`, `make verify`. Publishing deliberately preserves private access. The homelab deployment configuration remains in its private operational context. Never switch to public exposure as a side effect of a content update.

## Route import

Review a Garmin export's identity, distance, start/end privacy and course direction, then copy it to `guide/routes/stage-N.gpx`. `make check` converts every track point and segment without simplification, validates distance against the checked Garmin export figures and reproduces downloadable GPX files, `public/routes.json` and a deterministic ZIP. Stage 2's checked export is 65.76 km, with its 71.36 km planned figure retained and explicitly distinguished in Markdown. Missing tracks have no invented connecting line. Keep original source files unchanged; do not substitute generic official variants. Update the expected available-stage set in the checks and the ZIP manifest's mismatch note when further exports or confirmed route revisions arrive.

Edit facts only in `guide/content.md` and rerun `make render`. The generated `public/source.md` is byte-identical and its SHA-256 is embedded in the page. Presentation lives in the renderer, `public/app.js` and `public/styles.css`. Do not edit generated HTML directly.
