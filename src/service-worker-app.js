/**
 * уточнения к сервисворкеру
 */

import {precacheAndRoute} from 'workbox-precaching';


const manifest = {
  dkey: new Date().toJSON().substring(0, 10), // в отладочном режиме, обновляем cache раз в день
  stamp: Date.now(),
  channel: new BroadcastChannel('channel4'),
  parentZone() {
    return new Promise((resolve, reject) => {
      const {channel} = this;
      const receiver = (event) => {
        if(event.data.type === 'zone') {
          clearTimeout(timer);
          channel.removeEventListener('message', receiver);
          resolve(event.data.zone);
        }
      };
      channel.addEventListener('message', receiver);
      channel.postMessage({type: 'zone'});
      const timer = setTimeout(() => {
        channel.removeEventListener('message', receiver);
        reject('timeout');
      }, 5000);
    });
  },
  refresh() {
    if(this.slice && Date.now() - this.stamp < 20000) {
      return Promise.resolve(this.slice);
    }
    return this.parentZone()
      .then(zone => {
        return fetch(`/couchdb/mdm/${zone}/common`, {method: 'HEAD'});
      })
      .then(res => {
        this.stamp = Date.now();
        this.slice = JSON.parse(res.headers.get('manifest'));
        return this.slice;
      });
  }
}

export default function () {

  precacheAndRoute([
    //{url: '/couchdb/mdm/200/common', revision: dkey },
    {url: '/manifest.webmanifest', revision: null},
  ]);
}




const delimiter = '/couchdb/mdm/';
self.addEventListener('fetch', (event) => {
  const {request} = event;
  if(request.url.includes(delimiter)) {
    event.respondWith(
      caches.open('mdm.v1')
        .then((cache) => {
          const url = new URL(request.url);
          const key = url.pathname.split(delimiter)[1];

          return manifest.refresh()
            .then(() => cache.match(request, {ignoreVary: true}))
            .then((resp) => {
              if(resp) {
                if(key.includes('common')) {
                  const raw = resp.headers.get('manifest');
                  const slice = JSON.parse(raw);
                  if(manifest.slice.common[0] === slice.common[0]) {
                    return {resp, cached: true};
                  }
                }
              }
              return fetch(request)
                  .then((resp) => ({resp, cached: false}));
            })
            .then(({resp, cached}) => {
              if(cached || !key.includes('common')) {
                return resp;
              }
              return cache.put(request, resp.clone())
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
