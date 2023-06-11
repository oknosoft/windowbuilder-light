/**
 * Здесь определяем специфичные для хоста параметры
 */

(() => {
  const keys21 = {
    google: '',
    yandex: '283f550e-8184-4c84-b0e3-bdc5c1dee693',
  };

  const zone = location.host.includes('2210') ? 10 : (
    location.host.includes('2222') ? 22 : 29
  );

  const host = zone === 29 ? 'steklotorg.oknosoft.ru' : (
    zone === 22 ? 'localhost:2222' : 'steklotorg.oknosoft.ru:2210'
  );

  window._dynamic_patch_ = {

    predefined: {
      zone,
      host,
      log_level: 'warn',
      keys: keys21,
      ram_indexer: false,
    },

  };
  // при желании-необходимости, здесь можно разместить...

})();

