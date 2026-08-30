const cityDays = [
  { date: "Tue 13", number: "13", from: "Arrival evening", to: "Reunion + dinner", meta: "Easy", note: "Keep the night unscheduled: airport pickup, check-in and a late dinner around Via Etnea or Piazza Duomo." },
  { date: "Wed 14", number: "14", from: "Baroque Catania", to: "Markets + history", meta: "Walk", note: "Piazza Duomo, La Pescheria, Via Crociferi and Castello Ursino, with time for granita and a long lunch." },
  { date: "Thu 15", number: "15", from: "Mount Etna", to: "Active day outside", meta: "Weather gate", note: "Reserve a guided Etna hike or transfer. Keep a coast or Taormina alternative if volcano access or weather changes." },
  { date: "Fri 16", number: "16", from: "Benedettini + coast", to: "Aci Castello sunset", meta: "Pack early", note: "Tour the Monastero dei Benedettini and Roman theatre, then finish by the sea. Pack before dinner for the early flight." },
  { date: "Sat 17", number: "17", from: "Catania airport", to: "06:00 flight", meta: "03:30 pickup", note: "Pre-book the airport transfer; leave the centre around 03:30 and keep the final night close to the route out." }
];

const cityPlaces = [
  { name: "Piazza Duomo", coordinates: [37.5023, 15.0873], copy: "Historic centre and evening anchor." },
  { name: "La Pescheria", coordinates: [37.5015, 15.0875], copy: "Morning fish market." },
  { name: "Castello Ursino", coordinates: [37.4996, 15.0840], copy: "Civic museum in a 13th-century castle." },
  { name: "Monastero dei Benedettini", coordinates: [37.5045, 15.0805], copy: "Baroque monastery and guided visit." },
  { name: "Rifugio Sapienza · Etna", coordinates: [37.7008, 14.9984], copy: "Weather-dependent active day." },
  { name: "Aci Castello", coordinates: [37.5559, 15.1455], copy: "Lava coast and sunset." },
  { name: "Catania Airport", coordinates: [37.4668, 15.0664], copy: "06:00 departure on 17 October." }
];

const warmupRoute = [
  [36.8586, 14.7608], [36.8230, 14.7440], [36.7903, 14.7040],
  [36.7500, 14.7120], [36.7256, 14.7380], [36.7540, 14.7860],
  [36.8060, 14.8020], [36.8586, 14.7608]
];

