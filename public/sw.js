const CACHE_NAME = 'version-1';
const urlsToCache = ['index.html', 'offline.html']

const self = this;

// INSTALL SW
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll([...urlsToCache,
                '/',
                '/static/js/0.bundle.js',
                '/static/js/0.chunk.js',
                '/static/js/main.chunk.js',

                ]);
        })
    );
});

// LISTEN FOR REQUESTS
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            return fetch(event.request)
            .catch(() => {
                caches.match('offline.html');
            })
        })
    );
});

// ACTIVATE SW
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    return caches.delete(cacheName);
                }
            }
        ))
    ));
});