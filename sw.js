// MeuTreino: service worker. Troque a versão a cada publicação para os celulares baixarem a nova.
const V='meutreino-v5';
const APP=['/','/index.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/icon-maskable-512.png','/apple-touch-icon.png','/exercicios.json'];
const LIBS=['https://cdn.jsdelivr.net/npm/firebase@10.12.2/firebase-app-compat.js','https://cdn.jsdelivr.net/npm/firebase@10.12.2/firebase-auth-compat.js','https://cdn.jsdelivr.net/npm/firebase@10.12.2/firebase-firestore-compat.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(APP).then(()=>Promise.all(LIBS.map(u=>c.add(u).catch(()=>{}))))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET')return;
  // páginas: rede primeiro, cópia salva se estiver offline
  if(r.mode==='navigate'){e.respondWith(fetch(r).then(res=>{caches.open(V).then(c=>c.put('/index.html',res.clone()));return res}).catch(()=>caches.match('/index.html')));return}
  // arquivos do app, bibliotecas e fontes: cache primeiro, atualiza em segundo plano
  const cacheable=u.origin===location.origin||u.host==='cdn.jsdelivr.net'||u.host==='fonts.googleapis.com'||u.host==='fonts.gstatic.com';
  if(!cacheable)return; // Firebase (login e banco) sempre direto pela rede
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const c=res.clone();caches.open(V).then(x=>x.put(r,c))}return res}).catch(()=>hit);
    return hit||net;
  }));
});
