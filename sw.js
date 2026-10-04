// Bento service worker: makes the app open and work with no connection.
const VERSION = 'bento-v1';
const SHELL = ['./', 'index.html', 'css/app.css', 'js/app.js', 'js/core.js', 'js/scan.js', 'data/foods.json',
  'fonts/bricolage.woff2', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // product lookups go straight to the network
  const big = /\/(vendor|data|fonts)\//.test(url.pathname);
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const hit = await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await cache.match('index.html') : null);
    const refresh = () => fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; });
    if (hit) {
      if (!big) e.waitUntil(refresh().catch(() => {}));   // quietly pick up new versions of the app's own files
      return hit;
    }
    try { return await refresh(); }
    catch { return new Response('Offline', { status: 503, statusText: 'Offline' }); }
  })());
});
