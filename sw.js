const CACHE = 'meem-glow-v1';
const ASSETS = ['./','./index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html')))
  );
});

// ── NOTIFICATION HANDLER ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window'}).then(cs => {
    if(cs.length) return cs[0].focus();
    return clients.openWindow('./');
  }));
});

self.addEventListener('push', e => {
  const d = e.data ? e.data.json() : {title:'Meem Glow',body:'Time for your routine!'};
  e.waitUntil(self.registration.showNotification(d.title, {
    body: d.body,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    vibrate: [300,100,300],
    tag: d.tag || 'meem-glow',
    renotify: true,
  }));
});
