/* Facts are rendered from Markdown; routes.json supplies GPX geometry only. */
(() => {
  'use strict';
  if ('scrollRestoration' in history) history.scrollRestoration='manual';
  const $ = s => document.querySelector(s), meta = JSON.parse($('#site-meta').textContent);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#b24e34','#ce923c','#697c3d','#24685d','#62598c','#3e749b','#b75d7c','#3c595c'];
  // Approximate public town references. Never join them to invent a route.
  const towns = [['Palermo',38.11366,13.3661],['Gibellina',37.80874,12.8684],['Sambuca',37.64781,13.1115],['Santo Stefano',37.62457,13.4911],['Montedoro',37.45516,13.81556],['Enna',37.5665,14.2752],['Regalbuto',37.6524,14.6373],['Catania',37.50253,15.08714],['Modica',36.8588,14.7614]];
  const buttons = [...document.querySelectorAll('[data-stage]')], panels = [...document.querySelectorAll('[data-stage-panel]')];
  let selected = 0, map, routes = [], layer, animations = [], ready = false;
  const motion = () => $('#motion').checked && !reduced.matches;
  $('#motion').checked = !reduced.matches;
  function cancelAnimations() { animations.forEach(a=>a.cancel()); animations=[]; }
  reduced.addEventListener('change',()=>{ $('#motion').checked=!reduced.matches; if(reduced.matches) cancelAnimations(); });
  $('#motion').addEventListener('change',()=>{if(!motion()) cancelAnimations();});
  const menu=$('[data-site-menu]'), menuButton=$('[data-menu-toggle]');
  function closeMenu(){ menu.hidden=true; menuButton.setAttribute('aria-expanded','false'); }
  menuButton.addEventListener('click',()=>{menu.hidden=!menu.hidden;menuButton.setAttribute('aria-expanded',String(!menu.hidden));});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuButton.focus();}});
  $('[data-print]').addEventListener('click',()=>window.print());
  $('[data-share]').addEventListener('click',async e=>{try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);e.target.textContent='Link copied';}}catch{e.target.textContent='Copy the address bar link';}});
  document.querySelectorAll('a[href^="http"]').forEach(a=>{a.target='_blank';a.rel='noopener noreferrer';});
  function pin(point,text,color,label=''){
    const marker=L.marker(point,{interactive:false,keyboard:false,icon:L.divIcon({className:'route-pin',html:`<span style="--pin-color:${color}">${text}</span>`,iconSize:[30,30],iconAnchor:[15,15]})}).addTo(layer);
    if(label)marker.bindTooltip(label,{permanent:true,direction:'bottom',offset:[0,17],className:'route-town'});
  }
  function draw(route,color,animate){
    const path=L.polyline(route.segments,{color,weight:selected?5:3.5,smoothFactor:0,noClip:true,interactive:false,lineCap:'round',lineJoin:'round'}).addTo(layer);
    if(animate&&motion())requestAnimationFrame(()=>{const el=path.getElement();if(!el?.isConnected)return;const len=el.getTotalLength();animations.push(el.animate([{strokeDasharray:`${len} ${len}`,strokeDashoffset:len},{strokeDasharray:`${len} ${len}`,strokeDashoffset:0}],{duration:selected?1900:2300,easing:'ease-in-out'}));});
  }
  function renderMap(animate=true){
    if(!map||!ready)return;
    cancelAnimations();layer.clearLayers();map.invalidateSize({animate:false});
    const route=routes.find(r=>r.stage===selected),exact=route?.status==='exact';
    const bounds=selected&&exact?L.latLngBounds(route.segments.flat()):selected?L.latLngBounds([towns[selected-1].slice(1),towns[selected].slice(1)]):L.latLngBounds(towns.map(t=>t.slice(1)));
    map.fitBounds(bounds,{padding:[42,58],animate:false,maxZoom:selected?12:9});
    if(selected&&exact){draw(route,colors[selected-1],animate);pin(route.segments[0][0],'S',colors[selected-1],'Course start');pin(route.segments.at(-1).at(-1),'F',colors[selected-1],'Course finish');}
    else if(selected){pin(towns[selected-1].slice(1),'S',colors[selected-1],towns[selected-1][0]);pin(towns[selected].slice(1),'F',colors[selected-1],towns[selected][0]);}
    else{routes.filter(r=>r.status==='exact').forEach(r=>draw(r,colors[r.stage-1],animate));towns.forEach((t,i)=>pin(t.slice(1),i?String(i):'S',i?colors[i-1]:'#1e332f',t[0]));}
    $('#map-message').hidden=!selected||exact;
    $('#map-message').textContent='GPX pending. Town markers only—not a cycling route.';
    $('#map-caption').textContent=selected?`${String(selected).padStart(2,'0')} / ${meta.stages[selected-1].title}`:"Fausto's courses · 5–12 October";
    $('#map-status').textContent=selected?(exact?`Exact GPX · ${route.pointCount.toLocaleString('en')} points`:'GPX pending · town markers only'):`${routes.filter(r=>r.status==='exact').length} / 8 exact tracks imported`;
    $('#stage-map').setAttribute('aria-label',selected?`Stage ${selected}: ${meta.stages[selected-1].title}. ${exact?'Exact imported GPX track.':'Town references only; exact track unavailable.'}`:'Sicily journey overview. Only imported tracks are drawn.');
  }
  function select(n,scroll=false){
    selected=n;$('#stage-select').value=String(n);panels.forEach(p=>{p.hidden=Number(p.dataset.stagePanel)!==n;});$('#overview-panel').hidden=n!==0;
    $('.stage-details').scrollTop=0;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.stage)===n)));$('#overview').setAttribute('aria-pressed',String(n===0));
    $('#previous').disabled=n===0;$('#next').disabled=n===8;
    $('#selection-summary').textContent=n?`Stage ${n} of 8 · ${meta.stages[n-1].date}`:'Choose one of the eight stages';
    $('.route-explorer').style.setProperty('--stage-color',colors[Math.max(0,n-1)]);
    if(ready)renderMap();if(scroll)scrollToStage();
  }
  function scrollToStage(){
    // Avoid smooth-scroll/focus races and native restoration on direct links.
    const top=$('.route-explorer').getBoundingClientRect().top+window.scrollY-$('.site-header').getBoundingClientRect().height-12;
    window.scrollTo({top:Math.max(0,top),behavior:'instant'});
  }
  function go(n){const hash=n?`#stage/${n}`:'#the-eight-stages';if(location.hash!==hash)history.pushState(null,'',hash);select(n,true);}
  function fromUrl(scroll=false){const m=location.hash.match(/^#stage\/([1-8])$/);if(m)select(Number(m[1]),scroll);else if(['#the-eight-stages','#top',''].includes(location.hash))select(0,false);}
  buttons.forEach(b=>b.addEventListener('click',()=>go(Number(b.dataset.stage))));$('#overview').addEventListener('click',()=>go(0));
  $('#stage-select').addEventListener('change',e=>go(Number(e.target.value)));
  $('#previous').addEventListener('click',()=>go(Math.max(0,selected-1)));$('#next').addEventListener('click',()=>go(Math.min(8,selected+1)));$('#replay').addEventListener('click',()=>renderMap(true));
  window.addEventListener('popstate',()=>fromUrl(true));window.addEventListener('hashchange',()=>fromUrl(true));fromUrl(false);
  window.addEventListener('pageshow',()=>{if(/^#stage\/[1-8]$/.test(location.hash))requestAnimationFrame(scrollToStage);});
  async function init(){
    try{
      const response=await fetch(`/routes.json?v=${meta.assetVersion}`);if(!response.ok)throw Error('Route data unavailable');routes=(await response.json()).routes;
      for(const r of routes){const link=$(`[data-gpx="${r.stage}"]`),note=$(`[data-track-note="${r.stage}"]`);note.textContent=r.status==='exact'?'Hotel link: last-mile destination.':'Stops: candidates until GPX checked.';if(r.status==='exact'){link.href=`/${r.gpx}`;link.hidden=false;}}
      if(typeof L==='undefined')throw Error('Map library unavailable');
      map=L.map('stage-map',{zoomControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,boxZoom:false,keyboard:false,zoomAnimation:false,fadeAnimation:false});
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'}).addTo(map);
      let failures=0;tiles.on('tileerror',()=>{if(++failures===3){const p=document.createElement('p');p.className='tile-warning';p.textContent='Base map unavailable; the GPX line is still shown. Download GPX for offline navigation.';$('.map-frame').append(p);}});
      layer=L.layerGroup().addTo(map);ready=true;renderMap();let observed=false;new ResizeObserver(()=>{if(observed)renderMap(false);observed=true;}).observe($('.map-frame'));
    }catch(error){$('#map-message').hidden=false;$('#map-message').textContent='Map could not load. All addresses and Garmin links remain available in the stage cards.';$('#map-status').textContent='Map unavailable';console.warn(error.message);}
    if(/^#stage\/[1-8]$/.test(location.hash))requestAnimationFrame(()=>requestAnimationFrame(scrollToStage));
  }
  init();
})();
