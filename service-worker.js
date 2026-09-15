// Minimal service worker — just enough to satisfy installability requirements.
// Doesn't cache anything special, so the app always loads fresh data.
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
