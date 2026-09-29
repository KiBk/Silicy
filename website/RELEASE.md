# Booked couple stay release — 30 September 2026

Live: [Sicily guide](https://sicily.apps.kibk.net) · [Stage 4](https://sicily.apps.kibk.net/#stage/4). Existing private access and disabled tracking are preserved. The current generated guide is in English; old source translations are historical, not deployed.

## Release identity

- Platform: **linux/amd64**
- Image tag: `20260930-urban-art-booked`
- Image digest: `sha256:d8eb99ca40478697a1b15a314dfb31bf4fae0997d54b197a2b15db1d28efb5b5`
- Source: [guide/content.md](guide/content.md)
- Source SHA-256: `b7e04e0cdfe48c0fd20a085460ca3c788301291e3830382a78b0eadea47cdf9e`

## Booking update

- Catania Centre Urban Art B&B marked booked for 13–17 October, four nights for two adults, on Kirill's report of 30 September. The actual reservation has not been accessed.
- Added verified Google Maps destination/address (Via Androne 66, scala B, fifth floor), host, lift and published check-in/checkout windows. Kept ~4,200 NOK as the earlier quote, not a confirmed total; room/rate conditions and breakfast inclusion await the reservation details.
- Replaced the active couple shortlist with the booked stay. Retained the earlier alternatives in CATANIA-STAY.md as historical research. README, PLAN, CHECKLIST, RESEARCH and MAP-LINKS agree with the new status.
- Early ~03:30 key return and airport transfer remain unconfirmed. The separate cycling night on 11 October remains unbooked.

## Concise presentation

- Removed the visible Sources section, source-download menu entry and checksum footer. Detailed research remains in the repository; the technical `/source.md` endpoint remains available for fidelity checks.
- Shortened stage notes, travel instructions and hotel comparisons. Places are linked by name with brief descriptions; booking prices link to the dated room search.
- Kept essential uncertainties: missing GPX, unbooked stays, supplied price basis, train-ticket validity and late arrival constraints.
- Fixed selected-stage reload scrolling so a direct stage link opens at its map, including after scrolling to the footer.

## Verified

- `/healthz` returned `ok`; homepage returned HTTP 200.
- Live HTML, CSS, JavaScript, route JSON, Leaflet assets and Stage 4 GPX are byte-for-byte identical to the built files.
- Live `/source.md` matches the canonical Markdown and embedded SHA-256.
- The booked-stay section was inspected in desktop and 390 px phone layouts, with no horizontal page overflow; the Maps link resolves to the correct business. Source checks enforce booked couple status, still-unbooked cycling night, removal of the active shortlist and unconfirmed price/early-checkout wording.
- Stage 4 selection and direct-link reload were rechecked at 390 px; the map section opens 12 px below the header. The 29 September release also exercised all eight selections, browser Back, animation toggle and menu Escape. Operating-system reduced-motion support and print styles are implemented; print output was not physically tested.
- The Stage 4 map retains every one of 5,507 GPX points. Download checksum matches the supplied Garmin export.
- Stage 4 Cammarata and Mussomeli town pins are both about 2 m from a track point. Other regional stops are labelled as candidates awaiting their exact GPX.
- Hotel/pass/town destination identities were checked in Google Maps. Rinaldo's duplicate listing ambiguity is addressed with a specific place ID. See [MAP-LINKS.md](../MAP-LINKS.md).
- `/api/dotwatcher` still returns **410**; no tracker request is made by the frontend. Deployment did not enable a public listener or change private DNS.

## Remaining work

Only Stage 4 was supplied: two identical files with the same checksum. Import stages **1, 2, 3, 5, 6, 7 and 8** when their GPX exports are provided; confirm each course's endpoints, direction and privacy before publication. Do not draw guessed routes or replace Fausto's tracks with generic official variants.

Cycling finish-night booking, booked room/rate details and price basis, Monday overnight in Modica, Tuesday transport, early hotel departure/airport pickup, real train tickets, route conditions and operating hours retain the caveats in the itinerary. Prices are earlier quotes, not a new checkout quote or confirmation of the booked total.
