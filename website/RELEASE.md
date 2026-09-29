# Facts-first guide release — 29 September 2026

Live: [Sicily guide](https://sicily.apps.kibk.net) · [Stage 4](https://sicily.apps.kibk.net/#stage/4). Existing private access and disabled tracking are preserved. The current generated guide is in English; old source translations are historical, not deployed.

## Release identity

- Platform: **linux/amd64**
- Image tag: `20260929-facts-guide`
- Image digest: `sha256:a044719bceaccf71f59d077174c106a6bc86c1fde997cecff59921f8567848ca`
- Source: [guide/content.md](guide/content.md)
- Source SHA-256: `7b649c6c82624e961c075b8b39c4889de955b0aa90fc6611e361d63005eb0892`

## Concise presentation

- Removed the visible Sources section, source-download menu entry and checksum footer. Detailed research remains in the repository; the technical `/source.md` endpoint remains available for fidelity checks.
- Shortened stage notes, travel instructions and hotel comparisons. Places are linked by name with brief descriptions; booking prices link to the dated room search.
- Kept essential uncertainties: missing GPX, unbooked stays, supplied price basis, train-ticket validity and late arrival constraints.
- Fixed selected-stage reload scrolling so a direct stage link opens at its map, including after scrolling to the footer.

## Verified

- `/healthz` returned `ok`; homepage returned HTTP 200.
- Live HTML, CSS, JavaScript, route JSON, Leaflet assets and Stage 4 GPX are byte-for-byte identical to the built files.
- Live `/source.md` matches the canonical Markdown and embedded SHA-256.
- All eight stage selections were exercised at 390 px: one correct panel each, no horizontal page overflow; only Stage 4 draws a path.
- Stage 4 direct-link reload after scrolling to the footer was checked at 390 px; the map section opens 12 px below the header. Browser Back, animation toggle and menu Escape were also checked. Desktop and phone layouts were visually inspected. Operating-system reduced-motion support and print styles are implemented; print output was not physically tested.
- The Stage 4 map retains every one of 5,507 GPX points. Download checksum matches the supplied Garmin export.
- Stage 4 Cammarata and Mussomeli town pins are both about 2 m from a track point. Other regional stops are labelled as candidates awaiting their exact GPX.
- Hotel/pass/town destination identities were checked in Google Maps. Rinaldo's duplicate listing ambiguity is addressed with a specific place ID. See [MAP-LINKS.md](../MAP-LINKS.md).
- `/api/dotwatcher` still returns **410**; no tracker request is made by the frontend. Deployment did not enable a public listener or change private DNS.

## Remaining work

Only Stage 4 was supplied: two identical files with the same checksum. Import stages **1, 2, 3, 5, 6, 7 and 8** when their GPX exports are provided; confirm each course's endpoints, direction and privacy before publication. Do not draw guessed routes or replace Fausto's tracks with generic official variants.

Room bookings/price basis, Monday overnight in Modica, Tuesday transport, Catania hotel choices, real train tickets, route conditions and operating hours retain the caveats in the itinerary. Prices are the earlier 29 September research snapshot, not a new checkout quote.
