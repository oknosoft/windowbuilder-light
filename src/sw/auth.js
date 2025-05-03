
export function getAuth(mdm) {

  return {
    delimiter: '/auth/couchdb',

    respond(event) {
      event.respondWith(new Promise((resolve, reject) => {
        const {request} = event;
        const {url} = request;
        const {cache} = mdm;
        if(navigator.onLine) {
          fetch(request)
            .then((resp) => cache.put(url, resp.clone())
              .then(() => resolve(resp)))
            .catch(reject);
        }
        else {
          cache.match(url).then(resolve).catch(reject);
        }
      }));
    }
  };
}
