#!/usr/bin/env python3
"""Validate local Garmin exports and derive private, unsimplified map assets.

No network calls. Never overwrite originals or publish output. The input UI
statistics are separate from distances calculated from exported GPS points.
"""
from __future__ import annotations

import argparse
import copy
import hashlib
import json
import math
from collections import Counter
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo
import xml.etree.ElementTree as ET
import zipfile

NS = "http://www.topografix.com/GPX/1/1"
ET.register_namespace("", NS)


def tag(name):
    return f"{{{NS}}}{name}"


def utc(value):
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    assert parsed.utcoffset() is not None, "Timestamp lacks timezone"
    return parsed


def distance(a, b):
    lon1, lat1, lon2, lat2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    hav = math.sin((lat2-lat1)/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin((lon2-lon1)/2)**2
    return 6371008.8 * 2 * math.asin(min(1, math.sqrt(hav)))


def seconds(value):
    h, m, s = map(int, value.split(":"))
    return h*3600 + m*60 + s


def duration(total):
    h, rem = divmod(total, 3600)
    m, s = divmod(rem, 60)
    return f"{h}:{m:02d}:{s:02d}"


def build(root):
    source = json.loads((root / "activity-list.json").read_text())
    activities = source["activities"]
    assert len(activities) == 8 and len({a["activity_id"] for a in activities}) == 8
    assert [a["day"] for a in activities] == list(range(1, 9))
    assert [a["date"] for a in activities] == [f"2026-10-{day:02d}" for day in range(5, 13)]
    assert len(list((root / "originals").glob("*.gpx"))) == 8
    tz = ZoneInfo(source["timezone"])
    derived = root / "derived"
    derived.mkdir(exist_ok=True)
    combined = ET.Element(tag("gpx"), version="1.1", creator="Sicily local route extraction")
    features, manifest, checksums = [], [], []
    previous_end = None
    for activity in activities:
        original = root / "originals" / activity["file"]
        raw = original.read_bytes()
        digest = hashlib.sha256(raw).hexdigest()
        track = ET.fromstring(raw)
        assert track.tag == tag("gpx")
        assert track.findtext(".//" + tag("trk") + "/" + tag("name")) == activity["name"]
        out_track = ET.SubElement(combined, tag("trk"))
        ET.SubElement(out_track, tag("name")).text = f"Day {activity['day']} · {activity['date']} · {activity['name']}"
        ET.SubElement(out_track, tag("type")).text = "cycling"
        coordinates, times = [], []
        total_m, time_gaps, spatial_jumps = 0.0, [], []
        previous_time = None
        extensions = Counter()
        for segment in track.findall(".//" + tag("trkseg")):
            points = segment.findall(tag("trkpt"))
            assert len(points) >= 2, "Empty/single-point segment requires review"
            output_segment = ET.SubElement(out_track, tag("trkseg"))
            line, stamps = [], []
            for index, point in enumerate(points):
                lat, lon = float(point.attrib["lat"]), float(point.attrib["lon"])
                assert math.isfinite(lat) and math.isfinite(lon)
                assert 35.4 <= lat <= 38.5 and 12.0 <= lon <= 15.8, "Point outside Sicily bounds"
                elevation = point.findtext(tag("ele"))
                assert elevation is not None and math.isfinite(float(elevation))
                stamp = point.findtext(tag("time"))
                assert stamp is not None, "Photo alignment requires timestamps"
                moment = utc(stamp)
                assert moment.astimezone(tz).date().isoformat() == activity["date"]
                if previous_time is not None:
                    assert moment >= previous_time, "Time reversal in track"
                previous_time = moment
                coord = [lon, lat, float(elevation)]
                if line:
                    step_m = distance(line[-1], coord)
                    gap_s = (moment - utc(stamps[-1])).total_seconds()
                    total_m += step_m
                    if gap_s > 300:
                        time_gaps.append({"from": stamps[-1], "to": stamp, "seconds": gap_s, "distance_m": round(step_m, 1)})
                    if step_m > 500:
                        spatial_jumps.append({"from": stamps[-1], "to": stamp, "seconds": gap_s, "distance_m": round(step_m, 1)})
                line.append(coord)
                stamps.append(stamp)
                output_point = ET.SubElement(output_segment, tag("trkpt"), dict(point.attrib))
                for field in ("ele", "time"):
                    ET_child = point.find(tag(field))
                    output_point.append(copy.deepcopy(ET_child))
                for node in point.findall(".//" + tag("extensions") + "//*"):
                    if len(node) == 0:
                        extensions[node.tag.rsplit("}", 1)[-1]] += 1
            coordinates.append(line)
            times.append(stamps)
        assert coordinates, "No recorded track geometry"
        flat = [p for line in coordinates for p in line]
        all_times = [t for line in times for t in line]
        if previous_end is not None:
            assert utc(all_times[0]) > previous_end, "Activities overlap or are out of order"
        previous_end = utc(all_times[-1])
        summary = {
            **activity,
            "activity_url": f"https://connect.garmin.com/app/activity/{activity['activity_id']}",
            "sha256": digest, "bytes": len(raw), "points": len(flat), "segments": len(coordinates),
            "gps_point_distance_km": round(total_m/1000, 3),
            "start_utc": all_times[0], "end_utc": all_times[-1],
            "start_local": utc(all_times[0]).astimezone(tz).isoformat(),
            "end_local": utc(all_times[-1]).astimezone(tz).isoformat(),
            "elapsed_seconds": (utc(all_times[-1])-utc(all_times[0])).total_seconds(),
            "start_lon_lat": flat[0][:2], "end_lon_lat": flat[-1][:2],
            "bbox": [min(p[0] for p in flat), min(p[1] for p in flat), max(p[0] for p in flat), max(p[1] for p in flat)],
            "time_gaps_over_5min": time_gaps, "point_jumps_over_500m": spatial_jumps,
            "original_extension_fields": dict(extensions),
        }
        manifest.append(summary)
        # Keep every point and original segment; never connect separate days.
        features.append({"type": "Feature", "id": activity["day"], "properties": {
            "day": activity["day"], "date": activity["date"], "name": activity["name"],
            "garmin_distance_km": activity["distance_km"], "garmin_ascent_m": activity["ascent_m"],
            "garmin_timer_time": activity["timer_time"], "timezone": source["timezone"],
            "coordinate_times_utc": times,
        }, "geometry": {"type": "MultiLineString", "coordinates": coordinates}})
        checksums.append(f"{digest}  originals/{activity['file']}")
        print(f"Day {activity['day']} {activity['date']}: {len(flat):,} points, {total_m/1000:.3f} GPS km, {len(time_gaps)} time gaps >5min, {len(spatial_jumps)} jumps >500m")
    total_points = sum(a["points"] for a in manifest)
    totals = {"activities": len(manifest), "points": total_points,
              "garmin_distance_km": round(sum(a["distance_km"] for a in activities), 2),
              "garmin_ascent_m": sum(a["ascent_m"] for a in activities),
              "garmin_timer_time": duration(sum(seconds(a["timer_time"]) for a in activities))}
    report = {"checked_date": source["checked_date"], "source": source["source"],
              "privacy": "Local only; all endpoints and photo metadata require review before publication.",
              "timezone": source["timezone"], "totals": totals, "activities": manifest}
    (root / "manifest.json").write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n")
    (root / "SHA256SUMS").write_text("\n".join(checksums) + "\n")
    geojson_path = derived / "sicily-actual-rides.geojson"
    geojson_path.write_text(json.dumps({"type": "FeatureCollection", "features": features}, separators=(",", ":"), ensure_ascii=False) + "\n")
    combined_path = derived / "sicily-actual-rides.gpx"
    ET.indent(combined, space="  ")
    ET.ElementTree(combined).write(combined_path, encoding="utf-8", xml_declaration=True)
    # Independently reread derived formats and compare all coordinates/timestamps.
    reread = json.loads(geojson_path.read_text())
    merged = ET.parse(combined_path).getroot().findall(tag("trk"))
    assert len(merged) == 8
    for original_feature, derived_feature, merged_track in zip(features, reread["features"], merged):
        assert original_feature == derived_feature
        merged_lines, merged_times = [], []
        for segment in merged_track.findall(tag("trkseg")):
            pts = segment.findall(tag("trkpt"))
            merged_lines.append([[float(p.attrib["lon"]), float(p.attrib["lat"]), float(p.findtext(tag("ele")))] for p in pts])
            merged_times.append([p.findtext(tag("time")) for p in pts])
        assert merged_lines == original_feature["geometry"]["coordinates"]
        assert merged_times == original_feature["properties"]["coordinate_times_utc"]
        assert merged_track.find(".//" + tag("extensions")) is None
    assert sum(len(line) for f in reread["features"] for line in f["geometry"]["coordinates"]) == total_points
    table = ["| Date | Garmin activity | Distance | Ascent | Timer time | GPS points |", "|---|---|---:|---:|---:|---:|"]
    for a in manifest:
        table.append(f"| {a['date']} | {a['name']} | {a['distance_km']:.2f} km | {a['ascent_m']:,} m | {a['timer_time']} | {a['points']:,} |")
    notes = f"""# Sicily recorded rides — local extraction

Exported from Garmin Connect on {source['checked_date']}. All eight newest activities match **5–12 October 2026**. The 4 October warm-up is excluded.

**{totals['garmin_distance_km']:.2f} km · {totals['garmin_ascent_m']:,} m ascent · {totals['garmin_timer_time']} timer time · {total_points:,} GPS points.** Totals sum Garmin's displayed, rounded activity statistics; timer time is not elapsed or moving time. GPS point distances in the manifest are a separate calculation.

{chr(10).join(table)}

## Files

- `originals/`: eight unchanged Garmin GPX exports, including timestamps and any recorded health/sensor extensions.
- `derived/sicily-actual-rides.geojson`: eight day features, all points/elevations and parallel `coordinate_times_utc` arrays. Each feature is a MultiLineString, preserving original segment boundaries. No health/sensor extensions or account IDs.
- `derived/sicily-actual-rides.gpx`: eight separate tracks in one GPX; all points, elevations and UTC timestamps, without health/sensor extensions. No artificial joins between days.
- `manifest.json`: provenance, checksums, counts, date checks, Garmin statistics, point-distance calculations and gaps requiring review.
- `SHA256SUMS`: checksums of unchanged originals.

## Before a shared website

Everything here is local and Git-ignored, including the derived files. Geometry still contains precise endpoints, and timestamps can identify private stays. Review and trim any private/home endpoints on a publication copy; keep originals intact. Do not upload these raw files or a photo library by default.

The final two rides differ from the original itinerary: 11 October is recorded as Regalbuto (112.19 km), 12 October as Lentini (84.52 km). Keep actual dates/tracks rather than replacing them with the planned Catania split. The user identifies Modica as the trip's final destination.

For photo matching: GPX timestamps are UTC; local riding dates use Europe/Rome (UTC+02:00 on these dates). Prefer each photo's embedded GPS; if absent, confirm the camera clock/timezone before matching its timestamp to the track. Never interpolate through a long recording gap without review.

No website was changed or deployed, and no data was pushed to GitHub by this extraction.
"""
    (root / "README.md").write_text(notes)
    # Local convenience bundle includes raw telemetry; not a public download.
    archive = root / "sicily-recorded-rides-private.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED) as z:
        for path in [root/"README.md", root/"activity-list.json", root/"manifest.json", root/"SHA256SUMS", geojson_path, combined_path] + sorted((root/"originals").glob("*.gpx")):
            z.write(path, path.relative_to(root))
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None
        for a in manifest:
            assert hashlib.sha256(z.read("originals/" + a["file"])).hexdigest() == a["sha256"]
    print("Verified originals, GeoJSON, combined GPX and ZIP:", totals)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--private-root", type=Path, default=Path(__file__).resolve().parent / "private")
    build(parser.parse_args().private_root.resolve())
