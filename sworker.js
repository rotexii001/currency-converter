
var appCacheName = 'curconv-static-v2';
var appCacheAssets = [

                    'https://rotexii001.github.io/currency-converter/js/core/jquery.min.js',
                    'https://rotexii001.github.io/currency-converter/js/core/popper.min.js',
                    'https://free.currencyconverterapi.com/api/v5/currencies',
                    'https://rotexii001.github.io/currency-converter/js/core/bootstrap-material-design.min.js',
                    'https://rotexii001.github.io/currency-converter/alc3app.js',
                    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons',
                    'https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css',
                    'https://rotexii001.github.io/currency-converter/css/material-kit.css?v=2.0.3'
];


self.addEventListener('install', function (event) {

        console.log('install');
        event.waitUntil(
        caches.open(appCacheName).then(function (cache) {

            return cache.addAll(appCacheAssets);
        })
    );
});

/* OnActivation Install */
self.addEventListener('activate', function (event) {

    console.log('activate');

    event.waitUntil(

        caches.keys().then(function (cacheNames) {

            return Promise.all(

            cacheNames.filter(function (cacheName) {

                return cacheName.startsWith('curconv-') && cacheName !== appCacheName;

            }).map(function (cacheName) {

                return caches.delete(cacheName);
            }));
        })
    );
});

self.addEventListener('fetch', function (event) {

    console.log('fetch');

    event.respondWith(

    caches.match(event.request).then(function (response) {

        if (response) {

           return response;
        }
        return fetch(event.request);
    }));
});


self.addEventListener('message', function (event) {

    if (event.data.action == 'skipWaiting') {

        self.skipWaiting();

    }
});
