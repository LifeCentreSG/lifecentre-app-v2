// Offline helper. Tolerates a failed file and bypasses the HTTP cache on install,
// so an old cached redirect from the GoDaddy days cannot break it.
const CACHE = 'lc-v2-shell-1';
const FILES = ['./', 'index.html', 'styles.css', 'data.js', 'api.js', 'app.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(FILES.map(async (f) => {
      try { await cache.add(new Request(f, { cache: 'reload' })); } catch (err) { /* skip a failed file */ }
    }));
    self.skipWaiting();
  })());
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((r) => {
    const copy = r.clone();
    caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request).then((m) => m || caches.match('index.html'))));
});
