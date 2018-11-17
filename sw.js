// Installing Service Worker
const cacheName = 'amn-rest-v1';

const cachedURLs = [
  '/',
  '/css/styles.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',
  '/index.html',
  '/restaurant.html',
  ];

// Adding images path to cached memory
for (let i = 1; i <= 10; i++) {
  cachedURLs.push(`/img/${i}.jpg`);
}

self.addEventListener('install', function(event) {
  // Opening cache for selected URLs
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        console.log('files added to cache');
        return cache.addAll(cachedURLs);
      })
  );
});

// Cache and Return requests

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }

        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            var responseToCache = response.clone();

            caches.open(cacheName)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Update Cache

self.addEventListener('activate', function(event) {
  console.log('SW updated');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cache) {
          if (cache !== cacheName) {
            console.log('Clearing old cahed');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});