const rideStages = [
  {
    id: "warmup", number: "W", date: "SUN 04", type: "SUGGESTED WARM-UP", title: "Modica → Scicli → Sampieri → Modica",
    metric1: "≈ 50 km", metric2: "≈ 800 m+", metric3: "Easy pace", routeType: "warmup",
    caption: "Suggested outline only · choose the exact quiet roads with Fausto",
    sourceLink: "https://www.google.com/maps/dir/?api=1&origin=Modica%2C%20Italy&destination=Modica%2C%20Italy&travelmode=bicycling&waypoints=Scicli%2C%20Italy%7CSampieri%2C%20Italy",
    sourceLabel: "Open suggested outline ↗",
    history: "Modica and Scicli belong to the late-Baroque landscape rebuilt after the 1693 earthquake. This loop moves from Modica’s limestone hills to Scicli’s ceremonial streets and the Mediterranean at Sampieri without spending your legs before Monday.",
    caution: "The line on this map is a suggested outline, not a checked GPX. Ask Fausto to choose the quietest local roads and shorten it if the bikes need adjustment.",
    stay: "Sleep in Modica both Saturday and Sunday. Prioritise secure assembled-bike storage and an early breakfast on Monday.",
    stops: [
      { name: "Duomo di San Giorgio", kind: "See", coordinates: [36.8605, 14.7607], copy: "Modica’s dramatic Baroque staircase and a natural start/finish landmark." },
      { name: "Via Mormina Penna · Scicli", kind: "Coffee", coordinates: [36.7904, 14.7042], copy: "Walk the UNESCO-listed Baroque street and refill before the coast." },
      { name: "Sampieri seafront", kind: "Lunch", coordinates: [36.7256, 14.7380], copy: "Sea-level pause; add the Fornace Penna viewpoint only if time and access allow." }
    ]
  },
  {
    id: "modica", number: "M", date: "MON 05", type: "FAUSTO’S GPX · TRAIN DAY", title: "Modica → Catania Centrale",
    metric1: "117.9 km", metric2: "1,431 m+", metric3: "17:32 train", routeType: "modica",
    caption: "Monday’s bike line only · leave Fausto’s GPX at Catania Centrale, then take the train to Palermo",
    sourceLink: "/modica-catania-fausto.gpx", sourceLabel: "Download Fausto’s original GPX ↓",
    history: "The track climbs out of Modica across the Hyblaean plateau, reaches its high point near Buccheri, then descends through the agricultural plain around Lentini before entering Catania. It passes within roughly 100 metres of Catania Centrale before continuing north to its recorded endpoint.",
    caution: "Start at 06:00 and target Catania Centrale by 15:30–16:00. The current candidate is direct R 5519, 17:32–20:29, with bicycle carriage in RFI’s planned timetable. Reconfirm 48–72 hours before travel; a replacement bus may not take assembled bikes.",
    stay: "The train is part of this Monday chapter but is intentionally not drawn as a GPX. Check in near Palermo Centrale around 21:00 and tell the hotel that two assembled bikes are arriving.",
    stops: [
      { name: "Giarratana", kind: "Water", coordinates: [37.0523, 14.8081], copy: "The track passes close to town after the first sustained climbing; refill early." },
      { name: "Buccheri", kind: "Lunch", coordinates: [37.1245, 14.8502], copy: "Near the route high point at roughly 60 km; make this the main food stop." },
      { name: "Lentini", kind: "Refill", coordinates: [37.2870, 14.9947], copy: "Last substantial town before the Catania approach." },
      { name: "Catania Centrale", kind: "Finish", coordinates: [37.5067, 15.0988], copy: "Leave the GPX here, clean up, buy food and board with time to spare." }
    ]
  },
  {
    id: "divide1", number: "01", date: "TUE 06", type: "SICILY DIVIDE · STAGE 1", title: "Palermo → Gibellina",
    metric1: "79 km", metric2: "1,394 m+", metric3: "Medium-hard", routeType: "official", officialIndex: 0,
    caption: "Official Palermo variant · Conca d’Oro climb, Monreale and the SP20",
    sourceLink: "https://sicilydivide.it/tappe-e-traccia-sicily-divide/da-palermo-a-gibellina-in-bici/", sourceLabel: "Official stage guide ↗",
    history: "The route leaves Palermo through the Conca d’Oro, passes Norman Monreale and enters the Belìce interior. Gibellina was rebuilt as a city of contemporary art after the 1968 earthquake destroyed the old town.",
    caution: "The official guide warns that the SP12 before Gibellina becomes sticky clay after rain. Use the road-bike alternative if the ground is wet.",
    stay: "Nuova Gibellina centre. Book a Sicily Divide bike hotel and leave enough evening light to see the town’s open-air art.",
    stops: [
      { name: "Monreale Cathedral", kind: "See", coordinates: [38.0814, 13.2895], copy: "UNESCO Norman mosaics around kilometre 9; secure the bikes and go inside on foot." },
      { name: "San Giuseppe Jato", kind: "Water", coordinates: [37.9731, 13.1881], copy: "Refill around kilometre 28 near the Jato archaeological landscape." },
      { name: "Camporeale", kind: "Lunch", coordinates: [37.8980, 13.0940], copy: "Wine-country food stop before the final run to Gibellina." },
      { name: "Nuova Gibellina", kind: "Finish", coordinates: [37.8073, 12.8690], copy: "Contemporary art, earthquake memory and the first overnight." }
    ]
  },
  {
    id: "divide2", number: "02", date: "WED 07", type: "SICILY DIVIDE · STAGE 2", title: "Gibellina → Sambuca di Sicilia",
    metric1: "71 km", metric2: "1,428 m+", metric3: "Belìce", routeType: "official", officialIndex: 1,
    caption: "Earthquake landscape · Cretto di Burri, Poggioreale and Sambuca",
    sourceLink: "https://sicilydivide.it/tappe-e-traccia-sicily-divide/da-gibellina-a-sambuca-in-bici/", sourceLabel: "Official stage guide ↗",
    history: "This is the memory stage of the 1968 Belìce earthquake: the concrete Cretto preserves Old Gibellina’s street plan, while Poggioreale remains a ruined town. Sambuca’s older layers reach back to Arab Sicily.",
    caution: "Do not enter closed or unstable ruins. Carry water between towns and treat heritage stops as short pauses—the climbing still exceeds 1,400 metres.",
    stay: "Sambuca historic centre, ideally close to Corso Umberto I. Reserve secure bike storage before arrival.",
    stops: [
      { name: "Cretto di Burri", kind: "History", coordinates: [37.7257, 13.0060], copy: "Land-art memorial laid over the street plan of destroyed Old Gibellina." },
      { name: "Poggioreale ruins", kind: "View", coordinates: [37.7640, 13.0030], copy: "See the abandoned town only from legal, safe access points." },
      { name: "Santa Margherita di Belice", kind: "Lunch", coordinates: [37.6920, 13.0220], copy: "Reliable mid-stage town for food and bottles." },
      { name: "Sambuca di Sicilia", kind: "Finish", coordinates: [37.6516, 13.1149], copy: "Evening walk through the Saracen lanes and historic centre." }
    ]
  },
  {
    id: "divide3", number: "03", date: "THU 08", type: "SICILY DIVIDE · STAGE 3", title: "Sambuca → Santo Stefano Quisquina",
    metric1: "59 km", metric2: "1,393 m+", metric3: "17.8% max", routeType: "official", officialIndex: 2,
    caption: "Abandoned railway, Burgio craft traditions and the Quisquina forests",
    sourceLink: "https://sicilydivide.it/tappe-e-traccia-sicily-divide/da-sambuca-di-sicilia-a-santo-stefano-quisquina-in-bici/", sourceLabel: "Official stage guide ↗",
    history: "Part of the stage follows the abandoned Castelvetrano–Burgio railway. San Carlo tells a story of railway decline and depopulation; Burgio preserves ceramics and bell-making traditions before the route climbs toward the Quisquina forests.",
    caution: "The official guide reports no food at San Carlo. Carry enough from Sambuca and make Burgio the dependable resupply.",
    stay: "Santo Stefano Quisquina. Book early; after arrival, keep any Quisquina hermitage visit short enough for recovery.",
    stops: [
      { name: "San Carlo", kind: "History", coordinates: [37.6280, 13.1770], copy: "Tiny former railway junction; interesting, but do not count on food." },
      { name: "Burgio", kind: "Lunch", coordinates: [37.6005, 13.2910], copy: "Ceramics, bell-making and the first reliable main stop around kilometre 24." },
      { name: "Villafranca Sicula", kind: "Water", coordinates: [37.5860, 13.4340], copy: "Short refill before the final climbing." },
      { name: "Santo Stefano Quisquina", kind: "Finish", coordinates: [37.6256, 13.4898], copy: "Green hill town linked to the pilgrimage of Santa Rosalia." }
    ]
  },
  {
    id: "divide4", number: "04", date: "FRI 09", type: "SICILY DIVIDE · STAGE 4", title: "Santo Stefano Quisquina → Montedoro",
    metric1: "62 km", metric2: "1,479 m+", metric3: "Mussomeli", routeType: "official", officialIndex: 3,
    caption: "Cammarata crossroads, Mussomeli castle country and Montedoro’s sulfur history",
    sourceLink: "https://sicilydivide.it/tappe-e-traccia-sicily-divide/da-santo-stefano-quisquina-a-montedoro-in-bici/", sourceLabel: "Official stage guide ↗",
    history: "The route crosses the Cammarata–San Giovanni Gemini cycling crossroads, climbs to Mussomeli’s medieval landscape and ends in Montedoro, whose modern identity is inseparable from Sicily’s sulfur mines.",
    caution: "The stage guide calls this one of the less technical days, but the total climbing is still substantial. Keep time for the roughly 10 km ascent toward Mussomeli.",
    stay: "Montedoro has limited supply. Confirm dinner and a bike-safe room before leaving Santo Stefano.",
    stops: [
      { name: "Cammarata", kind: "Workshop", coordinates: [37.6330, 13.6320], copy: "Food, water and the best-positioned bike workshop around kilometre 18." },
      { name: "Mussomeli", kind: "Lunch", coordinates: [37.5800, 13.7500], copy: "Bar Tio Pepe is an official checkpoint; the Manfredonic castle is the history stop." },
      { name: "Montedoro", kind: "Finish", coordinates: [37.4547, 13.8167], copy: "Sulfur-mining landscape, small-town evening and early rest." }
    ]
  },
  {
    id: "divide5", number: "05", date: "SAT 10", type: "SICILY DIVIDE · STAGE 5", title: "Montedoro → Enna",
    metric1: "70 km", metric2: "1,705 m+", metric3: "Hardest", routeType: "official", officialIndex: 4,
    caption: "Sulfur country, Caltanissetta and the final climb to high Enna",
    sourceLink: "https://sicilydivide.it/tappe-e-traccia-sicily-divide/da-montedoro-a-enna-in-bici/", sourceLabel: "Official stage guide ↗",
    history: "The hardest official stage links the former sulfur district with Enna, Sicily’s high interior capital. A long climb reaches Caltanissetta, a long descent reaches Borgo Cascino, and the day ends with a short, severe climb into Enna.",
    caution: "Start fed and carry reserve calories after Caltanissetta. Borgo Cascino is tiny and should not be treated as a guaranteed service stop.",
    stay: "Enna historic centre. A short evening walk toward Castello di Lombardia is worthwhile only after food, laundry and bike checks.",
    stops: [
      { name: "Serradifalco", kind: "Water", coordinates: [37.4540, 13.8800], copy: "First practical refill around kilometre 12.5." },
      { name: "Caltanissetta", kind: "Lunch", coordinates: [37.4900, 14.0600], copy: "Main food, checkpoint and repair opportunity around kilometre 34." },
      { name: "Borgo Cascino", kind: "History", coordinates: [37.5300, 14.1600], copy: "A tiny planned rural settlement; observe, but carry your own supplies." },
      { name: "Enna", kind: "Finish", coordinates: [37.5676, 14.2792], copy: "High-city finish at over 900 metres; expect a cooler evening." }
    ]
  },
  {
    id: "divide6", number: "06", date: "SUN 11", type: "SICILY DIVIDE · STAGE 6", title: "Enna → Regalbuto",
    metric1: "63 km", metric2: "1,211 m+", metric3: "Gravel", routeType: "official", officialIndex: 5,
    caption: "Lago Nicoletti, Leonforte produce and the medieval eastern interior",
    sourceLink: "https://sicilydivide.it/tappe-e-traccia-sicily-divide/da-enna-a-regalbuto-in-bici/", sourceLabel: "Official stage guide ↗",
    history: "After leaving high Enna, the route passes Lago Nicoletti and Leonforte, known for black lentils and fruit protected in paper bags. The stage continues through old inland settlements toward Regalbuto, once a station on Arab-era routes.",
    caution: "There are unpaved sections. The official guide lists Leonforte as the strongest food and repair stop; do not rely on every small settlement being open on Sunday.",
    stay: "Regalbuto centre. Confirm Sunday dinner in advance and keep the final-day kit ready before sleeping.",
    stops: [
      { name: "Lago Nicoletti", kind: "Pause", coordinates: [37.5900, 14.3820], copy: "Quick water-view stop between Enna and Leonforte." },
      { name: "Leonforte", kind: "Lunch", coordinates: [37.6400, 14.4000], copy: "Panini, local produce and the stage’s listed mechanical assistance." },
      { name: "Agira", kind: "View", coordinates: [37.6600, 14.5200], copy: "Historic hill town on the eastern interior approach." },
      { name: "Regalbuto", kind: "Finish", coordinates: [37.6510, 14.6392], copy: "Final overnight before the descent toward Catania." }
    ]
  },
  {
    id: "divide7", number: "07", date: "MON 12", type: "SICILY DIVIDE · STAGE 7", title: "Regalbuto → Catania",
    metric1: "61 km", metric2: "699 m+", metric3: "Finish", routeType: "official", officialIndex: 6,
    caption: "Orange groves, Etna views and the finish at Catania",
    sourceLink: "https://sicilydivide.it/tappe-e-traccia-sicily-divide/da-regalbuto-a-catania-in-bici/", sourceLabel: "Official stage guide ↗",
    history: "The final stage leaves the old Saracen stopping place of Regalbuto, runs through orchards and Etna-facing countryside, and returns to the Baroque city of Catania. The official route is mostly secondary, rural and gravel roads with more descending than climbing.",
    caution: "Urban traffic is the final hazard. Stay on the current official GPX and avoid relaxing concentration until the finish.",
    stay: "Catania—use the same hotel booked for the sightseeing chapter if possible. Arrange bike shipping or storage immediately after arrival.",
    stops: [
      { name: "Centuripe", kind: "View", coordinates: [37.6200, 14.7400], copy: "Etna-facing hill-town viewpoint; stop only if the day remains on schedule." },
      { name: "Paternò", kind: "Refill", coordinates: [37.5700, 14.9000], copy: "Last easy food and water stop before the urban approach." },
      { name: "Piazza Duomo · Catania", kind: "Finish", coordinates: [37.5023, 15.0873], copy: "Photograph the finish, then handle bikes before celebrating." }
    ]
  },
  {
    id: "rest", number: "R", date: "TUE 13", type: "PROTECTED REST · REUNION", title: "Catania rest day",
    metric1: "0 km", metric2: "Laundry", metric3: "Evening arrival", routeType: "rest",
    caption: "No riding target · bike handoff, recovery and a clean finish for Kirill and Fausto",
    sourceLink: "https://turismo.comune.catania.it/scoprire-catania/", sourceLabel: "Official Catania guide ↗",
    history: "This is not spare mileage. It protects the route from one delayed stage and gives Kirill and Fausto a calm day to close the ride properly.",
    caution: "Finish bike shipping, laundry and hotel changes before late afternoon. Keep the rest of the day deliberately light.",
    stay: "Move once, if needed, into the central Catania hotel used through the 17 October departure.",
    stops: [
      { name: "Villa Bellini", kind: "Recover", coordinates: [37.5150, 15.0830], copy: "Gentle shaded walk if the legs want movement." },
      { name: "La Playa", kind: "Pause", coordinates: [37.4800, 15.0850], copy: "Optional sea-level recovery; avoid turning it into another itinerary." },
      { name: "Piazza Duomo", kind: "Evening", coordinates: [37.5023, 15.0873], copy: "A simple final dinner anchor for Kirill and Fausto." }
    ]
  }
];

const rideMilestones = [
  { date: "Sat 03", number: "03", from: "17:00 Catania arrival", to: "Transfer to Modica", meta: "No Sunday train", note: "Collect the shipped bikes, travel to Fausto’s hometown and sleep in Modica. Do not spend Sunday moving across the island." },
  { date: "Sun 04", number: "04", from: "Modica", to: "Warm-up loop", meta: "≈ 50 km", note: "Use Scicli and Sampieri as the flexible outline. The purpose is bike setup, local roads and an easy social day." },
  { date: "Mon 05", number: "05", from: "06:00 Modica", to: "Catania + 17:32 train", meta: "The hinge", note: "Ride Fausto’s GPX to Catania Centrale, leave the track at the station and take the current candidate direct train to Palermo." },
  { date: "Tue–Mon", number: "06–12", from: "Palermo", to: "Seven-stage Divide", meta: "7 days", note: "Ride the classic Palermo variant without compressing stages: Gibellina, Sambuca, Santo Stefano, Montedoro, Enna, Regalbuto, Catania." },
  { date: "Tue 13", number: "13", from: "Catania", to: "Rest + bike handoff", meta: "Protected", note: "Kirill and Fausto use the day for recovery, laundry and closing the bike logistics." }
];

