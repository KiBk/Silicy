# Stage-guide release — 29 September 2026

Live: [Sicily guide](https://sicily.apps.kibk.net) · [Stage 4](https://sicily.apps.kibk.net/#stage/4). Existing private access and disabled tracking are preserved. The current generated guide is in English; old source translations are historical, not deployed.

## Release identity

- Platform: **linux/amd64**
- Image digest: `sha256:52c41e4aa02ae72d2e596227cb4545381822ef67748976c4ed9a7b40a6eff80a`
- Source: [guide/content.md](guide/content.md)
- Source SHA-256: `079f0e759f8d48af19abefccdf84c77ed992583180620ba9a905a488cfc90116`

## Verified

- `/healthz` returned `ok`; homepage returned HTTP 200.
- Live HTML, CSS, JavaScript, route JSON, Leaflet assets and Stage 4 GPX are byte-for-byte identical to the built files.
- Live `/source.md` matches the canonical Markdown and embedded SHA-256.
- All eight stage selections were exercised at 390 px: one correct panel each, no horizontal page overflow; only Stage 4 draws a path.
- Stage 4 direct-link reload, browser Back, animation toggle and menu Escape were checked. Desktop and phone layouts were visually inspected. Operating-system reduced-motion support and print styles are implemented; print output was not physically tested.
- The Stage 4 map retains every one of 5,507 GPX points. Download checksum matches the supplied Garmin export.
- Stage 4 Cammarata and Mussomeli town pins are both about 2 m from a track point. Other regional stops are labelled as candidates awaiting their exact GPX.
- Hotel/pass/town destination identities were checked in Google Maps. Rinaldo's duplicate listing ambiguity is addressed with a specific place ID. See [MAP-LINKS.md](../MAP-LINKS.md).
- `/api/dotwatcher` still returns **410**; no tracker request is made by the frontend. Deployment did not enable a public listener or change private DNS.

## Remaining work

Only Stage 4 was supplied: two identical files with the same checksum. Import stages **1, 2, 3, 5, 6, 7 and 8** when their GPX exports are provided; confirm each course's endpoints, direction and privacy before publication. Do not draw guessed routes or replace Fausto's tracks with generic official variants.

Room bookings/price basis, Monday overnight in Modica, Tuesday transport, Catania hotel choices, real train tickets, route conditions and operating hours retain the caveats in the itinerary. Prices are the earlier 29 September research snapshot, not a new checkout quote.
