# Website

Static source for [sicily.apps.kibk.net](https://sicily.apps.kibk.net). The active generated guide is in **[guide/](guide/)**; factual source is **[guide/content.md](guide/content.md)**. It has eight selectable stages, a fixed map with animated GPX lines, hotel/stop navigation, logistics and accommodation research. Stage 4's exact GPX is imported; the other seven are explicitly pending.

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

Review a Garmin export's identity, distance, start/end privacy and course direction, then copy it to `guide/routes/stage-N.gpx`. `make check` converts every track point and segment without simplification, validates the distance against Fausto's table and reproduces downloadable GPX files and `public/routes.json`. Missing tracks have no invented connecting line. Keep original source files unchanged; do not substitute generic official variants.

Edit facts only in `guide/content.md` and rerun `make render`. The generated `public/source.md` is byte-identical and its SHA-256 is embedded in the page. Presentation lives in the renderer, `public/app.js` and `public/styles.css`. Do not edit generated HTML directly.