const phases = {
  ride: {
    hero: {
      kicker: "03–13 OCT · KIRILL + FAUSTO",
      title: "Modica first.<br><em>Across the island.</em>",
      lede: "Kirill and Fausto start in Modica, ride Fausto’s track to Catania, take Monday’s bike-friendly train to Palermo, then cross the island together.",
      action: "Choose a stage",
      official: "Official track ↗"
    },
    stats: [["Distance", "≈ 637", "km"], ["Climbing", "≈ 13.6k", "m+"], ["Ride days", "9", "days"]],
    map: {
      kicker: "PRESS A DAY · SEE ITS REAL LINE",
      title: "Every stage has a story",
      copy: "Select a day to isolate its route, useful stops, overnight base and the history under your wheels. Fausto’s uploaded track and the official Sicily Divide GPX are preserved separately."
    },
    schedule: {
      kicker: "03–13 OCT · THE NEW RHYTHM",
      title: "Modica first, rest on the 13th",
      copy: "The Monday train is the hinge: finish Fausto’s GPX at Catania Centrale, travel to Palermo that evening, and begin the seven-day Divide on Tuesday."
    },
    logistics: {
      kicker: "THE MONDAY TRAIN GATE",
      title: "Ride early. Board calmly.",
      copy: "The uploaded GPX fits the plan because it passes Catania Centrale before its final endpoint. The timetable must still be reconfirmed close to travel.",
      actions: [
        ["01", "Saturday to Modica", "After the 17:00 landing, collect the bikes and transfer directly to Fausto’s hometown. Keep both Modica nights bike-safe."],
        ["02", "Monday 06:00 start", "The route to Catania Centrale is 117.9 km with about 1,431 m climbing. Target the station by 15:30–16:00."],
        ["03", "Candidate R 5519", "RFI currently lists a direct 17:32 Catania Centrale → 20:29 Palermo Centrale train with bicycle carriage in the planned June–December timetable."],
        ["04", "Train fallback", "Recheck 48–72 hours before departure. If the service becomes a replacement bus, use a pre-booked bike shuttle rather than assuming assembled bikes will fit."],
        ["05", "Protect 13 October", "Finish the Divide on Monday 12 October. Kirill and Fausto keep Tuesday for bike shipping, laundry and recovery." ]
      ]
    }
  },
  watch: {
    hero: {
      kicker: "LIVE RIDE · PALERMO TO CATANIA",
      title: "Follow the dots.<br><em>Across Sicily.</em>",
      lede: "A first dotwatcher shell for the official Palermo–Catania line. It is ready for approved rider feeds, but it will never invent a position when Garmin data is absent.",
      action: "Open dotwatcher",
      official: "How Garmin LiveTrack works ↗"
    },
    stats: [["Course", "≈ 465", "km"], ["Riders", "2", "pending"], ["Refresh", "60", "sec"]],
    map: {
      kicker: "PALERMO → CATANIA · LIVE VIEW DRAFT",
      title: "The course is ready. The dots wait.",
      copy: "The official Divide line, start and finish are already mapped. Rider positions remain empty until you provide consented Garmin sharing links and we connect a server-side collector.",
      caption: "Official course · Palermo start · Catania finish · no live rider signal connected",
      link: "https://support.garmin.com/en-AU/?faq=HbqxxbiBGA3mDhlLX4GUw8&topicTag=region_livetrack",
      linkText: "Garmin LiveTrack requirements ↗"
    },
    schedule: {
      kicker: "FIRST ITERATION · NO FAKE POSITIONS",
      title: "A tracker designed for real signals",
      copy: "Once rider sources are approved, a small collector should normalize them into one safe JSON feed for this static website."
    },
    logistics: {
      kicker: "GARMIN CONNECTION",
      title: "What we still need",
      copy: "Garmin Connect LiveTrack shares an active session and normally relies on the rider’s paired phone and mobile signal. A username by itself is not a public tracking API.",
      actions: [
        ["01", "Rider consent", "For each rider, provide the display name and the sharing method they explicitly want published."],
        ["02", "Test LiveTrack", "Before Sicily, start a real Garmin LiveTrack activity with the phone connected and confirm that the intended spectator can open it."],
        ["03", "Collector adapter", "Connect an approved source to a server-side adapter. The browser should receive only latitude, longitude, timestamp, distance and status."],
        ["04", "Signal rules", "Mark a dot stale after a defined interval and never move it using estimates. Mobile gaps in the Sicilian interior are expected."],
        ["05", "Race-day privacy", "Publish only during the trip window, retain the minimum data and provide a clear switch to stop sharing." ]
      ]
    }
  },
  city: {
    hero: {
      kicker: "13–17 OCT · TOGETHER IN CATANIA",
      title: "Volcano mornings.<br><em>Slow city nights.</em>",
      lede: "Your girlfriend arrives Tuesday evening. That leaves three complete days for Catania, Etna and the lava coast before the 06:00 flight home.",
      action: "See the city plan",
      official: "Official city guide ↗"
    },
    stats: [["Full days", "3", "together"], ["City base", "1", "hotel"], ["Flight home", "06:00", "17 Oct"]],
    map: {
      kicker: "CATANIA · ETNA · LAVA COAST",
      title: "One hotel, three directions",
      copy: "Stay centrally and use Catania as the anchor: one historic walking day, one Etna day and one flexible city-to-coast day.",
      caption: "Girlfriend arrives 13 October evening · three full days · pre-book 03:30 airport transfer for 17 October",
      link: "https://www.google.com/maps/dir/?api=1&origin=Piazza+del+Duomo%2C+Catania&destination=Aci+Castello%2C+Catania&travelmode=driving&waypoints=Monastero+dei+Benedettini%2C+Catania%7CRifugio+Sapienza%2C+Nicolosi",
      linkText: "Open Catania plan in Google Maps ↗"
    },
    schedule: {
      kicker: "13–17 OCT · THREE FULL DAYS",
      title: "Active days, no hotel hopping",
      copy: "The plan alternates a walking day, a weather-gated Etna day and a flexible culture-and-coast finish."
    },
    logistics: {
      kicker: "CATANIA HANDOFF",
      title: "Make the reunion effortless",
      copy: "The cycling logistics should be finished before Tuesday evening so this chapter starts with one hotel and no bike admin.",
      actions: [
        ["01", "Central hotel", "Choose the Piazza Duomo–Via Etnea area for walkability, restaurants and an easy airport pickup."],
        ["02", "Girlfriend arrival", "Keep 13 October evening free and share the exact hotel and transfer plan before departure."],
        ["03", "Etna booking", "Reserve a cancellable guided trip for 15 October; confirm weather, access restrictions and required footwear the day before."],
        ["04", "Friday packing", "Pack before the final dinner on 16 October. The early departure leaves no useful morning margin."],
        ["05", "03:30 airport transfer", "Pre-book a taxi or private transfer for the 06:00 flight on 17 October." ]
      ]
    }
  }
};

const pathLocale = location.pathname === "/ru" || location.pathname.startsWith("/ru/") ? "ru" : location.pathname === "/it" || location.pathname.startsWith("/it/") ? "it" : null;
const locale = pathLocale || (["ru", "it"].includes(new URLSearchParams(location.search).get("lang")) ? new URLSearchParams(location.search).get("lang") : "en");

const ui = {
  en: {
    skip: "Skip to the plan", print: "Print", refsKicker: "PRIMARY REFERENCES", refsTitle: "Keep the plan fresh.",
    footer: "Planning version · 22 July 2026 · Official route data remains authoritative.", backTop: "Back to top ↑",
    phase: { ride: "Sicily Divide", watch: "Dotwatcher", city: "Catania together" }, selected: "Selected day",
    planning: "Planning note", overnight: "Overnight / handoff", stops: "STOPS WORTH MAKING",
    watchPending: "NOT CONNECTED", watchPendingCopy: "Awaiting approved Garmin rider sources", noPosition: "No position yet",
    courseOnly: "Course only", start: "START", finish: "FINISH"
  },
  ru: {
    skip: "Перейти к плану", print: "Печать", refsKicker: "ОСНОВНЫЕ ИСТОЧНИКИ", refsTitle: "Проверяйте план перед поездкой.",
    footer: "Версия плана · 22 июля 2026 · Официальные данные маршрута имеют приоритет.", backTop: "Наверх ↑",
    phase: { ride: "Sicily Divide", watch: "Дотвотчер", city: "Катания вместе" }, selected: "Выбранный день",
    planning: "Важно для планирования", overnight: "Ночёвка / пересадка", stops: "ГДЕ СТОИТ ОСТАНОВИТЬСЯ",
    watchPending: "НЕ ПОДКЛЮЧЕНО", watchPendingCopy: "Ожидаются разрешённые источники Garmin", noPosition: "Позиции пока нет",
    courseOnly: "Только маршрут", start: "СТАРТ", finish: "ФИНИШ"
  },
  it: {
    skip: "Vai al programma", print: "Stampa", refsKicker: "FONTI PRINCIPALI", refsTitle: "Tieni aggiornato il piano.",
    footer: "Versione del piano · 22 luglio 2026 · I dati ufficiali del percorso restano la fonte autorevole.", backTop: "Torna su ↑",
    phase: { ride: "Sicily Divide", watch: "Dotwatcher", city: "Catania insieme" }, selected: "Giorno selezionato",
    planning: "Nota di pianificazione", overnight: "Pernottamento / passaggio", stops: "SOSTE CHE VALGONO LA PENA",
    watchPending: "NON COLLEGATO", watchPendingCopy: "In attesa delle fonti Garmin autorizzate", noPosition: "Nessuna posizione disponibile",
    courseOnly: "Solo percorso", start: "PARTENZA", finish: "ARRIVO"
  }
};

