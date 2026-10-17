/* Desktop trackpad pinch: WebKit GestureEvent and Chromium/Firefox ctrl+wheel.
   Only the map intercepts gestures; browser zoom elsewhere and native touch remain intact. */
window.installMapGestures = function installMapGestures(map, onEnd) {
  const element=map.getContainer();
  let active=false, safari=false, frame=null, timer=null, target=0, base=0, anchor=null;
  let lastPointer=null;
  const fine=()=>matchMedia('(pointer: fine)').matches;
  const clamp=z=>Math.max(map.getMinZoom(),Math.min(map.getMaxZoom(),z));
  const position=event=>{
    const rect=element.getBoundingClientRect();
    return map.mouseEventToContainerPoint({clientX:Number.isFinite(event.clientX)?event.clientX:(lastPointer?.x??rect.left+rect.width/2),clientY:Number.isFinite(event.clientY)?event.clientY:(lastPointer?.y??rect.top+rect.height/2)});
  };
  function apply(){ frame=null; map.setZoomAround(anchor,clamp(target),{animate:false}); }
  function schedule(){ if(frame===null)frame=requestAnimationFrame(apply); }
  function begin(event){
    if(!active){map.stop();active=true;target=map.getZoom();}
    anchor=position(event);
  }
  function finish(){
    clearTimeout(timer);timer=null;
    if(frame!==null){cancelAnimationFrame(frame);apply();}
    if(!active)return;
    active=false;safari=false;onEnd();
  }
  function wheel(event){
    if(!fine()||!event.ctrlKey)return;
    event.preventDefault();event.stopImmediatePropagation();
    // WebKit can emit wheel events alongside GestureEvents; do not count both.
    if(safari)return;
    begin(event);
    const pixels=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?element.clientHeight:1);
    target=clamp(target-pixels/72);
    schedule();clearTimeout(timer);timer=setTimeout(finish,140);
  }
  function gestureStart(event){
    if(!fine())return;
    event.preventDefault();event.stopImmediatePropagation();
    begin(event);safari=true;base=map.getZoom();
  }
  function gestureChange(event){
    if(!safari||!Number.isFinite(event.scale)||event.scale<=0)return;
    event.preventDefault();event.stopImmediatePropagation();
    target=clamp(base+Math.log2(event.scale)*1.4);
    schedule();clearTimeout(timer);timer=setTimeout(finish,300);
  }
  function gestureEnd(event){if(safari){event.preventDefault();event.stopImmediatePropagation();finish();}}
  function pointer(event){lastPointer={x:event.clientX,y:event.clientY};}
  const bindings=[['wheel',wheel],['gesturestart',gestureStart],['gesturechange',gestureChange],['gestureend',gestureEnd]];
  bindings.forEach(([name,handler])=>element.addEventListener(name,handler,{capture:true,passive:false}));
  element.addEventListener('mousemove',pointer,{passive:true});
  return {isActive:()=>active,destroy(){finish();bindings.forEach(([name,handler])=>element.removeEventListener(name,handler,true));element.removeEventListener('mousemove',pointer);}};
};
