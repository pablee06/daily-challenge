// Minimal service worker — just enough to satisfy installability requirements.
// Doesn't cache anything special, so the app always loads fresh data.
self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { self.clients.claim(); });
self.addEventListener('fetch', (e) => {
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});

// Push-Benachrichtigungen: die send-push / send-daily-reminders Edge Functions
// schicken {title, body, url} als JSON-Payload.
self.addEventListener('push', (e) => {
  let data = { title: 'Daily Challenge', body: '', url: '/' };
  try { if (e.data) data = { ...data, ...e.data.json() }; } catch (err) { /* keine JSON-Payload, Defaults nutzen */ }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      data: { url: data.url || '/' },
    })
  );
});

// Klick auf die Benachrichtigung: vorhandenes App-Fenster fokussieren statt ein neues zu öffnen
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const targetUrl = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsArr) => {
      for (const client of clientsArr) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
