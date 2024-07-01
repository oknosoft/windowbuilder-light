
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              config?.onUpdate?.(registration);
            }
            else {
              config?.onSuccess?.(registration);
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    if(process.env.NODE_ENV === 'development') {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
    else {
      registerValidSW('/service-worker.js', {
        onUpdate(registration) {
          // At this point, the updated precached content has been fetched,
          // but the previous service worker will still serve the older
          // content until all client tabs are closed.
          console.log(
            'New content is available and will be used when all ' +
            'tabs for this page are closed. See https://cra.link/PWA.'
          );
          alert('Код программы обновлён, необходимо перезагрузить страницу');
          location.reload();
        },
        onSuccess(registration) {
          // At this point, everything has been precached.
          // It's the perfect time to display a
          // "Content is cached for offline use." message.
          console.log('Content is cached for offline use.');
        }
      });
    }
  });
}
