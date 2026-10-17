import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { marked } from './vendor/marked.esm.js';

const source = await readFile('content.md', 'utf8');
const digest = createHash('sha256').update(source).digest('hex');
const e = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
marked.use({renderer:{html:token=>'<pre>'+e(typeof token==='string'?token:token.text)+'</pre>'}});
const [front, ...rest] = source.split('\n---\n'), body = rest.join('\n---\n');
const field = key => front.match(new RegExp('^'+key+': (.+)$','m'))?.[1] || '';
const title = body.match(/^# (.+)$/m)[1];
const headings = [...body.matchAll(/^## (.+)$/gm)];
const sections = headings.map((m,i)=>({title:m[1],body:body.slice(m.index+m[0].length,headings[i+1]?.index??body.length).trim()}));
const table = s => s.body.split('\n').filter(l=>l.startsWith('|')).slice(2).map(l=>l.slice(1,-1).split('|').map(x=>x.trim()));
const prose = s => s.body.split('\n').filter(l=>!l.startsWith('|')).join('\n').trim();
const colors = ['#ac4a2e','#b77a18','#687c32','#16776b','#7961a5','#287f9e','#b14775','#795238'];
const stages = table(sections[0]).map(r=>({stage:Number(r[0]),date:r[1],from:r[2],to:r[3],km:Number(r[4]),ascent:Number(r[5]),timer:r[6],color:colors[Number(r[0])-1]}));
const hotels = table(sections[1]).map(r=>{
  const link=r[1].match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  return {stage:Number(r[0]),name:link?link[1]:r[1],url:link?link[2]:null,amount:r[2],cost:Number(r[2].match(/[\d.]+/)[0]),town:r[3],note:r[4],perPerson:Number(r[5]),room:r[6]};
});
const noteSource=sections.find(s=>s.title==='Ride notes').body;
const noteHeadings=[...noteSource.matchAll(/^### (\d) · (.+)$/gm)];
const rideNotes=Object.fromEntries(noteHeadings.map((m,i)=>[m[1],{title:m[2],html:marked.parse(noteSource.slice(m.index+m[0].length,noteHeadings[i+1]?.index??noteSource.length).trim())}]));
const euro=value=>'€'+value.toLocaleString('en',{maximumFractionDigits:2,minimumFractionDigits:Number.isInteger(value)?0:2});
const routes = JSON.parse(await readFile('public/journey.json','utf8'));
const totalKm = stages.reduce((a,s)=>a+s.km,0).toFixed(2);
const totalClimb = stages.reduce((a,s)=>a+s.ascent,0).toLocaleString('en');
const totalStays = hotels.reduce((a,h)=>a+h.cost,0);
const version = createHash('sha256').update(source).update(await readFile('public/styles.css')).update(await readFile('public/app.js')).update(await readFile('public/map-gestures.js')).update(await readFile('public/journey.json')).digest('hex').slice(0,12);
const shortTown = s => ({'Sambuca di Sicilia':'Sambuca','Santo Stefano Quisquina':'S. Stefano'}[s]||s);
const stageButtons = stages.map(s=>`<button class="stage-choice" data-stage="${s.stage}" style="--stage:${s.color}" aria-pressed="false" aria-label="Stage ${s.stage}: ${e(s.from)} to ${e(s.to)}"><span class="stage-number">${s.stage}</span><span>${e(shortTown(s.to))}</span></button>`).join('');
const hotelRows = hotels.map(h=>`<li><div><button class="stay-locate" data-hotel="${h.stage}">${e(h.name)} <span aria-hidden="true">↗</span></button><small>${e(h.town)} · ${e(h.room)}</small></div><strong>${euro(h.perPerson)}<small>per person</small></strong></li>`).join('');
const meta = JSON.stringify({stages,hotels,rideNotes,digest,version,title,photoCount:routes.photos.length,totalStays,totalKm,totalClimb,dates:'5–12 October 2026'}).replaceAll('<','\\u003c');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#eceee5"><meta name="description" content="${e(field('summary'))}"><title>${e(title)} · Sicily ride diary</title><link rel="stylesheet" href="leaflet.css"><link rel="stylesheet" href="styles.css?v=${version}"></head>
<body data-source-sha256="${digest}">
<a class="skip" href="#stage-controls">Choose a stage</a>
<main class="map-page" id="the-journey">
  <div id="journey-map" aria-label="Interactive map of eight recorded Sicily rides"></div>
  <div class="map-wash" aria-hidden="true"></div>
  <header class="trip-heading" aria-live="polite">
    <p class="eyebrow" id="trip-dates">8 days · 5–12 October 2026</p>
    <h1 id="trip-title">${e(title)}</h1>
    <div class="trip-stats" id="trip-stats"><span><strong>${totalKm}</strong> km</span><span>↑ <strong>${totalClimb}</strong> m</span></div>
  </header>
  <div class="map-tools">
    <button id="open-notes" class="icon-button" aria-label="Trip details" aria-haspopup="dialog">i</button>
  </div>
  <div id="map-loading" role="status">Unfolding the journey…</div>
  <div class="map-navigation" aria-label="Map navigation"><button id="fit-map" title="Fit route" aria-label="Fit selected route">⌖</button><button id="zoom-in" aria-label="Zoom in">+</button><button id="zoom-out" aria-label="Zoom out">−</button></div>
  <aside id="photo-preview" class="photo-preview" hidden aria-hidden="true"><img id="preview-image" alt=""><div><small id="preview-stage"></small><strong id="preview-title"></strong><span>Click to open</span></div></aside>
  <div class="route-dock" id="stage-controls">
    <nav class="stage-rail" aria-label="Choose a stage"><button id="all-stages" aria-pressed="true"><span class="overview-icon" aria-hidden="true">↝</span> All eight</button>${stageButtons}</nav>
  </div>
  <aside class="ride-note" aria-labelledby="ride-note-title"><p class="ride-note-label">FROM THE SADDLE <span id="ride-note-scope">Overall</span></p><h2 id="ride-note-title">${e(rideNotes[0].title)}</h2><div class="ride-note-body" id="ride-note-body">${rideNotes[0].html}</div><button id="expand-note" aria-expanded="false" aria-controls="ride-note-body">Read more ↓</button></aside>
  <span class="privacy-hint">Private finish hidden · 500 m</span>
</main>
<dialog id="photo-dialog" class="photo-dialog" aria-labelledby="photo-title">
  <div class="viewer-canvas"><img id="viewer-image" alt="Selected trip photograph"><div class="viewer-top"><span id="photo-position"></span><button id="close-photo" aria-label="Close picture">×</button></div><button id="previous-photo" class="photo-arrow previous" aria-label="Previous picture">‹</button><button id="next-photo" class="photo-arrow next" aria-label="Next picture">›</button><div class="viewer-caption"><div><p id="photo-stage"></p><h2 id="photo-title"></h2><p id="photo-description" class="sr-only"></p></div><button id="show-photo-map">On the map ↗</button></div></div>
</dialog>
<dialog id="notes-dialog" class="notes-dialog" aria-labelledby="notes-title">
  <div class="notes-top"><p class="eyebrow">THE SMALL PRINT</p><button id="close-notes" class="icon-button" aria-label="Close trip details">×</button></div><h2 id="notes-title">A week across Sicily.</h2><p class="notes-intro">Eight rides. Seven stays. ${routes.photos.length} moments along the way.</p>
  <div class="notes-stats"><strong>${totalKm} <small>km ridden</small></strong><strong>${totalClimb} <small>metres climbed</small></strong></div>
  <ul class="stay-list">${hotelRows}</ul>
  <p class="notes-fact">Enna: no pass, no €10 discount. The Palermo pickup point was closed.</p>
  <details><summary>Stay addresses & room prices</summary><div class="notes-body">${marked.parse(prose(sections[1]))}${marked.parse(sections[1].body.split('\n').filter(l=>l.startsWith('|')).join('\n'))}</div></details>
  <details><summary>Daily distance & climbing</summary><div class="notes-body">${marked.parse(sections[0].body)}</div></details>
  <details><summary>Photos, recordings & privacy</summary><div class="notes-body">${marked.parse(prose(sections[2]))}${marked.parse(sections[3].body)}</div></details>
</dialog>
<noscript><div class="no-script"><h2>Sicily Divide</h2><p>The interactive map needs JavaScript. ${totalKm} km · ${totalClimb} m climbing.</p><a href="source.md">Read the trip details</a></div></noscript>
<script type="application/json" id="site-meta">${meta}</script><script src="leaflet.js" defer></script><script src="map-gestures.js?v=${version}" defer></script><script src="app.js?v=${version}" defer></script>
</body></html>\n`;
await writeFile('public/index.html', html);
await writeFile('public/source.md', source);
console.log('Rendered map-first recap from Markdown; source SHA-256: '+digest);
