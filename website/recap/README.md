# Sicily recorded-journey recap

GitHub Pages recap at **https://kibk.net/Silicy/**, using the existing `KiBk/Silicy` repository. The pre-trip planning website is unchanged. See [RELEASE.md](RELEASE.md) for verified publication status.

## Preview and checks

```sh
cd website/recap
make check
make serve PORT=8788
```

Open <http://127.0.0.1:8788/>. Serve **only `public/`**, never the repository root or `trip-recap/private/`.

- `content.md` is the canonical source for dates, statistics, hotels, costs and caveats. The renderer preserves its links, copies it byte-for-byte to `public/source.md`, and embeds its SHA-256 in the HTML.
- `scripts/build_data.py` derives public-only geometry from the local recorded rides. A fresh clone can run `make check` and serve the checked-in public assets without private inputs. `make check-private` rebuilds route data and checks it against the locally restored originals; it must never run in public CI with uploaded private inputs.
- `scripts/render_recap.mjs` renders the layout and facts. Edit this file rather than generated HTML.
- `hotel-pins.json` contains six business-listing coordinates plus the user-supplied Lentini address, verified in Google Maps on 15 October. No hotel location is inferred from a ride endpoint.
- `make check` validates syntax, Markdown fidelity, every per-day GPX, the combined GPX, the ZIP, map geometry, stripped image metadata and hashes of the locally reviewed privacy-safe export. `make check-private` additionally verifies photo provenance and the 500 m cut against the originals.

## Implemented

An edge-to-edge, full-viewport map replaces the scrolling landing page. A lightweight floating stage strip sits over the map; there is no document scrolling. The top-right title reads “Sicily Divide” for the whole journey and changes to the stage number and full endpoints on selection. Dates, distance and ascent come from the recorded Garmin figures, validated against the local activity data. No prices appear in the heading. Layer filters, the Open Photos button and all GPX download controls have been removed; the trimmed GPX artifacts remain generated for separate sharing.

All 26 real GPS-located photos and all seven stays remain enabled, including when a stage is selected. Photos appear as day-by-day postcard stacks at island scale, then split into individual pins as you zoom. No GPS positions are invented or moved. Hover or keyboard focus gives a borderless preview; clicking opens the exact pictured thumbnail in one full, chronological 26-image gallery, never a stage/stack subset. Import IDs are assigned in capture-time order and the independent checker verifies that order against private original metadata. The frameless viewer supports previous/next, arrow keys, Escape, mobile swipe and return-to-pin navigation.

Stay pins are bed icons with no prices at any zoom. Popups show the per-person cost and the user-confirmed room arrangement: Gibellina €34.50 shared, Sambuca €35 shared, Santo Stefano €50 separate, Montedoro €42 separate including breakfast, Enna €35 shared, Regalbuto €25 shared, Lentini €65 separate. The €573 accommodation total for two riders is retained in the canonical expense record, not displayed in the map heading. Full source details remain behind the information button. Stage 7 ends in Lentini and Stage 8 starts there, following the actual recordings rather than the Catania plan.

The compact “From the saddle” card changes with the selection: one overall recollection and eight stage-specific notes. The canonical `content.md` contains the complete first-person text. Longer notes expand in place. These are personal recollections, not current road/service guarantees; in particular Leonforte is described as the last bike shop the riders found before Catania. On desktop, route fitting keeps the selected geometry clear of the note card; mobile reserves space above it.

