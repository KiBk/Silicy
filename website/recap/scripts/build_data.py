#!/usr/bin/env python3
"""Derive publication-only route geometry; never copy raw activity exports."""
import copy
from datetime import datetime
import hashlib
import json
import math
from pathlib import Path
import re
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PRIVATE = ROOT.parents[1] / 'trip-recap/private'
PUBLIC = ROOT / 'public'
NS = 'http://www.topografix.com/GPX/1/1'
ET.register_namespace('', NS)

def distance(a,b):
    lon1,lat1,lon2,lat2=map(math.radians,(a[0],a[1],b[0],b[1]))
    h=math.sin((lat2-lat1)/2)**2+math.cos(lat1)*math.cos(lat2)*math.sin((lon2-lon1)/2)**2
    return 6371008.8*2*math.asin(min(1,math.sqrt(h)))

def rows(markdown,heading):
    block=markdown.split('## '+heading+'\n',1)[1].split('\n## ',1)[0]
    lines=[l for l in block.splitlines() if l.startswith('|')]
    return [[p.strip() for p in l.strip('|').split('|')] for l in lines[2:]]

def gpx_track(parent,name,segments):
    trk=ET.SubElement(parent,f'{{{NS}}}trk')
    ET.SubElement(trk,f'{{{NS}}}name').text=name
    ET.SubElement(trk,f'{{{NS}}}type').text='cycling'
    for line in segments:
        seg=ET.SubElement(trk,f'{{{NS}}}trkseg')
        for lon,lat,ele in line:
            point=ET.SubElement(seg,f'{{{NS}}}trkpt',lat=repr(lat),lon=repr(lon))
            ET.SubElement(point,f'{{{NS}}}ele').text=repr(ele)

def root():
    return ET.Element(f'{{{NS}}}gpx',version='1.1',creator='Sicily journey — privacy-trimmed recorded routes')

def main():
    markdown=(ROOT/'content.md').read_text()
    features=json.loads((PRIVATE/'derived/sicily-actual-rides.geojson').read_text())['features']
    records=rows(markdown,'The journey')
    assert len(features)==len(records)==8
    pins=json.loads((ROOT/'hotel-pins.json').read_text())['pins']
    data={'stages':[],'hotels':pins,'photos':[],'privacy':{'minimumFinalTrimMetres':500,'timestampsRemoved':True}}
    combined=root()
    routes=PUBLIC/'routes'
    routes.mkdir(exist_ok=True)
    removed=[]
    trimmed=0
    for feature,row in zip(features,records):
        stage=int(row[0]); segments=copy.deepcopy(feature['geometry']['coordinates'])
        assert stage==feature['properties']['day']
        assert datetime.strptime(row[1], '%d %b %Y').date().isoformat()==feature['properties']['date']
        assert float(row[4])==feature['properties']['garmin_distance_km']
        assert int(row[5])==feature['properties']['garmin_ascent_m']
        assert row[6]==feature['properties']['garmin_timer_time']
        if stage==8:
            while trimmed<500:
                line=segments[-1]
                removed.append(line.pop())
                if line: trimmed+=distance(removed[-1],line[-1])
                else: segments.pop()
            assert segments and len(segments[-1])>1
        title=f'{row[2]} → {row[3]}'
        name=f'Stage {stage:02d} · {title}'
        doc=root();gpx_track(doc,name,segments);gpx_track(combined,name,segments)
        filename=f'day-{stage:02d}.gpx'
        ET.ElementTree(doc).write(routes/filename,encoding='utf-8',xml_declaration=True)
        data['stages'].append({'stage':stage,'segments':[[[p[1],p[0]] for p in line] for line in segments],
                               'gpx':f'routes/{filename}','points':sum(map(len,segments))})
    photos=json.loads((ROOT/'photo-assets.json').read_text())['photos']
    captions=rows(markdown,'Photo journal')
    assert len(photos)==len(captions) and photos
    for photo,caption in zip(photos,captions):
        ident,stage,title,alt=caption
        assert photo['id']==ident and photo['stage']==int(stage)
        assert distance((photo['lon'],photo['lat']),features[-1]['geometry']['coordinates'][-1][-1])>=500
        assert (PUBLIC/photo['src']).is_file() and (PUBLIC/photo['thumb']).is_file()
        data['photos'].append({**photo,'title':title,'alt':alt})
    ET.ElementTree(combined).write(routes/'sicily-complete.gpx',encoding='utf-8',xml_declaration=True)
    (PUBLIC/'journey.json').write_text(json.dumps(data,separators=(',',':'))+'\n')
    # Verify removed endpoint geometry cannot leak through another day or marker.
    removed_pairs={tuple(p[:2]) for p in removed}
    exposed_pairs={(p[1],p[0]) for r in data['stages'] for line in r['segments'] for p in line}
    exposed_pairs|={(p['lon'],p['lat']) for p in data['photos']+data['hotels']}
    assert not removed_pairs & exposed_pairs
    assert 500<=trimmed<550, 'Unexpected trimming amount requires review'
    for path in routes.glob('*.gpx'):
        track=ET.parse(path).getroot()
        assert not track.findall('.//{*}time') and not track.findall('.//{*}extensions')
        assert not track.findall('.//{*}wpt') and not track.findall('.//{*}link')
    archive=PUBLIC/'sicily-recorded-gpx.zip'
    with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as bundle:
        for path in sorted(routes.glob('*.gpx')):
            info=zipfile.ZipInfo(path.name,(2026,10,15,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
            bundle.writestr(info,path.read_bytes())
        note=zipfile.ZipInfo('README.txt',(2026,10,15,0,0,0));note.compress_type=zipfile.ZIP_DEFLATED
        bundle.writestr(note,'Recorded Sicily rides, 5–12 October 2026. Eight individual tracks and one combined file. At least the final 500 metres are omitted for privacy. No timestamps or health data. Do not infer a private finish address from the map. Original riding totals include the omitted part. Check current access and conditions before riding.\n')
    # Keep exact trim/audit details local, not inside the static site's document root.
    (PRIVATE/'recap-privacy-audit.json').write_text(json.dumps({'trimmed_metres':trimmed,'removed_points':len(removed),'retained_points':sum(s['points'] for s in data['stages']),'final_endpoint_removed':True,'source_sha256':hashlib.sha256((ROOT/'content.md').read_bytes()).hexdigest()},indent=2)+'\n')
    print(f'8 recorded routes; {sum(s["points"] for s in data["stages"]):,} retained points; final {trimmed:.1f} m removed; {len(photos)} real photo pins; {len(pins)} hotel pins')

if __name__=='__main__':main()
