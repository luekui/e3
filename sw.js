const CACHE = 'e3-v3';

self.addEventListener('install', e => {
  // Warten bis User auf "Aktualisieren" klickt
});

self.addEventListener('activate', e => {
  // Alte Caches löschen
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first: immer frisch laden, Cache nur als Fallback
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