const ruPhases = {
  ride: {
    hero: { kicker: "3–13 ОКТ · КИРИЛЛ + ФАУСТО", title: "Сначала Модика.<br><em>Затем через весь остров.</em>", lede: "Кирилл и Фаусто стартуют в Модике, едут по треку Фаусто до Катании, вечером в понедельник садятся с велосипедами на поезд до Палермо, а затем вместе пересекают Сицилию.", action: "Выбрать этап", official: "Официальный трек ↗" },
    stats: [["Дистанция", "≈ 637", "км"], ["Набор", "≈ 13,6 тыс.", "м+"], ["Ходовых дней", "9", "дней"]],
    map: { kicker: "ВЫБЕРИТЕ ДЕНЬ · УВИДЬТЕ ЕГО ЛИНИЮ", title: "Каждый этап — часть истории", copy: "Дни соединены по порядку от первого до последнего. Выберите этап, чтобы увидеть только его трек, остановки, ночёвку и контекст мест, через которые проходит дорога." },
    schedule: { kicker: "3–13 ОКТ · НОВЫЙ РИТМ", title: "Сначала Модика, 13-го — отдых", copy: "Понедельник объединяет велоэтап и поезд: заканчиваем трек Фаусто у Catania Centrale, вечером едем в Палермо, во вторник начинаем семидневный Divide." },
    logistics: { kicker: "КЛЮЧЕВОЙ ПОЕЗД В ПОНЕДЕЛЬНИК", title: "Выезжаем рано. Садимся спокойно.", copy: "Загруженный GPX проходит рядом с Catania Centrale. Расписание и провоз двух собранных велосипедов нужно перепроверить ближе к поездке.", actions: [
      ["01", "В субботу — в Модику", "После посадки в 17:00 забираем велосипеды и сразу едем к Фаусто. Обе ночи в Модике — с безопасным хранением велосипедов."],
      ["02", "Старт в понедельник в 06:00", "До Catania Centrale — 117,9 км и около 1431 м набора. Цель — приехать к 15:30–16:00."],
      ["03", "Предварительно R 5519", "Сейчас RFI показывает прямой поезд 17:32 Катания → 20:29 Палермо с местом для велосипедов."],
      ["04", "Запасной вариант", "Перепроверить за 48–72 часа. Если поезд заменят автобусом, заранее заказать велотрансфер: собранные велосипеды могут не принять."],
      ["05", "Сохранить 13 октября", "Финиш Divide — 12 октября. Кирилл и Фаусто оставляют вторник на отправку велосипедов, стирку и восстановление."]
    ] }
  },
  watch: {
    hero: { kicker: "В ПУТИ · ПАЛЕРМО → КАТАНИЯ", title: "Следим за точками.<br><em>Через всю Сицилию.</em>", lede: "Первая версия дотвотчера для официального маршрута Палермо–Катания. Она готова к разрешённым данным участников и никогда не придумывает позицию при отсутствии сигнала Garmin.", action: "Открыть дотвотчер", official: "Как работает Garmin LiveTrack ↗" },
    stats: [["Маршрут", "≈ 465", "км"], ["Участники", "2", "ожидаются"], ["Обновление", "60", "сек"]],
    map: { kicker: "ПАЛЕРМО → КАТАНИЯ · МАКЕТ LIVE", title: "Маршрут готов. Точки ждут.", copy: "Официальная линия Divide, старт и финиш уже нанесены. Позиции останутся пустыми, пока вы не дадите разрешённые ссылки Garmin и мы не подключим серверный сборщик.", caption: "Официальный маршрут · старт в Палермо · финиш в Катании · live-сигнал не подключён", link: "https://support.garmin.com/en-AU/?faq=HbqxxbiBGA3mDhlLX4GUw8&topicTag=region_livetrack", linkText: "Требования Garmin LiveTrack ↗" },
    schedule: { kicker: "ПЕРВАЯ ВЕРСИЯ · БЕЗ ВЫДУМАННЫХ ПОЗИЦИЙ", title: "Трекер для реальных сигналов", copy: "После согласования источников небольшой серверный сборщик приведёт данные к одному безопасному JSON-каналу для статического сайта." },
    logistics: { kicker: "ПОДКЛЮЧЕНИЕ GARMIN", title: "Что ещё нужно", copy: "Garmin Connect LiveTrack передаёт активную сессию и обычно зависит от связанного телефона и мобильной сети. Одного имени пользователя недостаточно.", actions: [
      ["01", "Согласие участников", "Для каждого участника нужны отображаемое имя и явно одобренный способ публикации позиции."],
      ["02", "Проверка LiveTrack", "До поездки запустить настоящее занятие Garmin LiveTrack со связанным телефоном и проверить ссылку зрителя."],
      ["03", "Адаптер-сборщик", "Сервер отдаёт браузеру только широту, долготу, время, дистанцию и статус."],
      ["04", "Правила сигнала", "Помечать точку устаревшей после заданного времени и никогда не достраивать движение догадками."],
      ["05", "Приватность", "Публиковать только во время поездки, хранить минимум данных и предусмотреть понятное отключение."]
    ] }
  },
  city: {
    hero: { kicker: "13–17 ОКТ · ВМЕСТЕ В КАТАНИИ", title: "Утро у вулкана.<br><em>Медленные вечера в городе.</em>", lede: "Девушка прилетает вечером во вторник. Остаются три полных дня на Катанию, Этну и лавовое побережье до вылета домой в 06:00.", action: "План по Катании", official: "Официальный гид ↗" },
    stats: [["Полных дней", "3", "вместе"], ["Одна база", "1", "отель"], ["Вылет", "06:00", "17 окт"]],
    map: { kicker: "КАТАНИЯ · ЭТНА · ЛАВОВЫЙ БЕРЕГ", title: "Один отель, три направления", copy: "Живём в центре: один день пешком по истории, один день на Этне и один гибкий день между городом и побережьем.", caption: "Прилёт вечером 13 октября · три полных дня · трансфер в аэропорт 17 октября к 03:30", link: "https://www.google.com/maps/dir/?api=1&origin=Piazza+del+Duomo%2C+Catania&destination=Aci+Castello%2C+Catania&travelmode=driving&waypoints=Monastero+dei+Benedettini%2C+Catania%7CRifugio+Sapienza%2C+Nicolosi", linkText: "Открыть план Катании в Google Maps ↗" },
    schedule: { kicker: "13–17 ОКТ · ТРИ ПОЛНЫХ ДНЯ", title: "Активно, но без смены отелей", copy: "Чередуем прогулку, зависимый от погоды день на Этне и гибкий финал с культурой и морем." },
    logistics: { kicker: "ПЕРЕХОД К КАТАНИИ", title: "Встреча без хлопот", copy: "Всю велосипедную логистику заканчиваем до вечера вторника, чтобы дальше остались один отель и никаких дел с велосипедами.", actions: [
      ["01", "Отель в центре", "Район Piazza Duomo–Via Etnea удобен для прогулок, ресторанов и трансфера из аэропорта."],
      ["02", "Прилёт девушки", "Оставить вечер 13 октября свободным и заранее передать адрес отеля и план трансфера."],
      ["03", "Этна", "Забронировать отменяемую экскурсию на 15 октября; накануне проверить погоду, доступ и обувь."],
      ["04", "Собраться в пятницу", "Упаковать вещи до ужина 16 октября: ранний вылет не оставляет запаса утром."],
      ["05", "Трансфер в 03:30", "Заранее заказать такси или частный трансфер на рейс в 06:00 17 октября."]
    ] }
  }
};

const ruStages = {
  warmup: { date: "ВС 04", type: "РАЗМИНОЧНЫЙ КРУГ", metric3: "Спокойно", caption: "Предварительный контур · тихие дороги выбираем вместе с Фаусто", history: "Модика и Шикли входят в позднебарочный ландшафт, восстановленный после землетрясения 1693 года. Круг ведёт от известняковых холмов к церемониальным улицам Шикли и морю у Сампьери.", caution: "Это ориентир, а не проверенный GPX. Фаусто выберет тихие местные дороги; маршрут можно сократить для настройки велосипедов.", stay: "Спим в Модике в субботу и воскресенье. Нужны безопасное хранение собранных велосипедов и ранний завтрак." },
  modica: { date: "ПН 05", type: "GPX ФАУСТО · ДЕНЬ ПОЕЗДА", metric3: "Поезд 17:32", caption: "На карте только веломаршрут · уходим с GPX у Catania Centrale, затем поезд до Палермо", history: "Трек поднимается из Модики на Иблейское плато, достигает высшей точки возле Буккери, спускается через равнину Лентини и подходит к Catania Centrale.", caution: "Старт в 06:00, цель — вокзал к 15:30–16:00. Сейчас кандидат R 5519, 17:32–20:29, с провозом велосипедов. Перепроверить за 48–72 часа; автобус-замена может не принять собранные велосипеды.", stay: "Поезд относится к понедельнику, но его линия не рисуется как GPX. Заселяемся возле Palermo Centrale около 21:00 и предупреждаем про два велосипеда." },
  divide1: { date: "ВТ 06", type: "SICILY DIVIDE · ЭТАП 1", metric3: "Средне-тяжёлый", history: "Выезд из Палермо через Conca d’Oro, норманнский Монреале и внутренний Беличе. Джибеллина была перестроена как город современного искусства после землетрясения 1968 года.", caution: "Перед Джибеллиной SP12 после дождя превращается в липкую глину. При сырой погоде выбирать асфальтовую альтернативу.", stay: "Nuova Gibellina: велоотель и время на искусство под открытым небом." },
  divide2: { date: "СР 07", type: "SICILY DIVIDE · ЭТАП 2", metric3: "Беличе", history: "Этап памяти о землетрясении 1968 года: Cretto сохраняет план улиц старой Джибеллины, а Поджореале остался городом-руиной. В Самбуке заметно наследие арабской Сицилии.", caution: "Не заходить в закрытые или нестабильные руины. Между городами иметь запас воды.", stay: "Исторический центр Sambuca, рядом с Corso Umberto I; заранее подтвердить хранение велосипедов." },
  divide3: { date: "ЧТ 08", type: "SICILY DIVIDE · ЭТАП 3", history: "Часть пути идёт по бывшей железной дороге Castelvetrano–Burgio. Бурджо хранит традиции керамики и колоколов; затем дорога поднимается к лесам Quisquina.", caution: "В San Carlo нет гарантированной еды. Запас берём из Самбуки, основное пополнение — в Бурджо.", stay: "Santo Stefano Quisquina; жильё бронируем заранее, восстановление важнее вечерних крюков." },
  divide4: { date: "ПТ 09", type: "SICILY DIVIDE · ЭТАП 4", history: "Маршрут пересекает велосипедный узел Cammarata–San Giovanni Gemini, идёт к средневековому Муссомели и заканчивается в Монтедоро, связанном с историей серных шахт.", caution: "Технически день проще, но набор всё ещё большой. Оставить время на подъём к Муссомели.", stay: "В Монтедоро мало вариантов: ужин и безопасную комнату подтверждаем до выезда." },
  divide5: { date: "СБ 10", type: "SICILY DIVIDE · ЭТАП 5", metric3: "Самый тяжёлый", history: "Самый трудный официальный этап соединяет бывший серный район с высокой Энной: длинный подъём к Кальтаниссетте, спуск и короткий крутой финал.", caution: "Стартовать сытыми, после Кальтаниссетты иметь резерв калорий. На Borgo Cascino как на сервис не рассчитывать.", stay: "Исторический центр Энны. Сначала еда, стирка и велосипеды, затем прогулка." },
  divide6: { date: "ВС 11", type: "SICILY DIVIDE · ЭТАП 6", metric3: "Гравий", history: "После высокой Энны путь проходит Lago Nicoletti и Леонфорте, известный чёрной чечевицей и фруктами, затем ведёт через старые внутренние поселения к Регальбуто.", caution: "Есть грунтовые участки. В воскресенье маленькие точки могут быть закрыты; главный запас — Леонфорте.", stay: "Центр Regalbuto. Воскресный ужин подтверждаем заранее." },
  divide7: { date: "ПН 12", type: "SICILY DIVIDE · ЭТАП 7", metric3: "Финиш", history: "Финальный этап идёт через сады и сельскую местность с видом на Этну и возвращает нас в барочную Катанию. Спусков больше, чем подъёмов.", caution: "Последний риск — городской трафик. До самого финиша держимся актуального официального GPX.", stay: "Катания — по возможности тот же отель, что и для второй части. Сразу решаем отправку или хранение велосипедов." },
  rest: { date: "ВТ 13", type: "ОТДЫХ · ВЕЛОСИПЕДЫ", metric2: "Стирка", metric3: "Восстановление", caption: "Без километров · Кирилл и Фаусто закрывают велологистику", history: "Это не запасной ходовой день: он защищает маршрут от задержки и даёт Кириллу и Фаусто спокойно завершить поездку.", caution: "Отправку велосипедов, стирку и смену отеля закончить до второй половины дня. Остаток дня оставить лёгким.", stay: "При необходимости переезжаем один раз в центральный отель до вылета 17 октября." }
};

