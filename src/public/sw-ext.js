/**
 * ### Расщирение сервисворкера
 *
 * @module sw-ext
 *
 * Created by Evgeniy Malyarov on 16.09.2018.
 */

self.__precacheManifest = (self.__precacheManifest || []).concat([
  {
    "revision": "0000",
    "url": "/light/favicon.ico"
  },
  {
    "revision": "0000",
    "url": "/light/imgs/splash.gif"
  },
]);

self.addEventListener('sync', (event) => {
  if (event.tag == 'reload') {
    event.waitUntil(reloadStuff());
  }
});

// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);
//   if(url.pathname === '/' || url.pathname.startsWith('/index')) {
//     event.respondWith(
//       fetch(event.request)
//     );
//   }
//   else if(url.pathname.startsWith('/couchdb/mdm')) {
//     event.respondWith(
//       caches.open('mdm')
//         .then((cache) => {
//           // если есть в кеше - проверяем версию
//           return cache.match(event.request)
//             .then((resp) => resp || fetch(event.request))
//             .then((resp) => {
//               let responseClone = resp.clone();
//               cache.put(event.request, responseClone);
//               return resp;
//             })
//             .catch((err) => {
//               throw err;
//             });
//       }));
//   }
// });

function reloadStuff() {
  return Promise.resolve();
}
