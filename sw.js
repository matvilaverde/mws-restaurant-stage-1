// If the file is used, registry was successful
console.log("Service Worker registry successful!");

const cacheFiles = [ // Stores all required files in a vector
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js',
    '/data',
    '/img'
]

// On install, caches current version and updates on the vector
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open('v1')
        .then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request) // Compares current cache with online one
        .then(function(response) {
            if(response) { // If there is a response, returns it 
                console.log('Found ' + e.request + ' in cache');
                return response;
            } else { // If there's no response, use the cached one
                console.log('Could not find ' + e.request + ' in cache, FETCHING!');
                return fetch(e.request)
                .then(function(response) {
                    const clonedResponse = response.clone(); // Clones response so it isn't used twice

                    caches.open('v1')
                    .then(function(cache) {
                        cache.put(e.request, clonedResponse);
                    })
                    return response;
                })
                .catch(function(err) {
                    console.log(err);
                })
            }
        })
    );
});