const ruRideMilestones = [
  { date: "Сб 03", number: "03", from: "Прилёт в 17:00", to: "Переезд в Модику", meta: "Без поезда", note: "Забираем велосипеды и едем к Фаусто; воскресенье не тратим на пересечение острова." },
  { date: "Вс 04", number: "04", from: "Модика", to: "Разминочный круг", meta: "≈ 50 км", note: "Шикли и Сампьери — гибкий контур для настройки велосипедов и спокойного дня." },
  { date: "Пн 05", number: "05", from: "06:00 Модика", to: "Катания + поезд 17:32", meta: "Ключевой день", note: "GPX Фаусто до Catania Centrale, затем текущий прямой поезд до Палермо." },
  { date: "Вт–Пн", number: "06–12", from: "Палермо", to: "Семь этапов Divide", meta: "7 дней", note: "Классический вариант без сжатия: Gibellina, Sambuca, Santo Stefano, Montedoro, Enna, Regalbuto, Catania." },
  { date: "Вт 13", number: "13", from: "Катания", to: "Отдых + велосипеды", meta: "Защищён", note: "Кирилл и Фаусто восстанавливаются, стирают вещи и заканчивают велологистику." }
];

const ruCityDays = [
  { date: "Вт 13", number: "13", from: "Прилёт вечером", to: "Встреча + ужин", meta: "Легко", note: "Без программы: аэропорт, заселение и поздний ужин у Via Etnea или Piazza Duomo." },
  { date: "Ср 14", number: "14", from: "Барочная Катания", to: "Рынки + история", meta: "Пешком", note: "Piazza Duomo, La Pescheria, Via Crociferi и Castello Ursino, с гранитой и долгим обедом." },
  { date: "Чт 15", number: "15", from: "Этна", to: "Активный день", meta: "По погоде", note: "Экскурсия или трансфер на Этну; запасной план — побережье или Таормина." },
  { date: "Пт 16", number: "16", from: "Benedettini + берег", to: "Закат в Aci Castello", meta: "Собраться", note: "Монастырь, римский театр и море. Вещи собрать до ужина." },
  { date: "Сб 17", number: "17", from: "Аэропорт Катании", to: "Рейс 06:00", meta: "Выезд 03:30", note: "Трансфер бронируем заранее; выезд из центра около 03:30." }
];

const itPhases = {
  ride: {
    hero: { kicker: "3–13 OTT · KIRILL + FAUSTO", title: "Prima Modica.<br><em>Poi attraverso l’isola.</em>", lede: "Kirill e Fausto partono da Modica, seguono la traccia di Fausto fino a Catania, prendono il treno serale con le bici per Palermo e poi attraversano insieme la Sicilia.", action: "Scegli una tappa", official: "Traccia ufficiale ↗" },
    stats: [["Distanza", "≈ 637", "km"], ["Dislivello", "≈ 13,6 mila", "m+"], ["Giorni in bici", "9", "giorni"]],
    map: { kicker: "SCEGLI UN GIORNO · GUARDA LA SUA TRACCIA", title: "Ogni tappa racconta una storia", copy: "Le tappe sono collegate in ordine dalla prima all’ultima. Seleziona un giorno per vedere la traccia, le soste utili, il pernottamento e la storia del territorio." },
    schedule: { kicker: "3–13 OTT · IL NUOVO RITMO", title: "Prima Modica, riposo il 13", copy: "Il lunedì unisce bici e treno: si lascia la traccia di Fausto a Catania Centrale, si raggiunge Palermo la sera e martedì inizia il Divide di sette giorni." },
    logistics: { kicker: "IL TRENO CHIAVE DEL LUNEDÌ", title: "Partire presto. Salire con calma.", copy: "Il GPX passa accanto a Catania Centrale. Orario e trasporto di due biciclette montate vanno riconfermati vicino alla partenza.", actions: [
      ["01", "Sabato verso Modica", "Dopo l’atterraggio alle 17:00, ritirare le bici e andare direttamente da Fausto. Servono due notti con deposito sicuro."],
      ["02", "Partenza lunedì alle 06:00", "Fino a Catania Centrale sono 117,9 km e circa 1.431 m di salita. Arrivo obiettivo: 15:30–16:00."],
      ["03", "Candidato R 5519", "RFI indica attualmente il diretto 17:32 Catania → 20:29 Palermo con trasporto biciclette."],
      ["04", "Piano alternativo", "Ricontrollare 48–72 ore prima. Se compare un autobus sostitutivo, usare un transfer bici prenotato."],
      ["05", "Proteggere il 13 ottobre", "Il Divide finisce lunedì 12. Kirill e Fausto tengono il martedì per spedizione bici, bucato e recupero."]
    ] }
  },
  city: {
    hero: { kicker: "13–17 OTT · INSIEME A CATANIA", title: "Mattine sul vulcano.<br><em>Sere lente in città.</em>", lede: "Arrivo martedì sera, poi tre giorni completi per Catania, l’Etna e la costa lavica prima del volo delle 06:00.", action: "Guarda il piano di Catania", official: "Guida ufficiale ↗" },
    stats: [["Giorni interi", "3", "insieme"], ["Base", "1", "hotel"], ["Volo", "06:00", "17 ott"]],
    map: { kicker: "CATANIA · ETNA · COSTA LAVICA", title: "Un hotel, tre direzioni", copy: "Base centrale: una giornata storica a piedi, una giornata sull’Etna e una giornata flessibile tra città e costa.", caption: "Arrivo la sera del 13 ottobre · tre giorni pieni · transfer aeroporto alle 03:30 del 17 ottobre", link: "https://www.google.com/maps/dir/?api=1&origin=Piazza+del+Duomo%2C+Catania&destination=Aci+Castello%2C+Catania&travelmode=driving&waypoints=Monastero+dei+Benedettini%2C+Catania%7CRifugio+Sapienza%2C+Nicolosi", linkText: "Apri il piano di Catania in Google Maps ↗" },
    schedule: { kicker: "13–17 OTT · TRE GIORNI COMPLETI", title: "Giornate attive, senza cambiare hotel", copy: "Alternare una giornata a piedi, l’Etna dipendente dal meteo e un finale flessibile tra cultura e mare." },
    logistics: { kicker: "PASSAGGIO A CATANIA", title: "Rendere semplice l’incontro", copy: "Chiudere tutta la logistica delle bici prima di martedì sera: da quel momento una sola base e nessuna amministrazione ciclistica.", actions: [
      ["01", "Hotel centrale", "La zona Piazza Duomo–Via Etnea è comoda per camminare, cenare e organizzare il transfer."],
      ["02", "Arrivo serale", "Lasciare libera la sera del 13 ottobre e condividere prima indirizzo e transfer."],
      ["03", "Prenotazione Etna", "Prenotare un’escursione cancellabile per il 15; verificare meteo, accessi e scarpe il giorno prima."],
      ["04", "Bagagli venerdì", "Preparare tutto prima di cena il 16: la partenza mattutina non lascia margine."],
      ["05", "Transfer alle 03:30", "Prenotare taxi o transfer privato per il volo delle 06:00 del 17 ottobre."]
    ] }
  }
};

