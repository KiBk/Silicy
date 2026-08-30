# Sicily 2026: Divide & Together

Shared planning repository for our Sicily trip from **3–17 October 2026**. The first part is a bike journey with Kirill and Fausto from Modica to Palermo and across the Sicily Divide to Catania. The second part uses Catania as a base for the city, Mount Etna, and the lava coast.

The current public website is [sicily.apps.kibk.net](https://sicily.apps.kibk.net). Its complete static source now lives in [`website/`](website/).

## Start here

- [`PLAN.md`](PLAN.md) — day-by-day itinerary and the reasoning behind it
- [`CHECKLIST.md`](CHECKLIST.md) — decisions, bookings, owners, and deadlines
- [`RESEARCH.md`](RESEARCH.md) — source links, route notes, and facts to reconfirm
- [`website/README.md`](website/README.md) — preview and validate the website locally

## Trip at a glance

| Date | Base / destination | Plan |
|---|---|---|
| 3 Oct | Catania → Modica | Arrive at 17:00, collect bikes, transfer to Modica |
| 4 Oct | Modica | Easy Modica–Scicli–Sampieri warm-up with local route choice |
| 5 Oct | Modica → Catania → Palermo | Ride Fausto's GPX to Catania Centrale, then evening train |
| 6–12 Oct | Palermo → Catania | Seven stages of the Sicily Divide |
| 13 Oct | Catania | Protected recovery and bike-logistics day; reunion in the evening |
| 14 Oct | Catania | Historic centre, market, and long lunch |
| 15 Oct | Mount Etna | Weather-dependent guided day; coast or Taormina fallback |
| 16 Oct | Catania + Aci Castello | Benedettini, Roman Catania, lava coast, pack before dinner |
| 17 Oct | Catania airport | Pre-booked 03:30 transfer for the 06:00 flight |

The cycling chapter is approximately **637 km** with **13,600 m of climbing** over nine riding days, including the warm-up and Modica–Catania connection.

## What is decided—and what is not

The overall sequence and the seven official Sicily Divide stages are the baseline. Hotels, bike transport, the 5 October train, and the Etna booking are still planning items until recorded as confirmed in [`CHECKLIST.md`](CHECKLIST.md).

Timetables, route access, weather, volcanic restrictions, and business opening hours can change. The official links in [`RESEARCH.md`](RESEARCH.md) take precedence over notes copied into this repository. Reconfirm the Catania–Palermo train and assembled-bike carriage 48–72 hours before travel.

## Coordinating changes

Use GitHub issues for questions and individual decisions. Edit the Markdown in a branch and open a pull request for changes that affect dates, routes, or bookings. When a booking becomes real, update its row in [`CHECKLIST.md`](CHECKLIST.md) with the owner, confirmation date, and only a non-sensitive reference—never payment details, passport data, booking codes, private tracking links, or phone numbers.

## Repository layout

```text
.
├── README.md
├── PLAN.md
├── CHECKLIST.md
├── RESEARCH.md
└── website/
    ├── index.html
    ├── app.js
    ├── styles.css
    ├── route-data.js
    └── modica-catania-fausto.gpx
```

This repository is intentionally the exception to the usual shared websites directory: the planning notes and their website travel together here.
