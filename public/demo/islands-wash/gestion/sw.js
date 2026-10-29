/* Service worker : appli utilisable hors ligne + affichage des notifications */
const CACHE = 'iw-gestion-v1';
const FILES = ['./index.html', './manifest.webmanifest', '../assets/data.js', '../assets/icon-192.png', '../assets/icon-512.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
/* Version finale : le serveur enverra ici les notifications « push » (nouvelle réservation, paiement reçu) */
self.addEventListener('push', e => {
  let d = {}; try { d = e.data.json(); } catch (_) { d = { title: 'ISLANDS WASH', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Nouvelle réservation', { body: d.body || '', icon: '../assets/icon-192.png', badge: '../assets/icon-192.png', tag: d.tag || 'iw' }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window' }).then(l => l.length ? l[0].focus() : self.clients.openWindow('index.html')));
});