const itStages = {
  warmup: { date: "DOM 04", type: "GIRO DI RISCALDAMENTO", metric3: "Ritmo facile", caption: "Traccia indicativa · Fausto sceglie le strade locali più tranquille", history: "Modica e Scicli fanno parte del paesaggio tardo barocco ricostruito dopo il terremoto del 1693. Il giro scende dalle colline calcaree al Mediterraneo di Sampieri.", caution: "È un’idea di percorso, non un GPX verificato. Accorciarlo se le bici richiedono regolazioni.", stay: "Dormire a Modica sabato e domenica, con deposito sicuro e colazione molto presto lunedì." },
  modica: { date: "LUN 05", type: "GPX DI FAUSTO · GIORNO DEL TRENO", metric3: "Treno 17:32", caption: "La mappa mostra solo la bici · uscire dal GPX a Catania Centrale, poi treno per Palermo", history: "La traccia sale sull’altopiano Ibleo, tocca il punto più alto vicino a Buccheri, scende verso Lentini e raggiunge Catania Centrale.", caution: "Partenza alle 06:00 e arrivo obiettivo 15:30–16:00. Candidato attuale R 5519, 17:32–20:29, con bici. Ricontrollare 48–72 ore prima.", stay: "Il treno appartiene alla giornata di lunedì ma non viene disegnato come GPX. Hotel vicino a Palermo Centrale verso le 21:00." },
  divide1: { date: "MAR 06", type: "SICILY DIVIDE · TAPPA 1", metric3: "Medio-dura", caption: "Variante ufficiale da Palermo · Conca d’Oro, Monreale e SP20", history: "Da Palermo attraverso la Conca d’Oro e Monreale fino al Belìce. Gibellina fu ricostruita come città d’arte contemporanea dopo il terremoto del 1968.", caution: "La SP12 prima di Gibellina diventa argilla appiccicosa dopo la pioggia. Con terreno bagnato usare l’alternativa asfaltata.", stay: "Nuova Gibellina: bike hotel e tempo per l’arte all’aperto." },
  divide2: { date: "MER 07", type: "SICILY DIVIDE · TAPPA 2", caption: "Paesaggio del terremoto · Cretto di Burri, Poggioreale e Sambuca", history: "Tappa della memoria del terremoto del Belìce: il Cretto conserva la pianta della vecchia Gibellina, Poggioreale resta una città in rovina e Sambuca racconta la Sicilia araba.", caution: "Non entrare in rovine chiuse o instabili. Portare acqua tra i centri abitati.", stay: "Centro storico di Sambuca, vicino a Corso Umberto I, con deposito bici confermato." },
  divide3: { date: "GIO 08", type: "SICILY DIVIDE · TAPPA 3", caption: "Ferrovia dismessa, artigianato di Burgio e boschi della Quisquina", history: "Parte del percorso segue la ferrovia dismessa Castelvetrano–Burgio. Burgio conserva ceramica e campane, poi si sale verso i boschi della Quisquina.", caution: "A San Carlo non è garantito trovare cibo. Partire riforniti e usare Burgio come sosta principale.", stay: "Santo Stefano Quisquina; prenotare presto e privilegiare il recupero." },
  divide4: { date: "VEN 09", type: "SICILY DIVIDE · TAPPA 4", caption: "Cammarata, il castello di Mussomeli e la storia dello zolfo", history: "Il percorso passa dal nodo ciclistico Cammarata–San Giovanni Gemini, sale nel paesaggio medievale di Mussomeli e termina nella storia mineraria di Montedoro.", caution: "È meno tecnica, ma il dislivello rimane importante. Conservare tempo per la salita verso Mussomeli.", stay: "A Montedoro l’offerta è limitata: confermare cena e deposito prima di partire." },
  divide5: { date: "SAB 10", type: "SICILY DIVIDE · TAPPA 5", metric3: "La più dura", caption: "Terre dello zolfo, Caltanissetta e la salita finale a Enna", history: "La tappa più impegnativa collega l’ex distretto dello zolfo con Enna: lunga salita a Caltanissetta, discesa e finale corto ma ripido.", caution: "Partire ben alimentati e portare calorie di riserva dopo Caltanissetta. Non contare sui servizi a Borgo Cascino.", stay: "Centro storico di Enna. Prima cena, bucato e controllo bici; passeggiata solo dopo." },
  divide6: { date: "DOM 11", type: "SICILY DIVIDE · TAPPA 6", metric3: "Sterrate", caption: "Lago Nicoletti, prodotti di Leonforte e Sicilia interna", history: "Dall’alta Enna si passa per Lago Nicoletti e Leonforte, nota per lenticchie nere e frutta, poi attraverso i paesi interni verso Regalbuto.", caution: "Ci sono tratti sterrati. La domenica i piccoli servizi possono essere chiusi; rifornirsi bene a Leonforte.", stay: "Centro di Regalbuto; confermare in anticipo la cena domenicale." },
  divide7: { date: "LUN 12", type: "SICILY DIVIDE · TAPPA 7", metric3: "Arrivo", caption: "Agrumeti, viste sull’Etna e arrivo a Catania", history: "L’ultima tappa attraversa agrumeti e campagne con vista sull’Etna e ritorna nella Catania barocca, con più discesa che salita.", caution: "Il traffico urbano è l’ultimo rischio. Seguire il GPX ufficiale fino all’arrivo.", stay: "Catania; organizzare subito spedizione o deposito delle biciclette." },
  rest: { date: "MAR 13", type: "RIPOSO · BICICLETTE", metric2: "Bucato", metric3: "Recupero", caption: "Nessun chilometro · Kirill e Fausto chiudono la logistica bici", history: "Non è un giorno di marcia in più: protegge il viaggio da un ritardo e permette a Kirill e Fausto di concludere con calma.", caution: "Finire spedizione bici, bucato e cambio hotel entro il pomeriggio. Tenere leggero il resto della giornata.", stay: "Se necessario, trasferirsi una sola volta nell’hotel centrale usato fino al 17 ottobre." }
};

const itStopCopy = {
  warmup: ["La scalinata barocca di Modica, punto naturale di partenza e arrivo.", "Passeggiata nella via barocca UNESCO e caffè prima della costa.", "Pausa sul mare; Fornace Penna solo se tempo e accesso lo permettono."],
  modica: ["Rifornimento dopo la prima salita lunga.", "Sosta pranzo vicino al punto più alto, attorno al km 60.", "Ultimo centro importante prima dell’ingresso a Catania.", "Lasciare qui il GPX, mangiare e prepararsi al treno."],
  divide1: ["Mosaici normanni UNESCO al km 9; legare le bici e visitare a piedi.", "Acqua attorno al km 28 nel paesaggio archeologico dello Jato.", "Pranzo nella zona del vino prima di Gibellina.", "Arte contemporanea e prima notte del Divide."],
  divide2: ["Memoriale di land art sulla pianta della vecchia Gibellina.", "Osservare la città abbandonata solo da accessi legali e sicuri.", "Centro affidabile per pranzo e borracce.", "Passeggiata serale tra vicoli saraceni e centro storico."],
  divide3: ["Ex nodo ferroviario; interessante, ma senza contare sul cibo.", "Ceramica, campane e prima sosta principale affidabile.", "Breve rifornimento prima delle ultime salite.", "Paese verde legato al pellegrinaggio di Santa Rosalia."],
  divide4: ["Cibo, acqua e officina meglio posizionata della tappa.", "Pranzo, checkpoint e castello Manfredonico.", "Paesaggio minerario e riposo anticipato."],
  divide5: ["Primo rifornimento pratico attorno al km 12,5.", "Sosta principale per cibo, checkpoint e riparazioni.", "Piccolo borgo rurale: osservare, ma portare le proprie scorte.", "Arrivo sopra i 900 metri; serata più fresca."],
  divide6: ["Breve pausa sul lago tra Enna e Leonforte.", "Panini, prodotti locali e assistenza meccanica indicata.", "Borgo storico sul percorso verso est.", "Ultima notte prima della discesa a Catania."],
  divide7: ["Panorama sull’Etna solo se la giornata resta in orario.", "Ultimo rifornimento facile prima dell’area urbana.", "Foto d’arrivo, poi sistemare le bici prima di festeggiare."],
  rest: ["Passeggiata ombreggiata se le gambe vogliono muoversi.", "Recupero facoltativo sul mare, senza trasformarlo in un itinerario.", "Cena finale semplice per Kirill e Fausto."]
};

const itRideMilestones = [
  { date: "Sab 03", number: "03", from: "Arrivo 17:00", to: "Transfer a Modica", meta: "Niente treno", note: "Ritirare le bici e andare da Fausto; non usare la domenica per attraversare l’isola." },
  { date: "Dom 04", number: "04", from: "Modica", to: "Giro di riscaldamento", meta: "≈ 50 km", note: "Scicli e Sampieri come traccia flessibile per regolare le bici e pedalare piano." },
  { date: "Lun 05", number: "05", from: "06:00 Modica", to: "Catania + treno 17:32", meta: "Giorno chiave", note: "GPX di Fausto fino a Catania Centrale, poi treno diretto candidato per Palermo." },
  { date: "Mar–Lun", number: "06–12", from: "Palermo", to: "Sette tappe Divide", meta: "7 giorni", note: "Variante classica senza comprimere: Gibellina, Sambuca, Santo Stefano, Montedoro, Enna, Regalbuto, Catania." },
  { date: "Mar 13", number: "13", from: "Catania", to: "Riposo + bici", meta: "Protetto", note: "Kirill e Fausto recuperano, fanno il bucato e chiudono la logistica delle biciclette." }
];

const itCityDays = [
  { date: "Mar 13", number: "13", from: "Arrivo serale", to: "Incontro + cena", meta: "Facile", note: "Nessun programma: aeroporto, check-in e cena tardiva vicino a Via Etnea o Piazza Duomo." },
  { date: "Mer 14", number: "14", from: "Catania barocca", to: "Mercati + storia", meta: "A piedi", note: "Piazza Duomo, Pescheria, Via Crociferi e Castello Ursino, con granita e pranzo lungo." },
  { date: "Gio 15", number: "15", from: "Etna", to: "Giornata attiva", meta: "Meteo", note: "Escursione guidata o transfer; alternativa costa o Taormina se cambiano meteo e accessi." },
  { date: "Ven 16", number: "16", from: "Benedettini + costa", to: "Tramonto ad Aci Castello", meta: "Fare i bagagli", note: "Monastero, teatro romano e mare. Preparare le valigie prima di cena." },
  { date: "Sab 17", number: "17", from: "Aeroporto Catania", to: "Volo 06:00", meta: "Partenza 03:30", note: "Prenotare il transfer; lasciare il centro verso le 03:30." }
];

let map;
let featureLayer;
let trackerMap;
let trackerLayer;
let trackerFeed;
let trackerFeedError;
let trackerRefreshTimer;
let selectedRideStage = "warmup";
let officialSegments = [];

const setText = (selector, value) => { document.querySelector(selector).textContent = value; };
const mapsSearch = stop => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stop.coordinates[0]},${stop.coordinates[1]} ${stop.name}`)}`;
const phaseData = phase => locale === "ru" ? ruPhases[phase] : locale === "it" ? itPhases[phase] : phases[phase];
const kindRu = { See: "Смотреть", Coffee: "Кофе", Lunch: "Обед", Water: "Вода", Refill: "Запас", Finish: "Финиш", History: "История", View: "Вид", Workshop: "Мастерская", Pause: "Пауза", Recover: "Отдых", Evening: "Вечер" };
const kindIt = { See: "Da vedere", Coffee: "Caffè", Lunch: "Pranzo", Water: "Acqua", Refill: "Rifornimento", Finish: "Arrivo", History: "Storia", View: "Panorama", Workshop: "Officina", Pause: "Pausa", Recover: "Recupero", Evening: "Sera" };
const localizedStage = stage => {
  if (locale === "en") return stage;
  const override = (locale === "ru" ? ruStages : itStages)[stage.id] || {};
  const kinds = locale === "ru" ? kindRu : kindIt;
  return {
    ...stage, ...override,
    sourceLabel: locale === "ru"
      ? (stage.routeType === "modica" ? "Скачать оригинальный GPX Фаусто ↓" : stage.routeType === "warmup" ? "Открыть контур ↗" : stage.routeType === "rest" ? "Официальный гид Катании ↗" : "Официальное описание этапа ↗")
      : (stage.routeType === "modica" ? "Scarica il GPX originale di Fausto ↓" : stage.routeType === "warmup" ? "Apri il percorso indicativo ↗" : stage.routeType === "rest" ? "Guida ufficiale di Catania ↗" : "Guida ufficiale della tappa ↗"),
    stops: stage.stops.map((stop, index) => ({
      ...stop,
      kind: kinds[stop.kind] || stop.kind,
      copy: locale === "it" ? (itStopCopy[stage.id]?.[index] || stop.copy) : stop.copy
    }))
  };
};

const routeMarker = (label, active = false) => L.divIcon({
  className: `route-marker${active ? " finish" : ""}`,
  html: `<span>${label}</span>`, iconSize: [34, 34], iconAnchor: [17, 17]
});

const nearestIndex = (line, coordinates, start = 0) => {
  let bestIndex = start;
  let bestDistance = Infinity;
  for (let index = start; index < line.length; index += 1) {
    const lat = line[index][0] - coordinates[0];
    const lon = line[index][1] - coordinates[1];
    const distance = lat * lat + lon * lon;
    if (distance < bestDistance) { bestDistance = distance; bestIndex = index; }
  }
  return bestIndex;
};

