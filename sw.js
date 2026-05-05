self.addEventListener('install', e => {
  // Nicht automatisch skipWaiting – warten bis User auf "Aktualisieren" klickt
});

self.addEventListener('activate', e => clients.claim());

self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
