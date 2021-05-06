var CACHE_NAME = 'sass-in-browser-cache-v1';

self.importScripts('/node_modules/sass.js/dist/sass.sync.js');

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});


self.addEventListener('fetch', function(event) {
    console.log(event.request.url)
    if (!event.request.url.endsWith('scss')) return event.respondWith(fetch(event.request))
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          return fetch(event.request).then((res) => res.text()).then(scss => {
            return new Promise((res) => {
              Sass.compile(scss, (result) => res(result.text)) 
            }).then((css) => {
              const headers = new Headers();
              headers.append('content-type', 'text/css')
              caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, new Response(css, { headers }));
              });
              return new Response(css, { headers });
            });
          })
        })
      );
  });