const buildOfficialSegments = () => {
  const line = window.sicilyRoute || [];
  const endpoints = [[38.1137, 13.3661], [37.8073, 12.8690], [37.6516, 13.1149], [37.6256, 13.4898], [37.4547, 13.8167], [37.5676, 14.2792], [37.6510, 14.6392], [37.5026, 15.0871]];
  const indices = [];
  let cursor = 0;
  endpoints.forEach(endpoint => { cursor = nearestIndex(line, endpoint, cursor); indices.push(cursor); });
  officialSegments = indices.slice(0, -1).map((start, index) => line.slice(start, indices[index + 1] + 1));
};

const initializeMap = () => {
  if (!window.L) {
    document.querySelector("#map").innerHTML = '<p class="map-error">The interactive map could not load. Use the route link below.</p>';
    return;
  }
  map = L.map("map", { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  featureLayer = L.layerGroup().addTo(map);
  buildOfficialSegments();
};

const initializeTrackerMap = () => {
  if (!window.L) {
    document.querySelector("#tracker-map").innerHTML = '<p class="map-error">The tracker map could not load.</p>';
    return;
  }
  trackerMap = L.map("tracker-map", { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(trackerMap);
  trackerLayer = L.layerGroup().addTo(trackerMap);
};

const stageLine = stage => {
  if (stage.routeType === "warmup") return warmupRoute;
  if (stage.routeType === "modica") {
    const line = window.modicaRoute || [];
    const stationIndex = nearestIndex(line, [37.5067, 15.0988]);
    return line.slice(0, stationIndex + 1);
  }
  if (stage.routeType === "official") return officialSegments[stage.officialIndex] || [];
  return stage.stops.map(stop => stop.coordinates);
};

const renderStageMap = stage => {
  if (!map || !featureLayer) return;
  featureLayer.clearLayers();
  const line = stageLine(stage).map(point => [point[0], point[1]]);
  if (line.length > 1) {
    L.polyline(line, {
      color: "#ee6a35", weight: stage.routeType === "train" ? 4 : 5, opacity: .94,
      dashArray: ["train", "warmup", "rest"].includes(stage.routeType) ? "10 9" : null,
      lineJoin: "round"
    }).addTo(featureLayer);
  }
  stage.stops.forEach((stop, index) => {
    L.marker(stop.coordinates, { icon: routeMarker(String(index + 1), index === stage.stops.length - 1) })
      .bindPopup(`<b>${stop.name}</b><br><span>${stop.kind}</span> · ${stop.copy}`)
      .addTo(featureLayer);
  });
  const bounds = [...line, ...stage.stops.map(stop => stop.coordinates)];
  if (bounds.length) map.fitBounds(L.latLngBounds(bounds), { padding: [34, 34], maxZoom: 11 });
};

const renderStageDetail = stage => {
  document.querySelector("[data-map-caption]").innerHTML = `<span>${stage.date} · ${stage.type}</span>${stage.caption}`;
  document.querySelector("[data-map-link]").href = stage.sourceLink;
  document.querySelector("[data-map-link]").textContent = stage.sourceLabel;
  if (stage.sourceLink.endsWith(".gpx")) document.querySelector("[data-map-link]").setAttribute("download", "");
  else document.querySelector("[data-map-link]").removeAttribute("download");

  document.querySelector("[data-stage-detail]").innerHTML = `
    <div class="stage-detail-main">
      <p class="eyebrow">${stage.date} · ${stage.type}</p>
      <h3>${stage.title}</h3>
      <div class="stage-detail-metrics"><span>${stage.metric1}</span><span>${stage.metric2}</span><span>${stage.metric3}</span></div>
      <p>${stage.history}</p>
      <div class="stage-caution"><b>${ui[locale].planning}</b><p>${stage.caution}</p></div>
      <div class="stage-stay"><b>${ui[locale].overnight}</b><p>${stage.stay}</p></div>
    </div>
    <div class="stage-stops">
      <p class="eyebrow">${ui[locale].stops}</p>
      ${stage.stops.map((stop, index) => `
        <a href="${mapsSearch(stop)}" target="_blank" rel="noreferrer">
          <span>${String(index + 1).padStart(2, "0")}</span><div><b>${stop.name}</b><small>${stop.kind} · ${stop.copy}</small></div><i>↗</i>
        </a>
      `).join("")}
    </div>
  `;
};

const renderRideStage = id => {
  selectedRideStage = id;
  const rawStage = rideStages.find(item => item.id === id) || rideStages[0];
  const stage = localizedStage(rawStage);
  document.querySelectorAll("[data-stage-id]").forEach(button => {
    const selected = button.dataset.stageId === stage.id;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  renderStageMap(stage);
  renderStageDetail(stage);
};

const renderStageTabs = () => {
  document.querySelector("[data-stage-tabs]").innerHTML = rideStages.map(rawStage => {
    const stage = localizedStage(rawStage);
    return `
    <button type="button" role="tab" data-stage-id="${stage.id}" aria-selected="${stage.id === selectedRideStage}">
      <span>${stage.number}</span><div><b>${stage.date}</b><small>${stage.title}</small></div>
    </button>
  `; }).join("");
  document.querySelectorAll("[data-stage-id]").forEach(button => {
    button.addEventListener("click", () => renderRideStage(button.dataset.stageId));
  });
};

const renderCityMap = data => {
  if (!map || !featureLayer) return;
  featureLayer.clearLayers();
  const cityCopyIt = ["Centro storico e punto di riferimento serale.", "Mercato del pesce al mattino.", "Museo civico in un castello del XIII secolo.", "Monastero barocco con visita guidata.", "Giornata attiva dipendente dal meteo.", "Costa lavica e tramonto.", "Partenza alle 06:00 del 17 ottobre."];
  const places = cityPlaces.map((place, index) => locale === "it" ? { ...place, copy: cityCopyIt[index] } : place);
  const cityLine = places.map(place => place.coordinates);
  L.polyline(cityLine, { color: "#ee6a35", weight: 3, opacity: .7, dashArray: "8 8" }).addTo(featureLayer);
  places.forEach((place, index) => {
    L.marker(place.coordinates, { icon: routeMarker(String(index + 1), place.name === "Catania Airport") })
      .bindPopup(`<b>${place.name}</b><br>${place.copy}`).addTo(featureLayer);
  });
  map.fitBounds(L.latLngBounds(cityLine), { padding: [34, 34] });
  document.querySelector("[data-map-caption]").innerHTML = `<span>${locale === "ru" ? "Выбранный план" : locale === "it" ? "Piano selezionato" : "Selected plan"}</span>${data.map.caption}`;
  document.querySelector("[data-map-link]").href = data.map.link;
  document.querySelector("[data-map-link]").textContent = data.map.linkText;
  document.querySelector("[data-map-link]").removeAttribute("download");
};

const trackerText = {
  en: { kicker: "PALERMO → CATANIA · DOTWATCHER", title: "Follow Kirill and Fausto.", copy: "The public feed opens on 3 October and shows rider positions with a five-minute safety delay.", caption: "Official Sicily Divide · Palermo start · Catania finish", scheduled: "OPENS 3 OCT", scheduledCopy: "No rider locations are public before the trip", unavailable: "FEED UNAVAILABLE", unavailableCopy: "The route remains visible while the tracker reconnects", live: "DELAYED LIVE", liveCopy: "Positions are intentionally delayed by five minutes", noPosition: "Waiting for the first position", distance: "from start", updated: "Recorded" },
  ru: { kicker: "ПАЛЕРМО → КАТАНИЯ · ДОТВОТЧЕР", title: "Следите за Кириллом и Фаусто.", copy: "Публичный канал откроется 3 октября и показывает позиции с защитной задержкой в пять минут.", caption: "Официальный Sicily Divide · старт в Палермо · финиш в Катании", scheduled: "ОТКРОЕТСЯ 3 ОКТ", scheduledCopy: "До поездки позиции участников не публикуются", unavailable: "КАНАЛ НЕДОСТУПЕН", unavailableCopy: "Маршрут остаётся на карте, пока связь восстанавливается", live: "С ЗАДЕРЖКОЙ", liveCopy: "Позиции намеренно задержаны на пять минут", noPosition: "Ожидается первая позиция", distance: "от старта", updated: "Записано" },
  it: { kicker: "PALERMO → CATANIA · DOTWATCHER", title: "Segui Kirill e Fausto.", copy: "Il feed pubblico apre il 3 ottobre e mostra le posizioni con cinque minuti di ritardo di sicurezza.", caption: "Sicily Divide ufficiale · partenza Palermo · arrivo Catania", scheduled: "APRE IL 3 OTT", scheduledCopy: "Nessuna posizione è pubblica prima del viaggio", unavailable: "FEED NON DISPONIBILE", unavailableCopy: "Il percorso resta visibile mentre il tracker si riconnette", live: "LIVE RITARDATO", liveCopy: "Le posizioni sono ritardate intenzionalmente di cinque minuti", noPosition: "In attesa della prima posizione", distance: "dalla partenza", updated: "Registrato" }
};

const renderTracker = () => {
  const copy = trackerText[locale];
  setText("[data-tracker-kicker]", copy.kicker);
  setText("[data-tracker-title]", copy.title);
  setText("[data-tracker-copy]", copy.copy);
  setText("[data-tracker-caption]", copy.caption);
  const configuredRiders = (window.dotwatcherConfig && window.dotwatcherConfig.riders) || [];
  const riders = trackerFeed && Array.isArray(trackerFeed.riders) ? trackerFeed.riders : configuredRiders;
  const active = Boolean(trackerFeed && trackerFeed.active);
  const statusLabel = trackerFeedError ? copy.unavailable : active ? copy.live : copy.scheduled;
  const statusCopy = trackerFeedError ? copy.unavailableCopy : active ? copy.liveCopy : copy.scheduledCopy;
  const statusClass = trackerFeedError ? "error" : active ? "active" : "scheduled";
  document.querySelector("[data-tracker-panel]").innerHTML = `
    <div class="watch-panel">
      <div class="watch-status ${statusClass}"><i aria-hidden="true"></i><div><b>${statusLabel}</b><small>${statusCopy}</small></div></div>
      <p class="eyebrow">TRACCAR · 60 SEC</p>
      <h3>${copy.title}</h3>
      <div class="rider-list">
        ${riders.map((rider, index) => {
          const hasPosition = active && Number.isFinite(rider.lat) && Number.isFinite(rider.lon) && rider.recordedAt;
          const detail = hasPosition
            ? `${Number(rider.distanceKm || 0).toFixed(1)} km ${copy.distance} · ${copy.updated} ${new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Rome" }).format(new Date(rider.recordedAt))}`
            : copy.noPosition;
          return `<div class="rider"><span>${index + 1}</span><div><b>${rider.name}</b><small>${detail}</small></div><em class="rider-state ${rider.status || "not-started"}">${rider.status || "not-started"}</em></div>`;
        }).join("")}
      </div>
      <div class="watch-privacy"><b>5 MIN</b><p>${statusCopy}</p></div>
    </div>`;

  if (!trackerMap || !trackerLayer) return;
  trackerLayer.clearLayers();
  const line = window.sicilyRoute || [];
  if (line.length > 1) L.polyline(line, { color: "#d5532f", weight: 5, opacity: .94, lineJoin: "round" }).addTo(trackerLayer);
  const start = [38.1137, 13.3661];
  const finish = [37.5026, 15.0871];
  L.marker(start, { icon: routeMarker("P") }).bindPopup(`<b>Palermo</b><br>${ui[locale].start}`).addTo(trackerLayer);
  L.marker(finish, { icon: routeMarker("C", true) }).bindPopup(`<b>Catania</b><br>${ui[locale].finish}`).addTo(trackerLayer);
  if (active) {
    const colors = ["#f3bf35", "#59c3c3"];
    riders.forEach((rider, index) => {
      const trail = Array.isArray(rider.trail) ? rider.trail.filter(point => Number.isFinite(point.lat) && Number.isFinite(point.lon)) : [];
      if (trail.length > 1) L.polyline(trail.map(point => [point.lat, point.lon]), { color: colors[index % colors.length], weight: 4, opacity: .92 }).addTo(trackerLayer);
      if (Number.isFinite(rider.lat) && Number.isFinite(rider.lon)) {
        L.marker([rider.lat, rider.lon], { icon: routeMarker(rider.name.slice(0, 1).toUpperCase(), rider.status === "active") })
          .bindPopup(`<b>${rider.name}</b><br>${rider.status}`).addTo(trackerLayer);
      }
    });
  }
  if (line.length) trackerMap.fitBounds(L.latLngBounds(line), { padding: [38, 38] });
};

const refreshTracker = async () => {
  const endpoint = window.dotwatcherConfig && window.dotwatcherConfig.endpoint;
  if (!endpoint) return;
  try {
    const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`feed returned ${response.status}`);
    trackerFeed = await response.json();
    trackerFeedError = null;
  } catch (error) {
    trackerFeedError = error;
  }
  if (document.body.dataset.phase === "ride") renderTracker();
};

const renderSchedule = phase => {
  const watchItems = locale === "ru" ? [
    { date: "До старта", number: "01", from: "Garmin", to: "Тестовая сессия", meta: "Нужно", note: "Проверить устройство, связанный телефон, сеть и доступ зрителя." },
    { date: "В пути", number: "02", from: "Палермо", to: "Катания", meta: "60 сек", note: "Показывать только полученную позицию и явно отмечать устаревший сигнал." },
    { date: "После", number: "03", from: "Финиш", to: "Отключение", meta: "Приватность", note: "Остановить публикацию и удалить временные данные по согласованному правилу." }
  ] : [
    { date: "Before", number: "01", from: "Garmin", to: "Test session", meta: "Required", note: "Verify the device, paired phone, mobile signal and spectator access." },
    { date: "On route", number: "02", from: "Palermo", to: "Catania", meta: "60 sec", note: "Show only received positions and clearly mark a stale signal." },
    { date: "After", number: "03", from: "Finish", to: "Switch off", meta: "Privacy", note: "Stop publishing and remove temporary position data on the agreed schedule." }
  ];
  const rideItems = locale === "ru" ? ruRideMilestones : locale === "it" ? itRideMilestones : rideMilestones;
  const cityItems = locale === "ru" ? ruCityDays : locale === "it" ? itCityDays : cityDays;
  const items = phase === "ride" ? rideItems : phase === "watch" ? watchItems : cityItems;
  document.querySelector("[data-schedule-list]").innerHTML = items.map(item => `
    <article class="stage city-day">
      <div class="stage-number"><span>${item.number}</span><small>${item.date}</small></div>
      <div class="stage-route"><p>${item.from}</p><i aria-hidden="true"></i><h3>${item.to}</h3><small>${item.note}</small></div>
      <div class="stage-effort city-meta"><strong>${item.meta}</strong></div>
    </article>
  `).join("");
};

const renderActions = actions => {
  document.querySelector("[data-action-list]").innerHTML = actions.map(([number, title, copy]) => `
    <li><span>${number}</span><div><b>${title}</b><p>${copy}</p></div></li>
  `).join("");
};

const handoffText = {
  en: {
    ride: [["03 OCT · 17:00", "Kirill + Fausto arrive in Catania"], ["06 OCT", "Start together in Palermo"], ["12 OCT", "Finish together in Catania"]],
    city: [["13 OCT · EVENING", "Arrival in Catania"], ["14–16 OCT", "Three full days together"], ["17 OCT · 06:00", "Fly home together"]]
  },
  ru: {
    ride: [["3 ОКТ · 17:00", "Кирилл и Фаусто прилетают в Катанию"], ["6 ОКТ", "Вместе стартуют в Палермо"], ["12 ОКТ", "Вместе финишируют в Катании"]],
    city: [["13 ОКТ · ВЕЧЕР", "Прилёт в Катанию"], ["14–16 ОКТ", "Три полных дня вместе"], ["17 ОКТ · 06:00", "Летите домой вместе"]]
  },
  it: {
    ride: [["3 OTT · 17:00", "Kirill e Fausto arrivano a Catania"], ["6 OTT", "Partono insieme da Palermo"], ["12 OTT", "Arrivano insieme a Catania"]],
    city: [["13 OTT · SERA", "Arrivo a Catania"], ["14–16 OTT", "Tre giorni interi insieme"], ["17 OTT · 06:00", "Volo di ritorno insieme"]]
  }
};

const renderHandoff = phase => {
  const items = handoffText[locale][phase];
  document.querySelectorAll(".handoff-band div").forEach((node, index) => {
    node.innerHTML = `<span>${items[index][0]}</span><b>${items[index][1]}</b>`;
  });
};

const renderPhase = phase => {
  const data = phaseData(phase);
  document.body.dataset.phase = phase;
  document.querySelector(".hero").dataset.theme = phase;
  document.querySelectorAll("[data-phase]").forEach(button => {
    const selected = button.dataset.phase === phase;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  setText("[data-hero-kicker]", data.hero.kicker);
  document.querySelector("[data-hero-title]").innerHTML = data.hero.title;
  setText("[data-hero-lede]", data.hero.lede);
  setText("[data-hero-action]", data.hero.action);
  setText("[data-official-link]", data.hero.official);
  document.querySelector("[data-official-link]").href = phase === "ride" ? "https://sicilydivide.it/tappe-e-traccia-sicily-divide/" : phase === "watch" ? "https://support.garmin.com/en-AU/?faq=HbqxxbiBGA3mDhlLX4GUw8&topicTag=region_livetrack" : "https://turismo.comune.catania.it/scoprire-catania/";
  data.stats.forEach((stat, index) => {
    setText(`[data-stat-label-${index + 1}]`, stat[0]);
    document.querySelector(`[data-stat-value-${index + 1}]`).innerHTML = `${stat[1]} <small>${stat[2]}</small>`;
  });
  setText("[data-map-kicker]", data.map.kicker);
  setText("[data-map-title]", data.map.title);
  setText("[data-map-copy]", data.map.copy);
  setText("[data-schedule-kicker]", data.schedule.kicker);
  setText("[data-schedule-title]", data.schedule.title);
  setText("[data-schedule-copy]", data.schedule.copy);
  setText("[data-logistics-kicker]", data.logistics.kicker);
  setText("[data-logistics-title]", data.logistics.title);
  setText("[data-logistics-copy]", data.logistics.copy);
  renderSchedule(phase);
  renderActions(data.logistics.actions);
  renderHandoff(phase);

  const story = document.querySelector("[data-stage-story]");
  const detail = document.querySelector("[data-stage-detail]");
  const tracker = document.querySelector("[data-tracker-section]");
  story.hidden = phase !== "ride";
  detail.hidden = phase === "city";
  tracker.hidden = phase !== "ride";
  if (phase === "ride") {
    renderStageTabs();
    renderRideStage(selectedRideStage);
    renderTracker();
  } else {
    renderCityMap(data);
  }
  requestAnimationFrame(() => {
    if (map) map.invalidateSize();
    if (phase === "ride" && trackerMap) trackerMap.invalidateSize();
  });
};

document.querySelectorAll("[data-phase]").forEach(button => button.addEventListener("click", () => renderPhase(button.dataset.phase)));
document.querySelector("[data-print]").addEventListener("click", () => window.print());
document.documentElement.lang = locale;
document.querySelectorAll("[data-lang]").forEach(link => link.classList.toggle("active", link.dataset.lang === locale));
document.querySelectorAll("[data-phase-label]").forEach(label => { label.textContent = ui[locale].phase[label.dataset.phaseLabel]; });
document.querySelectorAll("[data-i18n]").forEach(node => { node.textContent = ui[locale][node.dataset.i18n]; });
if (locale !== "en") {
  const sourceText = locale === "ru" ? [
    ["Sicily Divide", "Этапы + актуальный GPX ↗"], ["Trenitalia Sicilia", "Правила провоза велосипедов ↗"],
    ["Отправления RFI", "Табло Catania Centrale ↗"], ["GPX Фаусто", "Исходный загруженный трек ↓"],
    ["Туризм Катании", "Официальный городской гид ↗"], ["Italia.it", "Катания + Этна ↗"]
  ] : [
    ["Sicily Divide", "Tappe + GPX aggiornato ↗"], ["Trenitalia Sicilia", "Regole per il trasporto bici ↗"],
    ["Partenze RFI", "Tabellone di Catania Centrale ↗"], ["GPX di Fausto", "Traccia originale caricata ↓"],
    ["Turismo Catania", "Guida ufficiale della città ↗"], ["Italia.it", "Catania + Etna ↗"]
  ];
  document.querySelectorAll(".source-links a").forEach((link, index) => {
    link.querySelector("b").textContent = sourceText[index][0];
    link.querySelector("span").textContent = sourceText[index][1];
  });
}
initializeMap();
initializeTrackerMap();
renderPhase("ride");
refreshTracker();
trackerRefreshTimer = window.setInterval(refreshTracker, Math.max(15, Number(window.dotwatcherConfig.refreshSeconds || 60)) * 1000);
