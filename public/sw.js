const CACHE_NAME = 'noviachat-cache-v1';
const urlsToCache = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  // Add more URLs or assets to cache as needed
];

self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
          })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
      caches.match(event.request)
          .then(response => {
            // Return cached response if available
            if (response) {
              return response;
            }
            return fetch(event.request);
          })
  );
});

