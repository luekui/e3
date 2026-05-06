const CACHE = 'e3-v4';
const ASSETS = [
  '/e3/',
  '/e3/index.html',
  '/e3/manifest.json',
  '/e3/icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  // Nicht automatisch skipWaiting – warten bis User auf "Aktualisieren" klickt
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      // HTML immer network-first (damit Updates ankommen)
      if (e.request.url.indexOf('.html') >= 0 || e.request.url.endsWith('/e3/')) {
        return fetch(e.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return response;
        }).catch(() => cached);
      }
      // Alles andere: cache-first
      return cached || fetch(e.request);
    })
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
