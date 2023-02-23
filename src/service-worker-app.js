/**
 * уточнения к сервисворкеру
 */

import {precacheAndRoute} from 'workbox-precaching';

// в отладочном режиме, обновляем cache раз в день
const dkey = new Date().toJSON().substring(0, 10);

export default function () {

  // precacheAndRoute([
  //   {url: '/couchdb/mdm/200/common', revision: dkey },
  //   //{url: '/styles/app.0c9a31.css', revision: null},
  // ]);
}

const delimiter = '/couchdb/mdm';
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if(url.pathname.startsWith(delimiter)) {
    event.respondWith(
      caches.open('mdm.v1')
        .then((cache) => {
          const key = url.pathname.split(delimiter)[1];

          return cache.match(event.request, {ignoreVary: true})
            .then((resp) => {
              return resp ? {resp, cached: true} : fetch(event.request)
                .then((resp) => {
                  return {resp, cached: false};
                });
            })
            .then(({resp, cached}) => {
              if(cached) {
                return resp;
              }
              return cache.put(event.request, resp.clone())
                .then(() => {
                  return resp;
                });
            })
            .catch((err) => {
              throw err;
            });
        }));
  }
});
