# Six Garmin GPX tracks release — 30 September 2026

Live: [Sicily guide](https://sicily.apps.kibk.net) · [Stage 4](https://sicily.apps.kibk.net/#stage/4). Existing private access and disabled tracking are preserved. The current generated guide is in English; old source translations are historical, not deployed.

## Release identity

- Platform: **linux/amd64**
- Image tag: `20260930-six-gpx`
- Image digest: `sha256:e9b0db228a01fe082625dcc276544a9cc2e58e64bf321ae0ba1c6f51d3f70306`
- Source: [guide/content.md](guide/content.md)
- Source SHA-256: `1bfb59dd83b3eee37f779c02f3376a0471834193bb0751a94e912415ad48250f`

## GPX update

- Downloaded Garmin courses for stages **2, 3, 4, 6, 7 and 8** through the signed-in course export UI. Stage 4 matches the previously supplied file. Exact maps and downloads preserve all **26,832 points** and original GPX bytes.
- Added a deterministic [six-file ZIP](https://sicily.apps.kibk.net/sicily-gpx-available.zip), with a manifest explicitly identifying missing stages **1 and 5**. Their supplied Garmin links show navigation but no course details/export controls, including after reloads and fresh tabs; the underlying cause is not confirmed.
- Flagged Stage 2's current Garmin figures, **65.76 km / 1,334 m**, against Fausto's planned **71.36 km / 1,430 m**. Planned totals remain unchanged and labelled; ask Fausto to confirm the revision.
- Checked Stage 8's public street start on Via Villini a Mare in Catania and public central Modica finish in Google Maps. The start is north of Stage 7's Duomo finish, so confirm the transfer to the course. No private home endpoint has been added. Other suggested stops remain candidates, not verified on-track stops.
- [ROUTES.md](../ROUTES.md) provides public GitHub download links, provenance and remaining course-access gaps.

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
- Live HTML, CSS, JavaScript, route JSON, Leaflet assets, all six GPX files and ZIP are byte-for-byte identical to the built files.
- Live `/source.md` matches the canonical Markdown and embedded SHA-256.
- The booked-stay section was inspected in desktop and 390 px phone layouts, with no horizontal page overflow; the Maps link resolves to the correct business. Source checks enforce booked couple status, still-unbooked cycling night, removal of the active shortlist and unconfirmed price/early-checkout wording.
- All eight stage selections were tested at desktop and 390 px phone widths without horizontal page overflow: six show exact polylines/download links, while stages 1 and 5 show only town markers. The overview draws six tracks. Phone Stage 8 direct-link reload, browser Back and animation toggle were rechecked; live Stage 6 loads its exact 5,346-point track.
- The ZIP was downloaded through the live browser and its checksum matched the built bundle (`a0166b0db2ee03e9cae35f56fc719d1ee142f6b0397c93c5cec04f1fc7f86431`). All individual GPX HTTP responses were byte-verified; the in-app browser did not save an individual GPX during the click test and blocked a direct GPX navigation. Use the verified ZIP if the embedded browser blocks individual files.
- The earlier release exercised menu Escape. Operating-system reduced-motion support and print styles are implemented; print output was not physically tested.
- Stage 4 Cammarata and Mussomeli town pins are both about 2 m from a track point. Other regional stops remain candidates until their route detours and opening hours are checked.
- Hotel/pass/town destination identities were checked in Google Maps. Rinaldo's duplicate listing ambiguity is addressed with a specific place ID. See [MAP-LINKS.md](../MAP-LINKS.md).
- `/api/dotwatcher` still returns **410**; no tracker request is made by the frontend. Deployment did not enable a public listener or change private DNS.

## Remaining work

Import stages **1 and 5** when Fausto supplies accessible courses or GPX exports; confirm each course's endpoints, direction and privacy before publication. Confirm the Stage 2 revision before relying on the shorter export. Do not draw guessed routes or replace Fausto's tracks with generic official variants.

Cycling finish-night booking, booked room/rate details and price basis, Monday overnight in Modica, Tuesday transport, early hotel departure/airport pickup, real train tickets, route conditions and operating hours retain the caveats in the itinerary. Prices are earlier quotes, not a new checkout quote or confirmation of the booked total.
