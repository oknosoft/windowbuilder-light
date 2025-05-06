
export function getAuth(mdm) {

  return {
    delimiter: '/auth/couchdb',

    match(url) {
      return url.includes(this.delimiter) || url.endsWith(`/couchdb/wb_${mdm.zone}_doc/`);
    },

    respond(event) {
      event.respondWith(mdm.openCache()
        .then((cache) => new Promise((resolve, reject) => {
          const {request} = event;
          const {url} = request;
          if(navigator.onLine) {
            fetch(request)
              .then((resp) => cache.put(url, resp.clone())
                .then(() => resolve(resp)))
              .catch(reject);
          }
          else {
            cache.match(url).then(resolve).catch(reject);
          }
        })));
    }
  };
}
