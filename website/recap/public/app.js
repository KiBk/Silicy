(() => {
  'use strict';
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const meta = JSON.parse($('#site-meta').textContent);
  const e = v => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const bed = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 5v15m18-9v9M3 16h18M3 9h5v7m0-5h10a3 3 0 0 1 3 3v2M3 9V7h5v4"/></svg>';
  const dialog = $('#photo-dialog'), notes = $('#notes-dialog'), preview = $('#photo-preview');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let map, data, gestures, selected = 0, photoIndex = 0, photoSequence = [], photoFocus, notesFocus, ready = false;
  const lineLayers = new Map(), hotelMarkers = new Map(), photoMarkers = new Map(), labelMarkers = new Map();
  const photoGroups = new Map();
  let photoLayer, hotelLayer, labelLayer;
  const stage = n => meta.stages[n-1];
  const route = n => data.stages[n-1];
  const euro = value => '€'+value.toLocaleString('en',{maximumFractionDigits:2,minimumFractionDigits:Number.isInteger(value)?0:2});
  const photoIcon = (p,count=1) => L.divIcon({className:'photo-pin',html:'<span class="photo-pin-inner"><img src="'+e(p.thumb)+'" alt="" loading="lazy"><b class="photo-stack-count"'+(count===1?' hidden':'')+'>'+count+'</b></span><span class="photo-stem" aria-hidden="true"></span>',iconSize:[40,42],iconAnchor:[20,60]});
  function hidePreview() { preview.hidden = true; }
  function fit() {
    if (!ready) return;
    hidePreview();
    map.invalidateSize({animate:false});
    const mobile = innerWidth <= 800;
    const dockHeight = $('.route-dock').getBoundingClientRect().height;
    const headingHeight = $('.trip-heading').getBoundingClientRect().height;
    const noteHeight = $('.ride-note').getBoundingClientRect().height;
    const bounds = L.latLngBounds(selected ? route(selected).segments.flat() : data.stages.flatMap(s=>s.segments.flat()));
    map.fitBounds(bounds, {
      paddingTopLeft: mobile ? [35,headingHeight+60] : [65,headingHeight+65],
      paddingBottomRight: mobile ? [40,dockHeight+noteHeight+75] : [90,dockHeight+80],
      maxZoom:selected ? 13 : 10, animate:false
    });
    if(selected&&!mobile){
      const note=$('.ride-note').getBoundingClientRect();
      const covered=route(selected).segments.some(line=>line.some(p=>{
        const point=map.latLngToContainerPoint(p);
        return point.x>note.left-15&&point.x<note.right+15&&point.y>note.top-15&&point.y<note.bottom+15;
      }));
      if(covered)map.fitBounds(bounds,{paddingTopLeft:[note.right+30,headingHeight+65],paddingBottomRight:[90,dockHeight+80],maxZoom:13,animate:false});
    }
  }
  function setLayers() {
    hidePreview();
    hotelLayer.clearLayers(); labelLayer.clearLayers();
    setPhotoLayer();
    for (const h of data.hotels) hotelLayer.addLayer(hotelMarkers.get(h.stage));
    if (!selected) labelMarkers.forEach(m => labelLayer.addLayer(m));
  }
  function setPhotoLayer() {
    photoLayer.clearLayers(); photoGroups.clear();
    if (map.getZoom()===undefined) return;
    // At island scale, one postcard per day keeps the actual route readable.
    // Zooming reveals individual GPS pins; nearby photos remain a browsable stack.
    const groups=[];
    for (const p of data.photos) {
      const point=map.latLngToContainerPoint([p.lat,p.lon]);
      const group=groups.find(g=>g.photos[0].stage===p.stage && (map.getZoom()<10 || g.point.distanceTo(point)<48));
      if(group)group.photos.push(p); else groups.push({point,photos:[p]});
    }
    for(const group of groups) {
      const p=group.photos[Math.floor((group.photos.length-1)/2)], marker=photoMarkers.get(p.id);
      photoGroups.set(p.id,group.photos);
      marker.setIcon(photoIcon(p,group.photos.length));
      photoLayer.addLayer(marker);
    }
  }
  function selectStage(n, {updateUrl=true, fitRoute=true}={}) {
    if (!ready) return;
    selected = n;
    $('#journey-map').classList.toggle('overview-mode',n===0);
    if (updateUrl && location.hash !== (n ? '#stage/'+n : '#the-journey')) history.pushState(null,'',n ? '#stage/'+n : '#the-journey');
    $$('[data-stage]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.stage)===n)));
    $('#all-stages').setAttribute('aria-pressed',String(n===0));
    const active = n ? $('[data-stage="'+n+'"]') : $('#all-stages');
    active.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
    lineLayers.forEach((layer,key)=>layer.setStyle({opacity:(!n || key===n) ? .95 : .12, weight:key===n ? 5 : 3.7}));
    if (n) lineLayers.get(n).bringToFront();
    map.closePopup(); setLayers();
    if (n) {
      const s=stage(n);
      $('#trip-title').textContent='Sicily Divide - Stage '+n+' - from '+s.from+' to '+s.to;
      $('#trip-dates').textContent='Day '+n+' of 8 · '+s.date;
      $('#trip-stats').innerHTML='<span><strong>'+s.km.toFixed(2)+'</strong> km</span><span>↑ <strong>'+s.ascent.toLocaleString('en')+'</strong> m</span>';
      $('#journey-map').setAttribute('aria-label','Recorded stage '+n+': '+s.from+' to '+s.to+(n===8?'. Final 500 metres hidden.':'.'));
    } else {
      $('#trip-title').textContent=meta.title;
      $('#trip-dates').textContent='8 days · '+meta.dates;
      $('#trip-stats').innerHTML='<span><strong>'+meta.totalKm+'</strong> km</span><span>↑ <strong>'+meta.totalClimb+'</strong> m</span>';
      $('#journey-map').setAttribute('aria-label','Interactive map of eight recorded Sicily rides. Private finish hidden.');
    }
    document.title=$('#trip-title').textContent;
    const note=meta.rideNotes[n];
    $('#ride-note-title').textContent=note.title;
    $('#ride-note-body').innerHTML=note.html;
    $('#ride-note-scope').textContent=n?'Stage '+n:'Overall';
    $('.ride-note').classList.remove('expanded');
    $('#expand-note').setAttribute('aria-expanded','false');
    $('#expand-note').textContent='Read more ↓';
    updateNoteOverflow();
    if (fitRoute) fit();
  }
  function updateNoteOverflow() {
    if($('.ride-note').classList.contains('expanded'))return;
    const body=$('#ride-note-body');
    const first=body.querySelector('p');
    $('#expand-note').hidden=body.children.length<=1&&body.scrollHeight<=body.clientHeight+1&&(!first||first.scrollHeight<=first.clientHeight+1);
  }
  $('#expand-note').addEventListener('click',()=>{
    const expanded=$('.ride-note').classList.toggle('expanded');
    $('#expand-note').setAttribute('aria-expanded',String(expanded));
    $('#expand-note').textContent=expanded?'Less ↑':'Read more ↓';
  });
  function openHotel(n) {
    if (!ready) return;
    if (notes.open) notes.close();
    selectStage(n,{fitRoute:false});
    const marker=hotelMarkers.get(n);
    map.setView(marker.getLatLng(),14,{animate:false});
    marker.openPopup();
  }
  function showPreview(p,marker) {
    if (!finePointer.matches || dialog.open || notes.open) return;
    $('#preview-image').src=p.thumb;
    $('#preview-stage').textContent='Stage '+p.stage+' · '+stage(p.stage).date.replace(' 2026','');
    $('#preview-title').textContent=p.title;
    preview.hidden=false;
    const point=map.latLngToContainerPoint(marker.getLatLng());
    const width=preview.offsetWidth, height=preview.offsetHeight;
    const group=photoGroups.get(p.id);
    if(group?.length>1)$('#preview-stage').textContent+=' · '+group.length+' photos';
    const x=point.x+width+40<innerWidth ? point.x+30 : point.x-width-30;
    const y=Math.min(innerHeight-height-20,Math.max(15,point.y-height/2));
    preview.style.left=Math.max(12,Math.min(innerWidth-width-12,x))+'px';
    preview.style.top=y+'px';
  }
  function openPhoto(id) {
    if (!ready) return;
    // Import IDs are assigned in capture-time order; never limit the gallery to a stack or stage.
    photoSequence=[...data.photos].sort((a,b)=>Number(a.id)-Number(b.id));
    photoIndex=photoSequence.findIndex(p=>p.id===id);
    if (photoIndex<0) { photoSequence=data.photos; photoIndex=photoSequence.findIndex(p=>p.id===id); }
    if (photoIndex<0) return;
    hidePreview(); map.closePopup(); photoFocus=document.activeElement;
    renderPhoto(); dialog.showModal(); $('#close-photo').focus();
  }
  function renderPhoto() {
    const p=photoSequence[photoIndex], s=stage(p.stage);
    $('#viewer-image').src=p.src;
    $('#viewer-image').alt=p.alt;
    $('#viewer-image').width=p.width; $('#viewer-image').height=p.height;
    $('#photo-position').textContent=String(photoIndex+1).padStart(2,'0')+' / '+photoSequence.length+' · THE JOURNEY';
    $('#photo-stage').textContent='STAGE '+p.stage+' · '+s.date.toUpperCase();
    $('#photo-title').textContent=p.title;
    $('#photo-description').textContent=p.alt;
    $('#previous-photo').disabled=photoIndex===0;
    $('#next-photo').disabled=photoIndex===photoSequence.length-1;
  }
  function stepPhoto(delta) {
    const next=photoIndex+delta;
    if (next<0 || next>=photoSequence.length) return;
    photoIndex=next; renderPhoto();
  }
  $('#close-photo').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>photoFocus?.focus?.({preventScroll:true}));
  dialog.addEventListener('click',event=>{if(event.target===dialog || event.target.classList.contains('viewer-canvas'))dialog.close();});
  $('#previous-photo').addEventListener('click',()=>stepPhoto(-1));
  $('#next-photo').addEventListener('click',()=>stepPhoto(1));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowRight'){event.preventDefault();stepPhoto(1);}
    if(event.key==='ArrowLeft'){event.preventDefault();stepPhoto(-1);}
  });
  // A swipe browses the whole journey without fighting the map underneath the modal.
  let swipeStart=null;
  $('#viewer-image').addEventListener('touchstart',event=>{if(event.touches.length===1)swipeStart=[event.touches[0].clientX,event.touches[0].clientY];},{passive:true});
  $('#viewer-image').addEventListener('touchend',event=>{
    if(!swipeStart)return;
    const point=event.changedTouches[0], dx=point.clientX-swipeStart[0], dy=point.clientY-swipeStart[1];
    if(Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.5)stepPhoto(dx>0?-1:1);
    swipeStart=null;
  },{passive:true});
  $('#show-photo-map').addEventListener('click',()=>{
    const p=photoSequence[photoIndex]; dialog.close();
    selectStage(p.stage,{fitRoute:false});
    const marker=photoMarkers.get(p.id); map.setView(marker.getLatLng(),12,{animate:false});
    // Keep this exact photo available even when it shares its GPS with another.
    if(!photoLayer.hasLayer(marker))photoLayer.addLayer(marker);
    photoFocus=marker.getElement();
    photoFocus?.focus({preventScroll:true});
    showPreview(p,marker);
  });
  function openNotes() { hidePreview(); notesFocus=document.activeElement; notes.showModal(); $('#close-notes').focus(); }
  $('#open-notes').addEventListener('click',openNotes);
  $('#close-notes').addEventListener('click',()=>notes.close());
  notes.addEventListener('close',()=>notesFocus?.focus?.({preventScroll:true}));
  notes.addEventListener('click',event=>{if(event.target===notes){const r=notes.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)notes.close();}});
  $$('[data-hotel]').forEach(b=>b.addEventListener('click',()=>openHotel(Number(b.dataset.hotel))));
  $$('[data-stage]').forEach(b=>b.addEventListener('click',()=>selectStage(Number(b.dataset.stage))));
  $('#all-stages').addEventListener('click',()=>selectStage(0));
  $('#fit-map').addEventListener('click',fit);
  $('#zoom-in').addEventListener('click',()=>map?.zoomIn());
  $('#zoom-out').addEventListener('click',()=>map?.zoomOut());
  function fromUrl() { const match=location.hash.match(/^#stage\/([1-8])$/); selectStage(match?Number(match[1]):0,{updateUrl:false}); }
  window.addEventListener('popstate',fromUrl);
  window.addEventListener('hashchange',fromUrl);
  async function init() {
    try {
      const response=await fetch('journey.json?v='+meta.version);
      if(!response.ok)throw Error('Route data unavailable');
      data=await response.json();
      if(data.stages.length!==8||data.photos.length!==meta.photoCount||data.hotels.length!==meta.hotels.length)throw Error('Incomplete route data');
      if(!window.L)throw Error('Map library unavailable');
      map=L.map('journey-map',{zoomControl:false,scrollWheelZoom:true,preferCanvas:true,zoomSnap:0,zoomDelta:1,wheelDebounceTime:16,wheelPxPerZoomLevel:36,zoomAnimation:false,fadeAnimation:!reducedMotion.matches,minZoom:5});
      gestures=window.installMapGestures(map,()=>{if(ready)setPhotoLayer();});
      const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).addTo(map);
      let errors=0;
      tiles.on('tileerror',()=>{if(++errors===3){const warning=document.createElement('div');warning.className='map-warning';warning.textContent='Basemap unavailable. Recorded routes and photos still work.';$('.map-page').append(warning);}});
      map.on('movestart zoomstart click',hidePreview);
      map.on('zoomend',()=>{if(ready&&!gestures?.isActive())setPhotoLayer();});
      photoLayer=L.layerGroup().addTo(map); hotelLayer=L.layerGroup().addTo(map); labelLayer=L.layerGroup().addTo(map);
      for(const r of data.stages) {
        const s=stage(r.stage);
        const line=L.polyline(r.segments,{color:s.color,weight:3.7,opacity:.95,smoothFactor:.4}).addTo(map);
        line.bindTooltip('Stage '+s.stage+' · '+s.from+' → '+s.to,{sticky:true,className:'map-tooltip'});
        line.on('click',()=>selectStage(s.stage)); lineLayers.set(s.stage,line);
        const points=r.segments.flat(), position=points[Math.floor(points.length*.12)];
        const label=L.marker(position,{title:'Select stage '+s.stage,icon:L.divIcon({className:'route-label',html:'<span>'+s.stage+'</span>',iconSize:[24,24],iconAnchor:[12,12]})});
        label.on('add',()=>{label.getElement().style.background=s.color;label.getElement().setAttribute('aria-label','Select stage '+s.stage);});
        label.on('click',()=>selectStage(s.stage)); labelMarkers.set(s.stage,label);
      }
      for(const h of meta.hotels) {
        const pin=data.hotels.find(p=>p.stage===h.stage);
        const marker=L.marker([pin.lat,pin.lon],{title:h.name,zIndexOffset:1000,riseOnHover:true,icon:L.divIcon({className:'hotel-pin',html:'<span class="hotel-pin-inner">'+bed+'</span>',iconSize:[28,28],iconAnchor:[14,-8]})});
        const popup=document.createElement('div');
        popup.innerHTML='<span class="popup-label">NIGHT '+h.stage+' · '+e(h.town)+'</span><h3><a href="'+e(h.url)+'" target="_blank" rel="noopener noreferrer">'+e(h.name)+' ↗</a></h3><p class="popup-price"><strong>'+euro(h.perPerson)+'</strong> <small>per person</small></p><p class="popup-room">'+e(h.room)+'</p><p class="popup-note">'+e(h.note)+'</p>';
        marker.bindPopup(popup,{maxWidth:280,autoPanPaddingTopLeft:[25,180],autoPanPaddingBottomRight:[25,190]});
        marker.on('add',()=>marker.getElement().setAttribute('aria-label','Stay · '+h.name));
        marker.on('popupopen',()=>{hidePreview();marker.getElement()?.classList.add('is-highlighted');});
        marker.on('popupclose',()=>marker.getElement()?.classList.remove('is-highlighted'));
        hotelMarkers.set(h.stage,marker);
      }
      for(const p of data.photos) {
        const marker=L.marker([p.lat,p.lon],{title:p.title,zIndexOffset:600,riseOnHover:true,icon:photoIcon(p)});
        marker.on('add',()=>{
          const element=marker.getElement(), count=photoGroups.get(p.id)?.length || 1;
          element.setAttribute('aria-label',count>1?count+' photos · stage '+p.stage+' · '+p.title:'Photo '+p.id+' · '+p.title);
          element.setAttribute('title',count>1?count+' photos · stage '+p.stage:p.title);
          element.addEventListener('focus',()=>showPreview(p,marker)); element.addEventListener('blur',hidePreview);
        });
        marker.on('mouseover',()=>showPreview(p,marker)); marker.on('mouseout',hidePreview);
        marker.on('click',()=>openPhoto(p.id)); photoMarkers.set(p.id,marker);
      }
      ready=true; $('#map-loading').hidden=true; fromUrl();
      let resizePending=false;
      new ResizeObserver(()=>{if(!resizePending){resizePending=true;requestAnimationFrame(()=>{map.invalidateSize({animate:false});hidePreview();updateNoteOverflow();resizePending=false;});}}).observe($('.map-page'));
    } catch(error) {
      $('#map-loading').hidden=false;
      $('#map-loading').textContent='Map unavailable. Open ⓘ for trip details.';
      console.warn(error.message);
    }
  }
  init();
})();
