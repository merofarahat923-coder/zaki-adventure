const CACHE='zaki-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./ps2p.woff2','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-192.png','./icons/maskable-512.png','./icons/apple-touch-icon.png','./icons/favicon-32.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==location.origin)return;
  if(req.mode==='navigate'||url.pathname.endsWith('/')||url.pathname.endsWith('.html')){
    // network first for the page so updates arrive, cache fallback for offline
    e.respondWith(fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put('./index.html',c));return r;}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(m=>m||fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put(req,c));return r;})));
});