Trackpad zoom uses unsnapped zoom levels, a shorter ordinary-wheel debounce and more responsive wheel scaling. `public/map-gestures.js` adds frame-scheduled WebKit GestureEvent and ctrl+wheel pinch handling using public Leaflet methods, with duplicate-event suppression and deferred photo regrouping until the gesture ends. Native touch handling remains intact, and browser zoom outside the map is untouched. `scripts/check_gestures.mjs` covers direction, sensitivity, bounds, duplicate suppression and touch fallback with a test map. The implementation follows [Leaflet's interaction options](https://leafletjs.com/reference.html#map-wheelpxperzoomlevel), [WebKit GestureEvent](https://developer.apple.com/documentation/webkitjs/gestureevent), and [wheel event semantics](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event). Physical Mac trackpad feel still needs user verification; unit tests do not establish Google Maps-equivalent feel.

Accommodation totals reflect the user's expense record and later corrections: €69, €70, €100, €84, €70, €50 and €130. Santo Stefano is two €50 rooms; Montedoro is two (€38 room + €4 breakfast); Lentini is two rooms at approximately €65 each. The user's Booking share link resolves to B&B Sicily O'Clock Room, listing Via delle Spighe 48. The user confirmed a separate unit at Via Paradiso 3; the Lentini pin uses that actual stay address. Montedoro's pin is the main business listing, not a confirmed assigned building.

The Enna popup records the missed €10 Sicily Divide pass discount. The user confirmed that the Palermo pickup point was closed on Monday 5 October and no pass was collected; the recap uses this actual outcome rather than the earlier planning assumption of arranged early pickup.

## Privacy boundary

Original files, sensor/health fields, timestamps and precise arrival remain in Git-ignored `../../trip-recap/private/`. The eight originals are unchanged. The public copies omit at least **500 metres along the final track**, stopping at the nearest recorded point (500.1 m in this export). This is not a 500 m circular exclusion zone. There is no private endpoint marker or route connecting separate days.

All nine downloadable GPX files and the ZIP contain only retained coordinates/elevations and generic track labels. The map uses the same retained points. Headline statistics still describe the full original rides. The independent checker verifies that the removed coordinate pairs do not occur in another public route, hotel or photo marker.

Real photos were visually reviewed locally and checked against their dates and the route. Web copies omit EXIF, XMP, colour-profile metadata, original filenames, capture timestamps and device identifiers. Only intentionally selected photo GPS coordinates enter the map data. The importer applies an additional 500 m straight-line exclusion around the private finish to photos (separate from the along-track GPX trim); no supplied photo fell inside it. Keep this review process for future imports and never silently snap a questionable photo location to the route.

## Photo import · 16 October 2026

`Photos-1-001.zip` contains 26 HEIC stills and 26 matching MP4 Live Photo companions, verified by their content identifiers. All 26 stills have GPS and local capture timestamps with UTC offsets. Their local dates assign them to stages 1–8: **2, 4, 4, 5, 2, 4, 3, 2** photos respectively. Evening photographs are included with that day's stage even when outside its ride timer. Every pin is within 188 m of the corresponding recorded track, and all are outside the private finish exclusion. No GPS was invented or moved onto the route.

The 52 originals, raw metadata, contact sheets and provenance audit are in Git-ignored `../../trip-recap/private/photos/`. The 26 clips are preserved but are not served or played on the site. `photo-assets.json` holds reviewed map coordinates and web asset paths; titles/descriptions live in `content.md`. The 52 generated WebP files (26 full images, 26 thumbnails) total approximately 12.2 MiB; thumbnails load first, full images on opening the viewer. Full images retain their aspect ratio and are at most 1800 px on the long edge.

Reimport requires Python with Pillow, ExifTool and `heif-convert` from libheif. The bundled Codex dependency runtime supplied Pillow and libheif for this import. From the repository root:

```sh
python3 trip-recap/inspect_photos.py /absolute/path/to/Photos-1-001.zip
# Visually inspect the private contact sheets, reconcile the photo table in content.md,
# and review any privacy/location exceptions before the explicit approval flag below.
cd website/recap
python3 scripts/import_photos.py --reviewed
make check
```

Do not use ZIP modification dates to assign stages. macOS `sips` produced black raster images for this archive despite reporting success; the successful import uses libheif and rejects near-uniform decode results. No originals were changed by either conversion attempt.

OpenStreetMap supplies basemap tiles; those requests disclose the viewed map area and normal browser network metadata to its tile service. There are no analytics, live tracking or account integrations in this recap. GPX files remain usable without map tiles. Leaflet 1.9.4 is vendored, with its license in `public/LICENSE.leaflet.txt`; marked is vendored with its license under `scripts/vendor/`.

## GitHub Pages publication

The repository workflow `.github/workflows/pages.yml` runs public-only checks, rejects stale generated files and deploys only `website/recap/public/` after pushes to `main`. Pull requests run checks without deployment. This project inherits the existing account-level `kibk.net` domain: do not add a CNAME or replace the personal homepage. Keep asset URLs relative so `/Silicy/` and stage hash links work.

Run `make verify` after deployment to compare every public file with the local copy, including the HTML/source checksum, GPX/ZIP and all photos. `reviewed-assets.json` pins the data and photos approved by the independent local privacy review. A failed hash check is not permission to refresh it: rerun the private review first. No originals, private audits or metadata dumps belong in Git or Pages artifacts.

The old Docker/Nginx scaffolding is retained but is not used by this publication. No homelab, registry or DNS changes are required.

## Local verification · 15 October 2026

`make check` passed. Browser checks passed at desktop 1280×720 and mobile 390×844 / 320×740: all eight stage selections and GPX links, route filtering, photo-pin toggle, hotel highlighting/popups (including Lentini and Enna), picture next/previous/Escape, restored stage deep link, and no horizontal page overflow. The downloaded ZIP's contents matched the checked public files. No browser warnings/errors were recorded. This is local verification, not a remote deployment test.

On 16 October, `make check` passed with all 26 real photo pins, per-file image hashes and metadata checks. Desktop and 390 px phone checks covered actual image rendering, all eight stage/photo counts, gallery-to-map navigation, map popup to viewer, previous/next and Escape, and no horizontal page overflow. Raw photo/video inputs remain ignored by Git. Nothing was published.

Later on 16 October, the map-first redesign passed `make check` and browser checks at 1280×800, 390×844 and 320×740. Verified: full-viewport map without page overflow; all eight stage selections, distances, climbing, costs and GPX targets; photo counts 2/4/4/5/2/4/3/2; overview stacks covering all 26 pictures; keyboard-focus previews; direct picture opening and stack navigation; previous/next, arrow keys and Escape; return-to-pin navigation; Enna and Lentini stay popups; layer toggles; scroll-wheel zoom, dragging, fit route and browser-back stage restoration. All eight overview thumbnails loaded. A marker-initialization issue found during development was corrected; the final build produced no new runtime warnings/errors. Touch swipe support is implemented but was not tested on physical phone hardware. The raw inputs, public geometry and final 500.1 m privacy cut are unchanged. No commit, push or deployment was performed.

The subsequent feedback revision passed the source, gesture and privacy checks. Browser verification covered all nine header/note selections, 26 photos and seven stay pins remaining enabled per selection, all seven per-person/room-arrangement popups, removed controls, exact-thumbnail gallery entry, cross-stage navigation in both directions, return-to-pin heading updates, expanded/collapsed notes, and desktop/phone layouts. The 500.1 m finish trim and original files remain unchanged. This is still local-only, with no push or deployment.
