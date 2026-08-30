# Website

Static source for [sicily.apps.kibk.net](https://sicily.apps.kibk.net). It includes the day-by-day maps, English/Russian/Italian text, the original Modica–Catania GPX, and the public delayed dotwatcher display.

## Local preview

From this directory:

```sh
make serve
```

Then open <http://127.0.0.1:8080>. The trip plan and route maps work locally. The dotwatcher request is same-origin and therefore requires either the deployed backend or a local compatible `/api/dotwatcher` endpoint.

## Checks

```sh
make check
```

## Container image

```sh
make build
make run
```

The homelab deployment configuration remains in its private operational context. This public directory contains only the portable static site and its generic Nginx container definition.
