# Stage guides and seven GPX tracks — 3 October 2026

Live: [Sicily guide](https://sicily.apps.kibk.net) · [Along the stage](https://sicily.apps.kibk.net/stages/). Existing private/Tailscale access and disabled tracking are preserved. The current generated guide is in English; old source translations are historical, not deployed.

## Release identity

- Platform: **linux/amd64**
- Image tag: `20261003-stage-guides-v2`
- Image digest: `sha256:c2bd7c36535dc1e8e82f851f364ca990900a6eda7e0dc509d7ed2f13cb401896`
- Source: [guide/content.md](guide/content.md)
- Source SHA-256: `a4be65503bc3d19eaf0dc1e7cbd558482089a4d8c932107f5c2d17a0d110e292`

## Along the stage

- Added eight static, scrollable pages and an index: **25 short cards** with a local story, what to notice, a practical ride note and a Maps button. Each stage map panel links prominently to its page.
- Linked place titles provide background reading without adding a Sources section. The main map remains concise. All place text is rendered mechanically from the canonical Markdown; checks compare every paragraph and link.
- Place jump links, eight-stage navigation, previous/next links and return-to-selected-map links work without JavaScript on the reading pages.
- Verified destination identities and fixed ambiguous Poggioreale, Burgio and Giarratana searches. Added Paternò castle's dated closure notice, optional-detour and access caveats. Details: [PLACES.md](../PLACES.md).

## GPX update

- Imported Kirill's newly downloaded **Stage 1** file unchanged. Its 2,933 points measure 76.950 km; its endpoints were checked as public streets in Palermo and Gibellina Nuova, not private homes. Existing exact stages **2, 3, 4, 6, 7 and 8** are unchanged. The seven tracks preserve all **29,765 points** and original GPX bytes.
- Updated the deterministic [seven-file ZIP](https://sicily.apps.kibk.net/sicily-gpx-available.zip), with a manifest explicitly identifying only missing **Stage 5, Montedoro → Enna**. Kirill reports that this course still cannot be downloaded; no guessed route is drawn.
- Flagged Stage 2's current Garmin figures, **65.76 km / 1,334 m**, against Fausto's planned **71.36 km / 1,430 m**. Planned totals remain unchanged and labelled; ask Fausto to confirm the revision.
- Retained the previously checked Stage 8 public-street endpoints. Its start is north of Stage 7's Duomo finish, so confirm the transfer to the course. New place notes distinguish town context, optional detours and Stage 5's unverified intermediate candidate. Proximity checks are not proof of safe access or riding distance.
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
- Live HTML, CSS, JavaScript, route JSON, Leaflet assets, all seven GPX files, ZIP and all nine guide/index pages are byte-for-byte identical to the built files. Invalid `/stages/99/` returns 404.
- Live `/source.md` matches the canonical Markdown and embedded SHA-256.
- Existing source checks still enforce the booked couple stay, unbooked cycling night, removal of the active shortlist and unconfirmed price/early-checkout wording. Booking details were not researched anew in this release.
- All eight reading pages were tested at 390 px width; Stage 5, Stage 8 and the index were also tested at 320 px without horizontal page overflow. Desktop layouts, place anchors/reload, previous-stage and return-to-map navigation were checked. Live Stage 1 shows its complete 2,933-point polyline and its reading page was checked at 390 px. Local Stage 5 retains town markers only. Browser viewport and the original enabled animation preference were restored.
- All GPX and ZIP HTTP responses were byte-verified. Current ZIP SHA-256: `a8dd3d1de84bc144d7f35749e010059aba77e8194b3daee4ac761842fc220cb8`. The prior release verified browser ZIP saving and found individual GPX navigation blocked by the embedded browser; use the ZIP if that browser limitation persists. This release did not repeat a browser-save test.
- The earlier release exercised menu Escape. Operating-system reduced-motion support and print styles are implemented; print output was not physically tested.
- Representative place proximity was checked against the exact tracks; see [PLACES.md](../PLACES.md). Detours, road conditions, opening and access still require local confirmation.
- Hotel/pass/town destination identities were checked in Google Maps. Rinaldo's duplicate listing ambiguity is addressed with a specific place ID. See [MAP-LINKS.md](../MAP-LINKS.md).
- `/api/dotwatcher` still returns **410**; no tracker request is made by the frontend. Deployment did not enable a public listener or change private DNS.
- The first deployment attempt timed out at the home-LAN SSH address before any remote changes. The final image deployed through the inventory's Tailscale address, with strict checking against the same saved SSH host key. No persistent SSH or access-policy change was made.

## Remaining work

Import **Stage 5** when Fausto supplies an accessible course or GPX export; confirm its endpoints, direction and privacy before publication. Confirm the Stage 2 revision before relying on the shorter export. Do not draw guessed routes or replace Fausto's tracks with generic official variants.

Cycling finish-night booking, booked room/rate details and price basis, Monday overnight in Modica, Tuesday transport, early hotel departure/airport pickup, real train tickets, route conditions and operating hours retain the caveats in the itinerary. Prices are earlier quotes, not a new checkout quote or confirmation of the booked total.
