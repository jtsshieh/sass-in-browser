var CACHE_NAME = 'sass-in-browser-cache-v1';

self.importScripts('/node_modules/sass.js/dist/sass.sync.js');

self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // Cache hit - return response
          if (response) {
            return response;
          }

          if (event.request.url.endsWith('scss')) {
              return fetch(event.request).then((res) => res.text()).then(scss => {
                return new Promise((res) => {
                  Sass.compile(scss, (result) => res(result.text)) 
                }).then((css) => {
                  caches.open(CACHE_NAME)
                  .then(function(cache) {
                    cache.put(event.request, new Response(css));
                  });
                  return new Response(css);
                });
              })
          }
  
          return fetch(event.request).then(
            function(response) {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
  
              // IMPORTANT: Clone the response. A response is a stream
              // and because we want the browser to consume the response
              // as well as the cache consuming the response, we need
              // to clone it so we have two streams.
              var responseToCache = response.clone();
  
              caches.open(CACHE_NAME)
                .then(function(cache) {
                  cache.put(event.request, responseToCache);
                });
  
              return response;
            }
          );
        })
      );
  });