// install event handler
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('static').then(cache => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/index.html',
        '/index.js',
        '/indexedDb.js',
        '/styles.css',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
        'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        'https://cdn.jsdelivr.net/npm/chart.js@2.8.0'
      ]);
    })
  );
  console.log('Install');
  self.skipWaiting();
});

// retrieve assets from cache
self.addEventListener('fetch', event => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});
